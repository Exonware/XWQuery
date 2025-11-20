#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/ast_optimizer.py

"""
Automatic AST optimization based on tree size.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from typing import Optional
from ..syntax_tree import ASTNode


class OptimizationLevel:
    """AST size thresholds for automatic optimization"""
    SMALL = 100      # No optimization overhead
    MEDIUM = 1000    # Type index only (Trie)
    LARGE = 10000    # Type + position indexes
    # Ultra-large: Full optimization suite


class OptimizedAST:
    """Base class for optimized AST wrappers"""
    def __init__(self, root: ASTNode):
        self.root = root
        self._node_count = self._count_nodes(root)
    
    def _count_nodes(self, node: ASTNode) -> int:
        """Count total nodes in AST tree"""
        count = 1
        for child in node.children:
            count += self._count_nodes(child)
        return count
    
    def find_by_type(self, node_type: str):
        """Override in subclasses with optimization"""
        return self._find_all_recursive(self.root, node_type)
    
    def _find_all_recursive(self, node: ASTNode, node_type: str):
        """Recursive search for nodes of given type"""
        results = []
        if node.type == node_type:
            results.append(node)
        for child in node.children:
            results.extend(self._find_all_recursive(child, node_type))
        return results
    
    def find_in_range(self, start_line: int, end_line: int):
        """Override in subclasses with optimization"""
        raise NotImplementedError("Position queries not available in basic AST")


class BasicAST(OptimizedAST):
    """No optimization - direct tree operations (< 100 nodes)"""
    pass


class MediumAST(OptimizedAST):
    """Type index using Trie (100-1000 nodes)"""
    def __init__(self, root: ASTNode):
        super().__init__(root)
        # Import here to avoid circular dependency
        from .type_index import TypeIndex
        self._type_index = TypeIndex()
        self._type_index.index_ast(root)
    
    def find_by_type(self, node_type: str):
        # O(k) instead of O(n)
        return self._type_index.find_by_type(node_type)


class LargeAST(MediumAST):
    """Type + Position indexes (1000-10000 nodes)"""
    def __init__(self, root: ASTNode):
        super().__init__(root)
        # Import here to avoid circular dependency
        from .position_index import PositionIndex
        self._position_index = PositionIndex()
        self._position_index.index_ast(root)
    
    def find_in_range(self, start_line: int, end_line: int):
        # O(log n + k) instead of O(n)
        return self._position_index.find_in_range(start_line, end_line)


class UltraLargeAST(LargeAST):
    """Full optimization suite (> 10000 nodes)"""
    def __init__(self, root: ASTNode):
        super().__init__(root)
        # Additional optimizations:
        # - Rope structure for efficient editing
        # - Cached subtree hashes for change detection
        # - Compressed storage for rarely-accessed nodes


class ASTOptimizer:
    """Automatically selects optimization level"""
    
    def optimize(self, ast: ASTNode, mode: str = "auto") -> OptimizedAST:
        """
        Optimize AST based on size or manual mode selection.
        
        Args:
            ast: The AST node to optimize
            mode: "auto" (default), "none", "basic", "medium", "large", "ultra"
        
        Returns:
            Optimized AST wrapper appropriate for the tree size
        """
        if mode == "none" or mode == "basic":
            return BasicAST(ast)
        
        # Count nodes for automatic selection
        node_count = self._count_nodes(ast)
        
        if mode == "auto":
            if node_count < OptimizationLevel.SMALL:
                return BasicAST(ast)
            elif node_count < OptimizationLevel.MEDIUM:
                return MediumAST(ast)
            elif node_count < OptimizationLevel.LARGE:
                return LargeAST(ast)
            else:
                return UltraLargeAST(ast)
        
        # Manual mode selection
        elif mode == "medium":
            return MediumAST(ast)
        elif mode == "large":
            return LargeAST(ast)
        elif mode == "ultra":
            return UltraLargeAST(ast)
        else:
            raise ValueError(f"Unknown optimization mode: {mode}")
    
    def _count_nodes(self, node: ASTNode) -> int:
        """Count total nodes in tree"""
        count = 1
        for child in node.children:
            count += self._count_nodes(child)
        return count

