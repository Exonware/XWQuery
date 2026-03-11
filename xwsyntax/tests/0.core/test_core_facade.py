#exonware/xwsyntax/tests/0.core/test_core_facade.py
"""
Core tests for XWSyntax facade and REF_14_DX key code paths.
Covers: list_grammars_quick(), load_grammar_quick(name), XWSyntax().parse(text, format_name).
Requirements: REF_01_REQ, REF_14_DX (key code), REF_51_TEST (0.core).
Company: eXonware.com
"""

import pytest
from exonware.xwsyntax import XWSyntax, list_grammars_quick, load_grammar_quick, parse
@pytest.mark.xwsyntax_core


class TestCoreFacade:
    """REF_14_DX key code: facade parse, list_grammars_quick, load_grammar_quick."""

    def test_facade_parse_json(self):
        """XWSyntax().parse(text, format_name) - key code path."""
        syntax = XWSyntax()
        ast = syntax.parse('{"name": "Alice", "age": 30}', "json")
        assert ast is not None

    def test_parse_convenience_function(self):
        """parse(text, format_name) - key code path."""
        ast = parse('{"a": 1}', "json")
        assert ast is not None

    def test_list_grammars_quick(self):
        """list_grammars_quick() - key code path from REF_14_DX."""
        grammars = list_grammars_quick()
        assert grammars is not None
        assert isinstance(grammars, (list, tuple)) or hasattr(grammars, "__iter__")

    def test_load_grammar_quick(self):
        """load_grammar_quick(name) - key code path from REF_14_DX."""
        grammar = load_grammar_quick("json")
        assert grammar is not None
