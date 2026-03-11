#!/usr/bin/env python3
"""
Test suite for advanced Python ↔ Rust conversion examples.
Tests modern features:
- Pattern matching
- Enums
- Dataclasses
- Generics
- Async/await
- Error handling
- Context managers
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 2.0
Generation Date: 15-Jan-2025
"""

import sys
from pathlib import Path
# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from converter import PythonToRustConverter


def test_enum_conversion():
    """Test enum conversion."""
    print("=" * 60)
    print("Test: Enum Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
from enum import Enum, auto
class Status(Enum):
    PENDING = auto()
    PROCESSING = auto()
    COMPLETED = auto()
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Enum conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Enum conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_dataclass_conversion():
    """Test dataclass conversion."""
    print("\n" + "=" * 60)
    print("Test: Dataclass Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
from dataclasses import dataclass
@dataclass
class Point:
    x: float
    y: float
    def distance_to(self, other: Point) -> float:
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Dataclass conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Dataclass conversion failed: {e}")
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
from typing import TypeVar, Generic, List, Optional
T = TypeVar('T')
class Stack(Generic[T]):
    def __init__(self):
        self._items: List[T] = []
    def push(self, item: T) -> None:
        self._items.append(item)
    def pop(self) -> Optional[T]:
        return self._items.pop() if self._items else None
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


def test_pattern_matching_conversion():
    """Test pattern matching conversion."""
    print("\n" + "=" * 60)
    print("Test: Pattern Matching Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
def handle_status(status):
    match status:
        case "pending":
            return "Waiting"
        case "processing":
            return "Processing"
        case "completed":
            return "Done"
        case _:
            return "Unknown"
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Pattern matching conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Pattern matching conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_async_conversion():
    """Test async/await conversion."""
    print("\n" + "=" * 60)
    print("Test: Async/Await Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
import asyncio
async def fetch_data(url: str) -> dict:
    await asyncio.sleep(0.1)
    return {"url": url, "data": f"Data from {url}"}
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Async conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Async conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_result_type_conversion():
    """Test Result type conversion."""
    print("\n" + "=" * 60)
    print("Test: Result Type Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    python_code = """
def divide(a: float, b: float):
    if b == 0:
        raise ValueError("Division by zero")
    return a / b
"""
    try:
        rust_code = converter.convert_python_to_rust(python_code.strip())
        print(f"\nPython Code:\n{'-' * 60}")
        print(python_code.strip())
        print(f"\nRust Code:\n{'-' * 60}")
        print(rust_code)
        print("\n[OK] Result type conversion successful")
        return True
    except Exception as e:
        print(f"\n[ERROR] Result type conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_advanced_file_conversion():
    """Test conversion of advanced_python.py file."""
    print("\n" + "=" * 60)
    print("Test: Advanced Python File Conversion")
    print("=" * 60)
    converter = PythonToRustConverter()
    examples_dir = Path(__file__).parent
    advanced_py = examples_dir / 'advanced_python.py'
    if not advanced_py.exists():
        print(f"[SKIP] Advanced Python file not found: {advanced_py}")
        return False
    try:
        python_code = advanced_py.read_text(encoding='utf-8')
        # Only convert a portion for testing
        lines = python_code.split('\n')
        test_code = '\n'.join(lines[:100])  # First 100 lines
        rust_code = converter.convert_python_to_rust(test_code)
        print(f"\n[OK] Advanced file conversion successful")
        print(f"  Input: {advanced_py}")
        print(f"\nFirst 500 chars of Rust output:\n{'-' * 60}")
        print(rust_code[:500])
        return True
    except Exception as e:
        print(f"\n[ERROR] Advanced file conversion failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all advanced tests."""
    print("=" * 60)
    print("Advanced Python ↔ Rust Converter Tests")
    print("=" * 60)
    tests = [
        ("Enum Conversion", test_enum_conversion),
        ("Dataclass Conversion", test_dataclass_conversion),
        ("Generics Conversion", test_generics_conversion),
        ("Pattern Matching Conversion", test_pattern_matching_conversion),
        ("Async/Await Conversion", test_async_conversion),
        ("Result Type Conversion", test_result_type_conversion),
        ("Advanced File Conversion", test_advanced_file_conversion),
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
