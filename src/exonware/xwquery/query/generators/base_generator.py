#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/base_generator.py

Abstract base generator for query text generation.
Provides common formatting, pretty-printing, and escaping.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union, Set, Tuple
import time

from ...contracts import QueryAction
from ...errors import XWQueryValueError
from ...defs import ConversionMode


class ABaseGenerator(ABC):
    """
    Abstract base class for all query format generators.
    
    Provides:
    - Pretty-printing with indentation
    - Format-specific escaping and quoting
    - Conversion mode handling
    - Performance monitoring
    - Common formatting utilities
    
    All 31 format generators extend this class.
    """
    
    # ==================== Class Constants ====================
    
    # Formatting options
    DEFAULT_INDENT = "  "  # 2 spaces
    DEFAULT_LINE_WIDTH = 80
    
    def __init__(
        self,
        conversion_mode: ConversionMode = ConversionMode.FLEXIBLE,
        indent: str = DEFAULT_INDENT,
        line_width: int = DEFAULT_LINE_WIDTH,
        pretty_print: bool = True
    ):
        """
        Initialize generator.
        
        Args:
            conversion_mode: Conversion mode for format incompatibilities
            indent: Indentation string
            line_width: Maximum line width for formatting
            pretty_print: Enable pretty-printing
        """
        self.conversion_mode = conversion_mode
        self.indent = indent
        self.line_width = line_width
        self.pretty_print = pretty_print
        
        self._generate_count = 0
        self._total_generate_time = 0.0
        self._error_count = 0
    
    # ==================== Abstract Methods (Implement in Subclasses) ====================
    
    @abstractmethod
    def generate(self, actions: List[QueryAction], **options) -> str:
        """
        Generate query string from QueryAction tree.
        
        This is the main generation method that subclasses must implement.
        Can use _dispatch_operation() to delegate to specific operation methods.
        
        Args:
            actions: List of QueryAction objects
            **options: Format-specific options
            
        Returns:
            Query string in specific format
            
        Raises:
            XWQueryValueError: On generation errors
        """
        pass
    
    @abstractmethod
    def get_format_name(self) -> str:
        """Return format name (e.g., 'SQL', 'XPath')."""
        pass
    
    # ==================== Input Validation ====================
    
    def validate_actions(self, actions: List[QueryAction]) -> None:
        """
        Validate QueryAction list.
        
        Args:
            actions: List of QueryAction objects
            
        Raises:
            XWQueryValueError: If actions are invalid
        """
        # Check None
        if actions is None:
            raise XWQueryValueError(
                "Actions cannot be None. "
                f"Expected: List of QueryAction objects for {self.get_format_name()} generation."
            )
        
        # Check type
        if not isinstance(actions, list):
            raise XWQueryValueError(
                f"Actions must be list, got {type(actions).__name__}. "
                f"Expected: List of QueryAction objects."
            )
        
        # Check empty
        if not actions:
            raise XWQueryValueError(
                "Actions list cannot be empty. "
                f"Expected: At least one QueryAction for {self.get_format_name()} generation."
            )
        
        # Check action types
        for i, action in enumerate(actions):
            if not isinstance(action, QueryAction):
                raise XWQueryValueError(
                    f"Action {i} is not QueryAction, got {type(action).__name__}. "
                    f"All items must be QueryAction objects."
                )
    
    # ==================== Conversion Mode Handling ====================
    
    def set_conversion_mode(self, mode: ConversionMode) -> None:
        """Set conversion mode for format incompatibilities."""
        self.conversion_mode = mode
    
    def handle_incompatible_action(
        self,
        action: QueryAction,
        error_message: Optional[str] = None
    ) -> str:
        """
        Handle incompatible actions based on conversion mode.
        
        Args:
            action: Incompatible action
            error_message: Optional custom error message
            
        Returns:
            Alternative representation or empty string
            
        Raises:
            XWQueryValueError: In strict mode
        """
        msg = error_message or f"Action '{action.operation}' not supported in {self.get_format_name()}"
        
        if self.conversion_mode == ConversionMode.STRICT:
            raise XWQueryValueError(
                f"STRICT MODE: {msg}. "
                f"Cannot generate {self.get_format_name()} query with incompatible action."
            )
        elif self.conversion_mode == ConversionMode.FLEXIBLE:
            # Try to find alternatives (subclass implements)
            return self._find_alternative(action)
        elif self.conversion_mode == ConversionMode.LENIENT:
            # Skip with comment (subclass implements)
            return self._skip_with_comment(action)
        
        return ""
    
    def _find_alternative(self, action: QueryAction) -> str:
        """
        Find alternative representation for incompatible action.
        
        Override in subclass for format-specific alternatives.
        
        Args:
            action: Incompatible action
            
        Returns:
            Alternative query text
        """
        # Default: return comment
        return f"/* Alternative needed for {action.operation} */"
    
    def _skip_with_comment(self, action: QueryAction) -> str:
        """
        Skip action with explanatory comment.
        
        Args:
            action: Skipped action
            
        Returns:
            Comment explaining skip
        """
        return f"/* Skipped: {action.operation} not supported in {self.get_format_name()} */"
    
    # ==================== Performance Monitoring ====================
    
    def _monitor_generate_start(self) -> float:
        """Start generation performance monitoring."""
        return time.time()
    
    def _monitor_generate_end(self, start_time: float) -> None:
        """End generation performance monitoring."""
        elapsed = time.time() - start_time
        self._generate_count += 1
        self._total_generate_time += elapsed
    
    def _monitor_generate_error(self) -> None:
        """Record generation error."""
        self._error_count += 1
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """
        Get generator performance statistics.
        
        Returns:
            Dictionary with performance metrics
        """
        avg_time = self._total_generate_time / self._generate_count if self._generate_count > 0 else 0
        
        return {
            'format': self.get_format_name(),
            'generate_count': self._generate_count,
            'total_time': self._total_generate_time,
            'average_time': avg_time,
            'error_count': self._error_count,
            'error_rate': self._error_count / self._generate_count if self._generate_count > 0 else 0
        }
    
    # ==================== Formatting Utilities ====================
    
    def add_indent(self, text: str, level: int = 1) -> str:
        """
        Add indentation to text.
        
        Args:
            text: Text to indent
            level: Indentation level
            
        Returns:
            Indented text
        """
        if not self.pretty_print:
            return text
        
        indent_str = self.indent * level
        lines = text.split('\n')
        return '\n'.join(indent_str + line if line.strip() else '' for line in lines)
    
    def wrap_line(self, text: str, prefix: str = "") -> str:
        """
        Wrap long line to fit line width.
        
        Args:
            text: Text to wrap
            prefix: Prefix for continuation lines
            
        Returns:
            Wrapped text
        """
        if not self.pretty_print or len(text) <= self.line_width:
            return text
        
        # Simple word wrapping
        words = text.split()
        lines = []
        current_line = prefix if lines else ""
        
        for word in words:
            if len(current_line) + len(word) + 1 <= self.line_width:
                current_line += (" " if current_line else "") + word
            else:
                if current_line:
                    lines.append(current_line)
                current_line = prefix + word
        
        if current_line:
            lines.append(current_line)
        
        return '\n'.join(lines)
    
    def format_list(
        self,
        items: List[str],
        separator: str = ", ",
        multiline: bool = False,
        indent_level: int = 0
    ) -> str:
        """
        Format list of items.
        
        Args:
            items: List of items
            separator: Separator between items
            multiline: Use multiline format
            indent_level: Indentation level for multiline
            
        Returns:
            Formatted list
        """
        if not items:
            return ""
        
        if not self.pretty_print or not multiline:
            return separator.join(items)
        
        # Multiline format
        indent_str = self.indent * indent_level
        formatted_items = [f"{indent_str}{item}" for item in items]
        return ',\n'.join(formatted_items)
    
    def add_newline(self, text: str, count: int = 1) -> str:
        """
        Add newlines to text.
        
        Args:
            text: Text
            count: Number of newlines
            
        Returns:
            Text with newlines
        """
        if not self.pretty_print:
            return text
        
        return text + ('\n' * count)
    
    def add_comment(self, comment: str, style: str = "line") -> str:
        """
        Add comment in format-specific style.
        
        Override in subclass for format-specific comment syntax.
        
        Args:
            comment: Comment text
            style: Comment style ('line' or 'block')
            
        Returns:
            Formatted comment
        """
        if style == "line":
            return f"-- {comment}"
        else:
            return f"/* {comment} */"
    
    # ==================== Operation Dispatch System ====================
    
    def _dispatch_operation(self, action: QueryAction, **options) -> str:
        """
        Dispatch action to appropriate generation method.
        
        This method maps operations to their corresponding _generate_* methods.
        Subclasses can override specific methods or add new operations.
        
        Args:
            action: QueryAction to generate
            **options: Format-specific options
            
        Returns:
            Generated query text for the operation
        """
        operation = action.type.upper()
        method_name = f"_generate_{operation.lower()}"
        
        # Check if method exists
        if hasattr(self, method_name):
            method = getattr(self, method_name)
            return method(action, **options)
        
        # Fallback: handle incompatible operation
        return self.handle_incompatible_action(action)
    
    # ==================== Operation Generation Methods (All 56 Operations) ====================
    
    # Core operations (1-6)
    def _generate_select(self, action: QueryAction, **options) -> str:
        """Generate SELECT operation."""
        return self.handle_incompatible_action(action, "SELECT operation not implemented")
    
    def _generate_insert(self, action: QueryAction, **options) -> str:
        """Generate INSERT operation."""
        return self.handle_incompatible_action(action, "INSERT operation not implemented")
    
    def _generate_update(self, action: QueryAction, **options) -> str:
        """Generate UPDATE operation."""
        return self.handle_incompatible_action(action, "UPDATE operation not implemented")
    
    def _generate_delete(self, action: QueryAction, **options) -> str:
        """Generate DELETE operation."""
        return self.handle_incompatible_action(action, "DELETE operation not implemented")
    
    def _generate_create(self, action: QueryAction, **options) -> str:
        """Generate CREATE operation."""
        return self.handle_incompatible_action(action, "CREATE operation not implemented")
    
    def _generate_drop(self, action: QueryAction, **options) -> str:
        """Generate DROP operation."""
        return self.handle_incompatible_action(action, "DROP operation not implemented")
    
    # Filtering operations (7-16)
    def _generate_where(self, action: QueryAction, **options) -> str:
        """Generate WHERE operation."""
        return self.handle_incompatible_action(action, "WHERE operation not implemented")
    
    def _generate_filter(self, action: QueryAction, **options) -> str:
        """Generate FILTER operation."""
        return self.handle_incompatible_action(action, "FILTER operation not implemented")
    
    def _generate_like(self, action: QueryAction, **options) -> str:
        """Generate LIKE operation."""
        return self.handle_incompatible_action(action, "LIKE operation not implemented")
    
    def _generate_in(self, action: QueryAction, **options) -> str:
        """Generate IN operation."""
        return self.handle_incompatible_action(action, "IN operation not implemented")
    
    def _generate_has(self, action: QueryAction, **options) -> str:
        """Generate HAS operation."""
        return self.handle_incompatible_action(action, "HAS operation not implemented")
    
    def _generate_between(self, action: QueryAction, **options) -> str:
        """Generate BETWEEN operation."""
        return self.handle_incompatible_action(action, "BETWEEN operation not implemented")
    
    def _generate_range(self, action: QueryAction, **options) -> str:
        """Generate RANGE operation."""
        return self.handle_incompatible_action(action, "RANGE operation not implemented")
    
    def _generate_term(self, action: QueryAction, **options) -> str:
        """Generate TERM operation."""
        return self.handle_incompatible_action(action, "TERM operation not implemented")
    
    def _generate_optional(self, action: QueryAction, **options) -> str:
        """Generate OPTIONAL operation."""
        return self.handle_incompatible_action(action, "OPTIONAL operation not implemented")
    
    def _generate_values(self, action: QueryAction, **options) -> str:
        """Generate VALUES operation."""
        return self.handle_incompatible_action(action, "VALUES operation not implemented")
    
    # Aggregation operations (17-25)
    def _generate_count(self, action: QueryAction, **options) -> str:
        """Generate COUNT operation."""
        return self.handle_incompatible_action(action, "COUNT operation not implemented")
    
    def _generate_sum(self, action: QueryAction, **options) -> str:
        """Generate SUM operation."""
        return self.handle_incompatible_action(action, "SUM operation not implemented")
    
    def _generate_avg(self, action: QueryAction, **options) -> str:
        """Generate AVG operation."""
        return self.handle_incompatible_action(action, "AVG operation not implemented")
    
    def _generate_min(self, action: QueryAction, **options) -> str:
        """Generate MIN operation."""
        return self.handle_incompatible_action(action, "MIN operation not implemented")
    
    def _generate_max(self, action: QueryAction, **options) -> str:
        """Generate MAX operation."""
        return self.handle_incompatible_action(action, "MAX operation not implemented")
    
    def _generate_distinct(self, action: QueryAction, **options) -> str:
        """Generate DISTINCT operation."""
        return self.handle_incompatible_action(action, "DISTINCT operation not implemented")
    
    def _generate_group(self, action: QueryAction, **options) -> str:
        """Generate GROUP operation."""
        return self.handle_incompatible_action(action, "GROUP operation not implemented")
    
    def _generate_having(self, action: QueryAction, **options) -> str:
        """Generate HAVING operation."""
        return self.handle_incompatible_action(action, "HAVING operation not implemented")
    
    def _generate_summarize(self, action: QueryAction, **options) -> str:
        """Generate SUMMARIZE operation."""
        return self.handle_incompatible_action(action, "SUMMARIZE operation not implemented")
    
    # Projection operations (26-27)
    def _generate_project(self, action: QueryAction, **options) -> str:
        """Generate PROJECT operation."""
        return self.handle_incompatible_action(action, "PROJECT operation not implemented")
    
    def _generate_extend(self, action: QueryAction, **options) -> str:
        """Generate EXTEND operation."""
        return self.handle_incompatible_action(action, "EXTEND operation not implemented")
    
    # Ordering operations (28-31)
    def _generate_order(self, action: QueryAction, **options) -> str:
        """Generate ORDER operation."""
        return self.handle_incompatible_action(action, "ORDER operation not implemented")
    
    def _generate_by(self, action: QueryAction, **options) -> str:
        """Generate BY operation."""
        return self.handle_incompatible_action(action, "BY operation not implemented")
    
    def _generate_limit(self, action: QueryAction, **options) -> str:
        """Generate LIMIT operation."""
        return self.handle_incompatible_action(action, "LIMIT operation not implemented")
    
    def _generate_offset(self, action: QueryAction, **options) -> str:
        """Generate OFFSET operation."""
        return self.handle_incompatible_action(action, "OFFSET operation not implemented")
    
    # Graph operations (30-34)
    def _generate_match(self, action: QueryAction, **options) -> str:
        """Generate MATCH operation."""
        return self.handle_incompatible_action(action, "MATCH operation not implemented")
    
    def _generate_path(self, action: QueryAction, **options) -> str:
        """Generate PATH operation."""
        return self.handle_incompatible_action(action, "PATH operation not implemented")
    
    def _generate_out(self, action: QueryAction, **options) -> str:
        """Generate OUT operation."""
        return self.handle_incompatible_action(action, "OUT operation not implemented")
    
    def _generate_in_traverse(self, action: QueryAction, **options) -> str:
        """Generate IN_TRAVERSE operation."""
        return self.handle_incompatible_action(action, "IN_TRAVERSE operation not implemented")
    
    def _generate_return(self, action: QueryAction, **options) -> str:
        """Generate RETURN operation."""
        return self.handle_incompatible_action(action, "RETURN operation not implemented")
    
    # Data operations (35-38)
    def _generate_load(self, action: QueryAction, **options) -> str:
        """Generate LOAD operation."""
        return self.handle_incompatible_action(action, "LOAD operation not implemented")
    
    def _generate_store(self, action: QueryAction, **options) -> str:
        """Generate STORE operation."""
        return self.handle_incompatible_action(action, "STORE operation not implemented")
    
    def _generate_merge(self, action: QueryAction, **options) -> str:
        """Generate MERGE operation."""
        return self.handle_incompatible_action(action, "MERGE operation not implemented")
    
    def _generate_alter(self, action: QueryAction, **options) -> str:
        """Generate ALTER operation."""
        return self.handle_incompatible_action(action, "ALTER operation not implemented")
    
    # Array operations (39-40)
    def _generate_slicing(self, action: QueryAction, **options) -> str:
        """Generate SLICING operation."""
        return self.handle_incompatible_action(action, "SLICING operation not implemented")
    
    def _generate_indexing(self, action: QueryAction, **options) -> str:
        """Generate INDEXING operation."""
        return self.handle_incompatible_action(action, "INDEXING operation not implemented")
    
    # Advanced operations (41-56)
    def _generate_join(self, action: QueryAction, **options) -> str:
        """Generate JOIN operation."""
        return self.handle_incompatible_action(action, "JOIN operation not implemented")
    
    def _generate_union(self, action: QueryAction, **options) -> str:
        """Generate UNION operation."""
        return self.handle_incompatible_action(action, "UNION operation not implemented")
    
    def _generate_with(self, action: QueryAction, **options) -> str:
        """Generate WITH operation."""
        return self.handle_incompatible_action(action, "WITH operation not implemented")
    
    def _generate_aggregate(self, action: QueryAction, **options) -> str:
        """Generate AGGREGATE operation."""
        return self.handle_incompatible_action(action, "AGGREGATE operation not implemented")
    
    def _generate_foreach(self, action: QueryAction, **options) -> str:
        """Generate FOREACH operation."""
        return self.handle_incompatible_action(action, "FOREACH operation not implemented")
    
    def _generate_let(self, action: QueryAction, **options) -> str:
        """Generate LET operation."""
        return self.handle_incompatible_action(action, "LET operation not implemented")
    
    def _generate_for(self, action: QueryAction, **options) -> str:
        """Generate FOR operation."""
        return self.handle_incompatible_action(action, "FOR operation not implemented")
    
    def _generate_window(self, action: QueryAction, **options) -> str:
        """Generate WINDOW operation."""
        return self.handle_incompatible_action(action, "WINDOW operation not implemented")
    
    def _generate_describe(self, action: QueryAction, **options) -> str:
        """Generate DESCRIBE operation."""
        return self.handle_incompatible_action(action, "DESCRIBE operation not implemented")
    
    def _generate_construct(self, action: QueryAction, **options) -> str:
        """Generate CONSTRUCT operation."""
        return self.handle_incompatible_action(action, "CONSTRUCT operation not implemented")
    
    def _generate_ask(self, action: QueryAction, **options) -> str:
        """Generate ASK operation."""
        return self.handle_incompatible_action(action, "ASK operation not implemented")
    
    def _generate_subscribe(self, action: QueryAction, **options) -> str:
        """Generate SUBSCRIBE operation."""
        return self.handle_incompatible_action(action, "SUBSCRIBE operation not implemented")
    
    def _generate_subscription(self, action: QueryAction, **options) -> str:
        """Generate SUBSCRIPTION operation."""
        return self.handle_incompatible_action(action, "SUBSCRIPTION operation not implemented")
    
    def _generate_mutation(self, action: QueryAction, **options) -> str:
        """Generate MUTATION operation."""
        return self.handle_incompatible_action(action, "MUTATION operation not implemented")
    
    def _generate_pipe(self, action: QueryAction, **options) -> str:
        """Generate PIPE operation."""
        return self.handle_incompatible_action(action, "PIPE operation not implemented")
    
    def _generate_options(self, action: QueryAction, **options) -> str:
        """Generate OPTIONS operation."""
        return self.handle_incompatible_action(action, "OPTIONS operation not implemented")
    
    # ==================== Validation with Monitoring ====================
    
    def generate_with_validation(self, actions: List[QueryAction], **options) -> str:
        """
        Generate query with full validation and monitoring.
        
        This is the recommended public method to use.
        Delegates to subclass generate() method after validation.
        
        Args:
            actions: List of QueryAction objects
            **options: Format-specific options
            
        Returns:
            Query string
            
        Raises:
            XWQueryValueError: On generation errors
        """
        start_time = self._monitor_generate_start()
        
        try:
            # Validate actions
            self.validate_actions(actions)
            
            # Generate (delegated to subclass)
            query = self.generate(actions, **options)
            
            # Update metrics
            self._monitor_generate_end(start_time)
            
            return query
            
        except XWQueryValueError:
            self._monitor_generate_error()
            raise
        except Exception as e:
            self._monitor_generate_error()
            raise XWQueryValueError(
                f"Unexpected error generating {self.get_format_name()} query: {str(e)}"
            ) from e


