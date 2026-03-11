#!/usr/bin/env python3
"""
xwquery - Unified Query System (XWQS) and library (REF_01_REQ, REF_14_DX, REF_15_API)
One universal script converts anything to anything; executes on node-based or
table-based structures. Used by xwstorage, xwaction, xwbase. Zone execution
(e.g. S3) converts to XWQS first. REF_22_PROJECT.
"""

from __future__ import annotations
# =============================================================================
# XWLAZY INTEGRATION - Auto-install missing dependencies silently (EARLY)
# =============================================================================
# Activate xwlazy BEFORE other imports to enable auto-installation of missing dependencies
# This enables silent auto-installation of missing libraries when they are imported
try:
    from exonware.xwlazy import auto_enable_lazy
    auto_enable_lazy(__package__ or "exonware.xwquery", mode="smart")
except ImportError:
    # xwlazy not installed - lazy mode simply stays disabled (normal behavior)
    pass
from typing import Optional
from exonware.xwsystem import get_logger
from .version import __version__, get_version, get_version_info
logger = get_logger(__name__)
# Configuration
from .config import XWQueryConfig, get_config, set_config, reset_config
# Type definitions
from .defs import (
    QueryMode, QueryOptimization, ParserMode, FormatType,
    OperationType, ExecutionStatus, OperationCapability,
    ALL_OPERATIONS, OPERATION_CATEGORIES
)
# Errors
from .errors import (
    XWQueryError, XWQueryValueError, XWQueryTypeError,
    XWQueryParseError, XWQueryExecutionError, XWQueryTimeoutError,
    XWQuerySecurityError, XWQueryLimitError, XWQueryFormatError,
    UnsupportedOperationError, UnsupportedFormatError,
    XWQueryOptimizationError
)
# Base classes (from root)
from .contracts import (
    QueryAction,
    ExecutionContext,
    ExecutionResult,
    IOperationExecutor,
    IOperationsExecutionEngine,
)
from .base import (
    AOperationExecutor,
    AOperationsExecutionEngine,
    AParamExtractor,
    AQueryStrategy,
)
# High-level namespaces for the two responsibilities
from . import compiler, runtime
# Enhanced facade
from .facade import (
    XWQueryFacade,
    quick_select, quick_filter, quick_aggregate,
    build_select, build_insert, build_update, build_delete,
    explain, benchmark
)
# Re-export key compiler/runtime symbols
from .compiler import (
    XWQSStrategy,
    SQLStrategy,
    GraphQLStrategy,
    CypherStrategy,
    SPARQLStrategy,
    XWQueryScriptStrategy,
    SQLParamExtractor,
    QueryFormatDetector,
    detect_query_format,
    parse_sql,
    parse_xpath,
    generate_sql,
    generate_xpath,
    UniversalQueryConverter,
    sql_to_xpath,
    xpath_to_sql,
    convert_query,
)
from .runtime import (
    NativeOperationsExecutionEngine,
    NativeOperationsExecutionEngine,
    XWNodeOperationsExecutionEngine,
    XWStorageOperationsExecutionEngine,
    get_operation_registry,
    register_operation,
    check_operation_compatibility,
    QueryPlanner,
    SimpleCostModel,
    InMemoryStatisticsManager,
    QueryOptimizer,
    QueryCache,
    get_global_cache,
    set_global_cache,
    OptimizationLevel,
    PlanNodeType,
    JoinType,
    ScanType,
    get_metrics,
    reset_metrics,
)


