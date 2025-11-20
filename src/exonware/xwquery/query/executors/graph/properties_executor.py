#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/properties_executor.py

PROPERTIES Operation Executor - Get all properties

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class PropertiesExecutor(AUniversalOperationExecutor):
    """
    PROPERTIES operation executor - Get all properties from node/edge.
    
    Gremlin: g.V().properties()
    Cypher: MATCH (n) RETURN properties(n)
    
    Reuses xwnode property management.
    """
    
    OPERATION_NAME = "PROPERTIES"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute PROPERTIES operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_properties(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_properties(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute PROPERTIES - Get all properties.
        
        FUTURE: Will use xwnode property management.
        """
        property_keys = params.get('keys')  # If None, get all properties
        include_system = params.get('include_system', False)
        
        properties = {}
        
        # FUTURE: Use xwnode's property methods
        # if hasattr(node, 'get_properties'):
        #     properties = node.get_properties(keys=property_keys, include_system=include_system)
        # elif isinstance(node, dict):
        #     if property_keys:
        #         properties = {k: node.get(k) for k in property_keys if k in node}
        #     else:
        #         properties = node.copy()
        
        return {
            'properties': properties,
            'property_keys': property_keys,
            'count': len(properties),
            'include_system': include_system,
            'status': 'basic_implementation',
            'note': 'Will use xwnode property management for production'
        }


__all__ = ['PropertiesExecutor']

