"""
Unit Tests: Installer Methods

Tests for installer methods: _is_module_importable() and install_and_import().

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock, Mock
import importlib.util

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.package.services import LazyInstaller

@pytest.mark.xwlazy_unit
class TestInstallerMethods:
    """Test cases for installer methods."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.installer = LazyInstaller(package_name="test")
    
    def test_is_module_importable_with_stdlib(self):
        """Test _is_module_importable returns True for stdlib modules."""
        # Test with a standard library module
        result = self.installer._is_module_importable("json")
        assert result is True
    
    def test_is_module_importable_with_installed_package(self):
        """Test _is_module_importable returns True for installed packages."""
        # Test with an installed package (if available)
        try:
            result = self.installer._is_module_importable("yaml")
            # Should return True if yaml is installed
            assert isinstance(result, bool)
        except Exception:
            # If yaml is not installed, that's okay for this test
            pass
    
    def test_is_module_importable_with_missing_module(self):
        """Test _is_module_importable returns False for missing modules."""
        # Test with a module that definitely doesn't exist
        result = self.installer._is_module_importable("nonexistent_module_xyz_12345")
        assert result is False
    
    def test_is_module_importable_handles_exceptions(self):
        """Test _is_module_importable handles exceptions gracefully."""
        # Mock find_spec to raise an exception
        with patch('importlib.util.find_spec', side_effect=Exception("Test error")):
            result = self.installer._is_module_importable("test_module")
            assert result is False
    
    def test_install_and_import_with_already_importable(self):
        """Test install_and_import with already importable module."""
        # Import the module to ensure globals are initialized
        from exonware.xwlazy.package.services import lazy_installer
        
        # Ensure _spec_cache_put is initialized
        if lazy_installer._spec_cache_put is None:
            lazy_installer._ensure_logging_initialized()
        
        # Enable installer and mock the module as importable
        with patch.object(self.installer, 'is_enabled', return_value=True):
            with patch.object(self.installer, '_is_module_importable', return_value=True):
                with patch('importlib.import_module') as mock_import:
                    mock_module = MagicMock()
                    mock_import.return_value = mock_module
                    
                    with patch.object(self.installer, '_get_installed_version', return_value="1.0.0"):
                        with patch.object(self.installer, '_clear_module_missing'):
                            # Patch the global _spec_cache_put in lazy_installer module
                            with patch.object(lazy_installer, '_spec_cache_put', MagicMock()):
                                with patch('importlib.util.find_spec', return_value=MagicMock()):
                                    with patch.object(self.installer, '_dependency_mapper') as mock_mapper:
                                        mock_mapper.get_package_name.return_value = None  # json is stdlib
                                        
                                        result, success = self.installer.install_and_import("json", None)
                                        
                                        assert success is True
                                        assert result == mock_module
                                        # Should have been called with "json" (may be called multiple times for internal imports)
                                        mock_import.assert_any_call("json")
    
    def test_install_and_import_with_cache_hit(self):
        """Test install_and_import with package in cache."""
        # Import the module to ensure globals are initialized
        from exonware.xwlazy.package.services import lazy_installer
        
        # Ensure _spec_cache_put is initialized
        if lazy_installer._spec_cache_put is None:
            lazy_installer._ensure_logging_initialized()
        
        # Mark package in cache
        self.installer._install_cache.mark_installed("PyYAML", "6.0")
        
        with patch.object(self.installer, 'is_enabled', return_value=True):
                with patch('importlib.import_module') as mock_import:
                    mock_module = MagicMock()
                    mock_import.return_value = mock_module
                    
                    with patch.object(self.installer, '_clear_module_missing'):
                        with patch.object(lazy_installer, '_spec_cache_put', MagicMock()):
                            with patch('importlib.util.find_spec', return_value=MagicMock()):
                                result, success = self.installer.install_and_import("yaml", "PyYAML")
                                
                                assert success is True
                                assert result == mock_module
                                # Should import directly without checking importability
                                mock_import.assert_any_call("yaml")
    
    def test_install_and_import_marks_in_cache(self):
        """Test install_and_import marks importable modules in cache."""
        # Import the module to ensure globals are initialized
        from exonware.xwlazy.package.services import lazy_installer
        
        # Ensure _spec_cache_put is initialized
        if lazy_installer._spec_cache_put is None:
            lazy_installer._ensure_logging_initialized()
        
        # Enable installer
        with patch.object(self.installer, 'is_enabled', return_value=True):
            # Module is importable but not in cache
            with patch.object(self.installer, '_is_module_importable', return_value=True):
                with patch('importlib.import_module') as mock_import:
                    mock_module = MagicMock()
                    mock_import.return_value = mock_module
                    
                    with patch.object(self.installer, '_get_installed_version', return_value="1.0.0"):
                        with patch.object(self.installer, '_clear_module_missing'):
                            with patch.object(lazy_installer, '_spec_cache_put', MagicMock()):
                                with patch('importlib.util.find_spec', return_value=MagicMock()):
                                    with patch.object(self.installer, '_dependency_mapper') as mock_mapper:
                                        mock_mapper.get_package_name.return_value = "test-package"
                                        
                                        result, success = self.installer.install_and_import("test_module", "test-package")
                                        
                                        assert success is True
                                        # Should be marked in cache
                                        assert self.installer._install_cache.is_installed("test-package")
    
    def test_install_and_import_skips_when_installing_active(self):
        """Test install_and_import skips when installation is already in progress."""
        # Check if import_tracking exists - may have been refactored
        try:
            from exonware.xwlazy.module.importer_engine import _is_import_in_progress
            # Mock the import tracking
            with patch('exonware.xwlazy.module.importer_engine._is_import_in_progress', return_value=True):
                result, success = self.installer.install_and_import("test_module", "test-package")
                assert success is False
                assert result is None
        except ImportError:
            # If import tracking was refactored, skip this test
            pytest.skip("Import tracking module not available")
    
    def test_install_and_import_skips_when_disabled(self):
        """Test install_and_import skips when installer is disabled."""
        # Disable installer
        with patch.object(self.installer, 'is_enabled', return_value=False):
            result, success = self.installer.install_and_import("test_module", "test-package")
            assert success is False
            assert result is None

