#!/usr/bin/env python3
"""
Operation Type Detection for xwquery

Comprehensive system for detecting operation types across all 31 query formats.
Maps AST patterns to operation types for universal query processing.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 11-Oct-2025
"""

from typing import Any, Dict, List, Optional, Union, Set
from dataclasses import dataclass
from enum import Enum
from exonware.xwsyntax import ASTNode
from .ast_utils import find_node_by_type, find_all_nodes_by_type, extract_node_value


class OperationType(Enum):
    """Enumeration of all supported operation types."""
    
    # SQL-like operations
    SELECT = "SELECT"
    INSERT = "INSERT"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    CREATE = "CREATE"
    ALTER = "ALTER"
    DROP = "DROP"
    
    # Graph operations
    MATCH = "MATCH"
    MERGE = "MERGE"
    TRAVERSAL = "TRAVERSAL"
    ADD_VERTEX = "ADD_VERTEX"
    ADD_EDGE = "ADD_EDGE"
    
    # API operations
    QUERY = "QUERY"
    MUTATION = "MUTATION"
    SUBSCRIPTION = "SUBSCRIPTION"
    
    # Document operations
    PATH = "PATH"
    FILTER = "FILTER"
    MAP = "MAP"
    REDUCE = "REDUCE"
    
    # Time-series operations
    AGGREGATE = "AGGREGATE"
    RANGE = "RANGE"
    RATE = "RATE"
    
    # Data processing operations
    SCRIPT = "SCRIPT"
    COMMAND = "COMMAND"
    EXPRESSION = "EXPRESSION"
    
    # Search operations
    SEARCH = "SEARCH"
    INDEX = "INDEX"
    
    # Special operations
    ASK = "ASK"
    DESCRIBE = "DESCRIBE"
    CONSTRUCT = "CONSTRUCT"


@dataclass
class OperationPattern:
    """Pattern for detecting operation types."""
    ast_node_types: List[str]  # AST node types that indicate this operation
    keywords: List[str]  # Keywords that indicate this operation
    priority: int = 0  # Detection priority (higher = more specific)
    format_specific: Optional[str] = None  # Format-specific patterns


