# eXonware Testing Guide

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Email:** connect@exonware.com
**Version:** 0.0.1
**Generation Date:** 11-Oct-2025

---

## 📋 AI-Friendly Document

**This document is designed for both human developers and AI assistants.** All testing guidelines, rules, and principles must be followed for ANY test implementation - not just test code, but runners, fixtures, markers, and all test-related deliverables. Use this as your comprehensive testing quality standard.

**Related Documents:**
- **[GUIDE_MASTER.md](GUIDE_MASTER.md)** - Master standards and shared constraints
- **[GUIDE_DEV.md](GUIDE_DEV.md)** - Core development philosophy and standards
- This document (GUIDE_TEST.md) - Detailed testing implementation
- **[GUIDE_DOCS.md](GUIDE_DOCS.md)** - Documentation standards and best practices

---

## 📊 Overview

This document standardizes pytest-based testing across all eXonware libraries (`xwsystem`, `xwnode`, `xwdata`, `xwschema`, `xwaction`, `xwentity`). It defines a **four-layer hierarchical testing strategy** with runnable commands, shared fixtures, markers, and CI integration�optimized for fast failure diagnosis and 80/20 coverage.

**Alignment with GUIDE_DEV.md:**
This testing strategy directly implements the Testing Strategy section from GUIDE_DEV.md with full architectural details, runner implementations, and practical examples.

### Testing Philosophy: The 80/20 Rule

**Purpose:** Tests should provide maximum value with minimal effort. Following the **Test Pyramid**, we focus on:

- **20% Core tests** cover **80% of critical functionality** (high-value, fast-running)
- **Unit tests** verify individual components in isolation
- **Integration tests** validate cross-module scenarios and real-world flows

**Quick Start:**
```bash
# Run all tests
python tests/runner.py

# Run specific layer
python tests/runner.py --core # Fast, high-value tests
python tests/runner.py --unit # Component tests
python tests/runner.py --integration # End-to-end scenarios
```

---

## 📁 Directory Structure

All eXonware libraries follow this standard test structure with **hierarchical runners**:

```
library-name/
+- src/
� +- exonware/
� +- library_name/
� +- contracts.py # Enums and interfaces
� +- errors.py # Error classes
� +- base.py # Abstract classes
� +- [modules]/ # Feature modules
�
+- tests/
� +- __init__.py
� +- conftest.py # Shared fixtures and hooks
� +- runner.py # Main test runner (orchestrates all sub-runners)
� +- verify_installation.py # Installation verification
� �
� +- 0.core/ # 20% tests for 80% value
� � +- __init__.py
� � +- conftest.py # Core-specific fixtures
� � +- runner.py # Core test runner
� � +- data/ # Test data (inputs, expected, fixtures)
� � � +- inputs/
� � � +- expected/
� � � +- fixtures/
� � +- test_core_*.py # Core functionality tests
� �
� +- 1.unit/ # Mirrors src/ structure
� � +- __init__.py
� � +- conftest.py # Unit-specific fixtures
� � +- runner.py # Unit test runner (orchestrates module runners)
� � +- module1_tests/ # Mirrors src/exonware/library_name/module1/
� � � +- __init__.py
� � � +- conftest.py
� � � +- runner.py # Module test runner
� � � +- test_*.py
� � +- module2_tests/
� � +- __init__.py
� � +- runner.py # Module test runner
� � +- test_*.py
� �
� +- 2.integration/ # Scenario/flow-based
� � +- __init__.py
� � +- conftest.py # Integration-specific fixtures
� � +- runner.py # Integration test runner
� � +- scenarios/ # Real-world scenarios
� � � +- test_scenario_*.py
� � +- resources/ # Docker-compose, mocks, large datasets
� � +- test_end_to_end.py
� �
� +- 3.advance/ # Advanced quality tests (OPTIONAL until v1.0.0)
� +- __init__.py
� +- conftest.py # Advance-specific fixtures
� +- runner.py # Advance test runner
� +- test_security.py # Security excellence tests
� +- test_usability.py # Usability excellence tests
� +- test_maintainability.py # Maintainability excellence tests
� +- test_performance.py # Performance excellence tests
� +- test_extensibility.py # Extensibility excellence tests
�
+- pytest.ini # Pytest configuration
```

### Structure Guidelines

**1. Core Tests (`tests/0.core/`):**
- High-value integration tests covering critical paths
- Fast execution (< 30 seconds total)
- Fails fast on fundamental issues
- Includes performance-critical operations
- Data organized in `data/inputs/`, `data/expected/`, `data/fixtures/`
- **Has own runner**: `tests/0.core/runner.py`

**2. Unit Tests (`tests/1.unit/`):**
- **Mirror source structure**: `tests/1.unit/module_name_tests/` mirrors `src/exonware/library_name/module_name/`
- Test individual classes, functions, and methods
- Use fakes/mocks; no external services
- Fast execution (milliseconds per test)
- Each module has its own subdirectory with `conftest.py` for module-specific fixtures
- **Hierarchical runners**:
 - Main unit runner: `tests/1.unit/runner.py` (orchestrates all module runners)
 - Module runners: `tests/1.unit/module_name_tests/runner.py` (runs module-specific tests)

**3. Integration Tests (`tests/2.integration/`):**
- Cross-module scenario tests
- Real wiring with ephemeral resources
- May use Docker, local services
- Comprehensive cleanup/teardown
- Organized by scenarios and resources
- **Has own runner**: `tests/2.integration/runner.py`

**4. Advance Tests (`tests/3.advance/`) - OPTIONAL until v1.0.0:**
- **Production excellence validation** against eXonware's 5 core priorities
- Tests comprehensive quality attributes beyond basic functionality
- **Activated at v1.0.0** when moving to ready status
- **Has own runner**: `tests/3.advance/runner.py`
- **Five test categories aligned with eXonware priorities**:
 1. **Security** (`test_security.py`) - OWASP Top 10, defense-in-depth, input validation
 2. **Usability** (`test_usability.py`) - API intuitiveness, documentation, error messages
 3. **Maintainability** (`test_maintainability.py`) - Code quality, modularity, refactorability
 4. **Performance** (`test_performance.py`) - Benchmarks, memory usage, scalability
 5. **Extensibility** (`test_extensibility.py`) - Plugin support, hooks, customization

---

## 🏷️ Naming & Discovery

### Pytest Discovery Rules

**Files:**
- Test files: `test_*.py` or `*_test.py`
- Placed anywhere under `tests/` directory

**Functions:**
- Test functions: `test_*` (lowercase with underscores)
- Async tests: `async def test_*` (requires pytest-asyncio)

**Classes:**
- Test classes: `Test*` (no `__init__` method)
- Example: `class TestHashMapStrategy:`

**Configuration (pytest.ini):**
```ini
[tool:pytest]
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

### Naming Conventions

**Test Files:**
- Core: `test_core_<feature>.py` (e.g., `test_core_xwsystem_serialization.py`)
- Unit: `test_<module_name>.py` (e.g., `test_hash_map_strategy.py`)
- Integration: `test_<scenario>.py` (e.g., `test_end_to_end.py`)

**Test Functions:**
- Descriptive: `test_<action>_<expected_outcome>`
- Example: `test_create_from_dict`, `test_o1_get_operation`, `test_nested_path_navigation`

**Test Classes:**
- Group related tests: `class TestHashMapStrategyCore:`, `class TestHashMapStrategyPerformance:`

**Use pytest.param for clarity:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
@pytest.mark.parametrize("data,expected", [
    pytest.param({"key": "value"}, "value", id="simple_dict"),
    pytest.param([1, 2, 3], 3, id="list_length"),
], ids=["custom_id_1", "custom_id_2"])
def test_data_handling(data, expected):
    assert len(data) == expected
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
test.each([
    { data: { key: "value" }, expected: "value", id: "simple_dict" },
    { data: [1, 2, 3], expected: 3, id: "list_length" },
])('data handling: $id', ({ data, expected }) => {
    expect(Object.keys(data).length || data.length).toBe(expected);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
func TestDataHandling(t *testing.T) {
    tests := []struct {
        name     string
        data     interface{}
        expected int
    }{
        {"simple_dict", map[string]string{"key": "value"}, 1},
        {"list_length", []int{1, 2, 3}, 3},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            var length int
            switch v := tt.data.(type) {
            case map[string]string:
                length = len(v)
            case []int:
                length = len(v)
            }
            if length != tt.expected {
                t.Errorf("Expected %d, got %d", tt.expected, length)
            }
        })
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
#[test]
fn test_data_handling() {
    let test_cases = vec![
        (serde_json::json!({"key": "value"}), 1, "simple_dict"),
        (serde_json::json!([1, 2, 3]), 3, "list_length"),
    ];
    
    for (data, expected, id) in test_cases {
        let length = match data {
            serde_json::Value::Object(_) => data.as_object().unwrap().len(),
            serde_json::Value::Array(arr) => arr.len(),
            _ => 0,
        };
        assert_eq!(length, expected, "Failed for {}", id);
    }
}
```

</details>

---

## 🎯 Markers & Selection

### Standard Markers

All eXonware libraries use a consistent marker naming scheme:

