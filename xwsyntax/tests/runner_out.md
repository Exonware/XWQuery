# Test Runner Output

**Library:** xwsyntax  
**Generated:** 12-Jan-2026 21:02:31  
**Runner:** Main Orchestrator

---

# Test Execution Report
**Library:** xwsyntax  
**Type:** Main Orchestrator - Hierarchical Test Execution
Main Orchestrator - Hierarchical Test Execution
---

## Running All Test Layers

**Execution Order:** 0.core → 1.unit → 2.integration → 3.advance



## Layer 0: Core Tests

**Status:** Running...
---

```
🎯 Core Tests - Fast, High-Value Checks
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 3 items

test_core_bidirectional.py::TestBidirectionalCore::test_json_simple_roundtrip PASSED [ 33%]
test_core_bidirectional.py::TestBidirectionalCore::test_json_array_roundtrip PASSED [ 66%]
test_core_bidirectional.py::TestBidirectionalCore::test_list_available_grammars PASSED [100%]

============================== warnings summary ===============================
C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303
  C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303: PytestAssertRewriteWarning: Module already imported so cannot be rewritten; anyio
    self._mark_plugins_for_rewrite(hook, disable_autoload)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 3 passed, 1 warning in 1.21s =========================
✅ Core tests PASSED

📝 Results saved to: D:\OneDrive\DEV\exonware\xwsyntax\tests\0.core\runner_out.md

```

**Result:** ✅ PASSED

## Layer 1: Unit Tests

**Status:** Running...
---

```
🧩 Unit Tests - Module by Module

📦 Testing module: bidirectional_tests
   Testing: bidirectional
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 12 items / 3 deselected / 9 selected

bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammar::test_load_json_grammar PASSED [ 11%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammar::test_parse_simple_json PASSED [ 22%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammar::test_generate_simple_json PASSED [ 33%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammar::test_validate_roundtrip_simple PASSED [ 44%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammar::test_validate_roundtrip_array PASSED [ 55%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammar::test_validate_roundtrip_nested PASSED [ 66%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammarRegistry::test_get_registry PASSED [ 77%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammarRegistry::test_list_formats PASSED [ 88%]
bidirectional_tests\test_bidirectional_grammar.py::TestBidirectionalGrammarRegistry::test_load_from_registry PASSED [100%]

============================== warnings summary ===============================
C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303
  C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303: PytestAssertRewriteWarning: Module already imported so cannot be rewritten; anyio
    self._mark_plugins_for_rewrite(hook, disable_autoload)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
================= 9 passed, 3 deselected, 1 warning in 1.33s ==================

📦 Testing module: engine_tests
   Testing: engine
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 8 items

engine_tests\test_syntax_engine.py::TestSyntaxEngine::test_create_engine PASSED [ 12%]
engine_tests\test_syntax_engine.py::TestSyntaxEngine::test_load_json_grammar PASSED [ 25%]
engine_tests\test_syntax_engine.py::TestSyntaxEngine::test_parse_simple_json PASSED [ 37%]
engine_tests\test_syntax_engine.py::TestSyntaxEngine::test_parse_json_array PASSED [ 50%]
engine_tests\test_syntax_engine.py::TestSyntaxEngine::test_invalid_grammar_raises_error PASSED [ 62%]
engine_tests\test_syntax_engine.py::TestSyntaxEngine::test_list_available_grammars PASSED [ 75%]
engine_tests\test_syntax_engine.py::TestGrammar::test_grammar_parse PASSED [ 87%]
engine_tests\test_syntax_engine.py::TestGrammar::test_grammar_caching PASSED [100%]

============================== warnings summary ===============================
C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303
  C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303: PytestAssertRewriteWarning: Module already imported so cannot be rewritten; anyio
    self._mark_plugins_for_rewrite(hook, disable_autoload)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 8 passed, 1 warning in 7.51s =========================

📦 Testing module: grammars_tests
   Testing: grammars
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 25 items

grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_empty_object PASSED [  4%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_empty_array PASSED [  8%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_string_value PASSED [ 12%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_number_value PASSED [ 16%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_boolean_values PASSED [ 20%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_null_value PASSED [ 24%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_nested_objects PASSED [ 28%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_parse_array_of_objects PASSED [ 32%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_generate_empty_object PASSED [ 36%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_generate_simple_object PASSED [ 40%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_roundtrip_all_types PASSED [ 44%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_json_roundtrip_parametrized[empty_obj] PASSED [ 48%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_json_roundtrip_parametrized[empty_arr] PASSED [ 52%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_json_roundtrip_parametrized[simple_obj] PASSED [ 56%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_json_roundtrip_parametrized[simple_arr] PASSED [ 60%]
grammars_tests\test_json_grammar.py::TestJSONGrammar::test_json_roundtrip_parametrized[nested] PASSED [ 64%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_parse_simple_select PASSED [ 68%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_parse_select_with_where PASSED [ 72%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_parse_insert_statement PASSED [ 76%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_parse_update_statement PASSED [ 80%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_parse_delete_statement PASSED [ 84%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_sql_parsing_parametrized[select] PASSED [ 88%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_sql_parsing_parametrized[insert] PASSED [ 92%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_sql_parsing_parametrized[update] PASSED [ 96%]
grammars_tests\test_sql_grammar.py::TestSQLGrammar::test_sql_parsing_parametrized[delete] PASSED [100%]

============================== warnings summary ===============================
C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303
  C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303: PytestAssertRewriteWarning: Module already imported so cannot be rewritten; anyio
    self._mark_plugins_for_rewrite(hook, disable_autoload)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 25 passed, 1 warning in 3.29s ========================

📦 Testing module: optimizations_tests
   Testing: optimizations
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 21 items

optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_create_optimizer PASSED [  4%]
optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_optimize_small_ast_auto PASSED [  9%]
optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_optimize_medium_ast_auto PASSED [ 14%]
optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_optimize_large_ast_auto PASSED [ 19%]
optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_optimize_manual_basic PASSED [ 23%]
optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_optimize_manual_medium PASSED [ 28%]
optimizations_tests\test_ast_optimizer.py::TestASTOptimizer::test_optimize_manual_large PASSED [ 33%]
optimizations_tests\test_ast_optimizer.py::TestOptimizedAST::test_basic_ast_find_by_type PASSED [ 38%]
optimizations_tests\test_ast_optimizer.py::TestOptimizedAST::test_medium_ast_has_type_index PASSED [ 42%]
optimizations_tests\test_ast_optimizer.py::TestOptimizedAST::test_large_ast_has_position_index PASSED [ 47%]
optimizations_tests\test_cache_optimizer.py::TestParserCache::test_create_parser_cache PASSED [ 52%]
optimizations_tests\test_cache_optimizer.py::TestParserCache::test_cache_set_and_get PASSED [ 57%]
optimizations_tests\test_cache_optimizer.py::TestParserCache::test_cache_get_nonexistent_returns_none PASSED [ 61%]
optimizations_tests\test_cache_optimizer.py::TestParserCache::test_cache_clear PASSED [ 66%]
optimizations_tests\test_cache_optimizer.py::TestParserCache::test_cache_stats PASSED [ 71%]
optimizations_tests\test_cache_optimizer.py::TestTemplateCache::test_create_template_cache PASSED [ 76%]
optimizations_tests\test_cache_optimizer.py::TestTemplateCache::test_cache_template PASSED [ 80%]
optimizations_tests\test_type_index.py::TestTypeIndex::test_create_type_index PASSED [ 85%]
optimizations_tests\test_type_index.py::TestTypeIndex::test_index_ast PASSED [ 90%]
optimizations_tests\test_type_index.py::TestTypeIndex::test_find_by_type PASSED [ 95%]
optimizations_tests\test_type_index.py::TestTypeIndex::test_find_by_type_returns_empty_for_nonexistent PASSED [100%]

============================== warnings summary ===============================
C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303
  C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303: PytestAssertRewriteWarning: Module already imported so cannot be rewritten; anyio
    self._mark_plugins_for_rewrite(hook, disable_autoload)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 21 passed, 1 warning in 6.60s ========================

✅ All unit tests PASSED

📝 Results saved to: D:\OneDrive\DEV\exonware\xwsyntax\tests\1.unit\runner_out.md

```

