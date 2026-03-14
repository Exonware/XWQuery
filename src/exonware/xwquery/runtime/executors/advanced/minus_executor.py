#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/executors/advanced/minus_executor.py
MINUS Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: 15-Nov-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class MinusExecutor(AUniversalOperationExecutor):
    """
    MINUS operation executor.
    Set difference operation (SPARQL MINUS, SQL EXCEPT)
    Capability: Universal
    Operation Type: JOINING
    """
    OPERATION_NAME = "MINUS"
    OPERATION_TYPE = OperationType.JOINING
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute MINUS operation."""
        params = action.params
        node = context.node
        result_data = self._execute_minus(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_minus(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute MINUS - Set difference operation.
        Root cause fixed: Missing MINUS operation implementation.
        Solution: Full implementation with set difference computation.
        REUSE: Leverages extract_items utility for data extraction.
        Priority Alignment:
        - Usability (#2): Standard set difference syntax (SPARQL MINUS, SQL EXCEPT).
        - Maintainability (#3): Reuses extract_items utility.
        - Performance (#4): Efficient set difference with hash-based lookup.
        - Extensibility (#5): Supports multiple sources for subtraction.
        Args:
            node: Primary data source (items to subtract from)
            params: MINUS parameters (subtract, sources)
            context: Execution context
        Returns:
            dict with difference results and metadata
        """
        from ..utils import extract_items
        subtract = params.get('subtract', params.get('minus', params.get('except')))
        sources = params.get('sources', [])
        match_on = params.get('on', params.get('match_by'))  # Key(s) for matching (e.g. 'id' or ['id'])
        # Extract items from primary source
        primary_items = extract_items(node)
        original_count = len(primary_items)
        # Collect items to subtract
        items_to_subtract = []
        if subtract:
            items_to_subtract.extend(extract_items(subtract))
        for source in sources:
            items_to_subtract.extend(extract_items(source))
        # Build subtract set - full match or key-based match
        if match_on and items_to_subtract:
            # Key-based: match by specified field(s) only
            keys = [match_on] if isinstance(match_on, str) else list(match_on)
            subtract_set = set()
            for item in items_to_subtract:
                if isinstance(item, dict):
                    key_vals = tuple(item.get(k) for k in keys)
                    subtract_set.add(key_vals)
                else:
                    subtract_set.add(item)
            def get_item_key(it):
                if isinstance(it, dict) and keys:
                    return tuple(it.get(k) for k in keys)
                return it
            result_items = [item for item in primary_items if get_item_key(item) not in subtract_set]
        else:
            # Full dict equality (original behavior)
            subtract_set = set()
            for item in items_to_subtract:
                try:
                    if isinstance(item, dict):
                        subtract_set.add(frozenset(item.items()))
                    elif isinstance(item, (str, int, float, bool, type(None))):
                        subtract_set.add(item)
                    else:
                        subtract_set.add(str(item))
                except (TypeError, ValueError):
                    subtract_set.add(str(item))
            result_items = []
            for item in primary_items:
                try:
                    item_key = frozenset(item.items()) if isinstance(item, dict) else (item if isinstance(item, (str, int, float, bool, type(None))) else str(item))
                    if item_key not in subtract_set:
                        result_items.append(item)
                except (TypeError, ValueError):
                    if str(item) not in subtract_set:
                        result_items.append(item)
        return {
            'items': result_items,
            'count': len(result_items),
            'original_count': original_count,
            'subtracted_count': original_count - len(result_items),
            'subtract_sources_count': len(sources) + (1 if subtract else 0),
            'status': 'implemented'
        }
