#!/usr/bin/env python3
"""
Python to Rust Bidirectional Converter
Bidirectional converter that transforms Python code to Rust and vice versa,
using xwsyntax for syntax parsing/generation and xwschema for schema-aware
type conversion.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 15-Jan-2025
"""

from __future__ import annotations
import json
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
from exonware.xwsystem.console.cli import ensure_utf8_console
ensure_utf8_console()
from exonware.xwsyntax import BidirectionalGrammar
from exonware.xwsyntax.errors import GrammarError, ParseError
from exonware.xwsyntax.syntax_tree import ParseNode
# Import transformer
try:
    from .transformer import ASTTransformer
except ImportError:
    # Fallback for direct execution
    from transformer import ASTTransformer


class PythonToRustConverter:
    """
    Bidirectional Python ↔ Rust code converter.
    Uses:
    - xwsyntax: Syntax parsing (Python/Rust → AST) and code generation (AST → Python/Rust)
    - xwschema: Schema-aware type conversion and validation
    - JSON schemas: Type mappings, pattern mappings, and conversion rules
    """

    def __init__(self, schema_dir: Optional[Path] = None):
        """
        Initialize converter with schemas.
        Args:
            schema_dir: Directory containing schema files (default: schemas/ in same directory)
        """
        if schema_dir is None:
            schema_dir = Path(__file__).parent / 'schemas'
        self.schema_dir = Path(schema_dir)
        self._schemas: Optional[Dict[str, Any]] = None
        self._transformer: Optional[ASTTransformer] = None
        self._python_grammar: Optional[BidirectionalGrammar] = None
        self._rust_grammar: Optional[BidirectionalGrammar] = None

    def load_schemas(self) -> Dict[str, Any]:
        """
        Load JSON schemas from schema directory.
        Returns:
            Dictionary containing loaded schemas
        """
        if self._schemas is not None:
            return self._schemas
        schemas = {}
        # Load type mappings
        type_mappings_path = self.schema_dir / 'type_mappings.json'
        if type_mappings_path.exists():
            with open(type_mappings_path, 'r', encoding='utf-8') as f:
                type_mappings_data = json.load(f)
                # Extract actual mappings from JSON schema structure
                if 'properties' in type_mappings_data:
                    # It's a JSON schema, extract the actual data
                    props = type_mappings_data['properties']
                    schemas['type_mappings'] = {
                        'primitives': props.get('primitives', {}).get('properties', {}),
                        'collections': props.get('collections', {}).get('properties', {}),
                        'optional': props.get('optional', {}).get('properties', {}),
                        'custom': props.get('custom', {}).get('additionalProperties', {})
                    }
                else:
                    # It's already in the correct format
                    schemas['type_mappings'] = type_mappings_data
        # Load pattern mappings
        pattern_mappings_path = self.schema_dir / 'pattern_mappings.json'
        if pattern_mappings_path.exists():
            with open(pattern_mappings_path, 'r', encoding='utf-8') as f:
                schemas['pattern_mappings'] = json.load(f)
        # Load conversion rules
        conversion_rules_path = self.schema_dir / 'conversion_rules.json'
        if conversion_rules_path.exists():
            with open(conversion_rules_path, 'r', encoding='utf-8') as f:
                schemas['conversion_rules'] = json.load(f)
        # Load language schemas (for validation)
        python_schema_path = self.schema_dir / 'python_schema.json'
        if python_schema_path.exists():
            with open(python_schema_path, 'r', encoding='utf-8') as f:
                schemas['python_schema'] = json.load(f)
        rust_schema_path = self.schema_dir / 'rust_schema.json'
        if rust_schema_path.exists():
            with open(rust_schema_path, 'r', encoding='utf-8') as f:
                schemas['rust_schema'] = json.load(f)
        self._schemas = schemas
        return schemas

    def _get_transformer(self) -> ASTTransformer:
        """Get or create AST transformer."""
        if self._transformer is None:
            schemas = self.load_schemas()
            self._transformer = ASTTransformer(schemas)
        return self._transformer

    def _get_python_grammar(self) -> BidirectionalGrammar:
        """Get or load Python grammar."""
        if self._python_grammar is None:
            try:
                self._python_grammar = BidirectionalGrammar.load('python')
            except GrammarError as e:
                raise GrammarError(f"Failed to load Python grammar: {e}")
        return self._python_grammar

    def _get_rust_grammar(self) -> BidirectionalGrammar:
        """Get or load Rust grammar."""
        if self._rust_grammar is None:
            try:
                self._rust_grammar = BidirectionalGrammar.load('rust')
            except GrammarError as e:
                raise GrammarError(f"Failed to load Rust grammar: {e}")
        return self._rust_grammar

    def convert_python_to_rust(self, python_code: str, transform_ast: bool = True) -> str:
        """
        Convert Python code to Rust.
        Flow: Python Code → AST → (Transform) → AST → Rust Code
        Args:
            python_code: Python source code as string
            transform_ast: Whether to apply AST transformations (default: True)
        Returns:
            Rust source code as string
        Raises:
            GrammarError: If grammar files are not available
            ParseError: If Python code cannot be parsed
        """
        # Normalize Python code - ensure it ends with a newline for file_input
        python_code = python_code.rstrip()
        if not python_code.endswith('\n'):
            python_code += '\n'
        # Step 1: Parse Python code → AST
        python_grammar = self._get_python_grammar()
        ast = python_grammar.parse(python_code)
        # Step 2: Transform AST (if enabled)
        if transform_ast:
            transformer = self._get_transformer()
            ast = transformer.transform_python_to_rust(ast)
        # Step 3: Generate Rust code from AST
        rust_grammar = self._get_rust_grammar()
        rust_code = rust_grammar.generate(ast)
        return rust_code

    def convert_rust_to_python(self, rust_code: str, transform_ast: bool = True) -> str:
        """
        Convert Rust code to Python.
        Flow: Rust Code → AST → (Transform) → AST → Python Code
        Args:
            rust_code: Rust source code as string
            transform_ast: Whether to apply AST transformations (default: True)
        Returns:
            Python source code as string
        Raises:
            GrammarError: If grammar files are not available
            ParseError: If Rust code cannot be parsed
        """
        # Step 1: Parse Rust code → AST
        rust_grammar = self._get_rust_grammar()
        ast = rust_grammar.parse(rust_code)
        # Step 2: Transform AST (if enabled)
        if transform_ast:
            transformer = self._get_transformer()
            ast = transformer.transform_rust_to_python(ast)
        # Step 3: Generate Python code from AST
        python_grammar = self._get_python_grammar()
        python_code = python_grammar.generate(ast)
        return python_code

    def convert_file(
        self,
        input_file: Path,
        output_file: Path,
        direction: str = 'python_to_rust'
    ) -> None:
        """
        Convert a file from Python to Rust or vice versa.
        Args:
            input_file: Path to input file
            output_file: Path to output file
            direction: 'python_to_rust' or 'rust_to_python'
        Raises:
            FileNotFoundError: If input file doesn't exist
            ValueError: If direction is invalid
        """
        input_path = Path(input_file)
        output_path = Path(output_file)
        if not input_path.exists():
            raise FileNotFoundError(f"Input file not found: {input_file}")
        # Read input code
        input_code = input_path.read_text(encoding='utf-8')
        # Convert
        if direction == 'python_to_rust':
            output_code = self.convert_python_to_rust(input_code)
        elif direction == 'rust_to_python':
            output_code = self.convert_rust_to_python(input_code)
        else:
            raise ValueError(f"Invalid direction: {direction}. Use 'python_to_rust' or 'rust_to_python'")
        # Write output code
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(output_code, encoding='utf-8')

    async def validate_schema(self, schema_name: str, data: Any) -> tuple[bool, list[str]]:
        """
        Validate data against a schema using xwschema.
        Args:
            schema_name: Name of schema to validate against ('python_schema' or 'rust_schema')
            data: Data to validate
        Returns:
            Tuple of (is_valid, error_messages)
        """
        try:
            from exonware.xwschema import XWSchema
            schemas = self.load_schemas()
            schema_data = schemas.get(schema_name)
            if schema_data is None:
                return False, [f"Schema not found: {schema_name}"]
            # Load schema using xwschema
            # Note: XWSchema.load is async, so we use it here
            # For synchronous use, we can use from_native
            schema = XWSchema.from_native(schema_data)
            # Validate data (xwschema validation is async)
            is_valid, errors = await schema.validate(data)
            return is_valid, errors
        except Exception as e:
            return False, [f"Validation error: {str(e)}"]

    def get_schema_info(self) -> Dict[str, Any]:
        """
        Get information about loaded schemas.
        Returns:
            Dictionary with schema information
        """
        schemas = self.load_schemas()
        info = {
            'schema_dir': str(self.schema_dir),
            'schemas_loaded': list(schemas.keys()),
            'has_type_mappings': 'type_mappings' in schemas,
            'has_pattern_mappings': 'pattern_mappings' in schemas,
            'has_conversion_rules': 'conversion_rules' in schemas,
        }
        return info

