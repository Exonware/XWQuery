# eXonware Development Guide (GUIDE_31_DEV)

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 07-Feb-2026 12:00:00.000

## 📋 AI-Friendly Document

**This document is designed for both human developers and AI assistants.** It defines **code implementation standards** for eXonware projects. For platform-wide rules (Five Priorities, REF/LOG placement, versioning, lazy install), see `GUIDE_00_MASTER.md` — it governs everything and is the tie-breaker when guides conflict.

**Related Documents:**
- **[GUIDE_00_MASTER.md](GUIDE_00_MASTER.md)** — **Master standards and platform-wide constraints** (Five Priorities, REF/LOG placement, lazy install mandate, versioning rules, documentation placement). **MASTER governs everything.**
- [GUIDE_13_ARCH.md](GUIDE_13_ARCH.md) — Architecture playbook (layering, roadmap, compliance)
- [GUIDE_11_COMP.md](GUIDE_11_COMP.md) — Compliance program execution
- [GUIDE_51_TEST.md](GUIDE_51_TEST.md) — Testing implementation and runner architecture
- [GUIDE_41_DOCS.md](GUIDE_41_DOCS.md) — Documentation standards and templates
- [GUIDE_21_PLAN.md](GUIDE_21_PLAN.md) — Development lifecycle and planning
- [GUIDE_61_DEP.md](GUIDE_61_DEP.md) — Release and deployment

---

## Quick Start

- **Use this guide when:**
  - You are writing, reviewing, or refactoring code in any eXonware library or tool.
  - You need to understand how Five Priorities (see `GUIDE_00_MASTER.md`) apply to code implementation decisions.
  - You are fixing bugs and need to follow the root-cause analysis discipline.
- **You are responsible for:**
  - Writing code that follows Five Priorities in order (Security → Usability → Maintainability → Performance → Extensibility) per `GUIDE_00_MASTER.md`.
  - Never removing features; always fixing root causes instead of workarounds.
  - Using xwsystem utilities instead of reinventing functionality (check xwsystem first).
  - Including full file path comments at the top of every file.
  - Following project structure, code quality standards, and patterns defined in this guide.
- **You are NOT responsible for:**
  - Platform-wide rules (Five Priorities definition, REF/LOG placement, lazy install mandate, versioning philosophy) — owned by `GUIDE_00_MASTER.md`.
  - Writing individual test implementations — owned by `GUIDE_51_TEST.md`.
  - Deciding documentation placement or templates — owned by `GUIDE_41_DOCS.md`.
  - Planning the full lifecycle or release mechanics — owned by `GUIDE_21_PLAN.md`, `GUIDE_61_DEP.md`.
  - Architecture decisions — owned by `GUIDE_13_ARCH.md`.
- **Main outputs:**
  - Code that follows eXonware standards and patterns.
  - Supporting artifacts (tests, docs, change logs) when applicable.

---

## Persona

- **Role:** Lead Developer — defines code implementation standards, patterns, and practices for eXonware projects.
- **Primary Inputs:**
  - Platform-wide constraints (`GUIDE_00_MASTER.md` — Five Priorities, REF/LOG placement, lazy install, versioning)
  - Architecture constraints (`GUIDE_13_ARCH.md` — layering, roadmap, compliance)
  - Requirements (`docs/REF_PROJECT.md`) and plans (`docs/logs/plans/PLAN_*`)
  - Failures and regressions (tests/bench/debug outputs)
- **Primary Outputs:**
  - Code implementation standards (structure, patterns, code quality rules)
  - Code changes that follow the standards (features/fixes)
  - Supporting artifacts: tests (per `GUIDE_51_TEST.md`), docs (per `GUIDE_41_DOCS.md`), change logs when applicable

## Table of Contents

