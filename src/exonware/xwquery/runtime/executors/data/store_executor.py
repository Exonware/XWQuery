#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/data/store_executor.py
STORE Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class StoreExecutor(AUniversalOperationExecutor):
    """
    STORE operation executor.
    Stores data to external destinations
    Capability: Universal
    Operation Type: DATA_OPS
    """
    OPERATION_NAME = "STORE"
    OPERATION_TYPE = OperationType.DATA_OPS
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute STORE operation."""
        params = action.params
        node = context.node
        result_data = self._execute_store(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_store(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute STORE - delegate to execution structure for file saving.
        Delegates to:
        - XWData: Uses XWData.save() for 50+ format support
        - XWNode: Uses XWNode methods if available
        - Other structures: Uses appropriate save mechanism
        Args:
            node: Execution structure (XWNode, XWData, etc.)
            params: Store parameters (target, format, etc.)
            context: Execution context
        Returns:
            Save result or metadata about store operation
        """
        target = params.get('target', params.get('to'))
        format_hint = params.get('format')
        if not target:
            return {
                'error': 'No target specified',
                'status': 'failed'
            }
        # Try to delegate to XWData if available
        try:
            from exonware.xwdata import XWData
            if isinstance(node, XWData) or hasattr(node, '_data') and isinstance(node._data, XWData):
                # Use XWData.save() for format-agnostic saving
                import asyncio
                try:
                    loop = asyncio.get_event_loop()
                    if loop.is_running():
                        # Event loop running - create task
                        save_task = asyncio.create_task(node.save(target, format=format_hint))
                        return {
                            'target': target,
                            'format': format_hint,
                            'status': 'saving',
                            'data_type': 'XWData',
                            'note': 'Async save initiated'
                        }
                    else:
                        # No running loop - can use asyncio.run
                        asyncio.run(node.save(target, format=format_hint))
                        return {
                            'target': target,
                            'format': format_hint,
                            'status': 'saved',
                            'data_type': 'XWData'
                        }
                except RuntimeError:
                    # No event loop - create one
                    asyncio.run(node.save(target, format=format_hint))
                    return {
                        'target': target,
                        'format': format_hint,
                        'status': 'saved',
                        'data_type': 'XWData'
                    }
        except ImportError:
            # XWData not available - try other methods
            pass
        # Try to delegate to node's save method if available
        if hasattr(node, 'save'):
            try:
                if callable(node.save):
                    # Check if async
                    import inspect
                    if inspect.iscoroutinefunction(node.save):
                        import asyncio
                        try:
                            loop = asyncio.get_event_loop()
                            if loop.is_running():
                                asyncio.create_task(node.save(target, format=format_hint))
                                return {
                                    'target': target,
                                    'format': format_hint,
                                    'status': 'saving',
                                    'data_type': type(node).__name__
                                }
                            else:
                                asyncio.run(node.save(target, format=format_hint))
                                return {
                                    'target': target,
                                    'format': format_hint,
                                    'status': 'saved',
                                    'data_type': type(node).__name__
                                }
                        except RuntimeError:
                            asyncio.run(node.save(target, format=format_hint))
                            return {
                                'target': target,
                                'format': format_hint,
                                'status': 'saved',
                                'data_type': type(node).__name__
                            }
                    else:
                        # Sync save
                        node.save(target, format=format_hint)
                        return {
                            'target': target,
                            'format': format_hint,
                            'status': 'saved',
                            'data_type': type(node).__name__
                        }
            except Exception as e:
                return {
                    'target': target,
                    'format': format_hint,
                    'status': 'error',
                    'error': str(e),
                    'data_type': type(node).__name__
                }
        # Fallback: return metadata
        return {
            'target': target,
            'format': format_hint,
            'status': 'delegated',
            'data_type': type(node).__name__,
            'note': f'Store delegated to {type(node).__name__} structure'
        }
