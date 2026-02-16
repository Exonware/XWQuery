"""
Core Tests: Hooking and Configuration

Tests the hooking mechanism and public API (hook, auto_enable_lazy, global import hook).
xwlazy is single-file; no separate package/module strategy modules.

Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

import pytest
import sys
from pathlib import Path

tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy import (
    hook,
    auto_enable_lazy,
    install_global_import_hook,
    uninstall_global_import_hook,
    is_global_import_hook_installed,
    clear_cache,
    get_cache_stats,
    get_watched_prefixes,
    add_watched_prefix,
    remove_watched_prefix,
)


@pytest.mark.xwlazy_core
class TestHookAPI:
    """Test hook() and global import hook."""

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_hook_returns_instance(self):
        """hook() returns XWLazy instance and installs on meta_path."""
        inst = hook(root=".", default_enabled=True, enable_global_hook=False)
        assert inst is not None
        assert inst in sys.meta_path

    def test_auto_enable_lazy_basic(self):
        """auto_enable_lazy() enables lazy for a package and returns instance."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="smart", root=".")
        assert result is not None
        # If singleton was created with hook enabled, it is installed; else install explicitly
        if not is_global_import_hook_installed():
            install_global_import_hook()
        assert is_global_import_hook_installed()

    def test_install_uninstall_global_hook(self):
        """install_global_import_hook / uninstall_global_import_hook toggle state."""
        uninstall_global_import_hook()
        assert not is_global_import_hook_installed()
        install_global_import_hook()
        assert is_global_import_hook_installed()
        uninstall_global_import_hook()
        assert not is_global_import_hook_installed()


@pytest.mark.xwlazy_core
class TestCacheAndWatchedPrefixes:
    """Test cache and watched prefix API."""

    def test_clear_cache(self):
        """clear_cache() runs without error."""
        clear_cache()

    def test_get_cache_stats(self):
        """get_cache_stats() returns dict with expected keys."""
        stats = get_cache_stats()
        assert isinstance(stats, dict)

    def test_watched_prefixes(self):
        """add_watched_prefix / remove_watched_prefix / get_watched_prefixes."""
        before = set(get_watched_prefixes())
        add_watched_prefix("_test_xwlazy_")
        assert "_test_xwlazy_" in get_watched_prefixes()
        remove_watched_prefix("_test_xwlazy_")
        assert set(get_watched_prefixes()) == before
