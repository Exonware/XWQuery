#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/krm_kyaml.py
KRM/kyaml Query Strategy
This module implements the KRM/kyaml query strategy for Kubernetes YAML function scripts operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class KRMKyamlStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """KRM/kyaml query strategy for Kubernetes YAML function scripts operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'krmkyaml', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute KRM/kyaml query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid KRM/kyaml query: {query}")
        return {"result": "KRM/kyaml query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate KRM/kyaml query syntax."""
        if not query or not isinstance(query, str):
            return False
        # KRM/kyaml uses YAML with Kubernetes resource definitions and functions
        return any(op in query for op in ["apiVersion", "kind", "metadata", "spec", ":", "-", "items", "matchLabels", "selectors"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get KRM/kyaml query execution plan."""
        return {
            "query_type": "KRM_KYAML",
            "complexity": "LOW",
            "estimated_cost": 65
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"apiVersion: v1\nkind: Resource\nmetadata:\n  name: {path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"apiVersion: v1\nkind: Resource\nspec:\n  filter: {filter_expression}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_yaml = "\n".join([f"  {f}: {f}" for f in fields])
        return self.execute(f"apiVersion: v1\nkind: Resource\nspec:\n{fields_yaml}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"apiVersion: v1\nkind: Resource\nspec:\n  sort: {sort_fields[0]}\n  order: {order}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"apiVersion: v1\nkind: Resource\nspec:\n  limit: {limit}\n  offset: {offset}")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Simple extraction
        if ':' in query:
            fields = [query]
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "krm_kyaml_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "krm_kyaml_select_1",
            "content": f"SELECT {select_fields}",
            "line_number": 1,
            "timestamp": datetime.now().isoformat(),
            "children": children
        }
        actions = {
            "root": {
                "type": "PROGRAM",
                "statements": [select_action],
                "comments": [],
                "metadata": {
                    "version": "1.0",
                    "created": datetime.now().isoformat(),
                    "source_format": "KRM_KYAML"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
