"""
Unit tests for manifest loader integration, async queue, and hook short-circuiting.
"""

from __future__ import annotations

import json
import sys
import time
import types
import zipfile
from pathlib import Path

import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[4]
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from xwlazy.lazy import manifest as manifest_module  # noqa: E402
import xwlazy.lazy.lazy_core as lazy_core_module  # noqa: E402
from xwlazy.lazy.lazy_core import (  # noqa: E402
    AsyncInstallHandle,
    DependencyMapper,
    LazyInstaller,
    WatchedPrefixRegistry,
    sync_manifest_configuration,
)
from xwlazy.lazy.manifest import LazyManifestLoader, PackageManifest  # noqa: E402


def test_manifest_loader_reads_pyproject_and_json(tmp_path, monkeypatch):
    project_root = tmp_path
    manifest_path = project_root / "xwlazy.manifest.json"
    manifest_path.write_text(
        json.dumps(
            {
                "dependencies": {"custom": "custom-pkg"},
                "watched_prefixes": ["my.pkg."],
                "packages": {
                    "demo": {
                        "dependencies": {"demo-dep": "demo-pkg"},
                        "async_installs": True,
                        "async_workers": 2,
                    }
                },
            }
        ),
        encoding="utf-8",
    )

    loader = LazyManifestLoader(package_roots={"demo": project_root})
    manifest = loader.get_manifest("demo")

    assert manifest is not None
    assert manifest.dependencies["demo-dep"] == "demo-pkg"
    assert manifest.async_installs is True
    assert manifest.async_workers == 2

    # Update JSON to ensure cache invalidation works
    manifest_path.write_text(
        json.dumps({"packages": {"demo": {"dependencies": {"later": "new"}}}}),
        encoding="utf-8",
    )

    loader.clear_cache()
    manifest = loader.get_manifest("demo")
    assert manifest is not None
    assert manifest.dependencies["later"] == "new"


def test_dependency_mapper_prefers_manifest(tmp_path, monkeypatch):
    project_root = tmp_path
    (project_root / "xwlazy.manifest.json").write_text(
        json.dumps({"packages": {"demo": {"dependencies": {"special": "mapped"}}}}),
        encoding="utf-8",
    )

    loader = LazyManifestLoader(package_roots={"demo": project_root})
    monkeypatch.setattr(manifest_module, "get_manifest_loader", lambda: loader)
    monkeypatch.setattr(lazy_core_module, "get_manifest_loader", lambda: loader)

    mapper = DependencyMapper("demo")
    assert mapper.get_package_name("special") == "mapped"


def test_manifest_shared_dependencies_isolated_per_package(tmp_path):
    project_root = tmp_path
    (project_root / "xwlazy.manifest.json").write_text(
        json.dumps(
            {
                "packages": {
                    "alpha": {"dependencies": {"only_alpha": "pkg-alpha"}},
                    "beta": {"dependencies": {"only_beta": "pkg-beta"}},
                }
            }
        ),
        encoding="utf-8",
    )

    loader = LazyManifestLoader(package_roots={"alpha": project_root, "beta": project_root})
    manifest_alpha = loader.get_manifest("alpha")
    manifest_beta = loader.get_manifest("beta")

    assert manifest_alpha is not None and manifest_beta is not None

    sig_alpha = loader.get_manifest_signature("alpha")
    sig_beta = loader.get_manifest_signature("beta")

    shared_alpha = loader.get_shared_dependencies("alpha", sig_alpha)
    shared_beta = loader.get_shared_dependencies("beta", sig_beta)

    assert shared_alpha == {"only_alpha": "pkg-alpha"}
    assert shared_beta == {"only_beta": "pkg-beta"}


def test_class_wrap_prefixes_register_hints(tmp_path, monkeypatch):
    project_root = tmp_path
    (project_root / "xwlazy.manifest.json").write_text(
        json.dumps(
            {
                "packages": {
                    "wrapdemo": {
                        "dependencies": {"foo": "bar"},
                        "wrap_class_prefixes": ["serializer", "encoder"],
                    }
                }
            }
        ),
        encoding="utf-8",
    )

    loader = LazyManifestLoader(package_roots={"wrapdemo": project_root})
    monkeypatch.setattr(manifest_module, "get_manifest_loader", lambda: loader)
    monkeypatch.setattr(lazy_core_module, "get_manifest_loader", lambda: loader)

    lazy_core_module.sync_manifest_configuration("wrapdemo")
    try:
        hints = lazy_core_module._get_package_class_hints("wrapdemo")  # noqa: SLF001
        assert hints == ("serializer", "encoder")
    finally:
        lazy_core_module.refresh_lazy_manifests("wrapdemo")
        with lazy_core_module.LazyInstallerRegistry._lock:  # noqa: SLF001
            lazy_core_module.LazyInstallerRegistry._instances.pop("wrapdemo", None)  # noqa: SLF001


def test_async_install_queue(monkeypatch):
    installer = LazyInstaller("queuepkg")
    installer.enable()
    installer.apply_manifest(
        PackageManifest(
            package="queuepkg",
            dependencies={"missing": "missing-pkg"},
            async_installs=True,
            async_workers=2,
        )
    )

    events = {"install_called": 0}

    def fake_install(package_name, module_name=None):
        events["install_called"] += 1
        time.sleep(0.001)
        return True

    monkeypatch.setattr(installer, "install_package", fake_install)
    installer._dependency_mapper = types.SimpleNamespace(get_package_name=lambda name: name)  # noqa: SLF001

    handle = installer.schedule_async_install("missing")
    assert isinstance(handle, AsyncInstallHandle)
    assert handle.wait(timeout=1.0) is True
    assert events["install_called"] == 1


def test_watched_prefix_registry_short_circuit():
    registry = WatchedPrefixRegistry(["alpha.beta."])
    assert registry.get_matching_prefixes("random.module") == ()
    matches = registry.get_matching_prefixes("alpha.beta.serializer")
    assert matches == ("alpha.beta.",)


def test_lazy_installer_cached_tree_roundtrip(tmp_path, monkeypatch):
    installer = LazyInstaller("cachetest")
    cache_dir = tmp_path / "cache"
    site_dir = tmp_path / "site"

    monkeypatch.setattr(installer, "_get_async_cache_dir", lambda: cache_dir)
    monkeypatch.setattr(installer, "_site_packages_dir", lambda: site_dir)

    wheel_path = tmp_path / "demo.whl"
    with zipfile.ZipFile(wheel_path, "w") as archive:
        archive.writestr("demo_pkg/__init__.py", "value = 42\n")
        archive.writestr("demo_pkg-0.0.1.dist-info/METADATA", "Name: demo-pkg\nVersion: 0.0.1\n")

    installer._materialize_cached_tree("demo_pkg", wheel_path)
    assert installer._has_cached_install_tree("demo_pkg") is True
    assert installer._install_from_cached_tree("demo_pkg") is True

    installed_file = site_dir / "demo_pkg" / "__init__.py"
    assert installed_file.exists()
    assert "value = 42" in installed_file.read_text()