class XWQuery:
    """
    Main facade for XWQuery - Universal Query Language for Python.
    This class provides a clean, simple API for querying any data structure
    with SQL-like syntax and converting between multiple query formats.
    """

    def __init__(self, engine: Optional[IOperationsExecutionEngine] = None):
        """
        Initialize XWQuery with execution engine.
        Args:
            engine: Optional operations execution engine. If not provided,
                   uses NativeOperationsExecutionEngine as default.
        """
        from .compiler.strategies.xwqs import XWQSStrategy
        self._engine = engine or NativeOperationsExecutionEngine()
        self._parser = XWQSStrategy()
    @staticmethod

    def execute(
        query: str,
        data: any,
        format: Optional[str] = None,
        auto_detect: bool = True,
        engine: Optional[IOperationsExecutionEngine] = None,
        **kwargs
    ) -> ExecutionResult:
        """
        Execute a query on data with auto-format detection.
        Optimized with:
        - Cached format detection
        - Cached query parsing
        - Pluggable execution engine (defaults to NativeOperationsExecutionEngine)
        Args:
            query: Query string (any supported format)
            data: Target data to query (can be XWNode, dict, list, etc.)
            format: Explicit format (overrides auto-detection)
            auto_detect: Enable auto-detection if format not specified (default: True)
            engine: Optional operations execution engine. If not provided, uses
                   NativeOperationsExecutionEngine. Can be SqlOperationsExecutionEngine
                   from xwstorage, or other engine implementations.
            **kwargs: Additional execution options
                - use_cache: Enable caching (default: True, respects config)
                - variables: Query variables
        Returns:
            ExecutionResult with query results
        Example:
            >>> # Auto-detect format (SQL) - uses native engine
            >>> result = XWQuery.execute("SELECT * FROM users WHERE age > 25", data)
            >>> # Explicit format with custom engine (from xwstorage)
            >>> from exonware.xwstorage import SqlOperationsExecutionEngine
            >>> sql_engine = SqlOperationsExecutionEngine(connection)
            >>> result = XWQuery.execute("SELECT * FROM users", data, format='sql', engine=sql_engine)
        """
        from .compiler.parsers.format_detector import detect_query_format
        from exonware.xwsystem.caching import create_cache, compute_checksum
        from .config import get_config
        config = get_config()
        use_cache = kwargs.pop('use_cache', True) and config.enable_query_caching
        # Auto-detect format if not specified (with caching)
        if not format and auto_detect:
            # Try cache first
            detected_format = None
            confidence = 0.0
            if use_cache:
                # Use xwsystem cache directly
                format_cache = create_cache(capacity=512, namespace='xwquery.compiler', name='format_cache')
                cache_key = compute_checksum(query, algorithm='sha256')
                cached_result = format_cache.get(cache_key)
                if cached_result:
                    detected_format, confidence = cached_result
                    logger.debug(f"Using cached format detection: {detected_format} (confidence: {confidence:.0%})")
            # Detect if not cached
            if detected_format is None:
                detected_format, confidence = detect_query_format(query)
                # Cache the result
                if use_cache:
                    format_cache = create_cache(capacity=512, namespace='xwquery.compiler', name='format_cache')
                    cache_key = compute_checksum(query, algorithm='sha256')
                    format_cache.put(cache_key, (detected_format, confidence))
                logger.debug(f"Auto-detected query format: {detected_format} (confidence: {confidence:.0%})")
            format = detected_format.lower()
            # Warn if low confidence
            if confidence < 0.8:
                logger.warning(
                    f"Low confidence format detection ({confidence:.0%}). "
                    f"Consider specifying format explicitly with format='{format}' parameter."
                )
        elif not format:
            # No auto-detect, default to SQL
            format = 'sql'
        # Step 1: Parse query string → QueryAction AST (separate concern)
        # Try to get parsed query from cache
        actions_tree = None
        if use_cache:
            query_cache = create_cache(capacity=1024, namespace='xwquery.compiler', name='query_cache')
            cache_key = compute_checksum((query, format) if format else (query,), algorithm='sha256')
            actions_tree = query_cache.get(cache_key)
        # Parse query if not cached
        if actions_tree is None:
            from .compiler.strategies.xwqs import XWQSStrategy
            # Parse query to QueryAction tree
            parser = XWQSStrategy()
            format_lower = (format or '').lower()
            # For xwqs/xwquery: use SQLParamExtractor-based parse_script (handles SQL-like lines)
            if format_lower in ('xwquery', 'xwqs'):
                parsed_strategy = parser.parse_script(query)
            elif format:
                # Use format-specific parsing (grammar-based)
                parsed_strategy = parser.from_format(query, format)
            else:
                parsed_strategy = parser.parse_script(query)
            actions_tree = parsed_strategy._actions_tree
            # Cache parsed query
            if use_cache:
                query_cache = create_cache(capacity=1024, namespace='xwquery.compiler', name='query_cache')
                cache_key = compute_checksum((query, format) if format else (query,), algorithm='sha256')
                query_cache.put(cache_key, actions_tree)
        # Step 2: Select appropriate engine based on data type
        if engine is None:
            # Check if data is a file path (serialization source)
            from pathlib import Path
            is_file_path = isinstance(data, (str, Path)) and (
                Path(str(data)).exists() or 
                Path(str(data)).suffix in ('.json', '.jsonl', '.ndjson', '.bson', '.xwjson', '.xwj')
            )
            # Check if query contains serialization operations (LOAD/STORE/FILE_SOURCE)
            has_serialization_ops = False
            if actions_tree:
                def _check_has_serialization_ops(node):
                    """Recursively check if tree contains serialization operations."""
                    if node.type in ("LOAD", "STORE", "FILE_SOURCE"):
                        return True
                    children = node.children if hasattr(node, 'children') else node.get_children() if hasattr(node, 'get_children') else []
                    return any(_check_has_serialization_ops(child) for child in children)
                has_serialization_ops = _check_has_serialization_ops(actions_tree)
            if is_file_path or has_serialization_ops:
                # Serialization - use serialization engine (lazy import to avoid circular deps)
                from .runtime.engines.serialization_engine import SerializationOperationsExecutionEngine
                engine = SerializationOperationsExecutionEngine()
            elif isinstance(data, (dict, list, tuple, int, float, bool)) or data is None:
                # Native Python - use default engine
                engine = NativeOperationsExecutionEngine()
            elif isinstance(data, str):
                # String but not a file path - treat as native Python
                engine = NativeOperationsExecutionEngine()
            elif hasattr(data, '_strategy') or hasattr(data, 'get') or hasattr(data, 'to_native'):
                # XWNode - use XWNode engine (lazy import to avoid circular deps)
                from .runtime.engines.xwnode_engine import XWNodeOperationsExecutionEngine
                engine = XWNodeOperationsExecutionEngine()
            elif hasattr(data, 'connection') or hasattr(data, 'execute_sql'):
                # Database - use Storage engine (lazy import to avoid circular deps)
                from .runtime.engines.xwstorage_engine import XWStorageOperationsExecutionEngine
                engine = XWStorageOperationsExecutionEngine(data)
            else:
                # Unknown - default to native
                engine = NativeOperationsExecutionEngine()
        # Step 3: Create execution context with native data (no adapters)
        context = ExecutionContext(
            node=data,  # Native Python OR XWNode OR database connection
            variables=kwargs.get('variables', {}),
            options=kwargs
        )
        # Step 4: Execute QueryAction AST
        return engine.execute_tree(actions_tree, context)
    @staticmethod

    def parse(query: str, source_format: str = 'xwquery') -> QueryAction:
        """
        Parse a query string into QueryAction tree.
        Args:
            query: Query string
            source_format: Query format ('xwquery', 'sql', 'graphql', etc.)
        Returns:
            QueryAction tree (which extends ANode)
        Example:
            >>> actions_tree = XWQuery.parse("SELECT * FROM users")
            >>> print(actions_tree.to_native())
        """
        from .compiler.strategies.xwqs import XWQSStrategy
        parser = XWQSStrategy()
        if source_format.lower() == 'xwquery':
            # parse_script returns the strategy, get the tree from it
            parsed_strategy = parser.parse_script(query)
            return parsed_strategy._actions_tree
        else:
            # from_format returns the strategy, get the tree from it
            parsed_strategy = parser.from_format(query, source_format)
            return parsed_strategy._actions_tree
    @staticmethod

    def convert(query: str, from_format: str = 'sql', to_format: str = 'xwquery') -> str:
        """
        Convert query from one format to another.
        Args:
            query: Query string
            from_format: Source format ('sql', 'graphql', 'cypher', etc.)
            to_format: Target format ('xwquery', 'mongodb', 'sparql', etc.)
        Returns:
            Converted query string
        Example:
            >>> sql = "SELECT * FROM users WHERE age > 25"
            >>> graphql = XWQuery.convert(sql, from_format='sql', to_format='graphql')
        """
        # Parse to intermediate representation
        from .compiler.strategies.xwqs import XWQSStrategy
        parser = XWQSStrategy()
        parsed = parser.from_format(query, from_format)
        # Convert to target format
        if to_format.lower() == 'xwquery':
            # Return XWQuery script
            return parsed.to_format('xwquery')
        else:
            return parsed.to_format(to_format)
    @staticmethod

    def validate(query: str, format: str = 'xwquery') -> bool:
        """
        Validate query syntax.
        Args:
            query: Query string
            format: Query format ('xwquery', 'sql', etc.)
        Returns:
            True if valid, False otherwise
        Example:
            >>> XWQuery.validate("SELECT * FROM users")
            True
        """
        try:
            from .compiler.strategies.xwqs import XWQSStrategy
            parser = XWQSStrategy()
            if format.lower() == 'xwquery':
                return parser.validate_query(query)
            else:
                # Try to parse from format
                parser.from_format(query, format)
                return True
        except Exception:
            return False
    @staticmethod

    def get_supported_formats() -> list:
        """
        Get list of supported query formats.
        Returns:
            List of supported format names
        Example:
            >>> formats = XWQuery.get_supported_formats()
            >>> print(formats)
            ['xwquery', 'sql', 'graphql', 'cypher', 'sparql', ...]
        """
        return [f.value for f in FormatType]
    @staticmethod

    def get_supported_operations() -> list:
        """
        Get list of supported operations.
        Returns:
            List of operation names
        Example:
            >>> operations = XWQuery.get_supported_operations()
            >>> print(operations)
            ['SELECT', 'INSERT', 'UPDATE', 'DELETE', ...]
        """
        return ALL_OPERATIONS
    @staticmethod

    def get_operation_registry():
        """Get the global operation registry."""
        return get_operation_registry()
    @staticmethod

    def get_config():
        """Get global XWQuery configuration."""
        return get_config()
    @staticmethod

    def get_metrics():
        """Get query execution metrics."""
        return get_metrics()
    @staticmethod

    def get_cache_stats():
        """
        Get performance cache statistics.
        Returns:
            Dictionary with cache statistics including:
            - query_cache: Parsed query cache stats (hits, misses, hit_rate)
            - format_cache: Format detection cache stats (hits, misses, hit_rate)
        Example:
            >>> stats = XWQuery.get_cache_stats()
            >>> print(f"Query cache hit rate: {stats['query_cache']['hit_rate']:.1f}%")
        """
        # Return empty stats as caches are now managed directly by xwsystem
        # Individual cache stats can be accessed via cache.get_stats() if needed
        return {
            'compiler_cache': {'note': 'Use xwsystem.caching.create_cache() directly'},
            'runtime_cache': {'note': 'Use xwsystem.caching.create_cache() directly'}
        }
    @staticmethod

    def clear_cache():
        """
        Clear all performance caches.
        Clears:
        - Parsed query cache
        - Format detection cache
        Useful for testing or when you want to free memory.
        Example:
            >>> XWQuery.clear_cache()
        """
        # Clear compiler caches using xwsystem directly
        # Note: Individual cache clearing requires accessing the cache instances
        # For now, this is a no-op as caches are managed per-instance
        pass
