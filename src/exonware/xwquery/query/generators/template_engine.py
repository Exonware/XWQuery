#!/usr/bin/env python3
"""
Template Engine for xwquery

Provides template-based query generation with parameter substitution,
conditionals, loops, and nested templates.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 29-Oct-2025
"""

import os
import re
from typing import Any, Dict, List, Optional, Union, Callable
from pathlib import Path


class TemplateEngine:
    """
    Powerful template engine for query generation.
    
    Features:
    - Parameter substitution: {{variable}}
    - Conditionals: {{#if condition}}...{{/if}}
    - Loops: {{#each items}}...{{/each}}
    - Nested templates: {{>template_name}}
    - Filters: {{variable|filter}}
    - Comments: {{! comment}}
    """
    
    # Template syntax patterns
    PARAM_PATTERN = r'\{\{([^#/>!][^}]*)\}\}'
    CONDITIONAL_PATTERN = r'\{\{#if\s+([^}]+)\}\}(.*?)\{\{/if\}\}'
    ELSE_PATTERN = r'\{\{else\}\}'
    LOOP_PATTERN = r'\{\{#each\s+([^}]+)\}\}(.*?)\{\{/each\}\}'
    PARTIAL_PATTERN = r'\{\{>([^}]+)\}\}'
    COMMENT_PATTERN = r'\{\{!.*?\}\}'
    
    def __init__(self, template_dir: Optional[str] = None):
        """
        Initialize template engine.
        
        Args:
            template_dir: Directory containing template files
        """
        self.template_dir = template_dir
        self._template_cache: Dict[str, str] = {}
        self._filters: Dict[str, Callable] = self._initialize_filters()
    
    def render(self, template: str, context: Dict[str, Any]) -> str:
        """
        Render template with context data.
        
        Args:
            template: Template string
            context: Context data for substitution
            
        Returns:
            Rendered output
        """
        # Remove comments
        output = self._remove_comments(template)
        
        # Process loops
        output = self._process_loops(output, context)
        
        # Process conditionals
        output = self._process_conditionals(output, context)
        
        # Process partials
        output = self._process_partials(output, context)
        
        # Process parameters
        output = self._process_parameters(output, context)
        
        return output
    
    def render_file(self, template_name: str, context: Dict[str, Any]) -> str:
        """
        Render template from file.
        
        Args:
            template_name: Template file name
            context: Context data
            
        Returns:
            Rendered output
        """
        template = self.load_template(template_name)
        return self.render(template, context)
    
    def load_template(self, template_name: str) -> str:
        """
        Load template from file.
        
        Args:
            template_name: Template file name
            
        Returns:
            Template content
        """
        # Check cache
        if template_name in self._template_cache:
            return self._template_cache[template_name]
        
        # Load from file
        if not self.template_dir:
            raise ValueError("Template directory not set")
        
        template_path = Path(self.template_dir) / template_name
        if not template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_name}")
        
        with open(template_path, 'r', encoding='utf-8') as f:
            template = f.read()
        
        # Cache it
        self._template_cache[template_name] = template
        
        return template
    
    def _remove_comments(self, template: str) -> str:
        """Remove template comments."""
        return re.sub(self.COMMENT_PATTERN, '', template, flags=re.DOTALL)
    
    def _process_parameters(self, template: str, context: Dict[str, Any]) -> str:
        """Process parameter substitutions."""
        def replace_param(match):
            param_expr = match.group(1).strip()
            
            # Check for filters
            if '|' in param_expr:
                parts = param_expr.split('|')
                param_name = parts[0].strip()
                filters = [f.strip() for f in parts[1:]]
                
                # Get value
                value = self._get_value(param_name, context)
                
                # Apply filters
                for filter_name in filters:
                    if filter_name in self._filters:
                        value = self._filters[filter_name](value)
                
                return str(value) if value is not None else ''
            else:
                # Simple substitution
                value = self._get_value(param_expr, context)
                return str(value) if value is not None else ''
        
        return re.sub(self.PARAM_PATTERN, replace_param, template)
    
    def _process_conditionals(self, template: str, context: Dict[str, Any]) -> str:
        """Process conditional blocks."""
        def replace_conditional(match):
            condition = match.group(1).strip()
            content = match.group(2)
            
            # Split on else
            parts = re.split(self.ELSE_PATTERN, content)
            if_content = parts[0]
            else_content = parts[1] if len(parts) > 1 else ''
            
            # Evaluate condition
            if self._evaluate_condition(condition, context):
                return if_content
            else:
                return else_content
        
        # Keep processing until no more conditionals
        while re.search(self.CONDITIONAL_PATTERN, template, flags=re.DOTALL):
            template = re.sub(self.CONDITIONAL_PATTERN, replace_conditional, template, flags=re.DOTALL)
        
        return template
    
    def _process_loops(self, template: str, context: Dict[str, Any]) -> str:
        """Process loop blocks."""
        def replace_loop(match):
            items_expr = match.group(1).strip()
            loop_template = match.group(2)
            
            # Get items
            items = self._get_value(items_expr, context)
            if not items:
                return ''
            
            if not isinstance(items, (list, tuple)):
                items = [items]
            
            # Render for each item
            results = []
            for index, item in enumerate(items):
                # Create loop context
                loop_context = context.copy()
                loop_context['@item'] = item
                loop_context['@index'] = index
                loop_context['@first'] = (index == 0)
                loop_context['@last'] = (index == len(items) - 1)
                
                # Support dot notation for item properties
                if isinstance(item, dict):
                    loop_context.update(item)
                
                # Render loop body
                result = self.render(loop_template, loop_context)
                results.append(result)
            
            return ''.join(results)
        
        # Keep processing until no more loops
        while re.search(self.LOOP_PATTERN, template, flags=re.DOTALL):
            template = re.sub(self.LOOP_PATTERN, replace_loop, template, flags=re.DOTALL)
        
        return template
    
    def _process_partials(self, template: str, context: Dict[str, Any]) -> str:
        """Process partial includes."""
        def replace_partial(match):
            partial_name = match.group(1).strip()
            
            try:
                partial_template = self.load_template(partial_name)
                return self.render(partial_template, context)
            except (FileNotFoundError, ValueError):
                return f"{{! Partial not found: {partial_name} !}}"
        
        return re.sub(self.PARTIAL_PATTERN, replace_partial, template)
    
    def _get_value(self, path: str, context: Dict[str, Any]) -> Any:
        """
        Get value from context using dot notation.
        
        Args:
            path: Dot-notation path (e.g., 'user.name')
            context: Context dictionary
            
        Returns:
            Value at path or None
        """
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
        """
        Evaluate condition expression.
        
        Supports:
        - Simple variables: {{#if user}}
        - Negation: {{#if !user}}
        - Equality: {{#if status == 'active'}}
        - Inequality: {{#if count != 0}}
        - Comparison: {{#if age > 18}}
        
        Args:
            condition: Condition expression
            context: Context dictionary
            
        Returns:
            Boolean result
        """
        condition = condition.strip()
        
        # Handle negation
        if condition.startswith('!'):
            return not self._evaluate_condition(condition[1:], context)
        
        # Handle comparison operators
        for op in ['==', '!=', '<=', '>=', '<', '>']:
            if op in condition:
                parts = condition.split(op, 1)
                left = self._get_value(parts[0].strip(), context)
                right = parts[1].strip().strip('"').strip("'")
                
                # Try to convert right to number if left is number
                if isinstance(left, (int, float)):
                    try:
                        right = float(right)
                    except ValueError:
                        pass
                
                if op == '==':
                    return left == right
                elif op == '!=':
                    return left != right
                elif op == '<':
                    return left < right
                elif op == '>':
                    return left > right
                elif op == '<=':
                    return left <= right
                elif op == '>=':
                    return left >= right
        
        # Simple truthiness check
        value = self._get_value(condition, context)
        return bool(value)
    
    def _initialize_filters(self) -> Dict[str, Callable]:
        """Initialize built-in filters."""
        return {
            'upper': lambda x: str(x).upper(),
            'lower': lambda x: str(x).lower(),
            'title': lambda x: str(x).title(),
            'capitalize': lambda x: str(x).capitalize(),
            'trim': lambda x: str(x).strip(),
            'length': lambda x: len(x) if hasattr(x, '__len__') else 0,
            'default': lambda x, default='': x if x else default,
            'escape': lambda x: str(x).replace("'", "''"),
            'quote': lambda x: f"'{x}'",
            'join': lambda x, sep=', ': sep.join(str(i) for i in x) if hasattr(x, '__iter__') else str(x),
        }
    
    def add_filter(self, name: str, func: Callable):
        """
        Add custom filter.
        
        Args:
            name: Filter name
            func: Filter function
        """
        self._filters[name] = func
    
    def clear_cache(self):
        """Clear template cache."""
        self._template_cache.clear()


