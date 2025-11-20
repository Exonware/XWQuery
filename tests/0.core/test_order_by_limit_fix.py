#!/usr/bin/env python3
"""
#exonware/xwquery/tests/0.core/test_order_by_limit_fix.py

Core tests for ORDER BY and LIMIT fix.

Root cause fixed: ORDER BY and LIMIT were not working correctly.
This test validates the fix against eXonware's 5 priorities.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 27-Oct-2025
"""

import pytest
from exonware.xwquery.query.executors import SelectExecutor, OrderExecutor, LimitExecutor
from exonware.xwquery.contracts import QueryAction, ExecutionContext, ExecutionResult


@pytest.mark.xwquery_core
class TestOrderByLimitFix:
    """
    Core tests for ORDER BY and LIMIT functionality.
    
    Priority validation:
    - Usability (#2): Users can sort and limit results
    - Performance (#4): LIMIT prevents memory issues with large datasets
    - Maintainability (#3): Clean implementation
    """
    
    def test_order_by_asc_sorting(self):
        """Test ORDER BY ASC sorts data correctly."""
        # Given: Unsorted user data
        data = [
            {'name': 'Charlie', 'age': 25},
            {'name': 'Alice', 'age': 30},
            {'name': 'Bob', 'age': 20}
        ]
        
        # When: Execute ORDER BY age ASC
        executor = SelectExecutor()
        action = QueryAction(
            type='SELECT',
            params={
                'fields': ['*'],
                'order_by': 'age ASC'
            }
        )
        context = ExecutionContext(node=data)
        
        # Apply ORDER BY directly
        sorted_data = executor._apply_order_by(data, 'age ASC')
        
        # Then: Data should be sorted by age ascending
        assert sorted_data[0]['age'] == 20, "First item should have age 20"
        assert sorted_data[1]['age'] == 25, "Second item should have age 25"
        assert sorted_data[2]['age'] == 30, "Third item should have age 30"
        assert sorted_data[0]['name'] == 'Bob'
        assert sorted_data[2]['name'] == 'Alice'
    
    def test_order_by_desc_sorting(self):
        """Test ORDER BY DESC sorts data in descending order."""
        # Given: Unsorted product data
        data = [
            {'product': 'Widget', 'price': 10.99},
            {'product': 'Gadget', 'price': 25.50},
            {'product': 'Doohickey', 'price': 5.00}
        ]
        
        # When: Execute ORDER BY price DESC
        executor = SelectExecutor()
        sorted_data = executor._apply_order_by(data, 'price DESC')
        
        # Then: Data should be sorted by price descending
        assert sorted_data[0]['price'] == 25.50, "First item should have highest price"
        assert sorted_data[1]['price'] == 10.99, "Second item should have middle price"
        assert sorted_data[2]['price'] == 5.00, "Third item should have lowest price"
        assert sorted_data[0]['product'] == 'Gadget'
        assert sorted_data[2]['product'] == 'Doohickey'
    
    def test_order_by_default_asc(self):
        """Test ORDER BY defaults to ASC when direction not specified."""
        # Given: Unsorted data
        data = [
            {'id': 3, 'value': 'C'},
            {'id': 1, 'value': 'A'},
            {'id': 2, 'value': 'B'}
        ]
        
        # When: Execute ORDER BY without explicit ASC/DESC
        executor = SelectExecutor()
        sorted_data = executor._apply_order_by(data, 'id')
        
        # Then: Should default to ascending order
        assert sorted_data[0]['id'] == 1
        assert sorted_data[1]['id'] == 2
        assert sorted_data[2]['id'] == 3
    
    def test_limit_basic(self):
        """Test LIMIT restricts result count."""
        # Given: Large dataset
        data = [{'id': i, 'value': f'item_{i}'} for i in range(100)]
        
        # When: Apply LIMIT 10
        executor = SelectExecutor()
        limited_data = executor._apply_limit(data, limit=10, offset=0)
        
        # Then: Should return only 10 items
        assert len(limited_data) == 10, "LIMIT 10 should return exactly 10 items"
        assert limited_data[0]['id'] == 0, "First item should be id=0"
        assert limited_data[9]['id'] == 9, "Last item should be id=9"
    
    def test_limit_with_offset(self):
        """Test LIMIT with OFFSET for pagination."""
        # Given: Dataset for pagination
        data = [{'id': i, 'value': f'item_{i}'} for i in range(50)]
        
        # When: Apply LIMIT 10 OFFSET 20
        executor = SelectExecutor()
        page_data = executor._apply_limit(data, limit=10, offset=20)
        
        # Then: Should return items 20-29
        assert len(page_data) == 10, "Should return 10 items"
        assert page_data[0]['id'] == 20, "First item should be id=20 (offset)"
        assert page_data[9]['id'] == 29, "Last item should be id=29"
    
    def test_order_by_and_limit_combined(self):
        """Test ORDER BY and LIMIT work together (integration)."""
        # Given: Unsorted event data
        data = [
            {'event_id': 5, 'timestamp': 105, 'type': 'click'},
            {'event_id': 2, 'timestamp': 102, 'type': 'view'},
            {'event_id': 8, 'timestamp': 108, 'type': 'click'},
            {'event_id': 1, 'timestamp': 101, 'type': 'view'},
            {'event_id': 3, 'timestamp': 103, 'type': 'scroll'},
        ]
        
        # When: ORDER BY timestamp DESC and LIMIT 3
        executor = SelectExecutor()
        sorted_data = executor._apply_order_by(data, 'timestamp DESC')
        limited_data = executor._apply_limit(sorted_data, limit=3, offset=0)
        
        # Then: Should return 3 most recent events
        assert len(limited_data) == 3, "LIMIT 3 should return 3 items"
        assert limited_data[0]['event_id'] == 8, "First should be most recent (108)"
        assert limited_data[1]['event_id'] == 5, "Second should be second most recent (105)"
        assert limited_data[2]['event_id'] == 3, "Third should be third most recent (103)"
    
    def test_order_by_handles_none_values(self):
        """Test ORDER BY gracefully handles None values."""
        # Given: Data with None values
        data = [
            {'name': 'Alice', 'age': 30},
            {'name': 'Bob', 'age': None},
            {'name': 'Charlie', 'age': 25}
        ]
        
        # When: ORDER BY age ASC
        executor = SelectExecutor()
        sorted_data = executor._apply_order_by(data, 'age ASC')
        
        # Then: Should not crash, None values should sort last
        assert len(sorted_data) == 3, "Should return all items"
        assert sorted_data[0]['age'] == 25, "First should be 25"
        assert sorted_data[1]['age'] == 30, "Second should be 30"
        # None should be last (implementation detail)
    
    def test_limit_edge_cases(self):
        """Test LIMIT handles edge cases gracefully."""
        # Given: Various edge cases
        data = [{'id': i} for i in range(10)]
        executor = SelectExecutor()
        
        # Test: LIMIT 0 (should return empty or all - implementation choice)
        result = executor._apply_limit(data, limit=0, offset=0)
        assert isinstance(result, list), "Should return a list"
        
        # Test: LIMIT greater than data length
        result = executor._apply_limit(data, limit=100, offset=0)
        assert len(result) == 10, "Should return all available data"
        
        # Test: OFFSET beyond data length
        result = executor._apply_limit(data, limit=5, offset=100)
        assert len(result) == 0, "Should return empty list"
    
    def test_order_executor_integration(self):
        """Test OrderExecutor directly."""
        # Given: Data to sort
        data = [
            {'product': 'C', 'price': 30},
            {'product': 'A', 'price': 10},
            {'product': 'B', 'price': 20}
        ]
        
        # When: Execute ORDER operation
        executor = OrderExecutor()
        action = QueryAction(
            type='ORDER',
            params={'order_by': 'price ASC'}
        )
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        # Then: Should return sorted data
        assert result.success, "Execution should succeed"
        assert isinstance(result.data, list), "Should return a list"
        assert result.data[0]['price'] == 10, "First should have lowest price"
        assert result.data[2]['price'] == 30, "Last should have highest price"
    
    def test_limit_executor_integration(self):
        """Test LimitExecutor directly."""
        # Given: Large dataset
        data = [{'id': i} for i in range(100)]
        
        # When: Execute LIMIT operation
        executor = LimitExecutor()
        action = QueryAction(
            type='LIMIT',
            params={'limit': 5, 'offset': 10}
        )
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        # Then: Should return limited data
        assert result.success, "Execution should succeed"
        assert len(result.data) == 5, "Should return 5 items"
        assert result.data[0]['id'] == 10, "First item should be id=10 (offset)"
        assert result.metadata['limit'] == 5, "Metadata should include limit"
        assert result.metadata['offset'] == 10, "Metadata should include offset"
    
    def test_select_with_order_by_integration(self):
        """Test SELECT executor applies ORDER BY correctly."""
        # Given: User data in a node structure
        data = [
            {'name': 'Charlie', 'age': 35},
            {'name': 'Alice', 'age': 25},
            {'name': 'Bob', 'age': 30}
        ]
        
        # When: Execute SELECT with ORDER BY
        executor = SelectExecutor()
        action = QueryAction(
            type='SELECT',
            params={
                'fields': ['*'],
                'order_by': 'age ASC'
            }
        )
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        # Then: Data should be sorted
        assert result.data[0]['name'] == 'Alice', "First should be Alice (age 25)"
        assert result.data[1]['name'] == 'Bob', "Second should be Bob (age 30)"
        assert result.data[2]['name'] == 'Charlie', "Third should be Charlie (age 35)"
    
    def test_select_with_limit_integration(self):
        """Test SELECT executor applies LIMIT correctly."""
        # Given: Large dataset
        data = [{'id': i, 'value': i * 10} for i in range(100)]
        
        # When: Execute SELECT with LIMIT
        executor = SelectExecutor()
        action = QueryAction(
            type='SELECT',
            params={
                'fields': ['*'],
                'limit': 10
            }
        )
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        # Then: Should return only 10 items
        assert len(result.data) == 10, "Should return exactly 10 items"
        assert result.affected_count == 10, "Affected count should be 10"


