#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/base_generator.py

Abstract base generator for query text generation.
Provides common formatting, pretty-printing, and escaping.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union, Set, Tuple
import time

from ..contracts import QueryAction
from ..errors import XWQueryValueError
from ..defs import ConversionMode


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

