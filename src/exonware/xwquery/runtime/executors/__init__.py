"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/__init__.py
Query Operation Executors
This package implements the execution layer for 50+ XWQuery Script operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 11-Oct-2025
"""

from .contracts import (
    IOperationExecutor,
    QueryAction,
    ExecutionContext,
    ExecutionResult
)
from .defs import OperationCapability, OperationType, ExecutionStatus
from .errors import ExecutorError, OperationExecutionError, ValidationError, UnsupportedOperationError
from .base import AOperationExecutor
from .registry import OperationRegistry, get_operation_registry, register_operation
from .engine import NativeOperationsExecutionEngine
# Import all executors from all categories
from .core import SelectExecutor, InsertExecutor, UpdateExecutor, DeleteExecutor, CreateExecutor, DropExecutor
from .filtering import (
    WhereExecutor, FilterExecutor, LikeExecutor, InExecutor, HasExecutor,
    BetweenExecutor, RangeExecutor, TermExecutor, OptionalExecutor, ValuesExecutor
)
from .aggregation import (
    CountExecutor, SumExecutor, AvgExecutor, MinExecutor, MaxExecutor,
    DistinctExecutor, GroupExecutor, HavingExecutor, SummarizeExecutor
)
from .projection import ProjectExecutor, ExtendExecutor
from .ordering import OrderExecutor, ByExecutor, LimitExecutor
from .graph import (
    MatchExecutor, PathExecutor, OutExecutor, InTraverseExecutor, ReturnExecutor,
    AllPathsExecutor, AllShortestPathsExecutor, AllSimplePathsExecutor,
    BothExecutor, BothEExecutor, BothVExecutor, InEExecutor, InVExecutor,
    OutEExecutor, OutVExecutor, CloneExecutor, ConnectedComponentsExecutor,
    CreateEdgeExecutor, CycleDetectionExecutor, DeleteEdgeExecutor,
    DetachDeleteExecutor, DegreeExecutor, ExpandExecutor, ExtractPathExecutor,
    NeighborsExecutor, PathLengthExecutor, PropertiesExecutor, SetExecutor,
    ShortestPathExecutor, SimplePathExecutor, SubgraphExecutor,
    TraversalExecutor, UpdateEdgeExecutor, VariablePathExecutor
)
from .data import LoadExecutor, StoreExecutor, MergeExecutor, AlterExecutor, FileSourceExecutor
from .array import SlicingExecutor, IndexingExecutor
from .advanced import (
    JoinExecutor, IncludeExecutor, UnionExecutor, MinusExecutor, WithCteExecutor, AggregateExecutor,
    ForeachExecutor, LetExecutor, ForLoopExecutor, WindowExecutor,
    DescribeExecutor, ConstructExecutor, AskExecutor,
    SubscribeExecutor, SubscriptionExecutor, MutationExecutor,
    PipeExecutor, OptionsExecutor
)
# Get global registry
_registry = get_operation_registry()
# Register CORE operations (6)
_registry.register('SELECT', SelectExecutor)
_registry.register('INSERT', InsertExecutor)
_registry.register('UPDATE', UpdateExecutor)
_registry.register('DELETE', DeleteExecutor)
_registry.register('CREATE', CreateExecutor)
_registry.register('DROP', DropExecutor)
# Register FILTERING operations (10)
_registry.register('WHERE', WhereExecutor)
_registry.register('FILTER', FilterExecutor)
_registry.register('LIKE', LikeExecutor)
_registry.register('IN', InExecutor)
_registry.register('HAS', HasExecutor)
_registry.register('BETWEEN', BetweenExecutor)
_registry.register('RANGE', RangeExecutor)
_registry.register('TERM', TermExecutor)
_registry.register('OPTIONAL', OptionalExecutor)
_registry.register('VALUES', ValuesExecutor)
# Register AGGREGATION operations (9)
_registry.register('COUNT', CountExecutor)
_registry.register('SUM', SumExecutor)
_registry.register('AVG', AvgExecutor)
_registry.register('MIN', MinExecutor)
_registry.register('MAX', MaxExecutor)
_registry.register('DISTINCT', DistinctExecutor)
_registry.register('GROUP', GroupExecutor)
_registry.register('HAVING', HavingExecutor)
_registry.register('SUMMARIZE', SummarizeExecutor)
# Register PROJECTION operations (2)
_registry.register('PROJECT', ProjectExecutor)
_registry.register('EXTEND', ExtendExecutor)
# Register ORDERING operations (4)
_registry.register('ORDER', OrderExecutor)
_registry.register('BY', ByExecutor)
_registry.register('LIMIT', LimitExecutor)
_registry.register('OFFSET', LimitExecutor)  # OFFSET uses same executor as LIMIT
# Register GRAPH operations (33)
_registry.register('MATCH', MatchExecutor)
_registry.register('PATH', PathExecutor)
_registry.register('OUT', OutExecutor)
_registry.register('IN_TRAVERSE', InTraverseExecutor)  # Fixed: was incorrectly registered as 'IN'
_registry.register('RETURN', ReturnExecutor)
# Additional graph operations
_registry.register('ALL_PATHS', AllPathsExecutor)
_registry.register('ALL_SHORTEST_PATHS', AllShortestPathsExecutor)
_registry.register('ALL_SIMPLE_PATHS', AllSimplePathsExecutor)
_registry.register('BOTH', BothExecutor)
_registry.register('bothE', BothEExecutor)
_registry.register('bothV', BothVExecutor)
_registry.register('inE', InEExecutor)
_registry.register('inV', InVExecutor)
_registry.register('outE', OutEExecutor)
_registry.register('outV', OutVExecutor)
_registry.register('CLONE', CloneExecutor)
_registry.register('CONNECTED_COMPONENTS', ConnectedComponentsExecutor)
_registry.register('CREATE_EDGE', CreateEdgeExecutor)
_registry.register('CYCLE_DETECTION', CycleDetectionExecutor)
_registry.register('DELETE_EDGE', DeleteEdgeExecutor)
_registry.register('DETACH_DELETE', DetachDeleteExecutor)
_registry.register('DEGREE', DegreeExecutor)
_registry.register('EXPAND', ExpandExecutor)
_registry.register('EXTRACT_PATH', ExtractPathExecutor)
_registry.register('NEIGHBORS', NeighborsExecutor)
_registry.register('PATH_LENGTH', PathLengthExecutor)
_registry.register('PROPERTIES', PropertiesExecutor)
_registry.register('SET', SetExecutor)
_registry.register('SHORTEST_PATH', ShortestPathExecutor)
_registry.register('SIMPLE_PATH', SimplePathExecutor)
_registry.register('SUBGRAPH', SubgraphExecutor)
_registry.register('TRAVERSAL', TraversalExecutor)
_registry.register('UPDATE_EDGE', UpdateEdgeExecutor)
_registry.register('VARIABLE_PATH', VariablePathExecutor)
# Register DATA operations (5)
_registry.register('LOAD', LoadExecutor)
_registry.register('STORE', StoreExecutor)
_registry.register('MERGE', MergeExecutor)
_registry.register('ALTER', AlterExecutor)
_registry.register('FILE_SOURCE', FileSourceExecutor)
# Register ARRAY operations (2)
_registry.register('SLICING', SlicingExecutor)
_registry.register('INDEXING', IndexingExecutor)
# Register ADVANCED operations (17)
_registry.register('JOIN', JoinExecutor)
_registry.register('INCLUDE', IncludeExecutor)
_registry.register('UNION', UnionExecutor)
_registry.register('MINUS', MinusExecutor)
_registry.register('WITH', WithCteExecutor)
_registry.register('AGGREGATE', AggregateExecutor)
_registry.register('FOREACH', ForeachExecutor)
_registry.register('LET', LetExecutor)
_registry.register('FOR', ForLoopExecutor)
_registry.register('WINDOW', WindowExecutor)
_registry.register('DESCRIBE', DescribeExecutor)
_registry.register('CONSTRUCT', ConstructExecutor)
_registry.register('ASK', AskExecutor)
_registry.register('SUBSCRIBE', SubscribeExecutor)
_registry.register('SUBSCRIPTION', SubscriptionExecutor)
_registry.register('MUTATION', MutationExecutor)
_registry.register('PIPE', PipeExecutor)
_registry.register('OPTIONS', OptionsExecutor)
__all__ = [
    # Contracts
    'IOperationExecutor',
    'QueryAction',
    'ExecutionContext',
    'ExecutionResult',
    # Types
    'OperationCapability',
    'OperationType',
    'ExecutionStatus',
    # Errors
    'ExecutorError',
    'OperationExecutionError',
    'ValidationError',
    'UnsupportedOperationError',
    # Base
    'AOperationExecutor',
    # Engine
    'NativeOperationsExecutionEngine',
    # Registry
    'OperationRegistry',
    'get_operation_registry',
    'register_operation',
    # All Executors (90 total)
    'SelectExecutor', 'InsertExecutor', 'UpdateExecutor', 'DeleteExecutor', 'CreateExecutor', 'DropExecutor',
    'WhereExecutor', 'FilterExecutor', 'LikeExecutor', 'InExecutor', 'HasExecutor',
    'BetweenExecutor', 'RangeExecutor', 'TermExecutor', 'OptionalExecutor', 'ValuesExecutor',
    'CountExecutor', 'SumExecutor', 'AvgExecutor', 'MinExecutor', 'MaxExecutor',
    'DistinctExecutor', 'GroupExecutor', 'HavingExecutor', 'SummarizeExecutor',
    'ProjectExecutor', 'ExtendExecutor',
    'OrderExecutor', 'ByExecutor', 'LimitExecutor',
    'MatchExecutor', 'PathExecutor', 'OutExecutor', 'InTraverseExecutor', 'ReturnExecutor',
    'LoadExecutor', 'StoreExecutor', 'MergeExecutor', 'AlterExecutor',
    'SlicingExecutor', 'IndexingExecutor',
    'JoinExecutor', 'IncludeExecutor', 'UnionExecutor', 'WithCteExecutor', 'AggregateExecutor',
    'ForeachExecutor', 'LetExecutor', 'ForLoopExecutor', 'WindowExecutor',
    'DescribeExecutor', 'ConstructExecutor', 'AskExecutor',
    'SubscribeExecutor', 'SubscriptionExecutor', 'MutationExecutor',
    'PipeExecutor', 'OptionsExecutor',
]
