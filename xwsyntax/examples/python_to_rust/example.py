#!/usr/bin/env python3
"""
Example Python code to convert to Rust.
This file demonstrates a simple Python function that can be
converted to Rust using xwsyntax.
"""

def calculate_sum(numbers: list[int]) -> int:
    """Calculate the sum of a list of integers."""
    total = 0
    for num in numbers:
        total += num
    return total


def greet(name: str, age: int = 0) -> str:
    """Generate a greeting message."""
    if age > 0:
        return f"Hello, {name}! You are {age} years old."
    return f"Hello, {name}!"


class Person:
    """Simple person class."""

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def introduce(self) -> str:
        """Return introduction string."""
        return f"I'm {self.name}, {self.age} years old."
