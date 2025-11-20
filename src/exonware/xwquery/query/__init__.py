#!/usr/bin/env python3
"""
Query subsystem for xwquery.

Contains all query-related components:
- adapters: Syntax adapters (AST conversion)
- converters: Universal query format converters
- executors: Operation executors
- generators: Query generators
- grammars: Grammar definitions
- optimization: Query optimization
- parsers: Query parsers
- strategies: Query strategies
"""

# Re-export for convenience
from .converters import (
    UniversalQueryConverter,
    sql_to_xpath,
    xpath_to_sql,
    convert_query
)

__all__ = [
    "adapters",
    "converters",
    "executors",
    "generators",
    "grammars",
    "optimization",
    "parsers",
    "strategies",
    # Convenience exports
    "UniversalQueryConverter",
    "sql_to_xpath",
    "xpath_to_sql",
    "convert_query",
]
