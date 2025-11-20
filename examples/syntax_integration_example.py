#!/usr/bin/env python3
# exonware/xwquery/examples/syntax_integration_example.py
"""
Integration example showing how to use xwsystem.syntax in xwquery strategies.

This demonstrates the pattern for implementing query parsers using the
universal syntax engine instead of hand-written parsers.
"""

import sys
from pathlib import Path

# Add src to path for development
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'xwsystem' / 'src'))

from exonware.xwsyntax import SyntaxEngine, ASTNode

# Get grammars directory
GRAMMARS_DIR = Path(__file__).parent.parent / 'src' / 'exonware' / 'xwquery' / 'query' / 'grammars'


class JSONQueryStrategy:
    """
    Example query strategy using xwsystem.syntax.
    
    This shows how query strategies should use the syntax engine
    instead of implementing custom parsers.
    """
    
    def __init__(self):
        """Initialize strategy with syntax engine."""
        self._engine = SyntaxEngine(grammar_dir=GRAMMARS_DIR)
        self._grammar_name = 'json'
    
    def parse(self, query: str) -> ASTNode:
        """
        Parse query string to AST.
        
        Args:
            query: Query string in JSON format
            
        Returns:
            ASTNode: Parsed AST
        """
        return self._engine.parse(query, grammar=self._grammar_name)
    
    def validate(self, query: str) -> bool:
        """
        Validate query syntax.
        
        Args:
            query: Query string to validate
            
        Returns:
            True if valid, False otherwise
        """
        errors = self._engine.validate(query, grammar=self._grammar_name)
        return len(errors) == 0
    
    def get_errors(self, query: str) -> list[str]:
        """
        Get validation errors.
        
        Args:
            query: Query string to validate
            
        Returns:
            List of error messages
        """
        return self._engine.validate(query, grammar=self._grammar_name)
    
    def extract_keys(self, query: str) -> list[str]:
        """
        Extract all keys from JSON query.
        
        Demonstrates AST traversal.
        
        Args:
            query: JSON query string
            
        Returns:
            List of all keys
        """
        ast = self.parse(query)
        keys = []
        
        def walk(node: ASTNode):
            if node.type == 'pair' and len(node.children) >= 1:
                # First child of pair is the key
                key_node = node.children[0]
                if key_node.children:
                    keys.append(key_node.children[0].value)
            for child in node.children:
                walk(child)
        
        walk(ast)
        return keys


def main():
    """Main example function."""
    print("=" * 70)
    print("Integration Example: Query Strategy using xwsystem.syntax")
    print("=" * 70)
    print()
    
    # Create strategy
    strategy = JSONQueryStrategy()
    
    # Example queries
    queries = [
        '{"name": "Alice", "age": 30}',
        '{"user": {"id": 123, "email": "test@example.com"}}',
        '{"products": [{"id": 1, "name": "Item"}]}',
    ]
    
    for i, query in enumerate(queries, 1):
        print(f"Query {i}: {query[:60]}{'...' if len(query) > 60 else ''}")
        
        # Validate
        if strategy.validate(query):
            print("  [OK] Valid syntax")
            
            # Parse
            ast = strategy.parse(query)
            print(f"  AST type: {ast.type}")
            print(f"  Children: {len(ast.children)}")
            
            # Extract keys
            keys = strategy.extract_keys(query)
            print(f"  Keys found: {keys}")
        else:
            errors = strategy.get_errors(query)
            print(f"  [FAIL] Invalid syntax: {errors[0]}")
        
        print()
    
    print("=" * 70)
    print("Key Benefits of xwsystem.syntax:")
    print("=" * 70)
    print()
    print("1. Grammar-based parsing - Define syntax in .grammar files")
    print("2. Reusable engine - Same engine for all query languages")
    print("3. Less code - ~100 lines of grammar vs 800+ lines of parser")
    print("4. Better maintainability - Grammar is easier to read/update")
    print("5. Automatic validation - Built-in syntax checking")
    print("6. AST traversal - Powerful tree manipulation capabilities")
    print()
    print("=" * 70)


if __name__ == '__main__':
    main()

