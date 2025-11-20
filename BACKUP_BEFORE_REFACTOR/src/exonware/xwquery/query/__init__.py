#!/usr/bin/env python3
"""
Query subsystem for xwquery.

Contains all query-related components:
- adapters: Syntax adapters (AST conversion)
- executors: Operation executors
- generators: Query generators
- grammars: Grammar definitions
- optimization: Query optimization
- parsers: Query parsers
- strategies: Query strategies
"""

# Re-export for convenience (optional - can add as needed)
# This allows: from exonware.xwquery.query import ExecutionEngine
# Instead of: from exonware.xwquery.query.executors import ExecutionEngine

__all__ = [
    "adapters",
    "executors",
    "generators",
    "grammars",
    "optimization",
    "parsers",
    "strategies",
]
