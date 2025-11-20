#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/type_index.py

"""
O(k) type queries using xwnode's Trie strategy.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

from typing import List

# xwnode is a required dependency per pyproject.toml
# No try/except per DEV_GUIDELINES.md Line 128
from exonware.xwnode import XWNode, NodeMode

from ..syntax_tree import ASTNode


class TypeIndex:
    """
    O(k) type queries using xwnode's Trie strategy.
    
    Enables fast prefix-based type searches:
    - find_by_type("string") -> all string nodes
    - find_by_type("func") -> all function/funcall nodes
    """
    
    def __init__(self):
        self._index = XWNode(mode=NodeMode.TRIE)
    
    def index_ast(self, ast: ASTNode):
        """Build index by walking entire AST"""
        self._walk_and_index(ast)
    
    def _walk_and_index(self, node: ASTNode):
        """Recursively index nodes by type"""
        # Index this node
        existing = self._index.get(node.type, [])
        existing.append(node)
        self._index.set(node.type, existing)
        
        # Index children recursively
        for child in node.children:
            self._walk_and_index(child)
    
    def find_by_type(self, node_type: str) -> List[ASTNode]:
        """
        Find all nodes of given type.
        O(k) where k = number of results.
        """
        return self._index.get(node_type, [])
    
    def find_by_type_prefix(self, prefix: str) -> List[ASTNode]:
        """
        Find all nodes whose type starts with prefix.
        O(k) where k = number of results.
        """
        results = []
        for type_name in self._index.find_prefix(prefix):
            results.extend(self._index.get(type_name, []))
        return results
