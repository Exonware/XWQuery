"""Benchmark: version comparison. xwlazy is single-file; minimal public API benchmark."""
from __future__ import annotations

import pytest
import sys
import time
from pathlib import Path

pytestmark = [pytest.mark.xwlazy_core, pytest.mark.xwlazy_performance]

project_root = Path(__file__).resolve().parents[3]
src_root = project_root / "src"
if str(src_root) not in sys.path:
    sys.path.insert(0, str(src_root))


class TestVersionComparison:
    """Minimal import-time benchmark for current xwlazy."""

    def test_import_time(self):
        """Measure exonware.xwlazy import time."""
        if "exonware.xwlazy" in sys.modules:
            for k in list(sys.modules.keys()):
                if k == "exonware.xwlazy" or k.startswith("exonware.xwlazy."):
                    del sys.modules[k]
        start = time.perf_counter()
        import exonware.xwlazy  # noqa: E402
        elapsed = time.perf_counter() - start
        assert elapsed >= 0
        assert hasattr(exonware.xwlazy, "hook")
