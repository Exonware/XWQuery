"""
Compiler subsystem for xwquery.
This package is responsible for:
- Converting script/query formats into internal QueryAction trees
- Detecting formats and delegating to the appropriate strategy
- Generating scripts from QueryAction trees
It intentionally does NOT execute queries – execution lives in the
`exonware.xwquery.runtime` package.
"""

from __future__ import annotations
from typing import Any, Optional
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import QueryMode
# Base compiler abstractions
from .base import AParamExtractor, AQueryStrategy
# Core native strategy (xwquery script)
from .strategies.xwqs import XWQSStrategy
# Public strategies (script formats)
from .strategies.sql import SQLStrategy
from .strategies.graphql import GraphQLStrategy
from .strategies.cypher import CypherStrategy
from .strategies.sparql import SPARQLStrategy
# XWQueryScriptStrategy - not found in strategies, may be in xwqs
# Skip for now - will be added if needed
XWQueryScriptStrategy = None
# Parsers / detectors
from .parsers.sql_param_extractor import SQLParamExtractor
from .parsers.format_detector import QueryFormatDetector, detect_query_format
from .parsers.sql_parser import parse_sql
from .parsers.xpath_parser import parse_xpath
# Generators
from .generators.sql_generator import generate_sql
from .generators.xpath_generator import generate_xpath
# Universal converter (script ↔ script)
from .converters import (
    UniversalQueryConverter,
    sql_to_xpath,
    xpath_to_sql,
    convert_query,
)
__all__ = [
    # Data structures
    "QueryAction",
    "ExecutionContext",
    "ExecutionResult",
    "QueryMode",
    # Base abstractions
    "AParamExtractor",
    "AQueryStrategy",
    # Strategies
    "XWQSStrategy",
    "SQLStrategy",
    "GraphQLStrategy",
    "CypherStrategy",
    "SPARQLStrategy",
    # "XWQueryScriptStrategy",  # Not available
    # Parsers / detectors
    "SQLParamExtractor",
    "QueryFormatDetector",
    "detect_query_format",
    "parse_sql",
    "parse_xpath",
    # Generators
    "generate_sql",
    "generate_xpath",
    # Universal converter
    "UniversalQueryConverter",
    "sql_to_xpath",
    "xpath_to_sql",
    "convert_query",
]


def compile_to_actions(
    query: str,
    data: Any | None = None,
    format: Optional[str] = None,
    auto_detect: bool = True,
    mode: QueryMode = QueryMode.AUTO,
    **kwargs: Any,
) -> QueryAction:
    """
    High-level helper: script/query string → QueryAction tree.
    This is a thin wrapper around the existing strategy / parser system,
    exposed from a compiler-centric namespace.
    """
    # For now this delegates to the native XWQSStrategy which in turn
    # uses the existing adapters/parsers infrastructure.
    strategy = XWQSStrategy(mode=mode, **kwargs)
    action_tree = strategy.parse_script(query, format=format, auto_detect=auto_detect)
    return action_tree


def to_script(
    actions: QueryAction,
    target_format: str = "xwquery",
    **kwargs: Any,
) -> str:
    """
    High-level helper: QueryAction tree → script in target format.
    Delegates to the existing UniversalQueryConverter implementation.
    """
    converter = UniversalQueryConverter()
    return converter.to_format(actions, target_format=target_format, **kwargs)
