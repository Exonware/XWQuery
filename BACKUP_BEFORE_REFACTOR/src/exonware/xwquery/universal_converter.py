#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/universal_converter.py

Universal Query Language Converter - Convert between any supported formats.
Enables SQL ↔ XPath ↔ Cypher ↔ ... (31 formats total).

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import List, Optional
from .contracts import QueryAction
from .errors import XWQueryValueError
from .defs import ConversionMode

# Parsers
from .parsers.sql_parser import SQLParser, parse_sql
from .parsers.xpath_parser import XPathParser, parse_xpath

# Generators
from .generators.sql_generator import SQLGenerator, generate_sql
from .generators.xpath_generator import XPathGenerator, generate_xpath


class UniversalQueryConverter:
    """
    Universal query language converter.
    
    Converts between any two supported query formats through QueryAction tree.
    
    Architecture:
    - Source Format → Parser → QueryAction Tree (intermediate)
    - QueryAction Tree → Generator → Target Format
    
    Supported Formats (31 total):
    - SQL Family: SQL, PartiQL, N1QL, HiveQL, HQL, KQL (6)
    - Graph: Cypher, Gremlin, SPARQL, GQL (4)
    - Document: XPath, XQuery, JMESPath, jq (4)
    - Schema: GraphQL, JSONiq, XML Query (3)
    - Time-Series: PromQL, LogQL, Flux, EQL (4)
    - Streaming: Datalog, Pig, LINQ (3)
    - NoSQL: MQL, CQL, Elastic DSL, JSON Query (4)
    - Specialized: XWQuery, XWNode Executor (3)
    
    Conversion Modes:
    - STRICT: Fail on incompatible features
    - FLEXIBLE: Find alternatives when possible (default)
    - LENIENT: Skip incompatible features with warnings
    
    Examples:
    >>> converter = UniversalQueryConverter()
    >>> xpath = converter.convert("SELECT * FROM users WHERE age > 18", 
    ...                           from_format='sql', to_format='xpath')
    >>> # Result: //users/user[age > 18]
    
    >>> sql = converter.convert("//books/book[price < 10]/title",
    ...                         from_format='xpath', to_format='sql')
    >>> # Result: SELECT title FROM books WHERE price < 10
    """
    
    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """
        Initialize universal converter.
        
        Args:
            conversion_mode: Conversion mode for incompatibilities
        """
        self.conversion_mode = conversion_mode
        
        # Initialize parsers
        self.parsers = {
            'sql': SQLParser(conversion_mode),
            'xpath': XPathParser(conversion_mode),
            # More formats will be added as implemented
        }
        
        # Initialize generators
        self.generators = {
            'sql': SQLGenerator(conversion_mode),
            'xpath': XPathGenerator(conversion_mode),
            # More formats will be added as implemented
        }
    
    # ==================== Main Conversion API ====================
    
    def convert(
        self,
        query: str,
        from_format: str,
        to_format: str,
        **options
    ) -> str:
        """
        Convert query from one format to another.
        
        Args:
            query: Query string in source format
            from_format: Source format name ('sql', 'xpath', etc.)
            to_format: Target format name ('sql', 'xpath', etc.)
            **options: Conversion options
            
        Returns:
            Query string in target format
            
        Raises:
            XWQueryValueError: If formats not supported or conversion fails
        """
        # Normalize format names
        from_format = from_format.lower()
        to_format = to_format.lower()
        
        # Validate formats
        if from_format not in self.parsers:
            raise XWQueryValueError(
                f"Unsupported source format: '{from_format}'\n"
                f"Supported formats: {', '.join(sorted(self.parsers.keys()))}"
            )
        
        if to_format not in self.generators:
            raise XWQueryValueError(
                f"Unsupported target format: '{to_format}'\n"
                f"Supported formats: {', '.join(sorted(self.generators.keys()))}"
            )
        
        # Same format - return as-is
        if from_format == to_format:
            return query
        
        # Parse source format
        parser = self.parsers[from_format]
        actions = parser.parse_with_validation(query, **options)
        
        # Generate target format
        generator = self.generators[to_format]
        target_query = generator.generate_with_validation(actions, **options)
        
        return target_query
    
    def convert_with_intermediate(
        self,
        query: str,
        from_format: str,
        to_format: str,
        return_actions: bool = False,
        **options
    ) -> tuple:
        """
        Convert query and optionally return intermediate QueryAction tree.
        
        Useful for debugging and understanding conversions.
        
        Args:
            query: Query string in source format
            from_format: Source format name
            to_format: Target format name
            return_actions: If True, return (target_query, actions)
            **options: Conversion options
            
        Returns:
            Tuple of (target_query, actions) if return_actions=True
            Just target_query otherwise
        """
        from_format = from_format.lower()
        to_format = to_format.lower()
        
        # Parse
        parser = self.parsers.get(from_format)
        if not parser:
            raise XWQueryValueError(f"Unsupported source format: '{from_format}'")
        
        actions = parser.parse_with_validation(query, **options)
        
        # Generate
        generator = self.generators.get(to_format)
        if not generator:
            raise XWQueryValueError(f"Unsupported target format: '{to_format}'")
        
        target_query = generator.generate_with_validation(actions, **options)
        
        if return_actions:
            return target_query, actions
        else:
            return target_query
    
    # ==================== Helper Methods ====================
    
    def get_supported_formats(self) -> List[str]:
        """Get list of supported formats."""
        # Formats supported for both parsing and generation
        return sorted(set(self.parsers.keys()) & set(self.generators.keys()))
    
    def can_parse(self, format_name: str) -> bool:
        """Check if format can be parsed."""
        return format_name.lower() in self.parsers
    
    def can_generate(self, format_name: str) -> bool:
        """Check if format can be generated."""
        return format_name.lower() in self.generators
    
    def can_convert(self, from_format: str, to_format: str) -> bool:
        """Check if conversion is supported."""
        return (self.can_parse(from_format) and 
                self.can_generate(to_format))
    
    # ==================== Batch Conversion ====================
    
    def convert_many(
        self,
        queries: List[str],
        from_format: str,
        to_format: str,
        **options
    ) -> List[str]:
        """
        Convert multiple queries.
        
        Args:
            queries: List of query strings
            from_format: Source format
            to_format: Target format
            **options: Conversion options
            
        Returns:
            List of converted query strings
        """
        return [
            self.convert(query, from_format, to_format, **options)
            for query in queries
        ]
    
    # ==================== Validation ====================
    
    def validate_query(self, query: str, format_name: str) -> bool:
        """
        Validate query in specific format.
        
        Args:
            query: Query string
            format_name: Format name
            
        Returns:
            True if valid, False otherwise
        """
        try:
            parser = self.parsers.get(format_name.lower())
            if not parser:
                return False
            parser.parse_with_validation(query)
            return True
        except Exception:
            return False


