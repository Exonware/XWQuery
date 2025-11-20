#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/base_parser.py

Abstract base parser for query format parsing.
Provides common tokenization, validation, and security.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, Tuple
import re
import time

from ..contracts import QueryAction
from ..errors import XWQueryParseError, XWQuerySecurityError, XWQueryValueError
from ..defs import ConversionMode
from .query_action_builder import QueryActionBuilder


class ABaseParser(ABC):
    """
    Abstract base class for all query format parsers.
    
    Provides:
    - Security validation (SQL injection, DoS prevention)
    - Input validation and sanitization
    - Error recovery and helpful error messages
    - Performance monitoring
    - Common tokenization utilities
    
    All 31 format parsers extend this class.
    """
    
    # ==================== Class Constants ====================
    
    # Security limits (from xwsystem validation)
    MAX_QUERY_LENGTH = 1_000_000  # 1MB text
    MAX_NESTING_DEPTH = 100
    MAX_TOKENS = 10_000
    
    # Dangerous patterns (SQL injection, code execution)
    DANGEROUS_PATTERNS = [
        r';\s*DROP\s+TABLE',
        r';\s*DELETE\s+FROM',
        r';\s*TRUNCATE\s+TABLE',
        r';\s*ALTER\s+TABLE',
        r';\s*EXEC\s*\(',
        r';\s*EXECUTE\s*\(',
        r'xp_cmdshell',
        r'sp_executesql',
    ]
    
    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """
        Initialize parser.
        
        Args:
            conversion_mode: Conversion mode for format incompatibilities
        """
        self.conversion_mode = conversion_mode
        self._parse_count = 0
        self._total_parse_time = 0.0
        self._error_count = 0
    
    # ==================== Abstract Methods (Implement in Subclasses) ====================
    
    @abstractmethod
    def parse(self, query: str, **options) -> List[QueryAction]:
        """
        Parse query string to QueryAction tree.
        
        This is the main parsing method that subclasses must implement.
        
        Args:
            query: Query string in specific format
            **options: Format-specific options
            
        Returns:
            List of QueryAction objects representing the query
            
        Raises:
            XWQueryParseError: On parsing errors
            XWQuerySecurityError: On security violations
        """
        pass
    
    @abstractmethod
    def get_format_name(self) -> str:
        """Return format name (e.g., 'SQL', 'XPath')."""
        pass
    
    # ==================== Security Validation ====================
    
    def validate_security(self, query: str) -> None:
        """
        Validate query for security issues.
        
        Priority #1: Security - Protects against attacks.
        
        Args:
            query: Query string to validate
            
        Raises:
            XWQuerySecurityError: If security violations detected
        """
        # Check length (DoS prevention)
        if len(query) > self.MAX_QUERY_LENGTH:
            raise XWQuerySecurityError(
                f"Query too long: {len(query)} chars (max {self.MAX_QUERY_LENGTH}). "
                f"This prevents DoS attacks."
            )
        
        # Check for dangerous patterns (SQL injection, code execution)
        query_upper = query.upper()
        for pattern in self.DANGEROUS_PATTERNS:
            if re.search(pattern, query_upper, re.IGNORECASE):
                raise XWQuerySecurityError(
                    f"Dangerous pattern detected: {pattern}. "
                    f"This prevents injection attacks. Query rejected."
                )
    
    def validate_nesting_depth(self, depth: int) -> None:
        """
        Validate nesting depth to prevent stack overflow.
        
        Args:
            depth: Current nesting depth
            
        Raises:
            XWQuerySecurityError: If depth exceeds limit
        """
        if depth > self.MAX_NESTING_DEPTH:
            raise XWQuerySecurityError(
                f"Nesting depth {depth} exceeds maximum {self.MAX_NESTING_DEPTH}. "
                f"This prevents stack overflow attacks."
            )
    
    # ==================== Input Validation ====================
    
    def validate_input(self, query: str) -> None:
        """
        Validate query input.
        
        Args:
            query: Query string to validate
            
        Raises:
            XWQueryValueError: If input is invalid
        """
        # Check None
        if query is None:
            raise XWQueryValueError(
                "Query cannot be None. "
                "Expected: non-empty string in " + self.get_format_name() + " format."
            )
        
        # Check type
        if not isinstance(query, str):
            raise XWQueryValueError(
                f"Query must be string, got {type(query).__name__}. "
                f"Expected: string in {self.get_format_name()} format."
            )
        
        # Check empty
        if not query or not query.strip():
            raise XWQueryValueError(
                "Query cannot be empty. "
                f"Expected: non-empty {self.get_format_name()} query string."
            )
    
    # ==================== Error Handling ====================
    
    def create_parse_error(
        self,
        message: str,
        position: Optional[int] = None,
        line: Optional[int] = None,
        column: Optional[int] = None,
        context: Optional[str] = None
    ) -> XWQueryParseError:
        """
        Create helpful parse error with context.
        
        Priority #2: Usability - Clear error messages.
        
        Args:
            message: Error message
            position: Character position in query
            line: Line number
            column: Column number
            context: Surrounding query context
            
        Returns:
            XWQueryParseError with detailed information
        """
        error_parts = [f"{self.get_format_name()} Parse Error: {message}"]
        
        if line is not None and column is not None:
            error_parts.append(f"  Location: Line {line}, Column {column}")
        elif position is not None:
            error_parts.append(f"  Position: Character {position}")
        
        if context:
            error_parts.append(f"  Context: {context}")
        
        error_parts.append(f"  Format: {self.get_format_name()}")
        
        return XWQueryParseError("\n".join(error_parts))
    
    # ==================== Performance Monitoring ====================
    
    def _monitor_parse_start(self) -> float:
        """Start parse performance monitoring."""
        return time.time()
    
    def _monitor_parse_end(self, start_time: float) -> None:
        """End parse performance monitoring."""
        elapsed = time.time() - start_time
        self._parse_count += 1
        self._total_parse_time += elapsed
    
    def _monitor_parse_error(self) -> None:
        """Record parse error."""
        self._error_count += 1
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """
        Get parser performance statistics.
        
        Returns:
            Dictionary with performance metrics
        """
        avg_time = self._total_parse_time / self._parse_count if self._parse_count > 0 else 0
        
        return {
            'format': self.get_format_name(),
            'parse_count': self._parse_count,
            'total_time': self._total_parse_time,
            'average_time': avg_time,
            'error_count': self._error_count,
            'error_rate': self._error_count / self._parse_count if self._parse_count > 0 else 0
        }
    
    # ==================== Conversion Mode Handling ====================
    
    def set_conversion_mode(self, mode: ConversionMode) -> None:
        """Set conversion mode for format incompatibilities."""
        self.conversion_mode = mode
    
    def handle_incompatible_feature(
        self,
        feature_name: str,
        error_message: Optional[str] = None
    ) -> None:
        """
        Handle incompatible features based on conversion mode.
        
        Args:
            feature_name: Name of incompatible feature
            error_message: Optional custom error message
            
        Raises:
            XWQueryParseError: In strict mode
        """
        msg = error_message or f"Feature '{feature_name}' not supported in {self.get_format_name()}"
        
        if self.conversion_mode == ConversionMode.STRICT:
            raise XWQueryParseError(
                f"STRICT MODE: {msg}. "
                f"Use FLEXIBLE mode to find alternatives or LENIENT mode to skip."
            )
        elif self.conversion_mode == ConversionMode.FLEXIBLE:
            # Log warning, try to find alternatives (subclass implements)
            pass
        elif self.conversion_mode == ConversionMode.LENIENT:
            # Silently skip (subclass implements)
            pass
    
    # ==================== Common Utility Methods ====================
    
    def normalize_query(self, query: str) -> str:
        """
        Normalize query string (trim, collapse whitespace).
        
        Args:
            query: Query string
            
        Returns:
            Normalized query
        """
        # Trim whitespace
        query = query.strip()
        
        # Collapse multiple spaces
        query = re.sub(r'\s+', ' ', query)
        
        return query
    
    def extract_string_literals(self, query: str) -> Tuple[str, Dict[str, str]]:
        """
        Extract string literals from query for easier parsing.
        
        Args:
            query: Query string
            
        Returns:
            Tuple of (query with placeholders, literal map)
        """
        literals = {}
        placeholder_counter = 0
        
        def replace_literal(match):
            nonlocal placeholder_counter
            literal = match.group(0)
            placeholder = f"__STRING_LITERAL_{placeholder_counter}__"
            literals[placeholder] = literal
            placeholder_counter += 1
            return placeholder
        
        # Replace single-quoted strings
        query = re.sub(r"'(?:[^'\\]|\\.)*'", replace_literal, query)
        
        # Replace double-quoted strings
        query = re.sub(r'"(?:[^"\\]|\\.)*"', replace_literal, query)
        
        return query, literals
    
    def restore_string_literals(self, query: str, literals: Dict[str, str]) -> str:
        """
        Restore string literals in query.
        
        Args:
            query: Query with placeholders
            literals: Literal map from extract_string_literals
            
        Returns:
            Query with restored literals
        """
        for placeholder, literal in literals.items():
            query = query.replace(placeholder, literal)
        
        return query
    
    # ==================== Validation with Monitoring ====================
    
    def parse_with_validation(self, query: str, **options) -> List[QueryAction]:
        """
        Parse query with full validation and monitoring.
        
        This is the recommended public method to use.
        Delegates to subclass parse() method after validation.
        
        Args:
            query: Query string
            **options: Format-specific options
            
        Returns:
            List of QueryAction objects
            
        Raises:
            XWQueryParseError: On parsing errors
            XWQuerySecurityError: On security violations
            XWQueryValueError: On invalid input
        """
        start_time = self._monitor_parse_start()
        
        try:
            # Validate input
            self.validate_input(query)
            
            # Security validation
            self.validate_security(query)
            
            # Parse (delegated to subclass)
            actions = self.parse(query, **options)
            
            # Update metrics
            self._monitor_parse_end(start_time)
            
            return actions
            
        except (XWQueryParseError, XWQuerySecurityError, XWQueryValueError):
            self._monitor_parse_error()
            raise
        except Exception as e:
            self._monitor_parse_error()
            raise XWQueryParseError(
                f"Unexpected error parsing {self.get_format_name()} query: {str(e)}"
            ) from e


