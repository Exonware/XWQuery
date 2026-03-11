#exonware/xwsyntax/src/exonware/xwsyntax/syntax_tree.py
"""
Parse node definitions and tree utilities.
Enhanced with xwnode integration for advanced capabilities.
Following DEV_GUIDELINES.md:
- ParseNode extends AParseNode (abstract base class)
- AParseNode extends IParseNode (interface/Protocol)
- This enforces the contract that all parse nodes must follow
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Optional, Callable
from .defs import ParseNodeType
# Import abstract base class
# Following DEV_GUIDELINES.md: Concrete classes extend abstract classes
from .base import AParseNode
# xwnode integration - always available
from exonware.xwnode import XWNode, merge_nodes, diff_nodes, patch_nodes, MergeStrategy
@dataclass


class ParseNode(AParseNode):
    """
    Universal parse node - Powered by xwnode.
    Represents a node in the parse tree, with type, value,
    children, and metadata. Can represent any parsed content
    (syntax like SQL, or data like JSON, XML, CSV, etc.).
    Enhanced with xwnode for advanced capabilities including
    query support, merge/diff/patch operations, and optional
    copy-on-write semantics.
    """
    type: str = ""
    value: Any = None
    children: list[ParseNode] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    # Internal xwnode representation for advanced operations
    _xwnode: Optional[XWNode] = field(default=None, repr=False, compare=False)

    def __post_init__(self):
        """Initialize xwnode backend for advanced operations."""
        if self._xwnode is None:
            data = self._to_dict_internal()
            # Use parse tree strategy - specifically optimized for parse operations
            # Provides O(1) type-based lookups and pre-computed metrics
            self._xwnode = XWNode.from_native(data, mode='AST')

    def _to_dict_internal(self) -> dict[str, Any]:
        """Convert to dict without triggering xwnode initialization."""
        result = {'type': self.type}
        if self.value is not None:
            result['value'] = self.value
        if self.children:
            result['children'] = [c._to_dict_internal() if hasattr(c, '_to_dict_internal') else c.to_dict() for c in self.children]
        if self.metadata:
            result['metadata'] = self.metadata
        return result

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
        return f"ParseNode({', '.join(parts)})"

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary representation."""
        result = {
            'type': self.type,
        }
        if self.value is not None:
            result['value'] = self.value
        if self.children:
            result['children'] = [c.to_dict() for c in self.children]
        if self.metadata:
            result['metadata'] = self.metadata
        return result
    @classmethod

    def from_dict(cls, data: dict[str, Any]) -> ParseNode:
        """Create from dictionary representation."""
        children_data = data.get('children', [])
        children = [cls.from_dict(c) for c in children_data]
        return cls(
            type=data['type'],
            value=data.get('value'),
            children=children,
            metadata=data.get('metadata', {}),
        )

    def find_all(self, node_type: str) -> list[ParseNode]:
        """Find all nodes of a given type."""
        results = []
        if self.type == node_type:
            results.append(self)
        for child in self.children:
            results.extend(child.find_all(node_type))
        return results

    def find_first(self, node_type: str) -> Optional[ParseNode]:
        """Find first node of a given type."""
        if self.type == node_type:
            return self
        for child in self.children:
            result = child.find_first(node_type)
            if result:
                return result
        return None

    def walk(self, visitor: ParseVisitor) -> None:
        """Walk tree with visitor."""
        visitor.visit(self)
        for child in self.children:
            child.walk(visitor)

    def transform(self, func: Callable[[ParseNode], ParseNode]) -> ParseNode:
        """Transform tree with function."""
        new_children = [c.transform(func) for c in self.children]
        new_node = ParseNode(
            type=self.type,
            value=self.value,
            children=new_children,
            metadata=self.metadata.copy(),
        )
        return func(new_node)
    # ========================================================================
    # NEW CAPABILITIES - Powered by xwnode
    # ========================================================================

    def query(self, query_str: str, format: str = 'auto') -> Any:
        """
        Query the AST using SQL, JMESPath, XPath, or other query languages.
        Args:
            query_str: Query string
            format: Query format ('auto', 'sql', 'jmespath', 'xpath', etc.)
        Returns:
            Query results
        Examples:
            # SQL query
            functions = ast.query(
                "SELECT name FROM nodes WHERE type = 'FunctionDecl'"
            )
            # JMESPath query
            variables = ast.query(
                "children[?type=='Variable'].name",
                format='jmespath'
            )
            # XPath query
            all_names = ast.query("//FunctionDecl/@name", format='xpath')
        """
        from exonware.xwquery import XWQuery
        return XWQuery.execute(query_str, self._xwnode, format=format)

    def merge(self, other: ParseNode, strategy: str = 'DEEP') -> ParseNode:
        """
        Merge two parse trees intelligently.
        Args:
            other: Another parse tree to merge with
            strategy: Merge strategy ('DEEP', 'SHALLOW', 'OVERWRITE', etc.)
        Returns:
            New merged parse tree
        Use cases:
            - Combining partial ASTs
            - Applying code overlays
            - Merging transformations
            - Code generation
        Example:
            base = parse_file('base.py')
            overlay = parse_file('overlay.py')
            merged = base.merge(overlay, strategy='DEEP')
        """
        strategy_enum = MergeStrategy[strategy]
        merged_node = merge_nodes(self._xwnode, other._xwnode, strategy=strategy_enum)
        return ParseNode.from_dict(merged_node.to_native())

    def diff(self, other: ParseNode) -> Any:
        """
        Compare two parse trees and generate detailed diff.
        Args:
            other: Another parse tree to compare with
        Returns:
            DiffResult with changes information
        Use cases:
            - Code change analysis
            - Detecting refactoring patterns
            - Version comparison
            - Change tracking
        Example:
            ast_v1 = parse_file('main_v1.py')
            ast_v2 = parse_file('main_v2.py')
            diff = ast_v1.diff(ast_v2)
            print(f"Changes: {diff.total_changes}")
        """
        return diff_nodes(self._xwnode, other._xwnode)

    def patch(self, operations: list[dict[str, Any]]) -> ParseNode:
        """
        Apply patch operations to parse tree.
        Args:
            operations: List of patch operations
        Returns:
            New patched parse tree
        Use cases:
            - Incremental transformations
            - Automated refactoring
            - Code generation
            - AST manipulation
        Example:
            patched = ast.patch([
                {'op': 'replace', 'path': '/children/0', 'value': new_node}
            ])
        """
        patched_node = patch_nodes(self._xwnode, operations)
        return ParseNode.from_dict(patched_node.to_native())

    def as_xwnode(self) -> XWNode:
        """
        Get underlying xwnode for advanced operations.
        Returns:
            The internal XWNode representation
        Enables:
            - Direct xwnode API access
            - Graph operations
            - Advanced queries
            - Integration with other xw* libraries
        Example:
            xwnode = ast.as_xwnode()
            # Use full xwnode API
            result = xwnode.find('children.0.name')
        """
        return self._xwnode
