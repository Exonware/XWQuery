"""
Integration Tests: Installer Cache Integration

Integration tests for installer cache integration - verifies installer and cache work together.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025
"""

import pytest
import sys
import tempfile
import os
import shutil
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.package.services import LazyInstaller
from exonware.xwlazy.common.cache import InstallationCache

@pytest.mark.xwlazy_integration
class TestInstallerCacheIntegration:
    """Test cases for installer cache integration."""
    
    def setup_method(self):
        """Set up test fixtures."""
        # Create temporary cache file
        self.temp_dir = tempfile.mkdtemp()
        self.cache_file = Path(self.temp_dir) / "test_installed_packages.json"
        
        # Create installer with custom cache
        self.installer = LazyInstaller(package_name="test")
        # Replace cache with test cache
        self.installer._install_cache = InstallationCache(cache_file=self.cache_file)
    
    def teardown_method(self):
        """Clean up test fixtures."""
        if self.cache_file.exists():
            self.cache_file.unlink()
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_is_package_installed_checks_cache_first(self):
        """Test is_package_installed checks cache first."""
        # Mark package in cache
        self.installer._install_cache.mark_installed("test-package", "1.0.0")
        
        # Should return True without checking importability
        with patch.object(self.installer, '_is_module_importable') as mock_importable:
            result = self.installer.is_package_installed("test-package")
            assert result is True
            # Should not call importability check
            mock_importable.assert_not_called()
    
    def test_is_package_installed_falls_back_to_importability(self):
        """Test is_package_installed falls back to importability check."""
        # Package not in cache
        with patch.object(self.installer, '_is_module_importable', return_value=True):
            with patch.object(self.installer, '_get_installed_version', return_value="1.0.0"):
                result = self.installer.is_package_installed("test-package")
                assert result is True
                # Should now be in cache
                assert self.installer._install_cache.is_installed("test-package")
    
    def test_install_package_marks_in_cache(self):
        """Test install_package marks package in cache after successful install."""
        with patch.object(self.installer, '_get_installed_version', return_value="1.0.0"):
            # Mock successful installation
            with patch.object(self.installer, '_finalize_install_success') as mock_finalize:
                # Simulate successful install
                self.installer._installed_packages.add("test-package")
                self.installer._finalize_install_success("test-package", "pip")
                
                # Should be marked in persistent cache
                assert self.installer._install_cache.is_installed("test-package")
    
    def test_install_and_import_checks_cache_first(self):
        """Test install_and_import checks cache first."""
        # Mark package in cache
        self.installer._install_cache.mark_installed("PyYAML", "6.0")
        
        # Enable installer
        with patch.object(self.installer, 'is_enabled', return_value=True):
            with patch('importlib.import_module') as mock_import:
                mock_module = MagicMock()
                mock_import.return_value = mock_module
                
                with patch.object(self.installer, '_clear_module_missing'):
                    with patch('exonware.xwlazy.common.services.spec_cache._spec_cache_put'):
                        result, success = self.installer.install_and_import("yaml", "PyYAML")
                        
                        assert success is True
                        assert result == mock_module
                        # Should not attempt installation
                        mock_import.assert_called_once_with("yaml")
    
    def test_cache_persistence_across_restarts(self):
        """Test cache persists across Python restarts."""
        # Mark package in cache
        self.installer._install_cache.mark_installed("test-package", "1.0.0")
        
        # Create new installer instance (simulating restart)
        new_installer = LazyInstaller(package_name="test")
        new_installer._install_cache = InstallationCache(cache_file=self.cache_file)
        
        # Should still know package is installed
        assert new_installer.is_package_installed("test-package")

