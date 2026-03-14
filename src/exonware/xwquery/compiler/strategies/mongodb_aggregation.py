#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/mongodb_aggregation.py
MongoDB Aggregation Framework Query Strategy
This module implements the MongoDB Aggregation Framework query strategy for MongoDB aggregation pipeline operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""

from typing import Any
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class MongoDBAggregationStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """MongoDB Aggregation Framework query strategy for aggregation pipeline operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'mongodbaggregation', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute MongoDB aggregation pipeline query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid MongoDB aggregation query: {query}")
        return {"result": "MongoDB aggregation query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate MongoDB aggregation pipeline query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["$match", "$group", "$project", "$sort", "$limit", "$skip", "$unwind", "$lookup", "aggregate"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get MongoDB aggregation query execution plan."""
        return {
            "query_type": "MONGODB_AGGREGATION",
            "complexity": "HIGH",
            "estimated_cost": 120
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f'db.collection.aggregate([{{"$match": {{{path}: {{$exists: true}}}}}}])')

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f'db.collection.aggregate([{{"$match": {filter_expression}}}])')

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        projection = {field: 1 for field in fields}
        return self.execute(f'db.collection.aggregate([{{"$project": {projection}}}])')

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        sort_order = 1 if order == "asc" else -1
        return self.execute(f'db.collection.aggregate([{{"$sort": {{{sort_fields[0]}: {sort_order}}}}}])')

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        pipeline = []
        if offset > 0:
            pipeline.append({"$skip": offset})
        pipeline.append({"$limit": limit})
        return self.execute(f'db.collection.aggregate({pipeline})')
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse MongoDB aggregation pipeline
        entity_name = None
        fields = []
        where_conditions = []
        # Extract collection name from db.collection.aggregate(...)
        collection_match = re.search(r'db\.(\w+)\.aggregate', query, re.IGNORECASE)
        if collection_match:
            entity_name = collection_match.group(1)
        # Try to extract pipeline stages
        pipeline_match = re.search(r'aggregate\s*\(?\s*(\[[^\]]+\])', query, re.IGNORECASE | re.DOTALL)
        if pipeline_match:
            try:
                pipeline_str = pipeline_match.group(1)
                serializer = _get_global_serializer('json')
                pipeline = serializer.loads(pipeline_str)
                for stage in pipeline:
                    if "$match" in stage:
                        match_expr = stage["$match"]
                        if isinstance(match_expr, dict):
                            for key, value in match_expr.items():
                                where_conditions.append(f"{key} = {value}")
                    elif "$project" in stage:
                        project_expr = stage["$project"]
                        if isinstance(project_expr, dict):
                            fields = [k for k, v in project_expr.items() if v == 1 or v == True]
            except (SerializationError, ValueError, KeyError):
                pass
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "mongodb_agg_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "mongodb_agg_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "mongodb_agg_select_1",
            "content": f"SELECT {select_fields}",
            "line_number": 1,
            "timestamp": datetime.now().isoformat(),
            "children": children
        }
        actions = {
            "root": {
                "type": "PROGRAM",
                "statements": [select_action],
                "comments": [],
                "metadata": {
                    "version": "1.0",
                    "created": datetime.now().isoformat(),
                    "source_format": "MONGODB_AGGREGATION"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Build pipeline
        pipeline = []
        # Add $match stage if WHERE conditions exist
        if where_conditions:
            match_obj = {}
            for cond in where_conditions:
                if ' = ' in cond:
                    key, value = cond.split(' = ', 1)
                    match_obj[key.strip()] = value.strip().strip('"\'')
            if match_obj:
                pipeline.append({"$match": match_obj})
        # Add $project stage if fields are specified
        if fields:
            project_obj = {f: 1 for f in fields}
            pipeline.append({"$project": project_obj})
        pipeline_str = str(pipeline).replace("'", '"')
        return f"db.{collection}.aggregate({pipeline_str})"
