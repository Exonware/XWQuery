#exonware/xwsyntax/src/exonware/xwsyntax/registry.py
"""
Syntax Handler Registry - NO HARDCODING!
Registry for auto-discovering and managing syntax handlers.
Each handler declares its own metadata (ID, extensions, MIME types).
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com  
Version: 0.6.0.3
Date: October 29, 2025
"""

from typing import Optional, Any
from pathlib import Path
from .contracts import ISyntaxHandler
from .errors import SyntaxError
from .grammar_metadata import get_grammar_metadata


class SyntaxRegistry:
    """
    Registry for syntax handlers.
    NO HARDCODING - handlers self-register by declaring their metadata!
    Example:
        registry = SyntaxRegistry()
        # Register handler (it knows its own metadata!)
        registry.register(SQLGrammarHandler)
        # Get handler by ID
        handler = registry.get_handler("SQL")
        # Auto-detect from file
        format_id = registry.detect_format("query.sql")  # Returns "SQL"
    """

    def __init__(self):
        """Initialize empty registry."""
        self._handlers: dict[str, type[ISyntaxHandler]] = {}
        self._extension_map: dict[str, str] = {}
        self._alias_map: dict[str, str] = {}
        self._instances: dict[str, ISyntaxHandler] = {}  # Cached instances

    def register(self, handler_class: type[ISyntaxHandler]) -> None:
        """
        Register a syntax handler.
        The handler class declares its own metadata - NO HARDCODING!
        Args:
            handler_class: Handler class to register
        Example:
            registry.register(SQLGrammarHandler)
            # SQLGrammarHandler declares:
            # - format_id = "SQL"
            # - syntax_name = "sql"
            # - file_extensions = [".sql", ".ddl", ".dml"]
            # - etc.
        """
        # Create instance to read metadata
        instance = handler_class()
        format_id = instance.format_id
        # Store handler class
        self._handlers[format_id] = handler_class
        # Index by extensions (from handler metadata!)
        for ext in instance.file_extensions:
            ext_lower = ext.lower()
            if not ext_lower.startswith('.'):
                ext_lower = f'.{ext_lower}'
            self._extension_map[ext_lower] = format_id
        # Index by aliases (from handler metadata!)
        for alias in instance.aliases:
            self._alias_map[alias.lower()] = format_id
        # Also index by format_id and syntax_name
        self._alias_map[format_id.lower()] = format_id
        self._alias_map[instance.syntax_name.lower()] = format_id

    def get_handler(self, format_identifier: str) -> ISyntaxHandler:
        """
        Get handler by format ID or alias.
        Args:
            format_identifier: Format ID, syntax name, or alias
        Returns:
            Handler instance (cached)
        Raises:
            ValueError: If format not found
        Example:
            handler = registry.get_handler("SQL")
            handler = registry.get_handler("sql")  # Same handler
        """
        # Try direct lookup
        if format_identifier in self._handlers:
            format_id = format_identifier
        else:
            # Try alias lookup
            format_id = self._alias_map.get(format_identifier.lower())
        if not format_id:
            available = list(self._handlers.keys())
            raise ValueError(
                f"Unknown format: '{format_identifier}'. "
                f"Available formats: {', '.join(available)}"
            )
        # Return cached instance or create new one
        if format_id not in self._instances:
            handler_class = self._handlers[format_id]
            self._instances[format_id] = handler_class()
        return self._instances[format_id]

    def detect_format(self, file_path: str) -> Optional[str]:
        """
        Auto-detect format ID from file extension.
        First checks registered handlers, then falls back to merged metadata
        from *.grammar.info.json files.
        Args:
            file_path: Path to file
        Returns:
            Format ID or None if not detected
        Example:
            format_id = registry.detect_format("query.sql")
            # Returns: "SQL"
        """
        suffix = Path(file_path).suffix.lower()
        # First try registered handlers
        format_id = self._extension_map.get(suffix)
        if format_id:
            return format_id
        # Fallback to merged metadata from *.grammar.info.json files
        try:
            metadata = get_grammar_metadata()
            format_id = metadata.detect_from_extension(file_path)
            if format_id:
                return format_id
        except Exception:
            # If metadata not available, continue
            pass
        return None

    def has_handler(self, format_identifier: str) -> bool:
        """
        Check if handler is registered.
        Args:
            format_identifier: Format ID or alias
        Returns:
            True if handler exists
        """
        if format_identifier in self._handlers:
            return True
        return format_identifier.lower() in self._alias_map

    def list_formats(self) -> list[str]:
        """
        List all registered format IDs.
        Returns:
            List of format IDs
        """
        return list(self._handlers.keys())

    def list_all_extensions(self) -> list[str]:
        """
        List all supported file extensions.
        Returns:
            List of extensions
        """
        return list(self._extension_map.keys())

    def get_metadata(self, format_identifier: str) -> dict[str, Any]:
        """
        Get complete metadata for a format.
        Args:
            format_identifier: Format ID or alias
        Returns:
            Dictionary with all metadata
        """
        handler = self.get_handler(format_identifier)
        return {
            'format_id': handler.format_id,
            'syntax_name': handler.syntax_name,
            'extensions': handler.file_extensions,
            'mime_types': getattr(handler, 'mime_types', []),
            'aliases': handler.aliases,
            'category': handler.category,
            'bidirectional': handler.supports_bidirectional,
        }
