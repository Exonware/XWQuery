#!/usr/bin/env python3
"""
Format Mappings for xwquery

Defines AST→QueryAction mapping rules for all 31 query formats.
This enables universal conversion from any query language to QueryAction trees.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 11-Oct-2025
"""

from typing import Any, Dict, List, Optional, Union, Callable
from dataclasses import dataclass
from exonware.xwsyntax import ASTNode
from exonware.xwquery.contracts import QueryAction
from .ast_utils import find_node_by_type, find_all_nodes_by_type, extract_node_value


@dataclass
class MappingRule:
    """A single AST→QueryAction mapping rule."""
    ast_pattern: str  # AST node type pattern
    query_action_type: str  # Target QueryAction type
    extraction_func: Callable[[ASTNode], Dict[str, Any]]  # Function to extract data
    priority: int = 0  # Rule priority (higher = more specific)


@dataclass
class FormatMapping:
    """Complete mapping configuration for a query format."""
    format_name: str
    description: str
    rules: List[MappingRule]
    default_operation: str = "SELECT"
    supported_operations: List[str] = None
    
    def __post_init__(self):
        if self.supported_operations is None:
            self.supported_operations = ["SELECT", "INSERT", "UPDATE", "DELETE"]


class FormatMappingRegistry:
    """Registry for all format mappings."""
    
    def __init__(self):
        self._mappings: Dict[str, FormatMapping] = {}
        self._initialize_mappings()
    
    def get_mapping(self, format_name: str) -> Optional[FormatMapping]:
        """Get mapping for a specific format."""
        return self._mappings.get(format_name.lower())
    
    def get_all_formats(self) -> List[str]:
        """Get list of all supported formats."""
        return list(self._mappings.keys())
    
    def _initialize_mappings(self):
        """Initialize all format mappings."""
        # SQL-like formats
        self._mappings["sql"] = self._create_sql_mapping()
        self._mappings["partiql"] = self._create_partiql_mapping()
        self._mappings["n1ql"] = self._create_n1ql_mapping()
        self._mappings["hiveql"] = self._create_hiveql_mapping()
        self._mappings["kql"] = self._create_kql_mapping()
        self._mappings["hql"] = self._create_hql_mapping()
        
        # Graph query formats
        self._mappings["cypher"] = self._create_cypher_mapping()
        self._mappings["gremlin"] = self._create_gremlin_mapping()
        self._mappings["sparql"] = self._create_sparql_mapping()
        self._mappings["gql"] = self._create_gql_mapping()
        
        # XML/Document formats
        self._mappings["xquery"] = self._create_xquery_mapping()
        self._mappings["xml_query"] = self._create_xml_query_mapping()
        self._mappings["xpath"] = self._create_xpath_mapping()
        
        # JSON query formats
        self._mappings["jmespath"] = self._create_jmespath_mapping()
        self._mappings["jq"] = self._create_jq_mapping()
        self._mappings["jsoniq"] = self._create_jsoniq_mapping()
        self._mappings["json_query"] = self._create_json_query_mapping()
        
        # API query formats
        self._mappings["graphql"] = self._create_graphql_mapping()
        
        # Time-series formats
        self._mappings["promql"] = self._create_promql_mapping()
        self._mappings["logql"] = self._create_logql_mapping()
        self._mappings["flux"] = self._create_flux_mapping()
        
        # Other formats
        self._mappings["eql"] = self._create_eql_mapping()
        self._mappings["datalog"] = self._create_datalog_mapping()
        self._mappings["pig"] = self._create_pig_mapping()
        self._mappings["linq"] = self._create_linq_mapping()
        self._mappings["mongodb"] = self._create_mongodb_mapping()
        self._mappings["cql"] = self._create_cql_mapping()
        self._mappings["elasticsearch"] = self._create_elasticsearch_mapping()
        self._mappings["xwqueryscript"] = self._create_xwqueryscript_mapping()
    
    # SQL-like format mappings
    def _create_sql_mapping(self) -> FormatMapping:
        """Create SQL mapping."""
        return FormatMapping(
            format_name="sql",
            description="Standard SQL query language",
            rules=[
                MappingRule("select_statement", "SELECT", self._extract_sql_select),
                MappingRule("insert_statement", "INSERT", self._extract_sql_insert),
                MappingRule("update_statement", "UPDATE", self._extract_sql_update),
                MappingRule("delete_statement", "DELETE", self._extract_sql_delete),
                MappingRule("create_statement", "CREATE", self._extract_sql_create),
                MappingRule("alter_statement", "ALTER", self._extract_sql_alter),
                MappingRule("drop_statement", "DROP", self._extract_sql_drop),
            ],
            supported_operations=["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP"]
        )
    
    def _create_partiql_mapping(self) -> FormatMapping:
        """Create PartiQL mapping."""
        return FormatMapping(
            format_name="partiql",
            description="PartiQL - SQL for PartiQL data",
            rules=[
                MappingRule("select_statement", "SELECT", self._extract_partiql_select),
                MappingRule("insert_statement", "INSERT", self._extract_partiql_insert),
                MappingRule("update_statement", "UPDATE", self._extract_partiql_update),
                MappingRule("delete_statement", "DELETE", self._extract_partiql_delete),
            ],
            supported_operations=["SELECT", "INSERT", "UPDATE", "DELETE"]
        )
    
    def _create_n1ql_mapping(self) -> FormatMapping:
        """Create N1QL mapping."""
        return FormatMapping(
            format_name="n1ql",
            description="N1QL - SQL for JSON",
            rules=[
                MappingRule("select_statement", "SELECT", self._extract_n1ql_select),
                MappingRule("insert_statement", "INSERT", self._extract_n1ql_insert),
                MappingRule("update_statement", "UPDATE", self._extract_n1ql_update),
                MappingRule("delete_statement", "DELETE", self._extract_n1ql_delete),
            ],
            supported_operations=["SELECT", "INSERT", "UPDATE", "DELETE"]
        )
    
    def _create_hiveql_mapping(self) -> FormatMapping:
        """Create HiveQL mapping."""
        return FormatMapping(
            format_name="hiveql",
            description="HiveQL - SQL for Hadoop",
            rules=[
                MappingRule("select_statement", "SELECT", self._extract_hiveql_select),
                MappingRule("insert_statement", "INSERT", self._extract_hiveql_insert),
                MappingRule("create_statement", "CREATE", self._extract_hiveql_create),
            ],
            supported_operations=["SELECT", "INSERT", "CREATE"]
        )
    
    def _create_kql_mapping(self) -> FormatMapping:
        """Create KQL mapping."""
        return FormatMapping(
            format_name="kql",
            description="KQL - Kusto Query Language",
            rules=[
                MappingRule("query_statement", "SELECT", self._extract_kql_query),
                MappingRule("command_statement", "COMMAND", self._extract_kql_command),
            ],
            supported_operations=["SELECT", "COMMAND"]
        )
    
    def _create_hql_mapping(self) -> FormatMapping:
        """Create HQL mapping."""
        return FormatMapping(
            format_name="hql",
            description="HQL - Hibernate Query Language",
            rules=[
                MappingRule("select_statement", "SELECT", self._extract_hql_select),
                MappingRule("update_statement", "UPDATE", self._extract_hql_update),
                MappingRule("delete_statement", "DELETE", self._extract_hql_delete),
            ],
            supported_operations=["SELECT", "UPDATE", "DELETE"]
        )
    
    # Graph query format mappings
    def _create_cypher_mapping(self) -> FormatMapping:
        """Create Cypher mapping."""
        return FormatMapping(
            format_name="cypher",
            description="Cypher - Graph query language",
            rules=[
                MappingRule("match_statement", "MATCH", self._extract_cypher_match),
                MappingRule("create_statement", "CREATE", self._extract_cypher_create),
                MappingRule("merge_statement", "MERGE", self._extract_cypher_merge),
                MappingRule("delete_statement", "DELETE", self._extract_cypher_delete),
            ],
            supported_operations=["MATCH", "CREATE", "MERGE", "DELETE"]
        )
    
    def _create_gremlin_mapping(self) -> FormatMapping:
        """Create Gremlin mapping."""
        return FormatMapping(
            format_name="gremlin",
            description="Gremlin - Graph traversal language",
            rules=[
                MappingRule("traversal", "TRAVERSAL", self._extract_gremlin_traversal),
                MappingRule("add_vertex", "ADD_VERTEX", self._extract_gremlin_add_vertex),
                MappingRule("add_edge", "ADD_EDGE", self._extract_gremlin_add_edge),
            ],
            supported_operations=["TRAVERSAL", "ADD_VERTEX", "ADD_EDGE"]
        )
    
    def _create_sparql_mapping(self) -> FormatMapping:
        """Create SPARQL mapping."""
        return FormatMapping(
            format_name="sparql",
            description="SPARQL - RDF query language",
            rules=[
                MappingRule("select_query", "SELECT", self._extract_sparql_select),
                MappingRule("construct_query", "CONSTRUCT", self._extract_sparql_construct),
                MappingRule("ask_query", "ASK", self._extract_sparql_ask),
                MappingRule("describe_query", "DESCRIBE", self._extract_sparql_describe),
            ],
            supported_operations=["SELECT", "CONSTRUCT", "ASK", "DESCRIBE"]
        )
    
    def _create_gql_mapping(self) -> FormatMapping:
        """Create GQL mapping."""
        return FormatMapping(
            format_name="gql",
            description="GQL - Graph Query Language",
            rules=[
                MappingRule("query", "QUERY", self._extract_gql_query),
                MappingRule("mutation", "MUTATION", self._extract_gql_mutation),
            ],
            supported_operations=["QUERY", "MUTATION"]
        )
    
    # XML/Document format mappings
    def _create_xquery_mapping(self) -> FormatMapping:
        """Create XQuery mapping."""
        return FormatMapping(
            format_name="xquery",
            description="XQuery - XML query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_xquery_query),
                MappingRule("update", "UPDATE", self._extract_xquery_update),
            ],
            supported_operations=["QUERY", "UPDATE"]
        )
    
    def _create_xml_query_mapping(self) -> FormatMapping:
        """Create XML Query mapping."""
        return FormatMapping(
            format_name="xml_query",
            description="XML Query - XML query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_xml_query_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_xpath_mapping(self) -> FormatMapping:
        """Create XPath mapping."""
        return FormatMapping(
            format_name="xpath",
            description="XPath - XML path language",
            rules=[
                MappingRule("path_expression", "PATH", self._extract_xpath_path),
            ],
            supported_operations=["PATH"]
        )
    
    # JSON query format mappings
    def _create_jmespath_mapping(self) -> FormatMapping:
        """Create JMESPath mapping."""
        return FormatMapping(
            format_name="jmespath",
            description="JMESPath - JSON query language",
            rules=[
                MappingRule("expression", "EXPRESSION", self._extract_jmespath_expression),
            ],
            supported_operations=["EXPRESSION"]
        )
    
    def _create_jq_mapping(self) -> FormatMapping:
        """Create JQ mapping."""
        return FormatMapping(
            format_name="jq",
            description="JQ - JSON processor",
            rules=[
                MappingRule("filter", "FILTER", self._extract_jq_filter),
            ],
            supported_operations=["FILTER"]
        )
    
    def _create_jsoniq_mapping(self) -> FormatMapping:
        """Create JSONiq mapping."""
        return FormatMapping(
            format_name="jsoniq",
            description="JSONiq - JSON query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_jsoniq_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_json_query_mapping(self) -> FormatMapping:
        """Create JSON Query mapping."""
        return FormatMapping(
            format_name="json_query",
            description="JSON Query - JSON query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_json_query_query),
            ],
            supported_operations=["QUERY"]
        )
    
    # API query format mappings
    def _create_graphql_mapping(self) -> FormatMapping:
        """Create GraphQL mapping."""
        return FormatMapping(
            format_name="graphql",
            description="GraphQL - API query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_graphql_query),
                MappingRule("mutation", "MUTATION", self._extract_graphql_mutation),
                MappingRule("subscription", "SUBSCRIPTION", self._extract_graphql_subscription),
            ],
            supported_operations=["QUERY", "MUTATION", "SUBSCRIPTION"]
        )
    
    # Time-series format mappings
    def _create_promql_mapping(self) -> FormatMapping:
        """Create PromQL mapping."""
        return FormatMapping(
            format_name="promql",
            description="PromQL - Prometheus query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_promql_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_logql_mapping(self) -> FormatMapping:
        """Create LogQL mapping."""
        return FormatMapping(
            format_name="logql",
            description="LogQL - Grafana Loki query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_logql_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_flux_mapping(self) -> FormatMapping:
        """Create Flux mapping."""
        return FormatMapping(
            format_name="flux",
            description="Flux - InfluxDB query language",
            rules=[
                MappingRule("query", "QUERY", self._extract_flux_query),
            ],
            supported_operations=["QUERY"]
        )
    
    # Other format mappings
    def _create_eql_mapping(self) -> FormatMapping:
        """Create EQL mapping."""
        return FormatMapping(
            format_name="eql",
            description="EQL - Event Query Language",
            rules=[
                MappingRule("query", "QUERY", self._extract_eql_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_datalog_mapping(self) -> FormatMapping:
        """Create Datalog mapping."""
        return FormatMapping(
            format_name="datalog",
            description="Datalog - Logic programming language",
            rules=[
                MappingRule("query", "QUERY", self._extract_datalog_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_pig_mapping(self) -> FormatMapping:
        """Create Pig mapping."""
        return FormatMapping(
            format_name="pig",
            description="Pig - Data flow language",
            rules=[
                MappingRule("script", "SCRIPT", self._extract_pig_script),
            ],
            supported_operations=["SCRIPT"]
        )
    
    def _create_linq_mapping(self) -> FormatMapping:
        """Create LINQ mapping."""
        return FormatMapping(
            format_name="linq",
            description="LINQ - Language Integrated Query",
            rules=[
                MappingRule("query", "QUERY", self._extract_linq_query),
            ],
            supported_operations=["QUERY"]
        )
    
    def _create_mongodb_mapping(self) -> FormatMapping:
        """Create MongoDB mapping."""
        return FormatMapping(
            format_name="mongodb",
            description="MongoDB - Document database queries",
            rules=[
                MappingRule("find", "FIND", self._extract_mongodb_find),
                MappingRule("insert", "INSERT", self._extract_mongodb_insert),
                MappingRule("update", "UPDATE", self._extract_mongodb_update),
                MappingRule("delete", "DELETE", self._extract_mongodb_delete),
            ],
            supported_operations=["FIND", "INSERT", "UPDATE", "DELETE"]
        )
    
    def _create_cql_mapping(self) -> FormatMapping:
        """Create CQL mapping."""
        return FormatMapping(
            format_name="cql",
            description="CQL - Cassandra Query Language",
            rules=[
                MappingRule("select", "SELECT", self._extract_cql_select),
                MappingRule("insert", "INSERT", self._extract_cql_insert),
                MappingRule("update", "UPDATE", self._extract_cql_update),
                MappingRule("delete", "DELETE", self._extract_cql_delete),
            ],
            supported_operations=["SELECT", "INSERT", "UPDATE", "DELETE"]
        )
    
    def _create_elasticsearch_mapping(self) -> FormatMapping:
        """Create Elasticsearch mapping."""
        return FormatMapping(
            format_name="elasticsearch",
            description="Elasticsearch - Search engine queries",
            rules=[
                MappingRule("search", "SEARCH", self._extract_elasticsearch_search),
                MappingRule("index", "INDEX", self._extract_elasticsearch_index),
                MappingRule("update", "UPDATE", self._extract_elasticsearch_update),
                MappingRule("delete", "DELETE", self._extract_elasticsearch_delete),
            ],
            supported_operations=["SEARCH", "INDEX", "UPDATE", "DELETE"]
        )
    
    def _create_xwqueryscript_mapping(self) -> FormatMapping:
        """Create XWQueryScript mapping."""
        return FormatMapping(
            format_name="xwqueryscript",
            description="XWQueryScript - Universal query language",
            rules=[
                MappingRule("script", "SCRIPT", self._extract_xwqueryscript_script),
            ],
            supported_operations=["SCRIPT"]
        )
    
    # Extraction methods for each format
    def _extract_sql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL SELECT data."""
        return {
            "operation": "SELECT",
            "columns": self._extract_column_list(ast),
            "tables": self._extract_table_list(ast),
            "where": self._extract_where_clause(ast),
            "group_by": self._extract_group_by(ast),
            "having": self._extract_having(ast),
            "order_by": self._extract_order_by(ast),
            "limit": self._extract_limit(ast)
        }
    
    def _extract_sql_insert(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL INSERT data."""
        return {
            "operation": "INSERT",
            "table": self._extract_table_name(ast),
            "columns": self._extract_column_list(ast),
            "values": self._extract_values(ast)
        }
    
    def _extract_sql_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL UPDATE data."""
        return {
            "operation": "UPDATE",
            "table": self._extract_table_name(ast),
            "assignments": self._extract_assignments(ast),
            "where": self._extract_where_clause(ast)
        }
    
    def _extract_sql_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL DELETE data."""
        return {
            "operation": "DELETE",
            "table": self._extract_table_name(ast),
            "where": self._extract_where_clause(ast)
        }
    
    def _extract_sql_create(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL CREATE data."""
        return {
            "operation": "CREATE",
            "object_type": self._extract_create_type(ast),
            "object_name": self._extract_object_name(ast),
            "definition": self._extract_create_definition(ast)
        }
    
    def _extract_sql_alter(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL ALTER data."""
        return {
            "operation": "ALTER",
            "table": self._extract_table_name(ast),
            "action": self._extract_alter_action(ast)
        }
    
    def _extract_sql_drop(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SQL DROP data."""
        return {
            "operation": "DROP",
            "object_type": self._extract_drop_type(ast),
            "object_name": self._extract_object_name(ast)
        }
    
    # Placeholder extraction methods for other formats
    def _extract_partiql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract PartiQL SELECT data."""
        return self._extract_sql_select(ast)  # Similar to SQL
    
    def _extract_partiql_insert(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract PartiQL INSERT data."""
        return self._extract_sql_insert(ast)  # Similar to SQL
    
    def _extract_partiql_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract PartiQL UPDATE data."""
        return self._extract_sql_update(ast)  # Similar to SQL
    
    def _extract_partiql_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract PartiQL DELETE data."""
        return self._extract_sql_delete(ast)  # Similar to SQL
    
    # Generic extraction helpers
    def _extract_column_list(self, ast: ASTNode) -> List[str]:
        """Extract column list from AST."""
        columns = []
        column_nodes = find_all_nodes_by_type(ast, "column_ref")
        for col_node in column_nodes:
            column_name = extract_node_value(col_node)
            if column_name:
                columns.append(column_name)
        return columns
    
    def _extract_table_list(self, ast: ASTNode) -> List[str]:
        """Extract table list from AST."""
        tables = []
        table_nodes = find_all_nodes_by_type(ast, "table_ref")
        for table_node in table_nodes:
            table_name = extract_node_value(table_node)
            if table_name:
                tables.append(table_name)
        return tables
    
    def _extract_table_name(self, ast: ASTNode) -> str:
        """Extract table name from AST."""
        table_node = find_node_by_type(ast, "table_ref")
        if table_node:
            return extract_node_value(table_node) or "unknown_table"
        return "unknown_table"
    
    def _extract_where_clause(self, ast: ASTNode) -> Optional[Dict[str, Any]]:
        """Extract WHERE clause from AST."""
        where_node = find_node_by_type(ast, "where_clause")
        if where_node:
            return {"condition": extract_node_value(where_node)}
        return None
    
    def _extract_group_by(self, ast: ASTNode) -> Optional[List[str]]:
        """Extract GROUP BY clause from AST."""
        group_by_node = find_node_by_type(ast, "group_by_clause")
        if group_by_node:
            return self._extract_column_list(group_by_node)
        return None
    
    def _extract_having(self, ast: ASTNode) -> Optional[Dict[str, Any]]:
        """Extract HAVING clause from AST."""
        having_node = find_node_by_type(ast, "having_clause")
        if having_node:
            return {"condition": extract_node_value(having_node)}
        return None
    
    def _extract_order_by(self, ast: ASTNode) -> Optional[List[Dict[str, Any]]]:
        """Extract ORDER BY clause from AST."""
        order_by_node = find_node_by_type(ast, "order_by_clause")
        if order_by_node:
            order_items = []
            order_item_nodes = find_all_nodes_by_type(order_by_node, "order_item")
            for item_node in order_item_nodes:
                order_items.append({
                    "column": extract_node_value(item_node),
                    "direction": "ASC"
                })
            return order_items
        return None
    
    def _extract_limit(self, ast: ASTNode) -> Optional[int]:
        """Extract LIMIT clause from AST."""
        limit_node = find_node_by_type(ast, "limit_clause")
        if limit_node:
            for node in limit_node.children:
                if node.type == "NUMBER" and node.value:
                    try:
                        return int(node.value)
                    except ValueError:
                        continue
        return None
    
    def _extract_values(self, ast: ASTNode) -> List[List[Any]]:
        """Extract VALUES from AST."""
        values = []
        values_node = find_node_by_type(ast, "values_clause")
        if values_node:
            value_list_nodes = find_all_nodes_by_type(values_node, "value_list")
            for value_list_node in value_list_nodes:
                row_values = []
                value_nodes = find_all_nodes_by_type(value_list_node, "value")
                for value_node in value_nodes:
                    value = extract_node_value(value_node)
                    if value is not None:
                        row_values.append(value)
                if row_values:
                    values.append(row_values)
        return values
    
    def _extract_assignments(self, ast: ASTNode) -> List[Dict[str, Any]]:
        """Extract assignments from AST."""
        assignments = []
        assignment_nodes = find_all_nodes_by_type(ast, "assignment")
        for assignment_node in assignment_nodes:
            column_name = None
            value = None
            
            column_node = find_node_by_type(assignment_node, "column_ref")
            if column_node:
                column_name = extract_node_value(column_node)
            
            value_node = find_node_by_type(assignment_node, "value")
            if value_node:
                value = extract_node_value(value_node)
            
            if column_name and value is not None:
                assignments.append({
                    "column": column_name,
                    "value": value
                })
        return assignments
    
    def _extract_create_type(self, ast: ASTNode) -> str:
        """Extract CREATE object type from AST."""
        for node in ast.children:
            if node.type in ["TABLE", "INDEX", "VIEW", "DATABASE", "SCHEMA"]:
                return node.type
        return "TABLE"
    
    def _extract_object_name(self, ast: ASTNode) -> str:
        """Extract object name from AST."""
        name_node = find_node_by_type(ast, "object_name")
        if name_node:
            return extract_node_value(name_node) or "unknown_object"
        return "unknown_object"
    
    def _extract_create_definition(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CREATE definition from AST."""
        definition = {}
        
        column_def_nodes = find_all_nodes_by_type(ast, "column_definition")
        if column_def_nodes:
            columns = []
            for col_def_node in column_def_nodes:
                column_name = extract_node_value(col_def_node)
                if column_name:
                    columns.append(column_name)
            definition["columns"] = columns
        
        return definition
    
    def _extract_alter_action(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract ALTER action from AST."""
        action = {}
        action_node = find_node_by_type(ast, "alter_action")
        if action_node:
            action_type = extract_node_value(action_node)
            if action_type:
                action["type"] = action_type
        return action
    
    def _extract_drop_type(self, ast: ASTNode) -> str:
        """Extract DROP object type from AST."""
        for node in ast.children:
            if node.type in ["TABLE", "INDEX", "VIEW", "DATABASE", "SCHEMA"]:
                return node.type
        return "TABLE"
    
    # Placeholder methods for other formats (to be implemented)
    def _extract_n1ql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract N1QL SELECT data."""
        return self._extract_sql_select(ast)
    
    def _extract_n1ql_insert(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract N1QL INSERT data."""
        return self._extract_sql_insert(ast)
    
    def _extract_n1ql_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract N1QL UPDATE data."""
        return self._extract_sql_update(ast)
    
    def _extract_n1ql_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract N1QL DELETE data."""
        return self._extract_sql_delete(ast)
    
    def _extract_hiveql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract HiveQL SELECT data."""
        return self._extract_sql_select(ast)
    
    def _extract_hiveql_insert(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract HiveQL INSERT data."""
        return self._extract_sql_insert(ast)
    
    def _extract_hiveql_create(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract HiveQL CREATE data."""
        return self._extract_sql_create(ast)
    
    def _extract_kql_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract KQL query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_kql_command(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract KQL command data."""
        return {"operation": "COMMAND", "command": extract_node_value(ast)}
    
    def _extract_hql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract HQL SELECT data."""
        return self._extract_sql_select(ast)
    
    def _extract_hql_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract HQL UPDATE data."""
        return self._extract_sql_update(ast)
    
    def _extract_hql_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract HQL DELETE data."""
        return self._extract_sql_delete(ast)
    
    # Graph query extractions
    def _extract_cypher_match(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Cypher MATCH data."""
        return {"operation": "MATCH", "pattern": extract_node_value(ast)}
    
    def _extract_cypher_create(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Cypher CREATE data."""
        return {"operation": "CREATE", "pattern": extract_node_value(ast)}
    
    def _extract_cypher_merge(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Cypher MERGE data."""
        return {"operation": "MERGE", "pattern": extract_node_value(ast)}
    
    def _extract_cypher_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Cypher DELETE data."""
        return {"operation": "DELETE", "pattern": extract_node_value(ast)}
    
    def _extract_gremlin_traversal(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Gremlin traversal data."""
        return {"operation": "TRAVERSAL", "steps": extract_node_value(ast)}
    
    def _extract_gremlin_add_vertex(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Gremlin add vertex data."""
        return {"operation": "ADD_VERTEX", "vertex": extract_node_value(ast)}
    
    def _extract_gremlin_add_edge(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Gremlin add edge data."""
        return {"operation": "ADD_EDGE", "edge": extract_node_value(ast)}
    
    def _extract_sparql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SPARQL SELECT data."""
        return {"operation": "SELECT", "query": extract_node_value(ast)}
    
    def _extract_sparql_construct(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SPARQL CONSTRUCT data."""
        return {"operation": "CONSTRUCT", "query": extract_node_value(ast)}
    
    def _extract_sparql_ask(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SPARQL ASK data."""
        return {"operation": "ASK", "query": extract_node_value(ast)}
    
    def _extract_sparql_describe(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract SPARQL DESCRIBE data."""
        return {"operation": "DESCRIBE", "query": extract_node_value(ast)}
    
    def _extract_gql_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract GQL query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_gql_mutation(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract GQL mutation data."""
        return {"operation": "MUTATION", "mutation": extract_node_value(ast)}
    
    # XML/Document extractions
    def _extract_xquery_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract XQuery query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_xquery_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract XQuery update data."""
        return {"operation": "UPDATE", "update": extract_node_value(ast)}
    
    def _extract_xml_query_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract XML Query query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_xpath_path(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract XPath path data."""
        return {"operation": "PATH", "path": extract_node_value(ast)}
    
    # JSON query extractions
    def _extract_jmespath_expression(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract JMESPath expression data."""
        return {"operation": "EXPRESSION", "expression": extract_node_value(ast)}
    
    def _extract_jq_filter(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract JQ filter data."""
        return {"operation": "FILTER", "filter": extract_node_value(ast)}
    
    def _extract_jsoniq_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract JSONiq query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_json_query_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract JSON Query query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    # API query extractions
    def _extract_graphql_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract GraphQL query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_graphql_mutation(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract GraphQL mutation data."""
        return {"operation": "MUTATION", "mutation": extract_node_value(ast)}
    
    def _extract_graphql_subscription(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract GraphQL subscription data."""
        return {"operation": "SUBSCRIPTION", "subscription": extract_node_value(ast)}
    
    # Time-series extractions
    def _extract_promql_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract PromQL query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_logql_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract LogQL query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_flux_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Flux query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    # Other extractions
    def _extract_eql_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract EQL query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_datalog_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Datalog query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_pig_script(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Pig script data."""
        return {"operation": "SCRIPT", "script": extract_node_value(ast)}
    
    def _extract_linq_query(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract LINQ query data."""
        return {"operation": "QUERY", "query": extract_node_value(ast)}
    
    def _extract_mongodb_find(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract MongoDB find data."""
        return {"operation": "FIND", "query": extract_node_value(ast)}
    
    def _extract_mongodb_insert(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract MongoDB insert data."""
        return {"operation": "INSERT", "document": extract_node_value(ast)}
    
    def _extract_mongodb_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract MongoDB update data."""
        return {"operation": "UPDATE", "query": extract_node_value(ast)}
    
    def _extract_mongodb_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract MongoDB delete data."""
        return {"operation": "DELETE", "query": extract_node_value(ast)}
    
    def _extract_cql_select(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CQL SELECT data."""
        return self._extract_sql_select(ast)
    
    def _extract_cql_insert(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CQL INSERT data."""
        return self._extract_sql_insert(ast)
    
    def _extract_cql_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CQL UPDATE data."""
        return self._extract_sql_update(ast)
    
    def _extract_cql_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract CQL DELETE data."""
        return self._extract_sql_delete(ast)
    
    def _extract_elasticsearch_search(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Elasticsearch search data."""
        return {"operation": "SEARCH", "query": extract_node_value(ast)}
    
    def _extract_elasticsearch_index(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Elasticsearch index data."""
        return {"operation": "INDEX", "document": extract_node_value(ast)}
    
    def _extract_elasticsearch_update(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Elasticsearch update data."""
        return {"operation": "UPDATE", "query": extract_node_value(ast)}
    
    def _extract_elasticsearch_delete(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract Elasticsearch delete data."""
        return {"operation": "DELETE", "query": extract_node_value(ast)}
    
    def _extract_xwqueryscript_script(self, ast: ASTNode) -> Dict[str, Any]:
        """Extract XWQueryScript script data."""
        return {"operation": "SCRIPT", "script": extract_node_value(ast)}


# Global registry instance
format_mapping_registry = FormatMappingRegistry()

