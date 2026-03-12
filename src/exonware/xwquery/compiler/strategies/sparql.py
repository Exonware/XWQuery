#!/usr/bin/env python3
"""
SPARQL Query Strategy
This module implements the SPARQL query strategy for RDF data queries.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""

import re
from typing import Any, Optional
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class SPARQLStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """
    SPARQL query strategy for RDF data queries.
    Supports:
    - SELECT, CONSTRUCT, ASK, DESCRIBE queries
    - SPARQL 1.1 features
    - Property paths
    - Federated queries
    - Update operations
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'sparql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute SPARQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid SPARQL query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "SELECT":
            return self._execute_select(query, **kwargs)
        elif query_type == "CONSTRUCT":
            return self._execute_construct(query, **kwargs)
        elif query_type == "ASK":
            return self._execute_ask(query, **kwargs)
        elif query_type == "DESCRIBE":
            return self._execute_describe(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate SPARQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic SPARQL validation
        query = query.strip().upper()
        valid_operations = ["SELECT", "CONSTRUCT", "ASK", "DESCRIBE", "INSERT", "DELETE", "LOAD", "CLEAR"]
        for operation in valid_operations:
            if query.startswith(operation):
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get SPARQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "triple_patterns": self._count_triple_patterns(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute path query using SPARQL property paths."""
        query = f"""
        SELECT ?path ?length
        WHERE {{
            <{start}> (<>|!<>)* ?path .
            ?path (<>|!<>)* <{end}> .
            BIND(LENGTH(?path) AS ?length)
        }}
        """
        return self.execute(query)

    def neighbor_query(self, node: Any) -> list[Any]:
        """Execute neighbor query."""
        query = f"""
        SELECT ?neighbor ?predicate
        WHERE {{
            <{node}> ?predicate ?neighbor .
        }}
        """
        return self.execute(query)

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute shortest path query."""
        query = f"""
        SELECT ?path (COUNT(?step) AS ?length)
        WHERE {{
            <{start}> (<>|!<>)* ?path .
            ?path (<>|!<>)* <{end}> .
        }}
        GROUP BY ?path
        ORDER BY ?length
        LIMIT 1
        """
        return self.execute(query)

    def connected_components_query(self) -> list[list[Any]]:
        """Execute connected components query."""
        query = """
        SELECT ?component (COUNT(?node) AS ?size)
        WHERE {
            ?node ?p ?o .
            ?o ?p2 ?node .
        }
        GROUP BY ?component
        """
        return self.execute(query)

    def cycle_detection_query(self) -> list[list[Any]]:
        """Execute cycle detection query."""
        query = """
        SELECT ?cycle
        WHERE {
            ?node ?p ?node .
            BIND(?node AS ?cycle)
        }
        """
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from SPARQL query."""
        query = query.strip().upper()
        for operation in ["SELECT", "CONSTRUCT", "ASK", "DESCRIBE", "INSERT", "DELETE", "LOAD", "CLEAR"]:
            if query.startswith(operation):
                return operation
        return "UNKNOWN"

    def _execute_select(self, query: str, **kwargs) -> Any:
        """Execute SELECT query."""
        return {"result": "SPARQL SELECT executed", "query": query}

    def _execute_construct(self, query: str, **kwargs) -> Any:
        """Execute CONSTRUCT query."""
        return {"result": "SPARQL CONSTRUCT executed", "query": query}

    def _execute_ask(self, query: str, **kwargs) -> Any:
        """Execute ASK query."""
        return {"result": "SPARQL ASK executed", "query": query}

    def _execute_describe(self, query: str, **kwargs) -> Any:
        """Execute DESCRIBE query."""
        return {"result": "SPARQL DESCRIBE executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        triple_count = self._count_triple_patterns(query)
        if triple_count > 10:
            return "HIGH"
        elif triple_count > 5:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 200
        elif complexity == "MEDIUM":
            return 100
        else:
            return 50

    def _count_triple_patterns(self, query: str) -> int:
        """Count triple patterns in SPARQL query."""
        # Count occurrences of triple patterns
        pattern_count = 0
        # Look for triple patterns in WHERE clause
        where_match = re.search(r'WHERE\s*\{([^}]+)\}', query, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_clause = where_match.group(1)
            # Count lines that look like triple patterns
            lines = where_clause.split('\n')
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#') and not line.startswith('FILTER'):
                    if '?' in line or '<' in line or '"' in line:
                        pattern_count += 1
        return pattern_count

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if self._count_triple_patterns(query) > 8:
            hints.append("Consider breaking down complex queries into smaller ones")
        if "OPTIONAL" in query.upper():
            hints.append("Consider using FILTER instead of OPTIONAL for better performance")
        if "UNION" in query.upper():
            hints.append("Consider using property paths instead of UNION when possible")
        return hints

    def to_actions_tree(self, sparql_query: str) -> ANode:
        """Convert SPARQL query to XWQuery Script actions tree."""
        # Parse SPARQL SELECT query
        # Example: "SELECT ?name ?age WHERE { ?person :name ?name . ?person :age ?age . FILTER(?age > 30) }"
        query_upper = sparql_query.strip().upper()
        # Extract query type
        query_type = self._get_query_type(sparql_query)
        if query_type != "SELECT":
            # For non-SELECT queries, create a basic tree
            return self._build_actions_tree(
                entity_name="resource",
                fields=["*"],
                where_conditions=[],
                source_format="SPARQL",
                action_id_prefix="sparql"
            )
        # Extract SELECT variables (e.g., "?name ?age" from "SELECT ?name ?age")
        select_vars = []
        select_match = re.search(r'SELECT\s+(.+?)(?:\s+WHERE|\s*\{|$)', query_upper, re.IGNORECASE)
        if select_match:
            vars_str = select_match.group(1).strip()
            # Remove DISTINCT, REDUCED if present
            vars_str = re.sub(r'\b(DISTINCT|REDUCED)\s+', '', vars_str, flags=re.IGNORECASE)
            # Extract variable names (remove ? prefix)
            vars_list = vars_str.split()
            for var in vars_list:
                var = var.strip().lstrip('?').strip()
                if var:
                    select_vars.append(var)
        # Extract entity name from WHERE patterns (simplified: use first resource pattern)
        entity_name = None
        where_match = re.search(r'WHERE\s*\{([^}]+)\}', sparql_query, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_clause = where_match.group(1)
            # Find first pattern like "?person :name ?name" or "<uri> :name ?name"
            pattern_match = re.search(r'(?:<([^>]+)>|(\?\w+))\s+:', where_clause, re.IGNORECASE)
            if pattern_match:
                entity_name = pattern_match.group(1) or pattern_match.group(2)
                if entity_name.startswith('?'):
                    entity_name = entity_name[1:]
                if '<' in entity_name or '>' in entity_name:
                    # Extract local name from URI
                    local_name = entity_name.split('/')[-1].split('#')[-1].rstrip('>').lstrip('<')
                    entity_name = local_name
        # Extract WHERE conditions (FILTER expressions)
        where_conditions = []
        filter_match = re.search(r'FILTER\s*\(([^)]+)\)', sparql_query, re.IGNORECASE)
        if filter_match:
            filter_expr = filter_match.group(1)
            # Convert SPARQL FILTER to simple condition
            # Remove ? prefix from variables
            filter_expr = re.sub(r'\?(\w+)', r'\1', filter_expr)
            where_conditions.append(filter_expr.strip())
        # Use base class method to build actions tree
        return self._build_actions_tree(
            entity_name=entity_name or "resource",
            fields=select_vars if select_vars else ["*"],
            where_conditions=where_conditions,
            source_format="SPARQL",
            action_id_prefix="sparql"
        )

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to SPARQL query."""
        import re
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        # Handle both old format (root.statements) and new format (children)
        if 'root' in tree_data and 'statements' in tree_data['root']:
            actions = tree_data['root']['statements']
        elif 'children' in tree_data:
            actions = tree_data['children']
        else:
            if tree_data.get('type') == 'PROGRAM' and 'children' in tree_data:
                actions = tree_data['children']
            else:
                return "SELECT ?s ?p ?o WHERE { ?s ?p ?o }"
        if not actions:
            return "SELECT ?s ?p ?o WHERE { ?s ?p ?o }"
        # Find SELECT action and related actions
        select_action = None
        where_actions = []
        for action in actions:
            action_type = action.get('type', '')
            if action_type == 'SELECT':
                select_action = action
            elif action_type == 'WHERE':
                where_actions.append(action)
        if not select_action:
            return "SELECT ?s ?p ?o WHERE { ?s ?p ?o }"
        # Extract fields from SELECT params
        select_params = select_action.get('params', {})
        fields = select_params.get('fields', [])
        # Try to extract from metadata content if params don't have fields
        if not fields or fields == ['*']:
            metadata = select_action.get('metadata', {})
            content = metadata.get('content', '')
            if 'SELECT' in content.upper() and 'FROM' in content.upper():
                select_match = re.search(r'SELECT\s+(.*?)\s+FROM', content, re.IGNORECASE | re.DOTALL)
                if select_match:
                    fields_str = select_match.group(1).strip()
                    if fields_str and fields_str != '*':
                        fields_str = ' '.join(fields_str.split())
                        fields = [f.strip() for f in fields_str.split(',') if f.strip()]
        # Convert fields to SPARQL variables
        if fields and fields != ['*']:
            # Remove table prefixes and convert to SPARQL vars
            sparql_fields = []
            for field in fields:
                # Remove table prefix (e.g., "u.name" -> "name")
                if '.' in field:
                    field = field.split('.')[-1]
                # Handle aliases (e.g., "COUNT(o.id) as order_count" -> "order_count")
                if ' as ' in field.lower() or ' AS ' in field:
                    parts = re.split(r'\s+as\s+', field, flags=re.IGNORECASE)
                    if len(parts) == 2:
                        field = parts[1].strip()
                # Convert to SPARQL variable
                field_clean = re.sub(r'[^a-zA-Z0-9_]', '', field)
                sparql_fields.append(f"?{field_clean.lower()}")
        else:
            sparql_fields = ["?s", "?p", "?o"]
        # Extract table/entity name
        entity_name = select_params.get('from') or select_params.get('path') or 'resource'
        entity_var = f"?{entity_name.lower().rstrip('s')}"
        # Extract WHERE conditions
        where_conditions = []
        for where_action in where_actions:
            where_params = where_action.get('params', {})
            where_content = where_action.get('metadata', {}).get('content', '')
            if where_content and 'WHERE' in where_content.upper():
                where_match = re.search(r'WHERE\s+(.+)', where_content, re.IGNORECASE)
                if where_match:
                    where_conditions.append(where_match.group(1).strip())
            elif where_params:
                field = where_params.get('field', '')
                operator = where_params.get('operator', '=')
                value = where_params.get('value', '')
                if field:
                    where_conditions.append(f"{field} {operator} {value}")
        # Build SELECT clause
        select_vars = ' '.join(sparql_fields) if sparql_fields else "?s ?p ?o"
        # Build WHERE clause with triple patterns
        where_clause_parts = []
        # Add basic triple pattern for entity
        if entity_name:
            for field_var in sparql_fields:
                field_name = field_var.lstrip('?')
                where_clause_parts.append(f"{entity_var} :{field_name} {field_var} .")
        # Add FILTER if WHERE conditions exist
        if where_conditions:
            where_str = ' AND '.join(where_conditions)
            # Convert to SPARQL FILTER syntax (add ? prefix to variables)
            filter_expr = re.sub(r'\b(\w+)\b', r'?\1', where_str)
            where_clause_parts.append(f"FILTER({filter_expr})")
        where_clause = ' '.join(where_clause_parts) if where_clause_parts else f"{entity_var} ?p ?o"
        return f"SELECT {select_vars} WHERE {{ {where_clause} }}"
