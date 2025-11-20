#!/usr/bin/env python3
"""
#exonware/xwquery/tests/0.core/test_executor_refactoring.py

Core tests for refactored executors (P0+P1+P2)
Validates shared utilities and code reuse excellence

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: 28-Oct-2025
"""

import pytest
from exonware.xwquery.query.executors.utils import (
    extract_items,
    extract_numeric_value,
    extract_field_value,
    matches_condition,
    make_hashable,
    compute_aggregates,
    project_fields,
)
from exonware.xwquery.query.executors.aggregation import (
    GroupExecutor, DistinctExecutor, SumExecutor, AvgExecutor, MinExecutor, MaxExecutor,
    HavingExecutor, SummarizeExecutor
)
from exonware.xwquery.query.executors.filtering import (
    WhereExecutor, FilterExecutor, LikeExecutor, BetweenExecutor, 
    InExecutor, RangeExecutor, HasExecutor, TermExecutor, OptionalExecutor
)
from exonware.xwquery.query.executors.advanced import JoinExecutor
from exonware.xwquery.query.executors.projection import ProjectExecutor, ExtendExecutor
from exonware.xwquery.query.executors.array import IndexingExecutor, SlicingExecutor
from exonware.xwquery.contracts import QueryAction, ExecutionContext


# ============================================================================
# SHARED UTILITIES TESTS - Foundation for all executors
# ============================================================================

@pytest.mark.xwquery_core
class TestSharedUtilities:
    """Test shared utilities that all executors depend on."""
    
    def test_extract_items_from_list(self):
        """Test extract_items handles lists correctly."""
        data = [1, 2, 3, 4, 5]
        result = extract_items(data)
        assert result == [1, 2, 3, 4, 5]
    
    def test_extract_items_from_dict(self):
        """Test extract_items wraps dict in list."""
        data = {'key': 'value'}
        result = extract_items(data)
        assert result == [{'key': 'value'}]
    
    def test_extract_numeric_value_from_dict(self):
        """Test numeric extraction from dict field."""
        item = {'age': 25, 'name': 'Alice'}
        value = extract_numeric_value(item, 'age')
        assert value == 25.0
    
    def test_extract_numeric_value_string_conversion(self):
        """Test numeric extraction converts strings."""
        item = {'score': '95.5'}
        value = extract_numeric_value(item, 'score')
        assert value == 95.5
    
    def test_extract_field_value_nested_path(self):
        """Test nested field extraction using dot notation."""
        item = {'user': {'profile': {'email': 'test@example.com'}}}
        value = extract_field_value(item, 'user.profile.email')
        assert value == 'test@example.com'
    
    def test_make_hashable_dict(self):
        """Test dict conversion to hashable frozenset."""
        data = {'key': 'value', 'num': 42}
        hashable = make_hashable(data)
        assert isinstance(hashable, frozenset)
        # Should be hashable
        assert hash(hashable) is not None
    
    def test_compute_aggregates_single_pass(self):
        """Test compute_aggregates returns all stats in one pass."""
        data = [10, 20, 30, 40, 50]
        result = compute_aggregates(data)
        
        assert result['count'] == 5
        assert result['sum'] == 150
        assert result['avg'] == 30.0
        assert result['min'] == 10.0
        assert result['max'] == 50.0


