"""
Unit tests for lazy activation modes (smart, lite, pip, etc.).

xwlazy is single-file; mode behavior is exercised via auto_enable_lazy(mode=...).
"""

from __future__ import annotations

import pytest
import sys
from pathlib import Path

pytestmark = pytest.mark.xwlazy_unit

project_root = Path(__file__).resolve().parents[2]
src_root = project_root / "src"
if str(src_root) not in sys.path:
    sys.path.insert(0, str(src_root))

from exonware.xwlazy import (
    auto_enable_lazy,
    uninstall_global_import_hook,
    is_global_import_hook_installed,
)


class TestLazyModesPublicAPI:
    """Test mode selection via auto_enable_lazy (public API)."""

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_smart_mode(self):
        """auto_enable_lazy(..., mode='smart') succeeds."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="smart")
        assert result is not None

    def test_pip_mode(self):
        """auto_enable_lazy(..., mode='pip') succeeds."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="pip")
        assert result is not None

    def test_cached_mode(self):
        """auto_enable_lazy(..., mode='cached') succeeds."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="cached")
        assert result is not None