```ini
[tool:pytest]
markers =
 <library>_core: Fast, high-value core checks (80/20)
 <library>_unit: Fine-grained per-module tests
 <library>_integration: Cross-module scenario tests
 <library>_security: Security-specific tests (PRIORITY #1)
 <library>_performance: Performance and benchmarking tests
```

### Library-Specific Markers

**xwsystem:**
```ini
markers =
 xwsystem_core: Core functionality and integration tests
 xwsystem_unit: Unit tests for individual components
 xwsystem_integration: Integration tests across modules
 xwsystem_advance: Advance quality tests (v1.0.0+)
 xwsystem_security: Security excellence tests (Priority #1)
 xwsystem_usability: Usability excellence tests (Priority #2)
 xwsystem_maintainability: Maintainability excellence tests (Priority #3)
 xwsystem_performance: Performance excellence tests (Priority #4)
 xwsystem_extensibility: Extensibility excellence tests (Priority #5)
 xwsystem_serialization: Serialization format tests
```

**xwnode:**
```ini
markers =
 xwnode_core: Core functionality and integration tests
 xwnode_unit: Unit tests for individual components
 xwnode_integration: Integration tests across modules
 xwnode_advance: Advance quality tests (v1.0.0+)
 xwnode_security: Security excellence tests (Priority #1)
 xwnode_usability: Usability excellence tests (Priority #2)
 xwnode_maintainability: Maintainability excellence tests (Priority #3)
 xwnode_performance: Performance excellence tests (Priority #4)
 xwnode_extensibility: Extensibility excellence tests (Priority #5)
 xwnode_node_strategy: Node strategy specific tests
 xwnode_edge_strategy: Edge strategy specific tests
 xwnode_query_strategy: Query strategy specific tests
```

**xwdata, xwschema, xwaction, xwentity:**
- Follow same pattern with library prefix (e.g., `xdata_core`, `xschema_unit`, `xaction_security`)
- All libraries include the 5 advance markers aligned with eXonware priorities

### pytest.ini Configuration

**⚠️ IMPORTANT: This configuration follows error-fixing best practices**

```ini
[tool:pytest]
# Test discovery and execution
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*

# Async support
asyncio_mode = auto

# Markers for test categorization (aligned with GUIDE_DEV.md priorities)
markers =
 xwsystem_core: Core functionality and integration tests
 xwsystem_unit: Unit tests for individual components
 xwsystem_integration: Integration tests across modules
 xwsystem_advance: Advance quality tests (v1.0.0+)
 xwsystem_security: Security excellence tests (Priority #1)
 xwsystem_usability: Usability excellence tests (Priority #2)
 xwsystem_maintainability: Maintainability excellence tests (Priority #3)
 xwsystem_performance: Performance excellence tests (Priority #4)
 xwsystem_extensibility: Extensibility excellence tests (Priority #5)
 xwsystem_serialization: Serialization format tests

# Test output configuration
# ⚠️ CRITICAL: Do NOT use --disable-warnings or --maxfail=10
# These flags hide real problems and violate root cause fixing principles
addopts =
 -v # Verbose: show all test details
 --tb=short # Short traceback: concise but informative
 --strict-markers # Enforce marker discipline
 -x # Stop on FIRST failure (fast feedback)
 # --maxfail=1 is same as -x (alternative syntax)

# Coverage configuration (if pytest-cov is installed)
# addopts =
# -v
# --tb=short
# --strict-markers
# -x
# --cov=exonware.<library_name>
# --cov-report=term-missing
# --cov-report=html

# ❌ FORBIDDEN OPTIONS - DO NOT ADD THESE:
# --disable-warnings # Hides real problems!
# --maxfail=10 # Continues past failures!
# --tb=no # Hides debugging info!
# -q / --quiet # Hides important output!
# -p no:warnings # Disables warnings plugin!
# --ignore=path # Skips tests instead of fixing!

# ✅ ALLOWED WARNING FILTERS (specific only):
# filterwarnings =
# error::DeprecationWarning # Treat specific warnings as errors
# error::PendingDeprecationWarning
# Only use to PROMOTE warnings to errors, never to ignore them!
```

**Configuration Philosophy:**

- ✅ **Verbose output** (`-v`) - See what's actually happening
- ✅ **Stop on first failure** (`-x` or `--maxfail=1`) - Fast feedback, no cascading failures
- ✅ **Show warnings** (no `--disable-warnings`) - Warnings indicate problems
- ✅ **Show tracebacks** (`--tb=short`) - Need info to debug
- ✅ **Strict markers** (`--strict-markers`) - Prevent typos
- ⚠️ **Never hide problems** - Fix them instead!

### Running Tests by Marker

```bash
# Run all tests
pytest

# Core tests only (fast, high-value)
pytest -m xwsystem_core -q

# Security tests only (PRIORITY #1)
pytest -m xwsystem_security -vv

# Unit tests for specific module
pytest tests/unit/serialization_tests/ -q

# Integration tests with keyword filter
pytest tests/integration/ -k "ingest and not slow"

# Performance tests
pytest -m xwsystem_performance --benchmark-only

# Exclude slow tests
pytest -m "not slow"
```

---

## 🚀 Runners & Scripts

All eXonware libraries use a **hierarchical runner architecture** where the main runner orchestrates specialized sub-runners.

### Runner Architecture

**Design Philosophy:**
- **Hierarchical structure** - Main runner orchestrates layer runners
- **Single entry point** - `tests/runner.py` is the main orchestrator
- **Layer runners** - Each test layer has its own runner
- **Module runners** - Unit test modules have individual runners
- **Connected execution** - Runners call sub-runners for comprehensive testing
- **Fast failure detection** with `--maxfail=1`
- **Clear output** with progress indicators

**Runner Hierarchy:**
```
tests/runner.py # Main orchestrator
+- tests/0.core/runner.py # Core test runner
+- tests/1.unit/runner.py # Unit test orchestrator
� +- tests/1.unit/module1_tests/runner.py # Module 1 runner
� +- tests/1.unit/module2_tests/runner.py # Module 2 runner
� +- tests/1.unit/moduleN_tests/runner.py # Module N runner
+- tests/2.integration/runner.py # Integration test runner
+- tests/3.advance/runner.py # Advance test runner (v1.0.0+)
```

### Reusable Test Runner Utilities

**Location:** `xwsystem/src/exonware/xwsystem/utils/test_runner.py`

To minimize code duplication and maximize maintainability, all test runners should use the reusable utilities from xwsystem:

**Available Utilities:**

1. **`TestRunner` class** - Complete test runner with auto-configuration
2. **`DualOutput` class** - Terminal + Markdown output with colors/emojis
3. **`format_path()`** - Format paths to show full absolute paths
4. **`print_header()`** - Print formatted headers
5. **`print_section()`** - Print formatted sections
6. **`print_status()`** - Print success/failure status
7. **`run_pytest()`** - Run pytest with standard options

**Benefits:**
- ✅ **Consistent output** across all libraries
- ✅ **Colored terminal output** with emojis
- ✅ **Full absolute paths** for clarity
- ✅ **Markdown generation** built-in
- ✅ **Graceful fallback** if xwsystem not available
- ✅ **Minimal code** in runners

**Usage Example (Layer Runner):**

```python
#!/usr/bin/env python3
"""Test runner for library layer."""

import sys
from pathlib import Path

# Add src to Python path
src_path = Path(__file__).parent.parent.parent / "src"
sys.path.insert(0, str(src_path))

# Import reusable utilities
try:
 from exonware.xwsystem.utils.test_runner import TestRunner
 USE_XWSYSTEM_UTILS = True
except ImportError:
 USE_XWSYSTEM_UTILS = False
 # Fallback implementation here

def main():
 """Run tests using reusable utilities."""
 if USE_XWSYSTEM_UTILS:
 runner = TestRunner(
 library_name="xwnode",
 layer_name="0.core",
 description="Core Tests - Fast, High-Value Checks",
 test_dir=Path(__file__).parent,
 markers=["xwnode_core"]
)
 return runner.run()
 else:
 # Simple fallback without colors
 # ... minimal implementation ...
 pass

if __name__ == "__main__":
 sys.exit(main())
```

**Usage Example (Main Orchestrator):**

```python
#!/usr/bin/env python3
"""Main test runner - orchestrates layer runners."""

import sys
import subprocess
from pathlib import Path
from datetime import datetime
from io import StringIO

# Import reusable utilities
try:
 from exonware.xwsystem.utils.test_runner import (
 DualOutput,
 format_path,
 print_header,
 print_section,
 print_status
)
 USE_XWSYSTEM_UTILS = True
except ImportError:
 USE_XWSYSTEM_UTILS = False
 # Minimal fallback implementations

def main():
     """Orchestrate all test layers."""
     test_dir = Path(__file__).parent
     reports_dir = test_dir.parent / "docs" / "tests"
     reports_dir.mkdir(parents=True, exist_ok=True)
     timestamp = datetime.now().strftime("%Y%m%d_%H%M")
     output_file = reports_dir / f"TEST_{timestamp}_SUMMARY.md"
     output = DualOutput(output_file)
 
     # Use reusable utilities
     print_header("Test Runner - Hierarchical Orchestrator", output)
 
     output.print(f"Test Directory: {format_path(test_dir)}",
         f"**Test Directory:** `{format_path(test_dir)}`",
         color='info', emoji='ℹ️')
 
     # Run sub-runners...
     # ... orchestration code ...
 
     # Final status
     print_status(all_passed, "ALL TESTS PASSED", output)
 
     if USE_XWSYSTEM_UTILS:
         output.save({'library': 'xwnode', 'layer': 'main', 'description': 'Main orchestrator run'})
     else:
         output.save()
 
 if __name__ == "__main__":
     main()
```

