#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/position_index.py
"""
O(log n + k) position queries using xwnode's IntervalTree strategy.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""
# xwnode is a required dependency per pyproject.toml
# No try/except per DEV_GUIDELINES.md Line 128
from exonware.xwnode import XWNode, NodeMode
from ..syntax_tree import ParseNode
class PositionIndex:
    """
    O(log n + k) position queries using xwnode's IntervalTree strategy.
    Enables fast queries like:
    - "Find all nodes spanning lines 5-10"
    - "Find node at line 42"
    """
    def __init__(self):
        self._index = XWNode(mode=NodeMode.INTERVAL_TREE)
    def index_ast(self, ast: ParseNode):
        """Build index by walking entire AST"""
        self._walk_and_index(ast)
    def _walk_and_index(self, node: ParseNode):
        """Recursively index nodes by position"""
        # Index this node if it has position metadata
        if 'start_line' in node.metadata and 'end_line' in node.metadata:
            start = node.metadata['start_line']
            end = node.metadata['end_line']
            # Insert interval into IntervalTree
            self._index.insert_interval(start, end, node)
        # Index children recursively
        for child in node.children:
            self._walk_and_index(child)
    def find_overlapping(self, start_line: int, end_line: int) -> list[ParseNode]:
        """
        Find all nodes overlapping the given line range.
        O(log n + k) where k = number of results.
        """
        return self._index.find_overlaps(start_line, end_line)
    def find_at_position(self, line: int) -> list[ParseNode]:
        """
        Find all nodes at given line.
        O(log n + k) where k = number of results.
        """
        return self.find_overlapping(line, line)
