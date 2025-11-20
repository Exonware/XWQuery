#exonware/xwsyntax/src/exonware/xwsyntax/errors.py
"""
Exception hierarchy for the syntax module.
"""

from typing import Optional


class SyntaxError(Exception):
    """Base exception for syntax errors."""
    
    def __init__(self, message: str, line: Optional[int] = None, column: Optional[int] = None):
        super().__init__(message)
        self.message = message
        self.line = line
        self.column = column
    
    def __str__(self) -> str:
        if self.line is not None and self.column is not None:
            return f"{self.message} at line {self.line}, column {self.column}"
        elif self.line is not None:
            return f"{self.message} at line {self.line}"
        return self.message


class GrammarError(SyntaxError):
    """Error in grammar definition."""
    pass


class GrammarNotFoundError(GrammarError):
    """Grammar file not found."""
    pass


class ParseError(SyntaxError):
    """Error during parsing."""
    
    def __init__(
        self,
        message: str,
        text: Optional[str] = None,
        line: Optional[int] = None,
        column: Optional[int] = None,
    ):
        super().__init__(message, line, column)
        self.text = text


class ValidationError(SyntaxError):
    """Validation error."""
    pass


class MaxDepthError(SyntaxError):
    """Maximum parse depth exceeded."""
    pass

