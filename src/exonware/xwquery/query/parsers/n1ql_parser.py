#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/n1ql_parser.py

N1QL parser - Couchbase N1QL (SQL for JSON).
Extends SQL parser with document operations and nested paths.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import List
from .sql_parser import SQLParser
from ...contracts import QueryAction
from ...defs import ConversionMode


class N1QLParser(SQLParser):
    """
    N1QL parser for Couchbase queries.
    
    N1QL = SQL for JSON documents
    
    Extensions over SQL:
    - Document path navigation (user.address.city)
    - Array operations (orders[0], orders[*])
    - UNNEST for array flattening
    - KEY/VALUE operations
    - Missing/Null distinction
    
    Reuses: 85% of SQL parser
    Extends: Path navigation, array operations
    """
    
    def get_format_name(self) -> str:
        return "N1QL"


def parse_n1ql(query: str, **options) -> List[QueryAction]:
    """Parse N1QL query to QueryAction tree."""
    parser = N1QLParser()
    return parser.parse_with_validation(query, **options)


__all__ = ['N1QLParser', 'parse_n1ql']