**Key Features:**

1. **Full Absolute Paths:**
 - All paths displayed using `format_path()` show complete absolute paths
 - Example: `D:\OneDrive\DEV\exonware\xwnode\tests\0.core`
 - Eliminates confusion about which directory tests are running in

2. **Colored Output:**
 - Success messages in green with ✅ emoji
 - Error messages in red with ❌ emoji
 - Info messages in blue with ℹ️ emoji
 - Warning messages in yellow with ⚠️ emoji
 - Headers and sections with proper formatting

3. **Dual Output:**
 - Terminal: Colored output with emojis for immediate feedback
 - Markdown: Clean, copy-paste ready format without ANSI codes
 - Both outputs generated simultaneously

4. **Graceful Fallback:**
 - If xwsystem not installed, runners still work
 - Fallback uses basic print with emojis
 - No dependencies required for basic functionality

**Implementation Guidelines:**

- ✅ **Always use** reusable utilities for new runners
- ✅ **Always show** full absolute paths using `format_path()`
- ✅ **Always include** emojis in output for visual clarity
- ✅ **Always provide** fallback implementation
- ✅ **Main runner persists** a single Markdown summary in `docs/tests/`; layer runners never write files
- ✅ **Show pytest summary line** with `===` signs in color (green for passed, red for failed)
- ✅ **No duplicate information** - show output once, not repeated
- ✅ **UTF-8 encoding** - Handle emojis gracefully on Windows (see Windows Console UTF-8 Configuration below)
- ✅ **Minimal code** - Use reusable utilities to keep runners short and maintainable
- ❌ **Never duplicate** runner code - use utilities
- ❌ **Never hide** paths - always show full absolute paths
- ❌ **Never repeat** output information - show once with colors

### Windows Console UTF-8 Configuration

**⚠️ CRITICAL for Windows: This configuration is REQUIRED at the start of every runner script**

Windows console does not use UTF-8 encoding by default, which causes:
- ❌ Emojis to display as `?` or crash with encoding errors
- ❌ Test output with Unicode characters to fail
- ❌ Markdown files with emojis to have corruption

**Solution: Add this code at the beginning of every runner script (after imports, before main logic):**

```python
#!/usr/bin/env python3
"""Runner script with proper UTF-8 encoding for Windows."""

import sys
from pathlib import Path

# ⚠️ CRITICAL: Configure UTF-8 encoding for Windows console
# This MUST be at the top, before any print statements with emojis
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass  # If reconfiguration fails, continue with default encoding

# Now safe to use emojis and Unicode
print("✅ UTF-8 encoding configured successfully")
print("🚀 Runner starting...")
```

**Why this is needed:**
1. **Emoji support** - ✅ ❌ ⚠️ ℹ️ 🔧 display correctly
2. **Unicode data** - Multilingual characters render properly
3. **Test reliability** - Prevents encoding-related test failures
4. **Cross-platform** - Works on Windows, Linux, macOS
5. **Markdown output** - Ensures generated files have proper encoding

**Where to add this:**
- ✅ Main runner (`tests/runner.py`)
- ✅ All layer runners (`tests/0.core/runner.py`, `tests/1.unit/runner.py`, etc.)
- ✅ All module runners (`tests/1.unit/module_tests/runner.py`)
- ✅ Any script that prints emojis or Unicode to console

**Without this configuration:**
```
# Windows console output WITHOUT UTF-8 config:
? UTF-8 encoding test
? Tests PASSED
? Results: 100%

# Windows console output WITH UTF-8 config:
✅ UTF-8 encoding test
✅ Tests PASSED
✅ Results: 100%
```

**Output Format Guidelines:**

1. **Summary Line Display:**
 - Extract pytest's native summary line with `===` signs
 - Example: `============== 79 passed, 113 deselected, 101 warnings in 1.17s ===============`
 - Color the entire line: Green (?) for all passed, Red for any failures
 - Display as single line separator - no additional formatting

2. **Path Display:**
 - Always show full absolute paths
 - Example: `D:\OneDrive\DEV\exonware\xwnode\tests\0.core`
 - Use `format_path()` utility function
 - Include in both terminal and Markdown output

3. **Color Scheme:**
 - ✅ Green with ✅: Success, passed tests
 - ❌ Red with ❌: Errors, failed tests
 - ℹ️ Blue with ℹ️: Info messages, paths
 - ⚠️ Yellow with ⚠️: Warnings
 - 📋 White/Bold: Headers and titles

4. **Emoji Usage:**
 - Use emojis consistently for visual feedback
 - Handle Unicode encoding errors gracefully (Windows compatibility)
 - Fallback to text-only if encoding fails
 - UTF-8 encoding configured automatically for Windows consoles

5. **No Duplication:**
 - Show pytest output once in terminal
 - Extract and display summary line once with color
 - Don't repeat "Test Output" or "Result" sections
 - Markdown gets full output, terminal gets summary

### Standard Runner Commands

```bash
# Run all tests (main runner calls all sub-runners)
python tests/runner.py

# Run specific layer
python tests/runner.py --core # Core tests only
python tests/runner.py --unit # Unit tests only (all modules)
python tests/runner.py --integration # Integration tests only
python tests/runner.py --advance # Advance tests (v1.0.0+)

# Run specific categories
python tests/runner.py --security # Security tests (PRIORITY #1)
python tests/runner.py --performance # Performance benchmarks
python tests/runner.py --usability # Usability tests (advance)
python tests/runner.py --maintainability # Maintainability tests (advance)
python tests/runner.py --extensibility # Extensibility tests (advance)

# Run specific unit module
python tests/1.unit/runner.py --module serialization_tests

# Quick smoke tests
python tests/runner.py --quick # Fast smoke tests
```

### Direct Layer Runner Usage

For faster iteration during development, you can run layer runners directly:

```bash
# Run layer runners directly (bypass main runner orchestration)
python tests/0.core/runner.py # Core tests only
python tests/1.unit/runner.py # All unit tests
python tests/2.integration/runner.py # Integration tests only
python tests/3.advance/runner.py # Advance tests (if available)

# Run specific module runner directly
python tests/1.unit/serialization_tests/runner.py
python tests/1.unit/security_tests/runner.py
python tests/1.unit/performance_tests/runner.py
```

**Benefits of direct runner usage:**
- Faster feedback loop during development
- Skip main runner orchestration overhead
- Useful for debugging specific test failures
- Immediate focus on specific test layer

### Output Artifacts

