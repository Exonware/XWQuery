#!/usr/bin/env python3
"""
#exonware/xwquery/tests/0.core/test_p3_executors.py

P3 Operations Comprehensive Tests
Tests all P3 operations (Graph, Advanced, SPARQL, GraphQL)

Company: eXonware.com
"""

import pytest
from exonware.xwquery.query.executors.graph.match_executor import MatchExecutor
from exonware.xwquery.query.executors.graph.path_executor import PathExecutor
from exonware.xwquery.query.executors.graph.out_executor import OutExecutor
from exonware.xwquery.query.executors.graph.in_traverse_executor import InTraverseExecutor
from exonware.xwquery.query.executors.graph.return_executor import ReturnExecutor
from exonware.xwquery.query.executors.advanced.foreach_executor import ForeachExecutor
from exonware.xwquery.query.executors.advanced.let_executor import LetExecutor
from exonware.xwquery.query.executors.advanced.for_loop_executor import ForLoopExecutor
from exonware.xwquery.query.executors.advanced.window_executor import WindowExecutor
from exonware.xwquery.query.executors.advanced.union_executor import UnionExecutor
from exonware.xwquery.query.executors.advanced.with_cte_executor import WithCteExecutor
from exonware.xwquery.query.executors.advanced.aggregate_executor import AggregateExecutor
from exonware.xwquery.query.executors.advanced.pipe_executor import PipeExecutor
from exonware.xwquery.query.executors.advanced.ask_executor import AskExecutor
from exonware.xwquery.query.executors.advanced.construct_executor import ConstructExecutor
from exonware.xwquery.query.executors.advanced.describe_executor import DescribeExecutor
from exonware.xwquery.query.executors.advanced.mutation_executor import MutationExecutor
from exonware.xwquery.query.executors.advanced.subscribe_executor import SubscribeExecutor
from exonware.xwquery.query.executors.advanced.subscription_executor import SubscriptionExecutor
from exonware.xwquery.query.executors.advanced.options_executor import OptionsExecutor
from exonware.xwquery.query.executors.aggregation.count_executor import CountExecutor
from exonware.xwquery.contracts import QueryAction, ExecutionContext
from exonware.xwnode import XWNode


