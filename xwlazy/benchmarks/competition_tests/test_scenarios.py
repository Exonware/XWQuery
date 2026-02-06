"""
#xwlazy/benchmarks/competition_tests/test_scenarios.py

Test scenario definitions for competition benchmarks.

Defines different test scenarios to evaluate lazy import libraries
under various conditions and loads.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 17-Nov-2025
"""

from typing import Any, Callable
from dataclasses import dataclass


@dataclass
class TestScenario:
    """Definition of a test scenario."""
    name: str
    description: str
    modules_to_import: list[str]
    expected_features: list[str]
    load_level: str  # "light", "medium", "heavy"


# Standard test scenarios
SCENARIOS = {
    "light_load": TestScenario(
        name="light_load",
        description="Single module import - minimal load",
        modules_to_import=["numpy"],  # Common library
        expected_features=["basic_import"],
        load_level="light",
    ),
    "medium_load": TestScenario(
        name="medium_load",
        description="Multiple module imports - moderate load",
        modules_to_import=["numpy", "pandas", "requests", "json", "os", "sys"],
        expected_features=["basic_import", "multiple_imports"],
        load_level="medium",
    ),
    "heavy_load": TestScenario(
        name="heavy_load",
        description="Many module imports - heavy load",
        modules_to_import=[
            "numpy", "pandas", "requests", "json", "os", "sys",
            "datetime", "collections", "itertools", "functools",
            "pathlib", "tempfile", "shutil", "subprocess", "threading",
        ],
        expected_features=["basic_import", "multiple_imports", "large_scale"],
        load_level="heavy",
    ),
    "nested_imports": TestScenario(
        name="nested_imports",
        description="Deep dependency chains",
        modules_to_import=["pandas"],  # Has many nested dependencies
        expected_features=["nested_dependencies"],
        load_level="medium",
    ),
    "missing_dependencies": TestScenario(
        name="missing_dependencies",
        description="Test auto-installation on missing imports",
        modules_to_import=["nonexistent_package_12345"],  # Won't exist
        expected_features=["auto_install"],
        load_level="light",
    ),
    "circular_dependencies": TestScenario(
        name="circular_dependencies",
        description="Test circular dependency handling",
        modules_to_import=["pandas"],  # Some packages have circular deps
        expected_features=["circular_dependency_handling"],
        load_level="medium",
    ),
}


def get_scenario(name: str) -> TestScenario:
    """Get a test scenario by name."""
    return SCENARIOS.get(name)


def list_scenarios() -> list[str]:
    """List all available scenario names."""
    return list(SCENARIOS.keys())


def create_custom_scenario(
    name: str,
    modules: list[str],
    description: str = None,
    load_level: str = "medium",
) -> TestScenario:
    """Create a custom test scenario."""
    return TestScenario(
        name=name,
        description=description or f"Custom scenario: {name}",
        modules_to_import=modules,
        expected_features=[],
        load_level=load_level,
    )
