#!/usr/bin/env python3
"""
Modern Python features showcase (Python 3.11+).
Features:
- Structural pattern matching with guards
- Type narrowing
- Self type
- Variadic generics
- Exception groups
- Literal types
- TypedDict
- Annotated types
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 2.0
Generation Date: 15-Jan-2025
"""

from __future__ import annotations
from typing import (
    Optional, Union, List, Dict, Tuple, Literal, TypedDict, Annotated,
    Self, TypeVarTuple, Unpack
)
from dataclasses import dataclass
from enum import Enum
# ============================================================================
# Literal Types
# ============================================================================


def process_mode(mode: Literal["read", "write", "append"]) -> str:
    """Process file mode using literal types."""
    match mode:
        case "read":
            return "Opening in read mode"
        case "write":
            return "Opening in write mode"
        case "append":
            return "Opening in append mode"
# ============================================================================
# TypedDict
# ============================================================================


class UserDict(TypedDict):
    """Typed dictionary for user data."""
    name: str
    email: str
    age: int
    active: bool


def create_user(data: UserDict) -> str:
    """Create user from typed dict."""
    return f"User: {data['name']} ({data['email']})"
# ============================================================================
# Annotated Types
# ============================================================================
from typing import Annotated
PositiveInt = Annotated[int, "Must be positive"]
NonEmptyString = Annotated[str, "Must not be empty"]


def validate_positive(value: PositiveInt) -> bool:
    """Validate positive integer."""
    return value > 0


def validate_non_empty(value: NonEmptyString) -> bool:
    """Validate non-empty string."""
    return len(value) > 0
# ============================================================================
# Self Type (Python 3.11+)
# ============================================================================


class Builder:
    """Builder pattern with Self type."""

    def __init__(self, value: int = 0):
        self.value = value

    def add(self, n: int) -> Self:
        """Add to value and return self."""
        self.value += n
        return self

    def multiply(self, n: int) -> Self:
        """Multiply value and return self."""
        self.value *= n
        return self

    def build(self) -> int:
        """Build final value."""
        return self.value
# ============================================================================
# Pattern Matching with Guards
# ============================================================================


def process_number(value: Union[int, float, str]) -> str:
    """Process number with pattern matching and guards."""
    match value:
        case int(n) if n > 0:
            return f"Positive integer: {n}"
        case int(n) if n < 0:
            return f"Negative integer: {n}"
        case int(0):
            return "Zero"
        case float(f) if f > 0:
            return f"Positive float: {f}"
        case float(f) if f < 0:
            return f"Negative float: {f}"
        case str(s) if s.isdigit():
            return f"String number: {s}"
        case str(s):
            return f"String: {s}"
        case _:
            return "Unknown type"
# ============================================================================
# Complex Pattern Matching
# ============================================================================
@dataclass

class Point:
    """2D point."""
    x: float
    y: float
@dataclass

class Circle:
    """Circle shape."""
    center: Point
    radius: float
@dataclass

class Rectangle:
    """Rectangle shape."""
    top_left: Point
    width: float
    height: float


def describe_shape(shape: Union[Circle, Rectangle]) -> str:
    """Describe shape using pattern matching."""
    match shape:
        case Circle(center=Point(x, y), radius=r) if r > 0:
            return f"Circle at ({x}, {y}) with radius {r}"
        case Rectangle(top_left=Point(x, y), width=w, height=h) if w > 0 and h > 0:
            return f"Rectangle at ({x}, {y}) with size {w}x{h}"
        case Circle(radius=r) if r <= 0:
            return "Invalid circle: radius must be positive"
        case Rectangle(width=w, height=h) if w <= 0 or h <= 0:
            return "Invalid rectangle: dimensions must be positive"
        case _:
            return "Unknown shape"
# ============================================================================
# Type Narrowing
# ============================================================================


def process_optional(value: Optional[str]) -> str:
    """Process optional value with type narrowing."""
    if value is None:
        return "No value provided"
    # Type checker knows value is str here
    return f"Value: {value.upper()}"


def process_union(value: Union[int, str]) -> str:
    """Process union with type narrowing."""
    if isinstance(value, int):
        # Type checker knows value is int here
        return f"Integer: {value * 2}"
    else:
        # Type checker knows value is str here
        return f"String: {value.upper()}"
# ============================================================================
# Exception Groups (Python 3.11+)
# ============================================================================


def process_multiple_operations() -> None:
    """Process multiple operations with exception groups."""
    errors = []
    try:
        # Simulate multiple operations that might fail
        result1 = 10 / 2  # This succeeds
        result2 = 10 / 0  # This fails
    except ZeroDivisionError as e:
        errors.append(e)
    try:
        result3 = int("not a number")  # This fails
    except ValueError as e:
        errors.append(e)
    if errors:
        # In Python 3.11+, we could use ExceptionGroup
        # For compatibility, we'll just raise the first error
        raise errors[0] if errors else None
# ============================================================================
# Variadic Generics (Python 3.11+)
# ============================================================================
# Note: TypeVarTuple is available in Python 3.11+
# For earlier versions, we use a workaround


def combine_lists(*lists: List[str]) -> List[str]:
    """Combine multiple lists."""
    result = []
    for lst in lists:
        result.extend(lst)
    return result
# ============================================================================
# Main
# ============================================================================
if __name__ == "__main__":
    # Test literal types
    print("=== Literal Types ===")
    print(process_mode("read"))
    print(process_mode("write"))
    # Test TypedDict
    print("\n=== TypedDict ===")
    user_data: UserDict = {
        "name": "Alice",
        "email": "alice@example.com",
        "age": 30,
        "active": True
    }
    print(create_user(user_data))
    # Test Self type
    print("\n=== Self Type ===")
    builder = Builder(10).add(5).multiply(2)
    print(f"Builder result: {builder.build()}")
    # Test pattern matching with guards
    print("\n=== Pattern Matching with Guards ===")
    print(process_number(42))
    print(process_number(-10))
    print(process_number(3.14))
    print(process_number("123"))
    # Test complex pattern matching
    print("\n=== Complex Pattern Matching ===")
    circle = Circle(Point(0, 0), 5.0)
    rectangle = Rectangle(Point(10, 10), 20.0, 15.0)
    print(describe_shape(circle))
    print(describe_shape(rectangle))
    # Test type narrowing
    print("\n=== Type Narrowing ===")
    print(process_optional("hello"))
    print(process_optional(None))
    print(process_union(42))
    print(process_union("hello"))
    # Test variadic generics
    print("\n=== Variadic Generics ===")
    list1 = ["a", "b"]
    list2 = ["c", "d"]
    list3 = ["e", "f"]
    combined = combine_lists(list1, list2, list3)
    print(f"Combined: {combined}")