1. [Core Development Philosophy](#core-development-philosophy)
2. [Project Structure & Organization](#project-structure--organization)
3. [Code Quality Standards](#code-quality-standards)
4. [Testing Strategy](#testing-strategy)
5. [Documentation Standards](#documentation-standards)
6. [Version Management](#version-management)
7. [Import & Dependency Management](#import--dependency-management)
8. [eXonware Ecosystem Architecture](#exonware-ecosystem-architecture)
9. [Security & Performance](#security--performance)
10. [Code Review & CI/CD Standards](#code-review--cicd-standards)
11. [AI Development Guidelines](#ai-development-guidelines)
12. [Library-Specific Patterns](#library-specific-patterns)
13. [Core-Facade Development Strategy](#core-facade-development-strategy)
14. [Development Environment](#development-environment)
15. [Release & Publishing](#release--publishing)

---

## Core Development Philosophy

**Five Priorities:** See `GUIDE_00_MASTER.md` (Five Priorities Invariant) for the canonical definition. DEV applies these priorities to code implementation decisions in this order: Security → Usability → Maintainability → Performance → Extensibility.

### Core Principles
- **Never remove features** - Always preserve existing functionality; never take out features that are already implemented
- **Never reinvent the wheel** - Reuse code from exonware libraries (especially xwsystem) or external Python libs (if unique size is <1.5MB) to leverage proven solutions and reduce maintenance burden
- **Always use xwsystem utilities** - **MANDATORY: Never manually implement functionality that exists in xwsystem. Always check xwsystem first and use existing utilities (e.g., `ensure_utf8_console()` for Windows UTF-8 configuration, not manual `io.TextIOWrapper` setup)**
- **Think and design thoroughly** - Spend more time thinking and designing features rather than writing extensive code to prevent architectural debt and ensure long-term maintainability
- **Simple, concise solutions** - Value simple, concise solutions when implementing features to reduce complexity and improve developer productivity
- ** quality** - Build long-term, clean, extensible, maintainable code to ensure enterprise readiness and reduce technical debt
- **Challenge ideas** - Prefer challenging rather than just agreeing to ensure robust solutions and avoid groupthink
- **Fix root causes** - Never remove features; always resolve root causes instead of using workarounds to maintain system integrity and prevent technical debt accumulation
- **Never permanently delete files** - Move to '_delete' folder if removal needed to maintain audit trail and enable recovery if needed
- **Include full file path at the top commented** - Always add the full file path as a comment at the top of every file for better traceability: #exonware/xwsystem/... etc

### Error Fixing Philosophy

**⚠️ CRITICAL: Root Cause Analysis is MANDATORY**

When fixing errors, bugs, or test failures, you **MUST** follow this approach:

#### **The 5-Priority Root Cause Method**

Every fix must be evaluated against eXonware's 5 core priorities in order:

1. **Security First** (Priority #1)
 - Is this error exposing a security vulnerability?
 - Does the fix introduce new security risks?
 - Have we validated input/output security?
 - Are we following OWASP Top 10 guidelines?

2. **Usability Impact** (Priority #2)
 - Does the fix improve user experience?
 - Are error messages clear and helpful?
 - Is the API still intuitive after the fix?
 - Have we considered developer experience?

3. **Maintainability** (Priority #3)
 - Is the fix clean and well-structured?
 - Does it follow design patterns?
 - Will future developers understand this code?
 - Have we added proper documentation?

4. **Performance** (Priority #4)
 - Does the fix maintain or improve performance?
 - Have we benchmarked the solution?
 - Are we introducing performance regressions?
 - Is the solution efficient?

5. **Extensibility** (Priority #5)
 - Does the fix maintain extensibility?
 - Can this be extended in the future?
 - Have we used proper abstractions?
 - Is the solution flexible?

#### **Forbidden Error Fixing Anti-Patterns**

**? NEVER DO THESE:**

1. **Don't use `pass` to silence errors:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Hiding the problem
try:
    complex_operation()
except Exception:
    pass # Error hidden, problem persists!
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Hiding the problem
try {
    complexOperation();
} catch (e) {
    // Error hidden, problem persists!
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Hiding the problem
func badExample() {
    if err := complexOperation(); err != nil {
        // Error hidden, problem persists!
        _ = err
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Hiding the problem
fn bad_example() {
    let _ = complex_operation(); // Error ignored, problem persists!
}
```

</details>

2. **Don't remove features to fix bugs:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Removing functionality
# def problematic_feature():
# # Commented out because it had a bug
# pass
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Removing functionality
// function problematicFeature() {
//     // Commented out because it had a bug
// }
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Removing functionality
// func problematicFeature() {
//     // Commented out because it had a bug
// }
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Removing functionality
// fn problematic_feature() {
//     // Commented out because it had a bug
// }
```

</details>

3. **Don't use workarounds instead of fixes:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Working around the issue
if not is_broken():
    do_operation()
# Should fix why it's broken, not skip it
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Working around the issue
if (!isBroken()) {
    doOperation();
}
// Should fix why it's broken, not skip it
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Working around the issue
if !isBroken() {
    doOperation()
}
// Should fix why it's broken, not skip it
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Working around the issue
if !is_broken() {
    do_operation();
}
// Should fix why it's broken, not skip it
```

</details>

4. **Don't rig tests to pass:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Test always passes
def test_important_feature():
    try:
        important_feature()
        assert True # Meaningless assertion
    except:
        pass # Swallows failures
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Test always passes
test('important feature', () => {
    try {
        importantFeature();
        expect(true).toBe(true); // Meaningless assertion
    } catch {
        // Swallows failures
    }
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Test always passes
func TestImportantFeature(t *testing.T) {
    err := importantFeature()
    if err != nil {
        // Swallows failures
        return
    }
    // Meaningless assertion
    if true {
        t.Log("Passed")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Test always passes
#[test]
fn test_important_feature() {
    let _ = important_feature(); // Swallows failures
    assert!(true); // Meaningless assertion
}
```

</details>

5. **Don't ignore error messages:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Suppressing warnings
import warnings
warnings.filterwarnings("ignore") # Hiding problems
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Suppressing warnings
process.removeAllListeners('warning'); // Hiding problems
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Suppressing warnings
// Go doesn't have warnings, but don't ignore errors
_ = problematicFunction() // Hiding problems
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Suppressing warnings
#![allow(warnings)] // Hiding problems
```

</details>

6. **Don't use generic exception handling:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Catching everything
try:
    operation()
except: # Catches ALL exceptions, even KeyboardInterrupt
    return None
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Catching everything
try {
    operation();
} catch {
    // Catches ALL errors, even system errors
    return null;
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Ignoring all errors
func badExample() {
    _ = operation() // Ignores all errors
    return nil
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Catching everything
fn bad_example() -> Option<()> {
    let _ = operation(); // Ignores all errors
    None
}
```

</details>

7. **Don't hide errors with pytest flags:**
 ```bash
 # ? BAD: Hiding warnings and errors
 pytest --disable-warnings # Hides real problems!
 pytest --maxfail=10 # Continues after failures, masks issues!
 pytest --tb=no # Hides tracebacks!
 pytest -q # Too quiet, hides important info!
 ```

8. **Don't suppress warnings in configuration:**
 ```ini
 # ? BAD: pytest.ini
 [tool:pytest]
 addopts = --disable-warnings # Hiding problems!
 filterwarnings = ignore # Suppressing all warnings!
 ```

9. **Don't skip tests to avoid failures:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? BAD: Avoiding the problem
@pytest.mark.skip("Broken, will fix later")
def test_critical_feature():
    pass

@pytest.mark.xfail(reason="Known issue")
def test_important_validation():
    pass
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? BAD: Avoiding the problem
test.skip('critical feature', () => {
    // Broken, will fix later
});

test('important validation', () => {
    // Known issue - test expected to fail
    expect(importantValidation()).toBe(false);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? BAD: Avoiding the problem
func TestCriticalFeature(t *testing.T) {
    t.Skip("Broken, will fix later")
}

func TestImportantValidation(t *testing.T) {
    // Known issue - test expected to fail
    if importantValidation() {
        t.Error("Expected failure")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? BAD: Avoiding the problem
#[test]
#[ignore] // Broken, will fix later
fn test_critical_feature() {
    // Test skipped
}

#[test]
fn test_important_validation() {
    // Known issue - test expected to fail
    assert!(!important_validation());
}
```

</details>

10. **Don't use environment variables to hide issues:**
 ```bash
 # ? BAD: Hiding warnings
 export PYTHONWARNINGS=ignore
 export PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
 ```

#### **Forbidden pytest Flags & Configurations**

**❌ NEVER USE THESE - They hide real problems:**

**See [GUIDE_51_TEST.md - Forbidden pytest Flags](GUIDE_51_TEST.md#forbidden-pytest-flags--configurations) for complete list and explanations.**

**Key forbidden flags:**
- `--disable-warnings` - Hides warnings that indicate real issues
- `--maxfail=10` - Continues after failures, masks cascading issues
- `--tb=no` - Hides tracebacks needed for debugging
- `@pytest.mark.skip` - Avoids running tests instead of fixing them

**? ALLOWED:** `-v`, `--tb=short`, `--maxfail=1` or `-x`, `--strict-markers`, `-m`, `--lf`, `--ff`, `--cov`, `-s`, `-l`

#### **Correct Error Fixing Approach**

**? ALWAYS DO THIS:**

1. **Identify root cause:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? GOOD: Understanding the problem
def fix_validation_error():
    # Root cause: Email validation regex doesn't handle subdomains
    # Fix: Update regex pattern to be more comprehensive
    pattern = r'^[^@]+@[^@]+\.[^@]+' # Old
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' # Fixed
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? GOOD: Understanding the problem
function fixValidationError(): void {
    // Root cause: Email validation regex doesn't handle subdomains
    // Fix: Update regex pattern to be more comprehensive
    const oldPattern = /^[^@]+@[^@]+\.[^@]+/; // Old
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Fixed
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? GOOD: Understanding the problem
func fixValidationError() {
    // Root cause: Email validation regex doesn't handle subdomains
    // Fix: Update regex pattern to be more comprehensive
    oldPattern := regexp.MustCompile(`^[^@]+@[^@]+\.[^@]+`) // Old
    pattern := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`) // Fixed
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? GOOD: Understanding the problem
fn fix_validation_error() {
    // Root cause: Email validation regex doesn't handle subdomains
    // Fix: Update regex pattern to be more comprehensive
    let old_pattern = Regex::new(r"^[^@]+@[^@]+\.[^@]+").unwrap(); // Old
    let pattern = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap(); // Fixed
}
```

</details>

2. **Fix the actual problem:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? GOOD: Fixing the issue
def process_data(data):
    # Root cause: Data can be None
    # Fix: Add proper validation
    if data is None:
        raise ValueError("Data cannot be None")
    return transform(data)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? GOOD: Fixing the issue
function processData(data: any): any {
    // Root cause: Data can be null/undefined
    // Fix: Add proper validation
    if (data === null || data === undefined) {
        throw new Error("Data cannot be null or undefined");
    }
    return transform(data);
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? GOOD: Fixing the issue
func processData(data interface{}) (interface{}, error) {
    // Root cause: Data can be nil
    // Fix: Add proper validation
    if data == nil {
        return nil, fmt.Errorf("data cannot be nil")
    }
    return transform(data), nil
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? GOOD: Fixing the issue
fn process_data(data: Option<Value>) -> Result<Value, Box<dyn std::error::Error>> {
    // Root cause: Data can be None
    // Fix: Add proper validation
    let data = data.ok_or("Data cannot be None")?;
    Ok(transform(data))
}
```

</details>

3. **Add proper error handling:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? GOOD: Specific exception handling
try:
    result = parse_config(file_path)
except FileNotFoundError:
    logger.error(f"Config file not found: {file_path}")
    raise ConfigurationError(f"Missing required config: {file_path}")
except yaml.YAMLError as e:
    logger.error(f"Invalid YAML in {file_path}: {e}")
    raise ConfigurationError(f"Invalid config format: {e}")
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? GOOD: Specific exception handling
try {
    const result = parseConfig(filePath);
} catch (e) {
    if (e.code === 'ENOENT') {
        logger.error(`Config file not found: ${filePath}`);
        throw new ConfigurationError(`Missing required config: ${filePath}`);
    } else if (e instanceof YAMLError) {
        logger.error(`Invalid YAML in ${filePath}: ${e.message}`);
        throw new ConfigurationError(`Invalid config format: ${e.message}`);
    }
    throw e;
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? GOOD: Specific exception handling
result, err := parseConfig(filePath)
if err != nil {
    if os.IsNotExist(err) {
        logger.Error(fmt.Sprintf("Config file not found: %s", filePath))
        return nil, fmt.Errorf("missing required config: %s", filePath)
    } else if yamlErr, ok := err.(*yaml.YAMLError); ok {
        logger.Error(fmt.Sprintf("Invalid YAML in %s: %v", filePath, yamlErr))
        return nil, fmt.Errorf("invalid config format: %v", yamlErr)
    }
    return nil, err
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? GOOD: Specific exception handling
match parse_config(file_path) {
    Ok(result) => result,
    Err(e) => {
        if e.kind() == std::io::ErrorKind::NotFound {
            logger.error(&format!("Config file not found: {}", file_path));
            return Err(ConfigurationError::new(&format!("Missing required config: {}", file_path)));
        } else if let Some(yaml_err) = e.downcast_ref::<serde_yaml::Error>() {
            logger.error(&format!("Invalid YAML in {}: {}", file_path, yaml_err));
            return Err(ConfigurationError::new(&format!("Invalid config format: {}", yaml_err)));
        }
        Err(e.into())
    }
}
```

</details>

4. **Write tests that prevent regression:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# ? GOOD: Test the fix
def test_email_validation_handles_subdomains():
    """Ensure email validation supports subdomain addresses."""
    # This test failed before the fix
    assert validate_email("user@mail.company.com") == True
    assert validate_email("admin@internal.corp.example.com") == True
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// ? GOOD: Test the fix
test('email validation handles subdomains', () => {
    // Ensure email validation supports subdomain addresses.
    // This test failed before the fix
    expect(validateEmail("user@mail.company.com")).toBe(true);
    expect(validateEmail("admin@internal.corp.example.com")).toBe(true);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ? GOOD: Test the fix
func TestEmailValidationHandlesSubdomains(t *testing.T) {
    // Ensure email validation supports subdomain addresses.
    // This test failed before the fix
    result, _ := ValidateEmail("user@mail.company.com", true)
    if !result {
        t.Error("Expected true for user@mail.company.com")
    }
    result, _ = ValidateEmail("admin@internal.corp.example.com", true)
    if !result {
        t.Error("Expected true for admin@internal.corp.example.com")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// ? GOOD: Test the fix
#[test]
fn test_email_validation_handles_subdomains() {
    // Ensure email validation supports subdomain addresses.
    // This test failed before the fix
    assert!(validate_email("user@mail.company.com", true).unwrap());
    assert!(validate_email("admin@internal.corp.example.com", true).unwrap());
}
```

</details>

5. **Document WHY the fix was needed:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
def validate_email(email: str) -> bool:
    """
    Validate email address format.

    Root cause fixed: Previous regex didn't support multi-level subdomains
    (e.g., user@mail.company.com). Updated to RFC 5322 compliance.

    Priority alignment:
    - Security: Prevents injection via email field
    - Usability: Accepts valid email formats users expect
    - Maintainability: Clear regex pattern with explanation
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
/**
 * Validate email address format.
 * 
 * Root cause fixed: Previous regex didn't support multi-level subdomains
 * (e.g., user@mail.company.com). Updated to RFC 5322 compliance.
 * 
 * Priority alignment:
 * - Security: Prevents injection via email field
 * - Usability: Accepts valid email formats users expect
 * - Maintainability: Clear regex pattern with explanation
 */
function validateEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// ValidateEmail validates email address format.
//
// Root cause fixed: Previous regex didn't support multi-level subdomains
// (e.g., user@mail.company.com). Updated to RFC 5322 compliance.
//
// Priority alignment:
// - Security: Prevents injection via email field
// - Usability: Accepts valid email formats users expect
// - Maintainability: Clear regex pattern with explanation
func ValidateEmail(email string, allowSubdomains bool) (bool, error) {
    pattern := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
    return pattern.MatchString(email), nil
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
/// Validate email address format.
///
/// Root cause fixed: Previous regex didn't support multi-level subdomains
/// (e.g., user@mail.company.com). Updated to RFC 5322 compliance.
///
/// Priority alignment:
/// - Security: Prevents injection via email field
/// - Usability: Accepts valid email formats users expect
/// - Maintainability: Clear regex pattern with explanation
pub fn validate_email(email: &str, allow_subdomains: bool) -> Result<bool, String> {
    let pattern = Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap();
    Ok(pattern.is_match(email))
}
```

</details>

#### **Error Fixing Workflow**

**Step-by-step process:**

1. **Reproduce the error** - Understand exactly when/how it occurs
2. **Analyze root cause** - Don't stop at symptoms, find the real problem
3. **Evaluate against 5 priorities** - How does the fix impact each priority?
4. **Design proper solution** - Address root cause, not symptoms
5. **Implement with tests** - Write tests that would have caught this
6. **Document the fix** - Explain WHY this was needed
7. **Verify no regressions** - Run full test suite
8. **Review against priorities** - Final check against all 5 priorities

#### **Examples: Right vs Wrong**

**Scenario: Test fails because function returns None unexpectedly**

? **Wrong Approach:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Just make the test pass
def test_get_user():
    user = get_user("test@example.com")
    if user is None:
        pass # Ignore the failure
    else:
        assert user.email == "test@example.com"
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Just make the test pass
test('get user', () => {
    const user = getUser("test@example.com");
    if (user === null) {
        // Ignore the failure
    } else {
        expect(user.email).toBe("test@example.com");
    }
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Just make the test pass
func TestGetUser(t *testing.T) {
    user := getUser("test@example.com")
    if user == nil {
        // Ignore the failure
        return
    }
    if user.Email != "test@example.com" {
        t.Error("Email mismatch")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Just make the test pass
#[test]
fn test_get_user() {
    let user = get_user("test@example.com");
    if user.is_none() {
        // Ignore the failure
        return;
    }
    assert_eq!(user.unwrap().email, "test@example.com");
}
```

</details>

? **Right Approach:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Fix the root cause: get_user() should never return None for valid emails
def get_user(email: str) -> User:
    """
    Get user by email.

    Root cause fixed: Function returned None when user not in cache.
    Now properly queries database as fallback.

    Raises:
    UserNotFoundError: If user doesn't exist in system
    """
    # Check cache first
    user = cache.get(email)
    if user:
        return user

    # Fallback to database
    user = db.query_user(email)
    if user is None:
        raise UserNotFoundError(f"User not found: {email}")

    # Cache for next time
    cache.set(email, user)
    return user

def test_get_user_from_database():
    """Test that get_user queries database when not in cache."""
    clear_cache() # Ensure not in cache
    user = get_user("test@example.com")
    assert user.email == "test@example.com"

def test_get_user_raises_when_not_exists():
    """Test that get_user raises proper error for non-existent users."""
    with pytest.raises(UserNotFoundError):
        get_user("nonexistent@example.com")
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Fix the root cause: getUser() should never return null for valid emails
function getUser(email: string): User {
    /**
     * Get user by email.
     * 
     * Root cause fixed: Function returned null when user not in cache.
     * Now properly queries database as fallback.
     * 
     * @throws UserNotFoundError if user doesn't exist in system
     */
    // Check cache first
    let user = cache.get(email);
    if (user) {
        return user;
    }

    // Fallback to database
    user = db.queryUser(email);
    if (user === null) {
        throw new UserNotFoundError(`User not found: ${email}`);
    }

    // Cache for next time
    cache.set(email, user);
    return user;
}

test('get user from database', () => {
    // Test that getUser queries database when not in cache.
    clearCache(); // Ensure not in cache
    const user = getUser("test@example.com");
    expect(user.email).toBe("test@example.com");
});

test('get user raises when not exists', () => {
    // Test that getUser raises proper error for non-existent users.
    expect(() => {
        getUser("nonexistent@example.com");
    }).toThrow(UserNotFoundError);
});
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// GetUser gets user by email.
//
// Root cause fixed: Function returned nil when user not in cache.
// Now properly queries database as fallback.
//
// Returns:
//   - User: The user if found
//   - error: UserNotFoundError if user doesn't exist in system
func GetUser(email string) (*User, error) {
    // Check cache first
    if user, ok := cache.Get(email); ok {
        return user, nil
    }

    // Fallback to database
    user, err := db.QueryUser(email)
    if err != nil {
        return nil, fmt.Errorf("user not found: %s", email)
    }

    // Cache for next time
    cache.Set(email, user)
    return user, nil
}

func TestGetUserFromDatabase(t *testing.T) {
    // Test that GetUser queries database when not in cache.
    clearCache() // Ensure not in cache
    user, err := GetUser("test@example.com")
    if err != nil {
        t.Fatal(err)
    }
    if user.Email != "test@example.com" {
        t.Error("Email mismatch")
    }
}

func TestGetUserRaisesWhenNotExists(t *testing.T) {
    // Test that GetUser raises proper error for non-existent users.
    _, err := GetUser("nonexistent@example.com")
    if err == nil {
        t.Error("Expected error for non-existent user")
    }
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
/// Get user by email.
///
/// Root cause fixed: Function returned None when user not in cache.
/// Now properly queries database as fallback.
///
/// # Returns
///
/// * `Ok(User)` - The user if found
/// * `Err(UserNotFoundError)` - If user doesn't exist in system
pub fn get_user(email: &str) -> Result<User, UserNotFoundError> {
    // Check cache first
    if let Some(user) = cache.get(email) {
        return Ok(user);
    }

    // Fallback to database
    match db.query_user(email) {
        Some(user) => {
            // Cache for next time
            cache.set(email, user.clone());
            Ok(user)
        }
        None => Err(UserNotFoundError::new(&format!("User not found: {}", email)))
    }
}

#[test]
fn test_get_user_from_database() {
    // Test that get_user queries database when not in cache.
    clear_cache(); // Ensure not in cache
    let user = get_user("test@example.com").unwrap();
    assert_eq!(user.email, "test@example.com");
}

#[test]
fn test_get_user_raises_when_not_exists() {
    // Test that get_user raises proper error for non-existent users.
    let result = get_user("nonexistent@example.com");
    assert!(result.is_err());
}
```

</details>

**Why this matters:**
- ? **Security**: Proper error handling prevents information leakage
- ? **Usability**: Clear errors help developers debug issues
- ? **Maintainability**: Future developers understand the logic
- ? **Performance**: Caching strategy is clear and efficient
- ? **Extensibility**: Easy to add more data sources

---

---

## Project Structure & Organization

### Standard Directory Structure

**MANDATORY: Library Root Directory Structure**

For all eXonware library-type projects (`xwsystem`, `xwnode`, `xwquery`, `xwdata`, `xwschema`, `xwaction`, `xwentity`), the root directory **MUST contain ONLY the following files and folders**:

```
library-name/ # Root directory
+-- .github/ # GitHub configuration
  +-- workflows/ # CI/CD workflows
+-- .gitignore # Git ignore rules
+-- LICENSE # MIT License
+-- MANIFEST.in # Package manifest (optional)
+-- pyproject.toml # Main package configuration
+-- pyproject.<library>.toml # Convenience wrapper configuration
+-- pytest.ini # Pytest configuration
+-- README.md # Main README (ONLY one in root)
+-- requirements.txt # Dependencies list
+-- docs/ # ALL documentation (except main README.md)
+-- examples/ # Usage examples
+-- src/ # Source code
  +-- exonware/
    +-- library_name/ # Main package
      +-- __init__.py # Package initialization
      +-- contracts.py # Enums and interfaces (REQUIRED)
      +-- errors.py # Module-specific errors (REQUIRED, file not folder)
      +-- base.py # Abstract classes (REQUIRED)
      +-- facade.py # Facade pattern implementation (REQUIRED)
      +-- defs.py # Type definitions and constants (REQUIRED)
      +-- config.py # Configuration classes (REQUIRED)
      +-- version.py # Version information (REQUIRED)
      +-- [modules]/ # Feature modules (as needed)
        +-- __init__.py
        +-- contracts.py # Module enums/interfaces (OPTIONAL)
        +-- errors.py # Module errors (OPTIONAL)
        +-- base.py # Module abstract classes (OPTIONAL)
        +-- facade.py # Module facade (OPTIONAL)
        +-- defs.py # Module definitions (OPTIONAL)
        +-- config.py # Module config (OPTIONAL)
    +-- library_name.py # Convenience alias
+-- tests/ # Test suite
 +-- __init__.py
 +-- conftest.py
 +-- runner.py # Main test runner
 +-- verify_installation.py
 +-- 0.core/ # Core functionality tests
 +-- 1.unit/ # Unit tests
 +-- 2.integration/ # Integration tests
 +-- 3.advance/ # Advance tests (v1.0.0+)
+-- rust/ # Rust core implementation (OPTIONAL; if present, MUST follow GUIDE_34_DEV_RUST.md)
```

**⚠️ CRITICAL RULES - Library Root Directory:**

**? ALLOWED at root level (ONLY these):**
1. `.github/` - GitHub configuration folder
2. `.gitignore` - Git ignore rules
3. `LICENSE` - MIT License file
4. `MANIFEST.in` - Package manifest (optional)
5. `pyproject.toml` - Main package configuration
6. `pyproject.<library>.toml` - Convenience wrapper configuration
7. `pytest.ini` - Pytest configuration
8. `README.md` - Main README (ONLY one allowed in root)
9. `requirements.txt` - Dependencies list
10. `docs/` - Documentation folder
11. `examples/` - Examples folder
12. `src/` - Source code folder
13. `tests/` - Test suite folder
14. `rust/` - Rust core implementation (OPTIONAL; if present, MUST follow `GUIDE_34_DEV_RUST.md`)

**? NOT ALLOWED at root level:**
- No other markdown files (all must be in `docs/`)
- No loose Python scripts
- No data files
- No log files
- No backup folders
- No temporary files
- No nested documentation
- No additional configuration files
- No session/summary files
- No migration folders (use internal structure)
- **Exception**: Hidden files like `.vscode/`, `.idea/` (IDE-specific, gitignored)

**Why this matters:**
- **Clean repository** - Easy to navigate and understand
- **Consistent structure** - All libraries follow same pattern
- **Professional presentation** - Enterprise-grade organization
- **Maintainability** - Clear separation of concerns
- **CI/CD compatibility** - Standard structure for automation

### File Organization Rules
- **Documentation**: ALL markdown files must be under `docs/` folder (except main README.md in root)
- **Tests**: ALL tests must be under `tests/` folder, organized into 4 layers:
 - `0.core/` - Core functionality tests
 - `1.unit/` - Unit tests
 - `2.integration/` - Integration tests
 - `3.advance/` - Advance tests (v1.0.0+)
- **Examples**: ALL examples must be under `examples/` folder
- **Source code**: ALL source code must be under `src/` folder
- **Import paths**: Always use `from exonware.library_name import <anything>` for library imports
- **No backward compatibility aliases** - As long as we are in phase 0.x, then never create backward compatibility aliases unless explicitly confirmed (Again, this is only valid in v <1 = NOT STABLE PHASES)

---

## Code Quality Standards

### Import Management

#### **Auto-Install Import Hook (xwsystem [lazy])**

The xwsystem import hook enables deterministic dependency resolution without extra boilerplate:

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Install with [lazy] extra
pip install xwsystem[lazy]

# Then just use normal Python imports!
import fastavro  # Installed on demand when missing
import protobuf  # Installed on demand when missing
import pandas    # Installed on demand when missing

# No try/except guards or HAS_* flags are required
# The import hook performs the installation once and caches the result
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Install with lazy support
npm install @exonware/xwsystem

// Then just use normal TypeScript imports!
import * as fastavro from 'fastavro';  // Installed on demand when missing
import * as protobuf from 'protobufjs';  // Installed on demand when missing
import * as pandas from 'pandas-js';  // Installed on demand when missing

// No try/catch guards or HAS_* flags are required
// The import hook performs the installation once and caches the result
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Install with lazy support
go get github.com/exonware/xwsystem

// Then just use normal Go imports!
import (
    "github.com/example/fastavro"  // Installed on demand when missing
    "github.com/example/protobuf"  // Installed on demand when missing
    "github.com/example/pandas"    // Installed on demand when missing
)

// No error guards or HAS_* flags are required
// The import hook performs the installation once and caches the result
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Add to Cargo.toml with lazy feature
// exonware-xwsystem = { version = "0.0.1", features = ["lazy"] }

// Then just use normal Rust imports!
use fastavro;  // Installed on demand when missing
use protobuf;  // Installed on demand when missing
use pandas;    // Installed on demand when missing

// No error guards or HAS_* flags are required
// The import hook performs the installation once and caches the result
```

</details>

**Key Engineering Properties:**
- Deterministic: A single line in `__init__.py` enables the behaviour for the package
- Transparent: Successful imports execute at native speed with no additional branching
- Maintainable: Code paths remain free of defensive import guardrails or sentinel flags
- Observable: Install activity is logged once, allowing follow-up actions if needed

#### **xwsystem Utilities - Always Use, Never Reinvent**

**⚠️ MANDATORY: Always check xwsystem for existing utilities before implementing any functionality**

xwsystem provides many common utilities that should **ALWAYS** be used instead of manual implementations:

**Common xwsystem Utilities:**

1. **UTF-8 Console Configuration (Windows):**
   ```python
   # ✅ ALWAYS USE xwsystem utility
   from exonware.xwsystem.console.cli import ensure_utf8_console
   ensure_utf8_console()
   
   # ❌ NEVER manually configure UTF-8
   # if sys.platform == "win32":
   #     sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
   #     sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
   ```

2. **Date/Time Utilities:**
   ```python
   # ✅ ALWAYS USE xwsystem utilities
   from exonware.xwsystem.utils.dt.formatting import get_datetime, get_date
   from exonware.xwsystem.utils.dt.parsing import parse_timestamp_milliseconds
   
   # ❌ NEVER manually implement date parsing/formatting
   ```

3. **String Utilities:**
   ```python
   # ✅ ALWAYS USE xwsystem utilities
   from exonware.xwsystem.utils.string import find_nth_occurrence
   
   # ❌ NEVER manually implement string operations
   ```

4. **Web Utilities:**
   ```python
   # ✅ ALWAYS USE xwsystem utilities
   from exonware.xwsystem.utils.web import extract_webpage_text, validate_url_accessible
   
   # ❌ NEVER manually implement URL validation or web scraping
   ```

5. **Test Runner Utilities:**
   ```python
   # ✅ ALWAYS USE xwsystem test runner utilities
   from exonware.xwsystem.utils.test_runner import TestRunner, DualOutput, format_path
   
   # ❌ NEVER manually implement test runner output formatting
   ```

**Why this matters:**
- **Consistency** - Same behavior across all eXonware projects
- **Maintainability** - Single source of truth, easier to update
- **Quality** - xwsystem utilities are tested and proven
- **Reduced duplication** - Follows "Never reinvent the wheel" principle
- **Future-proof** - Updates to xwsystem automatically benefit all projects

**Before implementing any functionality:**
1. **Check xwsystem first** - Search for existing utilities
2. **Use xwsystem utilities** - Import and use existing functions
3. **Only implement if missing** - Only create new code if xwsystem doesn't have it
4. **Contribute back** - If you create something useful, consider adding it to xwsystem

#### **Import Rules**
- **Explicit imports only** - No wildcard or fallback imports
- **Complete dependencies** - All formats and their dependencies must be included
- **NO TRY/EXCEPT FOR IMPORTS** - **CRITICAL: Never use try/except blocks for imports. With [lazy] extra, the import hook handles missing packages automatically. Without [lazy], all dependencies must be explicitly declared in requirements. This prevents hidden runtime errors and ensures clean, maintainable code.**
- **NO HAS_* FLAGS** - Don't create `HAS_LIBRARY` flags to check if packages are available. The import hook makes this unnecessary.
- **NO CONDITIONAL IMPORTS** - Import libraries directly. The hook handles missing packages automatically if [lazy] is installed.

#### **3 Installation Modes (MANDATORY for ALL packages)**

All eXonware packages (xwsystem, xwnode, xwdata, xwschema, xwaction, xwentity) and any package using lazy installation **MUST** support 3 installation modes:

**pyproject.toml Structure:**
```toml
[project]
dependencies = [
 "exonware-xwsystem>=0.0.1", # Core dependency
]

[project.optional-dependencies]
lazy = [
 "exonware-xwsystem[lazy]>=0.0.1", # Lazy mode
]

full = [
 "pandas>=2.0.0",
 "numpy>=1.24.0",
 # ... all optional dependencies
]
```

**Installation Modes:**
1. **LITE (default):** `pip install package` - Core dependencies only, minimal footprint
2. **LAZY:** `pip install package[lazy]` - Auto-install on demand, recommended for development
3. **FULL:** `pip install package[full]` - All dependencies pre-installed, recommended for use

**__init__.py Configuration (MANDATORY):**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Around line 84 in __init__.py
from exonware.xwsystem.utils.lazy_discovery import config_package_lazy_install_enabled
config_package_lazy_install_enabled("package_name") # Auto-detect from installation
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Around line 84 in index.ts
import { configPackageLazyInstallEnabled } from '@exonware/xwsystem/utils/lazy-discovery';
configPackageLazyInstallEnabled("package_name"); // Auto-detect from installation
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Around line 84 in package.go
import "github.com/exonware/xwsystem/utils/lazy-discovery"

func init() {
    // Auto-detect from installation
    lazy_discovery.ConfigPackageLazyInstallEnabled("package_name")
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Around line 84 in lib.rs
use exonware_xwsystem::utils::lazy_discovery;

// Auto-detect from installation
lazy_discovery::config_package_lazy_install_enabled("package_name");
```

</details>

**Import Pattern (MANDATORY):**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Standard imports - NO try/except!
import pandas
import numpy
import scikit-learn

# NOT this:
# try:
# import pandas
# except ImportError:
# pandas = None
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Standard imports - NO try/catch!
import * as pandas from 'pandas-js';
import * as numpy from 'numpy-js';
import * as sklearn from 'scikit-learn-js';

// NOT this:
// let pandas;
// try {
//     pandas = require('pandas-js');
// } catch {
//     pandas = null;
// }
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Standard imports - NO error guards!
import (
    "github.com/example/pandas"
    "github.com/example/numpy"
    "github.com/example/sklearn"
)

// NOT this:
// var pandas interface{}
// if _, err := os.Stat("pandas"); err == nil {
//     pandas = loadPandas()
// }
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Standard imports - NO error guards!
use pandas;
use numpy;
use sklearn;

// NOT this:
// let pandas = match std::fs::metadata("pandas") {
//     Ok(_) => Some(load_pandas()),
//     Err(_) => None,
// };
```

</details>

### Serialization Standards

**⚠️ MANDATORY: Unified Serialization**

To ensure efficiency, speed, and overall quality, all eXonware libraries **MUST** utilize `xwsystem.io.serialization` for any TOML, YAML, XML, or JSON operations.

**Rules:**
- **NO direct usage** of `json`, `yaml`, `toml`, `xml`, `csv` standard libraries or third-party equivalents (e.g., `pyyaml`, `tomli`).
- **ALWAYS use** `xwsystem.io.serialization` or `xwsystem.io.serialization.auto_serializer.AutoSerializer`.
- **Why**: `xwsystem` provides a centralized, optimized, and secure layer for data serialization. It handles format detection, uses high-performance libraries (like `orjson`) under the hood, and ensures consistent error handling across the ecosystem.

**Usage Examples:**

**Python**

<details>
<summary><strong>Python</strong></summary>

```python
# ✅ GOOD: Using xwsystem AutoSerializer
from exonware.xwsystem.io.serialization.auto_serializer import AutoSerializer

serializer = AutoSerializer()

# Load from file (auto-detects format)
data = serializer.auto_load_file("config.yaml")

# Serialize to string
json_str = serializer.detect_and_serialize(data, format_hint="json")

# ✅ GOOD: Using specific optimized serializer (hot paths)
from exonware.xwsystem.io.serialization.serializer import _get_global_serializer

json_serializer = _get_global_serializer("json")
data = json_serializer.decode(json_string)

# ❌ BAD: Direct library usage
import json
import yaml

with open("config.yaml") as f:
    data = yaml.safe_load(f)  # Violation!
```

</details>

### Type Hints and Generic Types

**⚠️ MANDATORY: Python 3.12+ Required for Generic Types**

All eXonware libraries **MUST** use Python 3.12 or above to leverage built-in generic types. This requirement ensures modern type hinting capabilities and better code quality.

#### **Why Type Hints and Generic Types Matter**

Type hints and generic types are essential for:
- **Design Pattern Support** - Enable proper type contracts for interfaces, abstract classes, and strategy patterns
- **Code Quality** - Improve code readability, maintainability, and IDE support
- **Error Prevention** - Catch type-related errors at development time, not runtime
- **Documentation** - Self-documenting code that clearly expresses intent
- **Refactoring Safety** - Type checkers help ensure refactoring doesn't break contracts
- **Team Collaboration** - Clear type contracts improve communication between developers

#### **Python 3.12+ Built-in Generic Types (MANDATORY)**

**✅ ALWAYS USE:**
- `list[T]` instead of `typing.List[T]`
- `dict[K, V]` instead of `typing.Dict[K, V]`
- `tuple[T, ...]` or `tuple[T1, T2]` instead of `typing.Tuple[T, ...]`
- `set[T]` instead of `typing.Set[T]`
- `frozenset[T]` instead of `typing.FrozenSet[T]`
- `type[T]` instead of `typing.Type[T]`
- `int | str` instead of `typing.Union[int, str]`
- `collections.abc` types (e.g., `collections.abc.Sequence[T]`, `collections.abc.Mapping[K, V]`)

**❌ NEVER USE (Deprecated in Python 3.9+, Removed in Python 3.12+):**
- `typing.List` - Use `list` instead
- `typing.Dict` - Use `dict` instead
- `typing.Tuple` - Use `tuple` instead
- `typing.Set` - Use `set` instead
- `typing.FrozenSet` - Use `frozenset` instead
- `typing.Union` - Use `|` operator instead

#### **Forward References and `from __future__ import annotations`**

**⚠️ MANDATORY: Use `from __future__ import annotations` at the Top - DO NOT Use Quotes Around Forward References**

When using forward references in type annotations, you **MUST**:
1. Add `from __future__ import annotations` at the top of the file (first non-docstring line)
2. **DO NOT use quotes** around forward references when using `from __future__ import annotations`

**Why This Is Required:**

Python 3.10+ evaluates union types (`|` operator) during parsing/compilation. When you mix quoted forward references with unquoted types in a union, Python tries to evaluate the union at parse time:
- `dict | str | Path` creates a `UnionType` immediately
- Then `UnionType | 'XWSchema'` fails because you can't use `|` operator with a string literal at parse time
- Error: `TypeError: unsupported operand type(s) for |: 'types.UnionType' and 'str'`

**Solution: Use `from __future__ import annotations` + Remove Quotes**

`from __future__ import annotations` makes all annotations strings by default (PEP 563), deferring evaluation until type checkers need them. This allows using unquoted forward references in unions without parse-time errors.

**✅ Correct Pattern (WITH `from __future__ import annotations` + NO QUOTES):**

```python
#!/usr/bin/env python3
"""
#exonware/xwschema/src/exonware/xwschema/facade.py

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.2
Generation Date: 09-Nov-2025
"""

from __future__ import annotations  # ✅ MANDATORY: First non-docstring line

import asyncio
from typing import Any, Optional
from pathlib import Path

from exonware.xwdata import XWData

class XWSchema:
    def __init__(
        self,
        schema: dict | str | Path | XWSchema | XWData,  # ✅ NO QUOTES - Clean syntax!
        metadata: Optional[dict] = None,
    ):
        """Constructor with forward reference."""
        pass
    
    async def load(cls, path: str | Path) -> XWSchema:  # ✅ NO QUOTES - Clean return type!
        """Load schema from path."""
        pass
    
    def extract_properties(obj: Any) -> list[XWSchema]:  # ✅ NO QUOTES in generics!
        """Extract properties returning list of schemas."""
        pass
```

**❌ Incorrect Pattern 1 (Without `from __future__ import annotations`):**

```python
#!/usr/bin/env python3
"""
Module docstring
"""

import asyncio
from typing import Any, Optional
from pathlib import Path

from exonware.xwdata import XWData

class XWSchema:
    def __init__(
        self,
        schema: dict | str | Path | XWSchema | XWData,  # ❌ TypeError at parse time!
        metadata: Optional[dict] = None,
    ):
        """Constructor will fail - XWSchema not defined yet."""
        pass
```

**❌ Incorrect Pattern 2 (Using Quotes WITH `from __future__ import annotations`):**

```python
from __future__ import annotations

class XWSchema:
    def __init__(
        self,
        schema: dict | str | Path | 'XWSchema' | XWData,  # ❌ UNNECESSARY QUOTES!
        metadata: Optional[dict] = None,
    ):
        """Quotes are not needed when using __future__ annotations."""
        pass
    
    async def load(cls, path: str | Path) -> 'XWSchema':  # ❌ UNNECESSARY QUOTES!
        """Quotes are not needed in return types either."""
        pass
```

**⚠️ CRITICAL RULES:**

1. **✅ ALWAYS**: Add `from __future__ import annotations` at the top (first non-docstring line)
2. **✅ ALWAYS**: Remove quotes from forward references when using `from __future__ import annotations`
3. **✅ ALWAYS**: Use unquoted forward references in unions: `dict | str | XWSchema`
4. **✅ ALWAYS**: Use unquoted forward references in return types: `-> XWSchema`
5. **✅ ALWAYS**: Use unquoted forward references in generics: `list[XWSchema]`, `dict[str, XWSchema]`

**File Location:**

Place `from __future__ import annotations` as the **first non-docstring line** in the file:
1. Shebang (`#!/usr/bin/env python3`) - optional
2. Docstring (`"""..."""`) - module documentation
3. `from __future__ import annotations` - **MANDATORY first line after docstring**
4. Other imports - standard imports after `__future__`

**Why No Quotes When Using `from __future__ import annotations`:**

With `from __future__ import annotations`, Python treats ALL annotations as strings internally. This means:
- `XWSchema` is already a string internally (no need for quotes)
- Quotes are redundant and create inconsistent code style
- Unquoted forward references are cleaner and easier to read
- Type checkers properly resolve unquoted forward references

**Benefits:**

- **No parse-time errors** - Allows mixing forward references with unquoted types safely
- **Cleaner syntax** - No quotes needed anywhere in type annotations
- **Better type checking** - Type checkers properly resolve forward references
- **Consistent style** - All forward references look the same (no quotes)
- **Future-proof** - Aligns with PEP 563 (postponed evaluation of annotations)

**Priority Alignment:**
- **Maintainability (#3)** - Cleaner, more consistent type annotations
- **Usability (#2)** - Prevents confusing parse-time errors and improves readability
- **Extensibility (#5)** - Enables flexible forward reference patterns

**Example - Correct Usage:**

```python
from typing import Any, Optional, Union
from collections.abc import Sequence, Mapping, Callable

# ✅ GOOD: Python 3.12+ built-in generics
def process_data(
    items: list[str],
    metadata: dict[str, Any],
    coordinates: tuple[float, float],
    tags: set[str],
    handler: Callable[[str], int]
) -> dict[str, int]:
    """Process data with proper type hints."""
    results: dict[str, int] = {}
    for item in items:
        results[item] = handler(item)
    return results

# ✅ GOOD: Generic type parameters
class DataHandler[T]:
    """Generic handler supporting type parameters."""
    
    def __init__(self, data: list[T]):
        self.data: list[T] = data
    
    def transform[U](self, func: Callable[[T], U]) -> list[U]:
        """Transform data using generic type parameters."""
        return [func(item) for item in self.data]

# ✅ GOOD: Complex generic types
def merge_strategies(
    strategies: dict[str, Callable[[Any], Any]],
    default: Optional[Callable[[Any], Any]] = None
) -> Callable[[Any], Any]:
    """Merge multiple strategies with proper typing."""
    # Implementation...
    pass

# ❌ BAD: Deprecated typing module types
from typing import List, Dict, Tuple  # Don't use these!

def bad_example(
    items: List[str],  # ❌ Use list[str] instead
    metadata: Dict[str, Any],  # ❌ Use dict[str, Any] instead
    coords: Tuple[float, float]  # ❌ Use tuple[float, float] instead
) -> Dict[str, int]:  # ❌ Use dict[str, int] instead
    pass
```

#### **Type Hints for Design Patterns**

Type hints are crucial for implementing design patterns correctly:

**Strategy Pattern:**
```python
from typing import Protocol, TypeVar
from collections.abc import Callable

T = TypeVar('T')
R = TypeVar('R')

class SerializationStrategy(Protocol[T, R]):
    """Strategy interface with proper type hints."""
    def serialize(self, data: T) -> R: ...
    def deserialize(self, data: R) -> T: ...

class JsonStrategy(SerializationStrategy[dict[str, Any], str]):
    """JSON serialization strategy."""
    def serialize(self, data: dict[str, Any]) -> str:
        import json
        return json.dumps(data)
    
    def deserialize(self, data: str) -> dict[str, Any]:
        import json
        return json.loads(data)
```

**Factory Pattern:**
```python
from typing import TypeVar, Type, Protocol

T = TypeVar('T', bound='Serializable')

class Serializable(Protocol):
    """Interface for serializable objects."""
    def to_dict(self) -> dict[str, Any]: ...

class EntityFactory:
    """Factory with generic type support."""
    
    @staticmethod
    def create[T: Serializable](cls: Type[T], data: dict[str, Any]) -> T:
        """Create entity instance with type safety."""
        instance = cls.__new__(cls)
        # Initialize from data...
        return instance
```

**Repository Pattern:**
```python
from typing import TypeVar, Generic, Optional
from collections.abc import Sequence

T = TypeVar('T')

class Repository(Generic[T]):
    """Generic repository with type safety."""
    
    def find_by_id(self, id: str) -> Optional[T]:
        """Find entity by ID with proper return type."""
        # Implementation...
        pass
    
    def find_all(self) -> Sequence[T]:
        """Find all entities with proper sequence type."""
        # Implementation...
        pass
    
    def save(self, entity: T) -> T:
        """Save entity with type preservation."""
        # Implementation...
        return entity
```

**Observer Pattern:**
```python
from typing import TypeVar, Protocol, Callable
from collections.abc import Sequence

T = TypeVar('T')

class Observer(Protocol[T]):
    """Observer interface with generic event type."""
    def update(self, event: T) -> None: ...

class Subject(Generic[T]):
    """Subject with generic event type."""
    
    def __init__(self):
        self._observers: list[Observer[T]] = []
    
    def attach(self, observer: Observer[T]) -> None:
        """Attach observer with type safety."""
        self._observers.append(observer)
    
    def notify(self, event: T) -> None:
        """Notify all observers with typed event."""
        for observer in self._observers:
            observer.update(event)
```

#### **Type Hints Best Practices**

**1. Always Type Function Parameters and Return Values:**
```python
# ✅ GOOD: Complete type information
def calculate_total(items: list[dict[str, float]]) -> float:
    """Calculate total with full type hints."""
    return sum(item.get('price', 0.0) for item in items)

# ❌ BAD: Missing type information
def calculate_total(items):  # No type hints!
    return sum(item.get('price', 0) for item in items)
```

**2. Use Generic Type Variables for Reusable Code:**
```python
from typing import TypeVar, Generic

T = TypeVar('T')
U = TypeVar('U')

class Cache(Generic[T, U]):
    """Generic cache with key-value type parameters."""
    
    def __init__(self):
        self._store: dict[T, U] = {}
    
    def get(self, key: T) -> Optional[U]:
        """Get value with type safety."""
        return self._store.get(key)
    
    def set(self, key: T, value: U) -> None:
        """Set value with type safety."""
        self._store[key] = value
```

**3. Use Protocol for Structural Typing:**
```python
from typing import Protocol

class Readable(Protocol):
    """Protocol for readable objects."""
    def read(self) -> str: ...

def process_readable(source: Readable) -> str:
    """Process any readable object (duck typing with type safety)."""
    return source.read()
```

**4. Use Union and Optional Appropriately:**
```python
from typing import Union, Optional

# ✅ GOOD: Clear optional return
def find_user(email: str) -> Optional[dict[str, Any]]:
    """Find user, returns None if not found."""
    # Implementation...
    pass

# ✅ GOOD: Union for multiple types
def parse_value(value: Union[str, int, float]) -> float:
    """Parse value from multiple types."""
    if isinstance(value, str):
        return float(value)
    return float(value)
```

**5. Type Class Attributes:**
```python
class DataProcessor:
    """Processor with typed attributes."""
    
    def __init__(self):
        self.cache: dict[str, Any] = {}
        self.processors: list[Callable[[Any], Any]] = []
        self.metadata: Optional[dict[str, str]] = None
```

#### **Type Hints and Design Pattern Benefits**

**Why type hints enhance design patterns:**

1. **Interface Contracts** - Type hints make interface contracts explicit and enforceable
2. **Strategy Selection** - Generic types enable type-safe strategy pattern implementations
3. **Factory Type Safety** - Generic factories ensure created objects match expected types
4. **Repository Abstraction** - Generic repositories provide type-safe data access
5. **Observer Type Safety** - Generic observers ensure event types are correctly handled
6. **Decorator Composition** - Type hints ensure decorator chains maintain type contracts
7. **Adapter Compatibility** - Type hints verify adapter implementations match interfaces
8. **Proxy Type Preservation** - Generic proxies maintain original object types

#### **Migration from typing Module**

**When updating existing code:**

```python
# ❌ OLD (Python < 3.9)
from typing import List, Dict, Tuple, Set, Optional

def old_style(
    items: List[str],
    metadata: Dict[str, Any],
    coords: Tuple[float, float]
) -> Dict[str, int]:
    pass

# ✅ NEW (Python 3.12+)
from typing import Optional, Any  # Only import what's needed

def new_style(
    items: list[str],
    metadata: dict[str, Any],
    coords: tuple[float, float]
) -> dict[str, int]:
    pass
```

#### **Type Checking Tools**

**Recommended tools for type checking:**
- **mypy** - Static type checker for Python
- **pyright** - Fast type checker (used by Pylance)
- **pylance** - VS Code Python language server with type checking
- **ruff** - Fast linter with type checking capabilities

**Configuration example (pyproject.toml):**
```toml
[tool.mypy]
python_version = "3.12"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
```

#### **Interface Definition: Protocol vs ABC**

**⚠️ MANDATORY: Interfaces in contracts.py MUST use Protocol, not ABC**

All interfaces (classes starting with `I`) defined in `contracts.py` files **MUST** use `Protocol` from `typing` instead of `ABC` from `abc`. This is a critical architectural decision that provides significant advantages.

**Why Protocol instead of ABC for interfaces:**

1. **Structural typing (duck typing)** - Protocol checks structure, not inheritance. Any class with matching methods satisfies the protocol without needing to inherit from it
2. **Better type checking** - Works seamlessly with static type checkers (mypy, Pyright) and supports structural subtyping
3. **No runtime overhead** - Protocol is purely for type checking; ABC adds runtime checks and metaclass overhead
4. **Easier integration** - Works with existing classes without modification, perfect for adapting third-party libraries
5. **Modern Python practice** - Aligns with PEP 544 (Structural Subtyping) and is the recommended approach for interface definitions in modern Python
6. **Runtime checking (optional)** - Use `@runtime_checkable` decorator when runtime checks are needed

**Correct Interface Definition Pattern:**

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class IData(Protocol):
    """Interface for data operations."""
    
    async def get(self, path: str, default: Any = None) -> Any:
        """Get value at path."""
        ...
    
    async def set(self, path: str, value: Any) -> 'IData':
        """Set value at path."""
        ...
```

**Abstract Base Classes (base.py) continue using ABC:**

Abstract base classes in `base.py` files (e.g., `AData`, `AHandler`) **MUST** continue using `ABC` because they:
- Provide partial implementations
- Serve as base classes for inheritance
- Are fundamentally different from interfaces

**The distinction:**
- **Interfaces (`I*` in `contracts.py`)** → Use `Protocol` with `@runtime_checkable`
- **Abstract base classes (`A*` in `base.py`)** → Use `ABC` with `@abstractmethod`

**Example - Complete Pattern:**

```python
# contracts.py - Interface using Protocol
from typing import Protocol, runtime_checkable

@runtime_checkable
class IData(Protocol):
    """Interface for data operations."""
    async def get(self, path: str) -> Any: ...
    async def set(self, path: str, value: Any) -> 'IData': ...

# base.py - Abstract class using ABC
from abc import ABC, abstractmethod
from .contracts import IData

class AData(ABC, IData):
    """Abstract base class implementing IData interface."""
    
    @abstractmethod
    async def get(self, path: str) -> Any:
        """Get value at path."""
        pass
    
    @abstractmethod
    async def set(self, path: str, value: Any) -> 'IData':
        """Set value at path."""
        pass
```

**Migration from ABC to Protocol:**

When converting existing interfaces:
1. Replace `from abc import ABC, abstractmethod` with `from typing import Protocol, runtime_checkable`
2. Replace `class IInterface(ABC):` with `@runtime_checkable\nclass IInterface(Protocol):`
3. Remove `@abstractmethod` decorators
4. Replace `pass` with `...` (ellipsis) in method bodies

**Priority alignment:**
- **Usability (#2)** - Protocol enables easier integration and more flexible usage
- **Maintainability (#3)** - Better type checking and cleaner interface definitions
- **Extensibility (#5)** - Structural typing enables more flexible code design

#### **Type Hints Requirements**

**MANDATORY for all eXonware code:**
- ✅ All function parameters must have type hints
- ✅ All function return values must have type hints
- ✅ All class attributes must have type hints
- ✅ Use Python 3.12+ built-in generic types (`list`, `dict`, `tuple`, `set`)
- ✅ Use `typing` module only for types not available as built-ins (`Optional`, `Union`, `Protocol`, `TypeVar`, etc.)
- ✅ Use `collections.abc` for abstract base types (`Sequence`, `Mapping`, `Callable`, etc.)
- ✅ Use generic type parameters (`TypeVar`, `Generic`) for reusable code
- ✅ Use `Protocol` for structural typing and duck typing with type safety
- ✅ **Interfaces in contracts.py MUST use Protocol, not ABC**

**Priority alignment:**
- **Usability (#2)** - Type hints make code self-documenting and easier to use
- **Maintainability (#3)** - Type hints improve code maintainability and refactoring safety
- **Extensibility (#5)** - Generic types enable flexible, extensible code design

### Code Structure
- **Separation of concerns** - Enforce clear separation of concerns with dedicated modules
- **Design patterns** - Implement software design patterns: strategy-based, handler-based, engine-based
- **Dynamic handlers** - Use dynamic handlers for flexible system behavior
- **Abstract-first approach** - Move as much as possible to abstract classes for better extensibility
- **No separate core.py** - Don't create separate core.py files since __init__.py already properly imports from actual module structure
- **No examples.py in src/** - Examples should not be in the src/ directory structure

### Module Organization

**REQUIRED files at package root (`src/exonware/library_name/`):**
1. **`__init__.py`** - Package initialization and exports
2. **`contracts.py`** - All enums and interfaces (MANDATORY: Never use "protocols.py")
3. **`errors.py`** - All library-specific error classes (file, not folder)
4. **`base.py`** - All abstract classes and base implementations
5. **`facade.py`** - Facade pattern implementation (main public API)
6. **`defs.py`** - Type definitions, constants, enums
7. **`config.py`** - Configuration classes and settings
8. **`version.py`** - Version information (__version__, __author__, etc.)

**OPTIONAL files for sub-modules (`src/exonware/library_name/module_name/`):**
- **`contracts.py`** - Module-specific enums and interfaces (if needed)
- **`errors.py`** - Module-specific error classes (if needed)
- **`base.py`** - Module-specific abstract classes (if needed)
- **`facade.py`** - Module-specific facade (if needed)
- **`defs.py`** - Module-specific definitions (if needed)
- **`config.py`** - Module-specific configuration (if needed)

**File hierarchy rules:**
- Package root files are REQUIRED (all 8 files must exist)
- Sub-module files are OPTIONAL (create only when needed)
- Never mix module-specific and package-level code in the same file
- Each file serves a specific purpose following separation of concerns

### Naming Conventions
- **File naming**: snake_case (e.g., `data_handler.py`, `schema_validator.py`)
- **Class naming**: CapWord (e.g., `DataHandler`, `SchemaValidator`)
- **Library naming**: lowercase (e.g., `xwsystem`, `xnode`, `xdata`, `xschema`, `xwaction`, `xentity`)
- **Interface files**: **MANDATORY: Always use `contracts.py` - NEVER use `protocols.py`** (e.g., `contracts.py` for all enums and interfaces)
- **Interfaces**: `IClass` (e.g., `INode`, `IEdge`, `IDataHandler`) - **MANDATORY: All interfaces in contracts.py MUST use Protocol, not ABC**
- **Abstract classes**: `AClass` (e.g., `ANode`, `AEdge`, `ABaseHandler`) - **MANDATORY: All abstract classes in base.py files MUST start with 'A', use ABC, and extend interface class: AClass(IClass)**
- **Key classes**: `XWClass` (e.g., `XWNode`, `XWEdge`, `XWDataHandler`) - Rich design patterns supporting strategy-based, handler-based, engine-based features; `XW` prefix denotes canonical eXonware implementations exposed by facades
- **Handler classes**: Uppercase acronyms ending with `DataHandler` or `SchemaHandler` (e.g., `JSONDataHandler`, `CAPSBaseHandler`, `CAPSDataHandler`)

### Library vs Class Naming Rules
- **Library references**: Always use lowercase (e.g., `xwsystem`, `xnode`, `xdata`)
- **Class references**: Use CapWord with `XW` prefix for canonical classes (e.g., `XWNode`, `XWData`, `XWSchema`)
- **Import statements**: Use library names (lowercase) for imports
- **Class instantiation**: Use class names (CapWord) for creating objects

### Design Patterns

#### **Structural Patterns**
- **Facade pattern** - Mandatory outside xwsystem library for all future libs (xnode, xdata, xschema, xwaction, xentity). **Note: xwsystem is an exception** - it does not require a facade pattern as it serves as the foundation library
- **Adapter pattern** - For integrating incompatible interfaces and legacy systems
- **Decorator pattern** - For adding functionality to objects without altering their structure
- **Composite pattern** - For treating individual objects and compositions uniformly
- **Proxy pattern** - For controlling access to objects and adding lazy initialization
- **Bridge pattern** - For separating abstraction from implementation

#### **Creational Patterns**
- **Factory pattern** - For creating objects without specifying their exact classes
- **Abstract Factory pattern** - For creating families of related objects
- **Builder pattern** - For constructing complex objects step by step
- **Singleton pattern** - For ensuring only one instance exists (use sparingly)
- **Prototype pattern** - For creating objects by cloning existing instances
- **Object Pool pattern** - For reusing expensive-to-create objects
- **Lazy Initialization pattern** - Initialize objects only when first accessed for optimal performance
- **Lazy Loading pattern** - Load data only when needed to reduce memory usage
- **Virtual Proxy pattern** - Create placeholder objects that load actual data on demand
- **Lazy evaluation pattern** - Defer computation until results are actually needed

#### **Behavioral Patterns**
- **Strategy pattern** - For interchangeable algorithms and behaviors
- **Observer pattern** - For event-driven architectures and change notifications
- **Command pattern** - For encapsulating requests as objects
- **State pattern** - For managing object behavior based on internal state
- **Template Method pattern** - For defining algorithm skeletons with customizable steps
- **Chain of Responsibility pattern** - For passing requests along a chain of handlers
- **Mediator pattern** - For reducing coupling between communicating objects
- **Memento pattern** - For capturing and restoring object state
- **Visitor pattern** - For adding operations to object structures without modifying them
- **Iterator pattern** - For traversing collections without exposing internal structure

#### **Concurrency Patterns**
- **Producer-Consumer pattern** - For decoupling data production and consumption
- **Thread Pool pattern** - For managing thread lifecycle and resource usage
- **Actor pattern** - For message-passing concurrency and isolation
- **Lock pattern** - For synchronizing access to shared resources
- **Semaphore pattern** - For controlling access to limited resources
- **Barrier pattern** - For synchronizing multiple threads at specific points

#### **Architectural Patterns**
- **MVC (Model-View-Controller)** - For separating data, presentation, and control logic
- **MVP (Model-View-Presenter)** - For improved testability and separation of concerns
- **MVVM (Model-View-ViewModel)** - For data binding and reactive programming
- **Repository pattern** - For abstracting data access logic
- **Unit of Work pattern** - For managing transactions and data consistency
- **CQRS (Command Query Responsibility Segregation)** - For separating read and write operations
- **Event Sourcing pattern** - For storing state changes as a sequence of events
- **Microservices pattern** - For decomposing applications into independent services
- **API Gateway pattern** - For managing and routing client requests
- **Circuit Breaker pattern** - For preventing cascading failures in distributed systems

#### **Domain-Specific Patterns**
- **Handler pattern** - For dynamic request processing and routing
- **Engine pattern** - For complex processing workflows and pipelines
- **Plugin pattern** - For extensible architectures and modular functionality
- **Registry pattern** - For managing and locating services and components
- **Specification pattern** - For encapsulating business rules and criteria
- **Value Object pattern** - For representing immutable domain concepts
- **Aggregate pattern** - For maintaining data consistency in domain models
- **Factory Method pattern** - For creating domain objects with complex initialization

---

## Testing Strategy

**📖 For detailed testing implementation, see [GUIDE_51_TEST.md](GUIDE_51_TEST.md)**

### DEV Responsibilities for Testing

- **Write tests** that follow the structure and patterns defined in `GUIDE_51_TEST.md`.
- **Ensure tests pass** before submitting code (100% pass rate required per `GUIDE_00_MASTER.md`).
- **Fix root causes** when tests fail — never rig tests, skip failures, or remove features (see Error Fixing Philosophy below).
- **Use pytest** and follow the hierarchical runner architecture per `GUIDE_51_TEST.md`.

**Testing standards:**
- Tests must exist and pass for all code changes.
- Use `-x` or `--maxfail=1` for fast feedback; never hide warnings or failures.
- Root cause fixing only — no workarounds, no rigged tests, no removed features.

---

## Documentation Standards

**📖 For detailed documentation standards, templates, and placement rules, see [GUIDE_41_DOCS.md](GUIDE_41_DOCS.md)**

### DEV Responsibilities for Documentation

- **Place documentation** per `GUIDE_00_MASTER.md` and `GUIDE_41_DOCS.md`:
  - Only `README.md` at repository root.
  - All other Markdown under `docs/`.
  - Use templates from `GUIDE_41_DOCS.md` for REF/LOG artifacts.
- **Document code** with clear docstrings (Google style), inline comments explaining WHY, and examples.
- **Update docs** when code changes (keep docs in sync with implementation).

---

## Version Management

**📖 For versioning philosophy, ecosystem roadmap, and version control rules, see [GUIDE_00_MASTER.md](GUIDE_00_MASTER.md)**

### DEV Responsibilities for Versioning

- **Never change versions automatically** — Keep versions exactly as specified (no auto-bumps, no `.post1` suffixes).
- **Use Python 3.12+** — Required for built-in generic types; avoid mixing Python versions.
- **Use 'main' branch** — Default main branch in Git.
- **Follow versioning rules** per `GUIDE_00_MASTER.md` — Version 0.x requirements, no shortcuts to v1.0.

---

## Import & Dependency Management

**📖 For lazy installation mandate and integration requirements, see [GUIDE_00_MASTER.md](GUIDE_00_MASTER.md) (Lazy Installation Mandate)**

### DEV Responsibilities for Dependencies

- **Support lazy installation** — All eXonware packages MUST support 3 modes (lite/lazy/full) per `GUIDE_00_MASTER.md`.
- **Use explicit imports** — No wildcard imports; import dependencies directly (no `try/except ImportError`, no `HAS_*` flags).
- **Check xwsystem first** — Use xwsystem utilities instead of reinventing functionality.
- **Depend on exonware-xwsystem** — All packages must depend on `exonware-xwsystem>=0.0.1`.

**For lazy installation integration details** (pyproject.toml config, `__init__.py` setup, testing), see `GUIDE_00_MASTER.md` (Lazy Installation Mandate) and language-specific guides (`GUIDE_32_DEV_PY.md` for Python).

---

### Library Strategy
- **Why minimize imports** - Reduces dependency hell, simplifies deployment, and improves security by reducing attack surface
- **One library import rationale** - Instead of importing 10+ libraries, projects import ONE: xwsystem to achieve dependency consolidation and simplified maintenance
- **Why libraries** - Use libraries instead of custom implementations to leverage battle-tested solutions and reduce development time
- **External library criteria** (Why these criteria matter):
 - Check if library exists - Ensures reliability and community support
 - Use the most established, well-maintained library - Reduces risk of abandonment and security vulnerabilities
 - Wrap it with xwsystem security/validation - Adds enterprise-grade security and validation layers
 - Never rewrite what already exists - Avoids reinventing proven solutions and focuses on value-added features
 - Keep implementations short and delegate to experts - Maintains code simplicity while leveraging specialized expertise

### Package Structure
- **Package naming**: `exonware-libraryname` (pip install exonware-libraryname)
- **Main import path**: `import exonware.libraryname` with convenience alias `import libraryname`
- **Complete replacement**: All xlib references must be completely replaced with exonware throughout codebase, tests, and documentation
- **Dual structure**: Include both `src/exonware/libraryname/` (main package) and `src/libraryname.py` (convenience alias)

---

## eXonware Ecosystem Architecture

**📖 For ecosystem architecture, library relationships, core-facade strategy, and project categories, see [GUIDE_13_ARCH.md](GUIDE_13_ARCH.md)**

### DEV Responsibilities

- **Follow architecture constraints** per `GUIDE_13_ARCH.md` — don't contradict layering, roadmap, or compliance targets.
- **Implement core-facade pattern** when building libraries (see Core-Facade Development Strategy below).
- **Respect library dependencies** — use xwsystem utilities, follow library relationships defined in ARCH.

---

## Security & Performance

### Security Standards
- **OWASP Top 10 compliance** - Implement security based on OWASP Top 10 guidelines
- **Defense-in-depth** - Security should be built-in with defense-in-depth approach
- **Input validation** - All external input must be sanitized and validated
- **Path validation** - Include proper path validation and security checks
- **Cryptographic operations** - Use established cryptographic libraries (cryptography for Python, etc.)
- **Static analysis** - Use language-specific security tools (bandit for Python, etc.)

### Performance Optimization
- **Async-first design** - Implement async/await patterns for all I/O operations
- **Concurrent execution** - Use async patterns for parallel processing and non-blocking operations
- **Profiling requirements** - Profile critical code paths using language-specific tools
- **Performance budgets** - Set performance budgets for key API endpoints
- **Benchmarking** - Use tools like pytest-benchmark for performance measurement
- **Memory management** - Automatic memory leak prevention
- **Circuit breakers** - Implement circuit breakers for resilience
- **Monitoring** - Ready monitoring and performance tracking

### Async & Concurrency Standards
- **Async-first architecture** - Design all libraries with async support as the primary interface
- **Language-specific async patterns**:
 - **Python**: async/await, asyncio, async generators, async context managers
 - **Rust**: async/await, tokio, futures, async traits
 - **Go**: goroutines, channels, context, sync primitives
 - **TypeScript**: async/await, Promises, async iterators, async generators
- **Non-blocking I/O** - All file, network, and database operations must be async
- **Concurrent processing** - Use async patterns for parallel execution and batch operations
- **Async context management** - Proper resource cleanup in async environments
- **Error handling in async** - Comprehensive async exception handling and propagation
- **Lazy async initialization** - Combine lazy loading with async operations for optimal performance

---

## Code Review & CI/CD Standards

The full review process and senior-level checklist (for code and other artifacts) are defined in [GUIDE_35_REVIEW.md](GUIDE_35_REVIEW.md). This section focuses on implementation standards and what developers should do before requesting review.

### Pull Request Requirements
- **All changes via Pull Request** - No direct commits to main branch
- **Automated CI checks** - PR must pass all automated checks: tests, lint, type-check, docs build
- **Code review approval** - At least one code review approval required for merge (methodology: GUIDE_35_REVIEW, artifact type: Code)
- **Branch naming conventions** - Use feature/bugfix branch naming conventions
- **PR templates** - Use PR templates to ensure checklist compliance (tests, docs, changelog)

### Language-Specific Quality Tools
- **Python**: flake8, black, isort, mypy, pytest
- **Rust**: cargo fmt, clippy, cargo test
- **Go**: gofmt, go vet, go test
- **TypeScript**: eslint, prettier, tsc, jest

### CI/CD Requirements
- **All merges to main** require passing tests, type-check, lint, and docs build
- **PR template checklist**: tests, docs, changelog, issue reference
- **Security review** for all third-party dependencies
- **Dependabot integration** or equivalent for dependency updates

### Security in CI/CD
- **Static analysis** - Run language-specific security tools in CI
- **Dependency scanning** - Scan for known vulnerabilities
- **Secret scanning** - Prevent accidental secret commits
- **License compliance** - Ensure all dependencies have compatible licenses

---

## AI Development Guidelines

### AI Standards

**📖 For platform-wide AI standards (date formats, documentation placement, versioning), see [GUIDE_00_MASTER.md](GUIDE_00_MASTER.md)**

- **Follow DEV guidelines** — This guide defines code implementation standards; follow all sections for code work.
- **Follow MASTER for platform rules** — Five Priorities, REF/LOG placement, lazy install, versioning, date formats are governed by `GUIDE_00_MASTER.md`.
- **No bias manipulation** — Never use inline comments or marketing language to influence AI evaluation (e.g., "production-grade", "enterprise-ready", "bulletproof", "revolutionary").

### AI-Assisted Development
- **Review real code** - Always review real code before explaining; don't make assumptions
- **Direct IDE edits** - Make changes directly in IDE via file edits rather than inline snippets
- **Complete implementations** - Include all necessary imports and fix problems
- **Avoid repetition** - Don't repeat information already in function signatures (parameter types, optional annotations)
- **Follow naming conventions** - Use lowercase for libraries (xwsystem, xnode) and CapWord for canonical classes with the `XW` prefix (XWNode, XWData)
- **Apply design patterns** - Implement facade, strategy, handler, and engine patterns as specified
- **Enforce separation of concerns** - Organize code with contracts.p, errors.py, base.py structure

### AI Code Generation
- **Comprehensive solutions** - Provide complete, working solutions following all guidelines
- **Error handling** - Include proper error handling and edge cases
- **Documentation** - Generate comprehensive documentation alongside code
- **Testing** - Include test cases and validation using pytest and runners
- **Version compliance** - Ensure all work aligns with versioning philosophy (0.x until complete ecosystem)
- ** quality** - Build long-term, clean, extensible, maintainable code
- **Lazy installation integration** - **MANDATORY: ALL new packages MUST include lazy installation support with 3 installation modes (lite/lazy/full)**
- **Objective code comments** - Write factual, technical comments only; avoid marketing language or bias-inducing terms in code comments

### AI Documentation Standards

**📖 For documentation placement, templates, and standards, see [GUIDE_41_DOCS.md](GUIDE_41_DOCS.md)**

- **Include WHY explanations** — Don't just explain WHAT, explain WHY decisions were made.
- **AI-friendly format** — Structure content for both human and AI consumption.
- **Objective language** — Use factual, technical language; avoid marketing hyperbole or bias-inducing adjectives.

### AI Project Management

- **Follow project structure** — Use standard directory structure per this guide (Project Structure & Organization).
- **Apply versioning rules** — Respect versioning rules per `GUIDE_00_MASTER.md` (no automatic version changes).
- **Implement testing strategy** — Use runners and pytest per `GUIDE_51_TEST.md`.
- **Follow import management** — Use explicit imports, complete dependencies, libraries (see Import & Dependency Management above).

### AI Quality Assurance
- **Comprehensive review** - Check all output against every guideline in this document
- **Readiness** - Ensure all work meets standards
- **Consistency enforcement** - Maintain consistency across all deliverables
- **Guideline compliance** - Verify adherence to all rules and principles
- **Security validation** - Ensure all code follows OWASP Top 10 guidelines
- **Performance assessment** - Validate performance budgets and benchmarking requirements
- **Date accuracy** - Always use accurate, current dates in documentation, headers, and version information

### AI Date Accuracy Standards

**📖 For date formats and naming conventions, see [GUIDE_00_MASTER.md](GUIDE_00_MASTER.md) (Date and Naming Formats)**

- **Always use current dates** — Never use placeholder or outdated dates in any work.
- **Follow MASTER formats** — Use `DD-MMM-YYYY HH:MM:SS.mmm` for documentation headers; use `YYYYMMDD_HHMMSS_mmm` for time-sensitive log/test/review/bench/plan file names per `GUIDE_00_MASTER.md`.

### AI Base.py File Management Standards
- **CRITICAL: Never overwrite existing base.py files** - Always read and understand the existing base.py content before making any changes
- **Why this matters** - Base.py files often contain sophisticated, implementations that are imported and used throughout the system; overwriting them causes catastrophic failures
- **Always check existing imports** - Before modifying any base.py file, search the codebase for imports from that file to understand what classes and interfaces are being used
- **Base.py files must extend contracts.py interfaces** - All abstract classes in base.py must implement or extend the interfaces defined in the corresponding contracts.py file
- **Interface inheritance is mandatory** - Abstract classes in base.py should inherit from interfaces in contracts.py to ensure proper contract compliance
- **Preserve existing functionality** - When updating base.py files, preserve all existing classes, methods, and functionality; only add new features or fix bugs
- **Read before writing** - Always use read_file to examine the current content of base.py before making any modifications
- **Understand dependencies** - Use grep or codebase search to find all files that import from base.py to understand the impact of changes
- **Incremental changes only** - Make small, incremental changes to base.py files rather than complete rewrites
- **Test existing functionality** - When modifying base.py files, ensure all existing functionality still works correctly

#### **Abstract Classes: Base.py File Modification Process**
```
MANDATORY PROCESS for modifying any base.py file:

1. READ FIRST: Always read the existing base.py file completely
2. SEARCH DEPENDENCIES: Find all files that import from this base.py
3. UNDERSTAND INTERFACES: Check the corresponding contracts.py for required interfaces
4. PRESERVE EXISTING: Never remove or modify existing classes without explicit permission
5. EXTEND INTERFACES: Ensure new abstract classes extend appropriate interfaces from contracts.py
6. INCREMENTAL CHANGES: Make only necessary additions or fixes
7. VERIFY IMPORTS: Ensure all existing imports continue to work
8. TEST FUNCTIONALITY: Verify that existing functionality is not broken

NEVER:
- Overwrite an entire base.py file without reading it first
- Remove existing classes or methods
- Ignore interface inheritance requirements
- Make assumptions about what should be in base.py
- Create base.py files that don't extend contracts.py interfaces
```

#### **Interface Classes: Interface-Base Relationship Requirements**
- **Contracts define interfaces** - All interfaces (IClass) must be defined in contracts.py
- **Base implements interfaces** - All abstract classes (AClass) in base.py must extend interfaces from contracts.py
- **MANDATORY AClass naming** - **ALL abstract classes in base.py files MUST start with 'A' (e.g., AHandler, AValidator, AManager)**
- **Consistent naming** - Interface IExample should have corresponding abstract class AExample in base.py
- **Complete implementation** - Base.py abstract classes should provide skeletal implementations of interface methods
- **Documentation alignment** - Base.py classes should include comprehensive documentation explaining their relationship to interfaces

### AI Prompt Examples

#### **Code Generation Prompts**

**Library Creation:**
```
Create a new eXonware library called 'xentity' following all DEV_GUIDELINES.md standards:

CORE REQUIREMENTS:
- Use proper naming: library name 'xentity', main class 'XEntity'
- Implement MANDATORY facade pattern for simplified API
- Create contracts.py, errors.py, base.py module structure
- Include comprehensive testing with pytest and runners
- Follow version 0.x development phase requirements
- Generate complete documentation in docs/ folder
- **MANDATORY: Include lazy installation support with 3 modes (lite/lazy/full)**

LAZY INSTALLATION (MANDATORY):
- pyproject.toml MUST have: dependencies=["exonware-xwsystem>=0.0.1"]
- pyproject.toml MUST have: lazy=["exonware-xwsystem[lazy]>=0.0.1"]
- pyproject.toml MUST have: full=[...all optional dependencies...]
- __init__.py MUST have (line ~84): config_package_lazy_install_enabled("xentity")
- All imports MUST be standard (NO try/except ImportError)
- NO HAS_* flags anywhere in the code
- README MUST document all 3 installation modes

MAIN CLASSES & INTERFACES:
- IEntity (interface) - Core entity contract
- AEntity (abstract) - Base entity implementation
- XEntity (main class) - Rich extensible entity with design patterns
- EntityManager (handler) - Entity lifecycle management
- EntityValidator (strategy) - Validation strategies
- EntityRepository (facade) - Data access facade

KEY OBJECTIVES & FEATURES:
- Entity lifecycle management (create, read, update, delete)
- Validation and constraint enforcement
- Relationship management between entities
- Persistence abstraction with multiple backends
- Event-driven architecture for entity changes
- Performance optimization with caching strategies

DESIGN PATTERNS TO IMPLEMENT:
- Facade pattern (MANDATORY) - Unified interface to complex entity operations
- Strategy pattern - Interchangeable validation and persistence strategies
- Observer pattern - Event-driven entity change notifications
- Repository pattern - Data access abstraction
- Factory pattern - Entity creation and configuration
- Command pattern - Encapsulate entity operations as commands
- State pattern - Manage entity lifecycle states
- Decorator pattern - Add functionality to entities without modification
- Proxy pattern - Control access to entity operations
- Builder pattern - Construct complex entity configurations
- Specification pattern - Encapsulate entity business rules
- Value Object pattern - Represent immutable entity properties

PRIORITIES FOCUS:
1. Usability - Simple, intuitive entity operations
2. Maintainability - Clean, well-structured entity management
3. Performance - Efficient entity operations and caching
4. Extensibility - Easy to extend with new entity types
5. Security - Secure entity access and validation
```

**Feature Implementation:**
```
Implement a new serialization format handler for the xwsystem library:

CORE REQUIREMENTS:
- Follow naming conventions: JSONDataHandler class
- Use abstract base classes from base.py module
- Include error handling in errors.py file
- Add comprehensive tests in tests/unit/ and tests/integration/
- Update documentation following eXonware standards

DESIGN PATTERNS TO APPLY:
- Strategy pattern - Interchangeable serialization algorithms
- Template method pattern - Common serialization workflow
- Factory pattern - Handler creation and configuration
- Chain of responsibility - Format detection and routing
- Adapter pattern - Integrate with legacy serialization systems
- Decorator pattern - Add compression, encryption, validation layers
- Proxy pattern - Lazy loading and caching of serialized data
- Builder pattern - Construct complex serialization configurations
- Observer pattern - Notify on serialization events
- Command pattern - Encapsulate serialization operations
- Registry pattern - Manage available serialization handlers

PRIORITIES FOCUS:
1. Usability - Simple, consistent serialization API
2. Maintainability - Clean, extensible handler architecture
3. Performance - Efficient serialization with minimal overhead
4. Extensibility - Easy to add new format handlers
5. Security - Safe serialization with validation
```

**Code Review:**
```
Review this code against DEV_GUIDELINES.md standards:

COMPREHENSIVE REVIEW CHECKLIST:
- Check naming conventions (libraries lowercase, classes CapWord)
- Verify design patterns implementation (facade, strategy, handler, engine)
- Ensure separation of concerns (contracts.py, errors.py, base.py)
- Validate testing approach (pytest, runners)
- Confirm documentation standards compliance

DESIGN PATTERNS ASSESSMENT:
- Evaluate pattern suitability for the problem domain
- Check for over-engineering vs. appropriate complexity
- Verify pattern implementation follows best practices
- Assess extensibility and maintainability benefits
- Review structural patterns (Facade, Adapter, Decorator, Composite, Proxy, Bridge)
- Validate creational patterns (Factory, Builder, Singleton, Prototype, Object Pool)
- Check behavioral patterns (Strategy, Observer, Command, State, Template Method)
- Assess concurrency patterns (Producer-Consumer, Thread Pool, Actor, Lock)
- Evaluate architectural patterns (MVC, Repository, CQRS, Event Sourcing, Circuit Breaker)
- Review domain-specific patterns (Handler, Engine, Plugin, Registry, Specification)

PRIORITIES ALIGNMENT:
1. Usability - Is the code easy to use and understand?
2. Maintainability - Is the code clean and well-structured?
3. Performance - Are there any performance concerns?
4. Extensibility - Can the code be easily extended?
5. Security - Are security considerations properly addressed?
```

#### **Documentation Prompts**

**API Documentation:**
```
Generate comprehensive API documentation for the XData class:

CORE REQUIREMENTS:
- Follow eXonware documentation standards
- Include killer one-sentence overview
- Provide clear usage examples
- Explain WHY design decisions were made
- Structure for both human and AI consumption
- Place in docs/ folder following guidelines

DESIGN PATTERNS DOCUMENTATION:
- Document implemented design patterns (facade, strategy, etc.)
- Explain pattern benefits for usability and maintainability
- Show how patterns support extensibility and performance
- Include security considerations in pattern usage

PRIORITIES FOCUS:
1. Usability - Clear, intuitive API documentation
2. Maintainability - Well-structured, comprehensive docs
3. Performance - Document performance characteristics
4. Extensibility - Show how to extend and customize
5. Security - Document security features and considerations
```

**Project Documentation:**
```
Create project documentation for a new eXonware library:
- Follow standard directory structure
- Include WHY explanations for all decisions
- Generate AI-friendly format
- Cover all aspects: setup, usage, testing, deployment
- Ensure comprehensive coverage following eXonware standards
```

#### **Testing Prompts**

**Test Generation:**
```
Generate comprehensive tests for the XWNode class:

CORE REQUIREMENTS:
- Use pytest and runners following DEV_GUIDELINES.md
- Include core/, unit/, and integration/ test categories
- Follow testing standards (no rigged tests, comprehensive coverage)
- Use proper test organization and structure
- Include verify_installation.py test

DESIGN PATTERNS TESTING:
- Test facade pattern implementation and API consistency
- Validate strategy pattern behavior with different strategies
- Test handler pattern with various handler types
- Verify pattern interactions and edge cases

PRIORITIES FOCUS:
1. Usability - Test API ease of use and error handling
2. Maintainability - Test code structure and organization
3. Performance - Include performance benchmarks and tests
4. Extensibility - Test extension points and customization
5. Security - Test security features and vulnerability prevention
```

**Test Review:**
```
Review these tests against DEV_GUIDELINES.md testing standards:
- Verify pytest and runners usage
- Check test organization (core/, unit/, integration/)
- Ensure comprehensive coverage
- Validate no rigged tests
- Confirm testing quality
```

#### **Project Structure Prompts**

**Library Setup:**
```
Set up a new eXonware library following DEV_GUIDELINES.md:

CORE REQUIREMENTS:
- Create standard directory structure
- Implement contracts.py, errors.py, base.py modules
- Set up tests/ with proper organization
- Configure pyproject.toml and requirements.txt
- Generate initial documentation structure

DESIGN PATTERNS FOUNDATION:
- Implement facade pattern as MANDATORY requirement
- Set up strategy pattern infrastructure for extensibility
- Create handler pattern framework for dynamic behavior
- Establish factory pattern for object creation
- Design for observer pattern if event-driven features needed
- Implement repository pattern for data access abstraction
- Set up command pattern for operation encapsulation
- Create builder pattern for complex object construction
- Establish decorator pattern for functionality extension
- Design proxy pattern for access control and lazy loading
- Implement registry pattern for service management
- Set up specification pattern for business rule encapsulation

PRIORITIES FOCUS:
1. Usability - Simple, intuitive library structure
2. Maintainability - Clean, organized codebase
3. Performance - Efficient foundation for high performance
4. Extensibility - Easy to extend and customize
5. Security - Secure by design architecture
```

**Migration:**
```
Migrate existing code to follow DEV_GUIDELINES.md standards:
- Update naming conventions (libraries lowercase, classes CapWord)
- Implement proper module organization (contracts.py, errors.py, base.py)
- Restructure tests following guidelines
- Update documentation to docs/ folder
- Ensure version compliance (0.x development phase)
```

#### **Version Management Prompts**

**Version Planning:**
```
Plan version progression for the eXonware ecosystem:
- Follow versioning philosophy (0.x until complete ecosystem)
- Ensure all libraries (xwsystem, xnode, xdata, xschema, xwaction, xentity) are complete
- Validate 3+ full applications requirement
- Plan transition to Version 1.x (ready)
- Maintain exact version preservation rules
```

**Release Management:**
```
Prepare release following DEV_GUIDELINES.md versioning rules:
- Verify complete ecosystem development
- Check all libraries are fully developed
- Validate 3+ applications
- Ensure no automatic version changes
- Follow exact version preservation requirements
```

#### **Quality Assurance Prompts**

**Comprehensive Review:**
```
Perform comprehensive review of this eXonware library:
- Check against ALL DEV_GUIDELINES.md sections
- Verify naming conventions compliance
- Validate design patterns implementation
- Ensure testing standards adherence
- Confirm documentation completeness
- Check version management compliance
```

**Readiness:**
```
Assess readiness following DEV_GUIDELINES.md:
- Verify quality standards
- Check comprehensive test coverage
- Validate security and performance standards
- Ensure complete documentation
- Confirm version compliance
- Assess enterprise readiness
```

#### **Design Pattern Prompts**

**Facade Implementation:**
```
Implement facade pattern for xdata library:

CORE REQUIREMENTS:
- Follow MANDATORY facade pattern requirements
- Create unified interface to complex subsystems
- Hide implementation complexity
- Ensure maintainability and consistency
- Apply to all future libraries (xnode, xschema, xwaction, xentity)

DESIGN PATTERNS INTEGRATION:
- Combine facade with strategy pattern for algorithm selection
- Use factory pattern within facade for object creation
- Implement observer pattern for change notifications
- Apply template method pattern for common workflows
- Integrate command pattern for operation encapsulation
- Use decorator pattern to add layers of functionality
- Implement proxy pattern for access control and caching
- Apply builder pattern for complex configuration
- Use adapter pattern for legacy system integration
- Implement registry pattern for service discovery
- Apply specification pattern for business rule validation
- Use state pattern for lifecycle management

PRIORITIES FOCUS:
1. Usability - Simple, unified API hiding complexity
2. Maintainability - Clean facade interface, easy to modify
3. Performance - Efficient facade with minimal overhead
4. Extensibility - Easy to extend facade with new features
5. Security - Secure facade with proper validation
```

**Strategy Pattern:**
```
Implement strategy pattern for serialization handlers:

CORE REQUIREMENTS:
- Create interchangeable algorithms and behaviors
- Use proper naming conventions (JSONDataHandler, XMLDataHandler)
- Follow separation of concerns
- Implement in base.py module with abstract classes
- Ensure extensibility and maintainability

DESIGN PATTERNS INTEGRATION:
- Combine with factory pattern for strategy creation
- Use facade pattern to hide strategy complexity
- Implement chain of responsibility for strategy selection
- Apply template method for common strategy workflow
- Use decorator pattern to add strategy enhancements
- Implement observer pattern for strategy change notifications
- Apply command pattern for strategy operations
- Use registry pattern for strategy management
- Implement proxy pattern for strategy access control
- Apply builder pattern for strategy configuration
- Use adapter pattern for legacy strategy integration
- Implement specification pattern for strategy validation

PRIORITIES FOCUS:
1. Usability - Simple strategy selection and usage
2. Maintainability - Clean strategy interface and implementation
3. Performance - Efficient strategy execution and switching
4. Extensibility - Easy to add new strategies
5. Security - Secure strategy execution with validation
```

#### **Integration Prompts**

**Library Integration:**
```
Integrate xnode with xdata following DEV_GUIDELINES.md:
- Implement delegation pattern (xnode delegates to xdata)
- Ensure format-agnostic design
- Follow naming conventions
- Maintain separation of concerns
- Validate inter-library compatibility
```

**Ecosystem Development:**
```
Develop complete eXonware ecosystem following DEV_GUIDELINES.md:
- Complete all libraries (xwsystem, xnode, xdata, xschema, xwaction, xentity)
- Implement backend systems using ecosystem
- Create frontend applications
- Develop 3+ full-fledged applications
- Follow version 0.x development requirements
```

#### **eXonware Ecosystem-Specific Prompts**

**xnode Implementation:**
```
Implement xnode library with Strategy Design Patterns following DEV_GUIDELINES.md:

CORE REQUIREMENTS:
- Implement 28 Node Modes: HASH_MAP, ARRAY_LIST, LSM_TREE, ROARING_BITMAP, UNION_FIND, SEGMENT_TREE, etc.
- Implement 16 Edge Modes: ADJ_LIST, ADJ_MATRIX, R_TREE, TEMPORAL_EDGESET, NEURAL_GRAPH, etc.
- Strategy Manager with lazy materialization and auto mode selection
- A+ Usability Presets: DATA_INTERCHANGE_OPTIMIZED, SOCIAL_GRAPH, ANALYTICS, SEARCH_ENGINE, etc.
- Advanced Traits: WEIGHTED, PROBABILISTIC, SPATIAL, STREAMING, etc.
- Performance monitoring and strategy migration capabilities
- Design for core-facade separation (current Python, future Rust core)

CORE-FACADE ARCHITECTURE:
- Core-lib: Low-level node operations and data structures
- Facade-lib: Simplified API wrapping core complexity
- Current Phase: Both core and facade in Python
- Future Phase: Core in Rust, facades in Python/Rust/TS/Go
- Design for easy separation and migration

ADVANCED FEATURES:
- Strategy Manager with lazy materialization
- Auto mode selection with performance heuristics
- Strategy migration with data preservation
- Performance monitoring and capability checking
- A+ Usability Presets for different use cases
- Advanced traits system for cross-cutting capabilities

PRIORITIES FOCUS:
1. Security - Secure node operations and data access
2. Usability - Simple node manipulation API with presets
3. Maintainability - Clean node structure management
4. Performance - Lazy loading, async operations, and strategy optimization
5. Extensibility - Easy to add new node/edge types and strategies
```

**xdata Implementation:**
```
Implement xdata library with Data Framework following DEV_GUIDELINES.md:

CORE REQUIREMENTS:
- Support 50+ data formats (exceeding xwsystem's 24)
- Implement anything-to-anything conversion
- COW Semantics for optimal memory usage and performance
- Object Pooling with pre-allocated node pools for hot path operations
- Performance Caching with parse/serialize caches and structural hashing
- Security Integration with path validation, file size limits, content validation
- Format Auto-Detection from content, extensions, and MIME types
- Use xnode for data structure management
- Extensible architecture for custom formats
- Async-first implementation with lazy loading
- Design for core-facade separation (current Python, future Rust core)

CORE-FACADE ARCHITECTURE:
- Core-lib: Low-level format conversion and data handling
- Facade-lib: Simplified API wrapping core complexity
- Current Phase: Both core and facade in Python
- Future Phase: Core in Rust, facades in Python/Rust/TS/Go
- Design for easy separation and migration

CONVERSION PATTERNS:
- Strategy pattern for format conversion algorithms
- Factory pattern for format handler creation
- Adapter pattern for legacy format integration
- Lazy initialization for large data sets
- Async processing for batch conversions

ADVANCED FEATURES:
- COW Semantics for memory optimization
- Object Pooling for performance
- Performance Caching with structural hashing
- Security Integration with comprehensive validation
- Format Auto-Detection with intelligent detection
- Fluent API with method chaining

PRIORITIES FOCUS:
1. Security - Secure data conversion and validation
2. Usability - Simple conversion API with fluent design
3. Maintainability - Clean format handler architecture
4. Performance - Lazy loading, async conversion, and caching
5. Extensibility - Easy to add new formats and handlers
```

**xschema Implementation:**
```
Implement xschema library with Schema Validation Engine following DEV_GUIDELINES.md:

CORE REQUIREMENTS:
- Combine xdata with OpenAPI schema validation
- Implement all known schema validation rules
- Support schema format conversion
- Handler Caching with performance-optimized handler management
- Format Auto-Detection with advanced content-based detection
- Structural Hashing for fast equality checks and caching
- Performance Optimization with ultra-fast implementation
- Define detailed input/output schemas
- Unlimited property detail specifications
- Design for core-facade separation (current Python, future Rust core)

CORE-FACADE ARCHITECTURE:
- Core-lib: Low-level schema validation and processing
- Facade-lib: Simplified API wrapping core complexity
- Current Phase: Both core and facade in Python
- Future Phase: Core in Rust, facades in Python/Rust/TS/Go
- Design for easy separation and migration

SCHEMA PATTERNS:
- Strategy pattern for validation algorithms
- Factory pattern for schema handler creation
- Adapter pattern for different schema formats
- Lazy initialization for large schemas
- Async validation for complex schemas

ADVANCED FEATURES:
- Handler Caching for performance optimization
- Format Auto-Detection with intelligent detection
- Structural Hashing for fast operations
- Performance Optimization with backward compatibility
- Intelligent caching system for schema operations

PRIORITIES FOCUS:
1. Security - Secure schema validation and enforcement
2. Usability - Simple schema definition and validation
3. Maintainability - Clean schema architecture
4. Performance - Lazy loading, async validation, and caching
5. Extensibility - Easy to add new schema types and handlers
```

**xwaction Implementation:**
```
Implement xwaction library with Enterprise Action Framework following DEV_GUIDELINES.md:

CORE REQUIREMENTS:
- Advanced function decoration and management
- OpenAPI 3.1 Compliance with full API documentation generation
- Security Integration with OAuth2, API keys, MFA, rate limiting, audit trails
- Workflow Orchestration with multi-step workflows, monitoring, and rollback
- Pluggable Engines supporting Native, FastAPI, Celery, Prefect
- Contract Validation with xSchema integration
- Cross-cutting Concerns handlers for Validation, Security, Monitoring, Workflow
- Deep specifications for security, async, scheduling, automation
- Native async function support
- Scheduling and automation capabilities
- Design for core-facade separation (current Python, future Rust core)

CORE-FACADE ARCHITECTURE:
- Core-lib: Low-level function execution and management
- Facade-lib: Simplified API wrapping core complexity
- Current Phase: Both core and facade in Python
- Future Phase: Core in Rust, facades in Python/Rust/TS/Go
- Design for easy separation and migration

ACTION PATTERNS:
- Command pattern for function operations
- Strategy pattern for different action types
- Factory pattern for action creation
- Observer pattern for action events
- Lazy initialization for action configurations

ADVANCED FEATURES:
- OpenAPI 3.1 Compliance for API documentation
- Security Integration with comprehensive authentication
- Workflow Orchestration with state management
- Pluggable Engines for different execution environments
- Contract Validation with schema integration
- Cross-cutting Concerns handlers

PRIORITIES FOCUS:
1. Security - Secure function execution and management
2. Usability - Simple function decoration API with OpenAPI compliance
3. Maintainability - Clean action architecture with pluggable engines
4. Performance - Efficient action execution with workflow optimization
5. Extensibility - Easy to add new action types and engines
```

**xentity Implementation:**
```
Implement xentity library with Advanced Entity Management following DEV_GUIDELINES.md:

CORE REQUIREMENTS:
- Unified object combining xschema + xwaction + xdata
- Immutable Facade with thread-safe immutable-style API
- Performance Caching with thread-safe LRU cache and hit/miss tracking
- Lazy Loading with optimized entity loading and access patterns
- Performance Monitoring with comprehensive metrics and operation tracking
- Built-in schema validation for all operations
- Complex entity actions with specifications
- Universal persistence to any supported format
- Lazy initialization for optimal performance
- Design for core-facade separation (current Python, future Rust core)

CORE-FACADE ARCHITECTURE:
- Core-lib: Low-level entity operations and data management
- Facade-lib: Simplified API wrapping core complexity
- Current Phase: Both core and facade in Python
- Future Phase: Core in Rust, facades in Python/Rust/TS/Go
- Design for easy separation and migration

ENTITY PATTERNS:
- Facade pattern for unified entity interface
- Strategy pattern for different entity types
- Factory pattern for entity creation
- Repository pattern for entity persistence
- Lazy initialization for entity loading

ADVANCED FEATURES:
- Immutable Facade for thread-safe operations
- Performance Caching with LRU cache and metrics
- Lazy Loading for memory efficiency
- Performance Monitoring with comprehensive tracking
- Thread-safe operations with optimized performance
- Advanced entity state management

PRIORITIES FOCUS:
1. Security - Secure entity operations and data access
2. Usability - Simple entity manipulation API with immutable design
3. Maintainability - Clean entity architecture with performance monitoring
4. Performance - Lazy loading, async operations, and caching
5. Extensibility - Easy to extend entity functionality with advanced features
```

---

## Library-Specific Patterns

### Why Facade Pattern is Mandatory
- **Simplified API** - Provides a unified interface to complex subsystems, reducing cognitive load for developers
- **Abstraction layer** - Hides implementation complexity while exposing essential functionality
- **Maintainability** - Changes to internal implementation don't affect client code
- **Consistency** - Ensures uniform API across all eXonware libraries (xnode, xdata, xschema, xwaction, xentity)
- **Exception: xwsystem** - xwsystem is the foundation library and does not require a facade pattern as it serves as the base for other libraries

### xnode Library (core-lib & facade-lib)
- **Why format-agnostic**: Ensures node operations work regardless of underlying data format
- **28 Node Modes**: Comprehensive data structures from basic (HASH_MAP, ARRAY_LIST) to advanced (LSM_TREE, ROARING_BITMAP, UNION_FIND, SEGMENT_TREE)
- **16 Edge Modes**: Graph structures from basic (ADJ_LIST, ADJ_MATRIX) to specialized (R_TREE, TEMPORAL_EDGESET, NEURAL_GRAPH)
- **Strategy Manager**: Lazy materialization, auto mode selection, performance monitoring, strategy migration
- **A+ Usability Presets**: 12+ predefined configurations (DATA_INTERCHANGE_OPTIMIZED, SOCIAL_GRAPH, ANALYTICS, SEARCH_ENGINE, etc.)
- **Advanced Traits**: 12+ cross-cutting capabilities (WEIGHTED, PROBABILISTIC, SPATIAL, STREAMING, etc.)
- **Lazy initialization**: Initialize nodes and edges only when accessed for optimal performance
- **Performance Monitoring**: Operation tracking, migration planning, capability checking
- **Strategy Migration**: Runtime strategy switching with data preservation
- **Delegation pattern rationale**: Leverages xdata's serialization expertise, avoiding code duplication
- **Virtual proxy pattern**: Create placeholder objects that load actual data on demand
- **Async-first design**: All node operations are async for high performance
- **Core-Facade separation**: Core-lib (Rust future) handles low-level operations, facade provides simplified API
- **Multi-language facades**: Python/Rust/TS/Go facades wrapping shared Rust core

### xdata Library (core-lib & facade-lib)
- **Why format-agnostic**: Enables seamless switching between data formats without changing client code
- **50+ formats**: Exceed xwsystem's 24 formats, extensible to custom formats
- **Anything-to-anything conversion**: Universal format conversion capabilities
- **COW Semantics**: Copy-on-write for optimal memory usage and performance
- **Object Pooling**: Pre-allocated node pools for hot path operations and memory efficiency
- **Performance Caching**: Parse/serialize caches with structural hashing for ultra-fast operations
- **Security Integration**: Path validation, file size limits, content validation, untrusted data handling
- **Format Auto-Detection**: Intelligent format detection from content, extensions, and MIME types
- **Uses xnode**: Built on xnode for data structure management
- **Lazy loading**: Load data only when needed to reduce memory usage
- **Method naming rationale**: `to_native/from_native` clearly indicates data transformation direction
- **Config exclusion**: Prevents configuration pollution in serialized data, maintaining data purity
- **Return XData instances**: Enables fluent API design for method chaining and improved developer experience
- **Core-Facade separation**: Core-lib (Rust future) handles format conversion, facade provides unified API
- **Multi-language facades**: Python/Rust/TS/Go facades wrapping shared Rust core

### xschema Library (core-lib & facade-lib)
- **xdata + OpenAPI**: Combines data handling with comprehensive schema validation
- **All schema rules**: Implement all known schema validation rules and constraints
- **Format conversion**: Convert schemas between any supported formats
- **Handler Caching**: Performance-optimized handler management with intelligent caching
- **Format Auto-Detection**: Advanced content-based format detection and validation
- **Structural Hashing**: Fast equality checks and caching for schema operations
- **Performance Optimization**: Ultra-fast implementation with backward compatibility
- **Input/output schemas**: Define detailed input and output schemas with unlimited property details
- **Constraint focus rationale**: Python's type system already handles basic constraints, focus on advanced validation
- **XWAction integration**: Enables declarative validation with imperative actions for complex scenarios
- **Core-Facade separation**: Core-lib (Rust future) handles schema validation, facade provides simplified API
- **Multi-language facades**: Python/Rust/TS/Go facades wrapping shared Rust core

### xwaction Library (core-lib & facade-lib)
- **Function decoration**: Advanced function decoration and management capabilities
- **Deep specifications**: Comprehensive function specifications for security, async, scheduling, automation
- **Security integration**: Built-in security for functions with comprehensive validation
- **Async support**: Native async function support with proper error handling
- **Scheduling and automation**: Built-in scheduling and automation capabilities
- **Command pattern**: Encapsulate function operations as commands for better management
- **Core-Facade separation**: Core-lib (Rust future) handles function execution, facade provides simplified API
- **Multi-language facades**: Python/Rust/TS/Go facades wrapping shared Rust core

### xentity Library (core-lib & facade-lib) - Advanced Entity Management
- **Unified object**: Combines xschema + xwaction + xdata in a single, powerful object
- **Immutable Facade**: Thread-safe immutable-style API with performance optimizations
- **Performance Caching**: Thread-safe LRU cache with hit/miss tracking and metrics
- **Lazy Loading**: Optimized entity loading and access patterns for memory efficiency
- **Performance Monitoring**: Comprehensive metrics and operation tracking
- **Schema checking**: Built-in schema validation for all entity operations
- **Complex actions**: Create complex entity actions with comprehensive specifications
- **Universal persistence**: Save/load to any supported format through xdata
- **Lazy initialization**: Optimize entity loading and access with lazy loading patterns
- **Async-first**: All entity operations are async for optimal performance
- **Core-Facade separation**: Core-lib (Rust future) handles entity operations, facade provides unified API
- **Multi-language facades**: Python/Rust/TS/Go facades wrapping shared Rust core

---

## Core-Facade Development Strategy

### Current Phase (0.x) - Python Implementation
- **Both core and facade in Python**: Full implementation in Python for rapid development
- **Unified codebase**: Core and facade can share implementation details
- **Rapid prototyping**: Fast iteration and testing of concepts
- **Python ecosystem**: Leverage existing Python libraries and tools
- **Single language**: Simplified development and maintenance

### Future Phase (3.x) - Rust Core + Multi-Language Facades
- **Rust core**: High-performance, memory-safe core implementation
- **Multi-language facades**: Python/Rust/TS/Go facades wrapping Rust core
- **Language-specific optimizations**: Each facade optimized for its target language
- **Shared performance**: All languages benefit from Rust's performance
- **Language ergonomics**: Each language gets idiomatic API design

### Development Guidelines
- **Design for separation**: Structure code to easily separate core from facade
- **Interface contracts**: Define clear interfaces between core and facade
- **Language-agnostic core**: Core should be implementable in any language
- **Facade flexibility**: Facades should be easily adaptable to different languages
- **Performance considerations**: Design with future Rust migration in mind

### Migration Strategy
- **Incremental migration**: Move core functionality to Rust gradually
- **Backward compatibility**: Maintain Python facades during transition
- **Testing strategy**: Comprehensive testing across all language combinations
- **Documentation updates**: Update all documentation for multi-language support
- **Community support**: Provide migration guides and examples

---

## Development Environment

### Multi-Language Support
- **Rust toolchains** - Support both GNU and MSVC Rust toolchains
- **Language compatibility** - Ensure Rust, Python, Go, and TypeScript all work flawlessly
- **Cross-platform** - Support multiple operating systems and architectures

### Development Tools
- **IDE integration** - Full IDE support with proper syntax highlighting and IntelliSense
- **Debugging** - Comprehensive debugging capabilities
- **Profiling** - Performance profiling and optimization tools

---

## Release & Publishing

**📖 For release mechanics, publishing workflows, and deployment, see [GUIDE_61_DEP.md](GUIDE_61_DEP.md)**

### DEV Responsibilities Before Release

- **Ensure code is ready** — All tests pass, docs updated, code reviewed.
- **Follow QA gates** — Wait for `GUIDE_50_QA.md` approval before release.
- **Don't run releases** — DEP owns release mechanics; DEV ensures code quality.

---

## Best Practices Summary

### Do's
? Think and design thoroughly before coding
? Use explicit imports throughout the project
? Include all formats and their dependencies
? Place documentation in docs/ folder
? Use pytest for all testing
? Keep versions exactly as specified
? Use libraries
? Implement comprehensive error handling
? Write clean, maintainable code
? Challenge ideas and assumptions
? **Fix root causes, not symptoms**
? **Follow 5 priorities when fixing errors**
? **Preserve all features when fixing bugs**

### Don'ts
? Never reinvent the wheel unnecessarily
? Don't use wildcard imports
? Don't change versions automatically
? Don't create backward compatibility aliases without confirmation
? Don't permanently delete files
? **Don't rig tests to pass - fix the root cause**
? **Don't use `pass` to silence errors**
? **Don't remove features to fix bugs**
? **Don't use workarounds instead of proper fixes**
? **Don't use `--disable-warnings` flag - it hides real problems!**
? **Don't use `--maxfail=10` - use `--maxfail=1` or `-x` instead**
? **Don't use `--tb=no` or `-q` to hide diagnostic output**
? **Don't add `filterwarnings = ignore` to pytest.ini**
? **Don't use `@pytest.mark.skip` or `@pytest.mark.xfail`**
? Don't create separate core.py files
? Don't put examples.py in src/ directory
? Don't mix Python versions
? **Don't skip root cause analysis - MANDATORY**
? **NEVER use "protocols.py" - always use "contracts.py" for interface files**

---

## Checklist

### Before You Start

- [ ] Confirm platform-wide constraints in `GUIDE_00_MASTER.md` (Five Priorities, REF/LOG placement, lazy install, versioning).
- [ ] Confirm architecture constraints in `GUIDE_13_ARCH.md` and requirements in `docs/REF_PROJECT.md`.

### During Implementation

- [ ] Follow DEV code quality, structure, and pattern rules (this guide).
- [ ] Keep tests and docs aligned: `GUIDE_51_TEST.md` + `GUIDE_41_DOCS.md`.

### Before You Finish

- [ ] All tests pass; no skips/rigging; fixes are root-cause only.
- [ ] If this work affects packaging/release, coordinate with `GUIDE_50_QA.md` and `GUIDE_61_DEP.md`.

---

## Coordination & Handoffs

### Works With

- **GUIDE_00_MASTER.md** — Canonical standards; follow Five Priorities and REF/LOG placement.
- **GUIDE_21_PLAN.md** — Planning and lifecycle; DEV implements during Phase III; REVIEW (D.4) gates before Quality Loop.
- **GUIDE_35_REVIEW.md** — Review (e.g. D.4 code review) gates before Quality Loop; full methodology and checklists in GUIDE_35_REVIEW.
- **GUIDE_41_DOCS.md** — Documentation standards; document as you go per DOCS.
- **GUIDE_51_TEST.md** — Test implementation; write and run tests per TEST.
- **GUIDE_52_DEBUG.md** / **GUIDE_53_FIX.md** — Diagnosis and fixes; root-cause discipline aligns with DEV.

### NOT Responsible For

- **Orchestrating the full lifecycle** — Owned by `GUIDE_21_PLAN.md` (Project Manager).
- **Defining documentation templates and placement** — Owned by `GUIDE_41_DOCS.md` (Technical Writer).
- **Defining test layout, runners, and markers** — Owned by `GUIDE_51_TEST.md` (Test Engineer).
- **Running releases and deployment** — Owned by `GUIDE_61_DEP.md` (Release Manager).
- **Setting platform-wide governance and tie-breaker rules** — Owned by `GUIDE_00_MASTER.md` (Standards Governor).

DEV sets coding standards and practices; other guides own their workflows and artifacts.

---

## Conclusion

This guide defines **code implementation standards** for eXonware projects. For platform-wide rules (Five Priorities, REF/LOG placement, lazy install mandate, versioning), see `GUIDE_00_MASTER.md` — it governs everything and is the tie-breaker when guides conflict.

### For Human Developers:
- **Reference this document** for all development decisions
- **Use as quality checklist** for reviewing AI-generated work
- **Maintain consistency** across all projects and libraries
- **Update guidelines** as new patterns and best practices emerge

### For AI Assistants:
- **Follow DEV guidelines** for code implementation work (this guide).
- **Follow MASTER for platform rules** — Five Priorities, REF/LOG placement, lazy install, versioning per `GUIDE_00_MASTER.md`.
- **Follow specialized guides** — Testing (`GUIDE_51_TEST.md`), Documentation (`GUIDE_41_DOCS.md`), Release (`GUIDE_61_DEP.md`).
- **⚠️ CRITICAL: When fixing errors, ALWAYS follow the Error Fixing Philosophy** (see above):
 - Never rig tests to pass
 - Never use `pass` to hide errors
 - Never remove features to eliminate bugs
 - Always fix root causes following the 5 priorities (per `GUIDE_00_MASTER.md`)
 - Always preserve existing functionality
 - Always document WHY fixes were needed

**Remember**: DEV owns code implementation standards. For platform-wide rules, see `GUIDE_00_MASTER.md` — it governs everything and is the tie-breaker when guides conflict.

---

*This document is living and should be updated as new patterns and best practices emerge. It serves as the definitive guide for **code implementation standards** in the eXonware ecosystem. For platform-wide rules, see `GUIDE_00_MASTER.md`.*