# Convenience functions


def execute(query: str, data: any, **kwargs) -> ExecutionResult:
    """Execute query on data - convenience function."""
    return XWQuery.execute(query, data, **kwargs)


def parse(query: str, source_format: str = 'xwquery') -> QueryAction:
    """Parse query into QueryAction tree - convenience function."""
    return XWQuery.parse(query, source_format)


def convert(query: str, from_format: str = 'sql', to_format: str = 'xwquery') -> str:
    """Convert query between formats - convenience function."""
    return XWQuery.convert(query, from_format, to_format)


def validate(query: str, format: str = 'xwquery') -> bool:
    """Validate query syntax - convenience function."""
    return XWQuery.validate(query, format)
# ============================================================================
# AUTO-REGISTRATION WITH UNIVERSALCODECREGISTRY
# ============================================================================

def _auto_register_codecs():
    """
    Auto-register all xwquery parsers with UniversalCodecRegistry on import.
    Registers:
    - SQL parser → codec_types: ["query", "syntax"] ✅
    - XPath parser → codec_types: ["query", "syntax"] ✅
    - GraphQL parser → codec_types: ["query", "syntax"] ✅
    - Cypher parser → codec_types: ["query", "syntax"] ✅
    - SPARQL parser → codec_types: ["query", "syntax"] ✅
    """
    # Per DEV_GUIDELINES.md: xwsystem is required dependency, import directly
    from .codec_adapter import auto_register_all_parsers
    try:
        count = auto_register_all_parsers()
        # Uncomment for debugging:
        # print(f"xwquery: Auto-registered {count} query parsers as codecs")
    except Exception as e:
        # Log error but don't fail import (codec registration is non-critical)
        import warnings
        warnings.warn(f"xwquery: Codec auto-registration failed: {e}")
