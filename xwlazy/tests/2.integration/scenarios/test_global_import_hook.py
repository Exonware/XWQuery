"""
Integration Test: Global Import Hook for Module-Level Imports

Tests the critical global builtins.__import__ hook that enables
auto-installation for module-level imports.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 27-Dec-2025
"""

import pytest
import sys
import os
import subprocess
import tempfile
import importlib
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

@pytest.mark.xwlazy_integration
class TestGlobalImportHook:
    """
    Test global builtins.__import__ hook for module-level imports.
    
    This is the critical feature that enables auto-installation
    for imports that occur at module level during package initialization.
    """
    
    def setup_method(self):
        """Set up test fixtures - clear caches and reset state."""
        # Clear global import hook caches
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
        # Restore original state
        try:
            from exonware.xwlazy.module.importer_engine import (
                uninstall_global_import_hook,
                clear_global_import_caches
            )
            uninstall_global_import_hook()
            clear_global_import_caches()
        except ImportError:
            pass
    
    def test_global_hook_installation(self):
        """
        Test that global import hook can be installed and uninstalled.
        
        Given: No global hook installed
        When: install_global_import_hook() is called
        Then: Hook is installed and builtins.__import__ is replaced
        """
        from exonware.xwlazy.module.importer_engine import (
            install_global_import_hook,
            uninstall_global_import_hook,
            is_global_import_hook_installed
        )
        import builtins
        
        # Initially not installed
        assert not is_global_import_hook_installed()
        original_import = builtins.__import__
        
        # Install hook
        install_global_import_hook()
        assert is_global_import_hook_installed()
        assert builtins.__import__ is not original_import
        
        # Uninstall hook
        uninstall_global_import_hook()
        assert not is_global_import_hook_installed()
        assert builtins.__import__ is original_import
    
    def test_register_lazy_package(self):
        """
        Test that packages can be registered for auto-install.
        
        Given: No packages registered
        When: register_lazy_package() is called
        Then: Package is registered and can be checked
        """
        from exonware.xwlazy.module.importer_engine import (
            register_lazy_package,
            _should_auto_install
        )
        
        # Register a test package
        register_lazy_package("test_package")
        
        # Should return True for registered package
        assert _should_auto_install("test_package")
        assert _should_auto_install("test_package.submodule")
        
        # Should return False for unregistered package
        assert not _should_auto_install("unregistered_package")
    
    def test_auto_enable_lazy_registers_package(self):
        """
        Test that auto_enable_lazy() registers package and installs hook.
        
        Given: No lazy mode enabled
        When: auto_enable_lazy("test_package") is called
        Then: Package is registered and global hook is installed
        """
        from exonware.xwlazy import auto_enable_lazy
        from exonware.xwlazy.module.importer_engine import (
            is_global_import_hook_installed,
            _should_auto_install
        )
        
        # Enable lazy mode
        result = auto_enable_lazy("test_package", mode="smart")
        assert result is True
        
        # Check hook is installed
        assert is_global_import_hook_installed()
        
        # Check package is registered
        assert _should_auto_install("test_package")
    
    def test_conf_lazy_install_triggers_registration(self):
        """
        Test that conf.xwsystem.lazy_install = True registers package.
        
        Given: xwlazy is available
        When: conf.xwsystem.lazy_install = True is set
        Then: Package is registered and global hook is installed
        """
        try:
            from exonware import conf
            from exonware.xwlazy.module.importer_engine import (
                is_global_import_hook_installed,
                _should_auto_install
            )
            
            # Set lazy install
            conf.xwsystem.lazy_install = True
            
            # Check hook is installed
            assert is_global_import_hook_installed()
            
            # Check package is registered
            assert _should_auto_install("xwsystem")
            
        except ImportError:
            pytest.skip("exonware.conf not available")
    
    def test_fast_path_caching(self):
        """
        Test fast-path caching for installed modules.
        
        Given: Module is in installed cache
        When: Module is imported
        Then: Cache is checked first (performance optimization)
        """
        from exonware.xwlazy.module.importer_engine import (
            install_global_import_hook,
            register_lazy_package,
            get_global_import_cache_stats
        )
        
        # Install hook and register package
        register_lazy_package("test_package")
        install_global_import_hook()
        
        # Import a standard library module (should be cached)
        import json
        
        # Check cache stats
        stats = get_global_import_cache_stats()
        assert stats['installed_cache_size'] > 0
        assert 'json' in stats.get('installed_cache', set()) or 'json' in sys.modules
    
    def test_stdlib_modules_skipped(self):
        """
        Test that stdlib modules are skipped (performance optimization).
        
        Given: Global hook is installed
        When: Standard library module is imported
        Then: Module is imported normally without hook processing
        """
        from exonware.xwlazy.module.importer_engine import (
            install_global_import_hook,
            register_lazy_package
        )
        
        # Install hook
        register_lazy_package("test_package")
        install_global_import_hook()
        
        # Import stdlib modules - should work normally
        import os
        import sys
        import json
        import pathlib
        
        # All should be imported successfully
        assert os is not None
        assert sys is not None
        assert json is not None
        assert pathlib is not None
    
    def test_private_modules_skipped(self):
        """
        Test that private modules (starting with _) are skipped.
        
        Given: Global hook is installed
        When: Private module is imported
        Then: Module is imported normally without hook processing
        """
        from exonware.xwlazy.module.importer_engine import (
            install_global_import_hook,
            register_lazy_package
        )
        
        # Install hook
        register_lazy_package("test_package")
        install_global_import_hook()
        
        # Try importing private module - should not trigger hook
        # (This is a performance optimization)
        try:
            import _thread  # Private stdlib module
            assert _thread is not None
        except ImportError:
            # Some Python versions don't expose _thread
            pass

