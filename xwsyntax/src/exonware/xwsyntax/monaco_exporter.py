#exonware/xwsyntax/src/exonware/xwsyntax/monaco_exporter.py
"""
Monaco grammar exporter - converts Lark grammars to Monaco Monarch format.

This module enables automatic generation of Monaco Editor syntax highlighting
from Lark grammar definitions.
"""

from typing import Any, Optional, Union
from dataclasses import dataclass, field
import re
import json


@dataclass
class MonarchLanguage:
    """Monaco Monarch language definition."""
    
    defaultToken: str = ''
    tokenPostfix: str = ''
    ignoreCase: bool = False
    
    # Language elements
    keywords: list[str] = field(default_factory=list)
    operators: list[str] = field(default_factory=list)
    symbols: str = ''
    
    # Brackets
    brackets: list[dict[str, str]] = field(default_factory=list)
    
    # Tokenizer rules
    tokenizer: dict[str, list[Any]] = field(default_factory=dict)
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for JSON export."""
        result = {
            'defaultToken': self.defaultToken,
            'tokenPostfix': self.tokenPostfix,
        }
        
        if self.ignoreCase:
            result['ignoreCase'] = True
        
        if self.keywords:
            result['keywords'] = self.keywords
        
        if self.operators:
            result['operators'] = self.operators
        
        if self.symbols:
            result['symbols'] = self.symbols
        
        if self.brackets:
            result['brackets'] = self.brackets
        
        if self.tokenizer:
            result['tokenizer'] = self.tokenizer
        
        return result


@dataclass
class MonarchLanguageConfig:
    """Monaco language configuration (auto-closing, comments, etc.)."""
    
    comments: Optional[dict[str, Any]] = None
    brackets: list[list[str]] = field(default_factory=list)
    autoClosingPairs: list[dict[str, str]] = field(default_factory=list)
    surroundingPairs: list[dict[str, str]] = field(default_factory=list)
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for JSON export."""
        result = {}
        
        if self.comments:
            result['comments'] = self.comments
        
        if self.brackets:
            result['brackets'] = self.brackets
        
        if self.autoClosingPairs:
            result['autoClosingPairs'] = self.autoClosingPairs
        
        if self.surroundingPairs:
            result['surroundingPairs'] = self.surroundingPairs
        
        return result


