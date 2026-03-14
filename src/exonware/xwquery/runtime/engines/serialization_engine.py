#!/usr/bin/env python3
"""
Serialization Operations Execution Engine
Extends AOperationsExecutionEngine to handle file-based data sources using ISerialization.
Works with any format implementing ISerialization: JSON, BSON, NDJSON, XWJSON, etc.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: 2025-01-20
"""

from __future__ import annotations
import threading
from pathlib import Path
from typing import Any, TYPE_CHECKING
from ...contracts import QueryAction, ExecutionContext, ExecutionResult
from ..base import AOperationsExecutionEngine
from ..executors.registry import get_operation_registry, OperationRegistry
from ...errors import XWQueryValueError
if TYPE_CHECKING:
    from exonware.xwsystem.io.serialization.contracts import ISerialization
else:
    # Runtime type stub
    ISerialization = Any


class SerializationOperationsExecutionEngine(AOperationsExecutionEngine):
    """
    Serialization operations execution engine.
    Extends AOperationsExecutionEngine to handle file-based data sources
    using ISerialization implementations (JSON, BSON, NDJSON, XWJSON, etc.).
    Flow:
    1. Detects serialization format from file extension or content
    2. Uses appropriate ISerialization implementation for LOAD/STORE operations
    3. Delegates other operations to native engine after deserialization
    Supported formats (via ISerialization):
    - JSON (json)
    - BSON (bson)
    - NDJSON / JSON Lines (jsonl, ndjson)
    - XWJSON (xwjson)
    - And any other format implementing ISerialization
    """
    _instance: 'SerializationOperationsExecutionEngine' | None = None
    _lock = threading.Lock()

    def __new__(cls, registry: OperationRegistry | None = None):
        """
        Singleton pattern for SerializationOperationsExecutionEngine.
        Reuses the same engine instance to avoid recreating serializers.
        """
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._initialized = False
                    cls._instance = instance
        return cls._instance

    def __init__(self, registry: OperationRegistry | None = None):
        """
        Initialize serialization operations execution engine.
        Args:
            registry: Operation registry (uses global if not provided)
        """
        # Only initialize once (singleton pattern)
        if hasattr(self, '_initialized') and self._initialized:
            return
        super().__init__()
        self._registry = registry or get_operation_registry()
        self._serializer_cache: dict[str, Any] = {}
        self._initialized = True

    def _get_serializer(self, format_name: str | None = None, file_path: str | Path | None = None) -> ISerialization:
        """
        Get appropriate serializer for format.
        Args:
            format_name: Explicit format name (json, bson, xwjson, etc.)
            file_path: File path to detect format from extension
        Returns:
            ISerialization implementation for the format
        Raises:
            XWQueryValueError: If format cannot be determined or serializer not found
        """
        # Determine format
        format_key = None
        if format_name:
            format_key = format_name.lower()
        elif file_path:
            # Detect from file extension
            ext = Path(file_path).suffix.lower().lstrip('.')
            format_key = self._normalize_extension(ext)
        if not format_key:
            raise XWQueryValueError(
                "Cannot determine serialization format. "
                "Provide format_name or file_path with extension."
            )
        # Check cache
        if format_key in self._serializer_cache:
            return self._serializer_cache[format_key]
        # Get serializer from xwsystem
        try:
            from exonware.xwsystem.io.serialization import get_serializer
            serializer = get_serializer(format_key)
            if serializer:
                self._serializer_cache[format_key] = serializer
                return serializer
        except (ImportError, AttributeError):
            pass
        # Try direct imports for common formats
        serializer = self._create_serializer_direct(format_key)
        if serializer:
            self._serializer_cache[format_key] = serializer
            return serializer
        raise XWQueryValueError(
            f"Serializer not found for format: {format_key}. "
            f"Install the required serialization library or ensure xwsystem is properly configured."
        )

    def _normalize_extension(self, ext: str) -> str:
        """
        Normalize file extension to format name.
        Args:
            ext: File extension (without dot)
        Returns:
            Normalized format name
        """
        # Common extension mappings
        mapping = {
            'json': 'json',
            'jsonl': 'jsonl',  # JSON Lines / NDJSON
            'ndjson': 'jsonl',  # Newline Delimited JSON
            'bson': 'bson',
            'xwjson': 'xwjson',
            'xwj': 'xwjson',  # Short extension for XWJSON
        }
        return mapping.get(ext.lower(), ext.lower())

    def _create_serializer_direct(self, format_name: str) -> ISerialization | None:
        """
        Create serializer directly for common formats.
        Args:
            format_name: Format name
        Returns:
            ISerialization instance or None if not available
        """
        format_lower = format_name.lower()
        try:
            if format_lower == 'json':
                from exonware.xwsystem.io.serialization import get_serializer
                from exonware.xwsystem.io.serialization.formats.text.json import JsonSerializer
                return get_serializer(JsonSerializer)
            elif format_lower == 'bson':
                from exonware.xwsystem.io.serialization.formats.binary.bson import BsonSerializer
                return BsonSerializer()
            elif format_lower in ('jsonl', 'ndjson'):
                from exonware.xwsystem.io.serialization.formats.text.json_lines import JsonLinesSerializer
                return JsonLinesSerializer()
            elif format_lower == 'xwjson':
                from exonware.xwjson.formats.binary.xwjson.serializer import XWJSONSerializer
                return XWJSONSerializer()
        except ImportError:
            pass
        return None

    def _execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult]
    ) -> ExecutionResult:
        """
        Execute a single operation using serialization or delegate to native engine.
        For LOAD/STORE operations, uses ISerialization implementations.
        For other operations, deserializes data and delegates to native engine.
        Args:
            action: QueryAction to execute
            context: Execution context
            child_results: Results from child actions
        Returns:
            Execution result
        """
        # Handle serialization-specific operations
        if action.type in ("LOAD", "STORE", "FILE_SOURCE"):
            return self._execute_serialization_operation(action, context, child_results)
        # For other operations, deserialize if needed and delegate to native engine
        # Check if context.node is a file path or needs deserialization
        if isinstance(context.node, (str, Path)):
            file_path = str(context.node)
            # Try to detect if it's a file path
            if Path(file_path).exists() or Path(file_path).suffix:
                # Load file using serializer
                try:
                    serializer = self._get_serializer(file_path=file_path)
                    data = serializer.load_file(file_path)
                    # Update context with loaded data
                    context.node = data
                except Exception as e:
                    return ExecutionResult(
                        success=False,
                        data=None,
                        error=f"Failed to load file {file_path}: {e}",
                        action_type=action.type
                    )
        # Delegate to native engine for non-serialization operations
        from .engine import NativeOperationsExecutionEngine
        native_engine = NativeOperationsExecutionEngine(self._registry)
        return native_engine._execute_operation(action, context, child_results)

    def _execute_serialization_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult]
    ) -> ExecutionResult:
        """
        Execute serialization-specific operation (LOAD/STORE).
        Args:
            action: QueryAction (LOAD/STORE/FILE_SOURCE)
            context: Execution context
            child_results: Results from child actions
        Returns:
            Execution result
        """
        params = action.params
        if action.type == "LOAD":
            return self._execute_load(action, params, context)
        elif action.type == "STORE":
            return self._execute_store(action, params, context)
        elif action.type == "FILE_SOURCE":
            return self._execute_file_source(action, params, context)
        return ExecutionResult(
            success=False,
            data=None,
            error=f"Unsupported serialization operation: {action.type}",
            action_type=action.type
        )

    def _execute_load(
        self,
        action: QueryAction,
        params: dict[str, Any],
        context: ExecutionContext
    ) -> ExecutionResult:
        """
        Execute LOAD operation using ISerialization.
        Args:
            action: LOAD QueryAction
            params: Load parameters (source, format, etc.)
            context: Execution context
        Returns:
            Execution result with loaded data
        """
        source = params.get('source', params.get('from'))
        format_hint = params.get('format')
        if not source:
            return ExecutionResult(
                success=False,
                data=None,
                error="LOAD operation requires 'source' or 'from' parameter",
                action_type="LOAD"
            )
        try:
            # Get appropriate serializer
            serializer = self._get_serializer(format_name=format_hint, file_path=source)
            # Load file
            data = serializer.load_file(source)
            return ExecutionResult(
                success=True,
                data=data,
                action_type="LOAD",
                metadata={
                    'source': source,
                    'format': serializer.format_name,
                    'serializer': type(serializer).__name__
                }
            )
        except Exception as e:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"LOAD failed: {e}",
                action_type="LOAD"
            )

    def _execute_store(
        self,
        action: QueryAction,
        params: dict[str, Any],
        context: ExecutionContext
    ) -> ExecutionResult:
        """
        Execute STORE operation using ISerialization.
        Args:
            action: STORE QueryAction
            params: Store parameters (target, format, data, etc.)
            context: Execution context
        Returns:
            Execution result with store status
        """
        target = params.get('target', params.get('to'))
        format_hint = params.get('format')
        data = params.get('data') or context.node
        if not target:
            return ExecutionResult(
                success=False,
                data=None,
                error="STORE operation requires 'target' or 'to' parameter",
                action_type="STORE"
            )
        if data is None:
            return ExecutionResult(
                success=False,
                data=None,
                error="STORE operation requires data (from params or context)",
                action_type="STORE"
            )
        try:
            # Get appropriate serializer
            serializer = self._get_serializer(format_name=format_hint, file_path=target)
            # Save file
            serializer.save_file(data, target)
            return ExecutionResult(
                success=True,
                data={'target': target, 'status': 'saved'},
                action_type="STORE",
                metadata={
                    'target': target,
                    'format': serializer.format_name,
                    'serializer': type(serializer).__name__
                }
            )
        except Exception as e:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"STORE failed: {e}",
                action_type="STORE"
            )

    def _execute_file_source(
        self,
        action: QueryAction,
        params: dict[str, Any],
        context: ExecutionContext
    ) -> ExecutionResult:
        """
        Execute FILE_SOURCE operation (load file as data source).
        Args:
            action: FILE_SOURCE QueryAction
            params: File source parameters (path, format, etc.)
            context: Execution context
        Returns:
            Execution result with file data
        """
        source = params.get('path', params.get('source', params.get('file')))
        format_hint = params.get('format')
        if not source:
            return ExecutionResult(
                success=False,
                data=None,
                error="FILE_SOURCE operation requires 'path', 'source', or 'file' parameter",
                action_type="FILE_SOURCE"
            )
        # Use LOAD logic
        return self._execute_load(action, {'source': source, 'format': format_hint}, context)

    def list_supported_operations(self) -> list[str]:
        """
        Get list of all supported operations.
        Returns:
            List of operation names supported by this engine
        """
        # All operations from registry, but serialization-aware
        ops = self._registry.list_operations()
        # Add serialization-specific operations
        serialization_ops = ["LOAD", "STORE", "FILE_SOURCE"]
        return list(set(ops + serialization_ops))

    def can_execute(self, operation_name: str) -> bool:
        """
        Check if this engine can execute a specific operation.
        Args:
            operation_name: Name of the operation to check
        Returns:
            True if operation is supported, False otherwise
        """
        # Serialization operations are always supported
        if operation_name in ("LOAD", "STORE", "FILE_SOURCE"):
            return True
        # Other operations are supported via native engine delegation
        return self._registry.get(operation_name) is not None
