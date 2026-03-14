#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/integration/xwsystem_query_provider.py
xwsystem.query provider implementation for xwquery.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 28-Dec-2025
"""

from __future__ import annotations
from typing import Any
from exonware.xwsystem.query import IQueryProvider, QueryResult


class XWQueryProvider(IQueryProvider):
    """
    xwquery-backed query provider for the xwsystem query registry.
    """
    provider_id: str = "xwquery"

    def execute(
        self,
        query: str,
        data: Any,
        *,
        format: str | None = None,
        auto_detect: bool = True,
        **opts: Any,
    ) -> QueryResult:
        # Local import to avoid importing full xwquery graph at module import time.
        from exonware.xwquery import XWQuery
        return XWQuery.execute(query, data, format=format, auto_detect=auto_detect, **opts)
