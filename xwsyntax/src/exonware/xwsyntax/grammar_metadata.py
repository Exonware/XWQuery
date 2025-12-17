#!/usr/bin/env python3
"""
Grammar Metadata Loader - Uses grammars_master.json

Loads and provides access to grammar metadata from grammars_master.json.
Provides lookups by file extension, MIME type, alias, and format ID.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.2
Generation Date: 29-Oct-2025
"""

import json
from typing import Optional, Any
from pathlib import Path


class GrammarMetadata:
    """
    Grammar metadata manager using grammars_master.json.
    
    Provides:
    - Lookup by file extension
    - Lookup by MIME type
    - Lookup by alias
    - Lookup by format ID
    - Complete metadata retrieval
    """
    
    def __init__(self, master_file: Optional[str] = None):
        """
        Initialize metadata loader.
        
        Args:
            master_file: Path to grammars_master.json (None = auto-detect)
        """
        if master_file is None:
            # Auto-detect: look in grammars directory
            grammar_dir = Path(__file__).parent / 'grammars'
            master_file = grammar_dir / 'grammars_master.json'
        
        self.master_file = Path(master_file)
        self._data: dict[str, dict[str, Any]] = {}
        self._extension_map: dict[str, str] = {}  # .ext -> format_id
        self._mime_map: dict[str, str] = {}  # mime_type -> format_id
        self._alias_map: dict[str, str] = {}  # alias -> format_id
        
        self._load()
    
    def _load(self) -> None:
        """Load and index grammars_master.json."""
        if not self.master_file.exists():
            raise FileNotFoundError(
                f"grammars_master.json not found at: {self.master_file}"
            )
        
        with open(self.master_file, 'r', encoding='utf-8') as f:
            self._data = json.load(f)
        
        # Build indexes
        for format_id, metadata in self._data.items():
            # Index by file extensions
            for ext in metadata.get('file_extensions', []):
                ext_lower = ext.lower()
                if not ext_lower.startswith('.'):
                    ext_lower = f'.{ext_lower}'
                # Handle conflicts: first one wins
                if ext_lower not in self._extension_map:
                    self._extension_map[ext_lower] = format_id
            
            # Index by MIME types
            for mime in metadata.get('mime_types', []):
                mime_lower = mime.lower()
                # Handle conflicts: first one wins
                if mime_lower not in self._mime_map:
                    self._mime_map[mime_lower] = format_id
            
            # Index by aliases
            for alias in metadata.get('aliases', []):
                alias_lower = alias.lower()
                # Handle conflicts: first one wins
                if alias_lower not in self._alias_map:
                    self._alias_map[alias_lower] = format_id
            
            # Also index by format_id and name
            self._alias_map[format_id.lower()] = format_id
            self._alias_map[metadata.get('name', '').lower()] = format_id
    
    def get_metadata(self, format_id: str) -> Optional[dict[str, Any]]:
        """
        Get metadata for a format.
        
        Args:
            format_id: Format identifier (e.g., 'json', 'sql')
            
        Returns:
            Metadata dict or None if not found
        """
        return self._data.get(format_id)
    
    def detect_from_extension(self, file_path: str) -> Optional[str]:
        """
        Detect format from file extension.
        
        Args:
            file_path: Path to file
            
        Returns:
            Format ID or None
        """
        ext = Path(file_path).suffix.lower()
        return self._extension_map.get(ext)
    
    def detect_from_mime_type(self, mime_type: str) -> Optional[str]:
        """
        Detect format from MIME type.
        
        Args:
            mime_type: MIME type (e.g., 'application/json')
            
        Returns:
            Format ID or None
        """
        return self._mime_map.get(mime_type.lower())
    
    def detect_from_alias(self, alias: str) -> Optional[str]:
        """
        Detect format from alias.
        
        Args:
            alias: Format alias or name
            
        Returns:
            Format ID or None
        """
        return self._alias_map.get(alias.lower())
    
    def find_format(self, identifier: str) -> Optional[str]:
        """
        Find format by any identifier (ID, alias, extension, MIME type).
        
        Args:
            identifier: Format ID, alias, extension, or MIME type
            
        Returns:
            Format ID or None
        """
        # Try direct lookup
        if identifier in self._data:
            return identifier
        
        # Try alias lookup
        format_id = self._alias_map.get(identifier.lower())
        if format_id:
            return format_id
        
        # Try as extension
        if identifier.startswith('.'):
            format_id = self._extension_map.get(identifier.lower())
        else:
            format_id = self._extension_map.get(f'.{identifier.lower()}')
        if format_id:
            return format_id
        
        # Try as MIME type
        format_id = self._mime_map.get(identifier.lower())
        if format_id:
            return format_id
        
        return None
    
    def list_formats(self) -> list[str]:
        """
        List all format IDs.
        
        Returns:
            List of format IDs
        """
        return sorted(self._data.keys())
    
    def list_extensions(self) -> list[str]:
        """
        List all supported file extensions.
        
        Returns:
            List of extensions
        """
        return sorted(self._extension_map.keys())
    
    def list_mime_types(self) -> list[str]:
        """
        List all supported MIME types.
        
        Returns:
            List of MIME types
        """
        return sorted(self._mime_map.keys())
    
    def get_extensions(self, format_id: str) -> list[str]:
        """
        Get file extensions for a format.
        
        Args:
            format_id: Format identifier
            
        Returns:
            List of file extensions
        """
        metadata = self.get_metadata(format_id)
        if metadata:
            return metadata.get('file_extensions', [])
        return []
    
    def get_mime_types(self, format_id: str) -> list[str]:
        """
        Get MIME types for a format.
        
        Args:
            format_id: Format identifier
            
        Returns:
            List of MIME types
        """
        metadata = self.get_metadata(format_id)
        if metadata:
            return metadata.get('mime_types', [])
        return []
    
    def get_primary_mime_type(self, format_id: str) -> Optional[str]:
        """
        Get primary MIME type for a format.
        
        Args:
            format_id: Format identifier
            
        Returns:
            Primary MIME type or None
        """
        metadata = self.get_metadata(format_id)
        if metadata:
            return metadata.get('primary_mime_type')
        return None
    
    def is_binary(self, format_id: str) -> bool:
        """
        Check if format is binary.
        
        Args:
            format_id: Format identifier
            
        Returns:
            True if binary format
        """
        metadata = self.get_metadata(format_id)
        if metadata:
            return metadata.get('is_binary', False)
        return False
    
    def supports_bidirectional(self, format_id: str) -> bool:
        """
        Check if format supports bidirectional conversion.
        
        Args:
            format_id: Format identifier
            
        Returns:
            True if bidirectional
        """
        metadata = self.get_metadata(format_id)
        if metadata:
            return metadata.get('supports_bidirectional', False)
        return False


# ============================================================================
# GLOBAL INSTANCE
# ============================================================================

_global_metadata: Optional[GrammarMetadata] = None


def get_grammar_metadata() -> GrammarMetadata:
    """
    Get global grammar metadata instance.
    
    Returns:
        GrammarMetadata instance
    """
    global _global_metadata
    
    if _global_metadata is None:
        _global_metadata = GrammarMetadata()
    
    return _global_metadata