**Result:** ✅ PASSED

## Layer 2: Integration Tests

**Status:** Running...
---

```
🔗 Integration Tests - Cross-Module Scenarios
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 3 items

test_end_to_end.py::TestEndToEndJSON::test_full_json_workflow PASSED     [ 33%]
test_end_to_end.py::TestEndToEndJSON::test_cross_format_scenario PASSED  [ 66%]
test_end_to_end.py::TestEngineIntegration::test_engine_with_multiple_grammars PASSED [100%]

============================== warnings summary ===============================
C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303
  C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\_pytest\config\__init__.py:1303: PytestAssertRewriteWarning: Module already imported so cannot be rewritten; anyio
    self._mark_plugins_for_rewrite(hook, disable_autoload)

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================== 3 passed, 1 warning in 4.84s =========================

✅ Integration tests PASSED

```

**Result:** ✅ PASSED

## Layer 3: Advance Tests

**Status:** Running...
---

```
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.0.2, pluggy-1.6.0 -- C:\Program Files\Python312\python.exe
cachedir: .pytest_cache
rootdir: D:\OneDrive\DEV\exonware\xwsyntax
configfile: pytest.ini
plugins: anyio-3.7.1, asyncio-1.3.0, cov-7.0.0, typeguard-4.4.4
asyncio: mode=Mode.AUTO, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 9 items

tests/3.advance/test_performance.py::TestSyntaxPerformanceExcellence::test_parse_performance_small PASSED [ 11%]
tests/3.advance/test_performance.py::TestSyntaxPerformanceExcellence::test_parse_performance_medium FAILED [ 22%]

================================== FAILURES ===================================
________ TestSyntaxPerformanceExcellence.test_parse_performance_medium ________
tests\3.advance\test_performance.py:52: in test_parse_performance_medium
    assert avg_time < 0.1  # Should be < 100ms per parse
    ^^^^^^^^^^^^^^^^^^^^^
E   assert 0.14603210700006458 < 0.1
---------------------------- Captured stdout call -----------------------------

Average parse time (medium): 146.0321 ms
=========================== short test summary info ===========================
FAILED tests/3.advance/test_performance.py::TestSyntaxPerformanceExcellence::test_parse_performance_medium - assert 0.14603210700006458 < 0.1
!!!!!!!!!!!!!!!!!!!!!!!!!! stopping after 1 failures !!!!!!!!!!!!!!!!!!!!!!!!!!
======================== 1 failed, 1 passed in 23.12s =========================

```

**Result:** ❌ FAILED

---

## 📊 Test Execution Summary
📊 TEST EXECUTION SUMMARY
---
- **Total Layers:** 4
- **Passed:** 3
- **Failed:** 1

### 
❌ SOME TESTS FAILED!