# ==================== Convenience Functions ====================

def sql_to_xpath(sql_query: str, mode: ConversionMode = ConversionMode.FLEXIBLE) -> str:
    """
    Convert SQL query to XPath expression.
    
    Args:
        sql_query: SQL query string
        mode: Conversion mode
        
    Returns:
        XPath expression
    """
    converter = UniversalQueryConverter(mode)
    return converter.convert(sql_query, 'sql', 'xpath')


def xpath_to_sql(xpath_expr: str, mode: ConversionMode = ConversionMode.FLEXIBLE) -> str:
    """
    Convert XPath expression to SQL query.
    
    Args:
        xpath_expr: XPath expression string
        mode: Conversion mode
        
    Returns:
        SQL query string
    """
    converter = UniversalQueryConverter(mode)
    return converter.convert(xpath_expr, 'xpath', 'sql')


def convert_query(
    query: str,
    from_format: str,
    to_format: str,
    mode: ConversionMode = ConversionMode.FLEXIBLE
) -> str:
    """
    Convert query between any two supported formats.
    
    Args:
        query: Query string
        from_format: Source format ('sql', 'xpath', etc.)
        to_format: Target format ('sql', 'xpath', etc.)
        mode: Conversion mode
        
    Returns:
        Converted query string
    """
    converter = UniversalQueryConverter(mode)
    return converter.convert(query, from_format, to_format)


__all__ = [
    'UniversalQueryConverter',
    'sql_to_xpath',
    'xpath_to_sql',
    'convert_query'
]

