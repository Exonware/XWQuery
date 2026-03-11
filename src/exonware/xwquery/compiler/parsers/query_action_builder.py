#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/query_action_builder.py
QueryAction Builder - Universal Query Tree Constructor
Helper utilities for building QueryAction trees from any query language.
Simplifies parser implementation across all 31 strategies.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 28-Oct-2025
"""

from __future__ import annotations
from typing import Any, Optional
from ...contracts import QueryAction


class QueryActionBuilder:
    """
    Fluent builder for constructing QueryAction trees.
    Makes it easy to build complex QueryAction trees from parsed query components.
    Example:
        builder = QueryActionBuilder()
        action = (builder
            .select()
            .where({"age": {"$gt": 25}})
            .group_by(["category"])
            .order_by(["name"], ascending=True)
            .limit(10)
            .build())
    """

    def __init__(self):
        """Initialize builder."""
        self._root = None
        self._current = None
        self._stack = []

    def from_source(self, source: str) -> QueryActionBuilder:
        """Set the FROM source/table for the query."""
        # If we already have a SELECT action, update its table parameter
        if self._root and self._root.type == 'SELECT':
            if not self._root.params:
                self._root.params = {}
            self._root.params['table'] = source
        else:
            # Create a FROM action
            action = QueryAction(type='FROM', params={'source': source})
            self._add_action(action)
        return self

    def select(self, fields: Optional[list[str]] = None, table: Optional[str] = None, distinct: bool = False) -> QueryActionBuilder:
        """Add SELECT operation."""
        action = QueryAction(
            type='SELECT',
            params={'fields': fields or [], 'table': table, 'distinct': distinct}
        )
        self._add_action(action)
        # If distinct is True, also add DISTINCT operation
        if distinct:
            self.distinct(fields)
        return self

    def where(self, condition: dict | str) -> QueryActionBuilder:
        """Add WHERE operation."""
        action = QueryAction(type='WHERE', params={'condition': condition})
        self._add_action(action)
        return self

    def group_by(self, fields: list[str]) -> QueryActionBuilder:
        """Add GROUP BY operation."""
        action = QueryAction(type='GROUP', params={'fields': fields})
        self._add_action(action)
        return self

    def having(self, condition: dict | str) -> QueryActionBuilder:
        """Add HAVING operation."""
        action = QueryAction(type='HAVING', params={'condition': condition})
        self._add_action(action)
        return self

    def order_by(self, fields: list[str], ascending: bool = True) -> QueryActionBuilder:
        """Add ORDER BY operation."""
        action = QueryAction(type='ORDER', params={'fields': fields, 'ascending': ascending})
        self._add_action(action)
        return self

    def limit(self, count: int, offset: int = 0) -> QueryActionBuilder:
        """Add LIMIT operation."""
        action = QueryAction(type='LIMIT', params={'count': count, 'offset': offset})
        self._add_action(action)
        return self

    def offset(self, offset: int) -> QueryActionBuilder:
        """Add OFFSET operation."""
        # Update existing LIMIT action if present, otherwise create OFFSET action
        if self._current and self._current.type == 'LIMIT':
            if not self._current.params:
                self._current.params = {}
            self._current.params['offset'] = offset
        else:
            action = QueryAction(type='OFFSET', params={'offset': offset})
            self._add_action(action)
        return self

    def join(self, join_type: str, right_table: str, on: dict | str) -> QueryActionBuilder:
        """Add JOIN operation."""
        action = QueryAction(
            type='JOIN',
            params={'join_type': join_type, 'right_table': right_table, 'on': on}
        )
        self._add_action(action)
        return self

    def aggregate(self, agg_type: str, field: Optional[str] = None, alias: Optional[str] = None) -> QueryActionBuilder:
        """Add aggregation operation (SUM, AVG, MIN, MAX, COUNT)."""
        action = QueryAction(
            type=agg_type.upper(),
            params={'field': field, 'alias': alias}
        )
        self._add_action(action)
        return self

    def distinct(self, fields: Optional[list[str]] = None) -> QueryActionBuilder:
        """Add DISTINCT operation."""
        action = QueryAction(type='DISTINCT', params={'fields': fields})
        self._add_action(action)
        return self

    def project(self, fields: list[str]) -> QueryActionBuilder:
        """Add PROJECT operation (field selection)."""
        action = QueryAction(type='PROJECT', params={'fields': fields})
        self._add_action(action)
        return self

    def filter(self, condition: dict | str) -> QueryActionBuilder:
        """Add FILTER operation (alias for WHERE)."""
        return self.where(condition)

    def insert(self, table: str, values: dict[str, Any]) -> QueryActionBuilder:
        """Add INSERT operation."""
        action = QueryAction(type='INSERT', params={'table': table, 'values': values})
        self._add_action(action)
        return self

    def update(self, table: str, values: dict[str, Any], condition: Optional[dict | str] = None) -> QueryActionBuilder:
        """Add UPDATE operation."""
        action = QueryAction(
            type='UPDATE',
            params={'table': table, 'values': values, 'condition': condition}
        )
        self._add_action(action)
        return self

    def delete(self, table: str, condition: Optional[dict | str] = None) -> QueryActionBuilder:
        """Add DELETE operation."""
        action = QueryAction(type='DELETE', params={'table': table, 'condition': condition})
        self._add_action(action)
        return self
    # Graph operations

    def match(self, pattern: dict | str) -> QueryActionBuilder:
        """Add MATCH operation (graph)."""
        action = QueryAction(type='MATCH', params={'pattern': pattern})
        self._add_action(action)
        return self

    def path(self, start: Any, end: Any, algorithm: str = 'shortest') -> QueryActionBuilder:
        """Add PATH operation."""
        action = QueryAction(
            type='PATH',
            params={'start': start, 'end': end, 'algorithm': algorithm}
        )
        self._add_action(action)
        return self

    def traverse(self, direction: str = 'out', edge_type: Optional[str] = None) -> QueryActionBuilder:
        """Add traversal operation (OUT, IN, BOTH)."""
        action = QueryAction(
            type=direction.upper(),
            params={'edge_type': edge_type}
        )
        self._add_action(action)
        return self

    def _add_action(self, action: QueryAction) -> None:
        """Add action to the tree."""
        if self._root is None:
            self._root = action
            self._current = action
        else:
            # Add as child of current
            if not hasattr(self._current, '_children'):
                self._current._children = []
            self._current.add_child(action)
            self._current = action

    def push(self) -> QueryActionBuilder:
        """Push current context onto stack (for nested operations)."""
        self._stack.append(self._current)
        return self

    def pop(self) -> QueryActionBuilder:
        """Pop context from stack."""
        if self._stack:
            self._current = self._stack.pop()
        return self

    def build(self) -> QueryAction:
        """Build and return the QueryAction tree."""
        if self._root is None:
            raise ValueError("Cannot build empty QueryAction tree")
        return self._root

    def add_raw_action(self, action: QueryAction) -> QueryActionBuilder:
        """Add a raw QueryAction directly to the tree."""
        self._add_action(action)
        return self

    def reset(self) -> QueryActionBuilder:
        """Reset builder for reuse."""
        self._root = None
        self._current = None
        self._stack = []
        return self
# ============================================================================
# HELPER FUNCTIONS
# ============================================================================


def build_select(fields: list[str], table: str, where: Optional[dict | str] = None,
                 group_by: Optional[list[str]] = None, order_by: Optional[list[str]] = None,
                 limit: Optional[int] = None) -> QueryAction:
    """
    Quick helper to build SELECT QueryAction.
    Example:
        action = build_select(
            fields=['name', 'age'],
            table='users',
            where={'age': {'$gt': 25}},
            group_by=['department'],
            limit=10
        )
    """
    builder = QueryActionBuilder().select(fields=fields, table=table)
    if where:
        builder.where(where)
    if group_by:
        builder.group_by(group_by)
    if order_by:
        builder.order_by(order_by)
    if limit:
        builder.limit(limit)
    return builder.build()


def build_match(pattern: dict | str, where: Optional[dict | str] = None,
                return_fields: Optional[list[str]] = None) -> QueryAction:
    """
    Quick helper to build MATCH QueryAction (Cypher/graph).
    Example:
        action = build_match(
            pattern={'label': 'User', 'relationship': 'KNOWS'},
            where={'age': {'$gt': 25}},
            return_fields=['name', 'age']
        )
    """
    builder = QueryActionBuilder().match(pattern)
    if where:
        builder.where(where)
    if return_fields:
        builder.project(return_fields)
    return builder.build()
__all__ = [
    'QueryActionBuilder',
    'build_select',
    'build_match',
]
