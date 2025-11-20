#!/usr/bin/env python3
"""
Syntax Adapter for xwquery

Converts xwsystem.syntax AST nodes to xwquery QueryAction trees.
This enables grammar-based parsing to integrate with existing executors.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: January 2, 2025
"""

from typing import Any, Dict, List, Optional, Union
import os
from exonware.xwsystem.syntax import ASTNode, SyntaxEngine, Grammar
from exonware.xwquery.contracts import QueryAction
from exonware.xwquery.defs import QueryMode, ConversionMode
from exonware.xwquery.errors import XWQueryParseError


class SyntaxToQueryActionConverter:
    """
    Converts syntax AST nodes to QueryAction trees.
    
    This adapter bridges the gap between grammar-based parsing
    and the existing xwquery execution engine.
    """
    
    def __init__(self, query_mode: QueryMode = QueryMode.AUTO):
        """Initialize converter with query mode."""
        self._query_mode = query_mode
        self._conversion_mode = ConversionMode.FLEXIBLE
    
    def convert(self, ast: ASTNode) -> QueryAction:
        """
        Convert AST to QueryAction tree.
        
        Args:
            ast: Root AST node from syntax engine
            
        Returns:
            QueryAction tree ready for execution
            
        Raises:
            XWQueryParseError: If conversion fails
        """
        try:
            if not ast:
                raise XWQueryParseError("Empty AST provided")
            
            # Determine query type from AST root
            query_type = self._detect_query_type(ast)
            
            # Convert based on query type
            if query_type == "SELECT":
                return self._convert_select(ast)
            elif query_type == "INSERT":
                return self._convert_insert(ast)
            elif query_type == "UPDATE":
                return self._convert_update(ast)
            elif query_type == "DELETE":
                return self._convert_delete(ast)
            elif query_type == "CREATE":
                return self._convert_create(ast)
            elif query_type == "ALTER":
                return self._convert_alter(ast)
            elif query_type == "DROP":
                return self._convert_drop(ast)
            else:
                raise XWQueryParseError(f"Unsupported query type: {query_type}")
                
        except Exception as e:
            raise XWQueryParseError(f"AST conversion failed: {str(e)}")
    
    def _detect_query_type(self, ast: ASTNode) -> str:
        """Detect query type from AST root."""
        if not ast.children:
            raise XWQueryParseError("Empty AST node")
        
        # Look for statement type in first child
        first_child = ast.children[0]
        
        # Check node type for statement type
        if hasattr(first_child, 'type'):
            node_type = first_child.type.lower()
            if 'select' in node_type:
                return "SELECT"
            elif 'insert' in node_type:
                return "INSERT"
            elif 'update' in node_type:
                return "UPDATE"
            elif 'delete' in node_type:
                return "DELETE"
            elif 'create' in node_type:
                return "CREATE"
            elif 'alter' in node_type:
                return "ALTER"
            elif 'drop' in node_type:
                return "DROP"
        
        # Fallback: check node value
        if hasattr(first_child, 'value'):
            value = first_child.value.upper()
            if value.startswith('SELECT'):
                return "SELECT"
            elif value.startswith('INSERT'):
                return "INSERT"
            elif value.startswith('UPDATE'):
                return "UPDATE"
            elif value.startswith('DELETE'):
                return "DELETE"
            elif value.startswith('CREATE'):
                return "CREATE"
            elif value.startswith('ALTER'):
                return "ALTER"
            elif value.startswith('DROP'):
                return "DROP"
        
        raise XWQueryParseError(f"Could not detect query type from AST: {ast}")
    
    def _convert_select(self, ast: ASTNode) -> QueryAction:
        """Convert SELECT statement AST to QueryAction."""
        # Create base SELECT action
        action = QueryAction(
            operation="SELECT",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        # Extract components from AST
        select_list = self._extract_select_list(ast)
        from_clause = self._extract_from_clause(ast)
        where_clause = self._extract_where_clause(ast)
        group_by = self._extract_group_by(ast)
        having = self._extract_having(ast)
        order_by = self._extract_order_by(ast)
        limit = self._extract_limit(ast)
        
        # Build action parameters
        action.params = {
            "select_list": select_list,
            "from_clause": from_clause,
            "where_clause": where_clause,
            "group_by": group_by,
            "having": having,
            "order_by": order_by,
            "limit": limit
        }
        
        return action
    
    def _convert_insert(self, ast: ASTNode) -> QueryAction:
        """Convert INSERT statement AST to QueryAction."""
        action = QueryAction(
            operation="INSERT",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        table_name = self._extract_table_name(ast)
        columns = self._extract_column_list(ast)
        values = self._extract_values(ast)
        
        action.params = {
            "table_name": table_name,
            "columns": columns,
            "values": values
        }
        
        return action
    
    def _convert_update(self, ast: ASTNode) -> QueryAction:
        """Convert UPDATE statement AST to QueryAction."""
        action = QueryAction(
            operation="UPDATE",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        table_name = self._extract_table_name(ast)
        assignments = self._extract_assignments(ast)
        where_clause = self._extract_where_clause(ast)
        
        action.params = {
            "table_name": table_name,
            "assignments": assignments,
            "where_clause": where_clause
        }
        
        return action
    
    def _convert_delete(self, ast: ASTNode) -> QueryAction:
        """Convert DELETE statement AST to QueryAction."""
        action = QueryAction(
            operation="DELETE",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        table_name = self._extract_table_name(ast)
        where_clause = self._extract_where_clause(ast)
        
        action.params = {
            "table_name": table_name,
            "where_clause": where_clause
        }
        
        return action
    
    def _convert_create(self, ast: ASTNode) -> QueryAction:
        """Convert CREATE statement AST to QueryAction."""
        action = QueryAction(
            operation="CREATE",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        object_type = self._extract_create_type(ast)
        object_name = self._extract_object_name(ast)
        definition = self._extract_create_definition(ast)
        
        action.params = {
            "object_type": object_type,
            "object_name": object_name,
            "definition": definition
        }
        
        return action
    
    def _convert_alter(self, ast: ASTNode) -> QueryAction:
        """Convert ALTER statement AST to QueryAction."""
        action = QueryAction(
            operation="ALTER",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        table_name = self._extract_table_name(ast)
        alter_action = self._extract_alter_action(ast)
        
        action.params = {
            "table_name": table_name,
            "alter_action": alter_action
        }
        
        return action
    
    def _convert_drop(self, ast: ASTNode) -> QueryAction:
        """Convert DROP statement AST to QueryAction."""
        action = QueryAction(
            operation="DROP",
            mode=self._query_mode,
            conversion_mode=self._conversion_mode
        )
        
        object_type = self._extract_drop_type(ast)
        object_name = self._extract_object_name(ast)
        
        action.params = {
            "object_type": object_type,
            "object_name": object_name
        }
        
        return action
    
    # Helper methods for extracting AST components
    def _extract_select_list(self, ast: ASTNode) -> List[str]:
        """Extract SELECT list from AST."""
        # Simplified extraction - would need more sophisticated AST traversal
        return ["*"]  # Placeholder
    
    def _extract_from_clause(self, ast: ASTNode) -> Optional[str]:
        """Extract FROM clause from AST."""
        return None  # Placeholder
    
    def _extract_where_clause(self, ast: ASTNode) -> Optional[Dict[str, Any]]:
        """Extract WHERE clause from AST."""
        return None  # Placeholder
    
    def _extract_group_by(self, ast: ASTNode) -> Optional[List[str]]:
        """Extract GROUP BY clause from AST."""
        return None  # Placeholder
    
    def _extract_having(self, ast: ASTNode) -> Optional[Dict[str, Any]]:
        """Extract HAVING clause from AST."""
        return None  # Placeholder
    
    def _extract_order_by(self, ast: ASTNode) -> Optional[List[Dict[str, Any]]]:
        """Extract ORDER BY clause from AST."""
        return None  # Placeholder
    
    def _extract_limit(self, ast: ASTNode) -> Optional[int]:
        """Extract LIMIT clause from AST."""
        return None  # Placeholder
    
    def _extract_table_name(self, ast: ASTNode) -> str:
        """Extract table name from AST."""
        return "unknown_table"  # Placeholder
    
    def _extract_column_list(self, ast: ASTNode) -> List[str]:
        """Extract column list from AST."""
        return []  # Placeholder
    
    def _extract_values(self, ast: ASTNode) -> List[List[Any]]:
        """Extract VALUES from AST."""
        return []  # Placeholder
    
    def _extract_assignments(self, ast: ASTNode) -> List[Dict[str, Any]]:
        """Extract assignments from AST."""
        return []  # Placeholder
    
    def _extract_create_type(self, ast: ASTNode) -> str:
        """Extract CREATE object type from AST."""
        return "TABLE"  # Placeholder
    
    def _extract_object_name(self, ast: ASTNode) -> str:
        """Extract object name from AST."""
        return "unknown_object"  # Placeholder
    
    def _extract_create_definition(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CREATE definition from AST."""
        return {}  # Placeholder
    
    def _extract_alter_action(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract ALTER action from AST."""
        return {}  # Placeholder
    
    def _extract_drop_type(self, ast: ASTNode) -> str:
        """Extract DROP object type from AST."""
        return "TABLE"  # Placeholder


class GrammarBasedSQLStrategy:
    """
    SQL strategy using grammar-based parsing.
    
    This replaces the hand-written SQL parser with our grammar system.
    """
    
    def __init__(self, **options):
        """Initialize grammar-based SQL strategy."""
        self._syntax_engine = SyntaxEngine()
        self._converter = SyntaxToQueryActionConverter(QueryMode.AUTO)
        # Use absolute path to grammar file
        grammar_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "query", "grammars", "sql.grammar"))
        self._grammar_path = grammar_file
        
        # Load SQL grammar from file
        try:
            with open(grammar_file, 'r', encoding='utf-8') as f:
                grammar_text = f.read()
            self._grammar = Grammar(grammar_text, "sql")
        except Exception as e:
            raise XWQueryParseError(f"Failed to load SQL grammar from file: {str(e)}")
    
    def parse(self, query: str) -> QueryAction:
        """
        Parse SQL query using grammar.
        
        Args:
            query: SQL query string
            
        Returns:
            QueryAction tree
            
        Raises:
            XWQueryParseError: If parsing fails
        """
        try:
            # Parse with grammar
            ast = self._grammar.parse(query)
            
            # Convert AST to QueryAction
            return self._converter.convert(ast)
            
        except Exception as e:
            raise XWQueryParseError(f"Grammar-based parsing failed: {str(e)}")
    
    def validate(self, query: str) -> bool:
        """
        Validate SQL query using grammar.
        
        Args:
            query: SQL query string
            
        Returns:
            True if valid, False otherwise
        """
        try:
            self._grammar.validate(query)
            return True
        except Exception:
            return False
    
    def export_to_monaco(self) -> Dict[str, Any]:
        """
        Export SQL grammar to Monaco format.
        
        Returns:
            Monaco language definition
        """
        return self._grammar.export_to_monaco()
