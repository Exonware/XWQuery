#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/cache_optimizer.py

"""
LRU cache for parsed grammars using xwnode's LRU_CACHE strategy.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from typing import Optional, Any

# xwnode is a required dependency per pyproject.toml
# No try/except per DEV_GUIDELINES.md Line 128
from exonware.xwnode import XWNode, NodeMode, NodeTrait


class ParserCache:
    """
    LRU cache for parsed grammars using xwnode's LRU_CACHE strategy.
    
    Provides O(1) get/put with automatic LRU eviction.
    Better than standard dict or functools.lru_cache:
    - Memory-bounded
    - Thread-safe
    - Statistics tracking
    - Custom eviction policies
    """
    
    def __init__(self, max_size: int = 128):
        self.max_size = max_size
        self._cache = XWNode(
            mode=NodeMode.LRU_CACHE,
            max_size=max_size
        )
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached parser (O(1))"""
        return self._cache.get(key)
    
    def set(self, key: str, parser: Any) -> None:
        """Cache parser (O(1) with automatic LRU eviction)"""
        self._cache.set(key, parser)
    
    def clear(self) -> None:
        """Clear all cached parsers"""
        self._cache.clear()
    
    def stats(self) -> dict:
        """Get cache statistics"""
        return {
            'size': self._cache.size(),
            'max_size': self._cache.max_size,
            'hit_rate': self._cache.hit_rate(),
            'evictions': self._cache.evictions(),
        }


class TemplateCache:
    """
    Cache for compiled output templates.
    Uses xwnode's HASH_MAP for O(1) lookups.
    """
    
    def __init__(self):
        self._cache = XWNode(
            mode=NodeMode.HASH_MAP,
            traits=NodeTrait.INDEXED
        )
    
    def get(self, template_key: str) -> Optional[Any]:
        """Get compiled template"""
        return self._cache.get(template_key)
    
    def set(self, template_key: str, compiled_template: Any) -> None:
        """Cache compiled template"""
        self._cache.set(template_key, compiled_template)
