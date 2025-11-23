"""
Integration Test Scenarios: YAML Integration

Real-world scenario tests for yaml import with xwlazy enabled.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.18
Generation Date: 15-Nov-2025
"""

import pytest
import sys
import os
import json
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
class TestYamlIntegration:
    """Test cases for yaml import with xwlazy enabled."""
    
    def setup_method(self):
        """Set up test fixtures."""
        # Enable lazy install if possible
        try:
            from exonware import conf
            conf.xwsystem.lazy_install = True
        except (ImportError, AttributeError):
            pass  # Skip if not available
    
    def test_yaml_import_through_xwsystem(self):
        """Test yaml import works through xwsystem."""
        # This should work without circular import
        try:
            from exonware.xwsystem.version import get_version
            version = get_version()
            assert version is not None
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                pytest.fail("Circular import detected with yaml")
            raise
        except ImportError:
            pytest.skip("xwsystem not available in test environment")
    
    def test_yaml_serializer_import(self):
        """Test yaml serializer can be imported."""
        try:
            from exonware.xwsystem.io.serialization.formats.text import YamlSerializer
            serializer = YamlSerializer()
            assert serializer is not None
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                pytest.fail("Circular import detected with yaml")
            raise
        except ImportError:
            pytest.skip("xwsystem not available in test environment")
    
    def test_yaml_serialization_works(self):
        """Test yaml serialization actually works."""
        try:
            from exonware.xwsystem.io.serialization.formats.text import YamlSerializer
            serializer = YamlSerializer()
            
            data = {"name": "test", "value": 42}
            encoded = serializer.encode(data)
            assert encoded is not None
            
            decoded = serializer.decode(encoded)
            assert decoded == data
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                pytest.fail("Circular import detected with yaml")
            raise
        except ImportError:
            pytest.skip("xwsystem not available in test environment")


@pytest.mark.xwlazy_integration
class TestCachePersistence:
    """Test cases for cache persistence."""
    
    def test_cache_file_created(self):
        """Test cache file is created after marking packages."""
        from exonware.xwlazy.common.cache import InstallationCache
        
        temp_dir = tempfile.mkdtemp()
        cache_file = Path(temp_dir) / "test_cache.json"
        
        try:
            cache = InstallationCache(cache_file=cache_file)
            cache.mark_installed("test-package", "1.0.0")
            
            # File should exist
            assert cache_file.exists()
            
            # Should be valid JSON
            with open(cache_file, 'r') as f:
                data = json.load(f)
                assert "test-package" in data
        finally:
            if cache_file.exists():
                cache_file.unlink()
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)

