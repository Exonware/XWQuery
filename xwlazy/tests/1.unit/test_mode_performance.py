"""
Unit tests for mode and performance (public API).

xwlazy is single-file; tests exercise auto_enable_lazy and cache/stats API.
"""

import pytest
import sys
from pathlib import Path

pytestmark = pytest.mark.xwlazy_unit

project_root = Path(__file__).resolve().parents[2]
src_root = project_root / "src"
if str(src_root) not in sys.path:
    sys.path.insert(0, str(src_root))

from exonware.xwlazy import (
    auto_enable_lazy,
    uninstall_global_import_hook,
    get_cache_stats,
    get_performance_stats,
    clear_cache,
    clear_performance_stats,
)


class TestModeAndPerformanceAPI:
    """Test performance and cache stats (public API)."""

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_lazy_returns_instance(self):
        """auto_enable_lazy returns guardian instance."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="smart")
        assert result is not None

    def test_get_cache_stats(self):
        """get_cache_stats returns dict."""
        stats = get_cache_stats()
        assert isinstance(stats, dict)

    def test_get_performance_stats(self):
        """get_performance_stats returns dict."""
        stats = get_performance_stats()
        assert isinstance(stats, dict)

    def test_clear_cache_and_performance(self):
        """clear_cache and clear_performance_stats run without error."""
        clear_cache()
        clear_performance_stats()