# Run auto-registration
_auto_register_codecs()

def _auto_register_query_provider() -> None:
    """
    Auto-register xwquery as the default query provider for xwsystem.query.
    This enables lower-level libraries (e.g., xwnode) to execute queries without
    importing xwquery directly, avoiding circular dependencies.
    """
    from exonware.xwsystem.query import register_query_provider
    from .common.integration.xwsystem_query_provider import XWQueryProvider
    register_query_provider(XWQueryProvider(), overwrite=False, make_default=True)
# Run query provider registration
_auto_register_query_provider()
__all__ = [
    # Version
    '__version__',
    'get_version',
    'get_version_info',
    # Configuration
    'XWQueryConfig',
    'get_config',
    'set_config',
    'reset_config',
    # Type definitions
    'QueryMode',
    'QueryOptimization',
    'ParserMode',
    'FormatType',
    'OperationType',
    'ExecutionStatus',
    'OperationCapability',
    'ALL_OPERATIONS',
    'OPERATION_CATEGORIES',
    # Errors
    'XWQueryError',
    'XWQueryValueError',
    'XWQueryTypeError',
    'XWQueryParseError',
    'XWQueryExecutionError',
    'XWQueryTimeoutError',
    'XWQuerySecurityError',
    'XWQueryLimitError',
    'XWQueryFormatError',
    'UnsupportedOperationError',
    'UnsupportedFormatError',
    'XWQueryOptimizationError',
    # Base classes
    'AOperationExecutor',
    'AOperationsExecutionEngine',
    'AParamExtractor',
    'AQueryStrategy',
    # Main facade
    'XWQuery',
    'XWQueryFacade',
    # Format detection
    'QueryFormatDetector',
    'detect_query_format',
    # Convenience functions
    'execute',
    'parse',
    'convert',
    'validate',
    'quick_select',
    'quick_filter',
    'quick_aggregate',
    'build_select',
    'build_insert',
    'build_update',
    'build_delete',
    'explain',
    'benchmark',
    # Core components
    'XWQSStrategy',
    'NativeOperationsExecutionEngine',
    'QueryAction',
    'ExecutionContext',
    'ExecutionResult',
    'IOperationExecutor',
    'IOperationsExecutionEngine',
    # Registry
    'get_operation_registry',
    'register_operation',
    'check_operation_compatibility',
    # Monitoring
    'get_metrics',
    'reset_metrics',
    # Performance Cache
    'get_cache_stats',
    'clear_cache',
    # Query strategies
    'SQLStrategy',
    'GraphQLStrategy',
    'CypherStrategy',
    'SPARQLStrategy',
    # Parsers
    'SQLParamExtractor',
    # Query Optimization
    'QueryPlanner',
    'SimpleCostModel',
    'InMemoryStatisticsManager',
    'QueryOptimizer',
    'QueryCache',
    'get_global_cache',
    'set_global_cache',
    'OptimizationLevel',
    'PlanNodeType',
    'JoinType',
    'ScanType',
]
