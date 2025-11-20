# xwquery + xwsyntax Integration Plan

**Date:** October 29, 2025  
**Company:** eXonware.com  
**Goal:** Integrate all 30+ grammars into xwquery using xwsyntax

---

## 📋 **DISCOVERED GRAMMARS**

### xwquery Grammars (30 files)
1. sql.grammar
2. json.grammar
3. xwqueryscript.grammar
4. graphql.grammar
5. cypher.grammar
6. gremlin.grammar
7. sparql.grammar
8. gql.grammar
9. mongodb.grammar
10. cql.grammar
11. elasticsearch.grammar
12. eql.grammar
13. promql.grammar
14. flux.grammar
15. logql.grammar
16. jmespath.grammar
17. jq.grammar
18. jsoniq.grammar
19. xpath.grammar
20. xquery.grammar
21. datalog.grammar
22. linq.grammar
23. n1ql.grammar
24. partiql.grammar
25. hiveql.grammar
26. hql.grammar
27. pig.grammar
28. kql.grammar
29. json_query.grammar
30. xml_query.grammar

### xwsystem/xwsyntax Grammars (3 bidirectional pairs)
1. json (json.in.grammar + json.out.grammar) ✅ Perfect
2. sql (sql.in.grammar + sql.out.grammar) 🟡 70%
3. python (python.in.grammar + python.out.grammar) 🟡 50%

---

## 🎯 **INTEGRATION STRATEGY**

### Phase 1: Dependency & Structure ✅
1. Add xwsyntax as dependency to xwquery
2. Create grammar migration structure

### Phase 2: Grammar Migration 🔄
1. Move all 30 grammars from xwquery → xwsyntax
2. Convert to bidirectional format (.in.grammar only initially)
3. Create output grammars (.out.grammar) for each
4. Test each grammar pair

### Phase 3: Code Integration 🔄
1. Update xwquery to use xwsyntax.BidirectionalGrammar
2. Remove duplicated parser code
3. Update all adapters
4. Update imports

### Phase 4: Testing & Validation 🔄
1. Test all 30+ grammars
2. Validate bidirectional roundtrips
3. Performance benchmarks

### Phase 5: Documentation 🔄
1. Update xwquery README
2. Migration guide
3. API documentation

---

## 📦 **MIGRATION APPROACH**

### Step 1: Move Grammars
```
xwquery/src/exonware/xwquery/query/grammars/*.grammar
    ↓ MOVE TO ↓
xwsyntax/src/exonware/xwsyntax/grammars/*.in.grammar
```

### Step 2: Create Output Grammars
For each `.in.grammar`, create corresponding `.out.grammar`

### Step 3: Update xwquery
```python
# OLD (xwquery using lark directly)
from lark import Lark
parser = Lark(grammar_text)

# NEW (xwquery using xwsyntax)
from exonware.xwsyntax import BidirectionalGrammar
grammar = BidirectionalGrammar.load('sql')
ast = grammar.parse(query_text)
```

---

## 🗑️ **CODE TO REMOVE (Duplicates)**

1. **xwquery grammar loader** - Use xwsyntax.BidirectionalGrammar
2. **xwquery parser instances** - Use xwsyntax.SyntaxEngine
3. **Manual AST handling** - Use xwsyntax AST classes
4. **Duplicated grammar logic** - Consolidate to xwsyntax

---

## ✅ **EXPECTED OUTCOMES**

1. ✅ All 30+ grammars in xwsyntax
2. ✅ xwquery uses xwsyntax for all parsing
3. ✅ No duplicated code
4. ✅ Bidirectional support for all formats
5. ✅ 83% code reduction validated
6. ✅ Unified grammar infrastructure

---

## 📊 **CODE REDUCTION ESTIMATE**

**Current:**
- xwquery parsers: ~2,000 lines
- xwquery grammar handling: ~800 lines
- Duplicated logic: ~500 lines
- **Total: ~3,300 lines**

**After:**
- xwsyntax integration: ~200 lines
- Grammar adapters: ~400 lines
- **Total: ~600 lines**

**Reduction: 2,700 lines (82%)** ✅

---

## 🚀 **EXECUTION PLAN**

1. Update xwquery dependencies (add xwsyntax)
2. Move all 30 grammars to xwsyntax/grammars/
3. Rename to .in.grammar format
4. Create basic .out.grammar for each
5. Update xwquery adapters to use xwsyntax
6. Remove old parser code
7. Test integration
8. Update documentation

---

*Let's execute this plan systematically!*

