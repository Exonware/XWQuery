#!/usr/bin/env python3
"""
Advanced Python examples using modern features (Python 3.10+).
Features demonstrated:
- Pattern matching (match/case)
- Type unions and optional types
- Dataclasses
- Enums
- Async/await
- Generics
- Context managers
- Type guards
- Protocol types
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 2.0
Generation Date: 15-Jan-2025
"""

from __future__ import annotations
from typing import Optional, Union, List, Dict, Protocol, TypeVar, Generic, Callable
from dataclasses import dataclass, field
from enum import Enum, auto
from contextlib import contextmanager
import asyncio
# ============================================================================
# Enums
# ============================================================================


class Status(Enum):
    """Status enumeration."""
    PENDING = auto()
    PROCESSING = auto()
    COMPLETED = auto()
    FAILED = auto()


class HttpMethod(Enum):
    """HTTP method enumeration."""
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"
# ============================================================================
# Dataclasses
# ============================================================================
@dataclass

class Point:
    """2D point with x and y coordinates."""
    x: float
    y: float

    def distance_to(self, other: Point) -> float:
        """Calculate distance to another point."""
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5
@dataclass

class User:
    """User data class."""
    name: str
    email: str
    age: int
    status: Status = Status.PENDING
    tags: List[str] = field(default_factory=list)

    def is_active(self) -> bool:
        """Check if user is active."""
        return self.status == Status.COMPLETED
# ============================================================================
# Generics
# ============================================================================
T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')


class Stack(Generic[T]):
    """Generic stack implementation."""

    def __init__(self) -> None:
        self._items: List[T] = []

    def push(self, item: T) -> None:
        """Push item onto stack."""
        self._items.append(item)

    def pop(self) -> Optional[T]:
        """Pop item from stack."""
        return self._items.pop() if self._items else None

    def peek(self) -> Optional[T]:
        """Peek at top item without removing."""
        return self._items[-1] if self._items else None

    def is_empty(self) -> bool:
        """Check if stack is empty."""
        return len(self._items) == 0


class Cache(Generic[K, V]):
    """Generic key-value cache."""

    def __init__(self, max_size: int = 100) -> None:
        self._data: Dict[K, V] = {}
        self._max_size = max_size

    def get(self, key: K) -> Optional[V]:
        """Get value by key."""
        return self._data.get(key)

    def set(self, key: K, value: V) -> None:
        """Set key-value pair."""
        if len(self._data) >= self._max_size:
            # Remove oldest entry (simplified)
            first_key = next(iter(self._data))
            del self._data[first_key]
        self._data[key] = value
# ============================================================================
# Protocols (Structural Typing)
# ============================================================================


class Drawable(Protocol):
    """Protocol for drawable objects."""

    def draw(self) -> str:
        """Draw the object."""
        ...


class Renderable(Protocol):
    """Protocol for renderable objects."""

    def render(self) -> str:
        """Render the object."""
        ...
# ============================================================================
# Pattern Matching (Python 3.10+)
# ============================================================================


def handle_status(status: Status) -> str:
    """Handle status using pattern matching."""
    match status:
        case Status.PENDING:
            return "Waiting to start"
        case Status.PROCESSING:
            return "Currently processing"
        case Status.COMPLETED:
            return "Successfully completed"
        case Status.FAILED:
            return "Operation failed"
        case _:
            return "Unknown status"


def process_http_request(method: HttpMethod, path: str) -> Dict[str, Union[str, int]]:
    """Process HTTP request using pattern matching."""
    match method:
        case HttpMethod.GET:
            return {"action": "read", "path": path, "status": 200}
        case HttpMethod.POST:
            return {"action": "create", "path": path, "status": 201}
        case HttpMethod.PUT:
            return {"action": "update", "path": path, "status": 200}
        case HttpMethod.DELETE:
            return {"action": "delete", "path": path, "status": 204}
        case _:
            return {"action": "unknown", "path": path, "status": 405}


def parse_value(value: Union[str, int, float, bool, None]) -> str:
    """Parse value using pattern matching with type guards."""
    match value:
        case None:
            return "null"
        case bool(b):
            return "true" if b else "false"
        case int(i):
            return f"integer: {i}"
        case float(f):
            return f"float: {f}"
        case str(s):
            return f"string: {s}"
        case _:
            return "unknown type"
# ============================================================================
# Async/Await
# ============================================================================
async def fetch_data(url: str) -> Dict[str, str]:
    """Simulate async data fetching."""
    await asyncio.sleep(0.1)  # Simulate network delay
    return {"url": url, "data": f"Data from {url}"}
