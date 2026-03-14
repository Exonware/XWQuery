#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/parsers/sql_param_extractor.py
SQL Parameter Extractor
Extracts structured parameters from SQL-style queries.
Uses regex for simplicity - follows DEV_GUIDELINES.md.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: 09-Oct-2025
"""
import re
from typing import Any
from .base import AParamExtractor
from ...errors import XWQueryParseError
class SQLParamExtractor(AParamExtractor):
    """
    SQL parameter extractor using regex.
    Extracts structured parameters from SQL queries for executor consumption.
    Implements IParamExtractor interface per DEV_GUIDELINES.md.
    """
    def extract(self, query: str) -> dict[str, Any]:
        """
        Extract parameters from query (IParamExtractor interface method).
        Detects action type and delegates to extract_params().
        """
        # Detect action type from query
        query_upper = query.upper().strip()
        # Determine action type
        for action_type in ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'COUNT', 'GROUP', 'ORDER']:
            if query_upper.startswith(action_type):
                return self.extract_params(query, action_type)
        # Fallback
        return {'raw': query}
    def extract_params(self, query: str, action_type: str) -> dict[str, Any]:
        """
        Extract parameters based on action type.
        Args:
            query: SQL query string
            action_type: Type of action (SELECT, INSERT, etc.)
        Returns:
            Structured parameters dictionary
        """
        # Route to appropriate extractor
        extractors = {
            'SELECT': self.extract_select_params,
            'INSERT': self.extract_insert_params,
            'UPDATE': self.extract_update_params,
            'DELETE': self.extract_delete_params,
            'WHERE': self.extract_where_params,
            'COUNT': self.extract_count_params,
            'GROUP': self.extract_group_by_params,
            'ORDER': self.extract_order_by_params,
            # XWQS graph operations (script syntax -> executor params)
            'OUT': self.extract_out_params,
            'IN_TRAVERSE': self.extract_in_traverse_params,
            'MATCH': self.extract_match_params,
            'PATH': self.extract_path_params,
            'SHORTEST_PATH': self.extract_shortest_path_params,
            'RETURN': self.extract_return_params,
        }
        extractor = extractors.get(action_type)
        if extractor:
            return extractor(query)
        # Fallback: return raw query
        return {'raw': query}
    def can_parse(self, query: str) -> bool:
        """Check if query looks like SQL."""
        query_upper = query.upper()
        sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'FROM', 'WHERE']
        return any(kw in query_upper for kw in sql_keywords)
    def extract_select_params(self, sql: str) -> dict[str, Any]:
        """Extract SELECT statement parameters."""
        params = {}
        # Extract SELECT fields (handle DISTINCT)
        select_match = re.search(r'SELECT\s+(.*?)\s+FROM', sql, re.IGNORECASE | re.DOTALL)
        if select_match:
            fields_str = select_match.group(1).strip()
            # Strip DISTINCT prefix
            if fields_str.upper().startswith('DISTINCT '):
                params['distinct'] = True
                fields_str = fields_str[9:].strip()
            params['fields'] = self._split_fields(fields_str)
        else:
            params['fields'] = ['*']
        # Extract FROM table
        from_match = re.search(r'FROM\s+(\w+)', sql, re.IGNORECASE)
        if from_match:
            params['from'] = from_match.group(1)
            params['path'] = from_match.group(1)  # Alias for compatibility
        # Extract WHERE conditions
        where_match = re.search(r'WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if where_match:
            params['where'] = self._parse_where_condition(where_match.group(1).strip())
        # Extract ORDER BY
        order_match = re.search(r'ORDER\s+BY\s+(.*?)(?:LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if order_match:
            params['order_by'] = order_match.group(1).strip()
        # Extract GROUP BY
        group_match = re.search(r'GROUP\s+BY\s+(.*?)(?:HAVING|ORDER|LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if group_match:
            params['group_by'] = [f.strip() for f in group_match.group(1).split(',')]
        # Extract LIMIT
        limit_match = re.search(r'LIMIT\s+(\d+)', sql, re.IGNORECASE)
        if limit_match:
            params['limit'] = int(limit_match.group(1))
        # Extract OFFSET
        offset_match = re.search(r'OFFSET\s+(\d+)', sql, re.IGNORECASE)
        if offset_match:
            params['offset'] = int(offset_match.group(1))
        return params
    def extract_insert_params(self, sql: str) -> dict[str, Any]:
        """Extract INSERT statement parameters."""
        params = {}
        # INSERT INTO table [ (col1, col2, ...) ] VALUES (...)
        into_match = re.search(r'INSERT\s+INTO\s+(\w+)', sql, re.IGNORECASE)
        if into_match:
            params['target'] = into_match.group(1)
        # Extract column list: (id, name) between table and VALUES
        cols_match = re.search(r'\(\s*([^)]+)\s*\)\s+VALUES\s+', sql, re.IGNORECASE)
        if cols_match:
            params['columns'] = [c.strip() for c in cols_match.group(1).split(',')]
        # Extract VALUES
        values_match = re.search(r'VALUES\s+(.+)', sql, re.IGNORECASE | re.DOTALL)
        if values_match:
            values_str = values_match.group(1).strip()
            try:
                if values_str.startswith('{'):
                    params['values'] = self._parse_dict_literal(values_str)
                elif values_str.startswith('('):
                    parsed = self._parse_tuple_literal(values_str)
                    if params.get('columns') and isinstance(parsed, list):
                        params['values'] = dict(zip(params['columns'], parsed))
                    else:
                        params['values'] = parsed
            except Exception:
                params['values'] = values_str
        return params
    def extract_update_params(self, sql: str) -> dict[str, Any]:
        """Extract UPDATE statement parameters."""
        params = {}
        # UPDATE table SET ...
        table_match = re.search(r'UPDATE\s+(\w+)', sql, re.IGNORECASE)
        if table_match:
            params['target'] = table_match.group(1)
        # Extract SET clause
        set_match = re.search(r'SET\s+(.+?)(?:WHERE|$)', sql, re.IGNORECASE | re.DOTALL)
        if set_match:
            params['values'] = self._parse_set_clause(set_match.group(1).strip())
        # Extract WHERE
        where_match = re.search(r'WHERE\s+(.+?)$', sql, re.IGNORECASE | re.DOTALL)
        if where_match:
            params['where'] = self._parse_where_condition(where_match.group(1).strip())
        return params
    def extract_delete_params(self, sql: str) -> dict[str, Any]:
        """Extract DELETE statement parameters."""
        params = {}
        # DELETE FROM table
        from_match = re.search(r'DELETE\s+FROM\s+(\w+)', sql, re.IGNORECASE)
        if from_match:
            params['target'] = from_match.group(1)
        # Extract WHERE
        where_match = re.search(r'WHERE\s+(.+?)$', sql, re.IGNORECASE | re.DOTALL)
        if where_match:
            params['where'] = self._parse_where_condition(where_match.group(1).strip())
        return params
    def extract_where_params(self, sql: str) -> dict[str, Any]:
        """Extract WHERE clause parameters."""
        # Extract just the condition part
        where_match = re.search(r'WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if where_match:
            return self._parse_where_condition(where_match.group(1).strip())
        return {}
    def extract_count_params(self, sql: str) -> dict[str, Any]:
        """Extract COUNT parameters."""
        params = {}
        # COUNT(*) or COUNT(field)
        count_match = re.search(r'COUNT\s*\(\s*([^)]+)\s*\)', sql, re.IGNORECASE)
        if count_match:
            field = count_match.group(1).strip()
            params['field'] = field if field != '*' else None
        # Extract FROM
        from_match = re.search(r'FROM\s+(\w+)', sql, re.IGNORECASE)
        if from_match:
            params['from'] = from_match.group(1)
            params['path'] = from_match.group(1)
        # Extract WHERE
        where_match = re.search(r'WHERE\s+(.+?)(?:ORDER|GROUP|LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if where_match:
            params['where'] = self._parse_where_condition(where_match.group(1).strip())
        return params
    def extract_group_by_params(self, sql: str) -> dict[str, Any]:
        """Extract GROUP BY parameters."""
        params = {}
        # GROUP BY fields
        group_match = re.search(r'GROUP\s+BY\s+(.*?)(?:HAVING|ORDER|LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if group_match:
            params['fields'] = [f.strip() for f in group_match.group(1).split(',')]
        # Extract HAVING
        having_match = re.search(r'HAVING\s+(.+?)(?:ORDER|LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if having_match:
            params['having'] = self._parse_where_condition(having_match.group(1).strip())
        return params
    def extract_order_by_params(self, sql: str) -> dict[str, Any]:
        """Extract ORDER BY parameters."""
        params = {}
        # ORDER BY field ASC/DESC
        order_match = re.search(r'ORDER\s+BY\s+(.*?)(?:LIMIT|$)', sql, re.IGNORECASE | re.DOTALL)
        if order_match:
            order_clause = order_match.group(1).strip()
            # Parse: field ASC, field2 DESC
            order_fields = []
            for field_spec in order_clause.split(','):
                field_spec = field_spec.strip()
                if ' DESC' in field_spec.upper():
                    field = field_spec.upper().replace(' DESC', '').strip()
                    order_fields.append({'field': field, 'direction': 'DESC'})
                elif ' ASC' in field_spec.upper():
                    field = field_spec.upper().replace(' ASC', '').strip()
                    order_fields.append({'field': field, 'direction': 'ASC'})
                else:
                    order_fields.append({'field': field_spec, 'direction': 'ASC'})
            params['fields'] = order_fields
        return params
    # -------------------------------------------------------------------------
    # XWQS graph operation parameter extractors (script syntax -> executor params)
    # -------------------------------------------------------------------------
    def extract_out_params(self, line: str) -> dict[str, Any]:
        """OUT [FROM] <vertex> -> {vertex, from}. E.g. OUT FROM A, OUT A."""
        line = line.strip()
        rest = re.sub(r'^OUT\s+', '', line, flags=re.IGNORECASE).strip()
        from_match = re.match(r'FROM\s+([\w]+)', rest, re.IGNORECASE)
        if from_match:
            vertex = from_match.group(1)
        else:
            vertex = rest.split()[0] if rest else None
        return {'vertex': vertex, 'from': vertex} if vertex else {'raw': line}
    def extract_in_traverse_params(self, line: str) -> dict[str, Any]:
        """IN_TRAVERSE [TO] <vertex> -> {vertex, to}. E.g. IN_TRAVERSE TO C, IN_TRAVERSE C."""
        line = line.strip()
        rest = re.sub(r'^IN_TRAVERSE\s+', '', line, flags=re.IGNORECASE).strip()
        to_match = re.match(r'TO\s+([\w]+)', rest, re.IGNORECASE)
        if to_match:
            vertex = to_match.group(1)
        else:
            vertex = rest.split()[0] if rest else None
        return {'vertex': vertex, 'to': vertex} if vertex else {'raw': line}
    def extract_match_params(self, line: str) -> dict[str, Any]:
        """MATCH (source)->(target) or MATCH source A target B -> {pattern: {source, target}}."""
        line = line.strip()
        rest = re.sub(r'^MATCH\s+', '', line, flags=re.IGNORECASE).strip()
        # (A)->(B) or (A)-(B)
        pattern_match = re.match(r'\(([\w]+)\)\s*->?\s*\(([\w]+)\)', rest, re.IGNORECASE)
        if pattern_match:
            return {'pattern': {'source': pattern_match.group(1), 'target': pattern_match.group(2)}}
        # source A target B
        src_match = re.search(r'SOURCE\s+([\w]+)', rest, re.IGNORECASE)
        tgt_match = re.search(r'TARGET\s+([\w]+)', rest, re.IGNORECASE)
        if src_match:
            pattern = {'source': src_match.group(1)}
            if tgt_match:
                pattern['target'] = tgt_match.group(1)
            return {'pattern': pattern}
        if tgt_match:
            return {'pattern': {'target': tgt_match.group(1)}}
        # Single vertex: MATCH A -> all edges from A
        single = rest.split()[0] if rest else None
        if single:
            return {'pattern': {'source': single}}
        return {'raw': line}
    def extract_path_params(self, line: str) -> dict[str, Any]:
        """PATH [FROM] A [TO] D -> {start, end}. E.g. PATH FROM A TO D, PATH A TO D."""
        line = line.strip()
        rest = re.sub(r'^PATH\s+', '', line, flags=re.IGNORECASE).strip()
        from_match = re.search(r'FROM\s+([\w]+)', rest, re.IGNORECASE)
        to_match = re.search(r'TO\s+([\w]+)', rest, re.IGNORECASE)
        if from_match and to_match:
            return {'start': from_match.group(1), 'end': to_match.group(1), 'from': from_match.group(1), 'to': to_match.group(1)}
        parts = rest.split()
        if len(parts) >= 3 and parts[1].upper() == 'TO':
            return {'start': parts[0], 'end': parts[2], 'from': parts[0], 'to': parts[2]}
        if len(parts) >= 2:
            return {'start': parts[0], 'end': parts[1], 'from': parts[0], 'to': parts[1]}
        return {'raw': line}
    def extract_shortest_path_params(self, line: str) -> dict[str, Any]:
        """SHORTEST_PATH [FROM] A [TO] D -> {source, target, start, end}."""
        line = line.strip()
        rest = re.sub(r'^SHORTEST_PATH\s+', '', line, flags=re.IGNORECASE).strip()
        from_match = re.search(r'FROM\s+([\w]+)', rest, re.IGNORECASE)
        to_match = re.search(r'TO\s+([\w]+)', rest, re.IGNORECASE)
        if from_match and to_match:
            s, t = from_match.group(1), to_match.group(1)
            return {'source': s, 'target': t, 'start': s, 'end': t}
        parts = rest.split()
        if len(parts) >= 3 and parts[1].upper() == 'TO':
            return {'source': parts[0], 'target': parts[2], 'start': parts[0], 'end': parts[2]}
        if len(parts) >= 2:
            return {'source': parts[0], 'target': parts[1], 'start': parts[0], 'end': parts[1]}
        return {'raw': line}
    def extract_return_params(self, line: str) -> dict[str, Any]:
        """RETURN [DISTINCT] field1, field2 -> {fields, distinct}."""
        line = line.strip()
        rest = re.sub(r'^RETURN\s+', '', line, flags=re.IGNORECASE).strip()
        distinct = rest.upper().startswith('DISTINCT ')
        if distinct:
            rest = rest[9:].strip()
        fields = [f.strip() for f in rest.split(',')] if rest else []
        return {'fields': fields, 'return': fields, 'distinct': distinct}
    def _parse_where_condition(self, condition: str) -> dict[str, Any]:
        """
        Parse WHERE condition into structured format.
        Supports: field operator value, field BETWEEN a AND b
        Examples: age > 50, name = 'John', age BETWEEN 10 AND 18
        """
        condition = condition.strip()
        # BETWEEN ... AND (check before other operators)
        between_match = re.search(r'(\w+)\s+BETWEEN\s+(.+?)\s+AND\s+(.+)', condition, re.IGNORECASE | re.DOTALL)
        if between_match:
            return {
                'field': between_match.group(1).strip(),
                'operator': 'BETWEEN',
                'value': (self._parse_value(between_match.group(2).strip()), self._parse_value(between_match.group(3).strip()))
            }
        # Check for operators in order of precedence
        operators = ['>=', '<=', '!=', '<>', '>', '<', '=', 'LIKE', 'IN']
        for op in operators:
            # Case-insensitive for word operators
            if op.isalpha():
                pattern = rf'\s+{op}\s+'
                match = re.search(pattern, condition, re.IGNORECASE)
                if match:
                    field = condition[:match.start()].strip()
                    value = condition[match.end():].strip()
                    return {
                        'field': field,
                        'operator': op.upper(),
                        'value': self._parse_value(value) if op.upper() != 'IN' else self._parse_in_values(value)
                    }
            else:
                if op in condition:
                    parts = condition.split(op, 1)
                    if len(parts) == 2:
                        return {
                            'field': parts[0].strip(),
                            'operator': op,
                            'value': self._parse_value(parts[1].strip())
                        }
        # Can't parse - return as expression
        return {'expression': condition}
    def _parse_value(self, value_str: str) -> Any:
        """
        Parse a value string, handling quoted strings, numbers, booleans, etc.
        Args:
            value_str: Value string (e.g., '"Riyadh"', '123', 'true', 'null')
        Returns:
            Parsed value (string without quotes, int, float, bool, None, etc.)
        """
        value_str = value_str.strip()
        # Handle quoted strings (single or double quotes)
        if (value_str.startswith('"') and value_str.endswith('"')) or \
           (value_str.startswith("'") and value_str.endswith("'")):
            # Strip quotes
            return value_str[1:-1]
        # Handle booleans
        if value_str.upper() == 'TRUE':
            return True
        if value_str.upper() == 'FALSE':
            return False
        # Handle null
        if value_str.upper() == 'NULL':
            return None
        # Try to parse as number
        try:
            # Try int first
            if '.' not in value_str:
                return int(value_str)
            else:
                return float(value_str)
        except ValueError:
            # Not a number, return as string
            return value_str
    def _parse_in_values(self, values_str: str) -> list:
        """Parse IN clause values."""
        # IN ['value1', 'value2'] or IN ('value1', 'value2')
        values_str = values_str.strip().strip('[]()').strip()
        values = [self._parse_value(v.strip()) for v in values_str.split(',')]
        return values
    def _parse_set_clause(self, set_str: str) -> dict[str, Any]:
        """Parse SET clause in UPDATE."""
        assignments = {}
        # Split by comma
        for assignment in set_str.split(','):
            if '=' in assignment:
                field, value = assignment.split('=', 1)
                assignments[field.strip()] = self._parse_value(value.strip())
        return assignments
    def _parse_dict_literal(self, dict_str: str) -> dict[str, Any]:
        """Parse dictionary literal from string."""
        # Simple parser for {key: value, key2: value2}
        dict_str = dict_str.strip('{}').strip()
        result = {}
        for pair in dict_str.split(','):
            if ':' in pair:
                key, value = pair.split(':', 1)
                result[key.strip()] = self._parse_value(value.strip())
        return result
    def _parse_tuple_literal(self, tuple_str: str) -> list[Any]:
        """Parse tuple literal from string."""
        # Simple parser for (value1, value2, value3)
        tuple_str = tuple_str.strip('()').strip()
        return [self._parse_value(v.strip()) for v in tuple_str.split(',')]
    def _split_fields(self, fields_str: str) -> list[str]:
        """
        Split SELECT fields string into list of field expressions.
        Handles:
        - Simple fields: "name", "age"
        - Expressions with AS: "age - 5 AS perfect_age"
        - Multiple fields: "name, age, price * quantity AS total"
        Args:
            fields_str: Fields string from SELECT clause
        Returns:
            List of field expressions (preserving AS aliases)
        """
        if not fields_str or fields_str.strip() == '*':
            return ['*']
        # Split by comma, but be careful with expressions that contain commas
        # For now, simple split - expressions with AS should be handled as single units
        fields = []
        current_field = ""
        paren_depth = 0
        for char in fields_str:
            if char == '(':
                paren_depth += 1
                current_field += char
            elif char == ')':
                paren_depth -= 1
                current_field += char
            elif char == ',' and paren_depth == 0:
                # Comma at top level - split here
                if current_field.strip():
                    fields.append(current_field.strip())
                current_field = ""
            else:
                current_field += char
        # Add last field
        if current_field.strip():
            fields.append(current_field.strip())
        return fields if fields else ['*']
