#!/usr/bin/env python3
"""
xwquery - Universal Query Language for Python

Enhanced with xwnode-aligned architecture.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: October 26, 2025
"""

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
from .contracts import QueryAction, ExecutionContext, ExecutionResult, IOperationExecutor
from .base import AOperationExecutor, AParamExtractor, AQueryStrategy

# Enhanced facade
from .facade import (
    XWQueryFacade,
    quick_select, quick_filter, quick_aggregate,
    build_select, build_insert, build_update, build_delete,
    explain, benchmark
)

# Query Optimization
from .optimization import (
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
)

# Common utilities
from .common.monitoring.metrics import get_metrics, reset_metrics

# Core query components
from .strategies.xwquery import XWQueryScriptStrategy
from .executors.engine import ExecutionEngine
from .executors.registry import get_operation_registry, register_operation
from .executors.capability_checker import check_operation_compatibility

# Query strategies (format converters)
from .strategies.sql import SQLStrategy
from .strategies.graphql import GraphQLStrategy
from .strategies.cypher import CypherStrategy
from .strategies.sparql import SPARQLStrategy

# Parsers
from .parsers.sql_param_extractor import SQLParamExtractor
from .parsers.format_detector import QueryFormatDetector, detect_query_format
from .parsers.sql_parser import parse_sql
from .parsers.xpath_parser import parse_xpath

# Generators
from .generators.sql_generator import generate_sql
from .generators.xpath_generator import generate_xpath

# Universal Converter (Phase 3)
from .universal_converter import (
    UniversalQueryConverter,
    sql_to_xpath,
    xpath_to_sql,
    convert_query
)


class XWQuery:
    """
    Main facade for XWQuery - Universal Query Language for Python.
    
    This class provides a clean, simple API for querying any data structure
    with SQL-like syntax and converting between multiple query formats.
    """
    
    def __init__(self):
        """Initialize XWQuery with execution engine."""
        self._engine = ExecutionEngine()
        self._parser = XWQueryScriptStrategy()
    
    @staticmethod
    def execute(query: str, data: any, format: Optional[str] = None, auto_detect: bool = True, **kwargs) -> ExecutionResult:
        """
        Execute a query on data with auto-format detection.
        
        Args:
            query: Query string (any supported format)
            data: Target data to query (can be node, dict, list, etc.)
            format: Explicit format (overrides auto-detection)
            auto_detect: Enable auto-detection if format not specified (default: True)
            **kwargs: Additional execution options
            
        Returns:
            ExecutionResult with query results
            
        Example:
            >>> # Auto-detect format (SQL)
            >>> result = XWQuery.execute("SELECT * FROM users WHERE age > 25", data)
            >>> # Auto-detect format (Cypher)
            >>> result = XWQuery.execute("MATCH (u:User) WHERE u.age > 25 RETURN u", data)
            >>> # Explicit format
            >>> result = XWQuery.execute("users[?age > `25`].name", data, format='jmespath')
        """
        from exonware.xwnode import XWNode
        from .parsers.format_detector import detect_query_format
        
        # Auto-detect format if not specified
        if not format and auto_detect:
            detected_format, confidence = detect_query_format(query)
            format = detected_format.lower()
            logger.debug(f"Auto-detected query format: {format} (confidence: {confidence:.0%})")
            
            # Warn if low confidence
            if confidence < 0.8:
                logger.warning(
                    f"Low confidence format detection ({confidence:.0%}). "
                    f"Consider specifying format explicitly with format='{format}' parameter."
                )
        elif not format:
            # No auto-detect, default to SQL
            format = 'sql'
        
        # Convert data to node if needed
        if not hasattr(data, '_strategy'):
            node = XWNode.from_native(data)
        else:
            node = data
        
        # Execute query
        engine = ExecutionEngine()
        return engine.execute(query, node, **kwargs)
    
    @staticmethod
    def parse(query: str, source_format: str = 'xwquery') -> 'QueryAction':
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
        parser = XWQueryScriptStrategy()
        
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
        parser = XWQueryScriptStrategy()
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
            parser = XWQueryScriptStrategy()
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


# Convenience functions
def execute(query: str, data: any, **kwargs) -> ExecutionResult:
    """Execute query on data - convenience function."""
    return XWQuery.execute(query, data, **kwargs)


def parse(query: str, source_format: str = 'xwquery') -> 'QueryAction':
    """Parse query into QueryAction tree - convenience function."""
    return XWQuery.parse(query, source_format)


def convert(query: str, from_format: str = 'sql', to_format: str = 'xwquery') -> str:
    """Convert query between formats - convenience function."""
    return XWQuery.convert(query, from_format, to_format)


def validate(query: str, format: str = 'xwquery') -> bool:
    """Validate query syntax - convenience function."""
    return XWQuery.validate(query, format)


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
    'XWQueryScriptStrategy',
    'ExecutionEngine',
    'QueryAction',
    'ExecutionContext',
    'ExecutionResult',
    'IOperationExecutor',
    
    # Registry
    'get_operation_registry',
    'register_operation',
    'check_operation_compatibility',
    
    # Monitoring
    'get_metrics',
    'reset_metrics',
    
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

