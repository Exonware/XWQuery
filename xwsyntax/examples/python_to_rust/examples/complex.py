#!/usr/bin/env python3
"""
Complex Python examples for conversion to Rust.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 15-Jan-2025
"""

from typing import Optional, List, Dict


class Person:
    """Simple person class."""

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def introduce(self) -> str:
        """Return introduction string."""
        return f"I'm {self.name}, {self.age} years old."

    def is_adult(self) -> bool:
        """Check if person is an adult."""
        return self.age >= 18


class Calculator:
    """Simple calculator class."""

    def __init__(self):
        self.history: List[float] = []

    def add(self, a: float, b: float) -> float:
        """Add two numbers."""
        result = a + b
        self.history.append(result)
        return result

    def subtract(self, a: float, b: float) -> float:
        """Subtract two numbers."""
        result = a - b
        self.history.append(result)
        return result

    def get_history(self) -> List[float]:
        """Get calculation history."""
        return self.history.copy()


def find_person(people: List[Person], name: str) -> Optional[Person]:
    """Find a person by name."""
    for person in people:
        if person.name == name:
            return person
    return None


def group_by_age(people: List[Person]) -> Dict[int, List[Person]]:
    """Group people by age."""
    groups: Dict[int, List[Person]] = {}
    for person in people:
        if person.age not in groups:
            groups[person.age] = []
        groups[person.age].append(person)
    return groups
if __name__ == "__main__":
    # Create some people
    alice = Person("Alice", 25)
    bob = Person("Bob", 17)
    charlie = Person("Charlie", 30)
    print(f"{alice.name} is adult: {alice.is_adult()}")
    print(f"{bob.name} is adult: {bob.is_adult()}")
    # Use calculator
    calc = Calculator()
    print(f"10 + 5 = {calc.add(10, 5)}")
    print(f"10 - 3 = {calc.subtract(10, 3)}")
    print(f"History: {calc.get_history()}")
    # Find person
    people = [alice, bob, charlie]
    found = find_person(people, "Bob")
    if found:
        print(found.introduce())
    # Group by age
    groups = group_by_age(people)
    print(f"Groups: {[(age, len(people)) for age, people in groups.items()]}")
