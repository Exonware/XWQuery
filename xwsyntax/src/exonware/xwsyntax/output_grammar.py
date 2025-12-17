#!/usr/bin/env python3
#exonware/xwsyntax/src/exonware/xwsyntax/output_grammar.py

"""
Output Grammar Implementation for xwsyntax

Parses and manages .out.grammar files for text generation from AST.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.2
Generation Date: 29-Oct-2025
"""

import re
from typing import Any, Optional, Callable
from pathlib import Path


class OutputGrammar:
    """
    Output grammar for generating text from AST.
    
    Parses .out.grammar files that define templates for each AST node type.
    These templates use Mustache-like syntax for variable substitution,
    conditionals, and loops.
    """
    
    def __init__(self, name: str, grammar_text: str):
        """
        Initialize output grammar.
        
        Args:
            name: Grammar name (e.g., 'json', 'sql')
            grammar_text: Content of .out.grammar file
        """
        self.name = name
        self.grammar_text = grammar_text
        self.templates: dict[str, str] = {}
        self.formatting_rules: dict[str, Any] = {}
        self.filters: dict[str, str] = {}
        
        # Parse grammar
        self._parse_grammar()
    
    def _parse_grammar(self):
        """Parse output grammar into templates, rules, and filters."""
        current_template_name = None
        current_template_lines = []
        
        for line in self.grammar_text.split('\n'):
            stripped = line.strip()
            
            # Skip empty lines and comments (except filter definitions)
            if not stripped or (stripped.startswith('#') and not '@filter:' in line):
                continue
            
            # Template definition: @template_name = ...
            if stripped.startswith('@') and '=' in stripped:
                # Save previous template
                if current_template_name:
                    self.templates[current_template_name] = '\n'.join(current_template_lines).strip()
                
                # Parse new definition
                parts = stripped[1:].split('=', 1)
                name = parts[0].strip()
                value = parts[1].strip() if len(parts) > 1 else ''
                
                # Check if it's a formatting rule or filter
                if name.startswith('filter:'):
                    filter_name = name.replace('filter:', '')
                    self.filters[filter_name] = value
                    current_template_name = None
                    current_template_lines = []
                elif name in ['indent', 'pretty', 'compact', 'sorted', 'line_width']:
                    # Formatting rule
                    try:
                        # Parse value
                        if value.lower() in ['true', 'false']:
                            self.formatting_rules[name] = (value.lower() == 'true')
                        else:
                            self.formatting_rules[name] = int(value)
                    except ValueError:
                        self.formatting_rules[name] = value
                    current_template_name = None
                    current_template_lines = []
                else:
                    # Regular template
                    current_template_name = name
                    current_template_lines = [value] if value else []
            
            # Continuation of current template
            elif current_template_name:
                current_template_lines.append(line)
        
        # Save last template
        if current_template_name:
            self.templates[current_template_name] = '\n'.join(current_template_lines).strip()
    
    def get_template(self, rule_name: str) -> Optional[str]:
        """
        Get template for a rule.
        
        Args:
            rule_name: AST node type / rule name
            
        Returns:
            Template string or None
        """
        return self.templates.get(rule_name)
    
    def get_formatting_rule(self, rule_name: str, default: Any = None) -> Any:
        """Get formatting rule value."""
        return self.formatting_rules.get(rule_name, default)
    
    def get_filter(self, filter_name: str) -> Optional[str]:
        """Get filter definition."""
        return self.filters.get(filter_name)
    
    def list_templates(self) -> list[str]:
        """List all template names."""
        return list(self.templates.keys())
    
    def list_formatting_rules(self) -> list[str]:
        """List all formatting rule names."""
        return list(self.formatting_rules.keys())
    
    def list_filters(self) -> list[str]:
        """List all filter names."""
        return list(self.filters.keys())
    
    @classmethod
    def load_from_file(cls, file_path: str) -> 'OutputGrammar':
        """
        Load output grammar from file.
        
        Args:
            file_path: Path to .out.grammar file
            
        Returns:
            OutputGrammar instance
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Output grammar not found: {file_path}")
        
        with open(path, 'r', encoding='utf-8') as f:
            grammar_text = f.read()
        
        # Extract name from filename
        name = path.stem.replace('.out', '')
        
        return cls(name, grammar_text)
    
    def __repr__(self) -> str:
        return f"OutputGrammar(name='{self.name}', templates={len(self.templates)})"


class OutputGrammarRegistry:
    """Registry for managing output grammars."""
    
    def __init__(self, grammar_dir: Optional[str] = None):
        """
        Initialize registry.
        
        Args:
            grammar_dir: Directory containing .out.grammar files
        """
        self.grammar_dir = grammar_dir
        self._grammars: dict[str, OutputGrammar] = {}
    
    def load_grammar(self, format_name: str) -> OutputGrammar:
        """
        Load output grammar for a format.
        
        Args:
            format_name: Format name (e.g., 'json', 'sql')
            
        Returns:
            OutputGrammar instance
        """
        # Check cache
        if format_name in self._grammars:
            return self._grammars[format_name]
        
        # Load from file
        if not self.grammar_dir:
            # Use default location
            from pathlib import Path
            self.grammar_dir = str(Path(__file__).parent / 'grammars')
        
        grammar_file = Path(self.grammar_dir) / f"{format_name}.out.grammar"
        
        if not grammar_file.exists():
            raise FileNotFoundError(f"Output grammar not found for format: {format_name}")
        
        # Load and cache
        output_grammar = OutputGrammar.load_from_file(str(grammar_file))
        self._grammars[format_name] = output_grammar
        
        return output_grammar
    
    def get_grammar(self, format_name: str) -> Optional[OutputGrammar]:
        """Get cached grammar or None."""
        return self._grammars.get(format_name)
    
    def list_formats(self) -> list[str]:
        """List all available formats."""
        if not self.grammar_dir:
            return []
        
        grammar_dir = Path(self.grammar_dir)
        if not grammar_dir.exists():
            return []
        
        formats = []
        for file in grammar_dir.glob('*.out.grammar'):
            format_name = file.stem.replace('.out', '')
            formats.append(format_name)
        
        return sorted(formats)
    
    def clear_cache(self):
        """Clear grammar cache."""
        self._grammars.clear()


# Global registry instance
_default_registry = None


def get_default_registry() -> OutputGrammarRegistry:
    """Get default output grammar registry."""
    global _default_registry
    if _default_registry is None:
        _default_registry = OutputGrammarRegistry()
    return _default_registry


__all__ = [
    'OutputGrammar',
    'OutputGrammarRegistry',
    'get_default_registry'
]

