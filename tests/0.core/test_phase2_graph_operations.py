#!/usr/bin/env python3
"""
#exonware/xwquery/tests/0.core/test_phase2_graph_operations.py

Phase 2 Graph Operations Comprehensive Tests
Tests all 26 new graph operations

Company: eXonware.com
"""

import pytest
from exonware.xwquery.query.executors.graph.both_executor import BothExecutor
from exonware.xwquery.query.executors.graph.neighbors_executor import NeighborsExecutor
from exonware.xwquery.query.executors.graph.out_e_executor import OutEExecutor
from exonware.xwquery.query.executors.graph.in_e_executor import InEExecutor
from exonware.xwquery.query.executors.graph.both_e_executor import BothEExecutor
from exonware.xwquery.query.executors.graph.create_edge_executor import CreateEdgeExecutor
from exonware.xwquery.query.executors.graph.delete_edge_executor import DeleteEdgeExecutor
from exonware.xwquery.query.executors.graph.update_edge_executor import UpdateEdgeExecutor
from exonware.xwquery.query.executors.graph.set_executor import SetExecutor
from exonware.xwquery.query.executors.graph.properties_executor import PropertiesExecutor
from exonware.xwquery.query.executors.graph.expand_executor import ExpandExecutor
from exonware.xwquery.query.executors.graph.degree_executor import DegreeExecutor
from exonware.xwquery.query.executors.graph.shortest_path_executor import ShortestPathExecutor
from exonware.xwquery.query.executors.graph.all_paths_executor import AllPathsExecutor
from exonware.xwquery.query.executors.graph.variable_path_executor import VariablePathExecutor
from exonware.xwquery.query.executors.graph.detach_delete_executor import DetachDeleteExecutor
from exonware.xwquery.query.executors.graph.path_length_executor import PathLengthExecutor
from exonware.xwquery.query.executors.graph.extract_path_executor import ExtractPathExecutor
from exonware.xwquery.query.executors.graph.out_v_executor import OutVExecutor
from exonware.xwquery.query.executors.graph.in_v_executor import InVExecutor
from exonware.xwquery.query.executors.graph.connected_components_executor import ConnectedComponentsExecutor
from exonware.xwquery.query.executors.graph.cycle_detection_executor import CycleDetectionExecutor
from exonware.xwquery.query.executors.graph.traversal_executor import TraversalExecutor
from exonware.xwquery.query.executors.graph.subgraph_executor import SubgraphExecutor
from exonware.xwquery.query.executors.graph.clone_executor import CloneExecutor
from exonware.xwquery.query.executors.graph.both_v_executor import BothVExecutor
from exonware.xwquery.contracts import QueryAction, ExecutionContext


