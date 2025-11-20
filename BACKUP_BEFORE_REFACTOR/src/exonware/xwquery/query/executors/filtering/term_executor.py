#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/term_executor.py

TERM Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType

# REUSE: Shared utilities
from ..utils import extract_items, extract_field_value


class TermExecutor(AUniversalOperationExecutor):
    """TERM - Text search (REFACTORED with shared utilities)."""
    
    OPERATION_NAME = "TERM"
    OPERATION_TYPE = OperationType.SEARCH
    SUPPORTED_NODE_TYPES = []
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        field = params.get('field')
        term = params.get('term', '')
        path = params.get('path')
        case_sensitive = params.get('case_sensitive', False)
        
        result_data = self._execute_term(context.node, field, term, path, case_sensitive, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'matched_count': len(result_data.get('items', []))}
        )
    
    def _execute_term(self, node: Any, field: str, term: str, path: str, 
                     case_sensitive: bool, context: ExecutionContext) -> Dict:
        """Execute TERM using shared utilities."""
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        items = extract_items(data)
        search_term = term if case_sensitive else term.lower()
        
        matched = []
        for item in items:
            value = extract_field_value(item, field) if field else item
            if value:
                compare = str(value) if case_sensitive else str(value).lower()
                if search_term in compare:
                    matched.append(item)
        
        return {'items': matched, 'count': len(matched), 
                'total_items': len(items), 'term': term}

