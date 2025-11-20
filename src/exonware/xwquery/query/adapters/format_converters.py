#!/usr/bin/env python3
"""
Format-Specific Converters for xwquery

Specialized converters for each query format that use format mappings
to convert ASTs to QueryAction trees.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 11-Oct-2025
"""

from typing import Any, Dict, List, Optional, Union
from abc import ABC, abstractmethod
from exonware.xwsyntax import ASTNode
from exonware.xwquery.contracts import QueryAction
from exonware.xwquery.defs import QueryMode, ConversionMode
from exonware.xwquery.errors import XWQueryParseError
from .format_mappings import FormatMappingRegistry, format_mapping_registry
from .ast_utils import find_node_by_type, find_all_nodes_by_type, extract_node_value


class FormatConverter(ABC):
    """Abstract base class for format-specific converters."""
    
    def __init__(self, format_name: str, query_mode: QueryMode = QueryMode.AUTO):
        """Initialize converter with format name and query mode."""
        self.format_name = format_name
        self.query_mode = query_mode
        self.conversion_mode = ConversionMode.FLEXIBLE
        self.mapping = format_mapping_registry.get_mapping(format_name)
        
        if not self.mapping:
            raise XWQueryParseError(f"No mapping found for format: {format_name}")
    
    @abstractmethod
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert AST to QueryAction tree."""
        pass
    
    def _create_query_action(self, operation: str, params: Dict[str, Any]) -> QueryAction:
        """Create a QueryAction with the given operation and parameters."""
        return QueryAction(
            type=operation,
            params=params,
            id=f"{self.format_name}_{operation}",
            line_number=0,
            metadata={
                "format": self.format_name,
                "query_mode": self.query_mode.value,
                "conversion_mode": self.conversion_mode.value
            }
        )


class SQLConverter(FormatConverter):
    """Converter for SQL queries."""
    
    def __init__(self, query_mode: QueryMode = QueryMode.AUTO):
        super().__init__("sql", query_mode)
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert SQL AST to QueryAction."""
        # Find the main statement
        statement_node = self._find_statement_node(ast)
        if not statement_node:
            raise XWQueryParseError("No SQL statement found in AST")
        
        # Determine operation type
        operation = self._detect_operation(statement_node)
        
        # Extract parameters based on operation
        params = self._extract_operation_params(statement_node, operation)
        
        return self._create_query_action(operation, params)
    
    def _find_statement_node(self, ast: ASTNode) -> Optional[ASTNode]:
        """Find the main statement node."""
        # Look for statement nodes
        statement_types = [
            "select_statement", "insert_statement", "update_statement",
            "delete_statement", "create_statement", "alter_statement", "drop_statement"
        ]
        
        for stmt_type in statement_types:
            node = find_node_by_type(ast, stmt_type)
            if node:
                return node
        
        return None
    
    def _detect_operation(self, statement_node: ASTNode) -> str:
        """Detect the operation type from statement node."""
        node_type = statement_node.type.lower()
        
        if "select" in node_type:
            return "SELECT"
        elif "insert" in node_type:
            return "INSERT"
        elif "update" in node_type:
            return "UPDATE"
        elif "delete" in node_type:
            return "DELETE"
        elif "create" in node_type:
            return "CREATE"
        elif "alter" in node_type:
            return "ALTER"
        elif "drop" in node_type:
            return "DROP"
        else:
            return "SELECT"  # Default
    
    def _extract_operation_params(self, statement_node: ASTNode, operation: str) -> Dict[str, Any]:
        """Extract parameters based on operation type."""
        if operation == "SELECT":
            return self.mapping._extract_sql_select(statement_node)
        elif operation == "INSERT":
            return self.mapping._extract_sql_insert(statement_node)
        elif operation == "UPDATE":
            return self.mapping._extract_sql_update(statement_node)
        elif operation == "DELETE":
            return self.mapping._extract_sql_delete(statement_node)
        elif operation == "CREATE":
            return self.mapping._extract_sql_create(statement_node)
        elif operation == "ALTER":
            return self.mapping._extract_sql_alter(statement_node)
        elif operation == "DROP":
            return self.mapping._extract_sql_drop(statement_node)
        else:
            return {"operation": operation}


