"""Integration: hook and auto_enable_lazy (public API). xwlazy is single-file."""

import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_integration
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import hook, auto_enable_lazy, uninstall_global_import_hook, is_global_import_hook_installed, install_global_import_hook

class TestStrategyIntegration:

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_hook_then_auto_enable(self):
        uninstall_global_import_hook()
        h = hook(enable_global_hook=True)
        assert h is not None
        r = auto_enable_lazy("test_pkg", mode="smart")
        assert r is not None
        install_global_import_hook()
        assert is_global_import_hook_installed()
