#!/usr/bin/env python3
"""
Query Execution Engine - Executes QueryAction trees

QueryAction extends ANode, so we get tree functionality for free!
No conversion needed - just walk the QueryAction tree and execute.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0
Generation Date: October 26, 2025
"""

from typing import Any, List, Dict, Optional
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from .registry import get_operation_registry, OperationRegistry
from .capability_checker import check_operation_compatibility
from ..errors import UnsupportedOperationError
from exonware.xwnode.base import ANode
from exonware.xwnode.nodes.strategies.contracts import NodeType


class ExecutionEngine:
    """
    Tree-based query execution engine.
    
    Since QueryAction extends ANode, we can:
    - Use ANode's tree traversal
    - Access children directly
    - Leverage all xwnode tree functionality
    
    No conversion, no duplication - pure reuse!
    """
    
    def __init__(self, registry: Optional[OperationRegistry] = None):
        """
        Initialize execution engine.
        
        Args:
            registry: Operation registry (uses global if not provided)
        """
        self._registry = registry or get_operation_registry()
        self._execution_history: List[Dict] = []
    
    def execute(self, query: str, node: Any, **kwargs) -> ExecutionResult:
        """
        Execute a query string on a node.
        
        Args:
            query: XWQuery script string
            node: Target node to execute on
            **kwargs: Additional execution options
            
        Returns:
            ExecutionResult with data
        """
        # Parse query to QueryAction tree
        # (Parser will return QueryAction which IS an ANode!)
        from ..strategies.xwquery import XWQueryScriptStrategy
        
        script_strategy = XWQueryScriptStrategy()
        # Parse query to QueryAction tree
        parsed_strategy = script_strategy.parse_script(query)
        actions_tree = parsed_strategy._actions_tree  # Get QueryAction tree
        
        # Create execution context
        context = ExecutionContext(
            node=node,
            variables=kwargs.get('variables', {}),
            options=kwargs
        )
        
        # Execute QueryAction tree (which already IS a QueryAction, no conversion needed!)
        return self.execute_tree(actions_tree, context)
    
    def _convert_to_query_action(self, node: ANode) -> QueryAction:
        """
        Temporary: Convert ANode to QueryAction.
        Will be removed once parser returns QueryAction directly.
        """
        node_data = node.to_native()
        
        if 'root' in node_data:
            # Root node with statements
            statements = node_data['root'].get('statements', [])
            root = QueryAction(type="ROOT", params={})
            
            for stmt in statements:
                child = QueryAction(
                    type=stmt.get('type', 'UNKNOWN'),
                    params=stmt.get('params', {}),
                    id=stmt.get('id', ''),
                    line_number=stmt.get('line_number', 0),
                    metadata=stmt.get('metadata', {})
                )
                # Add nested children recursively
                if 'children' in stmt:
                    for child_data in stmt['children']:
                        child.add_child(self._convert_dict_to_action(child_data))
                
                root.add_child(child)
            
            return root
        
        # Single statement
        return QueryAction(
            type=node_data.get('type', 'UNKNOWN'),
            params=node_data.get('params', {}),
            id=node_data.get('id', ''),
            line_number=node_data.get('line_number', 0),
            metadata=node_data.get('metadata', {})
        )
    
    def _convert_dict_to_action(self, data: Dict[str, Any]) -> QueryAction:
        """Convert dict to QueryAction recursively."""
        action = QueryAction(
            type=data.get('type', 'UNKNOWN'),
            params=data.get('params', {}),
            id=data.get('id', ''),
            line_number=data.get('line_number', 0),
            metadata=data.get('metadata', {})
        )
        
        # Add children recursively
        if 'children' in data:
            for child_data in data['children']:
                action.add_child(self._convert_dict_to_action(child_data))
        
        return action
    
    def execute_tree(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute a QueryAction tree.
        
        Since QueryAction extends ANode, we can use tree operations directly!
        
        Args:
            action: QueryAction tree (which IS an ANode)
            context: Execution context
            
        Returns:
            Execution result
        """
        # Handle structural nodes (ROOT, PROGRAM) - these are containers, not operations
        if action.type in ("ROOT", "PROGRAM"):
            return self._execute_root(action, context)
        
        # Execute single action with its children
        return self._execute_action_tree(action, context)
    
    def _execute_root(self, root: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute ROOT with pipeline pattern.
        
        Each child's output becomes the next child's input.
        """
        # Get children using ANode's tree functionality!
        children = root.children
        
        if not children:
            return ExecutionResult(
                success=False,
                data=None,
                error="No actions to execute",
                action_type="ROOT"
            )
        
        # Pipeline execution
        current_context = context
        results = []
        
        for child in children:
            result = self._execute_action_tree(child, current_context)
            results.append(result)
            
            if not result.success:
                return result
            
            # Pipeline: output → input
            if result.data is not None:
                current_context = ExecutionContext(
                    node=result.data,
                    variables=current_context.variables,
                    options=current_context.options,
                    parent_context=current_context
                )
        
        return results[-1]
    
    def _execute_action_tree(
        self,
        action: QueryAction,
        context: ExecutionContext
    ) -> ExecutionResult:
        """
        Execute QueryAction with depth-first traversal.
        
        Flow:
        1. Execute children first (depth-first)
        2. Collect child results
        3. Execute current action with child context
        4. Return result
        
        Args:
            action: QueryAction (which IS an ANode!)
            context: Execution context
            
        Returns:
            Execution result
        """
        # Get children using ANode's tree structure!
        children = action.children
        child_results = []
        
        # Execute children first (depth-first)
        if children:
            for child in children:
                child_result = self._execute_action_tree(child, context)
                child_results.append(child_result)
                
                # Stop on first error
                if not child_result.success:
                    return child_result
        
        # Execute current action with child results in context
        return self._execute_operation(action, context, child_results)
    
    def _execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: List[ExecutionResult]
    ) -> ExecutionResult:
        """
        Execute a single operation.
        
        Args:
            action: QueryAction to execute
            context: Execution context
            child_results: Results from child actions
            
        Returns:
            Execution result
        """
        # Get executor for this operation type
        executor = self._registry.get(action.type)
        
        if not executor:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"No executor registered for operation: {action.type}",
                action_type=action.type
            )
        
        # Note: Node type compatibility checking disabled for v0.x
        # Will be re-enabled when node type detection is standardized
        
        # Add child results to context
        if child_results:
            context.metadata['child_results'] = child_results
            context.metadata['has_children'] = True
        else:
            context.metadata['has_children'] = False
        
        # Execute!
        try:
            result = executor.execute(action, context)
            self._record_execution(action.type, result)
            return result
            
        except Exception as e:
            return ExecutionResult(
                success=False,
                data=None,
                error=str(e),
                action_type=action.type
            )
    
    def _record_execution(self, operation_type: str, result: ExecutionResult) -> None:
        """Record execution for history."""
        self._execution_history.append({
            'operation_type': operation_type,
            'success': result.success,
        })
    
    def get_execution_history(self) -> List[Dict]:
        """Get execution history."""
        return self._execution_history.copy()
    
    def clear_history(self) -> None:
        """Clear execution history."""
        self._execution_history.clear()
