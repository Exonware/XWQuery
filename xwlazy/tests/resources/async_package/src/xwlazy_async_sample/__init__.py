"""
Helper module installed dynamically during async benchmark runs.
"""

def ping() -> str:
    """Return a deterministic response so tests can assert availability."""
    return "pong"
