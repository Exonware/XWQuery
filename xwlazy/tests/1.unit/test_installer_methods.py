"""Unit tests: installer behavior via public API. xwlazy is single-file."""

import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_unit
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import hook, clear_cache, get_cache_stats

class TestInstallerViaAPI:

    def test_hook_and_cache(self):
        h = hook(root=".", enable_global_hook=False)
        assert h is not None
        assert isinstance(get_cache_stats(), dict)
        clear_cache()
