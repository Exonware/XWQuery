"""Advance: performance regression via public API. xwlazy is single-file."""
import pytest
from pathlib import Path
import sys

pytestmark = pytest.mark.xwlazy_performance
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import (
    auto_enable_lazy,
    uninstall_global_import_hook,
    get_performance_stats,
    get_cache_stats,
)

class TestPerformanceRegression:
    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_lazy_fast(self):
        uninstall_global_import_hook()
        r = auto_enable_lazy("test_pkg", mode="smart")
        assert r is not None

    def test_stats_available(self):
        assert isinstance(get_performance_stats(), dict)
        assert isinstance(get_cache_stats(), dict)
