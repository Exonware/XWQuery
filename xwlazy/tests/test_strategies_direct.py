"""Direct strategy tests via public API. xwlazy is single-file."""
import pytest
from pathlib import Path
import sys

project_root = Path(__file__).resolve().parent
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import attach, auto_enable_lazy, uninstall_global_import_hook

class TestStrategiesDirect:
    def teardown_method(self):
        uninstall_global_import_hook()
    def test_attach(self):
        g, d, a = attach("pkg", ["x"])
        assert "x" in a
    def test_auto_enable(self):
        uninstall_global_import_hook()
        assert auto_enable_lazy("test_pkg", mode="smart") is not None
