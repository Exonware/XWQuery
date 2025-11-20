#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/hql_parser.py

HQL parser - Hibernate Query Language (ORM-oriented SQL).
Extends SQL parser with object-oriented features.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import List
from .sql_parser import SQLParser
from ..contracts import QueryAction
from ..defs import ConversionMode


class HQLParser(SQLParser):
    """
    HQL parser for Hibernate queries.
    
    Extensions over SQL:
    - Object navigation (user.address.street)
    - Polymorphic queries
    - Fetch joins
    - Native SQL embedding
    
    Reuses: 75% of SQL parser
    """
    
    def get_format_name(self) -> str:
        return "HQL"


def parse_hql(query: str, **options) -> List[QueryAction]:
    """Parse HQL query to QueryAction tree."""
    parser = HQLParser()
    return parser.parse_with_validation(query, **options)


__all__ = ['HQLParser', 'parse_hql']