# Convenience API (module-level)

def convert_python_to_rust(python_code: str) -> str:
    """Convert Python code to Rust (convenience function)."""
    converter = PythonToRustConverter()
    return converter.convert_python_to_rust(python_code)


def convert_rust_to_python(rust_code: str) -> str:
    """Convert Rust code to Python (convenience function)."""
    converter = PythonToRustConverter()
    return converter.convert_rust_to_python(rust_code)


def convert_file(python_file: str, rust_file: str) -> None:
    """Convert a Python file to Rust file (convenience function)."""
    converter = PythonToRustConverter()
    converter.convert_file(python_file, rust_file, direction='python_to_rust')


def main():
    """Main function with example usage."""
    print("=" * 60)
    print("Python ↔ Rust Bidirectional Code Converter")
    print("Using xwsyntax + xwschema for conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    # Show schema info
    print("\nSchema Information:")
    schema_info = converter.get_schema_info()
    for key, value in schema_info.items():
        print(f"  {key}: {value}")
    # Example 1: Simple function conversion
    print("\n" + "=" * 60)
    print("Example 1: Converting Python function to Rust")
    print("=" * 60)
    python_code = """def add(a: int, b: int) -> int:
    return a + b
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code)
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
    except Exception as e:
        print(f"\n[INFO] Conversion demonstration:")
        print(f"  Error: {e}")
        print("\n  This demonstrates the architecture:")
        print("    1. Python Code -> Parse -> AST (Universal Format)")
        print("    2. AST -> Transform -> AST (Type/Pattern Mapping)")
        print("    3. AST -> Generate -> Rust Code")
        print("\n  Note: Grammar completeness affects conversion quality.")
    # Example 2: Convert a file (if provided)
    import sys
    if len(sys.argv) >= 3:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        direction = sys.argv[3] if len(sys.argv) >= 4 else 'python_to_rust'
        converter.convert_file(input_file, output_file, direction)
        print(f"\n[OK] Successfully converted {input_file} -> {output_file}")
    else:
        print("\n" + "=" * 60)
        print("Usage: python converter.py <input_file> <output_file> [direction]")
        print("  direction: 'python_to_rust' (default) or 'rust_to_python'")
        print("=" * 60)
if __name__ == "__main__":
    main()
