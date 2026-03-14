#!/usr/bin/env python3
"""
Format Registry - Configuration-Based Strategy Factory
Instead of 100+ individual strategy files, use a configuration-based registry
that dynamically creates GrammarBasedStrategy instances based on format names
and grammar mappings.
This eliminates the need for individual Python files for each format!
Since we have grammars in xwsyntax, we don't need separate Python files.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: January 20, 2025
"""

from __future__ import annotations
from typing import Any
from .grammar_based import GrammarBasedStrategy
from .scripting_base import GrammarBasedDocumentStrategy
from .base import AQueryStrategy, AStructuredQueryStrategy, AGraphQueryStrategy, ADocumentQueryStrategy
from ...defs import QueryMode, QueryTrait, FormatType
# Format name → Grammar format mapping
# Since we have grammars in xwsyntax, we just map format names to grammar names
FORMAT_GRAMMAR_MAP: dict[str, str] = {
    # SQL-based (all use 'sql' grammar from xwsyntax)
    'SQL': 'sql',
    'MYSQL': 'sql', 'SQLITE': 'sql', 'POSTGRES': 'sql', 'POSTGRESQL': 'sql',
    'MARIADB': 'sql', 'SQLSERVER': 'sql', 'MSSQL': 'sql', 'ORACLE': 'sql',
    'DB2': 'sql', 'TERADATA': 'sql', 'TERADATA_SQL': 'sql',
    'SNOWFLAKE': 'sql', 'BIGQUERY': 'sql', 'REDSHIFT': 'sql',
    'PRESTO': 'sql', 'PRESTO_SQL': 'sql', 'TRINO': 'sql', 'TRINO_SQL': 'sql',
    'SPARK': 'sql', 'SPARK_SQL': 'sql', 'FLINK': 'sql', 'FLINK_SQL': 'sql',
    'BEAM': 'sql', 'BEAM_SQL': 'sql', 'DRILL': 'sql', 'DUCKDB': 'sql',
    'CLICKHOUSE': 'sql', 'VERTICA': 'sql', 'VERTICA_SQL': 'sql',
    'NETEZZA': 'sql', 'NETEZZA_SQL': 'sql', 'EXASOL': 'sql', 'EXASOL_SQL': 'sql',
    'FIREBIRD': 'sql', 'FIREBIRD_SQL': 'sql', 'TIMESCALEDB': 'sql',
    'MATERIALIZE': 'sql', 'RISINGWAVE': 'sql', 'DATABRICKS': 'sql', 'DATABRICKS_SQL': 'sql',
    'ELASTICSEARCH_SQL': 'sql', 'SQL_PLUS_PLUS': 'sql',
    'PLPGSQL': 'sql', 'PLPYTHON': 'sql', 'PLV8': 'sql', 'PLPERL': 'sql',
    'PLSQL': 'sql', 'MYSQL_STORED': 'sql', 'DB2_SQL_PL': 'sql', 'TCL': 'sql',
    # Graph-based (use their own grammars from xwsyntax)
    'GRAPHQL': 'graphql', 'GQL': 'graphql', 'GQL_GAE': 'graphql',
    'CYPHER': 'cypher', 'CYPHER_AGE': 'cypher', 'OPENCYPHER': 'cypher',
    'GREMLIN': 'gremlin',
    'SPARQL': 'sparql',
    # XWQuery Script (xwqs alias)
    'XWQS': 'xwqueryscript', 'XWQUERY': 'xwqueryscript', 'XWQUERYSCRIPT': 'xwqueryscript',
    # Query languages
    'XPATH': 'xpath', 'XQUERY': 'xquery', 'XML_QUERY': 'xml_query',
    'JMESPATH': 'jmespath', 'JSONPATH': 'jsonpath', 'JQ': 'jq',
    # Time-series
    'PROMQL': 'promql', 'LOGQL': 'logql', 'FLUX': 'flux', 'INFLUXQL': 'influxql',
    'METRICSQL': 'metricsql', 'M3QL': 'm3ql', 'TICK': 'tick', 'CHRONOGRAF': 'chronograf',
    # NoSQL/Others - use format name as grammar name
    'MONGODB_AGGREGATION': 'mongodbaggregation', 'MQL': 'mql',
    'ARANGODB_AQL': 'arangodb_aql', 'COUCHDB_MANGO': 'couchdb_mango',
    'N1QL': 'n1ql', 'CQL': 'cql', 'EDGEQL': 'edgeql', 'SURREALQL': 'surrealql',
    # Scripting / programming (xwsyntax grammars - same quality as SQL)
    'JAVASCRIPT': 'javascript', 'JS': 'javascript',
    'TYPESCRIPT': 'typescript', 'TS': 'typescript',
    'PYTHON': 'python', 'PY': 'python',
    'GO': 'go', 'GOLANG': 'go',
    'RUBY': 'ruby', 'RB': 'ruby',
    'PHP': 'php',
    'LUA': 'lua',
    'BASH': 'bash', 'SH': 'bash', 'SHELL': 'shell',
    'POWERSHELL': 'powershell', 'PS1': 'powershell',
    'GROOVY': 'groovy', 'GY': 'groovy',
    'KOTLIN': 'kotlin', 'KT': 'kotlin',
    'SWIFT': 'swift',
    'DART': 'dart',
    'ELIXIR': 'elixir', 'EX': 'elixir',
    'SCALA': 'scala', 'SC': 'scala',
    'JULIA': 'julia', 'JL': 'julia',
    'HCL': 'hcl', 'TERRAFORM': 'hcl',
    'SOLIDITY': 'solidity', 'SOL': 'solidity',
    'RUST': 'rust', 'RS': 'rust',
    'WEBASSEMBLY': 'wasm', 'WASM': 'wasm', 'WAT': 'wasm',
    # Default: use format name directly as grammar name
}
# Format name → Base class mapping (for inheritance)
FORMAT_BASE_CLASS_MAP: dict[str, type[AQueryStrategy]] = {
    # SQL-based → AStructuredQueryStrategy
    **{k: AStructuredQueryStrategy for k in ['SQL', 'MYSQL', 'SQLITE', 'POSTGRES', 'POSTGRESQL',
                                              'MARIADB', 'SQLSERVER', 'MSSQL', 'ORACLE', 'DB2',
                                              'TERADATA', 'TERADATA_SQL', 'SNOWFLAKE', 'BIGQUERY',
                                              'REDSHIFT', 'PRESTO', 'PRESTO_SQL', 'TRINO', 'TRINO_SQL',
                                              'SPARK', 'SPARK_SQL', 'FLINK', 'FLINK_SQL', 'BEAM',
                                              'BEAM_SQL', 'DRILL', 'DUCKDB', 'CLICKHOUSE', 'VERTICA',
                                              'VERTICA_SQL', 'NETEZZA', 'NETEZZA_SQL', 'EXASOL',
                                              'EXASOL_SQL', 'FIREBIRD', 'FIREBIRD_SQL', 'TIMESCALEDB',
                                              'MATERIALIZE', 'RISINGWAVE', 'DATABRICKS', 'DATABRICKS_SQL',
                                              'ELASTICSEARCH_SQL', 'SQL_PLUS_PLUS', 'PLPGSQL', 'PLPYTHON',
                                              'PLV8', 'PLPERL', 'PLSQL', 'MYSQL_STORED', 'DB2_SQL_PL', 'TCL']},
    # Graph-based → AGraphQueryStrategy
    **{k: AGraphQueryStrategy for k in ['GRAPHQL', 'GQL', 'GQL_GAE', 'CYPHER', 'CYPHER_AGE',
                                        'OPENCYPHER', 'GREMLIN', 'SPARQL']},
    # Document-based → ADocumentQueryStrategy
    **{k: ADocumentQueryStrategy for k in ['MONGODB_AGGREGATION', 'MQL', 'COUCHDB_MANGO',
                                           'N1QL', 'CQL', 'EDGEQL', 'SURREALQL']},
    # Scripting / programming → GrammarBasedDocumentStrategy (parse, validate, execute via xwsyntax)
    **{k: GrammarBasedDocumentStrategy for k in ['JAVASCRIPT', 'JS', 'TYPESCRIPT', 'TS', 'PYTHON', 'PY',
                                                  'GO', 'GOLANG', 'RUBY', 'RB', 'PHP', 'LUA', 'BASH', 'SH', 'SHELL',
                                                  'POWERSHELL', 'PS1', 'GROOVY', 'GY', 'KOTLIN', 'KT',
                                                  'SWIFT', 'DART', 'ELIXIR', 'EX', 'SCALA', 'SC', 'JULIA', 'JL',
                                                  'HCL', 'TERRAFORM', 'SOLIDITY', 'SOL', 'RUST', 'RS',
                                                  'WEBASSEMBLY', 'WASM', 'WAT']},
    # Query languages → AQueryStrategy (base)
    **{k: AQueryStrategy for k in ['XPATH', 'XQUERY', 'XML_QUERY', 'JMESPATH', 'JSONPATH', 'JQ',
                                   'PROMQL', 'LOGQL', 'FLUX', 'INFLUXQL', 'METRICSQL', 'M3QL',
                                   'TICK', 'CHRONOGRAF']},
}
# Format name → QueryTrait mapping (for format-specific traits)
FORMAT_TRAIT_MAP: dict[str, QueryTrait] = {
    # Most SQL formats
    **{k: QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.TRANSACTIONAL 
       for k in ['SQL', 'MYSQL', 'SQLITE', 'POSTGRES', 'MARIADB', 'SQLSERVER', 'ORACLE', 'DB2']},
    # Graph formats
    **{k: QueryTrait.GRAPH | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL
       for k in ['GRAPHQL', 'CYPHER', 'GREMLIN', 'SPARQL']},
    # Time-series
    **{k: QueryTrait.TIME_SERIES | QueryTrait.ANALYTICAL
       for k in ['PROMQL', 'LOGQL', 'FLUX', 'INFLUXQL']},
    # Scripting / document (script parse, convert, execute)
    **{k: QueryTrait.DOCUMENT | QueryTrait.STRUCTURED
       for k in ['JAVASCRIPT', 'TYPESCRIPT', 'PYTHON', 'GO', 'RUBY', 'PHP', 'LUA', 'BASH',
                 'POWERSHELL', 'GROOVY', 'KOTLIN', 'SWIFT', 'DART', 'ELIXIR', 'SCALA', 'JULIA',
                 'HCL', 'SOLIDITY', 'RUST', 'WEBASSEMBLY', 'WASM']},
}


