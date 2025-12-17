#exonware/xwsyntax/src/exonware/xwsyntax/grammar_loader.py
"""
Multi-format grammar loader using xwsystem.serialization.

Supports multiple grammar formats by reusing existing serializers:
- Lark EBNF (.grammar)
- TextMate JSON (.tmLanguage.json) 
- TextMate PLIST (.tmLanguage, .plist)
- XML grammars (.xml)
- YAML grammars (.yaml, .yml)
- TOML grammars (.toml)

This follows the "never reinvent the wheel" principle by reusing
the production-tested serialization system.
"""

from pathlib import Path
from typing import Any, Optional, Union
from .defs import GrammarFormat
from .errors import GrammarError, GrammarNotFoundError

# Import serialization from xwsystem - no try/except per DEV_GUIDELINES.md Line 128
from exonware.xwsystem.io.serialization import (
    JsonSerializer,
    PlistSerializer,
    XmlSerializer,
    YamlSerializer,
    TomlSerializer,
)


class MultiFormatGrammarLoader:
    """
    Load grammars in multiple formats using serialization system.
    
    Automatically detects format and uses appropriate serializer.
    """
    
    def __init__(self):
        """Initialize with lazy-loaded serializers."""
        self._json_ser = None
        self._plist_ser = None
        self._xml_ser = None
        self._yaml_ser = None
        self._toml_ser = None
    
    @property
    def json_serializer(self):
        """Lazy-load JSON serializer."""
        if self._json_ser is None and JsonSerializer:
            self._json_ser = JsonSerializer()
        return self._json_ser
    
    @property
    def plist_serializer(self):
        """Lazy-load PLIST serializer."""
        if self._plist_ser is None and PlistSerializer:
            self._plist_ser = PlistSerializer()
        return self._plist_ser
    
    @property
    def xml_serializer(self):
        """Lazy-load XML serializer."""
        if self._xml_ser is None and XmlSerializer:
            self._xml_ser = XmlSerializer()
        return self._xml_ser
    
    @property
    def yaml_serializer(self):
        """Lazy-load YAML serializer."""
        if self._yaml_ser is None and YamlSerializer:
            self._yaml_ser = YamlSerializer()
        return self._yaml_ser
    
    @property
    def toml_serializer(self):
        """Lazy-load TOML serializer."""
        if self._toml_ser is None and TomlSerializer:
            self._toml_ser = TomlSerializer()
        return self._toml_ser
    
    def load_grammar_file(self, file_path: Union[str, Path]) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """
        Load grammar from file in any supported format.
        
        Args:
            file_path: Path to grammar file
            
        Returns:
            Tuple of (grammar_text, format, metadata)
            
        Raises:
            GrammarNotFoundError: If file not found
            GrammarError: If file format not supported or invalid
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise GrammarNotFoundError(f"Grammar file not found: {file_path}")
        
        # Detect format by extension
        suffix = file_path.suffix.lower()
        name = file_path.name.lower()
        
        try:
            # Lark EBNF format
            if suffix == '.grammar' or suffix == '.lark':
                return self._load_lark_format(file_path)
            
            # TextMate JSON format
            elif suffix == '.json' or 'tmlanguage.json' in name:
                return self._load_textmate_json(file_path)
            
            # TextMate PLIST format
            elif suffix in ['.plist', '.tmlanguage']:
                return self._load_textmate_plist(file_path)
            
            # XML format
            elif suffix == '.xml':
                return self._load_xml_format(file_path)
            
            # YAML format
            elif suffix in ['.yaml', '.yml']:
                return self._load_yaml_format(file_path)
            
            # TOML format
            elif suffix == '.toml':
                return self._load_toml_format(file_path)
            
            else:
                raise GrammarError(f"Unsupported grammar format: {suffix}")
                
        except Exception as e:
            if isinstance(e, (GrammarError, GrammarNotFoundError)):
                raise
            raise GrammarError(f"Failed to load grammar from {file_path}: {e}")
    
    def _load_lark_format(self, file_path: Path) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """Load Lark EBNF grammar."""
        grammar_text = file_path.read_text(encoding='utf-8')
        metadata = {
            'source_format': 'lark',
            'source_file': str(file_path),
        }
        return grammar_text, GrammarFormat.LARK, metadata
    
    def _load_textmate_json(self, file_path: Path) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """Load TextMate JSON grammar using JsonSerializer."""
        if not self.json_serializer:
            raise GrammarError("JSON serializer not available")
        
        # Use serialization system to load
        data = self.json_serializer.load(file_path)
        
        # Convert TextMate to Lark
        grammar_text = self._convert_textmate_to_lark(data)
        
        metadata = {
            'source_format': 'textmate_json',
            'source_file': str(file_path),
            'textmate_data': data,
        }
        
        return grammar_text, GrammarFormat.CUSTOM, metadata
    
    def _load_textmate_plist(self, file_path: Path) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """Load TextMate PLIST grammar using PlistSerializer."""
        if not self.plist_serializer:
            raise GrammarError("PLIST serializer not available")
        
        # Use serialization system to load
        data = self.plist_serializer.load(file_path)
        
        # Convert TextMate to Lark
        grammar_text = self._convert_textmate_to_lark(data)
        
        metadata = {
            'source_format': 'textmate_plist',
            'source_file': str(file_path),
            'textmate_data': data,
        }
        
        return grammar_text, GrammarFormat.CUSTOM, metadata
    
    def _load_xml_format(self, file_path: Path) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """Load XML grammar using XmlSerializer."""
        if not self.xml_serializer:
            raise GrammarError("XML serializer not available")
        
        # Use serialization system to load
        data = self.xml_serializer.load(file_path)
        
        # Check if it's TextMate XML format
        if isinstance(data, dict) and 'patterns' in data:
            grammar_text = self._convert_textmate_to_lark(data)
            source_format = 'textmate_xml'
        else:
            # Generic XML - try to convert
            grammar_text = self._convert_generic_xml_to_lark(data)
            source_format = 'xml'
        
        metadata = {
            'source_format': source_format,
            'source_file': str(file_path),
        }
        
        return grammar_text, GrammarFormat.CUSTOM, metadata
    
    def _load_yaml_format(self, file_path: Path) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """Load YAML grammar using YamlSerializer."""
        if not self.yaml_serializer:
            raise GrammarError("YAML serializer not available")
        
        # Use serialization system to load
        data = self.yaml_serializer.load(file_path)
        
        # Check if it's TextMate YAML format
        if isinstance(data, dict) and 'patterns' in data:
            grammar_text = self._convert_textmate_to_lark(data)
        else:
            # Assume it's a Lark grammar in YAML
            grammar_text = self._convert_yaml_grammar_to_lark(data)
        
        metadata = {
            'source_format': 'yaml',
            'source_file': str(file_path),
        }
        
        return grammar_text, GrammarFormat.LARK, metadata
    
    def _load_toml_format(self, file_path: Path) -> tuple[str, GrammarFormat, dict[str, Any]]:
        """Load TOML grammar using TomlSerializer."""
        if not self.toml_serializer:
            raise GrammarError("TOML serializer not available")
        
        # Use serialization system to load
        data = self.toml_serializer.load(file_path)
        
        # Convert TOML to Lark
        grammar_text = self._convert_toml_grammar_to_lark(data)
        
        metadata = {
            'source_format': 'toml',
            'source_file': str(file_path),
        }
        
        return grammar_text, GrammarFormat.LARK, metadata
    
    def _convert_textmate_to_lark(self, textmate_data: dict[str, Any]) -> str:
        """
        Convert TextMate grammar to Lark EBNF format.
        
        This is a simplified converter that extracts basic patterns.
        For full TextMate support, use the TextMate runtime directly.
        """
        # Extract basic info
        scope_name = textmate_data.get('scopeName', 'unknown')
        patterns = textmate_data.get('patterns', [])
        repository = textmate_data.get('repository', {})
        
        # Build simplified Lark grammar
        lines = [
            f"// Converted from TextMate grammar: {scope_name}",
            f"// Note: This is a simplified conversion",
            "",
            "?start: content",
            "",
            "content: (token | ANY)*",
            "",
        ]
        
        # Add patterns as rules (simplified)
        for i, pattern in enumerate(patterns):
            if 'match' in pattern:
                match_pattern = pattern['match']
                name = pattern.get('name', f'pattern_{i}')
                lines.append(f"// Pattern: {name}")
                lines.append(f"pattern_{i}: /{match_pattern}/")
                lines.append("")
        
        # Add terminals
        lines.extend([
            "// Terminals",
            "token: /\\w+/",
            "ANY: /./",
            "",
            "%import common.WS",
            "%ignore WS",
        ])
        
        return "\n".join(lines)
    
    def _convert_generic_xml_to_lark(self, xml_data: Any) -> str:
        """Convert generic XML to Lark (basic)."""
        # Very basic conversion - just create a simple grammar
        return """
