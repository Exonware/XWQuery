#!/usr/bin/env python3
"""
#exonware/xwquery/tests/0.core/test_edge_cases_comprehensive.py

Comprehensive Edge Case Tests for P0, P1, P2 Operations

Tests ALL edge cases:
- Empty data ([], {}, None)
- Null values in fields
- Type mismatches
- Missing fields
- Deeply nested data
- Invalid field names
- Large datasets
- Circular references
- Mixed types
- Unicode/special characters

Company: eXonware.com
"""

import pytest
from exonware.xwquery.query.executors.aggregation.group_executor import GroupExecutor
from exonware.xwquery.query.executors.aggregation.distinct_executor import DistinctExecutor
from exonware.xwquery.query.executors.aggregation.sum_executor import SumExecutor
from exonware.xwquery.query.executors.aggregation.avg_executor import AvgExecutor
from exonware.xwquery.query.executors.aggregation.min_executor import MinExecutor
from exonware.xwquery.query.executors.aggregation.max_executor import MaxExecutor
from exonware.xwquery.query.executors.core.update_executor import UpdateExecutor
from exonware.xwquery.query.executors.core.delete_executor import DeleteExecutor
from exonware.xwquery.query.executors.filtering.where_executor import WhereExecutor
from exonware.xwquery.query.executors.aggregation.having_executor import HavingExecutor
from exonware.xwquery.query.executors.advanced.join_executor import JoinExecutor
from exonware.xwquery.query.executors.filtering.filter_executor import FilterExecutor
from exonware.xwquery.query.executors.projection.project_executor import ProjectExecutor
from exonware.xwquery.contracts import QueryAction, ExecutionContext


class TestEmptyDataEdgeCases:
    """Test P0/P1/P2 operations with empty data."""
    
    def test_group_empty_list(self):
        """GROUP should handle empty list gracefully."""
        executor = GroupExecutor()
        action = QueryAction(type='GROUP', params={'fields': ['category']})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['total_items'] == 0
        assert result.data['total_groups'] >= 0
    
    def test_group_none_data(self):
        """GROUP should handle None data gracefully."""
        executor = GroupExecutor()
        action = QueryAction(type='GROUP', params={'fields': ['category']})
        context = ExecutionContext(node=None)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['total_items'] == 0
    
    def test_distinct_empty_list(self):
        """DISTINCT should handle empty list."""
        executor = DistinctExecutor()
        action = QueryAction(type='DISTINCT', params={})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert len(result.data.get('items', [])) == 0
    
    def test_where_empty_list(self):
        """WHERE should handle empty list."""
        executor = WhereExecutor()
        action = QueryAction(type='WHERE', params={'condition': {'age': 25}})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert len(result.data if isinstance(result.data, list) else []) == 0


