"""Unit tests: module loading via public API. xwlazy is single-file; strategies are internal."""
import pytest
from pathlib import Path
import sys

pytestmark = pytest.mark.xwlazy_unit
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import attach

class TestModuleViaAPI:
    def test_attach_returns_callables(self):
        g, d, a = attach("pkg", ["x"])
        assert callable(g) and callable(d) and isinstance(a, list)