class MonacoExporter:
    """
    Exports Lark grammars to Monaco Monarch format.
    
    This allows automatic syntax highlighting in Monaco Editor
    based on our Lark grammar definitions.
    """
    
    def __init__(self):
        """Initialize exporter."""
        self._keywords: set[str] = set()
        self._operators: set[str] = set()
        self._brackets: list[str] = []
    
    def export_from_grammar_text(
        self,
        grammar_text: str,
        language_name: str,
        case_insensitive: bool = False,
    ) -> dict[str, Any]:
        """
        Export Monaco Monarch definition from Lark grammar text.
        
        Args:
            grammar_text: Lark grammar text
            language_name: Name of the language (e.g., 'sql', 'json')
            case_insensitive: Whether language is case-insensitive
            
        Returns:
            Dictionary with 'language' and 'config' for Monaco
        """
        # Parse grammar to extract elements
        self._extract_from_grammar(grammar_text)
        
        # Build Monarch language definition
        language = MonarchLanguage(
            tokenPostfix=f'.{language_name}',
            ignoreCase=case_insensitive,
            keywords=sorted(self._keywords),
            operators=sorted(self._operators),
            symbols=self._build_symbols_regex(),
            brackets=self._build_brackets(),
            tokenizer=self._build_tokenizer(language_name),
        )
        
        # Build language configuration
        config = MonarchLanguageConfig(
            brackets=self._build_bracket_pairs(),
            autoClosingPairs=self._build_auto_closing_pairs(),
            surroundingPairs=self._build_surrounding_pairs(),
        )
        
        return {
            'language': language.to_dict(),
            'config': config.to_dict(),
        }
    
    def _extract_from_grammar(self, grammar_text: str) -> None:
        """Extract keywords, operators, and brackets from grammar."""
        # Extract literal terminals (keywords)
        # Pattern: "keyword" or 'keyword'
        literal_pattern = r'["\']([^"\']+)["\']'
        for match in re.finditer(literal_pattern, grammar_text):
            literal = match.group(1)
            
            # Check if it's a keyword (alphabetic)
            if literal.isalpha():
                self._keywords.add(literal)
            # Check if it's an operator (symbols)
            elif not literal.isspace():
                self._operators.add(literal)
            
            # Check for brackets
            if literal in ['{', '}', '[', ']', '(', ')']:
                if literal not in self._brackets:
                    self._brackets.append(literal)
    
    def _build_symbols_regex(self) -> str:
        """Build regex pattern for symbol operators."""
        if not self._operators:
            return ''
        
        # Escape special regex characters
        escaped = [re.escape(op) for op in self._operators]
        return '|'.join(escaped)
    
    def _build_brackets(self) -> list[dict[str, str]]:
        """Build bracket definitions."""
        bracket_map = {
            '(': ('parenthesis', ')'),
            '[': ('square', ']'),
            '{': ('curly', '}'),
        }
        
        result = []
        for open_br in ['(', '[', '{']:
            if open_br in self._brackets:
                name, close_br = bracket_map[open_br]
                result.append({
                    'open': open_br,
                    'close': close_br,
                    'token': f'delimiter.{name}'
                })
        
        return result
    
    def _build_tokenizer(self, language_name: str) -> dict[str, list[Any]]:
        """Build tokenizer rules."""
        root_rules = []
        
        # Whitespace
        root_rules.append({'include': '@whitespace'})
        
        # Numbers
        root_rules.append([r'/\d+(\.\d+)?([eE][+-]?\d+)?/', 'number'])
        
        # Strings (single and double quoted)
        root_rules.append([r'/"([^"\\]|\\.)*"/', 'string'])
        root_rules.append([r"/'([^'\\]|\\.)*'/", 'string'])
        
        # Keywords and identifiers
        root_rules.append([r'/[a-zA-Z_][\w]*/', {
            'cases': {
                '@keywords': 'keyword',
                '@default': 'identifier'
            }
        }])
        
        # Operators
        if self._operators:
            for op in sorted(self._operators, key=len, reverse=True):
                root_rules.append([f'/{re.escape(op)}/', 'operator'])
        
        # Brackets
        if self._brackets:
            root_rules.append([r'/[()[\]{}]/', '@brackets'])
        
        # Delimiters
        root_rules.append([r'/[;,.]/', 'delimiter'])
        
        # Whitespace state
        whitespace_rules = [
            [r'/[ \t\r\n]+/', ''],
            [r'/--.*$/', 'comment'],
            [r'/\/\/.*$/', 'comment'],
            [r'/\/\*/', 'comment', '@comment']
        ]
        
        # Comment state
        comment_rules = [
            [r'/[^/*]+/', 'comment'],
            [r'/\*\//', 'comment', '@pop'],
            [r'/[/*]/', 'comment']
        ]
        
        return {
            'root': root_rules,
            'whitespace': whitespace_rules,
            'comment': comment_rules,
        }
    
    def _build_bracket_pairs(self) -> list[list[str]]:
        """Build bracket pairs for auto-closing."""
        pairs = []
        bracket_map = {'(': ')', '[': ']', '{': '}'}
        
        for open_br, close_br in bracket_map.items():
            if open_br in self._brackets:
                pairs.append([open_br, close_br])
        
        return pairs
    
    def _build_auto_closing_pairs(self) -> list[dict[str, str]]:
        """Build auto-closing pair definitions."""
        pairs = []
        bracket_map = {'(': ')', '[': ']', '{': '}'}
        
        for open_br, close_br in bracket_map.items():
            if open_br in self._brackets:
                pairs.append({'open': open_br, 'close': close_br})
        
        # Add quotes if they appear in grammar
        if '"' in self._operators or '"' in str(self._keywords):
            pairs.append({'open': '"', 'close': '"'})
        if "'" in self._operators or "'" in str(self._keywords):
            pairs.append({'open': "'", 'close': "'"})
        
        return pairs
    
    def _build_surrounding_pairs(self) -> list[dict[str, str]]:
        """Build surrounding pair definitions."""
        return self._build_auto_closing_pairs()
    
    def generate_typescript_code(
        self,
        monaco_def: dict[str, Any],
        language_name: str,
    ) -> str:
        """
        Generate TypeScript code for Monaco registration.
        
        Args:
            monaco_def: Monaco definition dict
            language_name: Language name
            
        Returns:
            TypeScript code as string
        """
        import json
        
        language_json = json.dumps(monaco_def['language'], indent=2)
        config_json = json.dumps(monaco_def['config'], indent=2)
        
        ts_code = f"""// {language_name}.monarch.ts
// Auto-generated Monaco language definition

export const {language_name}Language = {language_json};

export const {language_name}LanguageConfig = {config_json};

// Register with Monaco Editor
export function register{language_name.capitalize()}Language(monaco: any) {{
  monaco.languages.register({{ id: '{language_name}' }});
  monaco.languages.setMonarchTokensProvider('{language_name}', {language_name}Language);
  monaco.languages.setLanguageConfiguration('{language_name}', {language_name}LanguageConfig);
}}
"""
        return ts_code


def export_grammar_to_monaco(
    grammar_text: str,
    language_name: str,
    case_insensitive: bool = False,
    output_format: str = 'json',
) -> Any:
    """
    Export Lark grammar to Monaco format.
    
    Args:
        grammar_text: Lark grammar text
        language_name: Language name (e.g., 'sql', 'json')
        case_insensitive: Whether language is case-insensitive
        output_format: 'json' or 'typescript'
        
    Returns:
        Monaco definition as JSON or TypeScript code
    """
    exporter = MonacoExporter()
    monaco_def = exporter.export_from_grammar_text(
        grammar_text,
        language_name,
        case_insensitive,
    )
    
    if output_format == 'typescript':
        return exporter.generate_typescript_code(monaco_def, language_name)
    elif output_format == 'dict':
        return monaco_def
    else:
        import json
        return json.dumps(monaco_def, indent=2)

