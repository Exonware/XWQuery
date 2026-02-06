"""
Unit Tests: One-Line Activation API

Tests for auto_enable_lazy() and attach() APIs.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 27-Dec-2025
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

@pytest.mark.xwlazy_unit
class TestAutoEnableLazy:
    """Test auto_enable_lazy() one-line activation API."""
    
    def setup_method(self):
        """Set up test fixtures."""
        # Clear state
        try:
            from exonware.xwlazy.module.importer_engine import (
                clear_global_import_caches,
                uninstall_global_import_hook
            )
            clear_global_import_caches()
            uninstall_global_import_hook()
        except ImportError:
            pass
    
    def teardown_method(self):
        """Clean up after tests."""
        try:
            from exonware.xwlazy.module.importer_engine import (
                uninstall_global_import_hook,
                clear_global_import_caches
            )
            uninstall_global_import_hook()
            clear_global_import_caches()
        except ImportError:
            pass
    
    def test_auto_enable_lazy_with_explicit_package(self):
        """
        Test auto_enable_lazy() with explicit package name.
        
        Given: No lazy mode enabled
        When: auto_enable_lazy("test_package") is called
        Then: Package is registered and hooks are installed
        """
        from exonware.xwlazy import auto_enable_lazy
        from exonware.xwlazy.module.importer_engine import (
            is_global_import_hook_installed,
            _should_auto_install
        )
        from exonware.xwlazy.facade import is_import_hook_installed
        
        # Enable lazy mode
        result = auto_enable_lazy("test_package", mode="smart")
        assert result is True
        
        # Check global hook is installed
        assert is_global_import_hook_installed()
        
        # Check meta_path hook is installed
        assert is_import_hook_installed("test_package")
        
        # Check package is registered
        assert _should_auto_install("test_package")
    
    def test_auto_enable_lazy_supports_all_modes(self):
        """
        Test auto_enable_lazy() supports all preset modes.
        
        Given: Different mode strings
        When: auto_enable_lazy() is called with each mode
        Then: All modes are accepted and configured correctly
        """
        from exonware.xwlazy import auto_enable_lazy
        
        modes = ["smart", "lite", "full", "clean", "temporary"]
        
        for mode in modes:
            # Clear state before each test
            try:
                from exonware.xwlazy.module.importer_engine import (
                    uninstall_global_import_hook,
                    clear_global_import_caches
                )
                uninstall_global_import_hook()
                clear_global_import_caches()
            except ImportError:
                pass
            
            result = auto_enable_lazy(f"test_package_{mode}", mode=mode)
            assert result is True, f"Mode '{mode}' failed to enable"
    
    def test_auto_enable_lazy_handles_invalid_mode(self):
        """
        Test auto_enable_lazy() handles invalid mode gracefully.
        
        Given: Invalid mode string
        When: auto_enable_lazy() is called with invalid mode
        Then: Falls back to "smart" mode and succeeds
        """
        from exonware.xwlazy import auto_enable_lazy
        
        # Clear state
        try:
            from exonware.xwlazy.module.importer_engine import (
                uninstall_global_import_hook,
                clear_global_import_caches
            )
            uninstall_global_import_hook()
            clear_global_import_caches()
        except ImportError:
            pass
        
        # Should fall back to "smart" mode
        result = auto_enable_lazy("test_package", mode="invalid_mode")
        assert result is True  # Should still succeed with fallback

@pytest.mark.xwlazy_unit
class TestAttachAPI:
    """Test attach() lazy-loader compatible API."""
    
    def test_attach_returns_tuple(self):
        """
        Test attach() returns (__getattr__, __dir__, __all__) tuple.
        
        Given: Package name and submodules
        When: attach() is called
        Then: Returns tuple with three callables
        """
        from exonware.xwlazy import attach
        
        __getattr__, __dir__, __all__ = attach("test_package", ["submodule1"])
        
        assert callable(__getattr__)
        assert callable(__dir__)
        assert isinstance(__all__, list)
        assert "submodule1" in __all__
    
    def test_attach_with_submod_attrs(self):
        """
        Test attach() with submod_attrs parameter.
        
        Given: Package name and submod_attrs
        When: attach() is called
        Then: Returns tuple with attributes in __all__
        """
        from exonware.xwlazy import attach
        
        __getattr__, __dir__, __all__ = attach(
            "test_package",
            submod_attrs={"module": ["attr1", "attr2"]}
        )
        
        assert "attr1" in __all__
        assert "attr2" in __all__
    
    def test_attach_getattr_lazy_loads(self):
        """
        Test attach() __getattr__ lazy loads modules.
        
        Given: attach() is called with submodules
        When: __getattr__ is called with module name
        Then: Module is imported on first access
        """
        from exonware.xwlazy import attach
        import tempfile
        import importlib
        
        # Create a test module
        with tempfile.TemporaryDirectory() as temp_dir:
            test_module_path = Path(temp_dir) / "test_package" / "submodule1.py"
            test_module_path.parent.mkdir(parents=True, exist_ok=True)
            test_module_path.write_text("value = 42")
            
            # Create __init__.py
            init_path = test_module_path.parent / "__init__.py"
            init_path.write_text("")
            
            # Add to path
            sys.path.insert(0, temp_dir)
            
            try:
                __getattr__, __dir__, __all__ = attach("test_package", ["submodule1"])
                
                # Access submodule - should lazy load
                submodule = __getattr__("submodule1")
                assert submodule is not None
                assert submodule.value == 42
            finally:
                sys.path.remove(temp_dir)
                # Clean up sys.modules
                for key in list(sys.modules.keys()):
                    if key.startswith("test_package"):
                        del sys.modules[key]
    
    def test_attach_dir_returns_all(self):
        """
        Test attach() __dir__ returns __all__ list.
        
        Given: attach() is called
        When: __dir__() is called
        Then: Returns list matching __all__
        """
        from exonware.xwlazy import attach
        
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
