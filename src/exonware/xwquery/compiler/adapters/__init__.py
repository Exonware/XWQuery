#!/usr/bin/env python3
"""
Adapters package for xwquery
Provides adapters to integrate external systems with xwquery.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

from .syntax_adapter import SyntaxToQueryActionConverter, GrammarBasedSQLStrategy
from .grammar_adapter import (
    UniversalGrammarAdapter,
    SQLGrammarAdapter,
    GraphQLGrammarAdapter,
    CypherGrammarAdapter,
    MongoDBGrammarAdapter,
    SPARQLGrammarAdapter
)
__all__ = [
    "SyntaxToQueryActionConverter",
    "GrammarBasedSQLStrategy",
    "UniversalGrammarAdapter",
    "SQLGrammarAdapter",
    "GraphQLGrammarAdapter",
    "CypherGrammarAdapter",
    "MongoDBGrammarAdapter",
    "SPARQLGrammarAdapter",
]
