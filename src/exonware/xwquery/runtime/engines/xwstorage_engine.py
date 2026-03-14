#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/runtime/engines/xwstorage_engine.py
XWStorage Operations Execution Engine
Extends AOperationsExecutionEngine to handle database execution.
Delegates to xwstorage's SqlOperationsExecutionEngine when available.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: January 20, 2026
"""

from __future__ import annotations
from typing import Any, TYPE_CHECKING
from ...contracts import QueryAction, ExecutionContext, ExecutionResult
from ..base import AOperationsExecutionEngine
from ..executors.registry import get_operation_registry, OperationRegistry
# Avoid circular import - only import xwstorage types for type checking
if TYPE_CHECKING:
    # Try to import xwstorage components for type hints only
    try:
        from exonware.xwstorage import SqlOperationsExecutionEngine  # noqa: F401
    except ImportError:
        pass


class XWStorageOperationsExecutionEngine(AOperationsExecutionEngine):
    """
    XWStorage operations execution engine.
    Extends AOperationsExecutionEngine to handle database execution.
    Delegates to xwstorage's SqlOperationsExecutionEngine when available.
    Flow:
    1. Receives QueryAction AST from XWQuery.execute()
    2. Uses execute_tree() (inherited from base)
    3. Delegates to xwstorage engine OR uses executors from runtime/executors/
    """

    def __init__(self, storage_connection: Any, registry: OperationRegistry | None = None):
        """
        Initialize XWStorage operations execution engine.
        Args:
            storage_connection: Database connection or xwstorage engine
            registry: Operation registry (uses global if not provided)
        """
        super().__init__()
        self._storage = storage_connection
        self._registry = registry or get_operation_registry()
        self._storage_engine: Any | None = None
        self._capabilities: Any | None = None  # Cached capabilities
        # Try to initialize xwstorage engine if available
        self._init_storage_engine()
        # Load capabilities from XWStorage
        self._load_capabilities()

    def _init_storage_engine(self) -> None:
        """Initialize xwstorage engine if available."""
        try:
            # Lazy import to avoid circular dependencies
            from exonware.xwstorage import SqlOperationsExecutionEngine
            # Check if storage_connection is already an engine
            if hasattr(self._storage, 'execute_tree'):
                self._storage_engine = self._storage
            else:
                # Create engine from connection
                self._storage_engine = SqlOperationsExecutionEngine(self._storage)
        except ImportError:
            # xwstorage not available - use executors directly
            self._storage_engine = None

    def _load_capabilities(self) -> None:
        """
        Load connector capabilities from XWStorage.
        Uses XWStorage capability provider to get connector capabilities
        for execution path selection (native optimized vs XWJSON generic).
        """
        try:
            from exonware.xwstorage import get_connection_capabilities
            self._capabilities = get_connection_capabilities(self._storage)
        except ImportError:
            # XWStorage not available
            self._capabilities = None
        except Exception:
            # Connection doesn't support capabilities
            self._capabilities = None

    def _should_use_native_execution(self, action: QueryAction) -> bool:
        """
        Determine if native optimized execution should be used.
        Uses XWStorage capabilities to decide between:
        - Native optimized path (Tier-1 with pushdown)
        - XWJSON generic path (Tier-2)
        Args:
            action: Query action to execute
        Returns:
            True if native execution should be used
        """
        if self._capabilities is None:
            return False
        # Check if connector is Tier-1 optimized
        if not self._capabilities.is_optimized():
            return False
        # Check if action can benefit from pushdown
        action_type = action.type.lower()
        if action_type in ['filter', 'where', 'select']:
            return self._capabilities.supports_query_pushdown
        # For other operations, use native if supported
        return self._capabilities.supports_native_queries

    def _execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult]
    ) -> ExecutionResult:
        """
        Execute operation on database.
        **Capability-Driven Execution:**
        Uses XWStorage capabilities to choose execution path:
        - Native optimized: If connector supports pushdown/native queries (Tier-1)
        - XWJSON generic: If connector is Tier-2 or doesn't support optimization
        Can delegate to xwstorage engine OR use executors from runtime/executors/.
        Args:
            action: QueryAction to execute
            context: Execution context (context.node is database connection)
            child_results: Results from child actions
        Returns:
            Execution result
        """
        # Determine execution path based on capabilities
        use_native = self._should_use_native_execution(action)
        # If xwstorage engine is available and native execution is preferred, delegate to it
        if self._storage_engine is not None and use_native:
            # Delegate to xwstorage engine
            # Update context to use storage connection
            storage_context = ExecutionContext(
                node=self._storage,
                variables=context.variables,
                options=context.options,
                parent_context=context.parent_context,
                metadata=context.metadata.copy(),
                engine_type="xwstorage"
            )
            # Add child results
            if child_results:
                storage_context.metadata['child_results'] = child_results
                storage_context.metadata['has_children'] = True
            else:
                storage_context.metadata['has_children'] = False
            # Execute via storage engine (native optimized path)
            # Add capability metadata to context
            storage_context.metadata['execution_path'] = 'native_optimized'
            storage_context.metadata['capabilities'] = {
                'tier': self._capabilities.tier.value if self._capabilities else 'tier_2',
                'pushdown': self._capabilities.supports_query_pushdown if self._capabilities else False,
                'streaming': self._capabilities.supports_streaming if self._capabilities else False
            }
            return self._storage_engine.execute_tree(
                QueryAction(action.type, action.params, children=action.children),
                storage_context
            )
        # Fallback: Use executors from runtime/executors/ (XWJSON generic path)
        # This path is used when:
        # - XWStorage engine not available
        # - Connector is Tier-2 (generic XWJSON)
        # - Capabilities don't support native execution for this operation
        # Get executor for this operation type
        executor = self._registry.get(action.type)
        if not executor:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"No executor registered for operation: {action.type}",
                action_type=action.type
            )
        # Add child results to context
        if child_results:
            context.metadata['child_results'] = child_results
            context.metadata['has_children'] = True
        else:
            context.metadata['has_children'] = False
        # Set engine type in context
        context.engine_type = "xwstorage"
        # Add execution path metadata (XWJSON generic path)
        context.metadata['execution_path'] = 'xwjson_generic'
        if self._capabilities:
            context.metadata['capabilities'] = {
                'tier': self._capabilities.tier.value,
                'pushdown': self._capabilities.supports_query_pushdown,
                'streaming': self._capabilities.supports_streaming
            }
        # Execute using executor from runtime/executors/
        # Executor should handle database connection (context.node is connection)
        # This uses XWJSON generic execution path
        try:
            result = executor.execute(action, context)
            self._record_execution(action.type, result)
            return result
        except Exception as e:
            return ExecutionResult(
                success=False,
                data=None,
                error=str(e),
                action_type=action.type
            )

    def list_supported_operations(self) -> list[str]:
        """
        Get list of all supported operations.
        Returns:
            List of operation names supported by this engine
        """
        if self._storage_engine is not None:
            return self._storage_engine.list_supported_operations()
        return self._registry.list_operations()

    def can_execute(self, operation_name: str) -> bool:
        """
        Check if this engine can execute a specific operation.
        Args:
            operation_name: Name of the operation to check
        Returns:
            True if operation is supported, False otherwise
        """
        if self._storage_engine is not None:
            return self._storage_engine.can_execute(operation_name)
        return self._registry.has(operation_name)
