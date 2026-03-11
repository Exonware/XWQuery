#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/type_index.py
"""
O(k) type queries using xwnode's Trie strategy.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""
# xwnode is a required dependency per pyproject.toml
# No try/except per DEV_GUIDELINES.md Line 128
from exonware.xwnode import XWNode, NodeMode
from ..syntax_tree import ParseNode
class TypeIndex:
    """
    O(k) type queries using xwnode's Trie strategy.
    Enables fast prefix-based type searches:
    - find_by_type("string") -> all string nodes
    - find_by_type("func") -> all function/funcall nodes
    """
    def __init__(self):
        self._index = XWNode(mode=NodeMode.TRIE)
    def index_ast(self, ast: ParseNode):
        """Build index by walking entire AST"""
        self._walk_and_index(ast)
    def _walk_and_index(self, node: ParseNode):
        """Recursively index nodes by type"""
        # Index this node
        existing = self._index.get(node.type, [])
        # Handle case where get() returns unexpected type (e.g., when strategy fails)
        if not isinstance(existing, list):
            existing = []
        existing.append(node)
        self._index.set(node.type, existing)
        # Index children recursively
        for child in node.children:
            self._walk_and_index(child)
    def find_by_type(self, node_type: str) -> list[ParseNode]:
        """
        Find all nodes of given type.
        O(k) where k = number of results.
        """
        result = self._index.get(node_type, [])
        # Ensure we return a list even if get() returns unexpected type
        if not isinstance(result, list):
            return []
        return result
    def find_by_type_prefix(self, prefix: str) -> list[ParseNode]:
        """
        Find all nodes whose type starts with prefix.
        O(k) where k = number of results.
        """
        results = []
        for type_name in self._index.find_prefix(prefix):
            results.extend(self._index.get(type_name, []))
        return results
