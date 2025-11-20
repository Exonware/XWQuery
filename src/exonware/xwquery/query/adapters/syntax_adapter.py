#!/usr/bin/env python3
"""
Syntax Adapter for xwquery

Converts xwsystem.syntax AST nodes to xwquery QueryAction trees.
This enables grammar-based parsing to integrate with existing executors.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: January 2, 2025
"""

from typing import Any, Dict, List, Optional, Union
import os
from exonware.xwsyntax import ASTNode, SyntaxEngine, BidirectionalGrammar
from exonware.xwquery.contracts import QueryAction
from exonware.xwquery.defs import QueryMode, ConversionMode
from exonware.xwquery.errors import XWQueryParseError
from .ast_utils import (
    find_node_by_type, find_all_nodes_by_type, extract_node_value,
    traverse_depth_first, traverse_breadth_first
)


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
        select_list = []
        
        # Look for select_clause or select_list nodes
        select_node = find_node_by_type(ast, "select_clause")
        if not select_node:
            select_node = find_node_by_type(ast, "select_list")
        
        if select_node:
            # Extract column references
            column_nodes = find_all_nodes_by_type(select_node, "column_ref")
            for col_node in column_nodes:
                column_name = extract_node_value(col_node)
                if column_name:
                    select_list.append(column_name)
            
            # Check for wildcard (*)
            if not select_list:
                wildcard_nodes = find_all_nodes_by_type(select_node, "wildcard")
                if wildcard_nodes:
                    select_list = ["*"]
        
        return select_list if select_list else ["*"]
    
    def _extract_from_clause(self, ast: ASTNode) -> Optional[str]:
        """Extract FROM clause from AST."""
        from_node = find_node_by_type(ast, "from_clause")
        if not from_node:
            return None
        
        # Look for table reference
        table_node = find_node_by_type(from_node, "table_ref")
        if table_node:
            table_name = extract_node_value(table_node)
            if table_name:
                return table_name
        
        # Fallback: look for identifier in from clause
        for node in traverse_depth_first(from_node):
            if node.type == "IDENTIFIER" and node.value:
                return node.value
        
        return None
    
    def _extract_where_clause(self, ast: ASTNode) -> Optional[Dict[str, Any]]:
        """Extract WHERE clause from AST."""
        where_node = find_node_by_type(ast, "where_clause")
        if not where_node:
            return None
        
        # Extract condition expression
        condition_node = find_node_by_type(where_node, "condition")
        if not condition_node:
            condition_node = find_node_by_type(where_node, "expression")
        
        if condition_node:
            return self._extract_expression(condition_node)
        
        return None
    
    def _extract_group_by(self, ast: ASTNode) -> Optional[List[str]]:
        """Extract GROUP BY clause from AST."""
        group_by_node = find_node_by_type(ast, "group_by_clause")
        if not group_by_node:
            return None
        
        columns = []
        column_nodes = find_all_nodes_by_type(group_by_node, "column_ref")
        for col_node in column_nodes:
            column_name = extract_node_value(col_node)
            if column_name:
                columns.append(column_name)
        
        return columns if columns else None
    
    def _extract_having(self, ast: ASTNode) -> Optional[Dict[str, Any]]:
        """Extract HAVING clause from AST."""
        having_node = find_node_by_type(ast, "having_clause")
        if not having_node:
            return None
        
        # Extract condition expression
        condition_node = find_node_by_type(having_node, "condition")
        if not condition_node:
            condition_node = find_node_by_type(having_node, "expression")
        
        if condition_node:
            return self._extract_expression(condition_node)
        
        return None
    
    def _extract_order_by(self, ast: ASTNode) -> Optional[List[Dict[str, Any]]]:
        """Extract ORDER BY clause from AST."""
        order_by_node = find_node_by_type(ast, "order_by_clause")
        if not order_by_node:
            return None
        
        order_items = []
        order_item_nodes = find_all_nodes_by_type(order_by_node, "order_item")
        
        for item_node in order_item_nodes:
            column_name = extract_node_value(item_node)
            direction = "ASC"  # Default
            
            # Look for direction (ASC/DESC)
            direction_node = find_node_by_type(item_node, "direction")
            if direction_node:
                direction = extract_node_value(direction_node) or "ASC"
            
            order_items.append({
                "column": column_name,
                "direction": direction.upper()
            })
        
        return order_items if order_items else None
    
    def _extract_limit(self, ast: ASTNode) -> Optional[int]:
        """Extract LIMIT clause from AST."""
        limit_node = find_node_by_type(ast, "limit_clause")
        if not limit_node:
            return None
        
        # Look for number in limit clause
        for node in traverse_depth_first(limit_node):
            if node.type == "NUMBER" and node.value:
                try:
                    return int(node.value)
                except ValueError:
                    continue
        
        return None
    
    def _extract_table_name(self, ast: ASTNode) -> str:
        """Extract table name from AST."""
        # Look for table reference in various contexts
        table_node = find_node_by_type(ast, "table_ref")
        if not table_node:
            table_node = find_node_by_type(ast, "table_name")
        
        if table_node:
            table_name = extract_node_value(table_node)
            if table_name:
                return table_name
        
        # Fallback: look for identifier
        for node in traverse_depth_first(ast):
            if node.type == "IDENTIFIER" and node.value:
                return node.value
        
        return "unknown_table"
    
    def _extract_column_list(self, ast: ASTNode) -> List[str]:
        """Extract column list from AST."""
        columns = []
        
        # Look for column list nodes
        column_list_node = find_node_by_type(ast, "column_list")
        if column_list_node:
            column_nodes = find_all_nodes_by_type(column_list_node, "column_ref")
            for col_node in column_nodes:
                column_name = extract_node_value(col_node)
                if column_name:
                    columns.append(column_name)
        
        return columns
    
    def _extract_values(self, ast: ASTNode) -> List[List[Any]]:
        """Extract VALUES from AST."""
        values = []
        
        # Look for values clause
        values_node = find_node_by_type(ast, "values_clause")
        if not values_node:
            values_node = find_node_by_type(ast, "values")
        
        if values_node:
            # Extract value lists
            value_list_nodes = find_all_nodes_by_type(values_node, "value_list")
            for value_list_node in value_list_nodes:
                row_values = []
                value_nodes = find_all_nodes_by_type(value_list_node, "value")
                
                for value_node in value_nodes:
                    value = extract_node_value(value_node)
                    if value is not None:
                        row_values.append(value)
                
                if row_values:
                    values.append(row_values)
        
        return values
    
    def _extract_assignments(self, ast: ASTNode) -> List[Dict[str, Any]]:
        """Extract assignments from AST."""
        assignments = []
        
        # Look for assignment nodes
        assignment_nodes = find_all_nodes_by_type(ast, "assignment")
        for assignment_node in assignment_nodes:
            column_name = None
            value = None
            
            # Extract column name
            column_node = find_node_by_type(assignment_node, "column_ref")
            if column_node:
                column_name = extract_node_value(column_node)
            
            # Extract value
            value_node = find_node_by_type(assignment_node, "value")
            if value_node:
                value = extract_node_value(value_node)
            
            if column_name and value is not None:
                assignments.append({
                    "column": column_name,
                    "value": value
                })
        
        return assignments
    
    def _extract_create_type(self, ast: ASTNode) -> str:
        """Extract CREATE object type from AST."""
        # Look for object type keywords
        for node in traverse_depth_first(ast):
            if node.type in ["TABLE", "INDEX", "VIEW", "DATABASE", "SCHEMA"]:
                return node.type
        
        return "TABLE"  # Default
    
    def _extract_object_name(self, ast: ASTNode) -> str:
        """Extract object name from AST."""
        # Look for object name
        name_node = find_node_by_type(ast, "object_name")
        if name_node:
            name = extract_node_value(name_node)
            if name:
                return name
        
        # Fallback: look for identifier
        for node in traverse_depth_first(ast):
            if node.type == "IDENTIFIER" and node.value:
                return node.value
        
        return "unknown_object"
    
    def _extract_create_definition(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CREATE definition from AST."""
        definition = {}
        
        # Look for column definitions
        column_def_nodes = find_all_nodes_by_type(ast, "column_definition")
        if column_def_nodes:
            columns = []
            for col_def_node in column_def_nodes:
                column_name = extract_node_value(col_def_node)
                if column_name:
                    columns.append(column_name)
            definition["columns"] = columns
        
        # Look for constraints
        constraint_nodes = find_all_nodes_by_type(ast, "constraint")
        if constraint_nodes:
            constraints = []
            for constraint_node in constraint_nodes:
                constraint_type = extract_node_value(constraint_node)
                if constraint_type:
                    constraints.append(constraint_type)
            definition["constraints"] = constraints
        
        return definition
    
    def _extract_alter_action(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract ALTER action from AST."""
        action = {}
        
        # Look for alter action type
        action_node = find_node_by_type(ast, "alter_action")
        if action_node:
            action_type = extract_node_value(action_node)
            if action_type:
                action["type"] = action_type
        
        # Look for column operations
        column_op_nodes = find_all_nodes_by_type(ast, "column_operation")
        if column_op_nodes:
            operations = []
            for op_node in column_op_nodes:
                op_type = extract_node_value(op_node)
                if op_type:
                    operations.append(op_type)
            action["operations"] = operations
        
        return action
    
    def _extract_drop_type(self, ast: ASTNode) -> str:
        """Extract DROP object type from AST."""
        # Look for object type keywords
        for node in traverse_depth_first(ast):
            if node.type in ["TABLE", "INDEX", "VIEW", "DATABASE", "SCHEMA"]:
                return node.type
        
        return "TABLE"  # Default
    
    def _extract_expression(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract expression from AST node."""
        if not ast:
            return {}
        
        # Handle different expression types
        if ast.type == "comparison":
            return self._extract_comparison(ast)
        elif ast.type == "logical":
            return self._extract_logical(ast)
        elif ast.type == "arithmetic":
            return self._extract_arithmetic(ast)
        elif ast.type == "function_call":
            return self._extract_function_call(ast)
        elif ast.type == "column_ref":
            return {"type": "column", "name": extract_node_value(ast)}
        elif ast.type == "literal":
            return {"type": "literal", "value": extract_node_value(ast)}
        else:
            # Generic expression
            return {"type": "expression", "value": extract_node_value(ast)}
    
    def _extract_comparison(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract comparison expression."""
        left = None
        right = None
        operator = None
        
        for child in ast.children:
            if child.type == "column_ref":
                left = extract_node_value(child)
            elif child.type == "literal":
                right = extract_node_value(child)
            elif child.type in ["EQUAL", "NOT_EQUAL", "LESS", "GREATER", "LESS_EQUAL", "GREATER_EQUAL"]:
                operator = child.type
        
        return {
            "type": "comparison",
            "left": left,
            "operator": operator,
            "right": right
        }
    
    def _extract_logical(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract logical expression."""
        operator = None
        operands = []
        
        for child in ast.children:
            if child.type in ["AND", "OR", "NOT"]:
                operator = child.type
            else:
                operands.append(self._extract_expression(child))
        
        return {
            "type": "logical",
            "operator": operator,
            "operands": operands
        }
    
    def _extract_arithmetic(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract arithmetic expression."""
        operator = None
        operands = []
        
        for child in ast.children:
            if child.type in ["PLUS", "MINUS", "MULTIPLY", "DIVIDE"]:
                operator = child.type
            else:
                operands.append(self._extract_expression(child))
        
        return {
            "type": "arithmetic",
            "operator": operator,
            "operands": operands
        }
    
    def _extract_function_call(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract function call."""
        function_name = None
        arguments = []
        
        for child in ast.children:
            if child.type == "function_name":
                function_name = extract_node_value(child)
            elif child.type == "argument_list":
                arg_nodes = find_all_nodes_by_type(child, "argument")
                for arg_node in arg_nodes:
                    arguments.append(self._extract_expression(arg_node))
        
        return {
            "type": "function_call",
            "function": function_name,
            "arguments": arguments
        }


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
