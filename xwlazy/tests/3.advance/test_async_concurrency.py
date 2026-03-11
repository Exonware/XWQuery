"""
#exonware/xwlazy/tests/3.advance/test_async_concurrency.py
Advanced tests for xwlazy async + concurrency behavior:
- Many concurrent persist-to-project operations (requirements/pyproject)
- Asyncio workloads calling xwlazy public APIs while async I/O is enabled
- Sync vs async mode parity, flush timeout, mixed workloads, edge cases
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

import asyncio
import os
import threading
from pathlib import Path
import sys
import pytest
pytestmark = pytest.mark.xwlazy_advance
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import (  # noqa: E402
    auto_enable_lazy,
    get_all_stats,
    get_cache_stats,
    clear_cache,
    uninstall_global_import_hook,
)
_xwlazy_module = sys.modules.get("exonware._xwlazy_module")
if _xwlazy_module is None:
    import importlib.util
    _spec = importlib.util.spec_from_file_location(
        "exonware._xwlazy_module",
        project_root / "src" / "exonware" / "xwlazy.py",
    )
    _xwlazy_module = importlib.util.module_from_spec(_spec)
    _spec.loader.exec_module(_xwlazy_module)
    sys.modules["exonware._xwlazy_module"] = _xwlazy_module
_add_to_requirements_txt = _xwlazy_module._add_to_requirements_txt
_add_to_pyproject = _xwlazy_module._add_to_pyproject
_persist = _xwlazy_module._persist_installed_to_project
_normalize_spec_for_compare = _xwlazy_module._normalize_spec_for_compare
_flush_async_io = getattr(_xwlazy_module, "_flush_async_io", None)
_find_project_root = _xwlazy_module._find_project_root


def _flush(timeout_s: float = 5.0) -> bool:
    if callable(_flush_async_io):
        return _flush_async_io(timeout_s=timeout_s)
    return True


class TestAsyncPersistConcurrency:

    def test_many_concurrent_persist_operations(self, tmp_path):
        """
        Many threads concurrently updating the same requirements and pyproject.
        Ensures no crashes and no duplicate package base names.
        """
        req = tmp_path / "requirements.txt"
        req.write_text("")
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text(
            "[project]\nname = 'concurrent'\ndependencies = []\n\n"
            "[project.optional-dependencies]\nfull = []\n"
        )
        packages = [f"pkg{i}" for i in range(20)]
        def worker(thread_id: int):
            for name in packages:
                spec = f"{name}=={thread_id}"
                _add_to_requirements_txt(tmp_path, spec)
                _add_to_pyproject(tmp_path, spec)
        threads = [threading.Thread(target=worker, args=(i,)) for i in range(8)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        ok = _flush()
        assert ok, "Flush did not complete within timeout"
        content = req.read_text()
        lines = [ln.strip() for ln in content.splitlines() if ln.strip() and not ln.strip().startswith("#")]
        req_bases = [_normalize_spec_for_compare(ln) for ln in lines]
        assert len(req_bases) >= len(packages) // 2
        assert len(set(req_bases)) == len(req_bases)
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        project = data.get("project", {})
        opt = project.get("optional-dependencies", {})
        full_list = opt.get("full", [])
        deps = project.get("dependencies", [])
        base_names = []
        for seq in (full_list, deps):
            for x in seq:
                if isinstance(x, str):
                    base_names.append(_normalize_spec_for_compare(x))
        assert len(base_names) >= len(packages) // 2
        assert len(set(base_names)) == len(base_names)

    def test_sync_mode_single_thread_exact_count(self, tmp_path, monkeypatch):
        """With XWLAZY_ASYNC_IO=0, single-threaded add of N packages yields exactly N entries (100% correct)."""
        monkeypatch.setenv("XWLAZY_ASYNC_IO", "0")
        req = tmp_path / "requirements.txt"
        req.write_text("")
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("[project]\nname = 's'\ndependencies = []\n\n[project.optional-dependencies]\nfull = []\n")
        packages = [f"sync-pkg-{i}" for i in range(15)]
        for name in packages:
            _add_to_requirements_txt(tmp_path, f"{name}==1")
            _add_to_pyproject(tmp_path, f"{name}==1")
        lines = [ln.strip() for ln in req.read_text().splitlines() if ln.strip() and not ln.strip().startswith("#")]
        req_bases = [_normalize_spec_for_compare(ln) for ln in lines]
        assert len(req_bases) == len(packages), f"Expected {len(packages)} in requirements, got {len(req_bases)}"
        assert len(set(req_bases)) == len(req_bases)
        for name in packages:
            assert _normalize_spec_for_compare(name) in req_bases
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        full_list = data.get("project", {}).get("optional-dependencies", {}).get("full", [])
        full_bases = [_normalize_spec_for_compare(x) for x in full_list if isinstance(x, str)]
        assert len(full_bases) == len(packages)
        assert len(set(full_bases)) == len(full_bases)
        for name in packages:
            assert _normalize_spec_for_compare(name) in full_bases

    def test_concurrent_persist_mixed_requirements_and_pyproject_only(self, tmp_path):
        """Only requirements.txt (no pyproject); concurrent adds must not crash and yield unique bases."""
        req = tmp_path / "requirements.txt"
        req.write_text("")
        def do_req():
            for i in range(10):
                _add_to_requirements_txt(tmp_path, f"req-only-{i}")
        threads = [threading.Thread(target=do_req) for _ in range(3)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        ok = _flush()
        assert ok
        content = req.read_text()
        lines = [ln.strip() for ln in content.splitlines() if ln.strip() and not ln.strip().startswith("#")]
        bases = [_normalize_spec_for_compare(ln) for ln in lines]
        assert len(bases) >= 8, f"Expected at least 8 unique packages under concurrency, got {len(bases)}"
        assert len(set(bases)) == len(bases), "Duplicate package base names in requirements.txt"


class TestAsyncioWithXwlazy:

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_asyncio_tasks_can_use_auto_enable_lazy(self, monkeypatch):
        """Asyncio workload: auto_enable_lazy + get_all_stats from many tasks; no crash/deadlock."""
        monkeypatch.setenv("XWLAZY_ASYNC_IO", "1")
        monkeypatch.setenv("XWLAZY_NO_PERSIST", "1")
        async def worker(task_id: int):
            r = auto_enable_lazy("test_pkg", mode="smart")
            assert r is not None
            stats = get_all_stats()
            assert isinstance(stats, dict)
            _ = stats.get("installed_packages_count", 0)
            _ = stats.get("failed_packages_count", 0)
        async def main():
            await asyncio.gather(*(worker(i) for i in range(20)))
        asyncio.run(main())

    def test_asyncio_mixed_modes_and_cache_calls(self, monkeypatch):
        """Asyncio: alternate smart/pip/cached modes and cache stats; must stay consistent."""
        monkeypatch.setenv("XWLAZY_NO_PERSIST", "1")
        async def one(mode: str, i: int):
            auto_enable_lazy(f"pkg_{i}", mode=mode)
            s = get_cache_stats()
            assert isinstance(s, dict)
            clear_cache()
            return get_cache_stats()
        async def main():
            tasks = []
            for i in range(10):
                tasks.append(one("smart", i))
            for i in range(10, 20):
                tasks.append(one("pip", i))
            results = await asyncio.gather(*tasks)
            for r in results:
                assert isinstance(r, dict)
        asyncio.run(main())

    def test_asyncio_flush_returns_true_when_queue_done(self, tmp_path, monkeypatch):
        """Submit one persist, flush with generous timeout; must complete and return True."""
        monkeypatch.setenv("XWLAZY_ASYNC_IO", "1")
        monkeypatch.setenv("XWLAZY_NO_PERSIST", "0")
        (tmp_path / "requirements.txt").write_text("")
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'f'\ndependencies = []\n")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist("flush-test-pkg")
        finally:
            os.chdir(orig)
        ok = _flush(timeout_s=10.0)
        assert ok
        assert "flush-test-pkg" in (tmp_path / "requirements.txt").read_text()
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        assert "flush-test-pkg" in str(data.get("project", {}).get("dependencies", []))


class TestFindProjectRootUnderConcurrency:

    def test_find_project_root_from_multiple_threads(self, tmp_path):
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'r'\n")
        results = []
        def finder():
            orig = os.getcwd()
            try:
                sub = tmp_path / "a" / "b"
                sub.mkdir(parents=True, exist_ok=True)
                os.chdir(sub)
                root = _find_project_root(sub)
                results.append(root)
            finally:
                os.chdir(orig)
        threads = [threading.Thread(target=finder) for _ in range(20)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        assert len(results) == 20
        for r in results:
            assert r is not None
            assert r == tmp_path.resolve()
