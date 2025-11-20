#exonware/xwsyntax/tests/1.unit/optimizations_tests/test_cache_optimizer.py

"""
Unit tests for ParserCache and TemplateCache.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax.optimizations import ParserCache, TemplateCache


@pytest.mark.xwsyntax_unit
class TestParserCache:
    """Unit tests for ParserCache class."""
    
    def test_create_parser_cache(self):
        """Test creating ParserCache instance."""
        cache = ParserCache(max_size=10)
        assert cache is not None
        assert cache.max_size == 10
    
    def test_cache_set_and_get(self):
        """Test caching and retrieving parsers."""
        cache = ParserCache(max_size=10)
        
        parser_obj = {"test": "parser"}
        cache.set("test_key", parser_obj)
        
        retrieved = cache.get("test_key")
        assert retrieved == parser_obj
    
    def test_cache_get_nonexistent_returns_none(self):
        """Test getting nonexistent key returns None."""
        cache = ParserCache()
        result = cache.get("nonexistent")
        assert result is None
    
    def test_cache_clear(self):
        """Test clearing cache."""
        cache = ParserCache()
        cache.set("key1", "value1")
        cache.set("key2", "value2")
        
        cache.clear()
        
        assert cache.get("key1") is None
        assert cache.get("key2") is None
    
    def test_cache_stats(self):
        """Test cache statistics."""
        cache = ParserCache(max_size=5)
        stats = cache.stats()
        
        assert isinstance(stats, dict)
        assert 'size' in stats
        assert 'max_size' in stats


@pytest.mark.xwsyntax_unit
class TestTemplateCache:
    """Unit tests for TemplateCache class."""
    
    def test_create_template_cache(self):
        """Test creating TemplateCache instance."""
        cache = TemplateCache()
        assert cache is not None
    
    def test_cache_template(self):
        """Test caching compiled template."""
        cache = TemplateCache()
        
        template = lambda x: f"result: {x}"
        cache.set("template_key", template)
        
        retrieved = cache.get("template_key")
        assert retrieved is not None
        assert retrieved("test") == "result: test"

