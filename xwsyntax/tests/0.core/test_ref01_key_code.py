# tests/0.core/test_ref01_key_code.py
"""
0.core tests for REF_01_REQ / REF_14_DX key code paths.
Covers: list_grammars_quick(), load_grammar_quick(name), XWSyntax().parse(),
parse(), validate() — per REF_01 sec. 6 and REF_14_DX.
"""

import pytest
from exonware.xwsyntax import (
    list_grammars_quick,
    load_grammar_quick,
    parse,
    validate,
    XWSyntax,
    get_grammar_metadata,
)
@pytest.mark.xwsyntax_core


class TestRef01ListGrammarsQuick:
    """REF_01/REF_14_DX: list_grammars_quick() returns available grammars."""

    def test_list_grammars_quick_returns_list(self):
        grammars = list_grammars_quick()
        assert isinstance(grammars, list)

    def test_list_grammars_quick_non_empty(self):
        grammars = list_grammars_quick()
        assert len(grammars) >= 1, "At least one grammar should be available"

    def test_list_grammars_quick_includes_json(self):
        grammars = list_grammars_quick()
        assert "json" in grammars, "REF_01 key code: json grammar should be listable"
@pytest.mark.xwsyntax_core


class TestRef01LoadGrammarQuick:
    """REF_01/REF_14_DX: load_grammar_quick(name) loads grammar for parse/generate."""

    def test_load_grammar_quick_json(self):
        g = load_grammar_quick("json")
        assert g is not None
        ast = g.parse('{"a": 1}')
        assert ast is not None
        assert hasattr(ast, "type")
@pytest.mark.xwsyntax_core


class TestRef01FacadeParseValidate:
    """REF_01/REF_14_DX: XWSyntax().parse(text, format_name) and validate()."""

    def test_facade_parse_json(self):
        syntax = XWSyntax()
        ast = syntax.parse('{"name": "Alice"}', "json")
        assert ast is not None
        assert hasattr(ast, "type")

    def test_facade_list_grammars(self):
        syntax = XWSyntax()
        grammars = syntax.list_grammars()
        assert isinstance(grammars, list)
        assert "json" in grammars

    def test_module_parse_json(self):
        ast = parse('{"x": 1}', "json")
        assert ast is not None
        assert hasattr(ast, "type")

    def test_validate_valid_json(self):
        issues = validate('{"a": 1}', "json")
        assert isinstance(issues, list)
@pytest.mark.xwsyntax_core


class TestRef01GetGrammarMetadata:
    """REF_01 sec. 6: get_grammar_metadata() for metadata-driven detection."""

    def test_get_grammar_metadata_available(self):
        meta = get_grammar_metadata()
        assert meta is not None
        # GrammarMetadata instance used for format detection (REF_13_ARCH)
        assert hasattr(meta, "get_metadata") or hasattr(meta, "list_grammars") or hasattr(meta, "__dict__")
