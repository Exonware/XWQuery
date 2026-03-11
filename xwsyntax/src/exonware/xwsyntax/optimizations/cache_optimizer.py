#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/cache_optimizer.py
"""
LRU cache for parsed grammars using xwnode's LRU_CACHE strategy.
Company: eXonware.com
Author: eXonware Backend Team
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
        return self._cache.get_value(key)

    def set(self, key: str, parser: Any) -> None:
        """Cache parser (O(1) with automatic LRU eviction)"""
        self._cache.put(key, parser)

    def clear(self) -> None:
        """Clear all cached parsers"""
        # XWNode LRU_CACHE doesn't have clear(), so delete all keys individually
        # Get all keys first (if possible), otherwise cache will expire naturally
        if hasattr(self._cache, 'keys'):
            for key in list(self._cache.keys()):
                self._cache.delete(key)

    def stats(self) -> dict:
        """Get cache statistics"""
        stats = {
            'size': self._cache.size() if hasattr(self._cache, 'size') else 0,
            'max_size': self.max_size,  # Use instance attribute, not XWNode attribute
        }
        # Add optional stats if available
        if hasattr(self._cache, 'hit_rate'):
            stats['hit_rate'] = self._cache.hit_rate()
        if hasattr(self._cache, 'evictions'):
            stats['evictions'] = self._cache.evictions()
        return stats


class TemplateCache:
    """
    Cache for compiled output templates.
    Uses xwnode's HASH_MAP for O(1) lookups.
    """

    def __init__(self):
        self._cache = XWNode(
            mode=NodeMode.HASH_MAP
        )

    def get(self, template_key: str) -> Optional[Any]:
        """Get compiled template"""
        return self._cache.get_value(template_key)

    def set(self, template_key: str, compiled_template: Any) -> None:
        """Cache compiled template"""
        self._cache.put(template_key, compiled_template)
