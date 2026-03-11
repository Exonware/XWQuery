#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/runtime/executors/data/file_source_executor.py
File-Based Data Source Executor
Implements file-based data source support using xwsystem's XWIndex for efficient
querying of JSONL/NDJSON files.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 20, 2026
"""

from pathlib import Path
from typing import Any, Optional, Callable
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
from exonware.xwsystem.io.indexing import XWIndex


class FileSourceExecutor(AUniversalOperationExecutor):
    """
    File-Based Data Source Executor using xwsystem's XWIndex.
    Provides efficient querying of JSONL/NDJSON files with:
    - Line-offset indexing for random access
    - ID-based indexing for fast lookups
    - Paging support for large datasets
    - Streaming operations with predicates
    Examples:
        >>> # Query JSONL file
        >>> query = XWQuery("SELECT * FROM users.jsonl WHERE age > 25")
        >>> results = query.execute()
        >>> # Use paging for large files
        >>> query = XWQuery("SELECT * FROM large_data.jsonl LIMIT 100 OFFSET 0")
        >>> results = query.execute()
        >>> # ID-based lookup
        >>> query = XWQuery("SELECT * FROM users.jsonl WHERE id = 'user_123'")
        >>> results = query.execute()
    """
    OPERATION_NAME = "FILE_SOURCE"
    OPERATION_TYPE = OperationType.DATA_OPS
    SUPPORTED_NODE_TYPES = []

    def __init__(self, **options):
        super().__init__(**options)
        self._index_cache: dict[str, XWIndex] = {}

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute file-based data source operation.
        Supports:
        - Loading data from JSONL/NDJSON files
        - ID-based lookups
        - Paging for large files
        - Streaming with predicates
        """
        params = action.params
        file_path = params.get('source') or params.get('from') or params.get('path')
        if not file_path:
            return ExecutionResult(
                success=False,
                data={'error': 'No file path specified'},
                action_type=self.OPERATION_NAME,
                metadata={}
            )
        # Resolve file path
        file_path = self._resolve_file_path(file_path, context)
        # Check if file exists
        if not Path(file_path).exists():
            return ExecutionResult(
                success=False,
                data={'error': f'File not found: {file_path}'},
                action_type=self.OPERATION_NAME,
                metadata={'file_path': file_path}
            )
        # Get or create index
        index = self._get_index(file_path, params.get('id_field'))
        # Execute based on operation type
        operation = params.get('operation', 'select')
        if operation == 'get_by_id':
            id_value = params.get('id')
            result_data = self._execute_get_by_id(index, id_value, params.get('id_field'))
        elif operation == 'get_page':
            page = params.get('page', 0)
            size = params.get('size', params.get('limit', 10))
            result_data = self._execute_get_page(index, page, size)
        elif operation == 'stream' or operation == 'select':
            match_predicate = params.get('match') or self._build_match_predicate(params)
            result_data = self._execute_stream(index, match_predicate, params)
        else:
            # Default: load all or use paging
            limit = params.get('limit')
            offset = params.get('offset', 0)
            if limit:
                page = offset // limit if limit > 0 else 0
                size = limit
                result_data = self._execute_get_page(index, page, size)
            else:
                # Stream all records
                match_predicate = self._build_match_predicate(params)
                result_data = self._execute_stream(index, match_predicate, params)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={
                'file_path': file_path,
                'operation': operation,
                'index_stats': {
                    'total_lines': len(index.index.line_offsets) if index.index else 0,
                    'has_id_index': index.index.id_index is not None if index.index else False
                }
            }
        )

    def _resolve_file_path(self, file_path: str, context: ExecutionContext) -> str:
        """Resolve file path (absolute or relative)."""
        path = Path(file_path)
        # If absolute, use as-is
        if path.is_absolute():
            return str(path)
        # If relative, try to resolve from context
        if hasattr(context, 'base_path') and context.base_path:
            return str(Path(context.base_path) / path)
        # Fallback: try current working directory
        return str(path.resolve())

    def _get_index(self, file_path: str, id_field: Optional[str] = None) -> XWIndex:
        """Get or create XWIndex for file."""
        cache_key = f"{file_path}:{id_field or 'default'}"
        if cache_key not in self._index_cache:
            index = XWIndex(file_path, id_field=id_field)
            index.build()
            self._index_cache[cache_key] = index
        return self._index_cache[cache_key]

    def _execute_get_by_id(
        self,
        index: XWIndex,
        id_value: Any,
        id_field: Optional[str] = None
    ) -> Any:
        """Execute ID-based lookup."""
        record = index.get_by_id(id_value, id_field=id_field)
        return record if record is not None else []

    def _execute_get_page(
        self,
        index: XWIndex,
        page: int,
        size: int
    ) -> list[Any]:
        """Execute paged retrieval."""
        return index.get_page(page=page, size=size)

    def _execute_stream(
        self,
        index: XWIndex,
        match_predicate: Optional[Callable[[Any], bool]],
        params: dict[str, Any]
    ) -> list[Any]:
        """Execute streaming operation with predicate."""
        limit = params.get('limit')
        offset = params.get('offset', 0)
        results = []
        count = 0
        for record in index.stream(match=match_predicate):
            if count < offset:
                count += 1
                continue
            results.append(record)
            if limit and len(results) >= limit:
                break
        return results

    def _build_match_predicate(self, params: dict[str, Any]) -> Optional[Callable[[Any], bool]]:
        """Build predicate function from query parameters."""
        where_clauses = params.get('where', [])
        if not where_clauses:
            return None
        # Simple predicate builder for common conditions
        # In production, this would use xwquery's predicate builder
        def match(record: Any) -> bool:
            if not isinstance(record, dict):
                return False
            for clause in where_clauses:
                if isinstance(clause, dict):
                    field = clause.get('field')
                    operator = clause.get('operator', '=')
                    value = clause.get('value')
                    if field not in record:
                        return False
                    record_value = record[field]
                    if operator == '=' and record_value != value:
                        return False
                    elif operator == '>' and not (record_value > value):
                        return False
                    elif operator == '<' and not (record_value < value):
                        return False
                    elif operator == '>=' and not (record_value >= value):
                        return False
                    elif operator == '<=' and not (record_value <= value):
                        return False
                    elif operator == '!=' and record_value == value:
                        return False
                    elif operator == 'IN' and value not in record_value:
                        return False
                elif isinstance(clause, str):
                    # Simple string matching (e.g., "age > 25")
                    # For now, skip complex parsing - would integrate with xwquery parser
                    pass
            return True
        return match

    def clear_cache(self, file_path: Optional[str] = None):
        """Clear index cache."""
        if file_path:
            # Clear specific file
            keys_to_remove = [k for k in self._index_cache.keys() if k.startswith(file_path)]
            for key in keys_to_remove:
                del self._index_cache[key]
        else:
            # Clear all
            self._index_cache.clear()