# ============================================================================
# GLOBAL REGISTRY
# ============================================================================
_global_registry: Optional[SyntaxRegistry] = None


def get_syntax_registry() -> SyntaxRegistry:
    """
    Get the global syntax registry.
    Lazy-initializes and auto-registers all handlers.
    Returns:
        Global SyntaxRegistry instance
    """
    global _global_registry
    if _global_registry is None:
        _global_registry = SyntaxRegistry()
        _auto_register_handlers(_global_registry)
    return _global_registry


def _auto_register_handlers(registry: SyntaxRegistry) -> None:
    """
    Auto-register all available handlers from *.grammar.info.json files.
    NO HARDCODING - handlers are auto-discovered from grammar info files!
    No try/except per DEV_GUIDELINES.md Line 128 - handlers are core functionality.
    Args:
        registry: Registry to register handlers in
    """
    from pathlib import Path
    from .handlers import XWSyntaxHandler
    # Find grammar directory
    grammar_dir = Path(__file__).parent / 'grammars'
    if not grammar_dir.exists():
        # If grammars directory doesn't exist, nothing to register
        return
    # Auto-discover all formats from *.grammar.info.json files
    info_files = list(grammar_dir.glob("*.grammar.info.json"))
    # Register each format using generic handler
    # XWSyntaxHandler loads metadata from info.json files
    for info_file in info_files:
        # Extract format name (e.g., "json" from "json.grammar.info.json")
        format_name = info_file.stem.replace('.grammar.info', '')
        # Create handler factory that will instantiate XWSyntaxHandler(format_name)
        # We need a factory class since registry expects a class type
        handler_factory = _create_handler_factory(format_name, grammar_dir)
        # Register the factory class
        registry.register(handler_factory)
    # NO HARDCODING - all formats auto-discovered from *.grammar.info.json files!


def _create_handler_factory(format_name: str, grammar_dir: Path) -> type:
    """
    Create a handler factory class for a format.
    Since XWSyntaxHandler requires format_name in __init__, but registry
    expects a class that can be instantiated with no args, we create
    a factory class that wraps XWSyntaxHandler.
    Args:
        format_name: Format name (e.g., 'json', 'sql')
        grammar_dir: Directory containing grammar files
    Returns:
        Handler factory class
    """
    from .handlers import XWSyntaxHandler
    class HandlerFactory(XWSyntaxHandler):
        """Factory class that wraps XWSyntaxHandler for registry."""
        def __init__(self):
            """Initialize with the format name."""
            # Call parent with format_name and grammar_dir
            super().__init__(format_name, grammar_dir)
    # Set class name for debugging
    HandlerFactory.__name__ = f"{format_name.upper()}SyntaxHandler"
    HandlerFactory.__qualname__ = f"{format_name.upper()}SyntaxHandler"
    return HandlerFactory
# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================


def register_syntax_handler(handler_class: type[ISyntaxHandler]) -> None:
    """
    Register a custom syntax handler.
    Args:
        handler_class: Handler class to register
    Example:
        @register_syntax_handler
        class CustomQLHandler(ASyntaxHandler):
            @property
            def format_id(self) -> str:
                return "CustomQL"
            @property
            def syntax_name(self) -> str:
                return "customql"
            @property
            def file_extensions(self) -> list[str]:
                return [".cql"]
    """
    registry = get_syntax_registry()
    registry.register(handler_class)


def list_available_formats() -> list[str]:
    """
    List all available syntax formats.
    Returns:
        List of format IDs
    """
    registry = get_syntax_registry()
    return registry.list_formats()


def detect_syntax_format(file_path: str) -> Optional[str]:
    """
    Auto-detect syntax format from file path.
    Args:
        file_path: Path to file
    Returns:
        Format ID or None
    Example:
        format_id = detect_syntax_format("query.sql")
        # Returns: "SQL"
    """
    registry = get_syntax_registry()
    return registry.detect_format(file_path)