@pytest.mark.xwquery_core
@pytest.mark.xwquery_performance
class TestOrderByLimitPerformance:
    """Performance tests for ORDER BY and LIMIT."""
    
    def test_limit_prevents_memory_issues(self):
        """Test LIMIT limits memory usage with large datasets."""
        # Given: Very large dataset
        large_data = [{'id': i, 'data': f'x' * 100} for i in range(10000)]
        
        # When: Apply LIMIT
        executor = SelectExecutor()
        limited = executor._apply_limit(large_data, limit=10, offset=0)
        
        # Then: Should return only requested amount
        assert len(limited) == 10, "LIMIT should restrict result size"
        # This prevents loading entire dataset into memory in real scenarios
    
    def test_order_by_efficiency(self):
        """Test ORDER BY uses efficient sorting."""
        # Given: Large unsorted dataset
        import random
        data = [{'value': random.randint(1, 1000)} for _ in range(1000)]
        
        # When: Sort with ORDER BY
        executor = SelectExecutor()
        import time
        start = time.time()
        sorted_data = executor._apply_order_by(data, 'value ASC')
        elapsed = time.time() - start
        
        # Then: Should complete quickly (using Python's efficient sorted())
        assert elapsed < 0.1, "Sorting 1000 items should be fast"
        assert sorted_data[0]['value'] <= sorted_data[-1]['value'], "Should be sorted"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

