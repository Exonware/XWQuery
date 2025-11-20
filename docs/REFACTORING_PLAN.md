# XWQuery Structure Refactoring Plan

## Goal
Move all folders except `common/` under `xwquery/` into `query/` subdirectory.

## Current Structure
```
xwquery/src/exonware/xwquery/
├── adapters/           → move to query/
├── executors/          → move to query/
├── generators/         → move to query/
├── optimization/       → move to query/
├── parsers/            → move to query/
├── strategies/         → move to query/
├── query/              → keep (will contain all above)
│   └── grammars/
├── common/             → KEEP at root level
└── [.py files]         → KEEP at root level
```

## Target Structure
```
xwquery/src/exonware/xwquery/
├── common/             ← stays here
├── query/              ← everything moves here
│   ├── adapters/
│   ├── executors/
│   ├── generators/
│   ├── grammars/
│   ├── optimization/
│   ├── parsers/
│   └── strategies/
└── [.py files]         ← stay at root
```

## Steps Required

### 1. Create directory structure (if needed)
- query/ already exists
- Create subdirectories under query/

### 2. Move directories
```
adapters/      → query/adapters/
executors/     → query/executors/
generators/    → query/generators/
optimization/  → query/optimization/
parsers/       → query/parsers/
strategies/    → query/strategies/
query/grammars → query/grammars/ (just move grammars up)
```

### 3. Update imports

#### Pattern 1: From root __init__.py
```python
# OLD
from .executors import ...
from .parsers import ...
from .generators import ...
from .strategies import ...
from .optimization import ...
from .adapters import ...

# NEW
from .query.executors import ...
from .query.parsers import ...
from .query.generators import ...
from .query.strategies import ...
from .query.optimization import ...
from .query.adapters import ...
```

#### Pattern 2: Within moved modules (relative imports)
```python
# OLD (from executors/engine.py)
from ..contracts import QueryAction
from ..base import AOperationExecutor
from .registry import ExecutorRegistry

# NEW (from query/executors/engine.py)
from ...contracts import QueryAction  # +1 level
from ...base import AOperationExecutor  # +1 level
from .registry import ExecutorRegistry  # same
```

#### Pattern 3: Cross-module imports within query/
```python
# OLD (from strategies/sql.py)
from ..parsers.sql_parser import SQLParser
from ..generators.sql_generator import SQLGenerator
from ..executors.engine import ExecutionEngine

# NEW (from query/strategies/sql.py)
from ..parsers.sql_parser import SQLParser  # same (both in query/)
from ..generators.sql_generator import SQLGenerator  # same
from ..executors.engine import ExecutionEngine  # same
```

#### Pattern 4: External imports (from tests, examples)
```python
# OLD
from exonware.xwquery.executors import ExecutionEngine
from exonware.xwquery.parsers import SQLParser
from exonware.xwquery.strategies import SQLStrategy

# NEW
from exonware.xwquery.query.executors import ExecutionEngine
from exonware.xwquery.query.parsers import SQLParser
from exonware.xwquery.query.strategies import SQLStrategy
```

### 4. Update __init__.py files

#### query/__init__.py (new)
```python
# Re-export from subdirectories for convenience
from .executors import *
from .parsers import *
from .generators import *
from .strategies import *
from .optimization import *
from .adapters import *
```

### 5. Test everything
- Run all tests
- Check imports
- Verify examples work

## Challenges

1. **Many files to update** - 200+ Python files
2. **Relative import complexity** - Need to add one more `..` level
3. **External references** - Tests, examples, docs
4. **__init__.py cascading** - Multiple __init__ files need updates
5. **Cross-references** - Modules import from each other

## Estimated Changes

- **Directory moves**: 6 operations
- **Import updates**: ~500-1000 import statements
- **__init__.py updates**: ~30 files
- **Test updates**: ~50 files
- **Example updates**: ~20 files

## Risk Mitigation

1. Use search/replace with care
2. Test after each major change
3. Keep backup of working state
4. Update systematically (one module type at a time)

## Execution Order

1. ✅ Create plan (this file)
2. Move directories physically
3. Update query/__init__.py
4. Update root __init__.py
5. Update imports in moved modules (add one ../)
6. Update cross-module imports
7. Update tests
8. Update examples
9. Run comprehensive tests
10. Fix any remaining issues

---

**Status**: Planning complete, ready to execute
**Risk**: HIGH (major refactoring)
**Benefit**: Better organization, clearer structure