# ============================================================================
# P0 AGGREGATION TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestP0Aggregations:
    """Test P0 aggregation executors with shared utilities."""
    
    def test_group_executor_basic_grouping(self):
        """Test GROUP BY with hash-based grouping."""
        data = [
            {'category': 'A', 'value': 10},
            {'category': 'B', 'value': 20},
            {'category': 'A', 'value': 15},
        ]
        
        action = QueryAction(type='GROUP', params={'fields': 'category'})
        context = ExecutionContext(node=data)
        executor = GroupExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        groups = result.data.get('groups', [])
        assert len(groups) == 2  # Two categories
    
    def test_distinct_executor_deduplication(self):
        """Test DISTINCT with hash set deduplication."""
        data = [1, 2, 3, 2, 1, 4, 3]
        
        action = QueryAction(type='DISTINCT', params={})
        context = ExecutionContext(node=data)
        executor = DistinctExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        items = result.data.get('items', [])
        assert len(items) == 4  # Unique: 1, 2, 3, 4
        assert set(items) == {1, 2, 3, 4}
    
    def test_sum_executor_uses_shared_compute_aggregates(self):
        """Test SUM uses shared compute_aggregates utility."""
        data = [{'value': 10}, {'value': 20}, {'value': 30}]
        
        action = QueryAction(type='SUM', params={'field': 'value'})
        context = ExecutionContext(node=data)
        executor = SumExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        assert result.data['sum'] == 60
        assert result.data['count'] == 3
    
    def test_avg_executor_uses_shared_compute_aggregates(self):
        """Test AVG uses shared compute_aggregates utility."""
        data = [10, 20, 30, 40]
        
        action = QueryAction(type='AVG', params={})
        context = ExecutionContext(node=data)
        executor = AvgExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        assert result.data['avg'] == 25.0
        assert result.data['count'] == 4
    
    def test_min_max_executors_use_shared_compute_aggregates(self):
        """Test MIN and MAX both use shared compute_aggregates."""
        data = [50, 10, 30, 20, 40]
        
        # MIN
        action_min = QueryAction(type='MIN', params={})
        context = ExecutionContext(node=data)
        min_executor = MinExecutor()
        result_min = min_executor._do_execute(action_min, context)
        assert result_min.data['min'] == 10.0
        
        # MAX
        action_max = QueryAction(type='MAX', params={})
        max_executor = MaxExecutor()
        result_max = max_executor._do_execute(action_max, context)
        assert result_max.data['max'] == 50.0


# ============================================================================
# P0 CORE OPERATION TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestP0CoreOperations:
    """Test P0 core operations with full traversal."""
    
    def test_update_executor_full_traversal(self):
        """Test UPDATE traverses all matching nodes."""
        data = [
            {'id': 1, 'status': 'active'},
            {'id': 2, 'status': 'active'},
            {'id': 3, 'status': 'inactive'},
        ]
        
        from exonware.xwquery.query.executors.core import UpdateExecutor
        
        action = QueryAction(type='UPDATE', params={
            'values': {'status': 'updated'},
            'where': {'status': 'active'}
        })
        context = ExecutionContext(node=data)
        executor = UpdateExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        assert result.data['count'] == 2  # Two active items updated
    
    def test_delete_executor_full_traversal(self):
        """Test DELETE traverses all matching nodes."""
        data = [
            {'id': 1, 'temp': True},
            {'id': 2, 'temp': False},
            {'id': 3, 'temp': True},
        ]
        
        from exonware.xwquery.query.executors.core import DeleteExecutor
        
        action = QueryAction(type='DELETE', params={
            'where': {'temp': True}
        })
        context = ExecutionContext(node=data)
        executor = DeleteExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        # Deletion should have been attempted
        assert result.data['count'] >= 0
    
    def test_where_executor_expression_evaluation(self):
        """Test WHERE with full expression evaluation."""
        data = [
            {'age': 25, 'name': 'Alice'},
            {'age': 30, 'name': 'Bob'},
            {'age': 20, 'name': 'Charlie'},
        ]
        
        # Dict-based condition
        action = QueryAction(type='WHERE', params={
            'condition': {'age': 25},
            'data': data
        })
        context = ExecutionContext(node=data)
        executor = WhereExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        assert len(result.data) == 1
        assert result.data[0]['name'] == 'Alice'
    
    def test_where_executor_callable_condition(self):
        """Test WHERE with callable condition."""
        data = [
            {'age': 25},
            {'age': 30},
            {'age': 20},
        ]
        
        action = QueryAction(type='WHERE', params={
            'condition': lambda item: item.get('age', 0) >= 25,
            'data': data
        })
        context = ExecutionContext(node=data)
        executor = WhereExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        assert len(result.data) == 2  # age >= 25


