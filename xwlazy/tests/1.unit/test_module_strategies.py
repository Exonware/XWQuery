"""
Unit Tests: Module Strategies

Tests all module strategy implementations in detail.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, patch, MagicMock

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.module.strategies import (
    SimpleHelper,
    LazyHelper,
    SimpleManager,
    AdvancedManager,
)
from exonware.xwlazy.common.strategies import LRUCache

@pytest.mark.xwlazy_unit
class TestSimpleHelper:
    """Test SimpleHelper strategy."""
    
    def test_simple_helper_initialization(self):
        """Test SimpleHelper can be instantiated."""
        strategy = SimpleHelper()
        assert strategy is not None
    
    @patch('importlib.import_module')
    def test_simple_helper_load(self, mock_import):
        """Test SimpleHelper.load."""
        mock_module = MagicMock()
        mock_import.return_value = mock_module
        
        strategy = SimpleHelper()
        result = strategy.load("test.module", None)
        assert result is mock_module
        mock_import.assert_called_once_with("test.module")
    
    def test_simple_helper_unload(self):
        """Test SimpleHelper.unload."""
        strategy = SimpleHelper()
        # Should not raise
        strategy.unload("test.module")
    
    @patch('importlib.util.find_spec')
    def test_simple_helper_check_importability(self, mock_find_spec):
        """Test SimpleHelper.check_importability."""
        mock_find_spec.return_value = MagicMock()
        strategy = SimpleHelper()
        result = strategy.check_importability("test.module")
        assert result == True

@pytest.mark.xwlazy_unit
class TestLazyHelper:
    """Test LazyHelper strategy."""
    
    def test_lazy_helper_initialization(self):
        """Test LazyHelper can be instantiated."""
        strategy = LazyHelper()
        assert strategy is not None
    
    @patch('importlib.import_module')
    def test_lazy_helper_load(self, mock_import):
        """Test LazyHelper.load."""
        mock_module = MagicMock()
        mock_import.return_value = mock_module
        
        strategy = LazyHelper()
        result = strategy.load("test.module", None)
        assert result is mock_module

@pytest.mark.xwlazy_unit
class TestSimpleManager:
    """Test SimpleManager strategy."""
    
    def test_simple_manager_initialization(self):
        """Test SimpleManager can be instantiated."""
        caching = LRUCache(max_size=100)
        helper = SimpleHelper()
        strategy = SimpleManager("test_pkg", caching, helper)
        assert strategy is not None
    
    @patch('importlib.import_module')
    def test_simple_manager_load_module(self, mock_import):
        """Test SimpleManager.load_module uses cache."""
        mock_module = MagicMock()
        mock_import.return_value = mock_module
        
        caching = LRUCache(max_size=100)
        helper = SimpleHelper()
        strategy = SimpleManager("test_pkg", caching, helper)
        
        # First load
        result1 = strategy.load_module("test.module")
        assert result1 is mock_module
        
        # Second load should use cache
        result2 = strategy.load_module("test.module")
        assert result2 is mock_module
        # Should only import once (cached)
        assert mock_import.call_count == 1
    
    def test_simple_manager_unload_module(self):
        """Test SimpleManager.unload_module."""
        caching = LRUCache(max_size=100)
        helper = SimpleHelper()
        strategy = SimpleManager("test_pkg", caching, helper)
        # Should not raise
        strategy.unload_module("test.module")
    
    def test_simple_manager_install_hook(self):
        """Test SimpleManager.install_hook does nothing."""
        caching = LRUCache(max_size=100)
        helper = SimpleHelper()
        strategy = SimpleManager("test_pkg", caching, helper)
        # Should not raise
        strategy.install_hook()
    
    def test_simple_manager_handle_import_error(self):
        """Test SimpleManager.handle_import_error returns None."""
        caching = LRUCache(max_size=100)
        helper = SimpleHelper()
        strategy = SimpleManager("test_pkg", caching, helper)
        result = strategy.handle_import_error("test.module")
        assert result is None

@pytest.mark.xwlazy_unit
class TestAdvancedManager:
    """Test AdvancedManager strategy."""
    
    def test_advanced_manager_initialization(self):
        """Test AdvancedManager can be instantiated."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        package_helper = XWPackageHelper("test_pkg")
        caching = LRUCache(max_size=100)
        helper = LazyHelper()
        strategy = AdvancedManager("test_pkg", package_helper, caching, helper)
        assert strategy is not None
    
    def test_advanced_manager_install_hook(self):
        """Test AdvancedManager.install_hook."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        package_helper = XWPackageHelper("test_pkg")
        caching = LRUCache(max_size=100)
        helper = LazyHelper()
        strategy = AdvancedManager("test_pkg", package_helper, caching, helper)
        # Should not raise
        strategy.install_hook()

@pytest.mark.xwlazy_unit
class TestLRUCache:
    """Test LRUCache strategy."""
    
    def test_lru_cache_initialization(self):
        """Test LRUCache can be instantiated."""
        cache = LRUCache(max_size=100)
        assert cache is not None
    
    def test_lru_cache_get_set(self):
        """Test LRUCache get and set."""
        cache = LRUCache(max_size=100)
        cache.set("key1", "value1")
        assert cache.get("key1") == "value1"
    
    def test_lru_cache_invalidate(self):
        """Test LRUCache invalidate."""
        cache = LRUCache(max_size=100)
        cache.set("key1", "value1")
        cache.invalidate("key1")
        assert cache.get("key1") is None
    
    def test_lru_cache_clear(self):
        """Test LRUCache clear."""
        cache = LRUCache(max_size=100)
        cache.set("key1", "value1")
        cache.set("key2", "value2")
        cache.clear()
        assert cache.get("key1") is None
        assert cache.get("key2") is None
    
    def test_lru_cache_max_size(self):
        """Test LRUCache respects max_size."""
        cache = LRUCache(max_size=2)
        cache.set("key1", "value1")
        cache.set("key2", "value2")
        cache.set("key3", "value3")  # Should evict key1
        assert cache.get("key1") is None
        assert cache.get("key2") == "value2"
        assert cache.get("key3") == "value3"

