# Syntax Engine - Quick Start Guide

**Goal:** Parse query languages using grammar files instead of hand-written parsers

---

## 🚀 5-Minute Quick Start

### 1. Install Dependency

```bash
pip install lark-parser
```

### 2. Use Existing Grammar (JSON)

```python
from exonware.xwsyntax import SyntaxEngine
from pathlib import Path

# Point to grammars directory
grammars = Path('src/exonware/xwquery/query/grammars')
engine = SyntaxEngine(grammar_dir=grammars)

# Parse JSON
ast = engine.parse('{"name": "Alice", "age": 30}', grammar='json')

print(ast.type)        # 'object'
print(ast.children)    # [pair, pair]
```

### 3. Validate Syntax

```python
errors = engine.validate('{"invalid": }', grammar='json')
if errors:
    print(f"Syntax error: {errors[0]}")
```

---

## 📝 Creating a New Grammar

### Step 1: Create Grammar File

Create `grammars/sql.grammar`:

```lark
// sql.grammar
?start: select_stmt

select_stmt: SELECT select_list FROM table_name where_clause?
select_list: "*" | column ("," column)*
where_clause: WHERE expression

expression: column "=" value
column: IDENTIFIER
table_name: IDENTIFIER
value: STRING | NUMBER

SELECT: "SELECT"i
FROM: "FROM"i
WHERE: "WHERE"i

IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/
STRING: /'[^']*'/
NUMBER: /[0-9]+/

%import common.WS
%ignore WS
```

### Step 2: Test It

```python
engine = SyntaxEngine(grammar_dir=grammars)

# Parse SQL
ast = engine.parse("SELECT * FROM users", grammar='sql')
print(ast.type)  # 'select_stmt'
```

That's it! 🎉

---

## 🔧 Common Patterns

### Pattern 1: Query Strategy

```python
class SQLQueryStrategy:
    def __init__(self):
        self._engine = SyntaxEngine(grammar_dir=GRAMMARS_DIR)
    
    def parse(self, query: str):
        return self._engine.parse(query, grammar='sql')
    
    def validate(self, query: str) -> bool:
        return len(self._engine.validate(query, 'sql')) == 0
```

### Pattern 2: AST Traversal

```python
def extract_tables(ast):
    """Extract table names from SQL AST."""
    tables = []
    for node in ast.find_all('table_name'):
        if node.children:
            tables.append(node.children[0].value)
    return tables
```

### Pattern 3: Error Handling

```python
from exonware.xwsyntax import ParseError

try:
    ast = engine.parse(query, grammar='sql')
except ParseError as e:
    print(f"Line {e.line}, Col {e.column}: {e.message}")
```

---

## 📖 Grammar Syntax Cheat Sheet

### Rules

```lark
// Non-terminal (appears in AST)
rule_name: subrule1 subrule2

// Inline rule (doesn't appear in AST)
?inline_rule: subrule

// Terminal (matches text)
TERMINAL: "literal" | /regex/
```

### Operators

```lark
rule: item+        # One or more
rule: item*        # Zero or more
rule: item?        # Optional
rule: a | b        # Choice (a or b)
```

### Common Terminals

```lark
%import common.ESCAPED_STRING
%import common.SIGNED_NUMBER
%import common.WS
%import common.LETTER
%import common.DIGIT
```

### Directives

```lark
%ignore WS              # Ignore whitespace
%ignore COMMENT         # Ignore comments
```

---

## 🎯 Tips

1. **Start Small** - Test basic rules first
2. **Use ?prefix** - Inline rules simplify AST
3. **Test Incrementally** - Add one rule at a time
4. **Check Lark Docs** - [lark-parser.readthedocs.io](https://lark-parser.readthedocs.io/)

---

## 📚 Full Documentation

- **User Guide:** `xwsystem/docs/SYNTAX_ENGINE_GUIDE.md`
- **Implementation:** `xwquery/SYNTAX_ENGINE_IMPLEMENTATION_COMPLETE.md`
- **Examples:** `xwquery/examples/syntax_*.py`

---

## 🤔 FAQ

**Q: Why Lark instead of ANTLR?**  
A: Lark is pure Python, simpler, and sufficient for our needs.

**Q: Performance concerns?**  
A: First parse ~10-20ms (compiles grammar), cached parses ~0.1-1ms.

**Q: Can I use existing grammars?**  
A: Yes! Many Lark grammars available online.

**Q: What about error messages?**  
A: Lark provides line/column info automatically.

**Q: Monaco integration?**  
A: Grammar files can generate Monaco syntax definitions.

---

**Ready to create 31 query grammars?** 🚀

Start with SQL (50 lines), then XPath (30 lines), then the rest!

