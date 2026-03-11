#!/usr/bin/env python3
"""
#exonware/xwsyntax/tests/3.advance/test_security.py
Advance security tests for xwsyntax.
Priority #1: Security Excellence
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 07-Jan-2025
"""

import pytest
from exonware.xwsyntax import XWSyntax, BidirectionalGrammar
from exonware.xwsyntax.errors import SyntaxError, ParseError
@pytest.mark.xwsyntax_advance
@pytest.mark.xwsyntax_security

class TestSyntaxSecurityExcellence:
    """Security excellence tests for xwsyntax."""

    def test_malicious_grammar_injection(self):
        """Test protection against malicious grammar injection."""
        syntax = XWSyntax()
        # Attempt to inject malicious grammar
        malicious_input = "../../etc/passwd"
        with pytest.raises(SyntaxError):
            syntax.parse(malicious_input, malicious_input)

    def test_path_traversal_protection(self):
        """Test protection against path traversal attacks."""
        syntax = XWSyntax()
        # Attempt path traversal
        with pytest.raises(SyntaxError):
            syntax.parse("data", "../../../etc/passwd")

    def test_resource_exhaustion_protection(self):
        """Test protection against resource exhaustion attacks."""
        syntax = XWSyntax()
        # Attempt to parse extremely large input
        large_input = "{" * (10 ** 6)  # 1 million opening braces
        with pytest.raises((SyntaxError, MemoryError, RecursionError)):
            syntax.parse(large_input, "json")

    def test_input_validation(self):
        """Test that input validation prevents invalid data."""
        syntax = XWSyntax()
        # Invalid JSON should raise error (ParseError is subclass of SyntaxError)
        with pytest.raises((SyntaxError, ParseError)):
            syntax.parse("{invalid json}", "json")

    def test_grammar_validation(self):
        """Test that grammar names are validated."""
        syntax = XWSyntax()
        # Invalid grammar name should raise error
        with pytest.raises(SyntaxError):
            syntax.parse("data", "nonexistent_grammar_12345")
