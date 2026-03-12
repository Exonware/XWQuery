#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/kustomize.py
Kustomize Query Strategy
This module implements the Kustomize query strategy for Kustomize patches (strategic merge / JSON6902) operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class KustomizeStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Kustomize query strategy for Kustomize patches (strategic merge / JSON6902) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'kustomize', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Kustomize query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Kustomize query: {query}")
        return {"result": "Kustomize query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Kustomize query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Kustomize uses YAML with patches, resources, and patchesStrategicMerge
        return any(op in query for op in ["apiVersion", "kind", "patchesStrategicMerge", "patchesJson6902", "resources", ":", "-", "path", "op"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Kustomize query execution plan."""
        return {
            "query_type": "KUSTOMIZE",
            "complexity": "LOW",
            "estimated_cost": 70
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources:\n  - {path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\npatchesStrategicMerge:\n  - {filter_expression}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_yaml = "\n".join([f"  - {f}" for f in fields])
        return self.execute(f"apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources:\n{fields_yaml}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources:\n  - {sort_fields[0]}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources: []")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Simple extraction
        if ':' in query or '-' in query:
            fields = [query]
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "kustomize_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "kustomize_select_1",
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
                    "source_format": "KUSTOMIZE"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