async def process_items(items: List[str]) -> List[Dict[str, str]]:
    """Process items asynchronously."""
    tasks = [fetch_data(item) for item in items]
    results = await asyncio.gather(*tasks)
    return results
async def main_async() -> None:
    """Main async function."""
    items = ["item1", "item2", "item3"]
    results = await process_items(items)
    for result in results:
        print(f"Processed: {result}")
# ============================================================================
# Error Handling with Result-like Pattern
# ============================================================================
@dataclass

class Result(Generic[T, E]):
    """Result type for error handling."""
    value: Optional[T] = None
    error: Optional[E] = None
    is_ok: bool = True
    @classmethod

    def ok(cls, value: T) -> Result[T, E]:
        """Create successful result."""
        return cls(value=value, is_ok=True)
    @classmethod

    def err(cls, error: E) -> Result[T, E]:
        """Create error result."""
        return cls(error=error, is_ok=False)

    def unwrap(self) -> T:
        """Unwrap value or raise error."""
        if self.is_ok and self.value is not None:
            return self.value
        raise ValueError(f"Result is error: {self.error}")


def divide(a: float, b: float) -> Result[float, str]:
    """Divide with Result type."""
    if b == 0:
        return Result.err("Division by zero")
    return Result.ok(a / b)
# ============================================================================
# Context Managers
# ============================================================================
@contextmanager

def managed_resource(name: str):
    """Context manager for resource management."""
    print(f"Acquiring resource: {name}")
    try:
        yield name
    finally:
        print(f"Releasing resource: {name}")


class DatabaseConnection:
    """Database connection with context manager."""

    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self.connected = False

    def __enter__(self):
        print(f"Connecting to {self.host}:{self.port}")
        self.connected = True
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Disconnecting from {self.host}:{self.port}")
        self.connected = False
        return False

    def query(self, sql: str) -> List[Dict[str, str]]:
        """Execute query."""
        if not self.connected:
            raise RuntimeError("Not connected to database")
        return [{"result": "data"}]
# ============================================================================
# Type Guards
# ============================================================================


def is_string(value: Union[str, int]) -> bool:
    """Type guard for string."""
    return isinstance(value, str)


def process_union(value: Union[str, int]) -> str:
    """Process union type with type guard."""
    if is_string(value):
        return f"String: {value.upper()}"
    else:
        return f"Integer: {value * 2}"
# ============================================================================
# Higher-Order Functions
# ============================================================================


def apply_function(func: Callable[[int], int], value: int) -> int:
    """Apply function to value."""
    return func(value)


def create_multiplier(factor: int) -> Callable[[int], int]:
    """Create multiplier function."""
    return lambda x: x * factor
# ============================================================================
# Main
# ============================================================================
if __name__ == "__main__":
    # Test enums
    print("=== Enums ===")
    status = Status.PROCESSING
    print(f"Status: {status}, Value: {status.value}")
    # Test dataclasses
    print("\n=== Dataclasses ===")
    p1 = Point(0, 0)
    p2 = Point(3, 4)
    print(f"Distance: {p1.distance_to(p2)}")
    user = User("Alice", "alice@example.com", 30, Status.COMPLETED, ["admin", "user"])
    print(f"User active: {user.is_active()}")
    # Test generics
    print("\n=== Generics ===")
    stack = Stack[int]()
    stack.push(1)
    stack.push(2)
    print(f"Stack pop: {stack.pop()}")
    cache = Cache[str, int]()
    cache.set("key1", 100)
    print(f"Cache get: {cache.get('key1')}")
    # Test pattern matching
    print("\n=== Pattern Matching ===")
    print(handle_status(Status.COMPLETED))
    print(process_http_request(HttpMethod.POST, "/api/users"))
    print(parse_value(42))
    print(parse_value("hello"))
    # Test Result type
    print("\n=== Result Type ===")
    result1 = divide(10, 2)
    print(f"Divide result: {result1.value if result1.is_ok else result1.error}")
    result2 = divide(10, 0)
    print(f"Divide error: {result2.error if not result2.is_ok else result2.value}")
    # Test context managers
    print("\n=== Context Managers ===")
    with managed_resource("file.txt") as resource:
        print(f"Using resource: {resource}")
    with DatabaseConnection("localhost", 5432) as db:
        results = db.query("SELECT * FROM users")
        print(f"Query results: {results}")
    # Test async
    print("\n=== Async ===")
    asyncio.run(main_async())
    # Test higher-order functions
    print("\n=== Higher-Order Functions ===")
    double = create_multiplier(2)
    print(f"Double 5: {apply_function(double, 5)}")
