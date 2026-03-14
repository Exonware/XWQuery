#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/construct_executor.py
CONSTRUCT Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class ConstructExecutor(AUniversalOperationExecutor):
    """
    CONSTRUCT operation executor.
    Constructs new data structures
    Capability: Universal
    Operation Type: ADVANCED
    """
    OPERATION_NAME = "CONSTRUCT"
    OPERATION_TYPE = OperationType.ADVANCED
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute CONSTRUCT operation."""
        params = action.params
        node = context.node
        result_data = self._execute_construct(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_construct(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute CONSTRUCT - SPARQL graph construction.
        Root cause fixed: Basic stub with no graph construction.
        Solution: Full implementation with template-based graph construction.
        REUSE: Leverages WHERE executor for pattern matching and ExecutionEngine for sub-queries.
        Priority Alignment:
        - Usability (#2): Standard SPARQL CONSTRUCT syntax.
        - Maintainability (#3): Reuses WHERE executor for pattern matching.
        - Performance (#4): Efficient graph construction.
        - Extensibility (#5): Supports complex graph templates.
        """
        from ..filtering import WhereExecutor
        from ..engine import NativeOperationsExecutionEngine
        from ....contracts import QueryAction
        from ..utils import extract_items
        template = params.get('template', params.get('construct'))
        where = params.get('where')
        where_action = params.get('where_action')  # QueryAction for WHERE clause
        if not template:
            raise ValueError("CONSTRUCT operation requires a 'template' parameter.")
        # Execute WHERE clause to get matching data
        matching_data = []
        if where_action:
            # Execute WHERE QueryAction
            engine = getattr(context, 'engine', None)
            if engine is None:
                engine = NativeOperationsExecutionEngine()
            if isinstance(where_action, dict):
                where_action = QueryAction(**where_action)
            where_result = engine.execute_tree(where_action, context)
            if where_result.success:
                matching_data = extract_items(where_result.data)
        elif where:
            # Use WHERE executor
            where_executor = WhereExecutor()
            where_query_action = QueryAction(type='WHERE', params={'where': where})
            where_result = where_executor.execute(where_query_action, context)
            if where_result.success:
                matching_data = extract_items(where_result.data)
        else:
            # No WHERE clause, use current node
            matching_data = extract_items(node)
        # Construct graph from template
        constructed_graph = []
        for item in matching_data:
            # Apply template to each matching item
            if isinstance(template, dict):
                # Template is a dict mapping variables to properties
                constructed_item = {}
                for var, prop in template.items():
                    # Resolve variable from item
                    if isinstance(item, dict):
                        constructed_item[prop] = item.get(var, item.get(prop))
                    else:
                        constructed_item[prop] = getattr(item, var, None)
                constructed_graph.append(constructed_item)
            elif isinstance(template, list):
                # Template is a list of triples/edges
                for triple_template in template:
                    if isinstance(triple_template, dict):
                        subject = self._resolve_template_var(triple_template.get('subject'), item)
                        predicate = self._resolve_template_var(triple_template.get('predicate'), item)
                        object_val = self._resolve_template_var(triple_template.get('object'), item)
                        constructed_graph.append({
                            'subject': subject,
                            'predicate': predicate,
                            'object': object_val
                        })
            else:
                # Simple template - use as-is
                constructed_graph.append(item)
        return {
            'template': template,
            'where': where,
            'constructed_graph': constructed_graph,
            'triple_count': len(constructed_graph),
            'status': 'implemented'
        }

    def _resolve_template_var(self, var: Any, item: Any) -> Any:
        """Resolve template variable from item."""
        if var is None:
            return None
        if isinstance(var, str) and var.startswith('?'):
            # Variable reference
            var_name = var[1:]
            if isinstance(item, dict):
                return item.get(var_name)
            return getattr(item, var_name, None)
        return var
