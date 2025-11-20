#!/usr/bin/env python3
#exonware/xwsyntax/src/exonware/xwsyntax/unparser.py

"""
Grammar Unparser for xwsyntax

Generates text from AST using output grammars.
Implements the reverse of parsing: AST → Text

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.1
Generation Date: 29-Oct-2025
"""

import re
from typing import Any, Dict, List, Optional, Union, Callable
from .syntax_tree import ASTNode
from .output_grammar import OutputGrammar
from .errors import GrammarError


class GrammarUnparser:
    """
    Generates text from AST nodes using output grammar templates.
    
    Features:
    - Template-based generation
    - Format-specific rules
    - Pretty-printing support
    - Optimization for performance
    """
    
    def __init__(self, output_grammar: OutputGrammar):
        """
        Initialize unparser.
        
        Args:
            output_grammar: Output grammar defining generation templates
        """
        self.output_grammar = output_grammar
        self._template_cache: Dict[str, Any] = {}
        self._indent_level = 0
        self._pretty = output_grammar.get_formatting_rule('pretty', True)
        self._indent_size = output_grammar.get_formatting_rule('indent', 2)
    
    def unparse(self, ast: ASTNode, **options) -> str:
        """
        Generate text from AST node.
        
        Args:
            ast: AST node to unparse
            **options: Generation options (pretty, indent, etc.)
            
        Returns:
            Generated text
        """
        # Override formatting from options
        if 'pretty' in options:
            self._pretty = options['pretty']
        if 'indent' in options:
            self._indent_size = options['indent']
        
        # Generate from root
        return self._unparse_node(ast)
    
    def _unparse_node(self, node: ASTNode) -> str:
        """
        Unparse a single AST node.
        
        Args:
            node: AST node
            
        Returns:
            Generated text for this node
        """
        # Handle terminals (leaf nodes with values)
        if node.value is not None and not node.children:
            return self._unparse_terminal(node)
        
        # Handle non-terminals using templates
        template = self.output_grammar.get_template(node.type)
        
        if template:
            return self._apply_template(template, node)
        else:
            # Fallback: concatenate children
            return self._unparse_children(node)
    
    def _unparse_terminal(self, node: ASTNode) -> str:
        """Unparse terminal node."""
        value = node.value
        
        # Check for type-specific templates
        template = self.output_grammar.get_template(node.type)
        if template:
            context = {'value': value}
            return self._render_template(template, context)
        
        # Direct value return
        return str(value) if value is not None else ''
    
    def _unparse_children(self, node: ASTNode) -> str:
        """Unparse children and concatenate."""
        parts = []
        for child in node.children:
            child_text = self._unparse_node(child)
            if child_text:
                parts.append(child_text)
        
        # Add spacing if pretty
        if self._pretty:
            return ' '.join(parts)
        else:
            return ''.join(parts)
    
    def _apply_template(self, template: str, node: ASTNode) -> str:
        """
        Apply template to AST node.
        
        Args:
            template: Template string
            node: AST node providing data
            
        Returns:
            Rendered template
        """
        # Prepare context from node
        context = self._prepare_context(node)
        
        # Render template
        return self._render_template(template, context)
    
    def _prepare_context(self, node: ASTNode) -> Dict[str, Any]:
        """
        Prepare context dictionary from AST node.
        
        Args:
            node: AST node
            
        Returns:
            Context dictionary for template rendering
        """
        context = {
            'type': node.type,
            'value': node.value,
            'children': [],
        }
        
        # Add children
        for i, child in enumerate(node.children):
            child_data = {
                'type': child.type,
                'value': child.value if child.value else self._unparse_node(child),
                'index': i,
                'first': i == 0,
                'last': i == len(node.children) - 1
            }
            context['children'].append(child_data)
        
        # Add named children based on node type
        # This requires knowing the grammar structure
        context = self._add_named_children(context, node)
        
        return context
    
    def _add_named_children(self, context: Dict[str, Any], node: ASTNode) -> Dict[str, Any]:
        """Add named child accessors to context."""
        # Add generic child accessors
        for i, child in enumerate(node.children):
            context[f'child_{i}'] = self._unparse_node(child)
        
        # Extract actual value if this node has terminal children
        context['value'] = self._extract_actual_value(node)
        
        # Format-specific patterns
        if node.children:
            # JSON pair: key-value
            if node.type == 'pair' and len(node.children) >= 2:
                # Extract key (usually a string)
                key_val = self._extract_actual_value(node.children[0])
                context['key'] = key_val.strip('"') if key_val else ''
                context['value'] = self._unparse_node(node.children[1])
            
            # JSON object: collection of pairs
            elif node.type == 'object':
                pairs = []
                for child in node.children:
                    if child.type == 'pair' and len(child.children) >= 2:
                        key_val = self._extract_actual_value(child.children[0])
                        pairs.append({
                            'key': key_val.strip('"') if key_val else '',
                            'value': self._unparse_node(child.children[1])
                        })
                context['pairs'] = pairs
            
            # JSON array: collection of values
            elif node.type == 'array':
                items = []
                for child in node.children:
                    items.append({
                        'value': self._unparse_node(child)
                    })
                context['items'] = items
            
            # SQL select_list: extract columns
            elif node.type == 'select_list':
                if len(node.children) == 1 and self._extract_actual_value(node.children[0]) == '*':
                    context['wildcard'] = True
                    context['items'] = []
                else:
                    context['wildcard'] = False
                    context['items'] = [{'value': self._unparse_node(child)} for child in node.children]
            
            # SQL table_reference_list
            elif node.type == 'table_reference_list':
                context['tables'] = [{'value': self._unparse_node(child)} for child in node.children]
            
            # SQL select_statement - map children to named components
            elif node.type == 'select_statement':
                for child in node.children:
                    if child.type in ['select_list', 'from_clause', 'where_clause', 'group_by_clause', 'having_clause', 'order_by_clause', 'limit_clause']:
                        context[child.type] = self._unparse_node(child)
        
        return context
    
    def _extract_actual_value(self, node: ASTNode) -> Optional[str]:
        """
        Extract the actual text value from a node.
        
        Handles both:
        - Nodes with direct values
        - Nodes with terminal children containing values
        """
        # If node has a direct value, use it
        if node.value is not None:
            return str(node.value)
        
        # If node has children, look for terminals
        if node.children:
            # Check if all children are terminals
            terminal_values = []
            for child in node.children:
                if child.type == 'terminal' and child.value is not None:
                    terminal_values.append(str(child.value))
                elif child.value is not None:
                    terminal_values.append(str(child.value))
            
            if terminal_values:
                return ''.join(terminal_values)
        
        return None
    
    def _render_template(self, template: str, context: Dict[str, Any]) -> str:
        """
        Render template with context.
        
        Simple template rendering supporting:
        - {{variable}} - substitution
        - {{#if condition}}...{{/if}} - conditionals
        - {{#each items}}...{{/each}} - loops
        
        Args:
            template: Template string
            context: Context data
            
        Returns:
            Rendered string
        """
        result = template
        
        # Process loops
        result = self._process_loops(result, context)
        
        # Process conditionals
        result = self._process_conditionals(result, context)
        
        # Process variables
        result = self._process_variables(result, context)
        
        return result
    
    def _process_variables(self, template: str, context: Dict[str, Any]) -> str:
        """Process variable substitutions."""
        def replace_var(match):
            var_expr = match.group(1).strip()
            
            # Handle filters
            if '|' in var_expr:
                parts = var_expr.split('|')
                var_name = parts[0].strip()
                filter_name = parts[1].strip()
                
                value = self._get_value(var_name, context)
                return self._apply_filter(value, filter_name)
            else:
                value = self._get_value(var_expr, context)
                return str(value) if value is not None else ''
        
        pattern = r'\{\{([^#/}][^}]*)\}\}'
        return re.sub(pattern, replace_var, template)
    
    def _process_conditionals(self, template: str, context: Dict[str, Any]) -> str:
        """Process conditional blocks."""
        pattern = r'\{\{#if\s+([^}]+)\}\}(.*?)\{\{/if\}\}'
        
        def replace_conditional(match):
            condition = match.group(1).strip()
            content = match.group(2)
            
            # Check for else
            parts = re.split(r'\{\{else\}\}', content)
            if_content = parts[0]
            else_content = parts[1] if len(parts) > 1 else ''
            
            # Evaluate condition
            if self._evaluate_condition(condition, context):
                return if_content
            else:
                return else_content
        
        while re.search(pattern, template, flags=re.DOTALL):
            template = re.sub(pattern, replace_conditional, template, flags=re.DOTALL)
        
        return template
    
    def _process_loops(self, template: str, context: Dict[str, Any]) -> str:
        """Process loop blocks."""
        pattern = r'\{\{#each\s+([^}]+)\}\}(.*?)\{\{/each\}\}'
        
        def replace_loop(match):
            items_name = match.group(1).strip()
            loop_body = match.group(2)
            
            # Get items
            items = self._get_value(items_name, context)
            if not items:
                return ''
            
            if not isinstance(items, list):
                items = [items]
            
            # Render for each item
            results = []
            for i, item in enumerate(items):
                loop_context = context.copy()
                loop_context['@item'] = item
                loop_context['@index'] = i
                loop_context['@first'] = (i == 0)
                loop_context['@last'] = (i == len(items) - 1)
                
                # Merge item into context if it's a dict
                if isinstance(item, dict):
                    loop_context.update(item)
                
                result = self._render_template(loop_body, loop_context)
                results.append(result)
            
            return ''.join(results)
        
        while re.search(pattern, template, flags=re.DOTALL):
            template = re.sub(pattern, replace_loop, template, flags=re.DOTALL)
        
        return template
    
    def _get_value(self, path: str, context: Dict[str, Any]) -> Any:
        """Get value from context using dot notation."""
        parts = path.split('.')
        value = context
        
        for part in parts:
            if isinstance(value, dict):
                value = value.get(part)
            elif hasattr(value, part):
                value = getattr(value, part)
            else:
                return None
            
            if value is None:
                return None
        
        return value
    
    def _evaluate_condition(self, condition: str, context: Dict[str, Any]) -> bool:
        """Evaluate condition expression."""
        condition = condition.strip()
        
        # Handle negation
        if condition.startswith('!'):
            return not self._evaluate_condition(condition[1:], context)
        
        # Handle comparison
        for op in ['==', '!=', '>', '<', '>=', '<=']:
            if op in condition:
                parts = condition.split(op, 1)
                left = self._get_value(parts[0].strip(), context)
                right = parts[1].strip().strip('"').strip("'")
                
                if op == '==':
                    return str(left) == right
                elif op == '!=':
                    return str(left) != right
                elif op == '>':
                    try:
                        return float(left) > float(right)
                    except (ValueError, TypeError):
                        return str(left) > right
                elif op == '<':
                    try:
                        return float(left) < float(right)
                    except (ValueError, TypeError):
                        return str(left) < right
                elif op == '>=':
                    try:
                        return float(left) >= float(right)
                    except (ValueError, TypeError):
                        return str(left) >= right
                elif op == '<=':
                    try:
                        return float(left) <= float(right)
                    except (ValueError, TypeError):
                        return str(left) <= right
        
        # Truthiness
        value = self._get_value(condition, context)
        return bool(value)
    
    def _apply_filter(self, value: Any, filter_name: str) -> str:
        """Apply filter to value."""
        # Built-in filters
        filters = {
            'upper': lambda x: str(x).upper(),
            'lower': lambda x: str(x).lower(),
            'trim': lambda x: str(x).strip(),
            'json_escape': lambda x: self._json_escape(str(x)),
            'sql_escape': lambda x: str(x).replace("'", "''"),
            'quote': lambda x: f'"{x}"',
            'comma_list': lambda x: ', '.join(str(i) for i in x) if isinstance(x, list) else str(x),
        }
        
        if filter_name in filters:
            return filters[filter_name](value)
        
        return str(value)
    
    def _json_escape(self, text: str) -> str:
        """Escape text for JSON strings."""
        text = text.replace('\\', '\\\\')
        text = text.replace('"', '\\"')
        text = text.replace('\n', '\\n')
        text = text.replace('\r', '\\r')
        text = text.replace('\t', '\\t')
        return text


__all__ = ['GrammarUnparser']

