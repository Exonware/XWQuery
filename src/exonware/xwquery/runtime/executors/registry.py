#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/registry.py
Operation Executor Registry
This module provides registry for managing operation executors.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: 08-Oct-2025
"""

import threading
from ...contracts import IOperationExecutor
from exonware.xwnode.nodes.strategies.contracts import NodeType
from ...errors import XWQueryValueError


class OperationRegistry:
    """
    Registry for operation executors.
    Manages registration and retrieval of executors for the 50 XWQuery operations.
    Thread-safe implementation with singleton pattern.
    """
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        """Ensure singleton instance."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        """Initialize the registry."""
        if self._initialized:
            return
        self._executors: dict[str, type[IOperationExecutor]] = {}
        self._instances: dict[str, IOperationExecutor] = {}
        self._lock = threading.RLock()
        self._initialized = True

    def register(self, operation_name: str, executor_class: type[IOperationExecutor]) -> None:
        """
        Register an executor for an operation.
        Args:
            operation_name: Name of operation (e.g., "SELECT")
            executor_class: Executor class
        """
        with self._lock:
            self._executors[operation_name.upper()] = executor_class

    def get(self, operation_name: str) -> IOperationExecutor | None:
        """
        Get executor instance for an operation.
        Args:
            operation_name: Name of operation
        Returns:
            Executor instance or None if not found
        """
        operation_name = operation_name.upper()
        with self._lock:
            # Return cached instance if exists
            if operation_name in self._instances:
                return self._instances[operation_name]
            # Create new instance
            if operation_name in self._executors:
                executor_class = self._executors[operation_name]
                instance = executor_class()
                self._instances[operation_name] = instance
                return instance
        return None

    def has(self, operation_name: str) -> bool:
        """
        Check if operation is registered.
        Args:
            operation_name: Name of operation
        Returns:
            True if operation is registered
        """
        return operation_name.upper() in self._executors

    def list_operations(self) -> list[str]:
        """Get list of all registered operations."""
        with self._lock:
            return list(self._executors.keys())

    def list_operations_for_node_type(self, node_type: NodeType) -> list[str]:
        """
        Get list of operations supported by a node type.
        Args:
            node_type: Node type to check
        Returns:
            List of operation names
        """
        operations = []
        with self._lock:
            for op_name, executor_class in self._executors.items():
                # Instantiate temporarily to check
                executor = executor_class()
                if executor.can_execute_on(node_type):
                    operations.append(op_name)
        return operations

    def clear(self) -> None:
        """Clear all registrations (for testing)."""
        with self._lock:
            self._executors.clear()
            self._instances.clear()
# Global registry instance
_global_registry: OperationRegistry | None = None
_global_lock = threading.Lock()


def get_operation_registry() -> OperationRegistry:
    """Get the global operation registry instance."""
    global _global_registry
    if _global_registry is None:
        with _global_lock:
            if _global_registry is None:
                _global_registry = OperationRegistry()
    return _global_registry


def register_operation(operation_name: str):
    """
    Decorator to register an operation executor.
    Usage:
        @register_operation("CUSTOM_OP")
        class CustomOperationExecutor(AOperationExecutor):
            ...
    """
    def decorator(executor_class: type[IOperationExecutor]):
        registry = get_operation_registry()
        registry.register(operation_name, executor_class)
        return executor_class
    return decorator
__all__ = [
    'OperationRegistry',
    'get_operation_registry',
    'register_operation',
    'UnsupportedOperationError',
]
