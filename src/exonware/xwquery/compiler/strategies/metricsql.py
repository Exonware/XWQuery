#!/usr/bin/env python3
"""
MetricsQL Query Strategy
This module implements the MetricsQL query strategy for VictoriaMetrics MetricsQL operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""
from typing import Any, Optional
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode
import re
class MetricsQLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """MetricsQL query strategy for VictoriaMetrics MetricsQL operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'metricsql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.TIME_SERIES
    def execute(self, query: str, **kwargs) -> Any:
        """Execute MetricsQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid MetricsQL query: {query}")
        return {"result": "MetricsQL query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate MetricsQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        query = query.strip()
        # MetricsQL is PromQL-compatible: valid if it's a metric name (word) or has operators
        # Simple metric name (word starting with letter/digit)
        if re.match(r'^[\w][\w]*$', query):
            return True
        # MetricsQL has operators or label filters
        return any(op in query for op in ["{", "}", "=", "!=", "=~", "!~", "rate", "sum", "avg", "max", "min", "count", "by", "(", ")"])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get MetricsQL query execution plan."""
        return {
            "query_type": "MetricsQL",
            "complexity": "MEDIUM",
            "estimated_cost": 75
        }
    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        tags = f"{{{where_clause or ''}}}" if where_clause else ""
        return self.execute(f"{table}{tags}")
    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        return self.execute(f"{table}")
    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        tags = f"{{{where_clause or ''}}}" if where_clause else ""
        return self.execute(f"{table}{tags}")
    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        return self.execute(f"{table}")
    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        return self.execute(f"{tables[0]} * on(instance) {tables[1]}")
    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        by_clause = f" by ({', '.join(group_by)})" if group_by else ""
        return self.execute(f"{functions[0]}({table}){by_clause}")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse MetricsQL query (e.g., "up{job=\"prometheus\", instance=~\"server.*\"}")
        entity_name = None
        fields = []
        where_conditions = []
        # Extract metric name (first identifier before { or [)
        metric_match = re.match(r'(\w+)', query)
        if metric_match:
            entity_name = metric_match.group(1)
        # Extract label filters from { ... }
        label_match = re.search(r'\{([^}]+)\}', query)
        if label_match:
            labels = label_match.group(1)
            # Parse label=value pairs (supports =, !=, =~, !~)
            label_pairs = re.findall(r'(\w+)\s*([=!~]+)\s*["\']?([^,}]+)["\']?', labels)
            for key, op, value in label_pairs:
                where_conditions.append(f"{key} {op} {value}")
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "metricsql_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "metricsql_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_action = {
            "type": "SELECT",
            "id": "metricsql_select_1",
            "content": f"SELECT {entity_name or '*'}"
            if not fields else f"SELECT {', '.join(fields)}",
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
                    "source_format": "METRICSQL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
            # Parse WHERE conditions into label filters
            labels = []
            for cond in where_conditions:
                # Handle operators: =, !=, =~, !~
                if ' = ' in cond:
                    key, value = cond.split(' = ', 1)
                    labels.append(f'{key}="{value}"')
                elif ' != ' in cond:
                    key, value = cond.split(' != ', 1)
                    labels.append(f'{key}!="{value}"')
                elif ' =~ ' in cond:
                    key, value = cond.split(' =~ ', 1)
                    labels.append(f'{key}=~"{value}"')
                elif ' !~ ' in cond:
                    key, value = cond.split(' !~ ', 1)
                    labels.append(f'{key}!~"{value}"')
                else:
                    # Default to =
                    if ' = ' in cond:
                        key, value = cond.split(' = ', 1)
                        labels.append(f'{key}="{value}"')
            if labels:
                metricsql_query = f"{metric}{{{', '.join(labels)}}}"
            else:
                metricsql_query = metric
        else:
            metricsql_query = metric
        return metricsql_query
