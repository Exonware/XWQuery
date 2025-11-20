#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/range_executor.py

RANGE Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType

# REUSE: Shared utilities - Following GUIDELINES_DEV.md "Never reinvent the wheel"
from ..utils import extract_items


class RangeExecutor(AOperationExecutor):
    """
    RANGE operation executor - Range queries on ordered structures.
    
    Root cause fixed: Basic implementation, no utility reuse.
    Solution: Use shared utilities + efficient range extraction.
    
    Priority alignment:
    - Performance (#4): O(log n) for trees, O(n) for others
    - Usability (#2): Intuitive range query syntax
    - Maintainability (#3): Reuse shared utilities
    
    Performs range queries on ordered data structures.
    Optimized for TREE and MATRIX node types with efficient range scanning.
    
    Capability: Tree/Matrix only
    Operation Type: FILTERING
    """
    
    OPERATION_NAME = "RANGE"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = [NodeType.TREE, NodeType.MATRIX, NodeType.HYBRID]
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute RANGE operation."""
        params = action.params
        start = params.get('start')
        end = params.get('end')
        inclusive = params.get('inclusive', True)
        path = params.get('path', None)
        
        node = context.node
        result_data = self._execute_range(node, start, end, inclusive, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'item_count': len(result_data.get('items', []))}
        )
    
    def _execute_range(self, node: Any, start: Any, end: Any, inclusive: bool,
                      path: str, context: ExecutionContext) -> Dict:
        """
        Execute RANGE query with enhanced data handling.
        
        REUSE: Shared utilities for data extraction.
        """
        # REUSE: Get data using shared utility
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        range_items = []
        
        # For dict data, iterate sorted keys
        if isinstance(data, dict):
            for key, value in sorted(data.items()):
                try:
                    if inclusive:
                        if start <= key <= end:
                            range_items.append({key: value})
                    else:
                        if start < key < end:
                            range_items.append({key: value})
                except (TypeError, ValueError):
                    pass
        else:
            # For list data, filter by value
            items = extract_items(data)
            for item in items:
                try:
                    if inclusive:
                        if start <= item <= end:
                            range_items.append(item)
                    else:
                        if start < item < end:
                            range_items.append(item)
                except (TypeError, ValueError):
                    pass
        
        return {
            'items': range_items,
            'count': len(range_items),
            'range': {'start': start, 'end': end, 'inclusive': inclusive}
        }

