"""
Pytest-benchmark harness for xwlazy lazy-loading scenarios.
"""

from __future__ import annotations

import pytest

# Mark all tests in this file as core and performance tests
pytestmark = [
    pytest.mark.xwlazy_core,
    pytest.mark.xwlazy_performance,
]

import importlib
import os
import subprocess
import sys
import time
import types
from contextlib import suppress
from pathlib import Path

import pytest

pytest.importorskip("pytest_benchmark")

PROJECT_ROOT = Path(__file__).resolve().parents[4]
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from exonware.xwlazy import (  # noqa: E402
    DependencyMapper,
    LazyInstaller,
    LazyLoader,
    LazyMetaPathFinder,
    PackageManifest,
)

ASYNC_SAMPLE_NAME = "xwlazy-async-sample"
ASYNC_SAMPLE_PATH = Path(__file__).resolve().parents[3] / "tests" / "resources" / "async_package"


def _pip_uninstall(package: str) -> None:
    with suppress(Exception):
        subprocess.run(
            [sys.executable, "-m", "pip", "uninstall", "-y", package],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
        )


def _pip_install_from_path(package_path: Path) -> bool:
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "--no-deps", str(package_path)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )
    return result.returncode == 0


def _parse_lazy_package_env() -> tuple[str, ...]:
    """
    Resolve which packages/tests should be force-uninstalled before benchmarks.

    The default covers the synthetic module used in benchmarks to validate the
    lazy installer. Users can extend the list via the
    XWLAZY_BENCHMARK_PACKAGES environment variable (comma-separated).
    """

    env_value = os.environ.get("XWLAZY_BENCHMARK_PACKAGES", "")
    if env_value.strip():
        packages = tuple(
            pkg.strip()
            for pkg in env_value.split(",")
            if pkg.strip()
        )
        if packages:
            return packages
    return ("xw_missing_module",)


def _purge_module_state(module_name: str) -> None:
    """
    Remove a module and its namespace children from sys.modules.

    Treat this as the safest cross-platform equivalent of uninstalling the
    package within the confines of the benchmark environment.
    """

    for name in list(sys.modules):
        if name == module_name or name.startswith(f"{module_name}."):
            sys.modules.pop(name, None)


def _force_uninstall(packages: tuple[str, ...]) -> None:
    """
    Ensure the provided packages are unavailable prior to running benchmarks.

    We avoid shelling out to pip because the benchmarks rely on deterministic,
    simulated installs; clearing module state is sufficient to force the lazy
    importer down the cold path.
    """

    if not packages:
        return

    for package_name in packages:
        _purge_module_state(package_name)

    importlib.invalidate_caches()


@pytest.fixture(scope="session")
def lazy_benchmark_packages() -> tuple[str, ...]:
    """
    Central definition of packages that should be unavailable during tests.

    The list is intentionally overridable via XWLAZY_BENCHMARK_PACKAGES so
    benchmark authors can point at real third-party dependencies when desired.
    """

    return _parse_lazy_package_env()


@pytest.fixture(autouse=True)
def uninstall_lazy_benchmark_packages(lazy_benchmark_packages):
    """
    Autouse fixture that enforces the "packages must be missing" contract.

    This runs before and after every benchmark to keep the environment clean
    even if a test (or the lazy installer) ends up importing the package.
    """

    _force_uninstall(lazy_benchmark_packages)
    yield
    _force_uninstall(lazy_benchmark_packages)


@pytest.fixture(scope="session")
def sample_payload():
    return {
        "id": 101,
        "name": "benchmark",
        "values": list(range(50)),
        "meta": {"enabled": True, "tags": ["lazy", "benchmark"]},
    }


def test_import_hook_noop_latency(benchmark):
    """
    Measure the overhead of the meta path finder when no prefixes match.
    """

    finder = LazyMetaPathFinder("benchmark")

    def run():
        return finder.find_spec("collections")

    benchmark(run)


def test_serialization_lazy_loader(benchmark, sample_payload):
    """
    Measure LazyLoader throughput for a warmed JSON serializer.
    """

    loader = LazyLoader("json")
    module = loader.load_module()

    def run():
        encoded = module.dumps(sample_payload)
        module.loads(encoded)

    benchmark(run)


@pytest.fixture
def prepared_installer(monkeypatch):
    """
    Provide a LazyInstaller that will not hit the network.
    """

    installer = LazyInstaller("benchmark")
    installer.enable()

    call_state = {"attempts": 0}

    real_import_module = importlib.import_module

    def fake_import(name, package=None):
        if name == "xw_missing_module" and call_state["attempts"] == 0:
            call_state["attempts"] += 1
            raise ImportError("forced failure")
        if name == "xw_missing_module":
            module = types.SimpleNamespace(__name__=name, sentinel=True)
            return module
        return real_import_module(name, package=package)

    def fake_install(package_name: str, module_name: str | None = None) -> bool:
        time.sleep(0.0005)
        return True

    monkeypatch.setattr(importlib, "import_module", fake_import)
    installer._dependency_mapper = types.SimpleNamespace(get_package_name=lambda _: "xw_missing_module")  # noqa: SLF001
    monkeypatch.setattr(installer, "install_package", fake_install)

    yield installer

    monkeypatch.setattr(importlib, "import_module", real_import_module)


def test_forced_install_flow(benchmark, prepared_installer):
    """
    Measure the cost of a forced install flow (simulated).
    """

    def run():
        prepared_installer.install_and_import("xw_missing_module")

    benchmark(run)


def test_dependency_mapper_warmup(benchmark):
    """
    Measure cache warm-up for dependency discovery.
    """

    mapper = DependencyMapper("benchmark")

    def run():
        for name in ("json", "collections", "pathlib", "typing"):
            mapper.get_package_name(name)

    benchmark(run)


def test_async_install_real_pip(benchmark):
    """
    Measure schedule→ready time for real pip installs running in the async queue.
    """

    installer = LazyInstaller("benchmark")
    installer.enable()
    installer.apply_manifest(
        PackageManifest(
            package="benchmark",
            dependencies={"xw_async_stub": str(ASYNC_SAMPLE_PATH)},
            async_installs=True,
            async_workers=2,
        )
    )
    installer._dependency_mapper = types.SimpleNamespace(  # noqa: SLF001
        get_package_name=lambda _: str(ASYNC_SAMPLE_PATH)
    )

    def run():
        _pip_uninstall(ASYNC_SAMPLE_NAME)
        handle = installer.schedule_async_install("xw_async_stub")
        assert handle is not None
        assert handle.wait(timeout=180.0) is True
        module = importlib.import_module("xwlazy_async_sample")
        assert module.ping() == "pong"
        _pip_uninstall(ASYNC_SAMPLE_NAME)

    benchmark.pedantic(run, rounds=3, iterations=1)

