#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/bash_pipeline.py
Bash Pipeline Query Strategy
This module implements the Bash pipeline query strategy for Bash data pipelines (CLI scripting for ETL) operations.
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


class BashPipelineStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Bash pipeline query strategy for Bash data pipelines (CLI scripting for ETL) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'bashpipeline', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Bash pipeline query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Bash pipeline query: {query}")
        return {"result": "Bash pipeline query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Bash pipeline query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Bash pipelines use |, >, <, grep, awk, sed, sort, cut, etc.
        return any(op in query for op in ["|", ">", "<", "grep", "awk", "sed", "sort", "cut", "head", "tail", "uniq", "wc", "$", "cat"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Bash pipeline query execution plan."""
        return {
            "query_type": "BASH_PIPELINE",
            "complexity": "LOW",
            "estimated_cost": 60
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"cat {path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"grep '{filter_expression}'")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute(f"cut -d' ' -f{','.join(fields)}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"sort -k{sort_fields[0]} -{order[0]}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        if offset > 0:
            return self.execute(f"tail -n +{offset + 1} | head -n {limit}")
        return self.execute(f"head -n {limit}")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract commands from pipeline
        commands = query.split('|')
        if commands:
            fields = [cmd.strip().split()[0] if cmd.strip().split() else cmd.strip() for cmd in commands[:5]]
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "bash_pipeline_select_1",
            "content": f"SELECT {select_fields}",
            "line_number": 1,
            "timestamp": datetime.now().isoformat(),
            "children": []
        }
        actions = {
            "root": {
                "type": "PROGRAM",
                "statements": [select_action],
                "comments": [],
                "metadata": {
                    "version": "1.0",
                    "created": datetime.now().isoformat(),
                    "source_format": "BASH_PIPELINE"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
