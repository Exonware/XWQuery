#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/core/select_executor.py
SELECT Operation Executor
Implements SELECT operation execution on all node types.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 08-Oct-2025
"""

import re
import logging
from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationCapability
from exonware.xwnode.nodes.strategies.contracts import NodeType
logger = logging.getLogger(__name__)


class SelectExecutor(AUniversalOperationExecutor):
    """
    SELECT operation executor - Universal operation.
    Works on all node types (LINEAR, TREE, GRAPH, MATRIX).
    Retrieves and projects data from nodes.
    """
    OPERATION_NAME = "SELECT"

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute SELECT operation.
        Root cause fixed: SELECT was not applying ORDER BY and LIMIT operations.
        Solution: Added post-processing to apply ORDER BY and LIMIT after filtering and projection.
        Supports:
        - Column projection
        - Star (*) selection
        - WHERE filtering
        - ORDER BY sorting (ASC/DESC)
        - LIMIT with offset
        - Adapts to different node types
        """
        # Extract parameters (support both SQLParamExtractor and grammar/syntax_adapter naming)
        fields = action.params.get('fields') or action.params.get('select_list', ['*'])
        columns = action.params.get('columns') or fields
        # Debug: Log what we received
        logger.debug(f"SelectExecutor: fields={fields}, columns={columns}, params={action.params}")
        # Check if this is an aggregation query (e.g., SELECT COUNT(*) FROM ...)
        aggregation_function = self._detect_aggregation(columns)
        if aggregation_function:
            return self._execute_aggregation(aggregation_function, action, context)
        table_name = action.params.get('from') or action.params.get('path') or action.params.get('from_clause')
        # Get the actual data source
        if table_name:
            # Prefer value-based navigation when available (XWNode facade),
            # because immutable/persistent strategies may not support ANode.get().
            if hasattr(context.node, "get_value"):
                source = context.node.get_value(table_name, None)
            elif hasattr(context.node, 'to_native'):
                # If node has to_native(), convert to native and access as dict
                node_data = context.node.to_native()
                if isinstance(node_data, dict) and table_name in node_data:
                    source = node_data[table_name]
                else:
                    source = node_data
            elif isinstance(context.node, dict):
                # If node is already a dict, access directly
                source = context.node.get(table_name) if table_name in context.node else context.node
            elif hasattr(context.node, "get"):
                # Try get() method (positional argument only to avoid dict.get() keyword issue)
                try:
                    source_node = context.node.get(table_name)
                    # Extract actual value from ANode if needed
                    if hasattr(source_node, 'value'):
                        source = source_node.value
                    elif hasattr(source_node, 'to_native'):
                        source = source_node.to_native()
                    else:
                        source = source_node
                except (TypeError, AttributeError) as e:
                    # If get() fails (e.g., dict.get() with keyword args), try to_native()
                    logger.debug(f"get() failed for table '{table_name}': {e}, trying to_native()")
                    if hasattr(context.node, 'to_native'):
                        node_data = context.node.to_native()
                        if isinstance(node_data, dict) and table_name in node_data:
                            source = node_data[table_name]
                        else:
                            source = node_data
                    else:
                        source = None
            else:
                source = context.node
        else:
            source = context.node
        # Debug: Log source data
        logger.debug(f"SelectExecutor: table_name={table_name}, source type={type(source)}, source={source}")
        # If source is None and we have table_name, try to get from context.node's native representation
        if source is None and table_name:
            # Try to get native representation
            node_native = None
            if isinstance(context.node, (dict, list)):
                # Already native data
                node_native = context.node
            elif hasattr(context.node, 'to_native'):
                try:
                    node_native = context.node.to_native()
                except Exception as e:
                    logger.debug(f"to_native() failed: {e}, trying direct access")
                    # If to_native() fails, try direct access
                    if isinstance(context.node, dict):
                        node_native = context.node
                    elif hasattr(context.node, 'to_native'):
                            try:
                                node_native = context.node._xwnode.to_native()
                            except Exception:
                                pass
            if node_native is not None:
                logger.debug(f"SelectExecutor: node_native type={type(node_native)}, node_native={node_native}")
                if isinstance(node_native, dict) and table_name in node_native:
                    source = node_native[table_name]
                    logger.debug(f"SelectExecutor: Found source from native data: {source}")
        # Get WHERE condition to apply BEFORE column projection (support both naming conventions)
        where_condition = action.params.get('where') or action.params.get('where_clause')
        # If source is None, try to get it from context.node's native representation
        if source is None:
            logger.warning(f"SelectExecutor: source is None for table '{table_name}', trying to get from context.node")
            # Try one more time to get source from native representation
            if hasattr(context.node, 'to_native'):
                try:
                    node_native = context.node.to_native()
                    if isinstance(node_native, dict) and table_name in node_native:
                        source = node_native[table_name]
                        logger.debug(f"SelectExecutor: Found source from to_native() fallback: {source}")
                except Exception as e:
                    logger.debug(f"SelectExecutor: to_native() fallback failed: {e}")
            # If still None, use context.node directly
            if source is None:
                if hasattr(context.node, 'to_native'):
                    try:
                        source = context.node.to_native()
                    except Exception:
                        source = context.node
                else:
                    source = context.node
        # Prefer selecting based on the *actual source value* (more robust for
        # facade/persistent strategies where the root node type may not match
        # the selected table's runtime shape).
        if source is None:
            logger.error(f"SelectExecutor: source is still None after all attempts, returning empty result")
            return ExecutionResult(
                data=[],
                affected_count=0
            )
        if isinstance(source, (list, dict)):
            data = self._select_from_tree(source, columns, context, where_condition)
        else:
            # Fallback: route based on the root node type
            node_type = self._get_node_type(context.node)
            # Route to appropriate handler based on node type
            # Pass where_condition to apply filtering before projection
            if node_type == NodeType.LINEAR:
                data = self._select_from_linear(source, columns, context, where_condition)
            elif node_type == NodeType.TREE:
                data = self._select_from_tree(source, columns, context, where_condition)
            elif node_type == NodeType.GRAPH:
                data = self._select_from_graph(source, columns, context, where_condition)
            elif node_type == NodeType.MATRIX:
                data = self._select_from_matrix(source, columns, context, where_condition)
            else:  # HYBRID
                data = self._select_from_tree(source, columns, context, where_condition)  # Default to tree
        # CRITICAL FIX: Apply ORDER BY if specified (support string or list-of-dicts from grammar)
        order_by = action.params.get('order_by')
        if order_by and isinstance(data, list):
            data = self._apply_order_by(data, order_by)
        # Apply DISTINCT if specified
        if action.params.get('distinct') and isinstance(data, list):
            data = self._apply_distinct(data, columns)
        # CRITICAL FIX: Apply LIMIT if specified
        limit = action.params.get('limit')
        if limit and isinstance(data, list):
            offset = action.params.get('offset', 0)
            data = self._apply_limit(data, limit, offset)
        return ExecutionResult(
            data=data,
            affected_count=len(data) if isinstance(data, list) else 1
        )

    def _get_node_type(self, node: Any) -> NodeType:
        """Get node's strategy type."""
        if hasattr(node, '_strategy') and hasattr(node._strategy, 'STRATEGY_TYPE'):
            return node._strategy.STRATEGY_TYPE
        elif hasattr(node, 'STRATEGY_TYPE'):
            return node.STRATEGY_TYPE
        return NodeType.TREE  # Default

    def _select_from_linear(self, source: Any, columns: list[str], context: ExecutionContext, where_condition: dict | None = None) -> list[dict]:
        """Select from linear node (list-like)."""
        results = []
        # Iterate through linear structure
        if hasattr(source, 'items'):
            for key, value in source.items():
                row_dict = {'key': key, 'value': value} if not isinstance(value, dict) else value
                # Apply WHERE filter first
                if where_condition and not self._matches_condition(row_dict, where_condition):
                    continue
                if columns == ['*']:
                    results.append(row_dict)
                else:
                    row = self._project_columns(row_dict, columns)
                    if row is not None:
                        results.append(row)
        return results

    def _select_from_tree(self, source: Any, columns: list[str], context: ExecutionContext, where_condition: dict | None = None) -> list[dict]:
        """Select from tree node (key-value map)."""
        results = []
        # Handle list of records (most common case)
        if isinstance(source, list):
            for item in source:
                if isinstance(item, dict):
                    # Apply WHERE filter FIRST (before column projection)
                    if where_condition and not self._matches_condition(item, where_condition):
                        continue
                    # Then project columns
                    if columns == ['*'] or columns == [' *'] or '*' in columns:
                        results.append(item)
                    else:
                        row = self._project_columns(item, columns)
                        if row is not None:
                            results.append(row)
                else:
                    results.append({'value': item})
        # Handle tree structure (dict)
        elif hasattr(source, 'items'):
            for key, value in source.items():
                if columns == ['*']:
                    results.append({'key': key, 'value': value})
                else:
                    row = self._project_columns(value, columns)
                    if row is not None:
                        results.append(row)
        return results

    def _select_from_graph(self, source: Any, columns: list[str], context: ExecutionContext, where_condition: dict | None = None) -> list[dict]:
        """Select from graph node."""
        # For graphs, return nodes
        results = []
        if hasattr(source, 'items'):
            for key, value in source.items():
                row_dict = {'node_id': key, 'node_data': value}
                # Apply WHERE filter first
                if where_condition and not self._matches_condition(row_dict, where_condition):
                    continue
                if columns == ['*']:
                    results.append(row_dict)
                else:
                    row = self._project_columns(value, columns)
                    if row is not None:
                        row['node_id'] = key
                        results.append(row)
        return results

    def _select_from_matrix(self, source: Any, columns: list[str], context: ExecutionContext, where_condition: dict | None = None) -> list[dict]:
        """Select from matrix node."""
        results = []
        # Iterate through matrix
        if hasattr(source, 'items'):
            for key, value in source.items():
                row_dict = {'position': key, 'value': value} if not isinstance(value, dict) else value
                # Apply WHERE filter first
                if where_condition and not self._matches_condition(row_dict, where_condition):
                    continue
                if columns == ['*']:
                    results.append(row_dict)
                else:
                    row = self._project_columns(row_dict, columns)
                    if row is not None:
                        results.append(row)
        return results

    def _detect_aggregation(self, columns: list[str]) -> dict | None:
        """
        Detect if SELECT query contains aggregation functions.
        Args:
            columns: List of column expressions
        Returns:
            Dictionary with aggregation info, or None if no aggregation
        """
        if not columns or len(columns) != 1:
            return None
        col_expr = columns[0].strip()
        # Check for COUNT(*)
        count_match = re.match(r'COUNT\s*\(\s*\*\s*\)', col_expr, re.IGNORECASE)
        if count_match:
            return {'function': 'COUNT', 'field': '*', 'expression': 'count(*)'}
        # Check for COUNT(field)
        count_field_match = re.match(r'COUNT\s*\(\s*(\w+)\s*\)', col_expr, re.IGNORECASE)
        if count_field_match:
            field = count_field_match.group(1)
            return {'function': 'COUNT', 'field': field, 'expression': f'count({field})'}
        # Check for other aggregation functions (SUM, AVG, MIN, MAX)
        agg_match = re.match(r'(SUM|AVG|MIN|MAX)\s*\(\s*(\w+)\s*\)', col_expr, re.IGNORECASE)
        if agg_match:
            func = agg_match.group(1).upper()
            field = agg_match.group(2)
            return {'function': func, 'field': field, 'expression': col_expr.lower()}
        return None

    def _execute_aggregation(self, agg_info: dict, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute aggregation query (e.g., SELECT COUNT(*) FROM ...).
        Args:
            agg_info: Aggregation information from _detect_aggregation()
            action: QueryAction with query parameters
            context: Execution context
        Returns:
            ExecutionResult with aggregation result
        """
        table_name = action.params.get('from') or action.params.get('path') or action.params.get('from_clause')
        # Get the actual data source
        if table_name:
            if hasattr(context.node, "get_value"):
                source = context.node.get_value(table_name, None)
            elif isinstance(context.node, dict):
                source = context.node.get(table_name) if table_name in context.node else context.node
            elif hasattr(context.node, 'to_native'):
                node_data = context.node.to_native()
                if isinstance(node_data, dict) and table_name in node_data:
                    source = node_data[table_name]
                else:
                    source = node_data
            else:
                source = context.node
        else:
            source = context.node
        # Ensure source is a list
        if not isinstance(source, list):
            if isinstance(source, dict):
                # If it's a dict, convert to list of values
                source = list(source.values()) if source else []
            else:
                source = [source] if source is not None else []
        # Apply WHERE filter if present
        where_condition = action.params.get('where')
        if where_condition:
            filtered = []
            for item in source:
                if isinstance(item, dict) and self._matches_condition(item, where_condition):
                    filtered.append(item)
            source = filtered
        # Execute aggregation
        agg_func = agg_info['function']
        field = agg_info.get('field')
        expr = agg_info['expression']
        if agg_func == 'COUNT':
            count = len(source)
            result_data = [{expr: count, 'count': count}]
        elif agg_func == 'SUM' and field:
            total = sum(item.get(field, 0) for item in source if isinstance(item, dict) and field in item)
            result_data = [{expr: total}]
        elif agg_func == 'AVG' and field:
            values = [item.get(field) for item in source if isinstance(item, dict) and field in item and item.get(field) is not None]
            avg_val = sum(values) / len(values) if values else 0
            result_data = [{expr: avg_val}]
        elif agg_func == 'MIN' and field:
            values = [item.get(field) for item in source if isinstance(item, dict) and field in item and item.get(field) is not None]
            min_val = min(values) if values else None
            result_data = [{expr: min_val}]
        elif agg_func == 'MAX' and field:
            values = [item.get(field) for item in source if isinstance(item, dict) and field in item and item.get(field) is not None]
            max_val = max(values) if values else None
            result_data = [{expr: max_val}]
        else:
            # Unknown aggregation
            result_data = [{'error': f'Unsupported aggregation: {agg_func}'}]
        return ExecutionResult(
            data=result_data,
            affected_count=len(result_data)
        )

    def _project_columns(self, value: Any, columns: list[str]) -> dict | None:
        """
        Project specific columns from a value.
        Supports:
        - Direct column names: "age", "name"
        - Expressions with AS alias: "age - 5 AS perfect_age"
        - Arithmetic expressions: "age - 5", "price * quantity"
        """
        if not isinstance(value, dict):
            return {'value': value}
        projected = {}
        for col_expr in columns:
            col_expr = col_expr.strip()
            # Check if it's an expression with AS alias (e.g., "age - 5 AS perfect_age")
            if ' AS ' in col_expr.upper():
                # Split expression and alias (case-insensitive)
                parts = re.split(r'\s+AS\s+', col_expr, flags=re.IGNORECASE)
                if len(parts) == 2:
                    expr = parts[0].strip()
                    alias = parts[1].strip()
                    # Evaluate expression
                    try:
                        # Replace field names with values from dict
                        eval_expr = expr
                        for field_name, field_value in value.items():
                            # Replace field references in expression (word boundaries)
                            # Use word boundaries to avoid partial matches
                            pattern = rf'\b{re.escape(field_name)}\b'
                            eval_expr = re.sub(pattern, str(field_value), eval_expr)
                        # Safe evaluation of arithmetic expressions
                        result_value = eval(eval_expr, {"__builtins__": {}}, {})
                        projected[alias] = result_value
                        logger.debug(f"_project_columns: Evaluated '{expr}' AS '{alias}' = {result_value}")
                    except Exception as e:
                        # If evaluation fails, log and skip this column
                        logger.debug(f"_project_columns: Failed to evaluate '{expr}': {e}")
                        continue
                else:
                    # Malformed AS expression, skip
                    continue
            elif col_expr in value:
                # Direct column reference
                projected[col_expr] = value[col_expr]
            else:
                # Try to evaluate as expression without alias
                try:
                    # Replace field names with values
                    eval_expr = col_expr
                    for field_name, field_value in value.items():
                        pattern = rf'\b{re.escape(field_name)}\b'
                        eval_expr = re.sub(pattern, str(field_value), eval_expr)
                    result_value = eval(eval_expr, {"__builtins__": {}}, {})
                    # Use expression as key (sanitized)
                    key = col_expr.replace(' ', '_').replace('-', '_').replace('+', '_')
                    projected[key] = result_value
                except Exception as e:
                    # If evaluation fails, skip this column
                    logger.debug(f"_project_columns: Failed to evaluate expression '{col_expr}': {e}")
                    continue
        logger.debug(f"_project_columns: Input columns={columns}, value={value}, projected={projected}")
        return projected if projected else None

    def _get_value_by_path(self, obj: Any, path: str) -> Any:
        """
        Resolve a dotted field path against dict/list structures.
        Examples:
            "age" -> obj["age"]
            "payload.views" -> obj["payload"]["views"]
            "items.0.value" -> obj["items"][0]["value"]
        """
        if not path:
            return None
        if "." not in path:
            return obj.get(path) if isinstance(obj, dict) else None
        cur: Any = obj
        for part in path.split("."):
            if isinstance(cur, dict):
                if part not in cur:
                    return None
                cur = cur[part]
                continue
            if isinstance(cur, list):
                try:
                    idx = int(part)
                except ValueError:
                    return None
                if idx < 0 or idx >= len(cur):
                    return None
                cur = cur[idx]
                continue
            return None
        return cur

    def _matches_condition(self, row: dict, condition: dict[str, Any]) -> bool:
        """Check if a single row matches a WHERE condition."""
        if not condition or not isinstance(row, dict):
            return True
        field = condition.get('field')
        operator = condition.get('operator')
        value = condition.get('value')
        if not field or not operator:
            return True
        row_value = self._get_value_by_path(row, field)
        if row_value is None:
            return False
        # Apply operator
        try:
            if operator == '>':
                return row_value > value
            elif operator == '<':
                return row_value < value
            elif operator == '>=':
                return row_value >= value
            elif operator == '<=':
                return row_value <= value
            elif operator == '=' or operator == '==':
                return row_value == value
            elif operator == '!=' or operator == '<>':
                return row_value != value
            elif operator == 'LIKE':
                # SQL LIKE: % = any chars, _ = single char. Use fnmatch (glob-style).
                import fnmatch
                pattern = str(value).replace('%', '*').replace('_', '?')
                return fnmatch.fnmatch(str(row_value).lower(), pattern.lower())
            elif operator == 'BETWEEN':
                low, high = value if isinstance(value, (list, tuple)) and len(value) >= 2 else (None, None)
                if low is None or high is None:
                    return False
                try:
                    return low <= row_value <= high
                except (TypeError, ValueError):
                    return False
            elif operator == 'IN':
                return row_value in value
        except (TypeError, AttributeError):
            return False
        return False

    def _apply_where_filter(self, data: list[dict], condition: dict[str, Any]) -> list[dict]:
        """Apply WHERE filter to data."""
        if not condition:
            return data
        return [row for row in data if self._matches_condition(row, condition)]

    def _apply_order_by(self, data: list[dict], order_by: Any) -> list[dict]:
        """
        Apply ORDER BY sorting to data.
        Supports both formats:
        - String from SQLParamExtractor: "age ASC", "price DESC"
        - List of dicts from grammar: [{"column": "name", "direction": "ASC"}]
        Args:
            data: List of dictionaries to sort
            order_by: ORDER BY clause - string or list of {column, direction} dicts
        Returns:
            Sorted list of dictionaries
        """
        if not order_by or not isinstance(data, list) or len(data) == 0:
            return data
        # Normalize to list of (field, direction) tuples
        specs = []
        if isinstance(order_by, list):
            for item in order_by:
                if isinstance(item, dict):
                    field = item.get('column') or item.get('field')
                    direction = (item.get('direction') or 'ASC').upper()
                    if field:
                        specs.append((field, direction))
                elif isinstance(item, str):
                    parts = item.strip().split()
                    field = parts[0] if parts else None
                    direction = parts[1].upper() if len(parts) > 1 else 'ASC'
                    if field:
                        specs.append((field, direction))
        elif isinstance(order_by, str):
            # Support "age, name" or "age ASC, name DESC" - split by comma first
            for part in order_by.split(','):
                part = part.strip()
                if not part:
                    continue
                tokens = part.split()
                field = tokens[0]
                direction = tokens[1].upper() if len(tokens) > 1 else 'ASC'
                if field:
                    specs.append((field, direction))
        if not specs:
            return data
        try:
            # Build sort key: (field1_key, field2_key, ...) for multi-column ORDER BY
            def sort_key(item):
                return tuple(self._get_sort_key(item, field) for field, _ in specs)
            reverse = specs[0][1] == 'DESC'
            return sorted(data, key=sort_key, reverse=reverse)
        except (KeyError, TypeError, AttributeError):
            return data

    def _apply_distinct(self, data: list[dict], columns: list[str]) -> list[dict]:
        """Apply DISTINCT - deduplicate by columns or full row."""
        if not data or not isinstance(data, list):
            return data
        seen = set()
        result = []
        for row in data:
            if columns == ['*'] or (columns and '*' in columns):
                items = row.items() if isinstance(row, dict) else [('', row)]
                key = tuple(sorted((k, v) for k, v in items))
            else:
                key = tuple(row.get(c) for c in columns) if isinstance(row, dict) else (row,)
            if key not in seen:
                seen.add(key)
                result.append(row)
        return result

    def _apply_limit(self, data: list[dict], limit: int, offset: int = 0) -> list[dict]:
        """
        Apply LIMIT with optional offset to data.
        Root cause fixed: SELECT wasn't applying LIMIT from parsed SQL.
        Solution: Slice data list to apply limit and offset.
        Args:
            data: List of dictionaries to limit
            limit: Maximum number of results
            offset: Number of results to skip (for pagination)
        Returns:
            Limited list of dictionaries
        """
        if not isinstance(data, list) or limit <= 0:
            return data
        # Apply offset and limit using Python slicing
        start = offset
        end = offset + limit
        return data[start:end]

    def _get_sort_key(self, item: Any, field: str) -> Any:
        """
        Extract sort key from item for ORDER BY.
        Args:
            item: Data item (dict or other)
            field: Field name to extract
        Returns:
            Sort key value (handles None gracefully)
        """
        if isinstance(item, dict):
            value = self._get_value_by_path(item, field)
            # Handle None values - sort them last
            if value is None:
                return (1, '')  # Tuple ensures None sorts last
            return (0, value)
        else:
            return (0, item)
__all__ = ['SelectExecutor']