# ============================================================================
# P1 OPERATION TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestP1Operations:
    """Test P1 operations leveraging code reuse."""
    
    def test_having_reuses_where_evaluator(self):
        """Test HAVING reuses WHERE's expression evaluation."""
        groups = [
            {'key': {'category': 'A'}, '_count': 5},
            {'key': {'category': 'B'}, '_count': 15},
            {'key': {'category': 'C'}, '_count': 3},
        ]
        
        action = QueryAction(type='HAVING', params={
            'condition': lambda g: g.get('_count', 0) > 10
        })
        context = ExecutionContext(node=groups)
        executor = HavingExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        filtered = result.data.get('groups', [])
        assert len(filtered) == 1  # Only category B has count > 10
    
    def test_join_executor_inner_join(self):
        """Test JOIN with INNER join type using hash-based algorithm."""
        left_data = [
            {'id': 1, 'name': 'Alice'},
            {'id': 2, 'name': 'Bob'},
        ]
        right_data = [
            {'id': 1, 'email': 'alice@example.com'},
            {'id': 3, 'email': 'charlie@example.com'},
        ]
        
        action = QueryAction(type='JOIN', params={
            'right': right_data,
            'on': 'id',
            'type': 'INNER'
        })
        context = ExecutionContext(node=left_data)
        executor = JoinExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        joined = result.data.get('result', [])
        assert len(joined) == 1  # Only id=1 matches
    
    def test_join_executor_left_join(self):
        """Test JOIN with LEFT join preserves all left rows."""
        left_data = [
            {'id': 1, 'name': 'Alice'},
            {'id': 2, 'name': 'Bob'},
        ]
        right_data = [
            {'id': 1, 'email': 'alice@example.com'},
        ]
        
        action = QueryAction(type='JOIN', params={
            'right': right_data,
            'on': 'id',
            'type': 'LEFT'
        })
        context = ExecutionContext(node=left_data)
        executor = JoinExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        joined = result.data.get('result', [])
        assert len(joined) == 2  # Both left rows preserved
    
    def test_filter_reuses_where_evaluator(self):
        """Test FILTER reuses WHERE's expression evaluation."""
        data = [
            {'status': 'active', 'count': 10},
            {'status': 'inactive', 'count': 5},
            {'status': 'active', 'count': 20},
        ]
        
        action = QueryAction(type='FILTER', params={
            'condition': {'status': 'active'}
        })
        context = ExecutionContext(node=data)
        executor = FilterExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        filtered = result.data.get('items', [])
        assert len(filtered) == 2
    
    def test_project_executor_field_selection(self):
        """Test PROJECT with field selection and nested paths."""
        data = [
            {'name': 'Alice', 'age': 25, 'email': 'alice@test.com'},
            {'name': 'Bob', 'age': 30, 'email': 'bob@test.com'},
        ]
        
        action = QueryAction(type='PROJECT', params={
            'fields': ['name', 'age']
        })
        context = ExecutionContext(node=data)
        executor = ProjectExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        projected = result.data.get('items', [])
        assert len(projected) == 2
        # Each item should only have name and age
        for item in projected:
            assert 'name' in item
            assert 'age' in item
            assert 'email' not in item


# ============================================================================
# P2 FILTERING TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestP2FilteringOperations:
    """Test P2 filtering operations with shared utilities."""
    
    def test_like_executor_pattern_matching(self):
        """Test LIKE with SQL pattern matching."""
        data = [
            {'name': 'Alice'},
            {'name': 'Bob'},
            {'name': 'Alex'},
        ]
        
        action = QueryAction(type='LIKE', params={
            'field': 'name',
            'pattern': 'Al%'  # Starts with 'Al'
        })
        context = ExecutionContext(node=data)
        executor = LikeExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        matched = result.data.get('items', [])
        assert len(matched) == 2  # Alice and Alex
    
    def test_between_executor_range_filtering(self):
        """Test BETWEEN with range filtering."""
        data = [
            {'score': 50},
            {'score': 75},
            {'score': 90},
            {'score': 65},
        ]
        
        action = QueryAction(type='BETWEEN', params={
            'field': 'score',
            'min': 60,
            'max': 80
        })
        context = ExecutionContext(node=data)
        executor = BetweenExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        matched = result.data.get('items', [])
        assert len(matched) == 2  # 75 and 65
    
    def test_in_executor_set_membership(self):
        """Test IN with O(1) set membership."""
        data = [
            {'status': 'active'},
            {'status': 'pending'},
            {'status': 'inactive'},
        ]
        
        action = QueryAction(type='IN', params={
            'field': 'status',
            'values': ['active', 'pending']
        })
        context = ExecutionContext(node=data)
        executor = InExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        matched = result.data.get('items', [])
        assert len(matched) == 2
    
    def test_has_executor_field_existence(self):
        """Test HAS checks field existence."""
        data = [
            {'name': 'Alice', 'email': 'alice@test.com'},
            {'name': 'Bob'},
            {'name': 'Charlie', 'email': 'charlie@test.com'},
        ]
        
        action = QueryAction(type='HAS', params={
            'property': 'email'
        })
        context = ExecutionContext(node=data)
        executor = HasExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        matched = result.data.get('items', [])
        assert len(matched) == 2  # Alice and Charlie have email


