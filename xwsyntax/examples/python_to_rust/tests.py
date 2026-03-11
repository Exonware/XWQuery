#!/usr/bin/env python3
"""
Roundtrip tests for Python ↔ Rust converter.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 15-Jan-2025
"""

from pathlib import Path
from typing import Optional
from exonware.xwsystem.console.cli import ensure_utf8_console
ensure_utf8_console()
try:
    from .converter import PythonToRustConverter
except ImportError:
    # Fallback for direct execution
    from converter import PythonToRustConverter


def test_simple_conversion():
    """Test simple Python to Rust conversion."""
    print("=" * 60)
    print("Test: Simple Python to Rust Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
def add(a: int, b: int) -> int:
    return a + b
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Conversion failed: {e}")
        return False


def test_rust_to_python_conversion():
    """Test Rust to Python conversion."""
    print("\n" + "=" * 60)
    print("Test: Rust to Python Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    rust_code = """
fn add(a: i32, b: i32) -> i32 {
    a + b
}
"""
    try:
        python_code = converter.convert_rust_to_python(rust_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code)
        print("\n[OK] Conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Conversion failed: {e}")
        return False


def test_roundtrip_python_to_rust_to_python():
    """Test roundtrip: Python → Rust → Python."""
    print("\n" + "=" * 60)
    print("Test: Roundtrip Python → Rust → Python")
    print("=" * 60)
    converter = PythonToRustConverter()
    original_python = """
def greet(name: str) -> str:
    return f"Hello, {name}!"
"""
    try:
        # Python → Rust
        rust_code = converter.convert_python_to_rust(original_python.strip())
        print(f"\nOriginal Python:\n{'-' * 60}")
        print(original_python.strip())
        print(f"\nIntermediate Rust:\n{'-' * 60}")
        print(rust_code)
        # Rust → Python
        roundtrip_python = converter.convert_rust_to_python(rust_code)
        print(f"\nRoundtrip Python:\n{'-' * 60}")
        print(roundtrip_python)
        print("\n[OK] Roundtrip successful")
        print("\nNote: The roundtrip code may not be identical due to:")
        print("  - Grammar differences")
        print("  - Language idioms")
        print("  - Type system differences")
        return True
    except Exception as e:
        print(f"\n[ERROR] Roundtrip failed: {e}")
        return False


def test_roundtrip_rust_to_python_to_rust():
    """Test roundtrip: Rust → Python → Rust."""
    print("\n" + "=" * 60)
    print("Test: Roundtrip Rust → Python → Rust")
    print("=" * 60)
    converter = PythonToRustConverter()
    original_rust = """
fn multiply(a: i32, b: i32) -> i32 {
    a * b
}
"""
    try:
        # Rust → Python
        python_code = converter.convert_rust_to_python(original_rust.strip())
        print(f"\nOriginal Rust:\n{'-' * 60}")
        print(original_rust.strip())
        print(f"\nIntermediate Python:\n{'-' * 60}")
        print(python_code)
        # Python → Rust
        roundtrip_rust = converter.convert_python_to_rust(python_code)
        print(f"\nRoundtrip Rust:\n{'-' * 60}")
        print(roundtrip_rust)
        print("\n[OK] Roundtrip successful")
        print("\nNote: The roundtrip code may not be identical due to:")
        print("  - Grammar differences")
        print("  - Language idioms")
        print("  - Type system differences")
        return True
    except Exception as e:
        print(f"\n[ERROR] Roundtrip failed: {e}")
        return False


def test_file_conversion():
    """Test file conversion."""
    print("\n" + "=" * 60)
    print("Test: File Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    examples_dir = Path(__file__).parent / 'examples'
    simple_py = examples_dir / 'simple.py'
    if not simple_py.exists():
        print(f"[SKIP] Example file not found: {simple_py}")
        return False
    try:
        output_rs = Path(__file__).parent / 'examples' / 'simple.rs'
        converter.convert_file(simple_py, output_rs, direction='python_to_rust')
        print(f"\n[OK] File conversion successful")
        print(f"  Input: {simple_py}")
        print(f"  Output: {output_rs}")
        return True
    except Exception as e:
        print(f"\n[ERROR] File conversion failed: {e}")
        return False


def test_schema_loading():
    """Test schema loading."""
    print("\n" + "=" * 60)
    print("Test: Schema Loading")
    print("=" * 60)
    converter = PythonToRustConverter()
    try:
        schema_info = converter.get_schema_info()
        print("\nSchema Information:")
        for key, value in schema_info.items():
            print(f"  {key}: {value}")
        schemas = converter.load_schemas()
        print(f"\nLoaded schemas: {list(schemas.keys())}")
        print("\n[OK] Schema loading successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Schema loading failed: {e}")
        return False


def test_complex_class_conversion():
    """Test complex class conversion."""
    print("\n" + "=" * 60)
    print("Test: Complex Class Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
    def introduce(self) -> str:
        return f"I'm {self.name}, {self.age} years old."
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Complex class conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Complex class conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_generics_conversion():
    """Test generics conversion."""
    print("\n" + "=" * 60)
    print("Test: Generics Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
def process(items: list[int]) -> list[str]:
    return [str(x) for x in items]
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Generics conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Generics conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_optional_types_conversion():
    """Test optional types conversion."""
    print("\n" + "=" * 60)
    print("Test: Optional Types Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
from typing import Optional
def find_item(items: list[str], target: str) -> Optional[str]:
    for item in items:
        if item == target:
            return item
    return None
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Optional types conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Optional types conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_error_handling_conversion():
    """Test error handling conversion."""
    print("\n" + "=" * 60)
    print("Test: Error Handling Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
def divide(a: int, b: int) -> int:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Error handling conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Error handling conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_complex_examples_file():
    """Test conversion of complex examples file."""
    print("\n" + "=" * 60)
    print("Test: Complex Examples File")
    print("=" * 60)
    converter = PythonToRustConverter()
    examples_dir = Path(__file__).parent / 'examples'
    complex_py = examples_dir / 'complex.py'
    if not complex_py.exists():
        print(f"[SKIP] Complex examples file not found: {complex_py}")
        return False
    try:
        python_code = complex_py.read_text(encoding='utf-8')
        rust_code = converter.convert_python_to_rust(python_code)
        output_rs = examples_dir / 'complex.rs'
        output_rs.write_text(rust_code, encoding='utf-8')
        print(f"\n[OK] Complex examples conversion successful")
        print(f"  Input: {complex_py}")
        print(f"  Output: {output_rs}")
        print(f"\nFirst 500 chars of Rust output:\n{'-' * 60}")
        print(rust_code[:500])
        return True
    except Exception as e:
        print(f"\n[ERROR] Complex examples conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_advanced_python_file():
    """Test conversion of advanced_python.py file."""
    print("\n" + "=" * 60)
    print("Test: Advanced Python File")
    print("=" * 60)
    converter = PythonToRustConverter()
    examples_dir = Path(__file__).parent / 'examples'
    advanced_py = examples_dir / 'advanced_python.py'
    if not advanced_py.exists():
        print(f"[SKIP] Advanced Python file not found: {advanced_py}")
        return False
    try:
        python_code = advanced_py.read_text(encoding='utf-8')
        # Convert first portion for testing
        lines = python_code.split('\n')
        test_code = '\n'.join(lines[:150])  # First 150 lines
        rust_code = converter.convert_python_to_rust(test_code)
        print(f"\n[OK] Advanced Python file conversion successful")
        print(f"  Input: {advanced_py}")
        print(f"\nFirst 800 chars of Rust output:\n{'-' * 60}")
        print(rust_code[:800])
        return True
    except Exception as e:
        print(f"\n[ERROR] Advanced Python file conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests."""
    print("=" * 60)
    print("Python ↔ Rust Converter - Roundtrip Tests")
    print("=" * 60)
    tests = [
        ("Schema Loading", test_schema_loading),
        ("Simple Conversion", test_simple_conversion),
        ("Rust to Python", test_rust_to_python_conversion),
        ("Roundtrip Python→Rust→Python", test_roundtrip_python_to_rust_to_python),
        ("Roundtrip Rust→Python→Rust", test_roundtrip_rust_to_python_to_rust),
        ("Complex Class Conversion", test_complex_class_conversion),
        ("Generics Conversion", test_generics_conversion),
        ("Optional Types Conversion", test_optional_types_conversion),
        ("Error Handling Conversion", test_error_handling_conversion),
        ("Complex Examples File", test_complex_examples_file),
        ("Advanced Python File", test_advanced_python_file),
        ("File Conversion", test_file_conversion),
    ]
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n[ERROR] Test '{name}' crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    for name, result in results:
        status = "[OK]" if result else "[FAIL]"
        print(f"{status} {name}")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"\nPassed: {passed}/{total}")
    if passed == total:
        print("\n[SUCCESS] All tests passed!")
        return 0
    else:
        print("\n[WARNING] Some tests failed or were skipped")
        return 1
if __name__ == "__main__":
    import sys
    sys.exit(main())
