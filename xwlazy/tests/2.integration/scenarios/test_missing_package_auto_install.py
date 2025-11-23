"""
Integration Test Scenarios: Missing Package Auto-Install

Real-world scenario tests for missing package auto-install and json_run.py scenario.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.18
Generation Date: 15-Nov-2025
"""

import pytest
import sys
import os
import subprocess
import tempfile
import shutil
from pathlib import Path

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


@pytest.mark.xwlazy_integration
class TestMissingPackageAutoInstall:
    """Test cases for missing package auto-install."""
    
    def setup_method(self):
        """Set up test fixtures."""
        # Enable lazy install if possible
        try:
            from exonware import conf
            conf.xwsystem.lazy_install = True
        except (ImportError, AttributeError):
            pass  # Skip if not available
    
    def test_json_run_scenario(self):
        """Test json_run.py scenario works correctly."""
        # Get the json_run.py path
        json_run_path = project_root.parent / "xwsystem" / "examples" / "lazy_mode_usage" / "json_run.py"
        
        if not json_run_path.exists():
            pytest.skip("json_run.py not found")
        
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
            assert result.returncode == 0, (
                f"json_run.py failed with:\nSTDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
            )
            
            # Should not have circular import errors
            assert "partially initialized module 'yaml'" not in result.stderr
            assert "circular import" not in result.stderr.lower()
            
        except subprocess.TimeoutExpired:
            pytest.fail("json_run.py timed out")
        except Exception as e:
            pytest.fail(f"Failed to run json_run.py: {e}")
    
    def test_cache_persistence_across_imports(self):
        """Test cache persists across multiple imports."""
        from exonware.xwlazy.common.cache import InstallationCache
        
        temp_dir = tempfile.mkdtemp()
        cache_file = Path(temp_dir) / "test_cache.json"
        
        try:
            # Create first cache instance and mark package
            cache1 = InstallationCache(cache_file=cache_file)
            cache1.mark_installed("test-package", "1.0.0")
            
            # Create second cache instance (simulating restart)
            cache2 = InstallationCache(cache_file=cache_file)
            
            # Should still know package is installed
            assert cache2.is_installed("test-package")
            assert cache2.get_version("test-package") == "1.0.0"
        finally:
            if cache_file.exists():
                cache_file.unlink()
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)
    
    def test_installer_uses_cache_for_already_installed(self):
        """Test installer uses cache to avoid re-installing."""
        from exonware.xwlazy.package.services import LazyInstaller
        from exonware.xwlazy.common.cache import InstallationCache
        
        temp_dir = tempfile.mkdtemp()
        cache_file = Path(temp_dir) / "test_cache.json"
        
        try:
            installer = LazyInstaller(package_name="test")
            # Replace with test cache
            installer._install_cache = InstallationCache(cache_file=cache_file)
            
            # Mark package as installed in cache
            installer._install_cache.mark_installed("test-package", "1.0.0")
            
            # Check if package is installed (should use cache)
            is_installed = installer.is_package_installed("test-package")
            assert is_installed is True
            
            # Should also be in in-memory cache now
            assert "test-package" in installer._installed_packages
        finally:
            if cache_file.exists():
                cache_file.unlink()
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.mark.xwlazy_integration
class TestJsonRunIntegration:
    """Test cases specifically for json_run.py integration."""
    
    def setup_method(self):
        """Set up test fixtures."""
        # Enable lazy install if possible
        try:
            from exonware import conf
            conf.xwsystem.lazy_install = True
        except (ImportError, AttributeError):
            pass  # Skip if not available
    
    def test_json_run_imports_xwsystem(self):
        """Test json_run.py can import xwsystem without errors."""
        try:
            # This should work without circular import
            from exonware.xwsystem.version import get_version
            version = get_version()
            assert version is not None
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                pytest.fail("Circular import detected with yaml in json_run scenario")
            raise
        except ImportError:
            pytest.skip("xwsystem not available in test environment")
    
    def test_json_run_uses_bson_serializer(self):
        """Test json_run.py can use BSON serializer."""
        try:
            from exonware.xwsystem.io.serialization.formats.binary import BsonSerializer
            
            serializer = BsonSerializer()
            data = {"name": "John", "age": 30}
            result = serializer.encode(data)
            
            assert result is not None
            # Should be bytes for BSON
            assert isinstance(result, bytes)
        except ImportError:
            # If pymongo is not installed, that's expected in some test scenarios
            # The lazy installer should handle it
            pytest.skip("BSON serializer dependencies not available")
        except AttributeError as e:
            if "partially initialized module" in str(e):
                pytest.fail("Circular import detected in json_run scenario")
            raise

