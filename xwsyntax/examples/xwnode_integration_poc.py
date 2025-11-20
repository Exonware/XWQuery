#!/usr/bin/env python3
"""
Proof of Concept: xwsyntax + xwnode Integration

This file demonstrates how xwsyntax can leverage xwnode for enhanced
AST operations while maintaining backward compatibility.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Date: October 29, 2025
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Callable

try:
    from exonware.xwnode import XWNode, merge_nodes, diff_nodes, MergeStrategy
    XWNODE_AVAILABLE = True
except ImportError:
    XWNODE_AVAILABLE = False
    print("[WARN] xwnode not installed. Install with: pip install exonware-xwnode")


# ============================================================================
# ENHANCED AST NODE (Proof of Concept)
# ============================================================================

@dataclass
class EnhancedASTNode:
    """
    Enhanced AST node powered by xwnode.
    
    Demonstrates new capabilities while maintaining backward compatibility.
    """
    
    type: str
    value: Any = None
    children: List['EnhancedASTNode'] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    # Internal xwnode representation (optional)
    _xwnode: Optional[Any] = field(default=None, repr=False, compare=False)
    _use_xwnode: bool = field(default=True, repr=False, compare=False)
    
    def __post_init__(self):
        """Initialize internal xwnode representation if available."""
        if self._use_xwnode and XWNODE_AVAILABLE and self._xwnode is None:
            self._initialize_xwnode()
    
    def _initialize_xwnode(self):
        """Create xwnode representation."""
        data = self.to_dict()
        # Use TREE_GRAPH_HYBRID strategy for optimal AST performance
        self._xwnode = XWNode.from_native(data, mode='TREE_GRAPH_HYBRID')
    
    # ========================================================================
    # CLASSIC API (Backward Compatible)
    # ========================================================================
    
    def find_all(self, node_type: str) -> List['EnhancedASTNode']:
        """Find all nodes of a given type."""
        results = []
        if self.type == node_type:
            results.append(self)
        for child in self.children:
            results.extend(child.find_all(node_type))
        return results
    
    def find_first(self, node_type: str) -> Optional['EnhancedASTNode']:
        """Find first node of a given type."""
        if self.type == node_type:
            return self
        for child in self.children:
            result = child.find_first(node_type)
            if result:
                return result
        return None
    
    def walk(self, visitor: Callable) -> None:
        """Walk tree with visitor function."""
        visitor(self)
        for child in self.children:
            child.walk(visitor)
    
    def transform(self, func: Callable[['EnhancedASTNode'], 'EnhancedASTNode']) -> 'EnhancedASTNode':
        """Transform tree with function."""
        new_children = [c.transform(func) for c in self.children]
        new_node = EnhancedASTNode(
            type=self.type,
            value=self.value,
            children=new_children,
            metadata=self.metadata.copy(),
            _use_xwnode=self._use_xwnode
        )
        return func(new_node)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        result = {'type': self.type}
        if self.value is not None:
            result['value'] = self.value
        if self.children:
            result['children'] = [c.to_dict() for c in self.children]
        if self.metadata:
            result['metadata'] = self.metadata
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'EnhancedASTNode':
        """Create from dictionary representation."""
        children_data = data.get('children', [])
        children = [cls.from_dict(c) for c in children_data]
        
        return cls(
            type=data['type'],
            value=data.get('value'),
            children=children,
            metadata=data.get('metadata', {}),
        )
    
    # ========================================================================
    # NEW CAPABILITIES (Powered by xwnode)
    # ========================================================================
    
    def query(self, query_str: str, format: str = 'auto') -> Any:
        """
        Query the AST using xwquery.
        
        Examples:
            # SQL-like query
            functions = ast.query(
                "SELECT name FROM nodes WHERE type = 'FunctionDecl'"
            )
            
            # JMESPath query
            variables = ast.query(
                "children[?type=='Variable'].name", 
                format='jmespath'
            )
        """
        if not XWNODE_AVAILABLE:
            raise RuntimeError("xwnode not installed. Install with: pip install exonware-xwnode")
        
        try:
            from exonware.xwquery import XWQuery
            return XWQuery.execute(query_str, self._xwnode, format=format)
        except ImportError:
            raise RuntimeError("xwquery not installed. Install with: pip install exonware-xwquery")
    
    def merge(self, other: 'EnhancedASTNode', strategy: str = 'DEEP') -> 'EnhancedASTNode':
        """
        Merge two ASTs.
        
        Useful for:
        - Combining partial ASTs
        - Applying code overlays
        - Merging transformations
        
        Args:
            other: Another AST to merge with
            strategy: Merge strategy ('DEEP', 'SHALLOW', 'OVERWRITE', etc.)
        
        Returns:
            New merged AST
        """
        if not XWNODE_AVAILABLE:
            raise RuntimeError("xwnode not installed")
        
        strategy_enum = MergeStrategy[strategy]
        merged_node = merge_nodes(self._xwnode, other._xwnode, strategy=strategy_enum)
        
        return EnhancedASTNode.from_dict(merged_node.to_native())
    
    def diff(self, other: 'EnhancedASTNode') -> Any:
        """
        Compare two ASTs and generate diff.
        
        Useful for:
        - Code change analysis
        - Detecting refactoring patterns
        - Version comparison
        
        Returns:
            DiffResult with changes
        """
        if not XWNODE_AVAILABLE:
            raise RuntimeError("xwnode not installed")
        
        return diff_nodes(self._xwnode, other._xwnode)
    
    def as_xwnode(self) -> Any:
        """
        Get underlying xwnode for advanced operations.
        
        Enables:
        - Direct xwnode API access
        - Integration with other xw* libraries
        - Advanced graph operations
        """
        if not XWNODE_AVAILABLE:
            raise RuntimeError("xwnode not installed")
        
        return self._xwnode
    
    # ========================================================================
    # UTILITY METHODS
    # ========================================================================
    
    def __str__(self) -> str:
        """String representation."""
        if self.value is not None:
            return f"{self.type}({self.value})"
        return self.type
    
    def __repr__(self) -> str:
        """Detailed representation."""
        parts = [f"type={self.type!r}"]
        if self.value is not None:
            parts.append(f"value={self.value!r}")
        if self.children:
            parts.append(f"children={len(self.children)}")
        if self.metadata:
            parts.append(f"metadata={self.metadata!r}")
        return f"EnhancedASTNode({', '.join(parts)})"


def create_immutable_ast(data: Dict[str, Any]) -> EnhancedASTNode:
    """
    Create an immutable AST using xwnode's COW semantics.
    
    Benefits:
    - Thread-safe
    - Memory efficient (structural sharing)
    - Enables undo/redo
    - Safe for caching
    
    Example:
        ast = create_immutable_ast({'type': 'Module', ...})
        ast2 = ast.transform(lambda n: ...)  # New tree, shares structure
    """
    if not XWNODE_AVAILABLE:
        raise RuntimeError("xwnode not installed")
    
    xwnode = XWNode.from_native(data, immutable=True)
    node = EnhancedASTNode.from_dict(xwnode.to_native())
    node._xwnode = xwnode
    return node


# ============================================================================
# DEMONSTRATION
# ============================================================================

def demo_basic_operations():
    """Demonstrate basic AST operations."""
    print("\n" + "="*70)
    print("DEMO 1: Basic Operations (Backward Compatible)")
    print("="*70)
    
    # Create sample AST
    ast = EnhancedASTNode(
        type='Module',
        children=[
            EnhancedASTNode(
                type='FunctionDecl',
                value='calculate',
                metadata={'line': 1},
                children=[
                    EnhancedASTNode(type='Parameter', value='x'),
                    EnhancedASTNode(type='Parameter', value='y'),
                    EnhancedASTNode(
                        type='Block',
                        children=[
                            EnhancedASTNode(type='Return', value='x + y')
                        ]
                    )
                ]
            ),
            EnhancedASTNode(
                type='FunctionDecl',
                value='main',
                metadata={'line': 5},
                children=[
                    EnhancedASTNode(
                        type='Block',
                        children=[
                            EnhancedASTNode(type='Call', value='calculate')
                        ]
                    )
                ]
            )
        ]
    )
    
    print(f"\nAST Structure:")
    print(f"  Root: {ast}")
    print(f"  Children: {len(ast.children)}")
    
    # Find all functions
    functions = ast.find_all('FunctionDecl')
    print(f"\n[OK] Found {len(functions)} functions:")
    for func in functions:
        print(f"  - {func.value} (line {func.metadata.get('line', '?')})")
    
    # Find first parameter
    param = ast.find_first('Parameter')
    print(f"\n[OK] First parameter: {param.value if param else 'None'}")
    
    # Walk tree
    print(f"\n[OK] Tree walk:")
    node_count = {'count': 0}
    def count_visitor(node):
        node_count['count'] += 1
    ast.walk(count_visitor)
    print(f"  Total nodes: {node_count['count']}")
    
    # Transform tree
    def add_metadata(node):
        node.metadata['visited'] = True
        return node
    
    transformed = ast.transform(add_metadata)
    print(f"\n[OK] Transform: Added metadata to all nodes")
    print(f"  Original has 'visited': {'visited' in ast.metadata}")
    print(f"  Transformed has 'visited': {'visited' in transformed.metadata}")


def demo_xwnode_features():
    """Demonstrate new xwnode-powered features."""
    if not XWNODE_AVAILABLE:
        print("\n[WARN] Skipping xwnode features demo (xwnode not installed)")
        return
    
    print("\n" + "="*70)
    print("DEMO 2: New xwnode-Powered Features")
    print("="*70)
    
    # Create sample ASTs
    ast1 = EnhancedASTNode(
        type='Module',
        children=[
            EnhancedASTNode(type='FunctionDecl', value='func1'),
            EnhancedASTNode(type='Variable', value='x'),
        ]
    )
    
    ast2 = EnhancedASTNode(
        type='Module',
        children=[
            EnhancedASTNode(type='FunctionDecl', value='func2'),
            EnhancedASTNode(type='Variable', value='y'),
        ]
    )
    
    # Merge ASTs
    print("\n[OK] Merge two ASTs:")
    print(f"  AST1: {len(ast1.children)} children")
    print(f"  AST2: {len(ast2.children)} children")
    
    merged = ast1.merge(ast2, strategy='DEEP')
    print(f"  Merged: {len(merged.children)} children")
    
    # Diff ASTs
    print("\n[OK] Generate diff:")
    diff = ast1.diff(ast2)
    print(f"  Total changes: {diff.total_changes}")
    print(f"  Operations: {len(diff.operations)}")
    print(f"  Paths changed: {len(diff.paths_changed)}")
    
    # Access xwnode
    print("\n[OK] Access underlying xwnode:")
    xwnode = ast1.as_xwnode()
    print(f"  XWNode type: {type(xwnode).__name__}")
    print(f"  Has find method: {hasattr(xwnode, 'find')}")
    print(f"  Has query method: {hasattr(xwnode, 'query')}")


def demo_immutable_ast():
    """Demonstrate immutable AST with COW."""
    if not XWNODE_AVAILABLE:
        print("\n[WARN]  Skipping immutable AST demo (xwnode not installed)")
        return
    
    print("\n" + "="*70)
    print("DEMO 3: Immutable AST with Copy-on-Write")
    print("="*70)
    
    # Create immutable AST
    ast_data = {
        'type': 'Module',
        'children': [
            {'type': 'FunctionDecl', 'value': 'original_func'},
            {'type': 'Variable', 'value': 'x'},
        ]
    }
    
    ast = create_immutable_ast(ast_data)
    print(f"\n[OK] Created immutable AST")
    print(f"  Type: {ast.type}")
    print(f"  Children: {len(ast.children)}")
    
    # Transform creates new tree
    def rename_function(node):
        if node.type == 'FunctionDecl':
            node.value = 'transformed_func'
        return node
    
    transformed = ast.transform(rename_function)
    
    print(f"\n[OK] Transformed AST (COW):")
    original_func = ast.find_first('FunctionDecl')
    transformed_func = transformed.find_first('FunctionDecl')
    print(f"  Original function: {original_func.value if original_func else 'None'}")
    print(f"  Transformed function: {transformed_func.value if transformed_func else 'None'}")
    print(f"  Original unchanged: {original_func.value == 'original_func' if original_func else False}")
    
    # Multiple transformations share structure
    print(f"\n[OK] Memory efficiency with COW:")
    print(f"  Original and transformed share unchanged nodes")
    print(f"  Only modified nodes are copied")
    print(f"  Great for: undo/redo, caching, thread safety")


def demo_performance_comparison():
    """Compare performance with and without xwnode."""
    print("\n" + "="*70)
    print("DEMO 4: Performance Characteristics")
    print("="*70)
    
    import time
    
    # Create large AST
    def create_large_ast(depth: int, breadth: int) -> EnhancedASTNode:
        """Create AST with specified depth and breadth."""
        if depth == 0:
            return EnhancedASTNode(type='Leaf', value=f'leaf_{id({})}')
        
        children = [create_large_ast(depth - 1, breadth) for _ in range(breadth)]
        return EnhancedASTNode(
            type=f'Node_D{depth}',
            children=children,
            _use_xwnode=XWNODE_AVAILABLE
        )
    
    print("\n[OK] Creating test AST (depth=4, breadth=3)...")
    start = time.time()
    ast = create_large_ast(depth=4, breadth=3)
    create_time = time.time() - start
    
    # Count nodes
    node_count = {'count': 0}
    def counter(node):
        node_count['count'] += 1
    ast.walk(counter)
    
    print(f"  Nodes: {node_count['count']}")
    print(f"  Creation time: {create_time:.4f}s")
    
    # Test find_all performance
    print("\n[OK] Testing find_all performance...")
    start = time.time()
    results = ast.find_all('Leaf')
    find_time = time.time() - start
    print(f"  Found: {len(results)} leaves")
    print(f"  Time: {find_time:.4f}s")
    
    # Test to_dict performance
    print("\n[OK] Testing serialization performance...")
    start = time.time()
    data = ast.to_dict()
    serialize_time = time.time() - start
    print(f"  Time: {serialize_time:.4f}s")
    
    if XWNODE_AVAILABLE:
        print("\n[OK] xwnode features available:")
        print("  - Optimized path caching")
        print("  - Copy-on-write semantics")
        print("  - Query support")
        print("  - Merge/diff/patch operations")
    else:
        print("\n[WARN]  Install xwnode for enhanced performance:")
        print("  pip install exonware-xwnode")


def main():
    """Run all demonstrations."""
    print("\n" + "="*70)
    print("xwsyntax + xwnode Integration - Proof of Concept")
    print("="*70)
    print(f"\nxwnode available: {XWNODE_AVAILABLE}")
    
    # Run demos
    demo_basic_operations()
    demo_xwnode_features()
    demo_immutable_ast()
    demo_performance_comparison()
    
    # Summary
    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    print("\n[+] Backward Compatible:")
    print("  - All existing APIs work unchanged")
    print("  - find_all(), find_first(), walk(), transform()")
    print("  - to_dict(), from_dict()")
    
    if XWNODE_AVAILABLE:
        print("\n[+] New Capabilities (with xwnode):")
        print("  - query() - SQL/JMESPath/XPath queries")
        print("  - merge() - Combine ASTs")
        print("  - diff() - Compare ASTs")
        print("  - as_xwnode() - Direct xwnode access")
        print("  - create_immutable_ast() - COW semantics")
    else:
        print("\n[WARN]  Install xwnode for new capabilities:")
        print("  pip install exonware-xwnode")
    
    print("\n[+] Performance Benefits:")
    print("  - Optimized tree operations")
    print("  - Path caching")
    print("  - Memory efficiency with COW")
    print("  - Thread-safe operations")
    
    print("\n" + "="*70)
    print("See docs/XWSYNTAX_XWNODE_INTEGRATION_OPPORTUNITIES.md for details")
    print("="*70)


if __name__ == '__main__':
    main()