class QueryTemplateEngine(TemplateEngine):
    """
    Specialized template engine for query generation.
    
    Adds query-specific features and filters.
    """
    
    def __init__(self, template_dir: Optional[str] = None):
        super().__init__(template_dir)
        self._add_query_filters()
    
    def _add_query_filters(self):
        """Add query-specific filters."""
        self.add_filter('sql_escape', lambda x: str(x).replace("'", "''"))
        self.add_filter('sql_quote', lambda x: f"'{x}'")
        self.add_filter('identifier', lambda x: f'"{x}"')
        self.add_filter('comma_list', lambda x: ', '.join(str(i) for i in x) if hasattr(x, '__iter__') else str(x))
        self.add_filter('and_list', lambda x: ' AND '.join(str(i) for i in x) if hasattr(x, '__iter__') else str(x))
        self.add_filter('or_list', lambda x: ' OR '.join(str(i) for i in x) if hasattr(x, '__iter__') else str(x))
    
    def render_query(self, format_name: str, operation: str, context: Dict[str, Any]) -> str:
        """
        Render query for specific format and operation.
        
        Args:
            format_name: Query format (e.g., 'sql', 'cypher')
            operation: Operation type (e.g., 'select', 'match')
            context: Query context data
            
        Returns:
            Rendered query string
        """
        template_name = f"{format_name}/{operation}.template"
        return self.render_file(template_name, context)


# Convenience functions
def render_template(template: str, context: Dict[str, Any]) -> str:
    """Render template with context."""
    engine = TemplateEngine()
    return engine.render(template, context)


def render_query_template(template_dir: str, format_name: str, operation: str, context: Dict[str, Any]) -> str:
    """Render query template."""
    engine = QueryTemplateEngine(template_dir)
    return engine.render_query(format_name, operation, context)


__all__ = [
    'TemplateEngine',
    'QueryTemplateEngine',
    'render_template',
    'render_query_template'
]

