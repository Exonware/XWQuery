"""
#exonware/xwlazy/tests/test_install_cache.py

Unit tests for InstallationCache.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.17
Generation Date: 15-Nov-2025
"""

import unittest
import tempfile
import json
import os
from pathlib import Path
from unittest.mock import patch, mock_open

from exonware.xwlazy.installation.install_cache import InstallationCache


class TestInstallationCache(unittest.TestCase):
    """Test cases for InstallationCache."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Create temporary cache file for each test
        self.temp_dir = tempfile.mkdtemp()
        self.cache_file = Path(self.temp_dir) / "test_installed_packages.json"
        self.cache = InstallationCache(cache_file=self.cache_file)
    
    def tearDown(self):
        """Clean up test fixtures."""
        # Remove temporary cache file
        if self.cache_file.exists():
            self.cache_file.unlink()
        # Remove temp directory (use shutil for recursive removal)
        if self.temp_dir and os.path.exists(self.temp_dir):
            import shutil
            shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_cache_initialization(self):
        """Test cache initialization creates empty cache."""
        self.assertEqual(len(self.cache), 0)
        self.assertFalse(self.cache.is_installed("test-package"))
    
    def test_mark_installed(self):
        """Test marking package as installed."""
        self.cache.mark_installed("test-package", "1.0.0")
        
        self.assertTrue(self.cache.is_installed("test-package"))
        self.assertEqual(self.cache.get_version("test-package"), "1.0.0")
        self.assertEqual(len(self.cache), 1)
    
    def test_mark_uninstalled(self):
        """Test marking package as uninstalled."""
        self.cache.mark_installed("test-package", "1.0.0")
        self.assertTrue(self.cache.is_installed("test-package"))
        
        self.cache.mark_uninstalled("test-package")
        self.assertFalse(self.cache.is_installed("test-package"))
        # Package should still be in cache, just marked as not installed
        self.assertEqual(len(self.cache), 1)
    
    def test_persistence(self):
        """Test cache persistence across instances."""
        # Mark package as installed
        self.cache.mark_installed("test-package", "1.0.0")
        
        # Create new cache instance with same file
        new_cache = InstallationCache(cache_file=self.cache_file)
        
        # Should load from file
        self.assertTrue(new_cache.is_installed("test-package"))
        self.assertEqual(new_cache.get_version("test-package"), "1.0.0")
    
    def test_get_all_installed(self):
        """Test getting all installed packages."""
        self.cache.mark_installed("package1", "1.0.0")
        self.cache.mark_installed("package2", "2.0.0")
        self.cache.mark_installed("package3", "3.0.0")
        self.cache.mark_uninstalled("package3")  # Mark one as uninstalled
        
        installed = self.cache.get_all_installed()
        
        self.assertEqual(len(installed), 2)
        self.assertIn("package1", installed)
        self.assertIn("package2", installed)
        self.assertNotIn("package3", installed)
    
    def test_clear(self):
        """Test clearing cache."""
        self.cache.mark_installed("package1", "1.0.0")
        self.cache.mark_installed("package2", "2.0.0")
        
        self.assertEqual(len(self.cache), 2)
        
        self.cache.clear()
        
        self.assertEqual(len(self.cache), 0)
        self.assertFalse(self.cache.is_installed("package1"))
        self.assertFalse(self.cache.is_installed("package2"))
    
    def test_load_corrupted_cache(self):
        """Test loading corrupted cache file."""
        # Write invalid JSON
        with open(self.cache_file, 'w') as f:
            f.write("invalid json{")
        
        # Should handle gracefully and create empty cache
        cache = InstallationCache(cache_file=self.cache_file)
        self.assertEqual(len(cache), 0)
    
    def test_load_missing_cache(self):
        """Test loading non-existent cache file."""
        # Cache file doesn't exist
        missing_file = Path(self.temp_dir) / "missing.json"
        cache = InstallationCache(cache_file=missing_file)
        
        # Should create empty cache
        self.assertEqual(len(cache), 0)
        # File should be created after marking something
        cache.mark_installed("test", "1.0.0")
        self.assertTrue(missing_file.exists())
        # Clean up
        if missing_file.exists():
            missing_file.unlink()
    
    def test_get_version_nonexistent(self):
        """Test getting version of non-existent package."""
        version = self.cache.get_version("nonexistent")
        self.assertIsNone(version)
    
    def test_get_version_uninstalled(self):
        """Test getting version of uninstalled package."""
        self.cache.mark_installed("test", "1.0.0")
        self.cache.mark_uninstalled("test")
        
        version = self.cache.get_version("test")
        self.assertIsNone(version)  # Uninstalled packages return None
    
    def test_thread_safety(self):
        """Test cache operations are thread-safe."""
        import threading
        
        def mark_packages(start, count):
            for i in range(start, start + count):
                self.cache.mark_installed(f"package{i}", f"{i}.0.0")
        
        # Create multiple threads
        threads = []
        for i in range(0, 10, 2):
            t = threading.Thread(target=mark_packages, args=(i, 2))
            threads.append(t)
            t.start()
        
        # Wait for all threads
        for t in threads:
            t.join()
        
        # All packages should be marked as installed
        installed = self.cache.get_all_installed()
        self.assertEqual(len(installed), 10)
        for i in range(10):
            self.assertIn(f"package{i}", installed)


if __name__ == '__main__':
    unittest.main()

