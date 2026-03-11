"""Integration: YAML-related scenario. xwlazy public API only (no xwsystem dependency)."""

import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_integration
project_root = Path(__file__).resolve().parents[3]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import auto_enable_lazy, uninstall_global_import_hook

class TestYamlIntegration:

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_lazy_succeeds(self):
        """Public API works (yaml auto-install is internal behavior)."""
        uninstall_global_import_hook()
        r = auto_enable_lazy("test_pkg", mode="smart")
        assert r is not None