# ============================================================================
# IMMUTABLE PARSE NODE FACTORY
# ============================================================================

def create_immutable_ast(data: dict[str, Any]) -> ParseNode:
    """
    Create an immutable parse node with copy-on-write semantics.
    Args:
        data: Parse tree data as dictionary
    Returns:
        Immutable ParseNode with COW support
    Benefits:
        - Thread-safe by default
        - Memory efficient (structural sharing)
        - Enables undo/redo
        - Safe for caching
        - Multiple views without full copying
    Example:
        node = create_immutable_ast({'type': 'Module', ...})
        node2 = node.transform(optimize)  # New tree, shares unchanged structure
        node3 = node.transform(instrument) # Another view
        # Memory usage: ~1.1x original (not 3x!)
    """
    xwnode = XWNode.from_native(data, immutable=True)
    node = ParseNode.from_dict(xwnode.to_native())
    node._xwnode = xwnode
    return node


class ParseVisitor:
    """Base visitor for parse tree traversal."""

    def visit(self, node: ParseNode) -> Any:
        """Visit a node."""
        method_name = f'visit_{node.type}'
        method = getattr(self, method_name, self.generic_visit)
        return method(node)

    def generic_visit(self, node: ParseNode) -> Any:
        """Default visit method."""
        pass


class ParsePrinter(ParseVisitor):
    """Print parse tree."""

    def __init__(self, indent: str = "  "):
        self.indent = indent
        self.level = 0

    def visit(self, node: ParseNode) -> None:
        """Visit and print node."""
        print(f"{self.indent * self.level}{node}")
        self.level += 1
        for child in node.children:
            self.visit(child)
        self.level -= 1
    @classmethod

    def print_tree(cls, node: ParseNode) -> None:
        """Print tree starting from node."""
        printer = cls()
        printer.visit(node)
