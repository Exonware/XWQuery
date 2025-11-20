"""
#exonware/xwlazy/tests/test_yaml_integration.py

Integration tests for yaml import with xwlazy.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.17
Generation Date: 15-Nov-2025
"""

import unittest
import sys
import os
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


class TestYamlIntegration(unittest.TestCase):
    """Test cases for yaml import with xwlazy enabled."""
    
    def setUp(self):
        """Set up test fixtures."""
        # Enable lazy install
        from exonware import conf
        conf.xwsystem.lazy_install = True
    
    def test_yaml_import_through_xwsystem(self):
        """Test yaml import works through xwsystem."""
        # This should work without circular import
        try:
            from exonware.xwsystem.version import get_version
            version = get_version()
            self.assertIsNotNone(version)
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                self.fail("Circular import detected with yaml")
            raise
    
    def test_yaml_serializer_import(self):
        """Test yaml serializer can be imported."""
        try:
            from exonware.xwsystem.io.serialization.formats.text import YamlSerializer
            serializer = YamlSerializer()
            self.assertIsNotNone(serializer)
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                self.fail("Circular import detected with yaml")
            raise
    
    def test_yaml_serialization_works(self):
        """Test yaml serialization actually works."""
        try:
            from exonware.xwsystem.io.serialization.formats.text import YamlSerializer
            serializer = YamlSerializer()
            
            data = {"name": "test", "value": 42}
            encoded = serializer.encode(data)
            self.assertIsNotNone(encoded)
            
            decoded = serializer.decode(encoded)
            self.assertEqual(decoded, data)
        except AttributeError as e:
            if "partially initialized module 'yaml'" in str(e):
                self.fail("Circular import detected with yaml")
            raise


class TestCachePersistence(unittest.TestCase):
    """Test cases for cache persistence."""
    
    def test_cache_file_created(self):
        """Test cache file is created after marking packages."""
        import tempfile
        from exonware.xwlazy.installation.install_cache import InstallationCache
        
        temp_dir = tempfile.mkdtemp()
        cache_file = Path(temp_dir) / "test_cache.json"
        
        try:
            cache = InstallationCache(cache_file=cache_file)
            cache.mark_installed("test-package", "1.0.0")
            
            # File should exist
            self.assertTrue(cache_file.exists())
            
            # Should be valid JSON
            import json
            with open(cache_file, 'r') as f:
                data = json.load(f)
                self.assertIn("test-package", data)
        finally:
            if cache_file.exists():
                cache_file.unlink()
            if os.path.exists(temp_dir):
                os.rmdir(temp_dir)


if __name__ == '__main__':
    unittest.main()

