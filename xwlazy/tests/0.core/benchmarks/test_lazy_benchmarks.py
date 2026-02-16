"""Benchmark: lazy-loading scenarios. xwlazy is single-file; minimal public API."""
from __future__ import annotations

import pytest
import sys
from pathlib import Path

pytestmark = [pytest.mark.xwlazy_core, pytest.mark.xwlazy_performance]

project_root = Path(__file__).resolve().parents[3]
src_root = project_root / "src"
if str(src_root) not in sys.path:
    sys.path.insert(0, str(src_root))

from exonware.xwlazy import hook, auto_enable_lazy, attach, uninstall_global_import_hook


class TestLazyBenchmarks:
    def teardown_method(self):
        uninstall_global_import_hook()

    def test_hook_instantiation(self):
        uninstall_global_import_hook()
        h = hook(enable_global_hook=False)
        assert h is not None

    def test_attach_overhead(self):
        g, d, a = attach("pkg", ["x", "y"])
        assert len(a) == 2