class OperationDetector:
    """Detects operation types from AST nodes."""
    
    def __init__(self):
        self._patterns = self._initialize_patterns()
        self._format_patterns = self._initialize_format_patterns()
    
    def detect_operation(self, ast: ASTNode, format_name: Optional[str] = None) -> OperationType:
        """
        Detect operation type from AST node.
        
        Args:
            ast: AST node to analyze
            format_name: Optional format name for format-specific detection
            
        Returns:
            Detected operation type
            
        Raises:
            ValueError: If no operation can be detected
        """
        # Try format-specific detection first
        if format_name:
            operation = self._detect_format_specific(ast, format_name)
            if operation:
                return operation
        
        # Try generic detection
        operation = self._detect_generic(ast)
        if operation:
            return operation
        
        # Default fallback
        return OperationType.SELECT
    
    def _detect_format_specific(self, ast: ASTNode, format_name: str) -> Optional[OperationType]:
        """Detect operation using format-specific patterns."""
        format_name = format_name.lower()
        
        if format_name not in self._format_patterns:
            return None
        
        patterns = self._format_patterns[format_name]
        
        # Check patterns in priority order
        for pattern in sorted(patterns, key=lambda p: p.priority, reverse=True):
            if self._matches_pattern(ast, pattern):
                return self._get_operation_type(pattern)
        
        return None
    
    def _detect_generic(self, ast: ASTNode) -> Optional[OperationType]:
        """Detect operation using generic patterns."""
        # Check patterns in priority order
        for pattern in sorted(self._patterns, key=lambda p: p.priority, reverse=True):
            if self._matches_pattern(ast, pattern):
                return self._get_operation_type(pattern)
        
        return None
    
    def _matches_pattern(self, ast: ASTNode, pattern: OperationPattern) -> bool:
        """Check if AST matches the given pattern."""
        # Check AST node types
        if pattern.ast_node_types:
            for node_type in pattern.ast_node_types:
                if find_node_by_type(ast, node_type):
                    return True
        
        # Check keywords in AST
        if pattern.keywords:
            for keyword in pattern.keywords:
                if self._contains_keyword(ast, keyword):
                    return True
        
        return False
    
    def _contains_keyword(self, ast: ASTNode, keyword: str) -> bool:
        """Check if AST contains the given keyword."""
        keyword_upper = keyword.upper()
        
        # Check current node
        if ast.value and keyword_upper in ast.value.upper():
            return True
        
        # Check children recursively
        for child in ast.children:
            if self._contains_keyword(child, keyword):
                return True
        
        return False
    
    def _get_operation_type(self, pattern: OperationPattern) -> OperationType:
        """Get operation type from pattern."""
        # Map pattern to operation type
        if "select" in pattern.keywords or "select" in pattern.ast_node_types:
            return OperationType.SELECT
        elif "insert" in pattern.keywords or "insert" in pattern.ast_node_types:
            return OperationType.INSERT
        elif "update" in pattern.keywords or "update" in pattern.ast_node_types:
            return OperationType.UPDATE
        elif "delete" in pattern.keywords or "delete" in pattern.ast_node_types:
            return OperationType.DELETE
        elif "create" in pattern.keywords or "create" in pattern.ast_node_types:
            return OperationType.CREATE
        elif "alter" in pattern.keywords or "alter" in pattern.ast_node_types:
            return OperationType.ALTER
        elif "drop" in pattern.keywords or "drop" in pattern.ast_node_types:
            return OperationType.DROP
        elif "match" in pattern.keywords or "match" in pattern.ast_node_types:
            return OperationType.MATCH
        elif "merge" in pattern.keywords or "merge" in pattern.ast_node_types:
            return OperationType.MERGE
        elif "query" in pattern.keywords or "query" in pattern.ast_node_types:
            return OperationType.QUERY
        elif "mutation" in pattern.keywords or "mutation" in pattern.ast_node_types:
            return OperationType.MUTATION
        elif "subscription" in pattern.keywords or "subscription" in pattern.ast_node_types:
            return OperationType.SUBSCRIPTION
        elif "path" in pattern.keywords or "path" in pattern.ast_node_types:
            return OperationType.PATH
        elif "filter" in pattern.keywords or "filter" in pattern.ast_node_types:
            return OperationType.FILTER
        elif "map" in pattern.keywords or "map" in pattern.ast_node_types:
            return OperationType.MAP
        elif "reduce" in pattern.keywords or "reduce" in pattern.ast_node_types:
            return OperationType.REDUCE
        elif "aggregate" in pattern.keywords or "aggregate" in pattern.ast_node_types:
            return OperationType.AGGREGATE
        elif "range" in pattern.keywords or "range" in pattern.ast_node_types:
            return OperationType.RANGE
        elif "rate" in pattern.keywords or "rate" in pattern.ast_node_types:
            return OperationType.RATE
        elif "script" in pattern.keywords or "script" in pattern.ast_node_types:
            return OperationType.SCRIPT
        elif "command" in pattern.keywords or "command" in pattern.ast_node_types:
            return OperationType.COMMAND
        elif "expression" in pattern.keywords or "expression" in pattern.ast_node_types:
            return OperationType.EXPRESSION
        elif "search" in pattern.keywords or "search" in pattern.ast_node_types:
            return OperationType.SEARCH
        elif "index" in pattern.keywords or "index" in pattern.ast_node_types:
            return OperationType.INDEX
        elif "ask" in pattern.keywords or "ask" in pattern.ast_node_types:
            return OperationType.ASK
        elif "describe" in pattern.keywords or "describe" in pattern.ast_node_types:
            return OperationType.DESCRIBE
        elif "construct" in pattern.keywords or "construct" in pattern.ast_node_types:
            return OperationType.CONSTRUCT
        else:
            return OperationType.SELECT  # Default
    
    def _initialize_patterns(self) -> List[OperationPattern]:
        """Initialize generic operation patterns."""
        return [
            # SQL-like operations
            OperationPattern(
                ast_node_types=["select_statement", "select_clause"],
                keywords=["SELECT"],
                priority=100
            ),
            OperationPattern(
                ast_node_types=["insert_statement", "insert_clause"],
                keywords=["INSERT"],
                priority=100
            ),
            OperationPattern(
                ast_node_types=["update_statement", "update_clause"],
                keywords=["UPDATE"],
                priority=100
            ),
            OperationPattern(
                ast_node_types=["delete_statement", "delete_clause"],
                keywords=["DELETE"],
                priority=100
            ),
            OperationPattern(
                ast_node_types=["create_statement", "create_clause"],
                keywords=["CREATE"],
                priority=100
            ),
            OperationPattern(
                ast_node_types=["alter_statement", "alter_clause"],
                keywords=["ALTER"],
                priority=100
            ),
            OperationPattern(
                ast_node_types=["drop_statement", "drop_clause"],
                keywords=["DROP"],
                priority=100
            ),
            
            # Graph operations
            OperationPattern(
                ast_node_types=["match_statement", "match_clause"],
                keywords=["MATCH"],
                priority=90
            ),
            OperationPattern(
                ast_node_types=["merge_statement", "merge_clause"],
                keywords=["MERGE"],
                priority=90
            ),
            OperationPattern(
                ast_node_types=["traversal", "traversal_statement"],
                keywords=["TRAVERSAL"],
                priority=90
            ),
            OperationPattern(
                ast_node_types=["add_vertex", "add_vertex_statement"],
                keywords=["ADD_VERTEX"],
                priority=90
            ),
            OperationPattern(
                ast_node_types=["add_edge", "add_edge_statement"],
                keywords=["ADD_EDGE"],
                priority=90
            ),
            
            # API operations
            OperationPattern(
                ast_node_types=["query", "query_statement"],
                keywords=["QUERY"],
                priority=80
            ),
            OperationPattern(
                ast_node_types=["mutation", "mutation_statement"],
                keywords=["MUTATION"],
                priority=80
            ),
            OperationPattern(
                ast_node_types=["subscription", "subscription_statement"],
                keywords=["SUBSCRIPTION"],
                priority=80
            ),
            
            # Document operations
            OperationPattern(
                ast_node_types=["path_expression", "path"],
                keywords=["PATH"],
                priority=70
            ),
            OperationPattern(
                ast_node_types=["filter", "filter_expression"],
                keywords=["FILTER"],
                priority=70
            ),
            OperationPattern(
                ast_node_types=["map", "map_expression"],
                keywords=["MAP"],
                priority=70
            ),
            OperationPattern(
                ast_node_types=["reduce", "reduce_expression"],
                keywords=["REDUCE"],
                priority=70
            ),
            
            # Time-series operations
            OperationPattern(
                ast_node_types=["aggregate", "aggregate_expression"],
                keywords=["AGGREGATE"],
                priority=60
            ),
            OperationPattern(
                ast_node_types=["range", "range_expression"],
                keywords=["RANGE"],
                priority=60
            ),
            OperationPattern(
                ast_node_types=["rate", "rate_expression"],
                keywords=["RATE"],
                priority=60
            ),
            
            # Data processing operations
            OperationPattern(
                ast_node_types=["script", "script_statement"],
                keywords=["SCRIPT"],
                priority=50
            ),
            OperationPattern(
                ast_node_types=["command", "command_statement"],
                keywords=["COMMAND"],
                priority=50
            ),
            OperationPattern(
                ast_node_types=["expression", "expression_statement"],
                keywords=["EXPRESSION"],
                priority=50
            ),
            
            # Search operations
            OperationPattern(
                ast_node_types=["search", "search_statement"],
                keywords=["SEARCH"],
                priority=40
            ),
            OperationPattern(
                ast_node_types=["index", "index_statement"],
                keywords=["INDEX"],
                priority=40
            ),
            
            # Special operations
            OperationPattern(
                ast_node_types=["ask", "ask_statement"],
                keywords=["ASK"],
                priority=30
            ),
            OperationPattern(
                ast_node_types=["describe", "describe_statement"],
                keywords=["DESCRIBE"],
                priority=30
            ),
            OperationPattern(
                ast_node_types=["construct", "construct_statement"],
                keywords=["CONSTRUCT"],
                priority=30
            ),
        ]
    
    def _initialize_format_patterns(self) -> Dict[str, List[OperationPattern]]:
        """Initialize format-specific operation patterns."""
        return {
            "sql": [
                OperationPattern(
                    ast_node_types=["select_statement"],
                    keywords=["SELECT"],
                    priority=100,
                    format_specific="sql"
                ),
                OperationPattern(
                    ast_node_types=["insert_statement"],
                    keywords=["INSERT"],
                    priority=100,
                    format_specific="sql"
                ),
                OperationPattern(
                    ast_node_types=["update_statement"],
                    keywords=["UPDATE"],
                    priority=100,
                    format_specific="sql"
                ),
                OperationPattern(
                    ast_node_types=["delete_statement"],
                    keywords=["DELETE"],
                    priority=100,
                    format_specific="sql"
                ),
                OperationPattern(
                    ast_node_types=["create_statement"],
                    keywords=["CREATE"],
                    priority=100,
                    format_specific="sql"
                ),
                OperationPattern(
                    ast_node_types=["alter_statement"],
                    keywords=["ALTER"],
                    priority=100,
                    format_specific="sql"
                ),
                OperationPattern(
                    ast_node_types=["drop_statement"],
                    keywords=["DROP"],
                    priority=100,
                    format_specific="sql"
                ),
            ],
            
            "cypher": [
                OperationPattern(
                    ast_node_types=["match_statement"],
                    keywords=["MATCH"],
                    priority=100,
                    format_specific="cypher"
                ),
                OperationPattern(
                    ast_node_types=["create_statement"],
                    keywords=["CREATE"],
                    priority=100,
                    format_specific="cypher"
                ),
                OperationPattern(
                    ast_node_types=["merge_statement"],
                    keywords=["MERGE"],
                    priority=100,
                    format_specific="cypher"
                ),
                OperationPattern(
                    ast_node_types=["delete_statement"],
                    keywords=["DELETE"],
                    priority=100,
                    format_specific="cypher"
                ),
            ],
            
            "graphql": [
                OperationPattern(
                    ast_node_types=["query"],
                    keywords=["query"],
                    priority=100,
                    format_specific="graphql"
                ),
                OperationPattern(
                    ast_node_types=["mutation"],
                    keywords=["mutation"],
                    priority=100,
                    format_specific="graphql"
                ),
                OperationPattern(
                    ast_node_types=["subscription"],
                    keywords=["subscription"],
                    priority=100,
                    format_specific="graphql"
                ),
            ],
            
            "xpath": [
                OperationPattern(
                    ast_node_types=["path_expression"],
                    keywords=["path"],
                    priority=100,
                    format_specific="xpath"
                ),
            ],
            
            "mongodb": [
                OperationPattern(
                    ast_node_types=["find"],
                    keywords=["find"],
                    priority=100,
                    format_specific="mongodb"
                ),
                OperationPattern(
                    ast_node_types=["insert"],
                    keywords=["insert"],
                    priority=100,
                    format_specific="mongodb"
                ),
                OperationPattern(
                    ast_node_types=["update"],
                    keywords=["update"],
                    priority=100,
                    format_specific="mongodb"
                ),
                OperationPattern(
                    ast_node_types=["delete"],
                    keywords=["delete"],
                    priority=100,
                    format_specific="mongodb"
                ),
            ],
            
            "sparql": [
                OperationPattern(
                    ast_node_types=["select_query"],
                    keywords=["SELECT"],
                    priority=100,
                    format_specific="sparql"
                ),
                OperationPattern(
                    ast_node_types=["construct_query"],
                    keywords=["CONSTRUCT"],
                    priority=100,
                    format_specific="sparql"
                ),
                OperationPattern(
                    ast_node_types=["ask_query"],
                    keywords=["ASK"],
                    priority=100,
                    format_specific="sparql"
                ),
                OperationPattern(
                    ast_node_types=["describe_query"],
                    keywords=["DESCRIBE"],
                    priority=100,
                    format_specific="sparql"
                ),
            ],
            
            "promql": [
                OperationPattern(
                    ast_node_types=["query"],
                    keywords=["query"],
                    priority=100,
                    format_specific="promql"
                ),
                OperationPattern(
                    ast_node_types=["range"],
                    keywords=["range"],
                    priority=90,
                    format_specific="promql"
                ),
                OperationPattern(
                    ast_node_types=["rate"],
                    keywords=["rate"],
                    priority=90,
                    format_specific="promql"
                ),
            ],
            
            "logql": [
                OperationPattern(
                    ast_node_types=["query"],
                    keywords=["query"],
                    priority=100,
                    format_specific="logql"
                ),
                OperationPattern(
                    ast_node_types=["filter"],
                    keywords=["filter"],
                    priority=90,
                    format_specific="logql"
                ),
            ],
            
            "flux": [
                OperationPattern(
                    ast_node_types=["query"],
                    keywords=["query"],
                    priority=100,
                    format_specific="flux"
                ),
                OperationPattern(
                    ast_node_types=["range"],
                    keywords=["range"],
                    priority=90,
                    format_specific="flux"
                ),
                OperationPattern(
                    ast_node_types=["filter"],
                    keywords=["filter"],
                    priority=90,
                    format_specific="flux"
                ),
                OperationPattern(
                    ast_node_types=["map"],
                    keywords=["map"],
                    priority=90,
                    format_specific="flux"
                ),
            ],
            
            "jmespath": [
                OperationPattern(
                    ast_node_types=["expression"],
                    keywords=["expression"],
                    priority=100,
                    format_specific="jmespath"
                ),
            ],
            
            "jq": [
                OperationPattern(
                    ast_node_types=["filter"],
                    keywords=["filter"],
                    priority=100,
                    format_specific="jq"
                ),
            ],
            
            "elasticsearch": [
                OperationPattern(
                    ast_node_types=["search"],
                    keywords=["search"],
                    priority=100,
                    format_specific="elasticsearch"
                ),
                OperationPattern(
                    ast_node_types=["index"],
                    keywords=["index"],
                    priority=100,
                    format_specific="elasticsearch"
                ),
                OperationPattern(
                    ast_node_types=["update"],
                    keywords=["update"],
                    priority=100,
                    format_specific="elasticsearch"
                ),
                OperationPattern(
                    ast_node_types=["delete"],
                    keywords=["delete"],
                    priority=100,
                    format_specific="elasticsearch"
                ),
            ],
        }
    
    def get_supported_operations(self, format_name: Optional[str] = None) -> Set[OperationType]:
        """Get supported operations for a format."""
        if format_name and format_name.lower() in self._format_patterns:
            patterns = self._format_patterns[format_name.lower()]
            operations = set()
            for pattern in patterns:
                operations.add(self._get_operation_type(pattern))
            return operations
        
        # Return all operations if no format specified
        return set(OperationType)
    
    def is_operation_supported(self, operation: OperationType, format_name: str) -> bool:
        """Check if an operation is supported by a format."""
        supported_ops = self.get_supported_operations(format_name)
        return operation in supported_ops


# Global detector instance
operation_detector = OperationDetector()


# Convenience functions
def detect_operation(ast: ASTNode, format_name: Optional[str] = None) -> OperationType:
    """Detect operation type from AST node."""
    return operation_detector.detect_operation(ast, format_name)


def get_supported_operations(format_name: Optional[str] = None) -> Set[OperationType]:
    """Get supported operations for a format."""
    return operation_detector.get_supported_operations(format_name)


def is_operation_supported(operation: OperationType, format_name: str) -> bool:
    """Check if an operation is supported by a format."""
    return operation_detector.is_operation_supported(operation, format_name)

