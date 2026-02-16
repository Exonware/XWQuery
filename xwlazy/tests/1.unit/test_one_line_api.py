"""
Unit Tests: One-Line Activation API

Tests for auto_enable_lazy() and attach() APIs.
Uses only public API from exonware.xwlazy (single-file design).

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
    attach,
    uninstall_global_import_hook,
    is_global_import_hook_installed,
    install_global_import_hook,
)


@pytest.mark.xwlazy_unit
class TestAutoEnableLazy:
    """Test auto_enable_lazy() one-line activation API."""

    def setup_method(self):
        uninstall_global_import_hook()

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_auto_enable_lazy_with_explicit_package(self):
        """auto_enable_lazy('test_package') returns instance; hook can be installed."""
        result = auto_enable_lazy("test_package", mode="smart")
        assert result is not None
        install_global_import_hook()
        assert is_global_import_hook_installed()

    def test_auto_enable_lazy_supports_modes(self):
        """auto_enable_lazy() accepts mode strings smart, pip, cached."""
        for mode in ["smart", "pip", "cached"]:
            uninstall_global_import_hook()
            result = auto_enable_lazy(f"test_pkg_{mode}", mode=mode)
            assert result is not None, f"Mode '{mode}' failed"

    def test_auto_enable_lazy_handles_invalid_mode(self):
        """auto_enable_lazy() with invalid mode raises ValueError."""
        uninstall_global_import_hook()
        with pytest.raises(ValueError, match="Invalid strategy"):
            auto_enable_lazy("test_package", mode="invalid_mode")


@pytest.mark.xwlazy_unit
class TestAttachAPI:
    """Test attach() lazy-loader compatible API."""

    def test_attach_returns_tuple(self):
        """attach() returns (__getattr__, __dir__, __all__)."""
        __getattr__, __dir__, __all__ = attach("test_package", ["submodule1"])
        assert callable(__getattr__)
        assert callable(__dir__)
        assert isinstance(__all__, list)
        assert "submodule1" in __all__

    def test_attach_with_submod_attrs(self):
        """attach() with submod_attrs includes attributes in __all__."""
        __getattr__, __dir__, __all__ = attach(
            "test_package",
            submod_attrs={"module": ["attr1", "attr2"]}
        )
        assert "attr1" in __all__
        assert "attr2" in __all__

    def test_attach_dir_returns_all(self):
        """attach() __dir__ returns list including submodules and attrs."""
        __getattr__, __dir__, __all__ = attach(
            "test_package",
            ["submodule1", "submodule2"],
            {"module": ["attr1"]}
        )
        dir_result = __dir__()
        assert isinstance(dir_result, list)
        assert "submodule1" in dir_result
        assert "submodule2" in dir_result
        assert "attr1" in dir_result
