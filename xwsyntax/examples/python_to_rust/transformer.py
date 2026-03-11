#!/usr/bin/env python3
"""
AST Transformation Engine for Python ↔ Rust Conversion
Transforms AST nodes between Python and Rust representations using
schema-aware type conversion and pattern matching.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 15-Jan-2025
"""

from __future__ import annotations
from typing import Any, Optional, Dict
from pathlib import Path
import json
from exonware.xwsyntax.syntax_tree import ParseNode


class ASTTransformer:
    """
    AST transformation engine for Python ↔ Rust conversion.
    Handles AST node transformations using:
    - Type mappings from schema files
    - Pattern matching and replacement
    - Scope and context tracking
    """

    def __init__(self, schemas: Optional[Dict[str, Any]] = None):
        """
        Initialize transformer with schemas.
        Args:
            schemas: Dictionary containing type_mappings, pattern_mappings, and conversion_rules
        """
        self.schemas = schemas or {}
        self.type_mappings = self.schemas.get('type_mappings', {})
        self.pattern_mappings = self.schemas.get('pattern_mappings', {})
        self.conversion_rules = self.schemas.get('conversion_rules', {})
        self._scope_stack: list[Dict[str, Any]] = []

    def transform_python_to_rust(self, ast: ParseNode) -> ParseNode:
        """
        Transform Python AST to Rust AST.
        Args:
            ast: Python AST node
        Returns:
            Rust AST node
        """
        if ast is None:
            return ast
        # Handle different node types
        node_type = ast.type.lower()
        # Transform based on node type
        if node_type in ['functiondef', 'function_definition', 'def', 'funcdef']:
            return self._transform_function_def(ast, direction='python_to_rust')
        elif node_type in ['classdef', 'class_definition', 'class']:
            return self._transform_class_def(ast, direction='python_to_rust')
        elif node_type in ['return', 'return_statement', 'return_stmt']:
            return self._transform_return(ast, direction='python_to_rust')
        elif node_type == 'expr_stmt':
            # expr_stmt can contain assignments, function calls, augmented assignments, or other expressions
            # Check the first child to determine the actual type
            if ast.children and len(ast.children) > 0:
                first_child_type = ast.children[0].type.lower()
                if first_child_type == 'assign':
                    # Transform assignment and wrap in expr_stmt
                    transformed = self._transform_assignment(ast.children[0], direction='python_to_rust')
                    # Assignment already creates a statement (local/let_stmt), so return as-is
                    return transformed
                elif first_child_type in ['call', 'funccall']:
                    # Transform function call and wrap in expr_stmt for Rust
                    transformed_call = self._transform_call(ast.children[0], direction='python_to_rust')
                    # Wrap in expr_stmt (which adds semicolon)
                    return ParseNode(
                        type='expr_stmt',
                        value=None,
                        children=[transformed_call],
                        metadata=ast.metadata
                    )
                elif first_child_type == 'augassign':
                    # Transform augmented assignment (e.g., total += num) and wrap in expr_stmt
                    transformed_aug = self.transform_python_to_rust(ast.children[0])
                    # Wrap in expr_stmt (which adds semicolon)
                    return ParseNode(
                        type='expr_stmt',
                        value=None,
                        children=[transformed_aug],
                        metadata=ast.metadata
                    )
            # For other expr_stmt, transform as expression statement and wrap in expr_stmt
            transformed = self._transform_generic(ast, direction='python_to_rust')
            # If it's not already an expr_stmt, wrap it
            if transformed.type != 'expr_stmt':
                return ParseNode(
                    type='expr_stmt',
                    value=None,
                    children=[transformed] if transformed.children else [transformed],
                    metadata=ast.metadata
                )
            return transformed
        elif node_type in ['assign', 'assignment']:
            return self._transform_assignment(ast, direction='python_to_rust')
        elif node_type in ['call', 'function_call', 'funccall']:
            return self._transform_call(ast, direction='python_to_rust')
        elif node_type in ['name', 'identifier', 'var']:
            return self._transform_identifier(ast, direction='python_to_rust')
        elif node_type in ['type', 'annotation', 'typedparam']:
            return self._transform_type(ast, direction='python_to_rust')
        elif node_type in ['raise_stmt', 'raise']:
            return self._transform_raise(ast, direction='python_to_rust')
        elif node_type in ['if_stmt', 'if']:
            return self._transform_if(ast, direction='python_to_rust')
        elif node_type in ['for_stmt', 'for']:
            return self._transform_for(ast, direction='python_to_rust')
        elif node_type == 'augassign':
            return self._transform_augassign(ast, direction='python_to_rust')
        elif node_type in ['list_comprehension', 'listcomp']:
            return self._transform_list_comprehension(ast, direction='python_to_rust')
        elif node_type == 'list':
            # Handle list literals (not comprehensions)
            return self._transform_generic(ast, direction='python_to_rust')
        elif node_type in ['arith_expr', 'term', 'factor']:
            return self._transform_arithmetic_expr(ast, direction='python_to_rust')
        elif node_type in ['comparison']:
            return self._transform_comparison(ast, direction='python_to_rust')
        elif node_type in ['var', 'name']:
            return self._transform_var(ast, direction='python_to_rust')
        elif node_type in ['terminal']:
            # Terminal nodes pass through
            return ast
        else:
            # Recursively transform children
            return self._transform_generic(ast, direction='python_to_rust')

    def transform_rust_to_python(self, ast: ParseNode) -> ParseNode:
        """
        Transform Rust AST to Python AST.
        Args:
            ast: Rust AST node
        Returns:
            Python AST node
        """
        if ast is None:
            return ast
        # Handle different node types
        node_type = ast.type.lower()
        # Transform based on node type
        if node_type in ['function_item', 'function', 'fn', 'fn_item']:
            return self._transform_function_def(ast, direction='rust_to_python')
        elif node_type in ['struct_item', 'struct']:
            return self._transform_class_def(ast, direction='rust_to_python')
        elif node_type in ['return_expr', 'return']:
            return self._transform_return(ast, direction='rust_to_python')
        elif node_type in ['local', 'let']:
            return self._transform_assignment(ast, direction='rust_to_python')
        elif node_type in ['call_expr', 'call']:
            return self._transform_call(ast, direction='rust_to_python')
        elif node_type in ['ident', 'identifier']:
            return self._transform_identifier(ast, direction='rust_to_python')
        elif node_type in ['type', 'path_type', 'type_']:
            return self._transform_type(ast, direction='rust_to_python')
        elif node_type == 'binary_expr':
            return self._transform_binary_expr_rust_to_python(ast)
        elif node_type == 'binary_op':
            # Transform binary_op to terminal with operator value
            return self._transform_binary_op_rust_to_python(ast)
        elif node_type == 'path_expr':
            # Rust path_expr might be a type name
            return self._transform_identifier(ast, direction='rust_to_python')
        elif node_type in ['item', 'crate']:
            # Handle crate and item nodes - transform their children
            return self._transform_generic(ast, direction='rust_to_python')
        elif node_type == 'stmt':
            # Rust stmt can wrap return_expr, expr_stmt, etc.
            # Transform the inner statement
            if ast.children:
                # stmt usually has one child (the actual statement)
                inner_stmt = ast.children[0]
                return self.transform_rust_to_python(inner_stmt)
            return self._transform_generic(ast, direction='rust_to_python')
        else:
            # Recursively transform children
            return self._transform_generic(ast, direction='rust_to_python')

    def _transform_function_def(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform function definition."""
        if direction == 'python_to_rust':
            # Transform Python function to Rust function
            # Python: funcdef -> name, parameters, return_type, suite
            # Rust: fn_item -> terminal(name), param_list, return_type, block
            new_type = 'fn_item'
            new_children = []
            # Extract function name (child_0 is name node)
            if ast.children and len(ast.children) > 0:
                name_node = ast.children[0]
                func_name = self._extract_name_value(name_node)
                if not func_name and name_node.children:
                    # Try to extract from children
                    for child in name_node.children:
                        if child.value:
                            func_name = str(child.value)
                            break
                        func_name = self._extract_name_value(child)
                        if func_name:
                            break
                # Create terminal node for function name
                new_children.append(ParseNode(
                    type='terminal',
                    value=func_name or 'unknown',
                    children=[],
                    metadata={}
                ))
            # Transform parameters (child_1 is parameters)
            if ast.children and len(ast.children) > 1:
                params_node = ast.children[1]
                param_list = self._transform_parameters_to_rust(params_node)
                new_children.append(param_list)
            else:
                # Empty param list
                new_children.append(ParseNode(type='param_list', value=None, children=[], metadata={}))
            # Transform return type (child_2 might be return type annotation)
            # Python funcdef structure: name, parameters, return_type (optional), suite
            # Need to check if child_2 is return_type or suite
            suite_index = 2  # Default to child_2 if no return type
            if ast.children and len(ast.children) > 2:
                return_type_node = ast.children[2]
                # Check if this is actually the return type (before suite)
                # Return type nodes are typically 'var', 'name', 'test', or 'getitem' (for generics)
                if return_type_node.type in ['var', 'name', 'test', 'getitem', 'subscript']:
                    # This is the return type annotation
                    rust_return_type = self._transform_return_type_to_rust(return_type_node)
                    if rust_return_type:
                        new_children.append(rust_return_type)
                    suite_index = 3  # Suite is at child_3 if return type exists
            # Transform suite to block
            if ast.children and len(ast.children) > suite_index:
                suite_node = ast.children[suite_index]
                if suite_node.type == 'suite':
                    block = self._transform_suite_to_block(suite_node)
                    new_children.append(block)
                else:
                    # Suite might be missing, treat remaining as suite
                    block = self._transform_suite_to_block(suite_node)
                    new_children.append(block)
            else:
                # Empty block
                new_children.append(ParseNode(type='block', value=None, children=[], metadata={}))
            return ParseNode(
                type=new_type,
                value=None,
                children=new_children,
                metadata=ast.metadata
            )
        else:
            # Transform Rust function to Python function
            # Rust fn_item structure from parsing: ["pub"] "fn" IDENTIFIER generic_params? "(" param_list? ")" [return_type] block
            # But when created by transformer, it's: name (child_0), param_list (child_1), return_type (child_2), block (child_3)
            # Check if this is a parsed Rust AST or transformed AST
            new_type = 'funcdef'
            new_children = []
            # Check if this looks like a parsed Rust AST (has many children with terminals)
            # or a transformed AST (has structured children)
            # Parsed Rust AST structure: terminal (name), param_list, return_type, block
            # Transformed AST structure: same, but might have different node types
            # Find components in order: name, param_list, return_type, block
            name_node = None
            param_list_node = None
            return_type_node = None
            block_node = None
            for child in ast.children:
                if child.type == 'terminal' and child.value and not name_node:
                    # Function name
                    name_node = child
                elif child.type == 'param_list':
                    param_list_node = child
                elif child.type == 'return_type':
                    return_type_node = child
                elif child.type == 'block':
                    block_node = child
                elif child.type in ['IDENTIFIER', 'name'] and child.value and not name_node:
                    # Alternative name node
                    name_node = child
            # Build Python function definition
            if name_node:
                func_name = str(name_node.value) if name_node.value else 'unknown'
                new_children.append(ParseNode(type='name', value=func_name, children=[], metadata={}))
            else:
                new_children.append(ParseNode(type='name', value='unknown', children=[], metadata={}))
            # Transform param_list to parameters
            if param_list_node:
                python_params = self._transform_param_list_to_python(param_list_node)
                new_children.append(python_params)
            else:
                new_children.append(ParseNode(type='parameters', value=None, children=[], metadata={}))
            # Transform return type
            if return_type_node:
                # Extract type from return_type node (similar to parameter type extraction)
                rust_type = None
                if return_type_node.children:
                    rust_type_node = return_type_node.children[0]  # This is type_
                    # type_ can have: path, &type_, *type_, array_type, or (type_list)
                    # For simple types like i32, it's usually a path
                    if rust_type_node.children:
                        # Check if it's a path
                        if rust_type_node.children[0].type == 'path':
                            path_node = rust_type_node.children[0]
                            # path: path_segment ("::" path_segment)*
                            # path_segment: IDENTIFIER [generic_args]
                            if path_node.children:
                                path_segment = path_node.children[0]
                                # path_segment should have IDENTIFIER as first child
                                if path_segment.children:
                                    identifier = path_segment.children[0]
                                    if identifier.value:
                                        rust_type = str(identifier.value)
                                    elif identifier.type == 'IDENTIFIER' or identifier.type == 'terminal':
                                        rust_type = str(identifier.value) if identifier.value else None
                                elif path_segment.value:
                                    rust_type = str(path_segment.value)
                        # Try direct value
                        elif rust_type_node.value:
                            rust_type = str(rust_type_node.value)
                    # Fallback: try to extract from transformed type
                    if not rust_type:
                        transformed_type = self.transform_rust_to_python(rust_type_node)
                        if transformed_type.value:
                            rust_type = str(transformed_type.value)
                        elif transformed_type.children:
                            # Try to extract from children recursively
                            def extract_type_value(node):
                                if node.value:
                                    return str(node.value)
                                if node.children:
                                    for child in node.children:
                                        val = extract_type_value(child)
                                        if val:
                                            return val
                                return None
                            rust_type = extract_type_value(transformed_type)
                if rust_type:
                    python_type = self._map_type(rust_type, 'rust_to_python')
                    # Create a simple name node for return type
                    new_children.append(ParseNode(type='name', value=python_type, children=[], metadata={}))
            # Transform block to suite
            if block_node:
                suite = self._transform_block_to_suite(block_node)
                new_children.append(suite)
            else:
                new_children.append(ParseNode(type='suite', value=None, children=[], metadata={}))
            return ParseNode(
                type=new_type,
                value=ast.value,
                children=new_children,
                metadata=ast.metadata
            )

    def _transform_class_def(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform class definition."""
        if direction == 'python_to_rust':
            # Python class becomes Rust struct + impl
            # Extract class name (first child is usually the name)
            class_name = 'Unknown'
            if ast.children and len(ast.children) > 0:
                name_node = ast.children[0]
                class_name = self._extract_name_value(name_node)
            elif ast.value:
                class_name = str(ast.value)
            # Separate struct fields from methods
            struct_fields = []
            methods = []
            for child in ast.children:
                if child.type == 'suite':
                    # Process suite children (methods and assignments)
                    for suite_child in child.children:
                        if suite_child.type == 'funcdef':
                            # Extract function name
                            func_name = ''
                            if suite_child.children and len(suite_child.children) > 0:
                                func_name = self._extract_name_value(suite_child.children[0])
                            # Check if it's __init__ (constructor)
                            if func_name == '__init__':
                                # Extract parameters as struct fields
                                for param_child in suite_child.children:
                                    if param_child.type == 'parameters':
                                        for param in param_child.children:
                                            if param.type in ['paramvalue', 'typedparam']:
                                                # Extract field name and type
                                                field_name = ''
                                                field_type = None
                                                if param.children and len(param.children) > 0:
                                                    # First child is the name
                                                    name_node = param.children[0]
                                                    field_name = self._extract_name_value(name_node)
                                                    # Check for type annotation
                                                    if len(param.children) > 1:
                                                        type_node = param.children[1]
                                                        # Extract type string representation
                                                        field_type = self._extract_type_string(type_node)
                                                        if field_type:
                                                            field_type = self._map_type(field_type, 'python_to_rust')
                                                if field_name and field_name != 'self':
                                                    struct_fields.append({
                                                        'name': field_name,
                                                        'type': field_type or 'String'  # Default type
                                                    })
                            else:
                                # Regular method
                                methods.append(self.transform_python_to_rust(suite_child))
                        elif suite_child.type == 'expr_stmt' or suite_child.type == 'assign':
                            # Class-level assignment (field declaration)
                            # This would be handled as struct field
                            pass
            # Create struct node
            struct_children = []
            for field in struct_fields:
                # Create struct_field with proper structure: [pub (optional), name, type]
                field_children = [
                    ParseNode(type='terminal', value=field['name'], children=[], metadata={}),
                    ParseNode(type='type_', value=field['type'], children=[], metadata={})
                ]
                struct_children.append(ParseNode(
                    type='struct_field',
                    value=None,
                    children=field_children,
                    metadata={}
                ))
            return ParseNode(
                type='struct_item',
                value=class_name,
                children=struct_children,
                metadata=ast.metadata
            )
        else:
            # Rust struct becomes Python class
            return ParseNode(
                type='classdef',
                value=ast.value,
                children=[self.transform_rust_to_python(c) for c in ast.children],
                metadata=ast.metadata
            )

    def _extract_type_from_param(self, param: ParseNode) -> Optional[str]:
        """Extract type annotation from parameter node."""
        if len(param.children) >= 2:
            type_node = param.children[1]
            if type_node.value:
                return str(type_node.value)
            # Try to extract from children
            if type_node.children:
                return self._extract_type_from_node(type_node)
        return None

    def _extract_type_from_node(self, node: ParseNode) -> Optional[str]:
        """Extract type string from type annotation node."""
        if node.value:
            return str(node.value)
        if node.children:
            parts = []
            for child in node.children:
                part = self._extract_type_from_node(child)
                if part:
                    parts.append(part)
            if parts:
                return '['.join(parts)  # Handle generic types like list[int]
        return None

    def _extract_type_string(self, node: ParseNode) -> Optional[str]:
        """Extract type string representation from type annotation node."""
        # Try direct value first
        if node.value:
            return str(node.value)
        # For complex types, build string representation
        if node.children:
            # Check if it's a subscript/getitem (for generics like list[int])
            if node.type in ['getitem', 'subscript']:
                # Format: base[args]
                if len(node.children) >= 2:
                    base = self._extract_type_string(node.children[0])
                    args = self._extract_type_string(node.children[1])
                    if base and args:
                        return f"{base}[{args}]"
            # Check if it's a name/var node
            if node.type in ['name', 'var']:
                name_value = self._extract_name_value(node)
                if name_value:
                    return name_value
            # For getitem, the structure is: getitem -> [base, subscript]
            # The subscript might be the type argument
            if node.type == 'getitem' and len(node.children) >= 2:
                base_node = node.children[0]
                subscript_node = node.children[1]
                base = self._extract_type_string(base_node)
                subscript = self._extract_type_string(subscript_node)
                if base and subscript:
                    return f"{base}[{subscript}]"
            # Try to extract from children recursively
            parts = []
            for child in node.children:
                part = self._extract_type_string(child)
                if part:
                    parts.append(part)
            if parts:
                # Join parts appropriately
                if len(parts) == 1:
                    return parts[0]
                # For multiple parts, might be a generic or tuple
                return ', '.join(parts)
        return None

    def _transform_return(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform return statement."""
        if direction == 'python_to_rust':
            # Transform Python return_stmt to Rust return_expr
            # Python: return_stmt -> return [expr]
            # Rust: return_expr -> return [expr];
            new_type = 'return_expr'
            new_children = []
            if ast.children:
                for child in ast.children:
                    transformed_child = self.transform_python_to_rust(child)
                    new_children.append(transformed_child)
            return ParseNode(
                type=new_type,
                value=None,
                children=new_children,
                metadata=ast.metadata
            )
        else:
            # Transform Rust return_expr to Python return_stmt
            # Rust: return_expr -> "return" [expr]
            # Python: return_stmt -> return [expr]
            new_type = 'return_stmt'
            new_children = []
            if ast.children:
                # Transform expression children (skip any "return" keyword nodes)
                for child in ast.children:
                    # Skip terminal nodes that are just the "return" keyword
                    if child.type == 'terminal' and str(child.value).lower() == 'return':
                        continue
                    transformed_child = self.transform_rust_to_python(child)
                    new_children.append(transformed_child)
            return ParseNode(
                type=new_type,
                value=None,
                children=new_children,
                metadata=ast.metadata
            )

    def _transform_assignment(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform assignment statement."""
        if direction == 'python_to_rust':
            new_type = 'local'  # Rust uses 'let' which becomes 'local' in AST
        else:
            new_type = 'assign'
        return ParseNode(
            type=new_type,
            value=ast.value,
            children=[self._transform_generic(c, direction) for c in ast.children],
            metadata=ast.metadata
        )

    def _transform_call(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform function call."""
        if direction == 'python_to_rust':
            # Transform Python funccall to Rust call_expr
            # funccall structure: function_name (child_0), arguments (child_1)
            # call_expr structure: function_expr (child_0), args... (children[1:])
            new_type = 'call_expr'
            new_children = []
            # Transform function name (first child)
            if ast.children and len(ast.children) > 0:
                func_name_node = ast.children[0]
                # Transform to path_expr
                func_expr = self._transform_var(func_name_node, direction) if func_name_node.type == 'var' else self.transform_python_to_rust(func_name_node)
                new_children.append(func_expr)
            # Transform arguments
            if ast.children and len(ast.children) > 1:
                args_node = ast.children[1]
                # Arguments node has children (each argument)
                if args_node.children:
                    for arg in args_node.children:
                        transformed_arg = self.transform_python_to_rust(arg)
                        new_children.append(transformed_arg)
            return ParseNode(
                type=new_type,
                value=None,
                children=new_children,
                metadata=ast.metadata
            )
        else:
            # Transform Rust call_expr to Python funccall
            # Just transform children
            return self._transform_generic(ast, direction)

    def _transform_identifier(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform identifier/name."""
        if direction == 'python_to_rust':
            # Transform Python var/name to Rust path_expr
            return self._transform_var(ast, direction)
        # Identifiers are mostly the same, but may need name mangling
        return ast

    def _transform_parameters(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform function parameters."""
        # Transform parameter types
        return self._transform_generic(ast, direction)

    def _extract_name_value(self, name_node: ParseNode) -> str:
        """Extract name value from name node."""
        if name_node.value:
            return str(name_node.value)
        if name_node.children:
            # Name node might have a child with the actual name
            for child in name_node.children:
                if child.value:
                    return str(child.value)
                if child.type == 'NAME' or child.type == 'IDENTIFIER':
                    return str(child.value) if child.value else ''
        return ''

    def _transform_parameters_to_rust(self, params_node: ParseNode) -> ParseNode:
        """Transform Python parameters to Rust param_list."""
        param_list_children = []
        if params_node.children:
            for param in params_node.children:
                if param.type == 'typedparam' or param.type == 'paramvalue':
                    # Extract parameter name and type
                    param_name = ''
                    param_type = None
                    if param.children:
                        # First child is the name
                        if len(param.children) > 0:
                            param_name = self._extract_name_value(param.children[0])
                        # Second child might be the type annotation
                        if len(param.children) > 1:
                            type_node = param.children[1]
                            param_type = self._extract_type_string(type_node)
                            # Map Python type to Rust type
                            if param_type:
                                param_type = self._map_type(param_type, 'python_to_rust')
                    if param_name and param_name != 'self':
                        # Create Rust param node
                        param_node = ParseNode(
                            type='param',
                            value=None,
                            children=[
                                ParseNode(type='terminal', value=param_name, children=[], metadata={}),
                                ParseNode(type='type_', value=param_type or 'String', children=[], metadata={})
                            ],
                            metadata={}
                        )
                        param_list_children.append(param_node)
        return ParseNode(
            type='param_list',
            value=None,
            children=param_list_children,
            metadata={}
        )

    def _transform_return_type_to_rust(self, return_type_node: ParseNode) -> Optional[ParseNode]:
        """Transform Python return type to Rust return_type."""
        # Extract type value from the node
        type_value = None
        # Check for getitem/subscript (generic types like list[int])
        if return_type_node.type in ['getitem', 'subscript']:
            type_value = self._extract_type_string(return_type_node)
        # var node contains a name child
        elif return_type_node.type == 'var' and return_type_node.children:
            # For var nodes, might have nested structure
            if return_type_node.children:
                # Check if first child is getitem (generic type)
                if return_type_node.children[0].type in ['getitem', 'subscript']:
                    type_value = self._extract_type_string(return_type_node.children[0])
                else:
                    type_value = self._extract_name_value(return_type_node.children[0])
        # Try to get value directly
        elif return_type_node.value:
            type_value = str(return_type_node.value)
        # Try to extract from children (for complex types)
        elif return_type_node.children:
            type_value = self._extract_type_string(return_type_node)
        # Try to extract from name node
        elif return_type_node.type in ['name']:
            type_value = self._extract_name_value(return_type_node)
        # Try test nodes (Python return type annotations are often 'test' nodes)
        elif return_type_node.type == 'test':
            type_value = self._extract_type_string(return_type_node)
        if type_value:
            rust_type = self._map_type(type_value, 'python_to_rust')
            # Create type_ node with the mapped type
            return ParseNode(
                type='return_type',
                value=None,
                children=[
                    ParseNode(type='type_', value=rust_type, children=[], metadata={})
                ],
                metadata={}
            )
        return None

    def _transform_suite_to_block(self, suite_node: ParseNode) -> ParseNode:
        """Transform Python suite to Rust block."""
        block_children = []
        if suite_node.children:
            for stmt in suite_node.children:
                # Transform each statement
                transformed_stmt = self.transform_python_to_rust(stmt)
                # Convert return_stmt to return_expr
                if transformed_stmt.type == 'return_stmt':
                    transformed_stmt = ParseNode(
                        type='return_expr',
                        value=None,
                        children=transformed_stmt.children,
                        metadata=transformed_stmt.metadata
                    )
                # Convert other statement types as needed
                block_children.append(transformed_stmt)
        return ParseNode(
            type='block',
            value=None,
            children=block_children,
            metadata={}
        )

    def _transform_block_to_suite(self, block_node: ParseNode) -> ParseNode:
        """Transform Rust block to Python suite."""
        suite_children = []
        if block_node.children:
            for i, stmt in enumerate(block_node.children):
                # Transform each statement from Rust to Python
                transformed_stmt = self.transform_rust_to_python(stmt)
                # Handle return_expr or return_stmt (already transformed)
                if transformed_stmt.type == 'return_expr':
                    # return_expr children are the expression to return
                    # Create return_stmt with those children
                    transformed_stmt = ParseNode(
                        type='return_stmt',
                        value=None,
                        children=transformed_stmt.children if transformed_stmt.children else [],
                        metadata=transformed_stmt.metadata
                    )
                # Convert expr_stmt to simple_stmt if needed
                elif transformed_stmt.type == 'expr_stmt':
                    # Check if it's just an expression (Rust's implicit return)
                    if transformed_stmt.children and len(transformed_stmt.children) > 0:
                        expr = transformed_stmt.children[0]
                        # Check if the expression is a return_expr (from Rust return statement)
                        # Note: return_expr is already transformed to return_stmt by _transform_return
                        # So we should check for return_stmt instead
                        if expr.type == 'return_stmt':
                            # Already a return_stmt, use it directly
                            transformed_stmt = expr
                        elif expr.type == 'return_expr':
                            # Extract the expression from return_expr and create return_stmt
                            return_expr_children = expr.children if expr.children else []
                            transformed_stmt = ParseNode(
                                type='return_stmt',
                                value=None,
                                children=return_expr_children,
                                metadata=transformed_stmt.metadata
                            )
                        # If it's the last statement and it's a bare expression (not assignment, call, etc.),
                        # it might be an implicit return in Rust
                        else:
                            is_last = (i == len(block_node.children) - 1)
                            if is_last and expr.type not in ['assign_expr', 'augassign_expr', 'call_expr', 'funccall']:
                                # This is likely an implicit return - wrap in return_stmt
                                transformed_stmt = ParseNode(
                                    type='return_stmt',
                                    value=None,
                                    children=[expr],
                                    metadata=transformed_stmt.metadata
                                )
                elif transformed_stmt.type not in ['return_stmt', 'expr_stmt']:
                    # Bare expression (implicit return in Rust)
                    is_last = (i == len(block_node.children) - 1)
                    if is_last:
                        # Wrap in return_stmt for Python
                        transformed_stmt = ParseNode(
                            type='return_stmt',
                            value=None,
                            children=[transformed_stmt],
                            metadata=transformed_stmt.metadata
                        )
                suite_children.append(transformed_stmt)
        return ParseNode(
            type='suite',
            value=None,
            children=suite_children,
            metadata={}
        )

    def _transform_param_list_to_python(self, param_list_node: ParseNode) -> ParseNode:
        """Transform Rust param_list to Python parameters."""
        param_children = []
        if param_list_node.children:
            for param in param_list_node.children:
                if param.type == 'param':
                    # Rust param: name (child_0), type (child_1)
                    # Python paramvalue: name (child_0), type (child_1, optional)
                    if len(param.children) >= 2:
                        param_name_node = param.children[0]
                        param_type_node = param.children[1]
                        param_name = str(param_name_node.value) if param_name_node.value else 'unknown'
                        # Extract type and map to Python
                        # Type might be in value or in a child node (path_expr, type_, etc.)
                        rust_type = None
                        # Try direct value first
                        if param_type_node.value:
                            rust_type = str(param_type_node.value)
                        # Try extracting from children (for path_expr, type_, etc.)
                        elif param_type_node.children:
                            # Check if it's a path_expr or has a path_expr child
                            if param_type_node.type == 'path_expr':
                                if param_type_node.value:
                                    rust_type = str(param_type_node.value)
                                elif param_type_node.children:
                                    # Path might have segments
                                    first_child = param_type_node.children[0]
                                    if first_child.value:
                                        rust_type = str(first_child.value)
                                    elif first_child.type == 'IDENTIFIER' or first_child.type == 'terminal':
                                        rust_type = str(first_child.value) if first_child.value else None
                            else:
                                # Check first child
                                first_child = param_type_node.children[0]
                                if first_child.value:
                                    rust_type = str(first_child.value)
                                elif first_child.type == 'path_expr':
                                    if first_child.value:
                                        rust_type = str(first_child.value)
                                    elif first_child.children:
                                        # Get from path segments
                                        rust_type = str(first_child.children[0].value) if first_child.children[0].value else None
                                elif first_child.type in ['IDENTIFIER', 'terminal']:
                                    rust_type = str(first_child.value) if first_child.value else None
                        # If still no type, try to extract from the node itself using helper
                        if not rust_type:
                            # Try to extract type string from node
                            if param_type_node.type == 'type_':
                                rust_type = self._extract_type_string(param_type_node)
                            else:
                                # Last resort: use value or default
                                rust_type = 'String'  # Default
                        # Map Rust type to Python type
                        python_type = self._map_type(rust_type, 'rust_to_python') if rust_type else 'str'
                        param_children.append(ParseNode(
                            type='paramvalue',
                            value=None,
                            children=[
                                ParseNode(type='name', value=param_name, children=[], metadata={}),
                                ParseNode(type='var', value=None, children=[
                                    ParseNode(type='name', value=python_type, children=[], metadata={})
                                ], metadata={})
                            ],
                            metadata={}
                        ))
        return ParseNode(
            type='parameters',
            value=None,
            children=param_children,
            metadata={}
        )

    def _transform_type(self, ast: ParseNode, direction: str) -> ParseNode:
        """
        Transform type annotation.
        Uses type mappings from schema to convert types.
        """
        if ast.value:
            type_name = str(ast.value)
            mapped_type = self._map_type(type_name, direction)
            if mapped_type != type_name:
                return ParseNode(
                    type=ast.type,
                    value=mapped_type,
                    children=[self._transform_generic(c, direction) for c in ast.children],
                    metadata=ast.metadata
                )
        return self._transform_generic(ast, direction)

    def _map_type(self, python_type: str, direction: str) -> str:
        """
        Map type from Python to Rust or vice versa.
        Handles:
        - Primitives (int, str, bool, etc.)
        - Collections with generics (list[int], Dict[str, int])
        - Optional types (Optional[T], Union[None, T])
        - Result types for error handling
        Args:
            python_type: Type name to map
            direction: 'python_to_rust' or 'rust_to_python'
        Returns:
            Mapped type name
        """
        if not python_type:
            return python_type
        if direction == 'python_to_rust':
            # Get type mappings
            primitives = self.type_mappings.get('primitives', {})
            collections = self.type_mappings.get('collections', {})
            optional = self.type_mappings.get('optional', {})
            # Check primitives
            if python_type in primitives:
                return primitives[python_type]
            # Handle generic types (e.g., list[int], List[str])
            python_type_clean = python_type.strip()
            # Optional types
            if python_type_clean.startswith('Optional[') or python_type_clean.startswith('Union[None'):
                # Extract inner type
                inner_type = self._extract_generic_inner(python_type_clean)
                mapped_inner = self._map_type(inner_type, direction)
                return f'Option<{mapped_inner}>'
            # List types
            if python_type_clean.startswith('list[') or python_type_clean.startswith('List['):
                inner_type = self._extract_generic_inner(python_type_clean)
                mapped_inner = self._map_type(inner_type, direction)
                return f'Vec<{mapped_inner}>'
            # Dict types
            if python_type_clean.startswith('dict[') or python_type_clean.startswith('Dict['):
                # Extract key and value types
                inner = self._extract_generic_inner(python_type_clean)
                if ',' in inner:
                    key_type, value_type = inner.split(',', 1)
                    mapped_key = self._map_type(key_type.strip(), direction)
                    mapped_value = self._map_type(value_type.strip(), direction)
                    return f'HashMap<{mapped_key}, {mapped_value}>'
                else:
                    return 'HashMap<String, String>'  # Default
            # Tuple types
            if python_type_clean.startswith('tuple[') or python_type_clean.startswith('Tuple['):
                inner = self._extract_generic_inner(python_type_clean)
                types = [t.strip() for t in inner.split(',')]
                mapped_types = [self._map_type(t, direction) for t in types]
                return f'({", ".join(mapped_types)})'
            # Check collections (non-generic)
            if python_type_clean in ['list', 'List']:
                return 'Vec<String>'  # Default to Vec<String>
            if python_type_clean in ['dict', 'Dict']:
                return 'HashMap<String, String>'
            if python_type_clean in ['set', 'Set']:
                return 'HashSet<String>'
            # Check custom mappings
            custom = self.type_mappings.get('custom', {})
            if python_type_clean in custom:
                return custom[python_type_clean]
        else:
            # Reverse mapping (Rust to Python)
            primitives = self.type_mappings.get('primitives', {})
            # Reverse lookup
            for py_type, rust_type in primitives.items():
                if python_type == rust_type:
                    return py_type
            # Handle Rust generic types
            if python_type.startswith('Vec<'):
                inner = self._extract_generic_inner(python_type)
                mapped_inner = self._map_type(inner, direction)
                return f'list[{mapped_inner}]'
            if python_type.startswith('Option<'):
                inner = self._extract_generic_inner(python_type)
                mapped_inner = self._map_type(inner, direction)
                return f'Optional[{mapped_inner}]'
            if python_type.startswith('HashMap<'):
                inner = self._extract_generic_inner(python_type)
                if ',' in inner:
                    key_type, value_type = inner.split(',', 1)
                    mapped_key = self._map_type(key_type.strip(), direction)
                    mapped_value = self._map_type(value_type.strip(), direction)
                    return f'dict[{mapped_key}, {mapped_value}]'
                else:
                    return 'dict[str, str]'
            if python_type == 'Vec':
                return 'list'
            if python_type == 'HashMap':
                return 'dict'
            if python_type == 'Option':
                return 'Optional'
            if python_type == 'Result':
                return 'Union'  # Result<T, E> becomes Union[T, E] or raises exception
        # No mapping found, return original
        return python_type

    def _extract_generic_inner(self, generic_type: str) -> str:
        """Extract inner type from generic type string like 'list[int]' or 'Vec<String>'."""
        # Find the first '[' and matching ']'
        start = generic_type.find('[')
        if start == -1:
            return ''
        # Find matching closing bracket
        depth = 0
        for i in range(start, len(generic_type)):
            if generic_type[i] == '[':
                depth += 1
            elif generic_type[i] == ']':
                depth -= 1
                if depth == 0:
                    return generic_type[start + 1:i]
        return ''

    def _transform_raise(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform raise statement (Python) to return Err (Rust)."""
        if direction == 'python_to_rust':
            # Convert raise ValueError("msg") to return Err("msg".to_string())
            if ast.children:
                error_expr = ast.children[0]
                # Transform the error expression first
                transformed_error = self.transform_python_to_rust(error_expr)
                # Create Err(...) call expression
                err_call = ParseNode(
                    type='call_expr',
                    value=None,
                    children=[
                        ParseNode(type='path_expr', value='Err', children=[], metadata={}),
                        transformed_error
                    ],
                    metadata={}
                )
                # Create return statement with Err call
                return ParseNode(
                    type='return_expr',
                    value=None,
                    children=[err_call],
                    metadata=ast.metadata
                )
        return self._transform_generic(ast, direction)

    def _transform_if(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform if statement."""
        if direction == 'python_to_rust':
            # Python: if condition: body [else: else_body]
            # Rust: if condition { body } [else { else_body }]
            new_type = 'if_expr'
            new_children = []
            if ast.children:
                # Condition
                new_children.append(self.transform_python_to_rust(ast.children[0]))
                # Body (suite -> block)
                if len(ast.children) > 1:
                    body = ast.children[1]
                    if body.type == 'suite':
                        # Convert suite to block
                        block_children = [self.transform_python_to_rust(c) for c in body.children]
                        new_children.append(ParseNode(type='block', value=None, children=block_children, metadata={}))
                    else:
                        new_children.append(self.transform_python_to_rust(body))
                # Else clause
                if len(ast.children) > 2:
                    else_body = ast.children[2]
                    if else_body.type == 'suite':
                        block_children = [self.transform_python_to_rust(c) for c in else_body.children]
                        new_children.append(ParseNode(type='block', value=None, children=block_children, metadata={}))
                    else:
                        new_children.append(self.transform_python_to_rust(else_body))
            return ParseNode(
                type=new_type,
                value=ast.value,
                children=new_children,
                metadata=ast.metadata
            )
        return self._transform_generic(ast, direction)

    def _transform_for(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform for loop."""
        if direction == 'python_to_rust':
            # Python: for_stmt -> target, iter, suite
            # Rust: for_expr -> target, iter, block
            # Python: for target in iter: suite
            # Rust: for target in iter { block }
            if ast.children and len(ast.children) >= 3:
                # Extract target, iter, and suite
                target = self.transform_python_to_rust(ast.children[0])
                iter_expr = self.transform_python_to_rust(ast.children[1])
                suite = ast.children[2]
                # Transform suite to block
                if suite.type == 'suite':
                    block = self._transform_suite_to_block(suite)
                else:
                    block = self.transform_python_to_rust(suite)
                # Create Rust for_expr structure
                return ParseNode(
                    type='for_expr',
                    value=None,
                    children=[target, iter_expr, block],
                    metadata=ast.metadata
                )
            return self._transform_generic(ast, direction)
        return self._transform_generic(ast, direction)

    def _transform_list_comprehension(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform list comprehension to iterator chain."""
        if direction == 'python_to_rust':
            # Python: [expr for target in iterable if condition?]
            # Rust: iterable.iter().map(|target| expr).collect()
            # Structure: listcomp -> expr, comp_for
            # comp_for -> for target in iterable [if condition]
            if ast.children and len(ast.children) >= 2:
                expr = self.transform_python_to_rust(ast.children[0])
                comp_for = ast.children[1]
                # Extract target and iterable from comp_for
                # comp_for structure: for, target, in, iterable [, if, condition]
                target = None
                iterable = None
                if comp_for.children:
                    # Find target (usually after 'for')
                    for i, child in enumerate(comp_for.children):
                        if child.type == 'NAME' or (child.value and child.type == 'name'):
                            if not target:
                                target = self.transform_python_to_rust(child)
                        elif child.type == 'expr' or child.type == 'test':
                            if not iterable:
                                iterable = self.transform_python_to_rust(child)
                        elif child.type == 'for_stmt':
                            # comp_for might be structured as for_stmt
                            if len(child.children) >= 3:
                                target = self.transform_python_to_rust(child.children[0])
                                iterable = self.transform_python_to_rust(child.children[1])
                # Create iterator chain: iterable.iter().map(|target| expr).collect()
                # For now, create a simple transformation
                # TODO: Properly implement iterator chain with map/collect
                if target and iterable:
                    # Create a basic iterator chain expression
                    # This would need proper Rust AST nodes for method calls
                    # For now, just return the transformed expression
                    # Full implementation would create: iterable.iter().map(|target| expr).collect()
                    return self._transform_generic(ast, direction)
            return self._transform_generic(ast, direction)
        return self._transform_generic(ast, direction)

    def _transform_comparison(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform comparison expression."""
        if direction == 'python_to_rust':
            # Python comparison: left comp_op right
            # Similar structure to arith_expr
            if ast.children and len(ast.children) >= 3:
                left = self.transform_python_to_rust(ast.children[0])
                operator = ast.children[1]
                right = self.transform_python_to_rust(ast.children[2])
                return ParseNode(
                    type='binary_expr',
                    value=None,
                    children=[left, operator, right],
                    metadata=ast.metadata
                )
        return self._transform_generic(ast, direction)

    def _transform_var(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform variable/name reference."""
        if direction == 'python_to_rust':
            # Extract the actual name value
            name_value = None
            # var node has a name child
            if ast.children:
                for child in ast.children:
                    if child.type == 'name':
                        name_value = self._extract_name_value(child)
                        if name_value:
                            break
            # If no name found, try direct extraction
            if not name_value:
                name_value = self._extract_name_value(ast)
            if name_value:
                return ParseNode(
                    type='path_expr',
                    value=name_value,
                    children=[],
                    metadata=ast.metadata
                )
        return ast

    def _transform_augassign(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform augmented assignment (e.g., total += num)."""
        if direction == 'python_to_rust':
            # Python: augassign -> target, op, value
            # Rust uses augmented assignment operators directly: total += num
            if ast.children and len(ast.children) >= 3:
                target = self.transform_python_to_rust(ast.children[0])
                operator_node = ast.children[1]
                value = self.transform_python_to_rust(ast.children[2])
                # Extract operator value (e.g., "+=")
                operator_value = None
                if operator_node.value:
                    operator_value = str(operator_node.value)
                elif operator_node.children:
                    # Operator might be in children
                    for child in operator_node.children:
                        if child.value:
                            operator_value = str(child.value)
                            break
                # Create binary_expr with augmented operator
                # For now, create a simple binary expression that will be formatted correctly
                # Rust augassign template should handle +=, -=, etc.
                augassign_node = ParseNode(
                    type='augassign_expr',
                    value=operator_value,
                    children=[target, value],
                    metadata=ast.metadata
                )
                return augassign_node
            return self._transform_generic(ast, direction)
        return self._transform_generic(ast, direction)

    def _transform_binary_op_rust_to_python(self, ast: ParseNode) -> ParseNode:
        """Transform Rust binary_op to Python operator terminal."""
        # binary_op: "+" | "-" | "*" | "/" | "%" | "==" | "!=" | "<" | ">" | "<=" | ">=" | "&&" | "||"
        # In Lark, when parsing alternatives like binary_op: "+" | "-", the matched token
        # might be stored in children or we need to check metadata
        operator_value = None
        # Check metadata for token information
        if ast.metadata:
            token_type = ast.metadata.get('token_type')
            if token_type:
                token_to_op = {
                    'PLUS': '+', 'MINUS': '-', 'STAR': '*', 'SLASH': '/', 'PERCENT': '%',
                    'EQEQ': '==', 'NE': '!=', 'LESSTHAN': '<', 'MORETHAN': '>',
                    'LE': '<=', 'GE': '>=', 'ANDAND': '&&', 'OROR': '||'
                }
                operator_value = token_to_op.get(token_type, token_type)
        # Check children for terminal nodes
        if not operator_value and ast.children:
            for child in ast.children:
                if child.type == 'terminal' and child.value:
                    operator_value = str(child.value)
                    break
                elif child.value:
                    operator_value = str(child.value)
                    break
                # Check child metadata
                elif child.metadata and child.metadata.get('token_type'):
                    token_type = child.metadata.get('token_type')
                    token_to_op = {
                        'PLUS': '+', 'MINUS': '-', 'STAR': '*', 'SLASH': '/', 'PERCENT': '%',
                        'EQEQ': '==', 'NE': '!=', 'LESSTHAN': '<', 'MORETHAN': '>',
                        'LE': '<=', 'GE': '>=', 'ANDAND': '&&', 'OROR': '||'
                    }
                    operator_value = token_to_op.get(token_type, token_type)
                    if operator_value:
                        break
        # If still no value, check if it's in the node itself
        if not operator_value and ast.value:
            operator_value = str(ast.value)
        # Default to '+' if nothing found (this shouldn't happen, but fallback)
        if not operator_value:
            operator_value = '+'
        return ParseNode(
            type='terminal',
            value=operator_value,
            children=[],
            metadata=ast.metadata
        )

    def _transform_binary_expr_rust_to_python(self, ast: ParseNode) -> ParseNode:
        """Transform Rust binary_expr to Python binary_expr."""
        # Rust binary_expr: left, operator (binary_op), right
        # Python: similar structure
        if ast.children and len(ast.children) >= 3:
            left = self.transform_rust_to_python(ast.children[0])
            operator = ast.children[1]  # This is binary_op
            right = self.transform_rust_to_python(ast.children[2])
            # Transform binary_op to get operator value
            # If binary_op has no children (Lark optimization), we need to infer from context
            # For now, try to extract from the binary_op node, or default to '+'
            operator_node = self._transform_binary_op_rust_to_python(operator)
            # If operator_node still has no value, try to infer from metadata or context
            if not operator_node.value or operator_node.value == '+':
                # Check if we can infer from the binary_op metadata
                if operator.metadata and operator.metadata.get('needs_inference'):
                    # We can't reliably infer without source code, so default to '+'
                    # In a real implementation, we'd extract from source code positions
                    pass
            return ParseNode(
                type='binary_expr',
                value=None,
                children=[left, operator_node, right],
                metadata=ast.metadata
            )
        return self._transform_generic(ast, direction='rust_to_python')

    def _transform_arithmetic_expr(self, ast: ParseNode, direction: str) -> ParseNode:
        """Transform arithmetic expression to binary expression."""
        if direction == 'python_to_rust':
            # Python arith_expr structure: [left_operand, operator, right_operand, ...]
            # Rust binary_expr structure: [left, operator, right]
            if ast.children and len(ast.children) >= 3:
                # Extract left operand, operator, and right operand
                left = self.transform_python_to_rust(ast.children[0])
                # Transform var nodes to path_expr
                if left.type == 'var':
                    left = self._transform_var(left, direction)
                operator = ast.children[1]  # terminal with operator value
                right = self.transform_python_to_rust(ast.children[2])
                # Transform var nodes to path_expr
                if right.type == 'var':
                    right = self._transform_var(right, direction)
                # Create binary_expr node
                return ParseNode(
                    type='binary_expr',
                    value=None,
                    children=[left, operator, right],
                    metadata=ast.metadata
                )
            elif ast.children and len(ast.children) == 1:
                # Single term, just transform it
                result = self.transform_python_to_rust(ast.children[0])
                if result.type == 'var':
                    result = self._transform_var(result, direction)
                return result
        return self._transform_generic(ast, direction)

    def _transform_generic(self, ast: ParseNode, direction: str) -> ParseNode:
        """
        Generic transformation - recursively transform children.
        Args:
            ast: AST node to transform
            direction: Transformation direction
        """
        if direction == 'python_to_rust':
            transformer = self.transform_python_to_rust
        else:
            transformer = self.transform_rust_to_python
        return ParseNode(
            type=ast.type,
            value=ast.value,
            children=[transformer(c) for c in ast.children] if ast.children else [],
            metadata=ast.metadata
        )
