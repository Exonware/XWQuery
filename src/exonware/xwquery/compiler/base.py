"""
Compiler base classes for xwquery.
This module contains ONLY compilation / parsing / strategy abstractions
that are responsible for:
- Understanding query formats
- Converting scripts into QueryAction trees
- Generating scripts from QueryAction trees
Execution concerns live in `exonware.xwquery.runtime.base`.
"""

from __future__ import annotations
from abc import ABC
from typing import Any
from ..contracts import IQueryStrategy, IParamExtractor
from ..defs import QueryMode


class AParamExtractor(IParamExtractor, ABC):
    """
    Abstract base class for parameter extractors.
    Provides common utility methods for parsing query parameters.
    """

    def _parse_value(self, value_str: str) -> str | int | float | bool | None:
        """
        Parse value from string to appropriate type.
        Args:
            value_str: String representation of value
        Returns:
            Parsed value with correct type
        """
        value_str = value_str.strip().strip('"').strip("'")
        # Try boolean
        if value_str.lower() == "true":
            return True
        if value_str.lower() == "false":
            return False
        if value_str.lower() in ("null", "none"):
            return None
        # Try number
        try:
            if "." in value_str:
                return float(value_str)
            return int(value_str)
        except ValueError:
            pass
        # Return as string
        return value_str

    def _split_fields(self, fields_str: str) -> list[str]:
        """Split comma-separated fields, handling nested expressions."""
        if fields_str.strip() == "*":
            return ["*"]
        fields: list[str] = []
        current: list[str] = []
        paren_depth = 0
        for char in fields_str:
            if char == "(":
                paren_depth += 1
            elif char == ")":
                paren_depth -= 1
            elif char == "," and paren_depth == 0:
                fields.append("".join(current).strip())
                current = []
                continue
            current.append(char)
        if current:
            fields.append("".join(current).strip())
        return fields


class AQueryStrategy(IQueryStrategy, ABC):
    """
    Base strategy for all query implementations.
    Provides common functionality for all query format strategies
    (SQL, GraphQL, Cypher, etc.).
    """

    def __init__(self, **options: Any) -> None:
        """Initialize query strategy."""
        self._options = options
        self._mode: QueryMode = options.get("mode", QueryMode.AUTO)

    def get_mode(self) -> QueryMode:
        """Get strategy mode."""
        return self._mode

    def get_query_type(self) -> str:
        """Get the query type for this strategy."""
        return self.__class__.__name__.replace("Strategy", "").upper()

    def to_native(self) -> "AQueryStrategy":
        """Convert this strategy to native XWQuery format."""
        from .strategies.xwqs import XWQSStrategy
        return XWQSStrategy()

    def from_format(self, query: str, source_format: str) -> "AQueryStrategy":
        """
        Convert query from another format to this strategy.
        Default implementation delegates to native converter.
        """
        # This is a placeholder - subclasses should override
        return self.to_native()
__all__ = [
    "AParamExtractor",
    "AQueryStrategy",
]