# ==================== Concrete Base Classes for Specific Format Types ====================

class AStructuredQueryParser(ABaseParser):
    """Base parser for structured query languages (SQL, N1QL, etc.)."""
    
    def tokenize(self, query: str) -> List[str]:
        """
        Tokenize query into keywords, identifiers, operators, literals.
        
        Args:
            query: Query string
            
        Returns:
            List of tokens
        """
        # Basic tokenization (override in subclass for format-specific)
        tokens = re.findall(r'\w+|[^\w\s]', query)
        
        # Validate token count
        if len(tokens) > self.MAX_TOKENS:
            raise XWQuerySecurityError(
                f"Too many tokens: {len(tokens)} (max {self.MAX_TOKENS}). "
                f"This prevents DoS attacks."
            )
        
        return tokens


class APathQueryParser(ABaseParser):
    """Base parser for path-based query languages (XPath, JMESPath, etc.)."""
    
    def parse_path_expression(self, path: str) -> Dict[str, Any]:
        """
        Parse path expression.
        
        Args:
            path: Path expression
            
        Returns:
            Parsed path structure
        """
        # Implement in subclass
        raise NotImplementedError("Subclass must implement parse_path_expression")


class AGraphQueryParser(ABaseParser):
    """Base parser for graph query languages (Cypher, Gremlin, etc.)."""
    
    def parse_pattern(self, pattern: str) -> Dict[str, Any]:
        """
        Parse graph pattern.
        
        Args:
            pattern: Graph pattern expression
            
        Returns:
            Parsed pattern structure
        """
        # Implement in subclass
        raise NotImplementedError("Subclass must implement parse_pattern")


__all__ = [
    'ABaseParser',
    'AStructuredQueryParser',
    'APathQueryParser',
    'AGraphQueryParser'
]