class CypherConverter(FormatConverter):
    """Converter for Cypher queries."""
    
    def __init__(self, query_mode: QueryMode = QueryMode.AUTO):
        super().__init__("cypher", query_mode)
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert Cypher AST to QueryAction."""
        # Find the main statement
        statement_node = self._find_statement_node(ast)
        if not statement_node:
            raise XWQueryParseError("No Cypher statement found in AST")
        
        # Determine operation type
        operation = self._detect_operation(statement_node)
        
        # Extract parameters based on operation
        params = self._extract_operation_params(statement_node, operation)
        
        return self._create_query_action(operation, params)
    
    def _find_statement_node(self, ast: ASTNode) -> Optional[ASTNode]:
        """Find the main statement node."""
        statement_types = [
            "match_statement", "create_statement", "merge_statement", "delete_statement"
        ]
        
        for stmt_type in statement_types:
            node = find_node_by_type(ast, stmt_type)
            if node:
                return node
        
        return None
    
    def _detect_operation(self, statement_node: ASTNode) -> str:
        """Detect the operation type from statement node."""
        node_type = statement_node.type.lower()
        
        if "match" in node_type:
            return "MATCH"
        elif "create" in node_type:
            return "CREATE"
        elif "merge" in node_type:
            return "MERGE"
        elif "delete" in node_type:
            return "DELETE"
        else:
            return "MATCH"  # Default
    
    def _extract_operation_params(self, statement_node: ASTNode, operation: str) -> Dict[str, Any]:
        """Extract parameters based on operation type."""
        if operation == "MATCH":
            return self.mapping._extract_cypher_match(statement_node)
        elif operation == "CREATE":
            return self.mapping._extract_cypher_create(statement_node)
        elif operation == "MERGE":
            return self.mapping._extract_cypher_merge(statement_node)
        elif operation == "DELETE":
            return self.mapping._extract_cypher_delete(statement_node)
        else:
            return {"operation": operation}


class GraphQLConverter(FormatConverter):
    """Converter for GraphQL queries."""
    
    def __init__(self, query_mode: QueryMode = QueryMode.AUTO):
        super().__init__("graphql", query_mode)
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert GraphQL AST to QueryAction."""
        # Find the main operation
        operation_node = self._find_operation_node(ast)
        if not operation_node:
            raise XWQueryParseError("No GraphQL operation found in AST")
        
        # Determine operation type
        operation = self._detect_operation(operation_node)
        
        # Extract parameters based on operation
        params = self._extract_operation_params(operation_node, operation)
        
        return self._create_query_action(operation, params)
    
    def _find_operation_node(self, ast: ASTNode) -> Optional[ASTNode]:
        """Find the main operation node."""
        operation_types = ["query", "mutation", "subscription"]
        
        for op_type in operation_types:
            node = find_node_by_type(ast, op_type)
            if node:
                return node
        
        return None
    
    def _detect_operation(self, operation_node: ASTNode) -> str:
        """Detect the operation type from operation node."""
        node_type = operation_node.type.lower()
        
        if node_type == "query":
            return "QUERY"
        elif node_type == "mutation":
            return "MUTATION"
        elif node_type == "subscription":
            return "SUBSCRIPTION"
        else:
            return "QUERY"  # Default
    
    def _extract_operation_params(self, operation_node: ASTNode, operation: str) -> Dict[str, Any]:
        """Extract parameters based on operation type."""
        if operation == "QUERY":
            return self.mapping._extract_graphql_query(operation_node)
        elif operation == "MUTATION":
            return self.mapping._extract_graphql_mutation(operation_node)
        elif operation == "SUBSCRIPTION":
            return self.mapping._extract_graphql_subscription(operation_node)
        else:
            return {"operation": operation}


