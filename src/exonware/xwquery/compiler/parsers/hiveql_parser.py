#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/hiveql_parser.py
HiveQL parser - Hadoop Hive SQL dialect.
Extends SQL parser with MapReduce functions and Hadoop features.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: 28-Oct-2025
"""

from .sql_parser import SQLParser
from ...contracts import QueryAction
from ...defs import ConversionMode


class HiveQLParser(SQLParser):
    """
    HiveQL parser for Hadoop Hive queries.
    Extensions over SQL:
    - PARTITIONED BY, CLUSTERED BY
    - LATERAL VIEW for table-generating functions
    - TRANSFORM using scripts
    - ARRAY, MAP, STRUCT data types
    - UDFs and UDAFs
    Reuses: 80% of SQL parser
    """

    def get_format_name(self) -> str:
        return "HiveQL"


def parse_hiveql(query: str, **options) -> list[QueryAction]:
    """Parse HiveQL query to QueryAction tree."""
    parser = HiveQLParser()
    return parser.parse_with_validation(query, **options)
__all__ = ['HiveQLParser', 'parse_hiveql']
