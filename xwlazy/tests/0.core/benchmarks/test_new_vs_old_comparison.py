"""Benchmark: new vs old comparison. xwlazy is single-file; minimal public API."""

from __future__ import annotations
import pytest
import sys
from pathlib import Path
pytestmark = [pytest.mark.xwlazy_core, pytest.mark.xwlazy_performance]
project_root = Path(__file__).resolve().parents[3]
src_root = project_root / "src"
if str(src_root) not in sys.path:
    sys.path.insert(0, str(src_root))
from exonware.xwlazy import hook, auto_enable_lazy, uninstall_global_import_hook


class TestNewVsOldComparison:

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_hook_and_auto_enable(self):
        """Current API: hook and auto_enable_lazy."""
        uninstall_global_import_hook()
        h = hook(enable_global_hook=False)
        assert h is not None
        r = auto_enable_lazy("test_pkg", mode="smart")
        assert r is not None