class XPathConverter(FormatConverter):
    """Converter for XPath queries."""
    
    def __init__(self, query_mode: QueryMode = QueryMode.AUTO):
        super().__init__("xpath", query_mode)
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert XPath AST to QueryAction."""
        # XPath is typically a single path expression
        path_node = find_node_by_type(ast, "path_expression")
        if not path_node:
            # Fallback: use root node
            path_node = ast
        
        # Extract path data
        params = self.mapping._extract_xpath_path(path_node)
        
        return self._create_query_action("PATH", params)


class MongoDBConverter(FormatConverter):
    """Converter for MongoDB queries."""
    
    def __init__(self, query_mode: QueryMode = QueryMode.AUTO):
        super().__init__("mongodb", query_mode)
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert MongoDB AST to QueryAction."""
        # Find the main operation
        operation_node = self._find_operation_node(ast)
        if not operation_node:
            raise XWQueryParseError("No MongoDB operation found in AST")
        
        # Determine operation type
        operation = self._detect_operation(operation_node)
        
        # Extract parameters based on operation
        params = self._extract_operation_params(operation_node, operation)
        
        return self._create_query_action(operation, params)
    
    def _find_operation_node(self, ast: ASTNode) -> Optional[ASTNode]:
        """Find the main operation node."""
        operation_types = ["find", "insert", "update", "delete"]
        
        for op_type in operation_types:
            node = find_node_by_type(ast, op_type)
            if node:
                return node
        
        return None
    
    def _detect_operation(self, operation_node: ASTNode) -> str:
        """Detect the operation type from operation node."""
        node_type = operation_node.type.lower()
        
        if node_type == "find":
            return "FIND"
        elif node_type == "insert":
            return "INSERT"
        elif node_type == "update":
            return "UPDATE"
        elif node_type == "delete":
            return "DELETE"
        else:
            return "FIND"  # Default
    
    def _extract_operation_params(self, operation_node: ASTNode, operation: str) -> Dict[str, Any]:
        """Extract parameters based on operation type."""
        if operation == "FIND":
            return self.mapping._extract_mongodb_find(operation_node)
        elif operation == "INSERT":
            return self.mapping._extract_mongodb_insert(operation_node)
        elif operation == "UPDATE":
            return self.mapping._extract_mongodb_update(operation_node)
        elif operation == "DELETE":
            return self.mapping._extract_mongodb_delete(operation_node)
        else:
            return {"operation": operation}


class GenericConverter(FormatConverter):
    """Generic converter for any format."""
    
    def __init__(self, format_name: str, query_mode: QueryMode = QueryMode.AUTO):
        super().__init__(format_name, query_mode)
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """Convert AST to QueryAction using format mapping."""
        # Find the best matching rule
        best_rule = self._find_best_rule(ast)
        if not best_rule:
            raise XWQueryParseError(f"No matching rule found for format: {self.format_name}")
        
        # Extract parameters using the rule's extraction function
        params = best_rule.extraction_func(ast)
        
        return self._create_query_action(best_rule.query_action_type, params)
    
    def _find_best_rule(self, ast: ASTNode) -> Optional[Any]:
        """Find the best matching rule for the AST."""
        best_rule = None
        best_priority = -1
        
        for rule in self.mapping.rules:
            # Check if AST matches the rule pattern
            if self._matches_pattern(ast, rule.ast_pattern):
                if rule.priority > best_priority:
                    best_rule = rule
                    best_priority = rule.priority
        
        return best_rule
    
    def _matches_pattern(self, ast: ASTNode, pattern: str) -> bool:
        """Check if AST matches the given pattern."""
        # Simple pattern matching - can be enhanced
        return ast.type.lower() == pattern.lower()


class ConverterFactory:
    """Factory for creating format-specific converters."""
    
    _converters = {
        "sql": SQLConverter,
        "cypher": CypherConverter,
        "graphql": GraphQLConverter,
        "xpath": XPathConverter,
        "mongodb": MongoDBConverter,
    }
    
    @classmethod
    def create_converter(cls, format_name: str, query_mode: QueryMode = QueryMode.AUTO) -> FormatConverter:
        """Create a converter for the specified format."""
        format_name = format_name.lower()
        
        # Check if we have a specialized converter
        if format_name in cls._converters:
            converter_class = cls._converters[format_name]
            return converter_class(query_mode)
        
        # Fallback to generic converter
        return GenericConverter(format_name, query_mode)
    
    @classmethod
    def get_supported_formats(cls) -> List[str]:
        """Get list of all supported formats."""
        return list(cls._converters.keys()) + format_mapping_registry.get_all_formats()
    
    @classmethod
    def register_converter(cls, format_name: str, converter_class: type):
        """Register a new converter class."""
        cls._converters[format_name.lower()] = converter_class


# Convenience functions
def create_converter(format_name: str, query_mode: QueryMode = QueryMode.AUTO) -> FormatConverter:
    """Create a converter for the specified format."""
    return ConverterFactory.create_converter(format_name, query_mode)


def get_supported_formats() -> List[str]:
    """Get list of all supported formats."""
    return ConverterFactory.get_supported_formats()


def register_converter(format_name: str, converter_class: type):
    """Register a new converter class."""
    ConverterFactory.register_converter(format_name, converter_class)

