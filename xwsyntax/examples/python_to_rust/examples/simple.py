#!/usr/bin/env python3
"""
Simple Python examples for conversion to Rust.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 15-Jan-2025
"""


def add(a: int, b: int) -> int:
    """Add two integers."""
    return a + b


def greet(name: str) -> str:
    """Generate a greeting."""
    return f"Hello, {name}!"


def factorial(n: int) -> int:
    """Calculate factorial recursively."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)


def sum_list(numbers: list[int]) -> int:
    """Sum a list of integers."""
    total = 0
    for num in numbers:
        total += num
    return total
if __name__ == "__main__":
    print("Simple Python examples")
    print(f"add(2, 3) = {add(2, 3)}")
    print(f"greet('World') = {greet('World')}")
    print(f"factorial(5) = {factorial(5)}")
    print(f"sum_list([1, 2, 3, 4, 5]) = {sum_list([1, 2, 3, 4, 5])}")
