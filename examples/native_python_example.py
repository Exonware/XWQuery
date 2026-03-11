#!/usr/bin/env python3
"""
Native Python Support Example - Demonstrates xwquery with native Python types
XWQuery works seamlessly with native Python data structures:
- dict (single object or dict of collections)
- list (of dicts, or simple lists)
- tuple
- Any combination of the above
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""

from exonware.xwquery import XWQuery
print("=" * 70)
print("XWQuery Native Python Support Examples")
print("=" * 70)
# Example 1: List of dictionaries (most common use case)
print("\n1. Querying a List of Dictionaries:")
users = [
    {"id": 1, "name": "Alice", "age": 30, "city": "NYC"},
    {"id": 2, "name": "Bob", "age": 25, "city": "LA"},
    {"id": 3, "name": "Charlie", "age": 35, "city": "NYC"},
    {"id": 4, "name": "David", "age": 28, "city": "Chicago"},
]
result = XWQuery.execute(
    "SELECT name, age FROM users WHERE age > 25",
    users
)
print(f"   Query: SELECT name, age FROM users WHERE age > 25")
print(f"   Result: {result.data}")
print(f"   Success: {result.success}")
# Example 2: Single dictionary
print("\n2. Querying a Single Dictionary:")
user = {"name": "Alice", "age": 30, "city": "NYC", "email": "alice@example.com"}
result = XWQuery.execute(
    "SELECT name, email FROM user WHERE age > 25",
    user
)
print(f"   Query: SELECT name, email FROM user WHERE age > 25")
print(f"   Result: {result.data}")
print(f"   Success: {result.success}")
# Example 3: Dictionary with named collections
print("\n3. Querying Dictionary with Named Collections:")
data = {
    "users": [
        {"id": 1, "name": "Alice", "age": 30},
        {"id": 2, "name": "Bob", "age": 25},
    ],
    "products": [
        {"id": 1, "name": "Laptop", "price": 999},
        {"id": 2, "name": "Phone", "price": 699},
    ]
}
result = XWQuery.execute(
    "SELECT name, age FROM users WHERE age > 25",
    data
)
print(f"   Query: SELECT name, age FROM users WHERE age > 25")
print(f"   Result: {result.data}")
print(f"   Success: {result.success}")
# Example 4: Simple list (numbers)
print("\n4. Querying a Simple List:")
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
result = XWQuery.execute(
    "SELECT * FROM numbers WHERE value > 5",
    numbers
)
print(f"   Query: SELECT * FROM numbers WHERE value > 5")
print(f"   Result: {result.data}")
print(f"   Success: {result.success}")
# Example 5: Tuple
print("\n5. Querying a Tuple:")
data_tuple = (
    {"name": "Alice", "score": 95},
    {"name": "Bob", "score": 87},
    {"name": "Charlie", "score": 92},
)
result = XWQuery.execute(
    "SELECT name, score FROM data_tuple WHERE score > 90",
    data_tuple
)
print(f"   Query: SELECT name, score FROM data_tuple WHERE score > 90")
print(f"   Result: {result.data}")
print(f"   Success: {result.success}")
# Example 6: Nested dictionaries
print("\n6. Querying Nested Dictionaries:")
nested_data = {
    "company": {
        "name": "Acme Corp",
        "employees": [
            {"id": 1, "name": "Alice", "department": "Engineering"},
            {"id": 2, "name": "Bob", "department": "Sales"},
        ]
    }
}
result = XWQuery.execute(
    "SELECT name, department FROM company.employees WHERE department = 'Engineering'",
    nested_data
)
print(f"   Query: SELECT name, department FROM company.employees WHERE department = 'Engineering'")
print(f"   Result: {result.data}")
print(f"   Success: {result.success}")
print("\n" + "=" * 70)
print("Key Points:")
print("- XWQuery automatically converts native Python types to XWNode internally")
print("- No need to manually convert data - just pass native Python structures")
print("- Works with dict, list, tuple, and combinations")
print("- Supports SQL queries on any native Python data structure")
print("=" * 70)
