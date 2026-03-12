#!/usr/bin/env python3
"""
Format Mappings for xwquery
Defines AST→QueryAction mapping rules for all 31 query formats.
This enables universal conversion from any query language to QueryAction trees.
Company: eXonware.com
Author: eXonware Backend Team
Version: 0.9.0.2
Generation Date: 11-Oct-2025
"""

from enum import Enum, auto
from typing import Any, Optional, Callable
from dataclasses import dataclass, field
# Assumed internal imports
from exonware.xwsyntax import ParseNode
from exonware.xwquery.contracts import QueryAction
from .ast_utils import find_node_by_type, find_all_nodes_by_type, extract_node_value


class QueryOp(str, Enum):
    """Enumeration of supported query operations."""
    # Standard CRUD
    SELECT = "SELECT"
    INSERT = "INSERT"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    CREATE = "CREATE"
    ALTER = "ALTER"
    DROP = "DROP"
    # Graph / Traversal
    MATCH = "MATCH"
    MERGE = "MERGE"
    TRAVERSAL = "TRAVERSAL"
    ADD_VERTEX = "ADD_VERTEX"
    ADD_EDGE = "ADD_EDGE"
    # API / Search / Logic
    QUERY = "QUERY"
    MUTATION = "MUTATION"
    SUBSCRIPTION = "SUBSCRIPTION"
    SEARCH = "SEARCH"
    INDEX = "INDEX"
    FILTER = "FILTER"
    EXPRESSION = "EXPRESSION"
    PATH = "PATH"
    SCRIPT = "SCRIPT"
    COMMAND = "COMMAND"
    FIND = "FIND"
    # RDF / SPARQL
    CONSTRUCT = "CONSTRUCT"
    ASK = "ASK"
    DESCRIBE = "DESCRIBE"
@dataclass

class MappingRule:
    """A single AST→QueryAction mapping rule."""
    ast_pattern: str
    query_action_type: QueryOp | str
    extraction_func: Callable[[ParseNode], dict[str, Any]]
    priority: int = 0
@dataclass

class FormatMapping:
    """Complete mapping configuration for a query format."""
    format_name: str
    description: str
    rules: list[MappingRule]
    default_operation: QueryOp | str = QueryOp.SELECT
    supported_operations: list[QueryOp | str] = field(default_factory=lambda: [
        QueryOp.SELECT, QueryOp.INSERT, QueryOp.UPDATE, QueryOp.DELETE
    ])


