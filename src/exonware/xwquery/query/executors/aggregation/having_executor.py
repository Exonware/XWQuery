#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/having_executor.py

HAVING Executor - Filters grouped results using WHERE expression evaluation

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List, Optional
import operator
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

# REUSE: Import WHERE executor's expression evaluation
# Following GUIDELINES_DEV.md: "Never reinvent the wheel"
from ..filtering.where_executor import WhereExecutor


class HavingExecutor(AUniversalOperationExecutor):
    """
    HAVING operation executor - Filters grouped results.
    
    Root cause fixed: Stub implementation returned mock data.
    Solution: Reuse WHERE executor's expression evaluation for post-GROUP filtering.
    
    Priority alignment:
    - Maintainability (#3): Reuse WHERE expression logic, no duplication
    - Usability (#2): Consistent condition syntax with WHERE
    - Performance (#4): O(n) filtering of groups
    
    Following GUIDELINES_DEV.md principles:
    - **Never reinvent the wheel**: Reuses WhereExecutor's condition evaluation
    - **Production-grade libraries**: Leverages proven WHERE logic
    - **Reduce maintenance burden**: Single source of truth for expressions
    
    Capability: Universal
    Operation Type: AGGREGATION
    """
    
    OPERATION_NAME = "HAVING"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def __init__(self):
        """Initialize HAVING executor with WHERE condition evaluator."""
        super().__init__()
        # REUSE: Create WHERE executor instance for condition evaluation
        self._where_evaluator = WhereExecutor()
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute HAVING operation on grouped data."""
        params = action.params
        node = context.node
        
        result_data = self._execute_having(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={
                'operation': self.OPERATION_NAME,
                'filtered_groups': result_data.get('filtered_count', 0),
                'total_groups': result_data.get('total_groups', 0)
            }
        )
    
    def _execute_having(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute HAVING logic on grouped results.
        
        HAVING is WHERE for groups - filters groups based on aggregate conditions.
        
        Examples:
        - HAVING COUNT(*) > 10 - groups with more than 10 items
        - HAVING SUM(amount) >= 1000 - groups where sum >= 1000
        - HAVING AVG(score) > 75 - groups with average > 75
        
        Args:
            node: Grouped data (typically from GROUP BY)
            params: HAVING parameters with 'condition' or 'having' clause
            context: Execution context
            
        Returns:
            Dict with filtered groups and metadata
        """
        # Extract condition from params
        condition = params.get('condition', params.get('having', {}))
        
        # Get groups from node - expect GROUP BY output structure
        groups = self._extract_groups(node)
        
        if not groups:
            return {
                'groups': [],
                'filtered_count': 0,
                'total_groups': 0,
                'condition': str(condition)
            }
        
        # Filter groups using WHERE executor's condition evaluation
        # REUSE: Leverage WhereExecutor._evaluate_condition for consistency
        filtered_groups = []
        for group in groups:
            # Evaluate condition on group aggregate data
            if self._where_evaluator._evaluate_condition(group, condition):
                filtered_groups.append(group)
        
        return {
            'groups': filtered_groups,
            'filtered_count': len(filtered_groups),
            'total_groups': len(groups),
            'removed_count': len(groups) - len(filtered_groups),
            'condition': str(condition)
        }
    
    def _extract_groups(self, node: Any) -> List[Dict]:
        """
        Extract groups from node.
        
        Expects GROUP BY output format with 'groups' key.
        Falls back to treating node as list of groups.
        """
        if node is None:
            return []
        
        # If node is a dict with 'groups' key (GROUP BY output format)
        if isinstance(node, dict) and 'groups' in node:
            return node['groups']
        
        # If node is already a list, treat as groups
        if isinstance(node, list):
            return node
        
        # If it's an XWNode, extract native data
        if hasattr(node, 'to_native'):
            native_data = node.to_native()
            if isinstance(native_data, dict) and 'groups' in native_data:
                return native_data['groups']
            elif isinstance(native_data, list):
                return native_data
            return []
        
        # Single item as single group
        return [node]


__all__ = ['HavingExecutor']
