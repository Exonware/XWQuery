"""
Runtime base classes for xwquery.
This module contains ONLY execution / runtime abstractions that are
responsible for:
- Executing QueryAction trees
- Implementing operation executors
- Managing execution history and metrics
Compilation / parsing concerns live in `exonware.xwquery.compiler.base`.
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Optional
from ..contracts import (
    IOperationExecutor,
    IOperationsExecutionEngine,
    QueryAction,
    ExecutionContext,
    ExecutionResult,
)
from ..defs import OperationCapability
from ..errors import UnsupportedOperationError, XWQueryValueError


class AOperationExecutor(IOperationExecutor):
    """
    Abstract base class for operation executors.
    Provides common functionality including:
    - Capability checking
    - Performance monitoring
    - Error handling
    - Validation
    """
    # Operation name (must be set by subclasses)
    OPERATION_NAME: str = "UNKNOWN"
    # Supported node types (empty = all types)
    SUPPORTED_NODE_TYPES: list[Any] = []
    # Required capabilities
    REQUIRED_CAPABILITIES: OperationCapability = OperationCapability.NONE

    def __init__(self) -> None:
        """Initialize operation executor."""
        self._execution_count = 0
        self._total_time = 0.0
        self._error_count = 0

    def execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute operation with monitoring and error handling.
        This method implements the Template Method pattern:
        1. Validate
        2. Check capability
        3. Execute (delegated to subclass)
        4. Monitor performance
        """
        import time
        start_time = time.time()
        try:
            # Validate action
            if not self.validate(action, context):
                raise XWQueryValueError(f"Invalid action: {action.type}")
            # Check capability
            self.validate_capability_or_raise(context)
            # Execute (delegated to subclass)
            result = self._do_execute(action, context)
            # Update metrics
            execution_time = time.time() - start_time
            self._execution_count += 1
            self._total_time += execution_time
            result.execution_time = execution_time
            return result
        except Exception as e:  # noqa: BLE001 - base class intentionally broad
            self._error_count += 1
            execution_time = time.time() - start_time
            return ExecutionResult(
                data=None,
                success=False,
                error=str(e),
                execution_time=execution_time,
            )
    @abstractmethod

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute the actual operation (implemented by subclasses).
        Args:
            action: The action to execute
            context: Execution context
        Returns:
            ExecutionResult with data
        """
        raise NotImplementedError

    def validate(self, action: QueryAction, context: ExecutionContext) -> bool:
        """
        Validate action before execution.
        Default implementation checks basic requirements.
        Subclasses can override for specific validation.
        """
        if action is None or not action.type:
            return False
        if context is None or context.node is None:
            return False
        return True

    def validate_capability_or_raise(self, context: ExecutionContext) -> None:
        """
        Validate operation can execute on node, raise if not.
        Args:
            context: Execution context
        Raises:
            UnsupportedOperationError: If operation cannot execute on node type
        """
        # Get node's strategy type if available
        node_type: Optional[str] = None
        if hasattr(context.node, "_strategy") and hasattr(context.node._strategy, "STRATEGY_TYPE"):
            node_type = context.node._strategy.STRATEGY_TYPE  # type: ignore[assignment]
        elif hasattr(context.node, "STRATEGY_TYPE"):
            node_type = context.node.STRATEGY_TYPE  # type: ignore[assignment]
        # Check if operation can execute on this node type
        if node_type and self.SUPPORTED_NODE_TYPES:
            if not self.can_execute_on(node_type):
                supported = [str(nt) for nt in self.SUPPORTED_NODE_TYPES]
                raise UnsupportedOperationError(
                    f"Operation '{self.OPERATION_NAME}' not supported on node type",
                    operation=self.OPERATION_NAME,
                    node_type=str(node_type),
                    required_capability=f"Requires one of: {supported}",
                )

    def get_stats(self) -> dict[str, Any]:
        """Get execution statistics for this executor."""
        avg_time = self._total_time / self._execution_count if self._execution_count > 0 else 0
        return {
            "operation": self.OPERATION_NAME,
            "execution_count": self._execution_count,
            "total_time": self._total_time,
            "average_time": avg_time,
            "error_count": self._error_count,
            "success_rate": (
                (self._execution_count - self._error_count) / self._execution_count
                if self._execution_count > 0
                else 1.0
            ),
        }


class AOperationsExecutionEngine(IOperationsExecutionEngine, ABC):
    """
    Abstract base class for operations execution engines.
    Provides common functionality for all execution engines including:
    - Tree traversal logic (depth-first execution)
    - Root/Program node handling (pipeline execution)
    - Error handling and validation
    - Child result management
    Subclasses must implement:
    - `_execute_operation()`: Backend-specific operation execution
    - `list_supported_operations()`: Return list of supported operations
    - `can_execute()`: Check if operation is supported
    This allows different backends (xwnode, xwdata, xwstorage/sql) to
    provide their own execution implementations while reusing common tree
    traversal and error handling logic.
    """

    def __init__(self) -> None:
        """Initialize operations execution engine."""
        self._execution_history: list[dict[str, Any]] = []

    def execute_tree(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute a QueryAction tree.
        Common implementation that handles tree traversal and delegates
        operation execution to subclass via `_execute_operation()`.
        Args:
            action: QueryAction tree (which IS an ANode)
            context: Execution context
        Returns:
            Execution result
        """
        # Handle structural nodes (ROOT, PROGRAM) - these are containers, not operations
        if action.type in ("ROOT", "PROGRAM"):
            return self._execute_root(action, context)
        # Execute single action with its children
        return self._execute_action_tree(action, context)

    def execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: Optional[list[ExecutionResult]] = None,
    ) -> ExecutionResult:
        """
        Execute a single operation.
        Convenience method that delegates to `_execute_operation` with child_results
        if provided, otherwise calls `_execute_action_tree` to execute the tree.
        Args:
            action: QueryAction to execute
            context: Execution context
            child_results: Optional results from child actions (if None, will be collected)
        Returns:
            Execution result
        """
        if child_results is not None:
            # Use provided child results - execute directly
            return self._execute_operation(action, context, child_results)
        # Execute action tree (will collect child results automatically)
        return self._execute_action_tree(action, context)
    # ========================================================================
    # OPERATION METHODS - Direct, high-performance access to all operations
    # ========================================================================
    # CORE Operations (6)

    def select(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def insert(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def update(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def delete(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def create(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def drop(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # FILTERING Operations (10)

    def where(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def filter(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def like(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def in_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def has(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def between(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def range(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def term(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def optional(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def values(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # AGGREGATION Operations (9)

    def count(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def sum(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def avg(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def min(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def max(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def distinct(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def group(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def having(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def summarize(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # PROJECTION Operations (2)

    def project(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def extend(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # ORDERING Operations (3)

    def order(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def by(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def limit(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # GRAPH Operations (31 total - 5 registered + 26 additional)

    def match(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def out(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def in_traverse(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def return_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # Additional Graph Operations (26)

    def shortest_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def all_shortest_paths(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def simple_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def all_simple_paths(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def all_paths(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def cycle_detection(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def traversal(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def connected_components(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def expand(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def neighbors(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def degree(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def clone(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def subgraph(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def variable_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def path_length(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def extract_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def properties(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def set(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def create_edge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def delete_edge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def update_edge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def detach_delete(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def both(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def both_e(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def both_v(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def in_e(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def in_v(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def out_e(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def out_v(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # DATA Operations (4)

    def load(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def store(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def merge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def alter(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # ARRAY Operations (2)

    def slicing(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def indexing(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)
    # ADVANCED Operations

    def join(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def include(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def union(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def with_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def aggregate(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def foreach(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def let(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def for_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def window(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def describe(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def construct(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def ask(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def subscribe(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def subscription(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def mutation(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def pipe(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def options(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def minus(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        return self._execute_action_tree(action, context)

    def _execute_root(self, root: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute ROOT with pipeline pattern.
        Each child's output becomes the next child's input.
        Args:
            root: ROOT QueryAction
            context: Execution context
        Returns:
            Execution result from last child
        """
        # Get children using ANode's tree functionality!
        # QueryAction has children property that works with both QueryAction and ANode
        children = root.children if hasattr(root, 'children') else root.get_children() if hasattr(root, 'get_children') else []
        if not children:
            return ExecutionResult(
                success=False,
                data=None,
                error="No actions to execute",
                action_type="ROOT",
            )
        # Pipeline execution
        current_context = context
        results: list[ExecutionResult] = []
        for child in children:
            result = self._execute_action_tree(child, current_context)
            results.append(result)
            if not result.success:
                return result
            # Pipeline: output → input
            if result.data is not None:
                current_context = ExecutionContext(
                    node=result.data,
                    variables=current_context.variables,
                    options=current_context.options,
                    parent_context=current_context,
                    metadata=current_context.metadata.copy(),
                )
        return results[-1]

    def _execute_action_tree(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute QueryAction with depth-first traversal.
        Flow:
        1. Execute children first (depth-first)
        2. Collect child results
        3. Execute current action with child context (delegated to subclass)
        4. Return result
        Args:
            action: QueryAction (which IS an ANode!)
            context: Execution context
        Returns:
            Execution result
        """
        # Get children using ANode's tree structure!
        # QueryAction has children property that works with both QueryAction and ANode
        children = action.children if hasattr(action, 'children') else action.get_children() if hasattr(action, 'get_children') else []
        child_results: list[ExecutionResult] = []
        # Execute children first (depth-first)
        if children:
            for child in children:
                child_result = self._execute_action_tree(child, context)
                child_results.append(child_result)
                # Stop on first error
                if not child_result.success:
                    return child_result
        # Execute current action with child results in context (delegated to subclass)
        return self._execute_operation(action, context, child_results)
    @abstractmethod

    def _execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult],
    ) -> ExecutionResult:
        """
        Execute a single operation (implemented by subclasses).
        This method is called after all children have been executed,
        allowing subclasses to implement backend-specific execution logic.
        Args:
            action: QueryAction to execute
            context: Execution context
            child_results: Results from child actions
        Returns:
            Execution result
        """
        raise NotImplementedError

    def _record_execution(self, operation_type: str, result: ExecutionResult) -> None:
        """Record execution for history."""
        self._execution_history.append(
            {
                "operation_type": operation_type,
                "success": result.success,
            }
        )

    def get_execution_history(self) -> list[dict[str, Any]]:
        """Get execution history."""
        return self._execution_history.copy()

    def clear_history(self) -> None:
        """Clear execution history."""
        self._execution_history.clear()
__all__ = [
    "AOperationExecutor",
    "AOperationsExecutionEngine",
]
