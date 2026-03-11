"""Unit tests: cache API. xwlazy is single-file."""

import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_unit
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import get_cache_stats, clear_cache, invalidate_cache

class TestCacheAPI:

    def test_get_cache_stats(self):
        assert isinstance(get_cache_stats(), dict)

    def test_clear_cache(self):
        clear_cache()

    def test_invalidate_cache(self):
        invalidate_cache("nonexistent.module")
