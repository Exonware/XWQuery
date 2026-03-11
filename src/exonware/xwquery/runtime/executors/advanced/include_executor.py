#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/executors/advanced/include_executor.py
INCLUDE Executor - RavenDB-style query includes for related document fetching
Implements eager loading of related documents to avoid N+1 query problems.
This is equivalent to RavenDB's .Include() functionality.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 20-Dec-2025
"""

from typing import Any, Optional, Callable
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
# REUSE: Shared utilities
from ..utils import extract_items


class IncludeExecutor(AUniversalOperationExecutor):
    """
    INCLUDE operation executor for eager loading related documents.
    RavenDB-style query includes allow fetching related documents in a single query,
    avoiding the N+1 query problem where one query fetches main documents and then
    N additional queries fetch related documents.
    Example usage:
    - Include('customer') - Include customer document referenced by customer_id
    - Include('customer', 'orders') - Include nested includes
    - Include(['customer', 'products']) - Include multiple relations
    Priority alignment:
    - Performance (#4): Reduces N+1 queries to 1 query with joins/includes
    - Usability (#2): Simple API for eager loading
    - Maintainability (#3): Clean implementation following executor pattern
    Following GUIDE_DEV.md principles:
    - **Never reinvent the wheel**: Uses hash maps for O(1) lookups
    - **Performance focus**: Single query execution instead of N+1 queries
    Capability: Universal
    Operation Type: JOINING (related to joins but focuses on eager loading)
    """
    OPERATION_NAME = "INCLUDE"
    OPERATION_TYPE = OperationType.JOINING  # Related to joins

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute INCLUDE operation to eagerly load related documents.
        Args:
            action: QueryAction with INCLUDE parameters
            context: Execution context with main query results
        Returns:
            ExecutionResult with included documents merged into main results
        """
        params = action.params
        node = context.node
        # Get main results (typically from SELECT)
        main_results = extract_items(node)
        if not isinstance(main_results, list):
            main_results = [main_results] if main_results is not None else []
        # Get include specifications
        includes = params.get('includes', [])
        if isinstance(includes, str):
            includes = [includes]
        # Collection name/path to load related documents from
        collection_path = params.get('collection', params.get('path', ''))
        # Relationship configuration
        relation_config = params.get('relation', {})
        if isinstance(relation_config, str):
            # Simple string: assume foreign key field name
            relation_config = {'foreign_key': relation_config, 'local_key': 'id'}
        # Execute includes
        enriched_results = self._execute_includes(
            main_results,
            includes,
            collection_path,
            relation_config,
            context
        )
        return ExecutionResult(
            success=True,
            data=enriched_results,
            action_type=self.OPERATION_NAME,
            metadata={
                'operation': self.OPERATION_NAME,
                'includes': includes,
                'main_count': len(main_results),
                'enriched_count': len(enriched_results)
            }
        )

    def _execute_includes(
        self,
        main_results: list[dict],
        includes: list[str | dict],
        collection_path: str,
        relation_config: dict,
        context: ExecutionContext
    ) -> list[dict]:
        """
        Execute includes for main results.
        Args:
            main_results: Main query results
            includes: List of include specifications (strings or dicts)
            collection_path: Path to collection containing related documents
            relation_config: Relationship configuration
            context: Execution context
        Returns:
            List of enriched results with included documents
        """
        if not main_results or not includes:
            return main_results
        # Load all related documents from collection
        related_docs = self._load_related_collection(collection_path, context)
        # Build hash map for O(1) lookups (REUSE: hash map pattern)
        foreign_key = relation_config.get('foreign_key', 'id')
        local_key = relation_config.get('local_key', 'id')
        related_map = self._build_related_map(related_docs, foreign_key)
        # Enrich each main result with included documents
        enriched = []
        for main_doc in main_results:
            enriched_doc = dict(main_doc)  # Copy main document
            # Process each include
            for include_spec in includes:
                if isinstance(include_spec, str):
                    # Simple string include: 'customer'
                    include_key = include_spec
                    include_path = include_spec
                    nested_includes = []
                elif isinstance(include_spec, dict):
                    # Complex include: {'path': 'customer', 'includes': ['orders']}
                    include_key = include_spec.get('path', include_spec.get('name', ''))
                    include_path = include_spec.get('path', include_spec.get('name', ''))
                    nested_includes = include_spec.get('includes', [])
                else:
                    continue
                # Get reference value from main document (local_key = field in main doc, e.g. quest_id)
                fk_value = self._extract_field_value(main_doc, local_key)
                if fk_value is not None:
                    # Find related document(s)
                    related_doc = related_map.get(fk_value)
                    if related_doc:
                        # Handle nested includes recursively
                        if nested_includes:
                            related_doc = self._execute_nested_includes(
                                related_doc,
                                nested_includes,
                                collection_path,
                                relation_config,
                                context
                            )
                        # Attach included document
                        enriched_doc[include_key] = related_doc
                    else:
                        # No related document found - set to None
                        enriched_doc[include_key] = None
            enriched.append(enriched_doc)
        return enriched

    def _load_related_collection(self, collection_path: str, context: ExecutionContext) -> list[dict]:
        """
        Load related collection from context node.
        Args:
            collection_path: Path to collection (e.g., 'customers', 'products')
            context: Execution context
        Returns:
            List of documents from related collection
        """
        if not collection_path:
            return []
        # Try to get collection from context node
        node = context.node
        # Navigate to collection
        if hasattr(node, "get_value"):
            collection_data = node.get_value(collection_path, None)
        elif hasattr(node, "get"):
            collection_node = node.get(collection_path)
            if hasattr(collection_node, 'value'):
                collection_data = collection_node.value
            elif hasattr(collection_node, 'to_native'):
                collection_data = collection_node.to_native()
            else:
                collection_data = collection_node
        else:
            # Fallback: try as dict/list
            if isinstance(node, dict):
                collection_data = node.get(collection_path)
            else:
                collection_data = None
        # Extract items
        if collection_data is None:
            return []
        items = extract_items(collection_data)
        if isinstance(items, list):
            return items
        elif items is not None:
            return [items]
        return []

    def _build_related_map(self, related_docs: list[dict], key_field: str) -> dict[Any, dict]:
        """
        Build hash map for O(1) lookup of related documents.
        REUSE: Hash map pattern (xwnode HASH_MAP strategy equivalent).
        Args:
            related_docs: List of related documents
            key_field: Field name to use as key
        Returns:
            Dictionary mapping key values to documents
        """
        related_map = {}
        for doc in related_docs:
            key_value = self._extract_field_value(doc, key_field)
            if key_value is not None:
                # Handle one-to-many: store as list
                if key_value in related_map:
                    if not isinstance(related_map[key_value], list):
                        related_map[key_value] = [related_map[key_value]]
                    related_map[key_value].append(doc)
                else:
                    related_map[key_value] = doc
        return related_map

    def _execute_nested_includes(
        self,
        document: dict,
        nested_includes: list[str | dict],
        collection_path: str,
        relation_config: dict,
        context: ExecutionContext
    ) -> dict:
        """
        Execute nested includes on a single document.
        Args:
            document: Document to enrich
            nested_includes: List of nested include specifications
            collection_path: Path to nested collection
            relation_config: Relationship configuration
            context: Execution context
        Returns:
            Enriched document with nested includes
        """
        # For nested includes, we need to know the nested collection path
        # This is typically derived from the include path
        # For now, reuse the same collection_path (can be enhanced later)
        # Recursively process nested includes
        enriched = dict(document)
        for nested_include in nested_includes:
            if isinstance(nested_include, str):
                nested_path = nested_include
            elif isinstance(nested_include, dict):
                nested_path = nested_include.get('path', nested_include.get('name', ''))
            else:
                continue
            # Load nested collection (this would typically be a different collection)
            nested_collection = self._load_related_collection(nested_path, context)
            # Build map for nested documents
            nested_foreign_key = relation_config.get('foreign_key', 'id')
            nested_map = self._build_related_map(nested_collection, nested_foreign_key)
            # Find and attach nested documents
            fk_value = self._extract_field_value(document, nested_foreign_key)
            if fk_value is not None and fk_value in nested_map:
                enriched[nested_path] = nested_map[fk_value]
        return enriched

    def _extract_field_value(self, document: dict, field_path: str) -> Any:
        """
        Extract field value from document, supporting dot notation.
        Args:
            document: Document to extract from
            field_path: Field path (supports dot notation like 'customer.id')
        Returns:
            Field value or None
        """
        if not document or not field_path:
            return None
        # Handle dot notation
        if '.' in field_path:
            parts = field_path.split('.')
            value = document
            for part in parts:
                if isinstance(value, dict):
                    value = value.get(part)
                elif hasattr(value, part):
                    value = getattr(value, part)
                else:
                    return None
                if value is None:
                    return None
            return value
        # Simple field access
        if isinstance(document, dict):
            return document.get(field_path)
        elif hasattr(document, field_path):
            return getattr(document, field_path)
        return None
__all__ = ['IncludeExecutor']