class FormatRegistry:
    """
    Configuration-based format registry.
    Instead of 100+ individual strategy files, dynamically create
    GrammarBasedStrategy instances based on format configuration.
    """
    @staticmethod

    def get_strategy(format_name: str, **options: Any) -> AQueryStrategy:
        """
        Get strategy for format name.
        Dynamically creates GrammarBasedStrategy instance based on configuration.
        No need for individual Python files for each format!
        Args:
            format_name: Format name (e.g., 'SQL', 'GRAPHQL', 'CYPHER')
            **options: Strategy options
        Returns:
            Strategy instance (GrammarBasedStrategy + base class)
        """
        format_upper = format_name.upper()
        # Get grammar format (default to format name if not in map)
        grammar_format = FORMAT_GRAMMAR_MAP.get(format_upper, format_name.lower())
        # Get base class (default to AQueryStrategy)
        base_class = FORMAT_BASE_CLASS_MAP.get(format_upper, AQueryStrategy)
        # Get traits (default to STRUCTURED | ANALYTICAL)
        traits = FORMAT_TRAIT_MAP.get(format_upper, QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL)
        # Dynamically create strategy class
        # Use a unique class name based on format to avoid conflicts
        class_name = f"{format_upper}Strategy"
        # Create class dynamically
        DynamicStrategy = type(
            class_name,
            (GrammarBasedStrategy, base_class),
            {
                '__init__': lambda self, **opts: (
                    GrammarBasedStrategy.__init__(self, grammar_format, **opts),
                    base_class.__init__(self, **opts),
                    setattr(self, '_mode', opts.get('mode', QueryMode.AUTO)),
                    setattr(self, '_traits', opts.get('traits', traits))
                )[0] if True else None
            }
        )
        # Fix __init__ properly (lambda doesn't work well for this)
        def __init__(self, **opts):
            GrammarBasedStrategy.__init__(self, grammar_format, **opts)
            # Scripting base (GrammarBasedDocumentStrategy) needs format_name/grammar_format in opts
            opts_with_format = {**opts, 'format_name': grammar_format, 'grammar_format': grammar_format}
            base_class.__init__(self, **opts_with_format)
            self._mode = opts.get('mode', QueryMode.AUTO)
            self._traits = opts.get('traits', traits)
        DynamicStrategy.__init__ = __init__
        return DynamicStrategy(**options)
    @staticmethod

    def get_strategy_class(format_name: str) -> type[AQueryStrategy]:
        """
        Get strategy class (not instance) for format name.
        Returns the class type that can be instantiated later.
        Args:
            format_name: Format name (e.g., 'SQL', 'GRAPHQL')
        Returns:
            Strategy class type
        """
        format_upper = format_name.upper()
        grammar_format = FORMAT_GRAMMAR_MAP.get(format_upper, format_name.lower())
        base_class = FORMAT_BASE_CLASS_MAP.get(format_upper, AQueryStrategy)
        traits = FORMAT_TRAIT_MAP.get(format_upper, QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL)
        # Create class dynamically
        class_name = f"{format_upper}Strategy"
        def __init__(self, **opts):
            GrammarBasedStrategy.__init__(self, grammar_format, **opts)
            opts_with_format = {**opts, 'format_name': grammar_format, 'grammar_format': grammar_format}
            base_class.__init__(self, **opts_with_format)
            self._mode = opts.get('mode', QueryMode.AUTO)
            self._traits = opts.get('traits', traits)
        DynamicStrategy = type(
            class_name,
            (GrammarBasedStrategy, base_class),
            {'__init__': __init__}
        )
        return DynamicStrategy
    @staticmethod

    def list_formats() -> list[str]:
        """List all available formats."""
        return sorted(set(FORMAT_GRAMMAR_MAP.keys()))
# Create FORMAT_STRATEGY_MAP as a factory
# Instead of storing strategy classes, store factory functions


def create_format_strategy_map() -> dict[str, type[AQueryStrategy]]:
    """
    Create format strategy map using registry.
    Returns a dict that looks like the old FORMAT_STRATEGY_MAP,
    but uses the registry to dynamically create strategies.
    """
    # Return a dict with lazy factory functions
    # When accessed, creates strategy using registry
    class StrategyFactory:
        """Factory that creates strategies on-demand."""
        def __init__(self, format_name: str):
            self.format_name = format_name
        def __call__(self, **options):
            return FormatRegistry.get_strategy(self.format_name, **options)
    # Create factory for each format
    return {
        format_name: StrategyFactory(format_name)
        for format_name in FormatRegistry.list_formats()
    }
__all__ = [
    'FormatRegistry',
    'FORMAT_GRAMMAR_MAP',
    'FORMAT_BASE_CLASS_MAP',
    'FORMAT_TRAIT_MAP',
    'create_format_strategy_map',
]
