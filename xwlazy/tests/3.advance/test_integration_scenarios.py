"""Advance: integration scenarios via public API. xwlazy is single-file."""
import pytest
from pathlib import Path
import sys

pytestmark = pytest.mark.xwlazy_advance
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import auto_enable_lazy, uninstall_global_import_hook, attach

class TestIntegrationScenarios:
    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_multiple_packages(self):
        uninstall_global_import_hook()
        r1 = auto_enable_lazy("pkg_a", mode="smart")
        r2 = auto_enable_lazy("pkg_b", mode="pip")
        assert r1 is not None and r2 is not None

    def test_attach_api(self):
        g, d, a = attach("pkg", ["x"])
        assert callable(g) and "x" in a