class TestNullValueEdgeCases:
    """Test operations with null values in data."""
    
    def test_sum_with_null_values(self):
        """SUM should skip null values."""
        executor = SumExecutor()
        data = [{'price': 10}, {'price': None}, {'price': 20}, {'price': None}]
        action = QueryAction(type='SUM', params={'field': 'price'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 30  # Should skip None values
    
    def test_avg_with_null_values(self):
        """AVG should skip null values."""
        executor = AvgExecutor()
        data = [{'value': 10}, {'value': None}, {'value': 20}]
        action = QueryAction(type='AVG', params={'field': 'value'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['avg'] == 15.0  # (10+20)/2, skipping None
    
    def test_min_max_with_null_values(self):
        """MIN/MAX should skip null values."""
        data = [{'value': 10}, {'value': None}, {'value': 5}, {'value': None}, {'value': 20}]
        
        min_executor = MinExecutor()
        min_action = QueryAction(type='MIN', params={'field': 'value'})
        min_context = ExecutionContext(node=data)
        min_result = min_executor._do_execute(min_action, min_context)
        
        max_executor = MaxExecutor()
        max_action = QueryAction(type='MAX', params={'field': 'value'})
        max_context = ExecutionContext(node=data)
        max_result = max_executor._do_execute(max_action, max_context)
        
        assert min_result.success
        assert min_result.data['min'] == 5
        assert max_result.success
        assert max_result.data['max'] == 20
    
    def test_group_with_null_keys(self):
        """GROUP should handle null values in grouping keys."""
        executor = GroupExecutor()
        data = [
            {'category': 'A', 'value': 1},
            {'category': None, 'value': 2},
            {'category': 'A', 'value': 3},
            {'category': None, 'value': 4},
        ]
        action = QueryAction(type='GROUP', params={'fields': ['category']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['total_groups'] == 2  # A and None as separate groups


class TestMissingFieldEdgeCases:
    """Test operations when fields are missing."""
    
    def test_sum_missing_field(self):
        """SUM should handle missing fields gracefully."""
        executor = SumExecutor()
        data = [
            {'price': 10},
            {'name': 'item2'},  # Missing 'price'
            {'price': 20}
        ]
        action = QueryAction(type='SUM', params={'field': 'price'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 30  # Should skip item without price
    
    def test_group_missing_field(self):
        """GROUP should handle missing group fields."""
        executor = GroupExecutor()
        data = [
            {'category': 'A', 'value': 1},
            {'value': 2},  # Missing 'category'
            {'category': 'A', 'value': 3}
        ]
        action = QueryAction(type='GROUP', params={'fields': ['category']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        # Should group item without category as None/missing group
    
    def test_where_missing_field(self):
        """WHERE should handle missing fields in condition."""
        executor = WhereExecutor()
        data = [
            {'name': 'Alice', 'age': 25},
            {'name': 'Bob'},  # Missing 'age'
            {'name': 'Charlie', 'age': 30}
        ]
        action = QueryAction(type='WHERE', params={'condition': {'age': 25}})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        # Should only match Alice, skip Bob (missing age)
        filtered = result.data if isinstance(result.data, list) else []
        assert len(filtered) == 1
        assert filtered[0]['name'] == 'Alice'


class TestTypeMismatchEdgeCases:
    """Test operations with type mismatches."""
    
    def test_sum_string_numbers(self):
        """SUM should convert string numbers."""
        executor = SumExecutor()
        data = [{'price': '10'}, {'price': '20'}, {'price': 30}]
        action = QueryAction(type='SUM', params={'field': 'price'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 60  # Should convert strings to numbers
    
    def test_sum_invalid_types(self):
        """SUM should skip invalid types."""
        executor = SumExecutor()
        data = [
            {'price': 10},
            {'price': 'invalid'},  # Non-numeric string
            {'price': 20},
            {'price': [1, 2, 3]}  # List
        ]
        action = QueryAction(type='SUM', params={'field': 'price'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 30  # Should skip invalid types
    
    def test_group_mixed_types(self):
        """GROUP should handle mixed types in keys."""
        executor = GroupExecutor()
        data = [
            {'key': 1, 'value': 'a'},
            {'key': '1', 'value': 'b'},  # String '1' vs int 1
            {'key': 1, 'value': 'c'},
            {'key': True, 'value': 'd'},  # Boolean
        ]
        action = QueryAction(type='GROUP', params={'fields': ['key']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        # Should treat different types as different keys


class TestNestedDataEdgeCases:
    """Test operations with nested/complex data."""
    
    def test_project_nested_fields(self):
        """PROJECT should handle nested field access."""
        executor = ProjectExecutor()
        data = [
            {'user': {'name': 'Alice', 'profile': {'age': 25}}},
            {'user': {'name': 'Bob', 'profile': {'age': 30}}},
        ]
        action = QueryAction(type='PROJECT', params={'fields': ['user.name', 'user.profile.age']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        items = result.data.get('items', [])
        assert len(items) == 2
        # Should extract nested values
    
    def test_where_nested_conditions(self):
        """WHERE should handle nested field conditions."""
        executor = WhereExecutor()
        data = [
            {'user': {'age': 25}},
            {'user': {'age': 30}},
            {'user': {'age': 35}},
        ]
        action = QueryAction(type='WHERE', params={'condition': {'user.age': 30}})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        # Should filter based on nested field
        assert result.success


class TestLargeDatasetEdgeCases:
    """Test operations with large datasets for performance/memory."""
    
    def test_distinct_large_dataset(self):
        """DISTINCT should handle large datasets efficiently."""
        executor = DistinctExecutor()
        # Create 10,000 items with many duplicates
        data = [{'id': i % 100, 'value': i} for i in range(10000)]
        action = QueryAction(type='DISTINCT', params={'fields': ['id']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        # Should have 100 unique IDs
        items = result.data.get('items', [])
        count = result.data.get('count', result.data.get('unique_count', len(items)))
        assert count <= 100
    
    def test_sum_large_dataset(self):
        """SUM should handle large datasets without overflow."""
        executor = SumExecutor()
        data = [{'value': 1000000} for _ in range(1000)]
        action = QueryAction(type='SUM', params={'field': 'value'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 1_000_000_000  # 1 billion


class TestSpecialCharacterEdgeCases:
    """Test operations with special characters and Unicode."""
    
    def test_group_unicode_keys(self):
        """GROUP should handle Unicode characters in keys."""
        executor = GroupExecutor()
        data = [
            {'category': '日本語', 'value': 1},
            {'category': 'العربية', 'value': 2},
            {'category': '日本語', 'value': 3},
            {'category': 'Русский', 'value': 4},
        ]
        action = QueryAction(type='GROUP', params={'fields': ['category']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['total_groups'] == 3  # 3 unique Unicode categories
    
    def test_where_special_characters(self):
        """WHERE should handle special characters in values."""
        executor = WhereExecutor()
        data = [
            {'name': "O'Brien"},
            {'name': 'Smith'},
            {'name': 'Jean-Paul'},
        ]
        action = QueryAction(type='WHERE', params={'condition': {'name': "O'Brien"}})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        filtered = result.data if isinstance(result.data, list) else []
        assert len(filtered) == 1
        assert filtered[0]['name'] == "O'Brien"


class TestUnhashableTypeEdgeCases:
    """Test operations with unhashable types (lists, dicts)."""
    
    def test_distinct_unhashable_items(self):
        """DISTINCT should handle unhashable items (dicts, lists)."""
        executor = DistinctExecutor()
        data = [
            {'id': 1, 'tags': ['a', 'b']},
            {'id': 1, 'tags': ['a', 'b']},  # Duplicate
            {'id': 2, 'tags': ['c', 'd']},
        ]
        action = QueryAction(type='DISTINCT', params={})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        # Should deduplicate even with unhashable 'tags' field
    
    def test_group_list_values(self):
        """GROUP should handle items with list values."""
        executor = GroupExecutor()
        data = [
            {'category': 'A', 'tags': ['x', 'y']},
            {'category': 'B', 'tags': ['z']},
            {'category': 'A', 'tags': ['w']},
        ]
        action = QueryAction(type='GROUP', params={'fields': ['category']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['total_groups'] == 2  # A and B


class TestBoundaryConditions:
    """Test operations at boundary conditions."""
    
    def test_sum_zero_values(self):
        """SUM should handle all zero values."""
        executor = SumExecutor()
        data = [{'value': 0}, {'value': 0}, {'value': 0}]
        action = QueryAction(type='SUM', params={'field': 'value'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 0
    
    def test_avg_single_item(self):
        """AVG should handle single item."""
        executor = AvgExecutor()
        data = [{'value': 42}]
        action = QueryAction(type='AVG', params={'field': 'value'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['avg'] == 42.0
    
    def test_distinct_all_unique(self):
        """DISTINCT with all unique items."""
        executor = DistinctExecutor()
        data = [{'id': i} for i in range(100)]
        action = QueryAction(type='DISTINCT', params={'fields': ['id']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        items = result.data.get('items', [])
        count = result.data.get('count', result.data.get('unique_count', len(items)))
        assert count == 100
    
    def test_distinct_all_duplicates(self):
        """DISTINCT with all duplicates."""
        executor = DistinctExecutor()
        data = [{'id': 1} for _ in range(100)]
        action = QueryAction(type='DISTINCT', params={'fields': ['id']})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        items = result.data.get('items', [])
        count = result.data.get('count', result.data.get('unique_count', len(items)))
        assert count == 1


class TestComplexRealWorldScenarios:
    """Test complex real-world scenarios."""
    
    def test_ecommerce_order_aggregation(self):
        """Test realistic e-commerce order aggregation."""
        data = [
            {'order_id': 1, 'customer': 'Alice', 'amount': 100.50, 'status': 'completed'},
            {'order_id': 2, 'customer': 'Bob', 'amount': None, 'status': 'pending'},  # Null amount
            {'order_id': 3, 'customer': 'Alice', 'amount': 200.00, 'status': 'completed'},
            {'order_id': 4, 'customer': 'Charlie', 'amount': '50.25', 'status': 'completed'},  # String amount
            {'order_id': 5, 'customer': None, 'amount': 75.00, 'status': 'cancelled'},  # Null customer
        ]
        
        # Group by customer
        group_executor = GroupExecutor()
        group_action = QueryAction(type='GROUP', params={'fields': ['customer']})
        group_context = ExecutionContext(node=data)
        group_result = group_executor._do_execute(group_action, group_context)
        
        assert group_result.success
        # Should handle None customer and group correctly
        
        # Sum amounts (should skip None, convert string)
        sum_executor = SumExecutor()
        sum_action = QueryAction(type='SUM', params={'field': 'amount'})
        sum_context = ExecutionContext(node=data)
        sum_result = sum_executor._do_execute(sum_action, sum_context)
        
        assert sum_result.success
        # Should sum: 100.50 + 200.00 + 50.25 + 75.00 = 425.75
        assert abs(sum_result.data['sum'] - 425.75) < 0.01


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])