class TestBatch1BasicTraversal:
    """Test Batch 1: Basic Traversal Operations (5 operations)."""
    
    def test_both_executor(self):
        """Test BOTH - bidirectional traversal."""
        executor = BothExecutor()
        action = QueryAction(type='BOTH', params={'edge_type': 'KNOWS'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.action_type == 'BOTH'
        assert result.data['direction'] == 'both'
    
    def test_neighbors_executor(self):
        """Test NEIGHBORS - get all adjacent nodes."""
        executor = NeighborsExecutor()
        action = QueryAction(type='NEIGHBORS', params={'direction': 'both'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.action_type == 'NEIGHBORS'
        assert 'neighbors' in result.data
    
    def test_out_e_executor(self):
        """Test outE - get outgoing edges."""
        executor = OutEExecutor()
        action = QueryAction(type='outE', params={'edge_type': 'follows'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['direction'] == 'out'
    
    def test_in_e_executor(self):
        """Test inE - get incoming edges."""
        executor = InEExecutor()
        action = QueryAction(type='inE', params={'edge_type': 'follows'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['direction'] == 'in'
    
    def test_both_e_executor(self):
        """Test bothE - get all edges."""
        executor = BothEExecutor()
        action = QueryAction(type='bothE', params={})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['direction'] == 'both'


class TestBatch2GraphModification:
    """Test Batch 2: Graph Modification Operations (5 operations)."""
    
    def test_create_edge_executor(self):
        """Test CREATE_EDGE - create new edge."""
        executor = CreateEdgeExecutor()
        action = QueryAction(type='CREATE_EDGE', params={
            'source': 1,
            'target': 2,
            'edge_type': 'KNOWS',
            'properties': {'since': 2020}
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['edge_created']
        assert result.affected_count == 1
    
    def test_delete_edge_executor(self):
        """Test DELETE_EDGE - remove edge."""
        executor = DeleteEdgeExecutor()
        action = QueryAction(type='DELETE_EDGE', params={'edge_id': 123})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'deleted_count' in result.data
    
    def test_update_edge_executor(self):
        """Test UPDATE_EDGE - modify edge properties."""
        executor = UpdateEdgeExecutor()
        action = QueryAction(type='UPDATE_EDGE', params={
            'edge_id': 123,
            'updates': {'weight': 10}
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'updated_count' in result.data
    
    def test_set_executor(self):
        """Test SET - set properties."""
        executor = SetExecutor()
        action = QueryAction(type='SET', params={
            'properties': {'status': 'active'},
            'target_type': 'node'
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['properties'] == {'status': 'active'}
    
    def test_properties_executor(self):
        """Test PROPERTIES - get all properties."""
        executor = PropertiesExecutor()
        action = QueryAction(type='PROPERTIES', params={})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'properties' in result.data


class TestBatch3PathfindingCore:
    """Test Batch 3: Pathfinding Core Operations (5 operations)."""
    
    def test_expand_executor(self):
        """Test EXPAND - multi-hop expansion."""
        executor = ExpandExecutor()
        action = QueryAction(type='EXPAND', params={
            'min_hops': 1,
            'max_hops': 3,
            'direction': 'out'
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['min_hops'] == 1
        assert result.data['max_hops'] == 3
    
    def test_degree_executor(self):
        """Test DEGREE - node degree calculation."""
        executor = DegreeExecutor()
        action = QueryAction(type='DEGREE', params={'type': 'total'})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'in_degree' in result.data
        assert 'out_degree' in result.data
        assert 'total_degree' in result.data
    
    def test_shortest_path_executor(self):
        """Test SHORTEST_PATH - find shortest path."""
        executor = ShortestPathExecutor()
        action = QueryAction(type='SHORTEST_PATH', params={
            'source': 1,
            'target': 5,
            'weighted': False
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'path' in result.data
        assert 'distance' in result.data
    
    def test_all_paths_executor(self):
        """Test ALL_PATHS - find all paths."""
        executor = AllPathsExecutor()
        action = QueryAction(type='ALL_PATHS', params={
            'source': 1,
            'target': 5,
            'max_length': 10
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'paths' in result.data
        assert 'path_count' in result.data
    
    def test_variable_path_executor(self):
        """Test VARIABLE_PATH - variable length paths."""
        executor = VariablePathExecutor()
        action = QueryAction(type='VARIABLE_PATH', params={
            'min_length': 2,
            'max_length': 5
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['min_length'] == 2
        assert result.data['max_length'] == 5


class TestBatch4PathOperations:
    """Test Batch 4: Path Operations (5 operations)."""
    
    def test_detach_delete_executor(self):
        """Test DETACH_DELETE - delete node with edges."""
        executor = DetachDeleteExecutor()
        action = QueryAction(type='DETACH_DELETE', params={'node_ids': [1, 2, 3]})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'deleted_nodes' in result.data
        assert 'deleted_edges' in result.data
    
    def test_path_length_executor(self):
        """Test PATH_LENGTH - get path length."""
        executor = PathLengthExecutor()
        action = QueryAction(type='PATH_LENGTH', params={
            'path': [1, 2, 3, 4],
            'weighted': False
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'hop_count' in result.data
        assert result.data['hop_count'] == 3  # 4 nodes = 3 edges
    
    def test_extract_path_executor(self):
        """Test EXTRACT_PATH - extract path components."""
        executor = ExtractPathExecutor()
        action = QueryAction(type='EXTRACT_PATH', params={
            'path': [1, 2, 3],
            'component': 'all'
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'nodes' in result.data or 'edges' in result.data
    
    def test_out_v_executor(self):
        """Test outV - get target vertex from edge."""
        executor = OutVExecutor()
        action = QueryAction(type='outV', params={'edge_id': 123})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'target_vertex' in result.data
    
    def test_in_v_executor(self):
        """Test inV - get source vertex from edge."""
        executor = InVExecutor()
        action = QueryAction(type='inV', params={'edge_id': 123})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'source_vertex' in result.data


class TestBatch5AdvancedAlgorithms:
    """Test Batch 5: Advanced Algorithms (5 operations)."""
    
    def test_connected_components_executor(self):
        """Test CONNECTED_COMPONENTS - find connected components."""
        executor = ConnectedComponentsExecutor()
        action = QueryAction(type='CONNECTED_COMPONENTS', params={'directed': False})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'components' in result.data
        assert 'component_count' in result.data
    
    def test_cycle_detection_executor(self):
        """Test CYCLE_DETECTION - detect cycles."""
        executor = CycleDetectionExecutor()
        action = QueryAction(type='CYCLE_DETECTION', params={
            'directed': True,
            'return_cycle': True
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'has_cycle' in result.data
    
    def test_traversal_executor(self):
        """Test TRAVERSAL - generic graph traversal."""
        executor = TraversalExecutor()
        action = QueryAction(type='TRAVERSAL', params={
            'strategy': 'BFS',
            'start_node': 1
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['strategy'] == 'BFS'
        assert 'visited_nodes' in result.data
    
    def test_subgraph_executor(self):
        """Test SUBGRAPH - extract subgraph."""
        executor = SubgraphExecutor()
        action = QueryAction(type='SUBGRAPH', params={
            'node_ids': [1, 2, 3],
            'induced': True
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'subgraph_nodes' in result.data
        assert 'subgraph_edges' in result.data
    
    def test_clone_executor(self):
        """Test CLONE - clone graph."""
        executor = CloneExecutor()
        action = QueryAction(type='CLONE', params={
            'deep_copy': True,
            'copy_properties': True
        })
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert result.data['deep_copy']


class TestBatch6FinalOperation:
    """Test Batch 6: Final Operation (1 operation)."""
    
    def test_both_v_executor(self):
        """Test bothV - get both vertices from edge."""
        executor = BothVExecutor()
        action = QueryAction(type='bothV', params={'edge_id': 123})
        context = ExecutionContext(node=[])
        
        result = executor._do_execute(action, context)
        
        assert result.success
        assert 'source_vertex' in result.data
        assert 'target_vertex' in result.data
        assert 'vertices' in result.data


class TestPhase2Integration:
    """Test Phase 2 operations integration."""
    
    def test_all_26_operations_executable(self):
        """Test that all 26 new operations can be instantiated and executed."""
        executors = [
            BothExecutor, NeighborsExecutor, OutEExecutor, InEExecutor, BothEExecutor,
            CreateEdgeExecutor, DeleteEdgeExecutor, UpdateEdgeExecutor, SetExecutor, PropertiesExecutor,
            ExpandExecutor, DegreeExecutor, ShortestPathExecutor, AllPathsExecutor, VariablePathExecutor,
            DetachDeleteExecutor, PathLengthExecutor, ExtractPathExecutor, OutVExecutor, InVExecutor,
            ConnectedComponentsExecutor, CycleDetectionExecutor, TraversalExecutor, SubgraphExecutor, CloneExecutor,
            BothVExecutor
        ]
        
        assert len(executors) == 26, "Should have exactly 26 Phase 2 executors"
        
        for ExecutorClass in executors:
            executor = ExecutorClass()
            action = QueryAction(type=executor.OPERATION_NAME, params={})
            context = ExecutionContext(node=[])
            result = executor._do_execute(action, context)
            
            assert result.success, f"{executor.OPERATION_NAME} should execute successfully"
            assert result.action_type == executor.OPERATION_NAME


class TestxwnodeIntegrationReadiness:
    """Test that Phase 2 operations are ready for xwnode integration."""
    
    def test_edge_strategies_operations(self):
        """Test operations that will use xwnode edge strategies."""
        operations = [
            (BothExecutor(), 'edge strategies'),
            (OutEExecutor(), 'edge strategies'),
            (InEExecutor(), 'edge strategies'),
            (BothEExecutor(), 'edge strategies'),
        ]
        
        for executor, integration in operations:
            action = QueryAction(type=executor.OPERATION_NAME, params={})
            context = ExecutionContext(node=[])
            result = executor._do_execute(action, context)
            
            assert result.success
            assert 'note' in result.data
            assert 'xwnode' in result.data['note'].lower()
    
    def test_pathfinding_operations(self):
        """Test operations that will use xwnode pathfinding algorithms."""
        operations = [
            (ShortestPathExecutor(), 'Dijkstra/BFS'),
            (AllPathsExecutor(), 'DFS'),
            (ExpandExecutor(), 'BFS'),
        ]
        
        for executor, algorithm in operations:
            action = QueryAction(type=executor.OPERATION_NAME, params={})
            context = ExecutionContext(node=[])
            result = executor._do_execute(action, context)
            
            assert result.success
            assert 'note' in result.data
    
    def test_graph_algorithms_operations(self):
        """Test operations that will use xwnode graph algorithms."""
        operations = [
            ConnectedComponentsExecutor(),
            CycleDetectionExecutor(),
            TraversalExecutor(),
        ]
        
        for executor in operations:
            action = QueryAction(type=executor.OPERATION_NAME, params={})
            context = ExecutionContext(node=[])
            result = executor._do_execute(action, context)
            
            assert result.success


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])

