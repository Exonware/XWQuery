#exonware/xwsyntax/tests/0.core/test_import.py
"""
Core import and REF_14 key-code sanity tests for xwsyntax.
Verifies public API (REF_15_API) and key code (REF_14_DX) are importable and usable.
Per REF_51_TEST layer 0: fast, high-value checks; import sanity.
"""

import pytest
@pytest.mark.xwsyntax_core


class TestImportSanity:
    """Import sanity: all REF_15 main entry points and REF_14 key code importable."""

    def test_facade_and_parse_validate_import(self):
        """REF_14: XWSyntax(), parse(), validate()."""
        from exonware.xwsyntax import XWSyntax, parse, validate
        syntax = XWSyntax()
        assert syntax is not None
        ast = parse('{"a": 1}', 'json')
        assert ast is not None
        errs = validate('{"a": 1}', 'json')
        assert errs == [] or (isinstance(errs, list) and len(errs) == 0)

    def test_list_and_load_grammar_quick_import(self):
        """REF_14: list_grammars_quick(), load_grammar_quick(name)."""
        from exonware.xwsyntax import list_grammars_quick, load_grammar_quick
        names = list_grammars_quick()
        assert isinstance(names, (list, tuple)) or names is not None
        g = load_grammar_quick('json')
        assert g is not None

    def test_bidirectional_key_code_import(self):
        """REF_14: BidirectionalGrammar.load(name), parse(text), generate(ast)."""
        from exonware.xwsyntax import BidirectionalGrammar
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"x": 1}')
        assert ast is not None
        out = grammar.generate(ast)
        assert out is not None and 'x' in out