# ==================== Concrete Base Classes for Specific Format Types ====================

class AStructuredQueryGenerator(ABaseGenerator):
    """Base generator for structured query languages (SQL, N1QL, etc.)."""
    
    def format_identifier(self, name: str) -> str:
        """
        Format identifier (table/column name).
        
        Override in subclass for format-specific quoting.
        
        Args:
            name: Identifier name
            
        Returns:
            Formatted identifier
        """
        # Default: no quoting (override in subclass)
        return name
    
    def format_string_literal(self, value: str) -> str:
        """
        Format string literal.
        
        Args:
            value: String value
            
        Returns:
            Formatted string literal
        """
        # Escape single quotes
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    
    def format_number_literal(self, value: Union[int, float]) -> str:
        """
        Format number literal.
        
        Args:
            value: Number value
            
        Returns:
            Formatted number
        """
        return str(value)
    
    def format_boolean_literal(self, value: bool) -> str:
        """
        Format boolean literal.
        
        Args:
            value: Boolean value
            
        Returns:
            Formatted boolean
        """
        return "TRUE" if value else "FALSE"


class APathQueryGenerator(ABaseGenerator):
    """Base generator for path-based query languages (XPath, JMESPath, etc.)."""
    
    def format_path(self, path_parts: List[str]) -> str:
        """
        Format path expression.
        
        Args:
            path_parts: List of path parts
            
        Returns:
            Formatted path
        """
        # Implement in subclass
        raise NotImplementedError("Subclass must implement format_path")


class AGraphQueryGenerator(ABaseGenerator):
    """Base generator for graph query languages (Cypher, Gremlin, etc.)."""
    
    def format_node_pattern(self, pattern: Dict[str, Any]) -> str:
        """
        Format graph node pattern.
        
        Args:
            pattern: Node pattern structure
            
        Returns:
            Formatted node pattern
        """
        # Implement in subclass
        raise NotImplementedError("Subclass must implement format_node_pattern")


__all__ = [
    'ABaseGenerator',
    'AStructuredQueryGenerator',
    'APathQueryGenerator',
    'AGraphQueryGenerator'
]