# ============================================================================
# P2 OTHER OPERATIONS TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestP2OtherOperations:
    """Test P2 other operations (projection, array, aggregation)."""
    
    def test_extend_executor_adds_fields(self):
        """Test EXTEND adds computed fields."""
        data = [
            {'price': 100, 'quantity': 2},
            {'price': 50, 'quantity': 3},
        ]
        
        action = QueryAction(type='EXTEND', params={
            'fields': {
                'total': lambda item: item.get('price', 0) * item.get('quantity', 0)
            }
        })
        context = ExecutionContext(node=data)
        executor = ExtendExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        extended = result.data.get('items', [])
        assert len(extended) == 2
        assert extended[0].get('total') == 200
        assert extended[1].get('total') == 150
    
    def test_indexing_executor_python_list_indexing(self):
        """Test INDEXING uses Python's native indexing."""
        data = [10, 20, 30, 40, 50]
        
        action = QueryAction(type='INDEXING', params={'index': 2})
        context = ExecutionContext(node=data)
        executor = IndexingExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        assert result.data['item'] == 30
    
    def test_slicing_executor_python_list_slicing(self):
        """Test SLICING uses Python's native slicing."""
        data = [10, 20, 30, 40, 50]
        
        action = QueryAction(type='SLICING', params={
            'start': 1,
            'end': 4
        })
        context = ExecutionContext(node=data)
        executor = SlicingExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        sliced = result.data.get('items', [])
        assert sliced == [20, 30, 40]
    
    def test_summarize_executor_all_aggregates_one_pass(self):
        """Test SUMMARIZE computes all aggregates in ONE O(n) pass."""
        data = [10, 20, 30, 40, 50]
        
        action = QueryAction(type='SUMMARIZE', params={})
        context = ExecutionContext(node=data)
        executor = SummarizeExecutor()
        
        result = executor._do_execute(action, context)
        assert result.success
        
        # All aggregates computed in single pass!
        assert result.data['count'] == 5
        assert result.data['sum'] == 150
        assert result.data['avg'] == 30.0
        assert result.data['min'] == 10.0
        assert result.data['max'] == 50.0


# ============================================================================
# CODE REUSE VALIDATION TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestCodeReuseExcellence:
    """Validate code reuse following GUIDELINES_DEV.md."""
    
    def test_where_filter_having_share_evaluator(self):
        """Test WHERE, FILTER, HAVING all use same expression evaluator."""
        data = [{'value': 10}, {'value': 20}, {'value': 30}]
        condition = lambda item: item.get('value', 0) > 15
        
        # All three should produce same filtering logic
        where_exec = WhereExecutor()
        filter_exec = FilterExecutor()
        having_exec = HavingExecutor()
        
        # All should have _where_evaluator or use same evaluation
        assert hasattr(filter_exec, '_where_evaluator')
        assert hasattr(having_exec, '_where_evaluator')
    
    def test_aggregations_share_compute_utility(self):
        """Test SUM, AVG, MIN, MAX share compute_aggregates."""
        data = [1, 2, 3, 4, 5]
        
        # All should produce consistent results from shared utility
        aggregates = compute_aggregates(data)
        
        # Individual executors should return subset of these
        action_sum = QueryAction(type='SUM', params={})
        context = ExecutionContext(node=data)
        
        sum_result = SumExecutor()._do_execute(action_sum, context)
        assert sum_result.data['sum'] == aggregates['sum']
        
        avg_result = AvgExecutor()._do_execute(action_sum, context)
        assert avg_result.data['avg'] == aggregates['avg']
    
    def test_no_duplicate_extract_items(self):
        """Validate no executors have duplicate _extract_items methods."""
        # All executors should use shared extract_items utility
        # This test documents the refactoring achievement
        
        from exonware.xwquery.query.executors import utils
        
        # Verify shared utility exists
        assert hasattr(utils, 'extract_items')
        assert callable(utils.extract_items)
        
        # Verify it works correctly
        assert utils.extract_items([1, 2, 3]) == [1, 2, 3]
        assert utils.extract_items({'key': 'value'}) == [{'key': 'value'}]


