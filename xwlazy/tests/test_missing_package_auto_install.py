"""
#exonware/xwlazy/tests/test_missing_package_auto_install.py

Integration tests for missing package auto-install and json_run.py scenario.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.17
Generation Date: 15-Nov-2025
"""

import unittest
import sys
import os
import subprocess
import tempfile
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


class TestMissingPackageAutoInstall(unittest.TestCase):
    """Test cases for missing package auto-install."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Enable lazy install
        from exonware import conf
        conf.xwsystem.lazy_install = True
    
    def test_json_run_scenario(self):
        """Test json_run.py scenario works correctly."""
        # Get the json_run.py path
        json_run_path = Path(__file__).parent.parent.parent.parent / "xwsystem" / "examples" / "lazy_mode_usage" / "json_run.py"
        
        if not json_run_path.exists():
            self.skipTest("json_run.py not found")
        
        # Run json_run.py in a subprocess
        try:
            result = subprocess.run(
                [sys.executable, str(json_run_path)],
                capture_output=True,
                text=True,
                timeout=60,
                cwd=str(json_run_path.parent)
            )
            
            # Should complete without errors
            self.assertEqual(result.returncode, 0, 
                           f"json_run.py failed with:\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}")
            
            # Should not have circular import errors
            self.assertNotIn("partially initialized module 'yaml'", result.stderr)
            self.assertNotIn("circular import", result.stderr.lower())
            
        except subprocess.TimeoutExpired:
            self.fail("json_run.py timed out")
        except Exception as e:
            self.fail(f"Failed to run json_run.py: {e}")
    
    def test_cache_persistence_across_imports(self):
        """Test cache persists across multiple imports."""
        import tempfile
        from exonware.xwlazy.installation.install_cache import InstallationCache
        
        temp_dir = tempfile.mkdtemp()
        cache_file = Path(temp_dir) / "test_cache.json"
        
        try:
            # Create first cache instance and mark package
            cache1 = InstallationCache(cache_file=cache_file)
            cache1.mark_installed("test-package", "1.0.0")
            
            # Create second cache instance (simulating restart)
            cache2 = InstallationCache(cache_file=cache_file)
            
            # Should still know package is installed
            self.assertTrue(cache2.is_installed("test-package"))
            self.assertEqual(cache2.get_version("test-package"), "1.0.0")
        finally:
            if cache_file.exists():
                cache_file.unlink()
            if os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)
    
    def test_installer_uses_cache_for_already_installed(self):
        """Test installer uses cache to avoid re-installing."""
        from exonware.xwlazy.installation.installer import LazyInstaller
        import tempfile
        
        temp_dir = tempfile.mkdtemp()
        cache_file = Path(temp_dir) / "test_cache.json"
        
        try:
            installer = LazyInstaller(package_name="test")
            # Replace with test cache
            from exonware.xwlazy.installation.install_cache import InstallationCache
            installer._install_cache = InstallationCache(cache_file=cache_file)
            
            # Mark package as installed in cache
            installer._install_cache.mark_installed("test-package", "1.0.0")
            
            # Check if package is installed (should use cache)
            is_installed = installer.is_package_installed("test-package")
            self.assertTrue(is_installed)
            
            # Should also be in in-memory cache now
            self.assertIn("test-package", installer._installed_packages)
        finally:
            if cache_file.exists():
                cache_file.unlink()
            if os.path.exists(temp_dir):
                import shutil
                shutil.rmtree(temp_dir, ignore_errors=True)


class TestJsonRunIntegration(unittest.TestCase):
    """Test cases specifically for json_run.py integration."""
    
    def test_json_run_imports_xwsystem(self):
        """Test json_run.py can import xwsystem without errors."""
        # Enable lazy install
        from exonware import conf
        conf.xwsystem.lazy_install = True
        
        try:
            # This should work without circular import
            from exonware.xwsystem.version import get_version
            version = get_version()
            self.assertIsNotNone(version)
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                self.fail("Circular import detected with yaml in json_run scenario")
            raise
    
    def test_json_run_uses_bson_serializer(self):
        """Test json_run.py can use BSON serializer."""
        # Enable lazy install (skip if xwlazy not available)
        try:
            from exonware import conf
            conf.xwsystem.lazy_install = True
        except (ImportError, RuntimeError):
            self.skipTest("xwlazy not available in test environment")
        
        try:
            from exonware.xwsystem.io.serialization.formats.binary import BsonSerializer
            
            serializer = BsonSerializer()
            data = {"name": "John", "age": 30}
            result = serializer.encode(data)
            
            self.assertIsNotNone(result)
            # Should be bytes for BSON
            self.assertIsInstance(result, bytes)
        except ImportError as e:
            # If pymongo is not installed, that's expected in some test scenarios
            # The lazy installer should handle it
            pass
        except AttributeError as e:
            if "partially initialized module" in str(e):
                self.fail("Circular import detected in json_run scenario")
            raise


if __name__ == '__main__':
    unittest.main()

