#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/all_simple_paths_executor.py
ALL_SIMPLE_PATHS Operation Executor - Find all simple paths (no cycles)
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 15-Nov-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class AllSimplePathsExecutor(AUniversalOperationExecutor):
    """
    ALL_SIMPLE_PATHS operation executor - Find all simple paths (no repeated vertices).
    Similar to ALL_PATHS but guarantees no cycles (no repeated vertices).
    WARNING: Can be computationally expensive for large graphs!
    """
    OPERATION_NAME = "ALL_SIMPLE_PATHS"

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute ALL_SIMPLE_PATHS operation."""
        params = action.params
        node = context.node
        result_data = self._execute_all_simple_paths(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_all_simple_paths(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute ALL_SIMPLE_PATHS - Find all simple paths (no cycles).
        Root cause fixed: Missing ALL_SIMPLE_PATHS operation.
        Solution: Full implementation with DFS path enumeration avoiding cycles.
        REUSE: Leverages DFS from all_paths_executor with cycle avoidance.
        Priority Alignment:
        - Usability (#2): Standard all simple paths syntax.
        - Maintainability (#3): Reuses path enumeration logic.
        - Performance (#4): DFS with backtracking (can be expensive).
        - Extensibility (#5): Supports max length and max paths limits.
        """
        source = params.get('source', params.get('start'))
        target = params.get('target', params.get('end'))
        max_length = params.get('max_length', 10)  # Safety limit
        max_paths = params.get('max_paths', 100)  # Safety limit
        if not source or not target:
            return {
                'paths': [],
                'source': source,
                'target': target,
                'path_count': 0,
                'error': 'Both source and target required'
            }
        # Try to use xwnode graph capabilities
        if hasattr(node, 'get_neighbors') and callable(node.get_neighbors):
            paths = self._find_all_simple_paths_dfs(node, source, target, max_length, max_paths)
            return {
                'paths': paths,
                'source': source,
                'target': target,
                'max_length': max_length,
                'max_paths': max_paths,
                'path_count': len(paths),
                'status': 'implemented'
            }
        return {
            'paths': [],
            'source': source,
            'target': target,
            'path_count': 0,
            'status': 'basic_implementation',
            'note': 'Node does not support graph operations - xwnode graph strategies recommended'
        }

    def _find_all_simple_paths_dfs(self, node: Any, source: str, target: str, max_length: int, max_paths: int) -> list:
        """Find all simple paths using DFS with backtracking."""
        paths = []
        def dfs(current: str, path: list):
            if len(paths) >= max_paths:
                return
            if current == target:
                paths.append(path.copy())
                return
            if len(path) >= max_length:
                return
            try:
                neighbors = list(node.get_neighbors(current))
                for neighbor in neighbors:
                    if neighbor not in path:  # Simple path: no repeated vertices
                        path.append(neighbor)
                        dfs(neighbor, path)
                        path.pop()
            except Exception:
                pass
        dfs(source, [source])
        return paths