class FormatMappingRegistry:
    """Registry for all format mappings."""

    def __init__(self):
        self._mappings: dict[str, FormatMapping] = {}
        self._initialize_mappings()

    def get_mapping(self, format_name: str) -> Optional[FormatMapping]:
        """Get mapping for a specific format (case-insensitive)."""
        return self._mappings.get(format_name.lower())

    def get_all_formats(self) -> list[str]:
        """Get list of all supported formats."""
        return list(self._mappings.keys())

    def _register(self, mapping: FormatMapping):
        """Helper to register a mapping."""
        self._mappings[mapping.format_name.lower()] = mapping

    def _initialize_mappings(self):
        """Initialize all format mappings."""
        self._init_sql_family()
        self._init_graph_family()
        self._init_document_family()
        self._init_json_family()
        self._init_timeseries_family()
        self._init_api_family()
        self._init_other_formats()
    # ==========================================
    # 1. SQL Family
    # ==========================================

    def _init_sql_family(self):
        # Base SQL
        self._register(FormatMapping(
            format_name="sql",
            description="Standard SQL query language",
            supported_operations=[QueryOp.SELECT, QueryOp.INSERT, QueryOp.UPDATE, QueryOp.DELETE, QueryOp.CREATE, QueryOp.ALTER, QueryOp.DROP],
            rules=[
                MappingRule("select_statement", QueryOp.SELECT, self._extract_sql_select),
                MappingRule("insert_statement", QueryOp.INSERT, self._extract_sql_insert),
                MappingRule("update_statement", QueryOp.UPDATE, self._extract_sql_update),
                MappingRule("delete_statement", QueryOp.DELETE, self._extract_sql_delete),
                MappingRule("create_statement", QueryOp.CREATE, self._extract_sql_create),
                MappingRule("alter_statement", QueryOp.ALTER, self._extract_sql_alter),
                MappingRule("drop_statement", QueryOp.DROP, self._extract_sql_drop),
            ]
        ))
        # Dialects re-using SQL logic
        # PartiQL & N1QL & CQL (Full CRUD)
        for fmt, desc in [
            ("partiql", "PartiQL - SQL for PartiQL data"),
            ("n1ql", "N1QL - SQL for JSON"),
            ("cql", "CQL - Cassandra Query Language")
        ]:
            self._register(FormatMapping(
                format_name=fmt,
                description=desc,
                supported_operations=[QueryOp.SELECT, QueryOp.INSERT, QueryOp.UPDATE, QueryOp.DELETE],
                rules=[
                    MappingRule("select_statement", QueryOp.SELECT, self._extract_sql_select),
                    MappingRule("insert_statement", QueryOp.INSERT, self._extract_sql_insert),
                    MappingRule("update_statement", QueryOp.UPDATE, self._extract_sql_update),
                    MappingRule("delete_statement", QueryOp.DELETE, self._extract_sql_delete),
                ]
            ))
        # HiveQL (Select, Insert, Create)
        self._register(FormatMapping(
            format_name="hiveql",
            description="HiveQL - SQL for Hadoop",
            supported_operations=[QueryOp.SELECT, QueryOp.INSERT, QueryOp.CREATE],
            rules=[
                MappingRule("select_statement", QueryOp.SELECT, self._extract_sql_select),
                MappingRule("insert_statement", QueryOp.INSERT, self._extract_sql_insert),
                MappingRule("create_statement", QueryOp.CREATE, self._extract_sql_create),
            ]
        ))
        # HQL (Select, Update, Delete)
        self._register(FormatMapping(
            format_name="hql",
            description="HQL - Hibernate Query Language",
            supported_operations=[QueryOp.SELECT, QueryOp.UPDATE, QueryOp.DELETE],
            rules=[
                MappingRule("select_statement", QueryOp.SELECT, self._extract_sql_select),
                MappingRule("update_statement", QueryOp.UPDATE, self._extract_sql_update),
                MappingRule("delete_statement", QueryOp.DELETE, self._extract_sql_delete),
            ]
        ))
        # KQL (Special)
        self._register(FormatMapping(
            format_name="kql",
            description="KQL - Kusto Query Language",
            supported_operations=[QueryOp.SELECT, QueryOp.COMMAND],
            rules=[
                MappingRule("query_statement", QueryOp.SELECT, self._standard_extract(QueryOp.SELECT)),
                MappingRule("command_statement", QueryOp.COMMAND, self._standard_extract(QueryOp.COMMAND, key="command")),
            ]
        ))
    # ==========================================
    # 2. Graph Family
    # ==========================================

    def _init_graph_family(self):
        self._register(FormatMapping(
            format_name="cypher",
            description="Cypher - Graph query language",
            supported_operations=[QueryOp.MATCH, QueryOp.CREATE, QueryOp.MERGE, QueryOp.DELETE],
            rules=[
                MappingRule("match_statement", QueryOp.MATCH, self._standard_extract(QueryOp.MATCH, key="pattern")),
                MappingRule("create_statement", QueryOp.CREATE, self._standard_extract(QueryOp.CREATE, key="pattern")),
                MappingRule("merge_statement", QueryOp.MERGE, self._standard_extract(QueryOp.MERGE, key="pattern")),
                MappingRule("delete_statement", QueryOp.DELETE, self._standard_extract(QueryOp.DELETE, key="pattern")),
            ]
        ))
        self._register(FormatMapping(
            format_name="gremlin",
            description="Gremlin - Graph traversal language",
            supported_operations=[QueryOp.TRAVERSAL, QueryOp.ADD_VERTEX, QueryOp.ADD_EDGE],
            rules=[
                MappingRule("traversal", QueryOp.TRAVERSAL, self._standard_extract(QueryOp.TRAVERSAL, key="steps")),
                MappingRule("add_vertex", QueryOp.ADD_VERTEX, self._standard_extract(QueryOp.ADD_VERTEX, key="vertex")),
                MappingRule("add_edge", QueryOp.ADD_EDGE, self._standard_extract(QueryOp.ADD_EDGE, key="edge")),
            ]
        ))
        self._register(FormatMapping(
            format_name="sparql",
            description="SPARQL - RDF query language",
            supported_operations=[QueryOp.SELECT, QueryOp.CONSTRUCT, QueryOp.ASK, QueryOp.DESCRIBE],
            rules=[
                MappingRule("select_query", QueryOp.SELECT, self._standard_extract(QueryOp.SELECT)),
                MappingRule("construct_query", QueryOp.CONSTRUCT, self._standard_extract(QueryOp.CONSTRUCT)),
                MappingRule("ask_query", QueryOp.ASK, self._standard_extract(QueryOp.ASK)),
                MappingRule("describe_query", QueryOp.DESCRIBE, self._standard_extract(QueryOp.DESCRIBE)),
            ]
        ))
        self._register(FormatMapping(
            format_name="gql",
            description="GQL - Graph Query Language",
            supported_operations=[QueryOp.QUERY, QueryOp.MUTATION],
            rules=[
                MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY)),
                MappingRule("mutation", QueryOp.MUTATION, self._standard_extract(QueryOp.MUTATION, key="mutation")),
            ]
        ))
    # ==========================================
    # 3. Document Family (XML/Document)
    # ==========================================

    def _init_document_family(self):
        self._register(FormatMapping(
            format_name="xquery",
            description="XQuery - XML query language",
            supported_operations=[QueryOp.QUERY, QueryOp.UPDATE],
            rules=[
                MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY)),
                MappingRule("update", QueryOp.UPDATE, self._standard_extract(QueryOp.UPDATE, key="update")),
            ]
        ))
        self._register(FormatMapping(
            format_name="xml_query",
            description="XML Query - XML query language",
            supported_operations=[QueryOp.QUERY],
            rules=[MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY))]
        ))
        self._register(FormatMapping(
            format_name="xpath",
            description="XPath - XML path language",
            supported_operations=[QueryOp.PATH],
            rules=[MappingRule("path_expression", QueryOp.PATH, self._standard_extract(QueryOp.PATH, key="path"))]
        ))
        self._register(FormatMapping(
            format_name="mongodb",
            description="MongoDB - Document database queries",
            supported_operations=[QueryOp.FIND, QueryOp.INSERT, QueryOp.UPDATE, QueryOp.DELETE],
            rules=[
                MappingRule("find", QueryOp.FIND, self._standard_extract(QueryOp.FIND)),
                MappingRule("insert", QueryOp.INSERT, self._standard_extract(QueryOp.INSERT, key="document")),
                MappingRule("update", QueryOp.UPDATE, self._standard_extract(QueryOp.UPDATE)),
                MappingRule("delete", QueryOp.DELETE, self._standard_extract(QueryOp.DELETE)),
            ]
        ))
        self._register(FormatMapping(
            format_name="reql",
            description="ReQL - RethinkDB Query Language",
            supported_operations=[QueryOp.FIND, QueryOp.INSERT, QueryOp.UPDATE, QueryOp.DELETE, QueryOp.QUERY],
            rules=[
                MappingRule("filter", QueryOp.FIND, self._standard_extract(QueryOp.FIND)),
                MappingRule("get", QueryOp.FIND, self._standard_extract(QueryOp.FIND)),
                MappingRule("get_all", QueryOp.FIND, self._standard_extract(QueryOp.FIND)),
                MappingRule("insert", QueryOp.INSERT, self._standard_extract(QueryOp.INSERT, key="document")),
                MappingRule("update", QueryOp.UPDATE, self._standard_extract(QueryOp.UPDATE)),
                MappingRule("delete", QueryOp.DELETE, self._standard_extract(QueryOp.DELETE)),
                MappingRule("map", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY)),
                MappingRule("reduce", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY)),
            ]
        ))
    # ==========================================
    # 4. JSON Family
    # ==========================================

    def _init_json_family(self):
        self._register(FormatMapping(
            format_name="jmespath",
            description="JMESPath - JSON query language",
            supported_operations=[QueryOp.EXPRESSION],
            rules=[MappingRule("expression", QueryOp.EXPRESSION, self._standard_extract(QueryOp.EXPRESSION, key="expression"))]
        ))
        self._register(FormatMapping(
            format_name="jq",
            description="JQ - JSON processor",
            supported_operations=[QueryOp.FILTER],
            rules=[MappingRule("filter", QueryOp.FILTER, self._standard_extract(QueryOp.FILTER, key="filter"))]
        ))
        # JSONiq & JSON Query
        for fmt, desc in [
            ("jsoniq", "JSONiq - JSON query language"),
            ("json_query", "JSON Query - JSON query language")
        ]:
            self._register(FormatMapping(
                format_name=fmt,
                description=desc,
                supported_operations=[QueryOp.QUERY],
                rules=[MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY))]
            ))
    # ==========================================
    # 5. Time-Series Family
    # ==========================================

    def _init_timeseries_family(self):
        for fmt in ["promql", "logql", "flux"]:
            self._register(FormatMapping(
                format_name=fmt,
                description=f"{fmt.upper()} - Time series query",
                supported_operations=[QueryOp.QUERY],
                rules=[MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY))]
            ))
    # ==========================================
    # 6. API Family
    # ==========================================

    def _init_api_family(self):
        self._register(FormatMapping(
            format_name="graphql",
            description="GraphQL - API query language",
            supported_operations=[QueryOp.QUERY, QueryOp.MUTATION, QueryOp.SUBSCRIPTION],
            rules=[
                MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY)),
                MappingRule("mutation", QueryOp.MUTATION, self._standard_extract(QueryOp.MUTATION, key="mutation")),
                MappingRule("subscription", QueryOp.SUBSCRIPTION, self._standard_extract(QueryOp.SUBSCRIPTION, key="subscription")),
            ]
        ))
        self._register(FormatMapping(
            format_name="rql",
            description="RQL - Resource Query Language for RESTful APIs",
            supported_operations=[QueryOp.FILTER, QueryOp.QUERY, QueryOp.SELECT],
            rules=[
                MappingRule("filter", QueryOp.FILTER, self._standard_extract(QueryOp.FILTER, key="filter")),
                MappingRule("select", QueryOp.SELECT, self._standard_extract(QueryOp.SELECT, key="fields")),
                MappingRule("sort", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY, key="sort")),
                MappingRule("limit", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY, key="limit")),
            ]
        ))
    # ==========================================
    # 7. Other Formats
    # ==========================================

    def _init_other_formats(self):
        self._register(FormatMapping(
            format_name="elasticsearch",
            description="Elasticsearch - Search engine queries",
            supported_operations=[QueryOp.SEARCH, QueryOp.INDEX, QueryOp.UPDATE, QueryOp.DELETE],
            rules=[
                MappingRule("search", QueryOp.SEARCH, self._standard_extract(QueryOp.SEARCH)),
                MappingRule("index", QueryOp.INDEX, self._standard_extract(QueryOp.INDEX, key="document")),
                MappingRule("update", QueryOp.UPDATE, self._standard_extract(QueryOp.UPDATE)),
                MappingRule("delete", QueryOp.DELETE, self._standard_extract(QueryOp.DELETE)),
            ]
        ))
        self._register(FormatMapping(
            format_name="pig",
            description="Pig - Data flow language",
            supported_operations=[QueryOp.SCRIPT],
            rules=[MappingRule("script", QueryOp.SCRIPT, self._standard_extract(QueryOp.SCRIPT, key="script"))]
        ))
        self._register(FormatMapping(
            format_name="xwqueryscript",
            description="XWQueryScript - Universal query language",
            supported_operations=[QueryOp.SCRIPT],
            rules=[MappingRule("script", QueryOp.SCRIPT, self._standard_extract(QueryOp.SCRIPT, key="script"))]
        ))
        # Simple Query-only formats
        for fmt, desc in [
            ("eql", "EQL - Event Query Language"),
            ("datalog", "Datalog - Logic programming language"),
            ("linq", "LINQ - Language Integrated Query")
        ]:
            self._register(FormatMapping(
                format_name=fmt,
                description=desc,
                supported_operations=[QueryOp.QUERY],
                rules=[MappingRule("query", QueryOp.QUERY, self._standard_extract(QueryOp.QUERY))]
            ))
    # ==========================================
    # Extraction Logic & Factories
    # ==========================================

    def _standard_extract(self, operation: QueryOp | str, key: str = "query") -> Callable[[ParseNode], dict[str, Any]]:
        """
        Factory to create standard extractors for simple formats.
        Reduces boilerplate for 50+ extractors that just wrap a single AST value.
        """
        def extractor(ast: ParseNode) -> dict[str, Any]:
            return {"operation": operation, key: extract_node_value(ast)}
        return extractor
    # --- SQL Extraction Family (Complex logic kept explicit) ---

    def _extract_sql_select(self, ast: ParseNode) -> dict[str, Any]:
        """Extract SQL SELECT data."""
        return {
            "operation": QueryOp.SELECT,
            "columns": self._extract_column_list(ast),
            "tables": self._extract_table_list(ast),
            "where": self._extract_where_clause(ast),
            "group_by": self._extract_group_by(ast),
            "having": self._extract_having(ast),
            "order_by": self._extract_order_by(ast),
            "limit": self._extract_limit(ast)
        }

    def _extract_sql_insert(self, ast: ParseNode) -> dict[str, Any]:
        return {
            "operation": QueryOp.INSERT,
            "table": self._extract_table_name(ast),
            "columns": self._extract_column_list(ast),
            "values": self._extract_values(ast)
        }

    def _extract_sql_update(self, ast: ParseNode) -> dict[str, Any]:
        return {
            "operation": QueryOp.UPDATE,
            "table": self._extract_table_name(ast),
            "assignments": self._extract_assignments(ast),
            "where": self._extract_where_clause(ast)
        }

    def _extract_sql_delete(self, ast: ParseNode) -> dict[str, Any]:
        return {
            "operation": QueryOp.DELETE,
            "table": self._extract_table_name(ast),
            "where": self._extract_where_clause(ast)
        }

    def _extract_sql_create(self, ast: ParseNode) -> dict[str, Any]:
        return {
            "operation": QueryOp.CREATE,
            "object_type": self._extract_create_type(ast),
            "object_name": self._extract_object_name(ast),
            "definition": self._extract_create_definition(ast)
        }

    def _extract_sql_alter(self, ast: ParseNode) -> dict[str, Any]:
        return {
            "operation": QueryOp.ALTER,
            "table": self._extract_table_name(ast),
            "action": self._extract_alter_action(ast)
        }

    def _extract_sql_drop(self, ast: ParseNode) -> dict[str, Any]:
        return {
            "operation": QueryOp.DROP,
            "object_type": self._extract_drop_type(ast),
            "object_name": self._extract_object_name(ast)
        }
    # ==========================================
    # Generic Helpers (Preserved)
    # ==========================================

    def _extract_column_list(self, ast: ParseNode) -> list[str]:
        columns = []
        for col_node in find_all_nodes_by_type(ast, "column_ref"):
            if val := extract_node_value(col_node):
                columns.append(val)
        return columns

    def _extract_table_list(self, ast: ParseNode) -> list[str]:
        tables = []
        for table_node in find_all_nodes_by_type(ast, "table_ref"):
            if val := extract_node_value(table_node):
                tables.append(val)
        return tables

    def _extract_table_name(self, ast: ParseNode) -> str:
        if table_node := find_node_by_type(ast, "table_ref"):
            return extract_node_value(table_node) or "unknown_table"
        return "unknown_table"

    def _extract_where_clause(self, ast: ParseNode) -> Optional[dict[str, Any]]:
        if where_node := find_node_by_type(ast, "where_clause"):
            return {"condition": extract_node_value(where_node)}
        return None

    def _extract_group_by(self, ast: ParseNode) -> Optional[list[str]]:
        if group_by_node := find_node_by_type(ast, "group_by_clause"):
            return self._extract_column_list(group_by_node)
        return None

    def _extract_having(self, ast: ParseNode) -> Optional[dict[str, Any]]:
        if having_node := find_node_by_type(ast, "having_clause"):
            return {"condition": extract_node_value(having_node)}
        return None

    def _extract_order_by(self, ast: ParseNode) -> Optional[list[dict[str, Any]]]:
        if order_by_node := find_node_by_type(ast, "order_by_clause"):
            return [{
                "column": extract_node_value(item),
                "direction": "ASC"
            } for item in find_all_nodes_by_type(order_by_node, "order_item")]
        return None

    def _extract_limit(self, ast: ParseNode) -> Optional[int]:
        if limit_node := find_node_by_type(ast, "limit_clause"):
            for node in limit_node.children:
                if node.type == "NUMBER" and node.value:
                    try:
                        return int(node.value)
                    except ValueError:
                        continue
        return None

    def _extract_values(self, ast: ParseNode) -> list[list[Any]]:
        values = []
        if values_node := find_node_by_type(ast, "values_clause"):
            for value_list in find_all_nodes_by_type(values_node, "value_list"):
                row = []
                for value_node in find_all_nodes_by_type(value_list, "value"):
                    val = extract_node_value(value_node)
                    if val is not None:
                        row.append(val)
                if row:
                    values.append(row)
        return values

    def _extract_assignments(self, ast: ParseNode) -> list[dict[str, Any]]:
        assignments = []
        for assign_node in find_all_nodes_by_type(ast, "assignment"):
            col_node = find_node_by_type(assign_node, "column_ref")
            val_node = find_node_by_type(assign_node, "value")
            if col_node and val_node:
                col_name = extract_node_value(col_node)
                val = extract_node_value(val_node)
                if col_name and val is not None:
                    assignments.append({"column": col_name, "value": val})
        return assignments

    def _extract_create_type(self, ast: ParseNode) -> str:
        for node in ast.children:
            if node.type in ["TABLE", "INDEX", "VIEW", "DATABASE", "SCHEMA"]:
                return node.type
        return "TABLE"

    def _extract_object_name(self, ast: ParseNode) -> str:
        if name_node := find_node_by_type(ast, "object_name"):
            return extract_node_value(name_node) or "unknown_object"
        return "unknown_object"

    def _extract_create_definition(self, ast: ParseNode) -> dict[str, Any]:
        definition = {}
        columns = []
        for col_def in find_all_nodes_by_type(ast, "column_definition"):
            if name := extract_node_value(col_def):
                columns.append(name)
        if columns:
            definition["columns"] = columns
        return definition

    def _extract_alter_action(self, ast: ParseNode) -> dict[str, Any]:
        if action_node := find_node_by_type(ast, "alter_action"):
            if action_type := extract_node_value(action_node):
                return {"type": action_type}
        return {}

    def _extract_drop_type(self, ast: ParseNode) -> str:
        for node in ast.children:
            if node.type in ["TABLE", "INDEX", "VIEW", "DATABASE", "SCHEMA"]:
                return node.type
        return "TABLE"
# Global registry instance
format_mapping_registry = FormatMappingRegistry()
