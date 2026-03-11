"""
Core Tests: Public API behavior (modes and activation)
xwlazy is single-file; strategy classes are internal. These tests exercise
the public API (auto_enable_lazy modes, hook, attach) to ensure behavior is correct.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

import pytest
import sys
from pathlib import Path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))
from exonware.xwlazy import (
    auto_enable_lazy,
    hook,
    attach,
    uninstall_global_import_hook,
    is_global_import_hook_installed,
)
@pytest.mark.xwlazy_core


class TestAutoEnableLazyModes:
    """Test auto_enable_lazy() with different modes."""

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_lazy_smart_mode(self):
        """auto_enable_lazy(..., mode='smart') succeeds."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="smart")
        assert result is not None

    def test_auto_enable_lazy_pip_mode(self):
        """auto_enable_lazy(..., mode='pip') succeeds."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="pip")
        assert result is not None

    def test_auto_enable_lazy_cached_mode(self):
        """auto_enable_lazy(..., mode='cached') succeeds."""
        uninstall_global_import_hook()
        result = auto_enable_lazy("test_pkg", mode="cached")
        assert result is not None
@pytest.mark.xwlazy_core


class TestAttachAPI:
    """Test attach() lazy-loader compatible API."""

    def test_attach_returns_three_callables(self):
        """attach() returns (__getattr__, __dir__, __all__)."""
        __getattr__, __dir__, __all__ = attach("some_pkg", ["submod"])
        assert callable(__getattr__)
        assert callable(__dir__)
        assert isinstance(__all__, list)

    def test_attach_dir_includes_submodules(self):
        """__dir__() includes submodule names."""
        __getattr__, __dir__, __all__ = attach("some_pkg", ["a", "b"])
        dir_result = __dir__()
        assert "a" in dir_result
        assert "b" in dir_result
