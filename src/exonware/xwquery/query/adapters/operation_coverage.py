#!/usr/bin/env python3
"""
Operation Coverage Analysis for xwquery

Maps all 56 XWQueryScript operations to their corresponding executors
and analyzes coverage across all query formats.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 11-Oct-2025
"""

from typing import Any, Dict, List, Optional, Union, Set
from dataclasses import dataclass
from enum import Enum
from exonware.xwquery.defs import ALL_OPERATIONS, OPERATION_CATEGORIES


@dataclass
class ExecutorInfo:
    """Information about an executor for an operation."""
    executor_class: str  # Class name of the executor
    module_path: str  # Module path where executor is located
    is_implemented: bool  # Whether executor is implemented
    priority: int = 0  # Execution priority
    dependencies: List[str] = None  # Required dependencies
    
    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []


@dataclass
class OperationCoverage:
    """Coverage information for an operation."""
    operation: str  # Operation name
    category: str  # Operation category
    executor: Optional[ExecutorInfo]  # Executor information
    supported_formats: Set[str]  # Formats that support this operation
    implementation_status: str  # Implementation status
    test_coverage: float = 0.0  # Test coverage percentage


class OperationCoverageAnalyzer:
    """Analyzes operation coverage across all formats and executors."""
    
    def __init__(self):
        self._executor_mappings = self._initialize_executor_mappings()
        self._format_support = self._initialize_format_support()
        self._coverage_data = self._analyze_coverage()
    
    def get_coverage_report(self) -> Dict[str, Any]:
        """Get comprehensive coverage report."""
        return {
            "total_operations": len(ALL_OPERATIONS),
            "implemented_operations": self._count_implemented(),
            "coverage_percentage": self._calculate_coverage_percentage(),
            "operations_by_category": self._get_operations_by_category(),
            "missing_executors": self._get_missing_executors(),
            "format_support_matrix": self._get_format_support_matrix(),
            "detailed_coverage": self._coverage_data
        }
    
    def get_operation_coverage(self, operation: str) -> Optional[OperationCoverage]:
        """Get coverage information for a specific operation."""
        return self._coverage_data.get(operation)
    
    def get_missing_executors(self) -> List[str]:
        """Get list of operations missing executors."""
        missing = []
        for operation, coverage in self._coverage_data.items():
            if not coverage.executor or not coverage.executor.is_implemented:
                missing.append(operation)
        return missing
    
    def get_format_support(self, format_name: str) -> Set[str]:
        """Get operations supported by a format."""
        return self._format_support.get(format_name.lower(), set())
    
    def _initialize_executor_mappings(self) -> Dict[str, ExecutorInfo]:
        """Initialize mappings from operations to executors."""
        return {
            # Core operations
            "SELECT": ExecutorInfo(
                executor_class="SelectExecutor",
                module_path="exonware.xwquery.executors.select",
                is_implemented=True,
                priority=100
            ),
            "INSERT": ExecutorInfo(
                executor_class="InsertExecutor",
                module_path="exonware.xwquery.executors.insert",
                is_implemented=True,
                priority=100
            ),
            "UPDATE": ExecutorInfo(
                executor_class="UpdateExecutor",
                module_path="exonware.xwquery.executors.update",
                is_implemented=True,
                priority=100
            ),
            "DELETE": ExecutorInfo(
                executor_class="DeleteExecutor",
                module_path="exonware.xwquery.executors.delete",
                is_implemented=True,
                priority=100
            ),
            "CREATE": ExecutorInfo(
                executor_class="CreateExecutor",
                module_path="exonware.xwquery.executors.create",
                is_implemented=True,
                priority=100
            ),
            "DROP": ExecutorInfo(
                executor_class="DropExecutor",
                module_path="exonware.xwquery.executors.drop",
                is_implemented=True,
                priority=100
            ),
            
            # Filtering operations
            "WHERE": ExecutorInfo(
                executor_class="WhereExecutor",
                module_path="exonware.xwquery.executors.where",
                is_implemented=True,
                priority=90
            ),
            "FILTER": ExecutorInfo(
                executor_class="FilterExecutor",
                module_path="exonware.xwquery.executors.filter",
                is_implemented=True,
                priority=90
            ),
            "LIKE": ExecutorInfo(
                executor_class="LikeExecutor",
                module_path="exonware.xwquery.executors.like",
                is_implemented=True,
                priority=80
            ),
            "IN": ExecutorInfo(
                executor_class="InExecutor",
                module_path="exonware.xwquery.executors.in",
                is_implemented=True,
                priority=80
            ),
            "HAS": ExecutorInfo(
                executor_class="HasExecutor",
                module_path="exonware.xwquery.executors.has",
                is_implemented=True,
                priority=80
            ),
            "BETWEEN": ExecutorInfo(
                executor_class="BetweenExecutor",
                module_path="exonware.xwquery.executors.between",
                is_implemented=True,
                priority=80
            ),
            "RANGE": ExecutorInfo(
                executor_class="RangeExecutor",
                module_path="exonware.xwquery.executors.range",
                is_implemented=True,
                priority=80
            ),
            "TERM": ExecutorInfo(
                executor_class="TermExecutor",
                module_path="exonware.xwquery.executors.term",
                is_implemented=True,
                priority=80
            ),
            "OPTIONAL": ExecutorInfo(
                executor_class="OptionalExecutor",
                module_path="exonware.xwquery.executors.optional",
                is_implemented=True,
                priority=80
            ),
            "VALUES": ExecutorInfo(
                executor_class="ValuesExecutor",
                module_path="exonware.xwquery.executors.values",
                is_implemented=True,
                priority=80
            ),
            
            # Aggregation operations
            "COUNT": ExecutorInfo(
                executor_class="CountExecutor",
                module_path="exonware.xwquery.executors.count",
                is_implemented=True,
                priority=90
            ),
            "SUM": ExecutorInfo(
                executor_class="SumExecutor",
                module_path="exonware.xwquery.executors.sum",
                is_implemented=True,
                priority=90
            ),
            "AVG": ExecutorInfo(
                executor_class="AvgExecutor",
                module_path="exonware.xwquery.executors.avg",
                is_implemented=True,
                priority=90
            ),
            "MIN": ExecutorInfo(
                executor_class="MinExecutor",
                module_path="exonware.xwquery.executors.min",
                is_implemented=True,
                priority=90
            ),
            "MAX": ExecutorInfo(
                executor_class="MaxExecutor",
                module_path="exonware.xwquery.executors.max",
                is_implemented=True,
                priority=90
            ),
            "DISTINCT": ExecutorInfo(
                executor_class="DistinctExecutor",
                module_path="exonware.xwquery.executors.distinct",
                is_implemented=True,
                priority=90
            ),
            "GROUP": ExecutorInfo(
                executor_class="GroupExecutor",
                module_path="exonware.xwquery.executors.group",
                is_implemented=True,
                priority=90
            ),
            "HAVING": ExecutorInfo(
                executor_class="HavingExecutor",
                module_path="exonware.xwquery.executors.having",
                is_implemented=True,
                priority=90
            ),
            "SUMMARIZE": ExecutorInfo(
                executor_class="SummarizeExecutor",
                module_path="exonware.xwquery.executors.summarize",
                is_implemented=True,
                priority=90
            ),
            
            # Projection operations
            "PROJECT": ExecutorInfo(
                executor_class="ProjectExecutor",
                module_path="exonware.xwquery.executors.project",
                is_implemented=True,
                priority=85
            ),
            "EXTEND": ExecutorInfo(
                executor_class="ExtendExecutor",
                module_path="exonware.xwquery.executors.extend",
                is_implemented=True,
                priority=85
            ),
            
            # Ordering operations
            "ORDER": ExecutorInfo(
                executor_class="OrderExecutor",
                module_path="exonware.xwquery.executors.order",
                is_implemented=True,
                priority=85
            ),
            "BY": ExecutorInfo(
                executor_class="ByExecutor",
                module_path="exonware.xwquery.executors.by",
                is_implemented=True,
                priority=85
            ),
            "LIMIT": ExecutorInfo(
                executor_class="LimitExecutor",
                module_path="exonware.xwquery.executors.limit",
                is_implemented=True,
                priority=85
            ),
            "OFFSET": ExecutorInfo(
                executor_class="OffsetExecutor",
                module_path="exonware.xwquery.executors.offset",
                is_implemented=True,
                priority=85
            ),
            
            # Graph operations
            "MATCH": ExecutorInfo(
                executor_class="MatchExecutor",
                module_path="exonware.xwquery.executors.match",
                is_implemented=True,
                priority=80
            ),
            "PATH": ExecutorInfo(
                executor_class="PathExecutor",
                module_path="exonware.xwquery.executors.path",
                is_implemented=True,
                priority=80
            ),
            "OUT": ExecutorInfo(
                executor_class="OutExecutor",
                module_path="exonware.xwquery.executors.out",
                is_implemented=True,
                priority=80
            ),
            "IN_TRAVERSE": ExecutorInfo(
                executor_class="InTraverseExecutor",
                module_path="exonware.xwquery.executors.in_traverse",
                is_implemented=True,
                priority=80
            ),
            "RETURN": ExecutorInfo(
                executor_class="ReturnExecutor",
                module_path="exonware.xwquery.executors.return",
                is_implemented=True,
                priority=80
            ),
            
            # Data operations
            "LOAD": ExecutorInfo(
                executor_class="LoadExecutor",
                module_path="exonware.xwquery.executors.load",
                is_implemented=True,
                priority=70
            ),
            "STORE": ExecutorInfo(
                executor_class="StoreExecutor",
                module_path="exonware.xwquery.executors.store",
                is_implemented=True,
                priority=70
            ),
            "MERGE": ExecutorInfo(
                executor_class="MergeExecutor",
                module_path="exonware.xwquery.executors.merge",
                is_implemented=True,
                priority=70
            ),
            "ALTER": ExecutorInfo(
                executor_class="AlterExecutor",
                module_path="exonware.xwquery.executors.alter",
                is_implemented=True,
                priority=70
            ),
            
            # Array operations
            "SLICING": ExecutorInfo(
                executor_class="SlicingExecutor",
                module_path="exonware.xwquery.executors.slicing",
                is_implemented=True,
                priority=60
            ),
            "INDEXING": ExecutorInfo(
                executor_class="IndexingExecutor",
                module_path="exonware.xwquery.executors.indexing",
                is_implemented=True,
                priority=60
            ),
            
            # Advanced operations
            "JOIN": ExecutorInfo(
                executor_class="JoinExecutor",
                module_path="exonware.xwquery.executors.join",
                is_implemented=True,
                priority=70
            ),
            "UNION": ExecutorInfo(
                executor_class="UnionExecutor",
                module_path="exonware.xwquery.executors.union",
                is_implemented=True,
                priority=70
            ),
            "WITH": ExecutorInfo(
                executor_class="WithExecutor",
                module_path="exonware.xwquery.executors.with",
                is_implemented=True,
                priority=70
            ),
            "WINDOW": ExecutorInfo(
                executor_class="WindowExecutor",
                module_path="exonware.xwquery.executors.window",
                is_implemented=True,
                priority=60
            ),
            "PIPE": ExecutorInfo(
                executor_class="PipeExecutor",
                module_path="exonware.xwquery.executors.pipe",
                is_implemented=True,
                priority=60
            ),
            "LET": ExecutorInfo(
                executor_class="LetExecutor",
                module_path="exonware.xwquery.executors.let",
                is_implemented=True,
                priority=60
            ),
            "FOR": ExecutorInfo(
                executor_class="ForExecutor",
                module_path="exonware.xwquery.executors.for",
                is_implemented=True,
                priority=60
            ),
            "FOREACH": ExecutorInfo(
                executor_class="ForeachExecutor",
                module_path="exonware.xwquery.executors.foreach",
                is_implemented=True,
                priority=60
            ),
            "ASK": ExecutorInfo(
                executor_class="AskExecutor",
                module_path="exonware.xwquery.executors.ask",
                is_implemented=True,
                priority=50
            ),
            "SUBSCRIBE": ExecutorInfo(
                executor_class="SubscribeExecutor",
                module_path="exonware.xwquery.executors.subscribe",
                is_implemented=True,
                priority=50
            ),
            "SUBSCRIPTION": ExecutorInfo(
                executor_class="SubscriptionExecutor",
                module_path="exonware.xwquery.executors.subscription",
                is_implemented=True,
                priority=50
            ),
            "MUTATION": ExecutorInfo(
                executor_class="MutationExecutor",
                module_path="exonware.xwquery.executors.mutation",
                is_implemented=True,
                priority=50
            ),
            "OPTIONS": ExecutorInfo(
                executor_class="OptionsExecutor",
                module_path="exonware.xwquery.executors.options",
                is_implemented=True,
                priority=50
            ),
            "CONSTRUCT": ExecutorInfo(
                executor_class="ConstructExecutor",
                module_path="exonware.xwquery.executors.construct",
                is_implemented=True,
                priority=50
            ),
            "DESCRIBE": ExecutorInfo(
                executor_class="DescribeExecutor",
                module_path="exonware.xwquery.executors.describe",
                is_implemented=True,
                priority=50
            ),
            "AGGREGATE": ExecutorInfo(
                executor_class="AggregateExecutor",
                module_path="exonware.xwquery.executors.aggregate",
                is_implemented=True,
                priority=50
            ),
        }
    
    def _initialize_format_support(self) -> Dict[str, Set[str]]:
        """Initialize format support matrix."""
        return {
            # SQL-like formats
            "sql": {
                "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "JOIN", "UNION", "WITH", "WINDOW", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE", "OPTIONS"
            },
            "partiql": {
                "SELECT", "INSERT", "UPDATE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "JOIN", "UNION", "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "n1ql": {
                "SELECT", "INSERT", "UPDATE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "JOIN", "UNION", "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "hiveql": {
                "SELECT", "INSERT", "CREATE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "JOIN", "UNION", "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "kql": {
                "SELECT", "COMMAND",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "JOIN", "UNION", "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "hql": {
                "SELECT", "UPDATE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "JOIN", "UNION", "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            
            # Graph query formats
            "cypher": {
                "MATCH", "CREATE", "MERGE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "gremlin": {
                "TRAVERSAL", "ADD_VERTEX", "ADD_EDGE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "sparql": {
                "SELECT", "CONSTRUCT", "ASK", "DESCRIBE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "MATCH", "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "UNION", "AGGREGATE"
            },
            "gql": {
                "QUERY", "MUTATION",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "MATCH", "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            
            # XML/Document formats
            "xquery": {
                "QUERY", "UPDATE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "xml_query": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "xpath": {
                "PATH",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "OUT", "IN_TRAVERSE", "RETURN",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            
            # JSON query formats
            "jmespath": {
                "EXPRESSION",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "jq": {
                "FILTER",
                "WHERE", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "jsoniq": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "json_query": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            
            # API query formats
            "graphql": {
                "QUERY", "MUTATION", "SUBSCRIPTION",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            
            # Time-series formats
            "promql": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "logql": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "flux": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "MAP", "REDUCE", "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            
            # Other formats
            "eql": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "datalog": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "pig": {
                "SCRIPT",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "linq": {
                "QUERY",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "mongodb": {
                "FIND", "INSERT", "UPDATE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "cql": {
                "SELECT", "INSERT", "UPDATE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "elasticsearch": {
                "SEARCH", "INDEX", "UPDATE", "DELETE",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "WITH", "LET", "FOR", "FOREACH",
                "ASK", "DESCRIBE", "CONSTRUCT", "AGGREGATE"
            },
            "xwqueryscript": {
                "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP",
                "WHERE", "FILTER", "LIKE", "IN", "HAS", "BETWEEN", "RANGE", "TERM", "OPTIONAL", "VALUES",
                "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "GROUP", "HAVING", "SUMMARIZE",
                "PROJECT", "EXTEND", "ORDER", "BY", "LIMIT", "OFFSET",
                "MATCH", "PATH", "OUT", "IN_TRAVERSE", "RETURN",
                "LOAD", "STORE", "MERGE", "ALTER",
                "SLICING", "INDEXING",
                "JOIN", "UNION", "WITH", "WINDOW", "PIPE", "LET", "FOR", "FOREACH",
                "ASK", "SUBSCRIBE", "SUBSCRIPTION", "MUTATION", "OPTIONS", "CONSTRUCT", "DESCRIBE",
                "AGGREGATE"
            },
        }
    
    def _analyze_coverage(self) -> Dict[str, OperationCoverage]:
        """Analyze coverage for all operations."""
        coverage = {}
        
        for operation in ALL_OPERATIONS:
            # Find category
            category = self._find_category(operation)
            
            # Get executor info
            executor = self._executor_mappings.get(operation)
            
            # Get supported formats
            supported_formats = set()
            for format_name, operations in self._format_support.items():
                if operation in operations:
                    supported_formats.add(format_name)
            
            # Determine implementation status
            if executor and executor.is_implemented:
                implementation_status = "IMPLEMENTED"
            elif executor:
                implementation_status = "PLANNED"
            else:
                implementation_status = "MISSING"
            
            coverage[operation] = OperationCoverage(
                operation=operation,
                category=category,
                executor=executor,
                supported_formats=supported_formats,
                implementation_status=implementation_status,
                test_coverage=0.0  # Will be calculated separately
            )
        
        return coverage
    
    def _find_category(self, operation: str) -> str:
        """Find category for an operation."""
        for category, operations in OPERATION_CATEGORIES.items():
            if operation in operations:
                return category
        return "unknown"
    
    def _count_implemented(self) -> int:
        """Count implemented operations."""
        count = 0
        for coverage in self._coverage_data.values():
            if coverage.implementation_status == "IMPLEMENTED":
                count += 1
        return count
    
    def _calculate_coverage_percentage(self) -> float:
        """Calculate overall coverage percentage."""
        total = len(ALL_OPERATIONS)
        implemented = self._count_implemented()
        return (implemented / total) * 100.0 if total > 0 else 0.0
    
    def _get_operations_by_category(self) -> Dict[str, List[str]]:
        """Get operations grouped by category."""
        result = {}
        for operation, coverage in self._coverage_data.items():
            category = coverage.category
            if category not in result:
                result[category] = []
            result[category].append(operation)
        return result
    
    def _get_missing_executors(self) -> List[str]:
        """Get list of operations missing executors."""
        missing = []
        for operation, coverage in self._coverage_data.items():
            if coverage.implementation_status in ["MISSING", "PLANNED"]:
                missing.append(operation)
        return missing
    
    def _get_format_support_matrix(self) -> Dict[str, Dict[str, bool]]:
        """Get format support matrix."""
        matrix = {}
        for format_name, operations in self._format_support.items():
            matrix[format_name] = {}
            for operation in ALL_OPERATIONS:
                matrix[format_name][operation] = operation in operations
        return matrix


# Global analyzer instance
operation_coverage_analyzer = OperationCoverageAnalyzer()


# Convenience functions
def get_coverage_report() -> Dict[str, Any]:
    """Get comprehensive coverage report."""
    return operation_coverage_analyzer.get_coverage_report()


def get_operation_coverage(operation: str) -> Optional[OperationCoverage]:
    """Get coverage information for a specific operation."""
    return operation_coverage_analyzer.get_operation_coverage(operation)


def get_missing_executors() -> List[str]:
    """Get list of operations missing executors."""
    return operation_coverage_analyzer.get_missing_executors()


def get_format_support(format_name: str) -> Set[str]:
    """Get operations supported by a format."""
    return operation_coverage_analyzer.get_format_support(format_name)