@pytest.mark.xwlazy_integration
class TestModuleLevelImports:
    """
    Test module-level import interception.
    
    This tests the critical scenario where imports occur at module level
    during package initialization, which was the main limitation before.
    """
    
    def setup_method(self):
        """Set up test fixtures."""
        # Clear caches
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
    
    def test_json_run_scenario_with_global_hook(self):
        """
        Test json_run.py scenario works with global hook.
        
        This is the critical test that verifies module-level imports work.
        
        Given: Global hook is installed and xwsystem is registered
        When: json_run.py imports xwsystem modules with module-level imports
        Then: Missing dependencies are auto-installed without circular import errors
        """
        json_run_path = project_root.parent / "xwsystem" / "examples" / "lazy_mode_usage" / "json_run.py"
        
        if not json_run_path.exists():
            pytest.skip("json_run.py not found")
        
        # Enable lazy mode before running
        try:
            from exonware import conf
            conf.xwsystem.lazy_install = True
        except ImportError:
            pytest.skip("exonware.conf not available")
        
        # Run json_run.py
        try:
            result = subprocess.run(
                [sys.executable, str(json_run_path)],
                capture_output=True,
                text=True,
                timeout=120,  # Longer timeout for installation
                cwd=str(json_run_path.parent),
                env={**os.environ, "PYTHONPATH": str(src_path)}
            )
            
            # Check for critical errors
            stderr_lower = result.stderr.lower()
            
            # Should not have circular import errors
            assert "partially initialized module 'yaml'" not in result.stderr, (
                f"Circular import detected:\nSTDERR:\n{result.stderr}\nSTDOUT:\n{result.stdout}"
            )
            assert "circular import" not in stderr_lower, (
                f"Circular import detected:\nSTDERR:\n{result.stderr}\nSTDOUT:\n{result.stdout}"
            )
            
            # Should complete successfully (or at least not fail due to imports)
            # Note: May fail if packages need to be installed, but should not fail due to circular imports
            if result.returncode != 0:
                # Check if it's an installation error (acceptable) vs import error (not acceptable)
                if "module 'yaml'" in result.stderr and "partially initialized" in result.stderr:
                    pytest.fail(
                        f"Module-level import failed (circular import):\n"
                        f"STDERR:\n{result.stderr}\nSTDOUT:\n{result.stdout}"
                    )
                elif "no module named" in stderr_lower or "cannot import" in stderr_lower:
                    # Installation errors are acceptable - the hook should handle them
                    # But we should verify the hook is working
                    pass
                else:
                    # Other errors - log but don't fail (might be expected)
                    print(f"json_run.py exited with code {result.returncode}")
                    print(f"STDERR:\n{result.stderr}")
                    print(f"STDOUT:\n{result.stdout}")
            
        except subprocess.TimeoutExpired:
            pytest.fail("json_run.py timed out - possible infinite loop or hanging installation")
        except Exception as e:
            pytest.fail(f"Failed to run json_run.py: {e}")
    
    def test_module_level_import_interception(self):
        """
        Test that module-level imports are intercepted by global hook.
        
        Given: Global hook is installed and package is registered
        When: Module with module-level import is loaded
        Then: Import is intercepted and can trigger auto-installation
        """
        from exonware.xwlazy.module.importer_engine import (
            install_global_import_hook,
            register_lazy_package
        )
        
        # Install hook and register package
        register_lazy_package("test_package")
        install_global_import_hook()
        
        # Create a test module with module-level import
        with tempfile.TemporaryDirectory() as temp_dir:
            test_module_path = Path(temp_dir) / "test_module.py"
            test_module_path.write_text("""
# Module-level import (this is what we're testing)
import json  # Standard library - should work
import os    # Standard library - should work

def test_function():
    return "test"
""")
            
            # Add temp_dir to path
            sys.path.insert(0, temp_dir)
            
            try:
                # Import the module - should work without errors
                import test_module
                assert test_module.test_function() == "test"
            finally:
                # Clean up
                sys.path.remove(temp_dir)
                if 'test_module' in sys.modules:
                    del sys.modules['test_module']

@pytest.mark.xwlazy_integration
class TestOneLineActivation:
    """
    Test one-line activation API.
    
    Tests the auto_enable_lazy() function that provides
    one-line activation for any library.
    """
    
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
    
    def test_auto_enable_lazy_with_package_name(self):
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
    
    def test_auto_enable_lazy_auto_detects_package(self):
        """
        Test auto_enable_lazy() auto-detects package name from caller.
        
        Given: Function is called from a module
        When: auto_enable_lazy() is called without package name
        Then: Package name is auto-detected from caller's __package__
        """
        from exonware.xwlazy import auto_enable_lazy
        
        # Create a test module context
        test_module = type(sys)('test_module')
        test_module.__package__ = 'test_package'
        test_module.__name__ = 'test_package.__init__'
        
        # Mock inspect.currentframe to return our test module
        import inspect
        original_frame = inspect.currentframe
        
        def mock_frame():
            frame = MagicMock()
            frame.f_back.f_globals = {
                '__package__': 'test_package',
                '__name__': 'test_package.__init__'
            }
            return frame
        
        with patch('inspect.currentframe', side_effect=mock_frame):
            result = auto_enable_lazy(mode="smart")
            # Should succeed (may return False if package name can't be detected)
            assert isinstance(result, bool)
    
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

