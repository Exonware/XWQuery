"""Unit tests: execution behavior via public API. xwlazy is single-file; strategies are internal."""

import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_unit
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import auto_enable_lazy, uninstall_global_import_hook

class TestExecutionViaAPI:

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_pip_mode(self):
        r = auto_enable_lazy("test_pkg", mode="pip")
        assert r is not None