// Converted from XML
?start: content
content: (element | TEXT)*
element: "<" NAME ">" content "</" NAME ">"
TEXT: /[^<>]+/
NAME: /[a-zA-Z_][\\w]*/

%import common.WS
%ignore WS
"""
    
    def _convert_yaml_grammar_to_lark(self, yaml_data: dict[str, Any]) -> str:
        """Convert YAML-defined grammar to Lark."""
        # If YAML contains 'rules' key, build grammar from it
        if isinstance(yaml_data, dict) and 'rules' in yaml_data:
            rules = yaml_data['rules']
            lines = ["// Converted from YAML", ""]
            
            for rule_name, rule_def in rules.items():
                lines.append(f"{rule_name}: {rule_def}")
            
            return "\n".join(lines)
        
        # Otherwise, return simple grammar
        return "?start: content\ncontent: ANY*\nANY: /.*/"
    
    def _convert_toml_grammar_to_lark(self, toml_data: dict[str, Any]) -> str:
        """Convert TOML-defined grammar to Lark."""
        # If TOML contains 'grammar' section, use it
        if 'grammar' in toml_data:
            return toml_data['grammar']
        
        # Otherwise, build from rules
        if 'rules' in toml_data:
            rules = toml_data['rules']
            lines = ["// Converted from TOML", ""]
            
            for rule_name, rule_def in rules.items():
                lines.append(f"{rule_name}: {rule_def}")
            
            return "\n".join(lines)
        
        # Fallback
        return "?start: content\ncontent: ANY*\nANY: /.*/"


# Singleton instance
_loader = None

def get_grammar_loader() -> MultiFormatGrammarLoader:
    """Get singleton grammar loader instance."""
    global _loader
    if _loader is None:
        _loader = MultiFormatGrammarLoader()
    return _loader

