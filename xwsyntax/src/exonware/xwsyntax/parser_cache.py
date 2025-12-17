#exonware/xwsyntax/src/exonware/xwsyntax/parser_cache.py
"""
Parser caching for performance optimization.
"""

from typing import Any, Optional
from functools import lru_cache
from .defs import CACHE_SIZE


class SimpleParserCache:
    """Simple dictionary-based parser cache."""
    
    def __init__(self, max_size: int = CACHE_SIZE):
        self._cache: dict[str, Any] = {}
        self._max_size = max_size
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached parser."""
        return self._cache.get(key)
    
    def set(self, key: str, parser: Any) -> None:
        """Cache parser."""
        if len(self._cache) >= self._max_size:
            # Simple FIFO eviction
            first_key = next(iter(self._cache))
            del self._cache[first_key]
        self._cache[key] = parser
    
    def clear(self) -> None:
        """Clear cache."""
        self._cache.clear()
    
    def size(self) -> int:
        """Get cache size."""
        return len(self._cache)


class LRUParserCache:
    """LRU cache for parsers using functools.lru_cache."""
    
    def __init__(self, max_size: int = CACHE_SIZE):
        self._max_size = max_size
        self._get_cached = lru_cache(maxsize=max_size)(self._get_internal)
        self._storage: dict[str, Any] = {}
    
    def _get_internal(self, key: str) -> Optional[Any]:
        """Internal cached get."""
        return self._storage.get(key)
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached parser."""
        return self._get_cached(key)
    
    def set(self, key: str, parser: Any) -> None:
        """Cache parser."""
        self._storage[key] = parser
    
    def clear(self) -> None:
        """Clear cache."""
        self._storage.clear()
        self._get_cached.cache_clear()
    
    def info(self) -> Any:
        """Get cache info."""
        return self._get_cached.cache_info()


# Default cache implementation
ParserCache = SimpleParserCache

