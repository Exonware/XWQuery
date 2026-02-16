"""Integration: cache and hook. xwlazy is single-file."""
import pytest
from pathlib import Path
import sys

pytestmark = pytest.mark.xwlazy_integration
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import hook, clear_cache, get_cache_stats, uninstall_global_import_hook

class TestInstallerCacheIntegration:
    def teardown_method(self):
        uninstall_global_import_hook()
    def test_hook_and_cache_stats(self):
        uninstall_global_import_hook()
        hook(enable_global_hook=False)
        clear_cache()
        s = get_cache_stats()
        assert isinstance(s, dict)