class TestP3GraphOperations:
    """Test P3 Graph operations (MATCH, PATH, OUT, IN_TRAVERSE, RETURN)."""
    
    def test_match_executor_basic(self):
        """Test MATCH executor returns valid structure."""
        executor = MatchExecutor()
        action = QueryAction(type='MATCH', params={'pattern': {'label': 'User'}})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.action_type == 'MATCH'
        assert 'pattern' in result.data
    
    def test_path_executor_algorithms(self):
        """Test PATH executor supports different algorithms."""
        executor = PathExecutor()
        
        for algo in ['shortest', 'all', 'longest']:
            action = QueryAction(type='PATH', params={'algorithm': algo})
            context = ExecutionContext(node=[])
            result = executor._do_execute(action, context)
            
            assert result.success
            assert result.data['algorithm'] == algo
    
    def test_out_executor_directions(self):
        """Test OUT executor for outgoing edges."""
        executor = OutExecutor()
        action = QueryAction(type='OUT', params={'edge_type': 'KNOWS'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['direction'] == 'outgoing'
    
    def test_in_traverse_executor_directions(self):
        """Test IN_TRAVERSE for incoming edges."""
        executor = InTraverseExecutor()
        action = QueryAction(type='IN_TRAVERSE', params={'edge_type': 'FOLLOWS'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['direction'] == 'incoming'
    
    def test_return_executor_with_fields(self):
        """Test RETURN executor with field selection."""
        executor = ReturnExecutor()
        action = QueryAction(type='RETURN', params={'fields': ['name', 'age']})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['fields'] == ['name', 'age']


class TestP3AdvancedControlOperations:
    """Test P3 Advanced Control operations (FOREACH, LET, FOR, WINDOW)."""
    
    def test_foreach_executor(self):
        """Test FOREACH iteration."""
        executor = ForeachExecutor()
        collection = [1, 2, 3, 4, 5]
        action = QueryAction(type='FOREACH', params={'collection': collection})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['iteration_count'] == 5
    
    def test_let_executor_variable_binding(self):
        """Test LET variable binding."""
        executor = LetExecutor()
        action = QueryAction(type='LET', params={'variable': 'x', 'value': 42})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['variable'] == 'x'
        assert result.data['value'] == 42
    
    def test_for_loop_executor_iterations(self):
        """Test FOR loop iterations."""
        executor = ForLoopExecutor()
        action = QueryAction(type='FOR', params={'start': 0, 'end': 10, 'step': 2})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['iterations'] == 5  # 0,2,4,6,8
    
    def test_window_executor_functions(self):
        """Test WINDOW functions."""
        executor = WindowExecutor()
        action = QueryAction(type='WINDOW', params={
            'function': 'ROW_NUMBER',
            'partition_by': ['category'],
            'order_by': ['price']
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['function'] == 'ROW_NUMBER'


class TestP3AdvancedSetOperations:
    """Test P3 Advanced Set operations (UNION, WITH, AGGREGATE, PIPE)."""
    
    def test_union_executor_distinct(self):
        """Test UNION with DISTINCT."""
        executor = UnionExecutor()
        data = [{'id': 1}, {'id': 2}]
        action = QueryAction(type='UNION', params={'sources': [[{'id': 2}, {'id': 3}]], 'distinct': True})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'items' in result.data
    
    def test_with_cte_executor(self):
        """Test WITH CTE."""
        executor = WithCteExecutor()
        action = QueryAction(type='WITH', params={'name': 'users_cte', 'query': 'SELECT * FROM users'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['cte_name'] == 'users_cte'
    
    def test_aggregate_executor_reuses_utils(self):
        """Test AGGREGATE reuses compute_aggregates."""
        executor = AggregateExecutor()
        data = [{'price': 10}, {'price': 20}, {'price': 30}]
        action = QueryAction(type='AGGREGATE', params={'type': 'SUM', 'field': 'price'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['sum'] == 60
    
    def test_pipe_executor(self):
        """Test PIPE chaining."""
        executor = PipeExecutor()
        action = QueryAction(type='PIPE', params={'operations': ['filter', 'map', 'reduce']})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['operation_count'] == 3


class TestP3SPARQLOperations:
    """Test P3 SPARQL operations (ASK, CONSTRUCT, DESCRIBE)."""
    
    def test_ask_executor_boolean(self):
        """Test ASK returns boolean."""
        executor = AskExecutor()
        action = QueryAction(type='ASK', params={'pattern': {'type': 'Person'}})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'ask_result' in result.data
        assert isinstance(result.data['ask_result'], bool)
    
    def test_construct_executor(self):
        """Test CONSTRUCT graph building."""
        executor = ConstructExecutor()
        action = QueryAction(type='CONSTRUCT', params={'template': '{?s ?p ?o}', 'where': '...'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'template' in result.data
    
    def test_describe_executor(self):
        """Test DESCRIBE resource."""
        executor = DescribeExecutor()
        action = QueryAction(type='DESCRIBE', params={'resource': 'http://example.com/user/1'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'resource' in result.data


class TestP3GraphQLOperations:
    """Test P3 GraphQL operations (MUTATION, SUBSCRIBE, SUBSCRIPTION)."""
    
    def test_mutation_executor(self):
        """Test MUTATION."""
        executor = MutationExecutor()
        action = QueryAction(type='MUTATION', params={'type': 'create', 'fields': {'name': 'John'}})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['mutation_type'] == 'create'
    
    def test_subscribe_executor(self):
        """Test SUBSCRIBE."""
        executor = SubscribeExecutor()
        action = QueryAction(type='SUBSCRIBE', params={'event': 'userCreated', 'fields': ['id', 'name']})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['event'] == 'userCreated'
    
    def test_subscription_executor(self):
        """Test SUBSCRIPTION."""
        executor = SubscriptionExecutor()
        action = QueryAction(type='SUBSCRIPTION', params={'event': 'newMessage'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'event' in result.data


class TestP3MiscOperations:
    """Test P3 Misc operations (OPTIONS, COUNT)."""
    
    def test_options_executor(self):
        """Test OPTIONS."""
        executor = OptionsExecutor()
        action = QueryAction(type='OPTIONS', params={'options': {'timeout': 5000}})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'options' in result.data
    
    def test_count_executor(self):
        """Test COUNT."""
        executor = CountExecutor()
        data = [1, 2, 3, 4, 5]
        action = QueryAction(type='COUNT', params={})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['count'] == 5


class TestP3Integration:
    """Test P3 operations integration and chaining."""
    
    def test_union_with_distinct_reuse(self):
        """Test UNION reuses DISTINCT executor."""
        executor = UnionExecutor()
        data1 = [{'id': 1}, {'id': 2}]
        data2 = [{'id': 2}, {'id': 3}]  # id=2 duplicates
        
        action = QueryAction(type='UNION', params={'sources': [data2], 'distinct': True})
        context = ExecutionContext(node=data1)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        # Should have 3 unique items after DISTINCT
        assert result.data['count'] == 3
    
    def test_aggregate_reuses_compute_aggregates(self):
        """Test AGGREGATE reuses shared compute_aggregates utility."""
        executor = AggregateExecutor()
        data = [
            {'value': 10},
            {'value': 20},
            {'value': 30},
            {'value': 40}
        ]
        
        action = QueryAction(type='AGGREGATE', params={'type': 'AVG', 'field': 'value'})
        context = ExecutionContext(node=data)
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['avg'] == 25.0  # (10+20+30+40)/4
        assert result.data['sum'] == 100
        assert result.data['count'] == 4


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])