- `tests/runner.py` is the **only** component that persists Markdown output.
  - It writes timestamped summaries under `docs/tests/` using the pattern `TEST_YYYYMMDD_HHMM_DESCRIPTION.md`.
  - The report should capture the executed command, layer coverage, key metrics, and links to any additional evidence.
  - See [GUIDE_DOCS.md](GUIDE_DOCS.md) (Template #13) for the required structure of these files.
- Layer runners (`tests/0.core/runner.py`, `tests/1.unit/...`, etc.) stream to stdout/stderr only. They must not create Markdown or auxiliary files on disk.
- Automate report generation for meaningful executions such as release candidates, regression suites, and milestone gates. Ad-hoc local runs may skip the Markdown artifact to keep documentation concise.

### Why Hierarchical Runners?

Following GUIDE_DEV.md Testing Strategy:

1. **Consistency** - Single entry point ensures uniform test execution across all environments
2. **Maintainability** - Centralized test configuration and reporting
3. **Separation of concerns** - Runners handle orchestration while pytest handles execution details
4. **CI/CD integration** - Standardized test execution for automated pipelines
5. **Scalability** - Easy to add new test categories and modules
6. **Fast feedback** - Run specific layers or modules independently

### Main Runner Implementation (tests/runner.py)

**Main orchestrator that calls all sub-runners with output logging:**

```python
#!/usr/bin/env python3
"""
#exonware/<library>/tests/runner.py

Main test runner for <library>
Coordinates all test layers and records a single Markdown summary under docs/tests.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 11-Oct-2025

Usage:
 python tests/runner.py # Run all tests
 python tests/runner.py --core # Run only core tests
 python tests/runner.py --unit # Run only unit tests
 python tests/runner.py --integration # Run only integration tests
 python tests/runner.py --advance # Run only advance tests (v1.0.0+)
 python tests/runner.py --security # Run only security tests
 python tests/runner.py --performance # Run only performance tests

Output:
 - Terminal: Colored, formatted output
 - File: docs/tests/TEST_<timestamp>_SUMMARY.md (Markdown-friendly format)
"""

import sys
import subprocess
from pathlib import Path
from datetime import datetime
from io import StringIO

# ⚠️ CRITICAL: Configure UTF-8 encoding for Windows console (GUIDE_TEST.md compliance)
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass  # If reconfiguration fails, continue with default encoding


class DualOutput:
 """Capture output for both terminal and Markdown file."""

 def __init__(self, output_file: Path):
 self.output_file = output_file
 self.terminal_lines = []
 self.markdown_lines = []

 def print(self, text: str, markdown_format: str = None):
 """Print to terminal and capture for Markdown."""
 # Terminal output
 print(text)
 self.terminal_lines.append(text)

 # Markdown output (use markdown_format if provided, else clean terminal output)
 if markdown_format:
 self.markdown_lines.append(markdown_format)
 else:
 # Clean emoji and special chars for Markdown
 cleaned = text.replace("="*80, "---")
 self.markdown_lines.append(cleaned)

 def save(self):
 """Save Markdown output to file."""
 header = f"""# Test Runner Output

**Library:** <library>
**Generated:** {datetime.now().strftime("%d-%b-%Y %H:%M:%S")}
**Runner:** Main Orchestrator

---

"""
 content = header + "\n".join(self.markdown_lines) + "\n"
 self.output_file.write_text(content, encoding='utf-8')


def run_sub_runner(runner_path: Path, description: str, output: DualOutput) -> int:
 """Run a sub-runner and return exit code."""
 separator = "="*80
 output.print(f"\n{separator}", f"\n## {description}\n")
 output.print(f"🚀 {description}", f"**Status:** Running...")
 output.print(f"{separator}\n", "")

 result = subprocess.run(
 [sys.executable, str(runner_path)],
 cwd=runner_path.parent,
 capture_output=True,
 text=True
)

 # Print sub-runner output
 if result.stdout:
 output.print(result.stdout, f"```\n{result.stdout}\n```")
 if result.stderr:
 output.print(result.stderr, f"**Errors:**\n```\n{result.stderr}\n```")

 # Status
 status = "✅ PASSED" if result.returncode == 0 else "❌ FAILED"
 output.print(f"\n{status}", f"\n**Result:** {status}")

 return result.returncode


def main():
 """Main test runner function following GUIDE_DEV.md."""
 # Setup output logger
 test_dir = Path(__file__).parent
 reports_dir = test_dir.parent / "docs" / "tests"
 reports_dir.mkdir(parents=True, exist_ok=True)
 timestamp = datetime.now().strftime("%Y%m%d_%H%M")
 output_file = reports_dir / f"TEST_{timestamp}_SUMMARY.md"
 output = DualOutput(output_file)

 # Add src to Python path for testing
 src_path = test_dir.parent / "src"
 sys.path.insert(0, str(src_path))

 # Header
 header = "="*80
 output.print(header, "# Test Execution Report")
 output.print("<library> Test Runner",
        f"**Library:** <library> \n**Type:** Main Orchestrator - Hierarchical Test Execution")
 output.print("Main Orchestrator - Hierarchical Test Execution", "")
 output.print(header, "---")

 # Parse arguments
 args = sys.argv[1:]

 # Define sub-runners
 core_runner = test_dir / "0.core" / "runner.py"
 unit_runner = test_dir / "1.unit" / "runner.py"
 integration_runner = test_dir / "2.integration" / "runner.py"
 advance_runner = test_dir / "3.advance" / "runner.py"

 exit_codes = []

 # Determine which tests to run
 if "--core" in args:
 if core_runner.exists():
 exit_codes.append(run_sub_runner(core_runner, "Core Tests", output))

 elif "--unit" in args:
 if unit_runner.exists():
 exit_codes.append(run_sub_runner(unit_runner, "Unit Tests", output))

 elif "--integration" in args:
 if integration_runner.exists():
 exit_codes.append(run_sub_runner(integration_runner, "Integration Tests", output))

 elif "--advance" in args:
 if advance_runner.exists():
 exit_codes.append(run_sub_runner(advance_runner, "Advance Tests", output))
 else:
 msg = "\n⚠️ Advance tests not available (requires v1.0.0)"
 output.print(msg, f"\n> {msg}")

 elif "--security" in args or "--performance" in args or "--usability" in args or "--maintainability" in args or "--extensibility" in args:
 # Forward to advance runner if exists
 if advance_runner.exists():
 result = subprocess.run([sys.executable, str(advance_runner)] + args)
 exit_codes.append(result.returncode)
 else:
 msg = "\n⚠️ Advance tests not available (requires v1.0.0)"
 output.print(msg, f"\n> {msg}")

 else:
 # Run all tests in sequence
msg_header = "\n🚀 Running: ALL Tests"
msg_layers = " Layers: 0.core ✅ 1.unit ✅ 2.integration ✅ 3.advance"
output.print(msg_header, "\n## Running All Test Layers")
output.print(msg_layers, f"\n**Execution Order:** 0.core ✅ 1.unit ✅ 2.integration ✅ 3.advance\n")
 output.print("", "")

 # Core tests
 if core_runner.exists():
 exit_codes.append(run_sub_runner(core_runner, "Layer 0: Core Tests", output))

 # Unit tests
 if unit_runner.exists():
 exit_codes.append(run_sub_runner(unit_runner, "Layer 1: Unit Tests", output))

 # Integration tests
 if integration_runner.exists():
 exit_codes.append(run_sub_runner(integration_runner, "Layer 2: Integration Tests", output))

 # Advance tests (if available)
 if advance_runner.exists():
 exit_codes.append(run_sub_runner(advance_runner, "Layer 3: Advance Tests", output))

 # Print summary
 summary_header = f"\n{'='*80}"
output.print(summary_header, f"\n---\n\n## 📈 Test Execution Summary")
output.print("📈 TEST EXECUTION SUMMARY", "")
 output.print(f"{'='*80}", "")

 total_runs = len(exit_codes)
 passed = sum(1 for code in exit_codes if code == 0)
 failed = total_runs - passed

 output.print(f"Total Layers: {total_runs}", f"- **Total Layers:** {total_runs}")
 output.print(f"Passed: {passed}", f"- **Passed:** {passed}")
 output.print(f"Failed: {failed}", f"- **Failed:** {failed}")

 # Final status
 if all(code == 0 for code in exit_codes):
 final_msg = "\n✅ ALL TESTS PASSED!"
 output.print(final_msg, f"\n### {final_msg}")

 # Save output
 output.save()
 print(f"\n💾 Test results saved to: {output_file}")

 sys.exit(0)
 else:
 final_msg = "\n❌ SOME TESTS FAILED!"
 output.print(final_msg, f"\n### {final_msg}")

 # Save output
 output.save()
 print(f"\n💾 Test results saved to: {output_file}")

 sys.exit(1)


if __name__ == "__main__":
 main()
```

**Output Format:**

The runner generates two outputs simultaneously:

1. **Terminal Output** (with emoji and formatting):
```
================================================================================
xwsystem Test Runner
Main Orchestrator - Hierarchical Test Execution
================================================================================
🚀 Running: ALL Tests
 Layers: 0.core ✅ 1.unit ✅ 2.integration ✅ 3.advance
✅ ALL TESTS PASSED!
💾 Test results saved to: docs/tests/TEST_<timestamp>_SUMMARY.md
```

2. **Markdown Output** (`docs/tests/TEST_<timestamp>_SUMMARY.md`):
```markdown
# Test Execution Report

**Library:** <library>
**Generated:** 11-Oct-2025 14:30:45
**Runner:** Main Orchestrator

---

## Running All Test Layers

**Execution Order:** 0.core ✅ 1.unit ✅ 2.integration ✅ 3.advance

## Layer 0: Core Tests

**Status:** Running...
```
[test output]
```

**Result:** ✅ PASSED

---

## 📈 Test Execution Summary

- **Total Layers:** 4
- **Passed:** 4
- **Failed:** 0

### ✅ ALL TESTS PASSED!
```

**Git configuration:**

No additional ignore rules are required for test reports. The only Markdown artifact (`docs/tests/TEST_*.md`) is part of version control, and layer runners do not create temporary files.

---

## 🔧 Error Fixing in Tests

### Root Cause Analysis is MANDATORY

**⚠️ CRITICAL RULE: Never rig tests to pass. Always fix the root cause.**

**📖 Complete Error Fixing Philosophy: [GUIDE_DEV.md - Error Fixing Philosophy](GUIDE_DEV.md#error-fixing-philosophy)**

This section provides **testing-specific** guidance for applying the error fixing philosophy from GUIDE_DEV.md.

**Core principle from GUIDE_DEV.md:**
> "Fix root causes - Never remove features; always resolve root causes instead of using workarounds to maintain system integrity and prevent technical debt accumulation"

### Test Failure Response (Testing-Specific)

**When a test fails:**

1. **Read the full error** - Don't just look at pass/fail, understand WHY
2. **Run test in isolation** - Confirm it's not a flaky test
3. **Identify root cause** - Is the test wrong or the code wrong?
4. **Fix the code** - Not the test (unless test logic is actually wrong)
5. **Run full suite** - Verify no regressions introduced
6. **Document in commit** - Explain what was fixed and why

### Testing-Specific Anti-Patterns

**See [GUIDE_DEV.md](GUIDE_DEV.md#error-fixing-philosophy) for complete philosophy and all 5 priority examples.**

**Testing-specific forbidden practices:**

**❌ NEVER:**

1. **Use `pass` to make tests pass**
2. **Remove features to eliminate bugs**
3. **Comment out failing tests**
4. **Use generic `except:` to hide errors**
5. **Lower quality standards to pass tests**
6. **Skip root cause analysis**
7. **Apply quick hacks or workarounds**
8. **Ignore warnings or suppress errors**
9. **Change test expectations to match bugs**
10. **Remove assertions to avoid failures**
11. **Use `--disable-warnings` flag to hide warnings**
12. **Use `--maxfail=10` to continue past failures**
13. **Use `--tb=no` to hide tracebacks**
14. **Use `-q` to hide diagnostic output**
15. **Add `filterwarnings = ignore` to pytest.ini**
16. **Use `@pytest.mark.skip` to avoid fixing tests**
17. **Use `@pytest.mark.xfail` to accept failures**
18. **Set `PYTHONWARNINGS=ignore` environment variable**
19. **Use `--ignore` to skip test directories**
20. **Increase timeouts instead of optimizing code**

### Forbidden pytest Flags & Configurations

**⚠️ CRITICAL: These flags/options are BANNED - they hide real problems**

| Flag/Option | Why It's Forbidden | What To Do Instead |
|-------------|-------------------|-------------------|
| `--disable-warnings` | **Hides warnings that indicate real issues** | **Fix the warnings!** |
| `--maxfail=10` | **Continues after failures, masks cascading issues** | **Use `--maxfail=1` or `-x`** |
| `--tb=no` | **Hides tracebacks needed for debugging** | **Use `--tb=short` or `--tb=long`** |
| `-q` / `--quiet` | **Hides important diagnostic information** | **Use `-v` / `--verbose`** |
| `-p no:warnings` | **Disables warning plugin completely** | **Keep warnings enabled** |
| `filterwarnings = ignore` | **Suppresses all warnings in config** | **Fix warnings, don't hide them** |
| `@pytest.mark.skip` | **Avoids running tests** | **Fix the test or code** |
| `@pytest.mark.xfail` | **Expects tests to fail** | **Fix the failure** |
| `-k "not slow"` | **Skips tests arbitrarily** | **Optimize or run separately** |
| `--ignore=path` | **Skips entire test directories** | **Fix the tests** |
| `--continue-on-collection-errors` | **Hides import errors** | **Fix import errors** |
| `PYTHONWARNINGS=ignore` | **Environment-level suppression** | **NEVER set this** |
| `pytest.warns(None)` | **Suppresses warnings in test** | **Fix the warning** |
| `--no-cov` | **Disables coverage** | **Keep coverage enabled** |

**Why these are forbidden:**
- ❌ They hide real bugs that will surface in use
- ❌ They violate the "Fix root causes" principle
- ❌ They create false confidence in code quality
- ❌ They accumulate technical debt
- ❌ They prevent proper debugging
- ❌ They mask security vulnerabilities
- ❌ They allow performance regressions

**✅ ALLOWED pytest flags (approved for use):**
- `-v` / `--verbose` - More output helps debugging
- `--tb=short` - Concise tracebacks (still shows info)
- `--maxfail=1` or `-x` - Stop on FIRST failure (fast feedback)
- `--strict-markers` - Enforce marker discipline
- `-m "<marker>"` - Run specific test categories
- `--lf` - Re-run last failed (debugging workflow)
- `--ff` - Failed first (debugging workflow)
- `-k "specific_keyword"` - Filter by meaningful keywords
- `--cov` - Coverage reporting
- `-s` - Show print statements (debugging)
- `-l` - Show local variables on failure
- `--junitxml` - Generate test reports
- `-vv` - Very verbose (debugging)

### Common AI/LLM Error-Hiding Tactics to AVOID

**⚠️ AI assistants and developers sometimes use these tactics - ALL FORBIDDEN:**

1. **Silencing with try/except:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ❌ FORBIDDEN
try:
    failing_function()
except:
    pass # Or return None, or return True
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ❌ FORBIDDEN
try {
    failingFunction();
} catch {
    // Or return null, or return true
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ❌ FORBIDDEN
func badExample() {
    _ = failingFunction() // Ignores all errors
    return true
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ❌ FORBIDDEN
fn bad_example() -> bool {
    let _ = failing_function(); // Ignores all errors
    true
}
```

</details>

2. **Mock everything to avoid real testing:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ❌ FORBIDDEN: Over-mocking
@patch('module.everything')
def test_feature(mock_everything):
    mock_everything.return_value = True
    assert feature() == True # Not testing anything!
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ❌ FORBIDDEN: Over-mocking
jest.mock('module', () => ({
    everything: jest.fn(() => true)
}));

test('feature', () => {
    expect(feature()).toBe(true); // Not testing anything!
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ❌ FORBIDDEN: Over-mocking
func TestFeature(t *testing.T) {
    mockEverything := func() bool { return true }
    result := feature(mockEverything)
    if result != true {
        t.Error("Not testing anything!")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ❌ FORBIDDEN: Over-mocking
#[test]
fn test_feature() {
    let mock_everything = || true;
    let result = feature(mock_everything);
    assert_eq!(result, true); // Not testing anything!
}
```

</details>

3. **Lowering thresholds:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ❌ FORBIDDEN: Changed from 80% to 50%
assert coverage > 50 # Lowered to make it pass
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ❌ FORBIDDEN: Changed from 80% to 50%
expect(coverage).toBeGreaterThan(50); // Lowered to make it pass
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ❌ FORBIDDEN: Changed from 80% to 50%
if coverage <= 50 {
    t.Error("Lowered to make it pass")
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ❌ FORBIDDEN: Changed from 80% to 50%
assert!(coverage > 50, "Lowered to make it pass");
```

</details>

4. **Using fixtures that return fake success:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ❌ FORBIDDEN
@pytest.fixture
def always_succeeds():
    return lambda *args, **kwargs: True
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ❌ FORBIDDEN
const alwaysSucceeds = () => (...args: any[]) => true;
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ❌ FORBIDDEN
func alwaysSucceeds() func(...interface{}) bool {
    return func(...interface{}) bool { return true }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ❌ FORBIDDEN
fn always_succeeds() -> Box<dyn Fn() -> bool> {
    Box::new(|| true)
}
```

</details>

5. **Conditional test skipping:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ❌ FORBIDDEN
if sys.platform == "win32":
    pytest.skip("Doesn't work on Windows")
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ❌ FORBIDDEN
if (process.platform === "win32") {
    test.skip("Doesn't work on Windows");
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ❌ FORBIDDEN
func TestFeature(t *testing.T) {
    if runtime.GOOS == "windows" {
        t.Skip("Doesn't work on Windows")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ❌ FORBIDDEN
#[test]
#[cfg(not(target_os = "windows"))]
fn test_feature() {
    // Test skipped on Windows
}
```

</details>
 if sys.platform == "win32":
 pytest.skip("Doesn't work on Windows")
 # Fix: Make it work on Windows!
 ```

6. **Timeout manipulation:**
 ```python
 # ❌ FORBIDDEN: Increased from 1s to 60s
 @pytest.mark.timeout(60) # Just to avoid timeout failure
 ```

7. **Using `--lax` or similar permissive flags**
8. **Modifying test data to match broken output**
9. **Creating "expected failure" tests instead of fixing**
10. **Using CI/CD skip conditions to avoid running tests**

### Required Practices When Fixing Errors

**✅ ALWAYS:**

1. **Fix the root cause, not the symptom**
2. **Preserve all existing features**
3. **Add tests that prevent regression**
4. **Improve error messages for usability**
5. **Document WHY the fix was needed**
6. **Verify against all 5 priorities**
7. **Run full test suite to check for regressions**
8. **Use specific exception types**
9. **Log errors with proper context**
10. **Follow design patterns and best practices**

### Example: Complete Error Fixing Process

**Scenario: Test fails with TypeError**

```python
# Step 1: Failing test
def test_calculate_total():
 items = [{"price": 10}, {"price": 20}, {"price": None}]
 total = calculate_total(items)
 assert total == 30 # Fails: TypeError on None

# Step 2: Reproduce and analyze
# Root cause: Function doesn't handle None prices
# Impact analysis:
# - Security: No impact (not security-related)
# - Usability: Poor - crashes instead of helpful error
# - Maintainability: Poor - no validation
# - Performance: N/A
# - Extensibility: N/A

# Step 3: Fix root cause
def calculate_total(items: List[Dict[str, Any]]) -> float:
 """
 Calculate total price from items.

 Root cause fixed: No validation for None/missing prices.
 Solution: Validate input and provide clear errors.

 Priority alignment:
 - Usability: Clear error when data is invalid
 - Maintainability: Explicit validation logic

 Args:
 items: List of item dicts with 'price' key

 Returns:
 Total price sum

 Raises:
 ValueError: If price is None or missing
 """
 total = 0
 for i, item in enumerate(items):
 price = item.get('price')
 if price is None:
 raise ValueError(
 f"Item {i} has invalid price: None. "
 f"All items must have numeric price values."
)
 if not isinstance(price, (int, float)):
 raise ValueError(
 f"Item {i} has invalid price type: {type(price)}. "
 f"Expected int or float."
)
 total += price
 return total

# Step 4: Add comprehensive tests
def test_calculate_total_with_valid_prices():
 """Test calculation with valid prices."""
 items = [{"price": 10}, {"price": 20}, {"price": 30}]
 assert calculate_total(items) == 60

def test_calculate_total_rejects_none_price():
 """Test that None prices are rejected with clear error."""
 items = [{"price": 10}, {"price": None}]
 with pytest.raises(ValueError, match="Item 1 has invalid price: None"):
 calculate_total(items)

def test_calculate_total_rejects_invalid_type():
 """Test that invalid price types are rejected."""
 items = [{"price": "not a number"}]
 with pytest.raises(ValueError, match="invalid price type"):
 calculate_total(items)

def test_calculate_total_with_empty_list():
 """Test that empty list returns 0."""
 assert calculate_total([]) == 0

# Step 5: Document in commit
# Commit message:
# Fix: Add validation for None prices in calculate_total()
#
# Root cause: Function crashed with TypeError when price was None
# Solution: Add explicit validation with helpful error messages
#
# Priority: Usability (#2) - Clear errors improve developer experience
#
# Tests added:
# - test_calculate_total_rejects_none_price
# - test_calculate_total_rejects_invalid_type
# - test_calculate_total_with_empty_list
```

### Red Flags That Indicate Wrong Approach

**⚠️ Warning signs you're fixing incorrectly:**

**Code-level bypasses:**
- Adding `# TODO: Fix this properly later`
- Using `@pytest.mark.skip` or `@pytest.mark.xfail`
- Increasing timeout values to make tests pass
- Lowering performance benchmarks
- Removing assertions from tests
- Using bare `except:` clauses
- Commenting out failing code
- Returning default values to hide errors
- Over-mocking to avoid real testing
- Using fixtures that always return success

**Configuration-level bypasses:**
- Adding `--disable-warnings` to pytest command or config
- Using `--maxfail=10` instead of `--maxfail=1` or `-x`
- Adding `--tb=no` to hide tracebacks
- Using `-q` / `--quiet` to hide output
- Adding `filterwarnings = ignore` to pytest.ini
- Using `-p no:warnings` to disable warning plugin
- Setting `PYTHONWARNINGS=ignore` environment variable
- Adding `--ignore=path` to skip test directories
- Using `--continue-on-collection-errors`

**Testing practice bypasses:**
- Skipping slow tests with `-k "not slow"` arbitrarily
- Lowering coverage thresholds
- Removing tests from test suite
- Creating separate "known failures" category
- Running subset of tests in CI
- "It works on my machine" syndrome

**⚠️ When you see ANY of these, STOP immediately and fix the root cause properly.**

---

## ✨ Testing Best Practices

### Test Design Principles

#### 1. Test Isolation
- **Independence:** Each test should be independent and not rely on other tests
- **Fixtures over dependencies:** Use fixtures for shared setup instead of test dependencies
- **Resource cleanup:** Clean up resources in teardown/finally blocks
- **No side effects:** Tests should not leave artifacts that affect other tests

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ✅ Good: Isolated test
def test_create_user(db_connection):
    user = create_user("test@example.com")
    assert user.email == "test@example.com"
    # Cleanup happens in fixture teardown

# ❌ Bad: Depends on another test
def test_get_user(): # Assumes test_create_user ran first
    user = get_user("test@example.com")
    assert user is not None
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ✅ Good: Isolated test
test('create user', async ({ dbConnection }) => {
    const user = createUser("test@example.com");
    expect(user.email).toBe("test@example.com");
    // Cleanup happens in fixture teardown
});

// ❌ Bad: Depends on another test
test('get user', () => { // Assumes create user test ran first
    const user = getUser("test@example.com");
    expect(user).not.toBeNull();
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ✅ Good: Isolated test
func TestCreateUser(t *testing.T) {
    dbConnection := setupDB(t)
    defer teardownDB(t, dbConnection)
    
    user := createUser("test@example.com")
    if user.Email != "test@example.com" {
        t.Errorf("Expected email test@example.com, got %s", user.Email)
    }
    // Cleanup happens in defer
}

// ❌ Bad: Depends on another test
func TestGetUser(t *testing.T) { // Assumes TestCreateUser ran first
    user := getUser("test@example.com")
    if user == nil {
        t.Error("User should exist")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ✅ Good: Isolated test
#[test]
fn test_create_user() {
    let db_connection = setup_db();
    let user = create_user("test@example.com");
    assert_eq!(user.email, "test@example.com");
    // Cleanup happens in drop
}

// ❌ Bad: Depends on another test
#[test]
fn test_get_user() { // Assumes test_create_user ran first
    let user = get_user("test@example.com");
    assert!(user.is_some());
}
```

</details>

#### 2. Descriptive Naming
- **Pattern:** `test_<action>_<expected_result>`
- **Be specific:** Names should describe what is being tested and expected outcome
- **Avoid generic names:** Not `test_function1` but `test_create_user_with_invalid_email_raises_error`

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ✅ Good: Descriptive names
def test_create_user_with_valid_email_succeeds()
def test_create_user_with_duplicate_email_raises_error()
def test_password_hash_is_not_stored_in_plain_text()

# ❌ Bad: Generic names
def test_user1()
def test_user2()
def test_function()
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ✅ Good: Descriptive names
test('create user with valid email succeeds', () => {});
test('create user with duplicate email raises error', () => {});
test('password hash is not stored in plain text', () => {});

// ❌ Bad: Generic names
test('user1', () => {});
test('user2', () => {});
test('function', () => {});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ✅ Good: Descriptive names
func TestCreateUserWithValidEmailSucceeds(t *testing.T) {}
func TestCreateUserWithDuplicateEmailRaisesError(t *testing.T) {}
func TestPasswordHashIsNotStoredInPlainText(t *testing.T) {}

// ❌ Bad: Generic names
func TestUser1(t *testing.T) {}
func TestUser2(t *testing.T) {}
func TestFunction(t *testing.T) {}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ✅ Good: Descriptive names
#[test]
fn test_create_user_with_valid_email_succeeds() {}
#[test]
fn test_create_user_with_duplicate_email_raises_error() {}
#[test]
fn test_password_hash_is_not_stored_in_plain_text() {}

// ❌ Bad: Generic names
#[test]
fn test_user1() {}
#[test]
fn test_user2() {}
#[test]
fn test_function() {}
```

</details>

#### 3. Proper Markers
- **Always use appropriate markers:** For categorization and selective execution
- **Multiple markers when applicable:** Tests can fit multiple categories
- **Consistent naming:** Follow `<library>_<category>` pattern

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ✅ Good: Multiple relevant markers
@pytest.mark.xwsystem_unit
@pytest.mark.xwsystem_security
def test_password_validation_prevents_weak_passwords()

# ✅ Good: Single clear marker
@pytest.mark.xwsystem_core
def test_basic_serialization_roundtrip()
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ✅ Good: Multiple relevant markers
test('password validation prevents weak passwords', () => {}, {
    tags: ['xwsystem_unit', 'xwsystem_security']
});

// ✅ Good: Single clear marker
test('basic serialization roundtrip', () => {}, {
    tags: ['xwsystem_core']
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ✅ Good: Multiple relevant markers
//go:build xwsystem_unit && xwsystem_security
func TestPasswordValidationPreventsWeakPasswords(t *testing.T) {}

// ✅ Good: Single clear marker
//go:build xwsystem_core
func TestBasicSerializationRoundtrip(t *testing.T) {}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ✅ Good: Multiple relevant markers
#[test]
#[cfg(all(feature = "xwsystem_unit", feature = "xwsystem_security"))]
fn test_password_validation_prevents_weak_passwords() {}

// ✅ Good: Single clear marker
#[test]
#[cfg(feature = "xwsystem_core")]
fn test_basic_serialization_roundtrip() {}
```

</details>

#### 4. Test Both Success and Failure
- **Happy path:** Test expected successful operations
- **Error scenarios:** Test all failure modes
- **Edge cases:** Test boundary conditions
- **Error messages:** Validate error messages are helpful

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ✅ Good: Tests both success and failure
def test_parse_valid_json_succeeds():
    result = parse_json('{"key": "value"}')
    assert result == {"key": "value"}

def test_parse_invalid_json_raises_error():
    with pytest.raises(JsonParseError) as exc_info:
        parse_json('{invalid json}')
    assert "invalid" in str(exc_info.value).lower()
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ✅ Good: Tests both success and failure
test('parse valid json succeeds', () => {
    const result = parseJson('{"key": "value"}');
    expect(result).toEqual({ key: "value" });
});

test('parse invalid json raises error', () => {
    expect(() => {
        parseJson('{invalid json}');
    }).toThrow(JsonParseError);
    
    try {
        parseJson('{invalid json}');
    } catch (e) {
        expect(e.message.toLowerCase()).toContain("invalid");
    }
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ✅ Good: Tests both success and failure
func TestParseValidJsonSucceeds(t *testing.T) {
    result, err := parseJson(`{"key": "value"}`)
    if err != nil {
        t.Fatalf("Expected success, got error: %v", err)
    }
    if result["key"] != "value" {
        t.Errorf("Expected value, got %v", result["key"])
    }
}

func TestParseInvalidJsonRaisesError(t *testing.T) {
    _, err := parseJson(`{invalid json}`)
    if err == nil {
        t.Fatal("Expected error, got nil")
    }
    if !strings.Contains(strings.ToLower(err.Error()), "invalid") {
        t.Errorf("Expected 'invalid' in error, got: %v", err)
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ✅ Good: Tests both success and failure
#[test]
fn test_parse_valid_json_succeeds() {
    let result = parse_json(r#"{"key": "value"}"#).unwrap();
    assert_eq!(result["key"], "value");
}

#[test]
fn test_parse_invalid_json_raises_error() {
    let result = parse_json("{invalid json}");
    assert!(result.is_err());
    let err_msg = result.unwrap_err().to_string().to_lowercase();
    assert!(err_msg.contains("invalid"));
}
```

</details>

#### 5. Performance Awareness
- **Benchmarks for critical paths:** Include performance tests
- **Realistic targets:** Set achievable performance benchmarks
- **Mark slow tests:** Use `@pytest.mark.slow` for tests > 1 second
- **Profile when needed:** Use profiling tools for optimization

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
@pytest.mark.xwsystem_performance
def test_process_large_dataset_within_time_limit(large_dataset):
    start = time.time()
    result = process(large_dataset)
    elapsed = time.time() - start
    
    assert elapsed < 5.0, f"Processing took {elapsed:.2f}s, expected < 5.0s"
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
test('process large dataset within time limit', { timeout: 10000 }, async () => {
    const start = Date.now();
    const result = await process(largeDataset);
    const elapsed = (Date.now() - start) / 1000;
    
    expect(elapsed).toBeLessThan(5.0);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
func TestProcessLargeDatasetWithinTimeLimit(t *testing.T) {
    largeDataset := createLargeDataset()
    start := time.Now()
    result := process(largeDataset)
    elapsed := time.Since(start)
    
    if elapsed.Seconds() >= 5.0 {
        t.Errorf("Processing took %.2fs, expected < 5.0s", elapsed.Seconds())
    }
    _ = result
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
#[test]
fn test_process_large_dataset_within_time_limit() {
    let large_dataset = create_large_dataset();
    let start = std::time::Instant::now();
    let result = process(large_dataset);
    let elapsed = start.elapsed();
    
    assert!(elapsed.as_secs_f64() < 5.0, 
        "Processing took {:.2}s, expected < 5.0s", elapsed.as_secs_f64());
    let _ = result;
}
```

</details>

#### 6. Security Validation
- **Never skip security tests:** Security is Priority #1
- **Test malicious input:** Include common attack patterns
- **Validate sanitization:** Ensure input is properly sanitized
- **Test authorization:** Verify access controls work

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
@pytest.mark.xwsystem_security
def test_sql_injection_protection():
    # Should not execute malicious SQL
    result = query_database("'; DROP TABLE users; --")
    assert "DROP" not in result
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
test('sql injection protection', () => {
    // Should not execute malicious SQL
    const result = queryDatabase("'; DROP TABLE users; --");
    expect(result).not.toContain("DROP");
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
func TestSqlInjectionProtection(t *testing.T) {
    // Should not execute malicious SQL
    result := queryDatabase("'; DROP TABLE users; --")
    if strings.Contains(result, "DROP") {
        t.Error("SQL injection detected - DROP command found in result")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
#[test]
fn test_sql_injection_protection() {
    // Should not execute malicious SQL
    let result = query_database("'; DROP TABLE users; --");
    assert!(!result.contains("DROP"), "SQL injection detected");
}
```

</details>

#### 7. Format Coverage (Data Libraries)
- **Test all formats:** Comprehensive testing of all supported formats
- **Format-specific edge cases:** Each format has unique characteristics
- **Interoperability:** Test format conversions work correctly

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
@pytest.mark.parametrize("format", ["json", "yaml", "toml", "xml"])
def test_format_roundtrip(format, test_data):
    serializer = get_serializer(format)
    serialized = serializer.dumps(test_data)
    deserialized = serializer.loads(serialized)
    assert deserialized == test_data
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
test.each(["json", "yaml", "toml", "xml"])('format roundtrip: %s', (format) => {
    const serializer = getSerializer(format);
    const serialized = serializer.dumps(testData);
    const deserialized = serializer.loads(serialized);
    expect(deserialized).toEqual(testData);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
func TestFormatRoundtrip(t *testing.T) {
    formats := []string{"json", "yaml", "toml", "xml"}
    testData := map[string]interface{}{"key": "value"}
    
    for _, format := range formats {
        t.Run(format, func(t *testing.T) {
            serializer := getSerializer(format)
            serialized, _ := serializer.Dumps(testData)
            deserialized, _ := serializer.Loads(serialized)
            if !reflect.DeepEqual(deserialized, testData) {
                t.Error("Roundtrip failed")
            }
        })
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
#[test]
fn test_format_roundtrip() {
    let formats = vec!["json", "yaml", "toml", "xml"];
    let test_data = serde_json::json!({"key": "value"});
    
    for format in formats {
        let serializer = get_serializer(format);
        let serialized = serializer.dumps(&test_data).unwrap();
        let deserialized: serde_json::Value = serializer.loads(&serialized).unwrap();
        assert_eq!(deserialized, test_data, "Roundtrip failed for {}", format);
    }
}
```

</details>

#### 8. Schema Evolution (Schema Libraries)
- **Backward compatibility:** Ensure old data works with new schemas
- **Forward compatibility:** Where applicable, new data with old schemas
- **Breaking changes:** Document clearly in tests

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
def test_schema_backward_compatibility():
    # Old data format should work with new schema
    old_data = {"name": "Alice", "age": 30}
    new_schema = UserSchemaV2()
    
    validated = new_schema.validate(old_data)
    assert validated is not None
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
test('schema backward compatibility', () => {
    // Old data format should work with new schema
    const oldData = { name: "Alice", age: 30 };
    const newSchema = new UserSchemaV2();
    
    const validated = newSchema.validate(oldData);
    expect(validated).not.toBeNull();
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
func TestSchemaBackwardCompatibility(t *testing.T) {
    // Old data format should work with new schema
    oldData := map[string]interface{}{
        "name": "Alice",
        "age": 30,
    }
    newSchema := NewUserSchemaV2()
    
    validated, err := newSchema.Validate(oldData)
    if err != nil {
        t.Fatal(err)
    }
    if validated == nil {
        t.Error("Validation failed")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
#[test]
fn test_schema_backward_compatibility() {
    // Old data format should work with new schema
    let old_data = serde_json::json!({
        "name": "Alice",
        "age": 30
    });
    let new_schema = UserSchemaV2::new();
    
    let validated = new_schema.validate(&old_data).unwrap();
    assert!(validated.is_some());
}
```

</details>

#### 9. Cross-Platform Testing
- **Platform-specific markers:** Use when needed
- **Path handling:** Test Windows and Unix path separators
- **Line endings:** Test CRLF and LF handling

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
@pytest.mark.skipif(sys.platform == "win32", reason="Unix-specific")
def test_unix_file_permissions():
    assert file_has_permissions("/tmp/test", "755")
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
test.skipIf(process.platform === "win32", 'unix file permissions', () => {
    expect(fileHasPermissions("/tmp/test", "755")).toBe(true);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
//go:build !windows
func TestUnixFilePermissions(t *testing.T) {
    if !fileHasPermissions("/tmp/test", "755") {
        t.Error("Expected permissions 755")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
#[test]
#[cfg(not(target_os = "windows"))]
fn test_unix_file_permissions() {
    assert!(file_has_permissions("/tmp/test", "755"));
}
```

</details>

#### 10. Documentation in Tests
- **Docstrings:** Explain test purpose
- **Given/When/Then:** For integration tests
- **Why edge cases:** Document why specific cases are tested

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
def test_handles_concurrent_access():
    """
    Test that concurrent access to cache is thread-safe.

    This is critical because systems have multiple
    workers accessing the cache simultaneously.

    Given: Multiple threads accessing the same cache
    When: Concurrent read/write operations occur
    Then: No data corruption or race conditions occur
    """
    # Test implementation...
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
/**
 * Test that concurrent access to cache is thread-safe.
 * 
 * This is critical because systems have multiple
 * workers accessing the cache simultaneously.
 * 
 * Given: Multiple threads accessing the same cache
 * When: Concurrent read/write operations occur
 * Then: No data corruption or race conditions occur
 */
test('handles concurrent access', async () => {
    // Test implementation...
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// TestHandlesConcurrentAccess tests that concurrent access to cache is thread-safe.
//
// This is critical because systems have multiple
// workers accessing the cache simultaneously.
//
// Given: Multiple threads accessing the same cache
// When: Concurrent read/write operations occur
// Then: No data corruption or race conditions occur
func TestHandlesConcurrentAccess(t *testing.T) {
    // Test implementation...
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
/// Test that concurrent access to cache is thread-safe.
///
/// This is critical because systems have multiple
/// workers accessing the cache simultaneously.
///
/// Given: Multiple threads accessing the same cache
/// When: Concurrent read/write operations occur
/// Then: No data corruption or race conditions occur
#[test]
fn test_handles_concurrent_access() {
    // Test implementation...
}
```

</details>

### Common Anti-Patterns to Avoid

#### ❌ Don't: Rig Tests to Pass

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Bad: Test always passes
def test_complex_operation():
    try:
        complex_operation()
        assert True # Always passes!
    except:
        pass # Swallows all errors
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Bad: Test always passes
test('complex operation', () => {
    try {
        complexOperation();
        expect(true).toBe(true); // Always passes!
    } catch {
        // Swallows all errors
    }
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Bad: Test always passes
func TestComplexOperation(t *testing.T) {
    err := complexOperation()
    if err != nil {
        // Swallows all errors
        return
    }
    // Always passes!
    if true {
        t.Log("Passed")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Bad: Test always passes
#[test]
fn test_complex_operation() {
    let _ = complex_operation(); // Swallows all errors
    assert!(true); // Always passes!
}
```

</details>

**Why this is wrong:**
- Defeats the purpose of testing
- Hides real bugs that will surface in use
- Violates "No rigged tests" principle
- Creates false confidence

**Fix:** Test the actual behavior and fix the code to meet expectations.

#### ❌ Don't: Test Implementation Details

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Bad: Tests internal structure
def test_user_storage():
    user = User("alice")
    assert user._internal_cache is not None # Internal detail
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Bad: Tests internal structure
test('user storage', () => {
    const user = new User("alice");
    expect((user as any)._internalCache).not.toBeNull(); // Internal detail
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Bad: Tests internal structure
func TestUserStorage(t *testing.T) {
    user := NewUser("alice")
    if user.internalCache == nil { // Internal detail
        t.Error("Expected internal cache")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Bad: Tests internal structure
#[test]
fn test_user_storage() {
    let user = User::new("alice");
    assert!(user.internal_cache.is_some()); // Internal detail
}
```

</details>

**Why this is wrong:**
- Tests break when refactoring internal structure
- Reduces maintainability
- Doesn't test actual behavior

**Fix:** Test public API and observable behavior, not internals.

#### ❌ Don't: Have Unclear Assertions

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Bad: Unclear what's being tested
def test_something():
    result = do_something()
    assert result # What are we actually checking?
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Bad: Unclear what's being tested
test('something', () => {
    const result = doSomething();
    expect(result).toBeTruthy(); // What are we actually checking?
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Bad: Unclear what's being tested
func TestSomething(t *testing.T) {
    result := doSomething()
    if result == nil { // What are we actually checking?
        t.Error("Failed")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Bad: Unclear what's being tested
#[test]
fn test_something() {
    let result = do_something();
    assert!(result.is_some()); // What are we actually checking?
}
```

</details>

**Why this is wrong:**
- Unclear test purpose
- Difficult to debug when fails
- Poor documentation value

**Fix:** Use specific assertions with clear expectations.

#### ❌ Don't: Use pass to Ignore Failures

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Bad: Hiding errors
def test_critical_feature():
    try:
        result = critical_operation()
    except Exception:
        pass # Silently ignoring errors!
    # Test passes even when feature is broken
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Bad: Hiding errors
test('critical feature', () => {
    try {
        const result = criticalOperation();
    } catch {
        // Silently ignoring errors!
    }
    // Test passes even when feature is broken
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Bad: Hiding errors
func TestCriticalFeature(t *testing.T) {
    result, err := criticalOperation()
    if err != nil {
        // Silently ignoring errors!
        return
    }
    // Test passes even when feature is broken
    _ = result
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Bad: Hiding errors
#[test]
fn test_critical_feature() {
    let _ = critical_operation(); // Silently ignoring errors!
    // Test passes even when feature is broken
}
```

</details>

**Why this is wrong:**
- Hides critical bugs
- Violates all 5 priorities
- Creates technical debt

**Fix:** Handle errors properly or fix the code to not raise them.

#### ❌ Don't: Skip Tests Instead of Fixing

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Bad: Avoiding the problem
@pytest.mark.skip("Broken, will fix later")
def test_important_feature():
    assert important_feature() == expected
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Bad: Avoiding the problem
test.skip('important feature', () => {
    expect(importantFeature()).toBe(expected);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Bad: Avoiding the problem
func TestImportantFeature(t *testing.T) {
    t.Skip("Broken, will fix later")
    if importantFeature() != expected {
        t.Error("Failed")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Bad: Avoiding the problem
#[test]
#[ignore] // Broken, will fix later
fn test_important_feature() {
    assert_eq!(important_feature(), expected);
}
```

</details>

**Why this is wrong:**
- "Later" never comes
- Feature remains broken in use
- Accumulates technical debt

**Fix:** Fix the feature NOW or create a proper bug ticket with priority.

#### ❌ Don't: Lower Standards to Pass Tests

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Bad: Lowering performance requirements
def test_performance():
    start = time.time()
    result = slow_function()
    elapsed = time.time() - start
    # Changed from < 1.0 to < 10.0 just to make it pass
    assert elapsed < 10.0 # Lowered standards!
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Bad: Lowering performance requirements
test('performance', () => {
    const start = Date.now();
    const result = slowFunction();
    const elapsed = (Date.now() - start) / 1000;
    // Changed from < 1.0 to < 10.0 just to make it pass
    expect(elapsed).toBeLessThan(10.0); // Lowered standards!
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Bad: Lowering performance requirements
func TestPerformance(t *testing.T) {
    start := time.Now()
    result := slowFunction()
    elapsed := time.Since(start).Seconds()
    // Changed from < 1.0 to < 10.0 just to make it pass
    if elapsed >= 10.0 { // Lowered standards!
        t.Errorf("Performance degraded")
    }
    _ = result
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Bad: Lowering performance requirements
#[test]
fn test_performance() {
    let start = std::time::Instant::now();
    let result = slow_function();
    let elapsed = start.elapsed().as_secs_f64();
    // Changed from < 1.0 to < 10.0 just to make it pass
    assert!(elapsed < 10.0, "Lowered standards!"); // Lowered standards!
    let _ = result;
}
```

</details>

**Why this is wrong:**
- Degrades system quality
- Violates Performance priority (#4)
- Masks real performance issues

**Fix:** Optimize the code to meet the original benchmark.

#### ✅ Do: Fix Problems at Root Cause

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Good: Test reveals real issue, fix the code
def test_validate_email():
    """Test email validation handles subdomain addresses."""
    # Test fails because validation doesn't support subdomains
    # Fix approach: Update email validation regex
    assert validate_email("user@mail.company.com") == True
    assert validate_email("admin@internal.corp.example.com") == True
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Good: Test reveals real issue, fix the code
test('validate email', () => {
    // Test email validation handles subdomain addresses.
    // Test fails because validation doesn't support subdomains
    // Fix approach: Update email validation regex
    expect(validateEmail("user@mail.company.com")).toBe(true);
    expect(validateEmail("admin@internal.corp.example.com")).toBe(true);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Good: Test reveals real issue, fix the code
func TestValidateEmail(t *testing.T) {
    // Test email validation handles subdomain addresses.
    // Test fails because validation doesn't support subdomains
    // Fix approach: Update email validation regex
    result, _ := ValidateEmail("user@mail.company.com", true)
    if !result {
        t.Error("Expected true for subdomain email")
    }
    result, _ = ValidateEmail("admin@internal.corp.example.com", true)
    if !result {
        t.Error("Expected true for multi-level subdomain email")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Good: Test reveals real issue, fix the code
#[test]
fn test_validate_email() {
    // Test email validation handles subdomain addresses.
    // Test fails because validation doesn't support subdomains
    // Fix approach: Update email validation regex
    assert!(validate_email("user@mail.company.com", true).unwrap());
    assert!(validate_email("admin@internal.corp.example.com", true).unwrap());
}
```

</details>

# Implementation fix:
def validate_email(email: str) -> bool:
 """
 Validate email with subdomain support.

 Root cause fixed: Regex didn't support multi-level subdomains.
 Solution: Updated to RFC 5322 compliant pattern.

 Priority: Usability #2 - Accept valid formats users expect
 """
 pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
 return bool(re.match(pattern, email))
```

### Alignment with GUIDE_DEV.md Error Fixing

**This testing error-fixing approach directly implements the Error Fixing Philosophy from GUIDE_DEV.md:**

- ✅ **Root cause analysis is MANDATORY** - Never skip analysis
- ✅ **Follow 5 priorities in order** - Security 🔒 Usability 👤 Maintainability 🔧 Performance ⚡ Extensibility 🔌
- ✅ **Never remove features** - Fix bugs, don't delete functionality
- ✅ **No workarounds** - Proper solutions only
- ✅ **No rigged tests** - Tests must verify real behavior
- ✅ **Document fixes** - Explain WHY in code and commits
- ✅ **Add regression tests** - Prevent the bug from returning

**For complete error fixing philosophy, see GUIDE_DEV.md "Error Fixing Philosophy" section.**

---

*This document is living and should be updated as new testing patterns and best practices emerge. It serves as the definitive guide for all eXonware ecosystem testing.*