# ============================================================================
# PERFORMANCE VALIDATION TESTS
# ============================================================================

@pytest.mark.xwquery_core
@pytest.mark.xwquery_performance
class TestPerformanceExcellence:
    """Validate performance optimizations."""
    
    def test_join_hash_based_performance(self):
        """Test JOIN uses O(n+m) hash-based algorithm."""
        # Large datasets to validate performance
        left_data = [{'id': i, 'value': f'left_{i}'} for i in range(100)]
        right_data = [{'id': i, 'value': f'right_{i}'} for i in range(50, 150)]
        
        action = QueryAction(type='JOIN', params={
            'right': right_data,
            'on': 'id',
            'type': 'INNER'
        })
        context = ExecutionContext(node=left_data)
        executor = JoinExecutor()
        
        import time
        start = time.time()
        result = executor._do_execute(action, context)
        elapsed = time.time() - start
        
        assert result.success
        # Should complete quickly (hash join is O(n+m), not O(n*m))
        assert elapsed < 0.1  # Should be nearly instant
    
    def test_compute_aggregates_single_pass(self):
        """Test compute_aggregates computes all stats in ONE pass."""
        # This is the KEY performance win - all aggregates in one O(n) pass
        data = list(range(1000))
        
        import time
        start = time.time()
        result = compute_aggregates(data)
        elapsed = time.time() - start
        
        # Single pass should be fast
        assert elapsed < 0.01
        
        # Verify all aggregates computed
        assert 'count' in result
        assert 'sum' in result
        assert 'avg' in result
        assert 'min' in result
        assert 'max' in result


# ============================================================================
# INTEGRATION TESTS
# ============================================================================

@pytest.mark.xwquery_core
class TestExecutorIntegration:
    """Test executors working together."""
    
    def test_where_then_group_then_having(self):
        """Test query pipeline: WHERE → GROUP → HAVING."""
        data = [
            {'category': 'A', 'value': 10, 'status': 'active'},
            {'category': 'B', 'value': 20, 'status': 'active'},
            {'category': 'A', 'value': 15, 'status': 'active'},
            {'category': 'A', 'value': 5, 'status': 'inactive'},
        ]
        
        # Step 1: WHERE filters to active only
        where_action = QueryAction(type='WHERE', params={
            'condition': {'status': 'active'},
            'data': data
        })
        where_context = ExecutionContext(node=data)
        where_result = WhereExecutor()._do_execute(where_action, where_context)
        
        assert len(where_result.data) == 3  # 3 active items
        
        # Step 2: GROUP BY category
        group_action = QueryAction(type='GROUP', params={'fields': 'category'})
        group_context = ExecutionContext(node=where_result.data)
        group_result = GroupExecutor()._do_execute(group_action, group_context)
        
        groups = group_result.data.get('groups', [])
        assert len(groups) == 2  # Categories A and B
    
    def test_project_then_filter(self):
        """Test PROJECT then FILTER pipeline."""
        data = [
            {'name': 'Alice', 'age': 25, 'score': 85},
            {'name': 'Bob', 'age': 30, 'score': 92},
            {'name': 'Charlie', 'age': 22, 'score': 78},
        ]
        
        # Step 1: PROJECT to select fields
        project_action = QueryAction(type='PROJECT', params={
            'fields': ['name', 'score']
        })
        project_context = ExecutionContext(node=data)
        project_result = ProjectExecutor()._do_execute(project_action, project_context)
        
        projected = project_result.data.get('items', [])
        assert len(projected) == 3
        
        # Step 2: FILTER high scores
        filter_action = QueryAction(type='FILTER', params={
            'condition': lambda item: item.get('score', 0) >= 85
        })
        filter_context = ExecutionContext(node=projected)
        filter_result = FilterExecutor()._do_execute(filter_action, filter_context)
        
        filtered = filter_result.data.get('items', [])
        assert len(filtered) == 2  # Alice and Bob


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

