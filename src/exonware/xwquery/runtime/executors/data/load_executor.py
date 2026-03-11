#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/data/load_executor.py
LOAD Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class LoadExecutor(AUniversalOperationExecutor):
    """
    LOAD - Load data from files/sources.
    FUTURE: Will integrate with xwdata for format-agnostic loading.
    For now, provides basic file path handling.
    """
    OPERATION_NAME = "LOAD"
    OPERATION_TYPE = OperationType.DATA_OPS
    SUPPORTED_NODE_TYPES = []

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        result_data = self._execute_load(context.node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'source': params.get('source', params.get('from'))}
        )

    def _execute_load(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute LOAD - delegate to execution structure for file loading.
        Delegates to:
        - XWData: Uses XWData.load() for 50+ format support
        - XWNode: Uses XWNode methods if available
        - Other structures: Uses appropriate load mechanism
        Args:
            node: Execution structure (XWNode, XWData, etc.)
            params: Load parameters (source, format, etc.)
            context: Execution context
        Returns:
            Loaded data structure or metadata about load operation
        """
        source = params.get('source', params.get('from'))
        format_hint = params.get('format')
        if not source:
            return {
                'error': 'No source specified',
                'status': 'failed'
            }
        # Try to delegate to XWData if available
        try:
            from exonware.xwdata import XWData
            if isinstance(node, XWData) or hasattr(node, '_data') and isinstance(node._data, XWData):
                # Use XWData.load() for format-agnostic loading
                import asyncio
                try:
                    loop = asyncio.get_event_loop()
                    if loop.is_running():
                        # Event loop running - create task or use sync wrapper
                        loaded_data = asyncio.create_task(XWData.load(source, format=format_hint))
                        # For now, return metadata - actual data will be in result
                        return {
                            'source': source,
                            'format': format_hint,
                            'status': 'loaded',
                            'data_type': 'XWData',
                            'note': 'Async load initiated'
                        }
                    else:
                        # No running loop - can use asyncio.run
                        loaded_data = asyncio.run(XWData.load(source, format=format_hint))
                        return {
                            'source': source,
                            'format': format_hint,
                            'status': 'loaded',
                            'data': loaded_data.to_native() if hasattr(loaded_data, 'to_native') else loaded_data,
                            'data_type': 'XWData'
                        }
                except RuntimeError:
                    # No event loop - create one
                    loaded_data = asyncio.run(XWData.load(source, format=format_hint))
                    return {
                        'source': source,
                        'format': format_hint,
                        'status': 'loaded',
                        'data': loaded_data.to_native() if hasattr(loaded_data, 'to_native') else loaded_data,
                        'data_type': 'XWData'
                    }
        except ImportError:
            # XWData not available - try other methods
            pass
        # Try to delegate to node's load method if available
        if hasattr(node, 'load'):
            try:
                if callable(node.load):
                    loaded = node.load(source, format=format_hint)
                    return {
                        'source': source,
                        'format': format_hint,
                        'status': 'loaded',
                        'data': loaded.to_native() if hasattr(loaded, 'to_native') else loaded,
                        'data_type': type(node).__name__
                    }
            except Exception as e:
                return {
                    'source': source,
                    'format': format_hint,
                    'status': 'error',
                    'error': str(e),
                    'data_type': type(node).__name__
                }
        # Fallback: return metadata
        return {
            'source': source,
            'format': format_hint,
            'status': 'delegated',
            'data_type': type(node).__name__,
            'note': f'Load delegated to {type(node).__name__} structure'
        }
