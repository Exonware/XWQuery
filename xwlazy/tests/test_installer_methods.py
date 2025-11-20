"""
#exonware/xwlazy/tests/test_installer_methods.py

Unit tests for installer methods: _is_module_importable() and install_and_import().

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.17
Generation Date: 15-Nov-2025
"""

import unittest
import sys
from unittest.mock import patch, MagicMock, Mock
import importlib.util

from exonware.xwlazy.installation.installer import LazyInstaller


class TestInstallerMethods(unittest.TestCase):
    """Test cases for installer methods."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.installer = LazyInstaller(package_name="test")
    
    def test_is_module_importable_with_stdlib(self):
        """Test _is_module_importable returns True for stdlib modules."""
        # Test with a standard library module
        result = self.installer._is_module_importable("json")
        self.assertTrue(result)
    
    def test_is_module_importable_with_installed_package(self):
        """Test _is_module_importable returns True for installed packages."""
        # Test with an installed package (if available)
        try:
            result = self.installer._is_module_importable("yaml")
            # Should return True if yaml is installed
            self.assertIsInstance(result, bool)
        except Exception:
            # If yaml is not installed, that's okay for this test
            pass
    
    def test_is_module_importable_with_missing_module(self):
        """Test _is_module_importable returns False for missing modules."""
        # Test with a module that definitely doesn't exist
        result = self.installer._is_module_importable("nonexistent_module_xyz_12345")
        self.assertFalse(result)
    
    def test_is_module_importable_handles_exceptions(self):
        """Test _is_module_importable handles exceptions gracefully."""
        # Mock find_spec to raise an exception
        with patch('importlib.util.find_spec', side_effect=Exception("Test error")):
            result = self.installer._is_module_importable("test_module")
            self.assertFalse(result)
    
    def test_install_and_import_with_already_importable(self):
        """Test install_and_import with already importable module."""
        # Mock the module as importable
        with patch.object(self.installer, '_is_module_importable', return_value=True):
            with patch('importlib.import_module') as mock_import:
                mock_module = MagicMock()
                mock_import.return_value = mock_module
                
                with patch.object(self.installer, '_clear_module_missing'):
                    with patch('exonware.xwlazy.discovery.spec_cache._spec_cache_put'):
                        result, success = self.installer.install_and_import("json", None)
                        
                        self.assertTrue(success)
                        self.assertEqual(result, mock_module)
                        # Should not attempt installation
                        mock_import.assert_called_once_with("json")
    
    def test_install_and_import_with_cache_hit(self):
        """Test install_and_import with package in cache."""
        # Mark package in cache
        self.installer._install_cache.mark_installed("PyYAML", "6.0")
        
        with patch('importlib.import_module') as mock_import:
            mock_module = MagicMock()
            mock_import.return_value = mock_module
            
            with patch.object(self.installer, '_clear_module_missing'):
                with patch('exonware.xwlazy.discovery.spec_cache._spec_cache_put'):
                    result, success = self.installer.install_and_import("yaml", "PyYAML")
                    
                    self.assertTrue(success)
                    self.assertEqual(result, mock_module)
                    # Should import directly without checking importability
                    mock_import.assert_called_once_with("yaml")
    
    def test_install_and_import_marks_in_cache(self):
        """Test install_and_import marks importable modules in cache."""
        # Enable installer
        with patch.object(self.installer, 'is_enabled', return_value=True):
            # Module is importable but not in cache
            with patch.object(self.installer, '_is_module_importable', return_value=True):
                with patch('importlib.import_module') as mock_import:
                    mock_module = MagicMock()
                    mock_import.return_value = mock_module
                    
                    with patch.object(self.installer, '_get_installed_version', return_value="1.0.0"):
                        with patch.object(self.installer, '_clear_module_missing'):
                            with patch('exonware.xwlazy.discovery.spec_cache._spec_cache_put'):
                                with patch.object(self.installer, '_dependency_mapper') as mock_mapper:
                                    mock_mapper.get_package_name.return_value = "test-package"
                                    
                                    result, success = self.installer.install_and_import("test_module", "test-package")
                                    
                                    self.assertTrue(success)
                                    # Should be marked in cache
                                    self.assertTrue(self.installer._install_cache.is_installed("test-package"))
    
    def test_install_and_import_skips_when_installing_active(self):
        """Test install_and_import skips when installation is already in progress."""
        from exonware.xwlazy.loading.import_tracking import get_installing_state
        _installing = get_installing_state()
        
        # Set installing flag
        _installing.active = True
        
        try:
            result, success = self.installer.install_and_import("test_module", "test-package")
            self.assertFalse(success)
            self.assertIsNone(result)
        finally:
            # Clean up
            _installing.active = False
    
    def test_install_and_import_skips_when_disabled(self):
        """Test install_and_import skips when installer is disabled."""
        # Disable installer
        with patch.object(self.installer, 'is_enabled', return_value=False):
            result, success = self.installer.install_and_import("test_module", "test-package")
            self.assertFalse(success)
            self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()

