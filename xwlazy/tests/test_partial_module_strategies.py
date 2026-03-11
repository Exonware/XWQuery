"""Partial module strategies via public API. xwlazy is single-file."""

import pytest
from pathlib import Path
import sys
project_root = Path(__file__).resolve().parent
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import attach

class TestPartialModuleStrategies:

    def test_attach_submod_attrs(self):
        __getattr__, __dir__, __all__ = attach("pkg", submod_attrs={"m": ["a", "b"]})
        assert "a" in __all__ and "b" in __all__
