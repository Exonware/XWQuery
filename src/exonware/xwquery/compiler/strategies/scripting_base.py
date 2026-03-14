#!/usr/bin/env python3
"""
Scripting Strategy Base - Grammar-based execution for scripting languages
Reuses xwsyntax grammars (JavaScript, TypeScript, Python, Go, Ruby, PHP, Lua,
Bash, PowerShell, Groovy, Kotlin, Swift, Dart, Elixir, Scala, Julia, HCL,
Solidity, Rust, WebAssembly) so they can be validated, parsed, and executed
in xwquery via FormatRegistry (same pattern as SQL).
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
"""

from __future__ import annotations
from typing import Any
from .grammar_based import GrammarBasedStrategy
from .base import ADocumentQueryStrategy
from ...defs import QueryMode, QueryTrait
from ...errors import XWQueryValueError, XWQueryParseError
from ...contracts import QueryAction


class GrammarBasedDocumentStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """
    Grammar-based strategy for scripting/document languages.
    Enables execution in xwquery for all formats that have xwsyntax grammars:
    JavaScript, TypeScript, Python, Go, Ruby, PHP, Lua, Bash, PowerShell,
    Groovy, Kotlin, Swift, Dart, Elixir, Scala, Julia, HCL, Solidity,
    Rust, WebAssembly.
    Pattern: Same as SQL (GrammarBasedStrategy + structured base). Uses
    xwsyntax for validate_query, to_actions_tree, from_actions_tree.
    Implements ADocumentQueryStrategy abstract methods so FormatRegistry-
    created strategies are instantiable.
    """

    def __init__(self, format_name: str | None = None, **options: Any) -> None:
        name = format_name or options.get("format_name") or options.get("grammar_format")
        if not name:
            raise ValueError("format_name or grammar_format required for GrammarBasedDocumentStrategy")
        GrammarBasedStrategy.__init__(self, name, **options)
        ADocumentQueryStrategy.__init__(self, **options)
        self._mode = options.get("mode", QueryMode.AUTO)
        self._traits = options.get(
            "traits",
            QueryTrait.DOCUMENT | QueryTrait.STRUCTURED,
        )

    def execute(self, script: str, **kwargs) -> Any:
        """
        Execute script: validate with grammar, parse to AST/actions, return result.
        For scripting languages this typically returns parse result (AST or
        actions tree). Optional runtime execution can be wired via kwargs
        (e.g. runtime='node' for JavaScript) by callers.
        """
        if not self.validate_query(script):
            raise XWQueryValueError(
                f"Invalid {self._format_name} script: validation failed"
            )
        try:
            actions_tree = self.to_actions_tree(script)
            data = kwargs.get("data") or kwargs.get("node") or kwargs.get("queryable")
            # If no execution backend in kwargs, return parse result (like SQL returns rows)
            if data is not None and hasattr(data, "get"):
                # Document-style execution: path/filter/projection on data
                path = kwargs.get("path", "")
                if path:
                    return self.path_query(path)
            return {
                "valid": True,
                "format": self._format_name,
                "actions_tree": actions_tree.to_native() if hasattr(actions_tree, "to_native") else actions_tree,
            }
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse {self._format_name} script: {str(e)}"
            ) from e

    def path_query(self, path: str) -> Any:
        """Execute path-based query (document-style). Default: return path for later execution."""
        return {"path": path, "format": self._format_name, "executed": False}

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query. Default: return filter for later execution."""
        return {"filter": filter_expression, "format": self._format_name, "executed": False}

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query. Default: return fields for later execution."""
        return {"fields": fields, "format": self._format_name, "executed": False}

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query. Default: return sort spec for later execution."""
        return {"sort_fields": sort_fields, "order": order, "format": self._format_name, "executed": False}

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query. Default: return limit/offset for later execution."""
        return {"limit": limit, "offset": offset, "format": self._format_name, "executed": False}

    def can_handle(self, query_string: str) -> bool:
        """Check if this strategy can handle the given script."""
        return self.validate_query(query_string)

    def get_supported_operations(self) -> list[str]:
        """Get list of supported operations (parse, validate, to_actions_tree, from_actions_tree)."""
        return ["parse", "validate", "to_actions_tree", "from_actions_tree", "execute"]
__all__ = ["GrammarBasedDocumentStrategy"]
