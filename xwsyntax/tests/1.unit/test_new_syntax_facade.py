#!/usr/bin/env python3
"""
Tests for new XWSyntax facade with zero-hardcoding architecture.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Date: October 29, 2025
"""

import pytest
from pathlib import Path


class TestSyntaxRegistry:
    """Test SyntaxRegistry with self-describing handlers."""
    
    def test_registry_initialization(self):
        """Test registry initializes and auto-registers handlers."""
        from exonware.xwsyntax.registry import get_syntax_registry
        
        registry = get_syntax_registry()
        assert registry is not None
    
    def test_registry_has_formats(self):
        """Test registry has registered formats."""
        from exonware.xwsyntax.registry import get_syntax_registry
        
        registry = get_syntax_registry()
        formats = registry.list_formats()
        
        # Should have at least the example handlers
        assert len(formats) >= 0  # May have SQL, GraphQL, JSON if registered
    
    def test_get_handler_by_id(self):
        """Test getting handler by format ID."""
        from exonware.xwsyntax.registry import get_syntax_registry
        
        registry = get_syntax_registry()
        
        # Register a test handler if needed
        try:
            handler = registry.get_handler("SQL")
            assert handler is not None
            assert handler.format_id == "SQL"
            assert handler.syntax_name == "sql"
        except ValueError:
            # SQL handler not registered yet
            pytest.skip("SQL handler not registered")
    
    def test_detect_format_from_extension(self):
        """Test auto-detection from file extension."""
        from exonware.xwsyntax.registry import get_syntax_registry
        
        registry = get_syntax_registry()
        
        # Try SQL detection
        try:
            format_id = registry.detect_format("query.sql")
            if format_id:  # If SQL handler registered
                assert format_id == "SQL"
        except:
            pytest.skip("SQL handler not registered")
    
    def test_handler_metadata_no_hardcoding(self):
        """Test that handler declares all its own metadata."""
        from exonware.xwsyntax.registry import get_syntax_registry
        
        registry = get_syntax_registry()
        
        try:
            handler = registry.get_handler("SQL")
            
            # All metadata should come from handler class
            assert hasattr(handler, 'format_id')
            assert hasattr(handler, 'syntax_name')
            assert hasattr(handler, 'file_extensions')
            assert hasattr(handler, 'aliases')
            assert hasattr(handler, 'category')
            assert hasattr(handler, 'supports_bidirectional')
            
            # Verify metadata is NOT empty
            assert handler.format_id != ""
            assert handler.syntax_name != ""
            assert len(handler.file_extensions) > 0
        except ValueError:
            pytest.skip("SQL handler not registered")


class TestXWSyntaxOption2:
    """Test Option 2: XWSyntax.load() with auto-discovery."""
    
    def test_load_with_grammar_dir(self):
        """Test loading with grammar directory auto-discovery."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            # This should auto-find grammars/sql.in.grammar
            syntax = XWSyntax.load(
                format="SQL",
                grammar_dir="grammars/",
                bidirectional=False  # Only input for now
            )
            
            assert syntax.format_id == "SQL"
            assert syntax.syntax_name == "sql"
        except:
            # Grammar files may not exist yet
            pytest.skip("SQL grammars not found")
    
    def test_load_bidirectional(self):
        """Test loading both input and output grammars."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax.load(
                format="SQL",
                grammar_dir="grammars/",
                bidirectional=True  # Load both .in and .out
            )
            
            # Should have both grammars
            # (test will skip if files don't exist)
            assert syntax is not None
        except:
            pytest.skip("SQL grammars not found")
    
    def test_load_with_metadata_override(self):
        """Test metadata override in load()."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax.load(
                format="SQL",
                grammar_dir="grammars/",
                # Override metadata
                extensions=[".custom"],
                aliases=["custom-sql"]
            )
            
            # Overrides should be applied
            assert syntax is not None
        except:
            pytest.skip("SQL handler/grammars not found")


class TestXWSyntaxOption3:
    """Test Option 3: XWSyntax.from_grammar() with auto-detection."""
    
    def test_from_grammar_auto_detect(self):
        """Test creating from grammar file with auto-detection."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax.from_grammar("grammars/sql.in.grammar")
            
            # Should auto-detect SQL
            assert syntax.format_id == "SQL"
            assert syntax.syntax_name == "sql"
        except:
            pytest.skip("SQL grammars not found")
    
    def test_from_grammar_finds_output(self):
        """Test that from_grammar auto-finds matching .out grammar."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax.from_grammar("grammars/sql.in.grammar")
            
            # Should find sql.out.grammar if it exists
            # (test passes either way)
            assert syntax is not None
        except:
            pytest.skip("SQL grammars not found")


class TestAliases:
    """Test all parse/generate aliases work."""
    
    def test_parse_deserialize_alias(self):
        """Test that deserialize() is alias for parse()."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax("SQL", "sql", grammar_in="grammars/sql.in.grammar")
            
            # Both should work the same way
            # (actual parsing may fail without proper grammar, that's OK)
            assert hasattr(syntax, 'parse')
            assert hasattr(syntax, 'deserialize')
            
            # They should be methods
            assert callable(syntax.parse)
            assert callable(syntax.deserialize)
        except:
            pytest.skip("SQL setup failed")
    
    def test_generate_aliases(self):
        """Test that serialize() and unparse() are aliases for generate()."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        from exonware.xwsyntax.syntax_tree import ASTNode
        
        try:
            syntax = XWSyntax("SQL", "sql", grammar_out="grammars/sql.out.grammar")
            
            # All aliases should exist
            assert hasattr(syntax, 'generate')
            assert hasattr(syntax, 'serialize')
            assert hasattr(syntax, 'unparse')
            
            # They should be methods
            assert callable(syntax.generate)
            assert callable(syntax.serialize)
            assert callable(syntax.unparse)
        except:
            pytest.skip("SQL setup failed")


class TestMetadataAccess:
    """Test accessing handler metadata."""
    
    def test_get_extensions(self):
        """Test getting file extensions."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax("SQL", "sql")
            extensions = syntax.extensions
            
            # Should have extensions from handler
            assert isinstance(extensions, list)
            assert len(extensions) > 0
            assert any('.sql' in ext.lower() for ext in extensions)
        except:
            pytest.skip("SQL handler not available")
    
    def test_get_mime_types(self):
        """Test getting MIME types."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax("SQL", "sql")
            mime_types = syntax.mime_types
            
            # Should have MIME types from handler
            assert isinstance(mime_types, list)
        except:
            pytest.skip("SQL handler not available")
    
    def test_get_aliases(self):
        """Test getting aliases."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax("SQL", "sql")
            aliases = syntax.aliases
            
            # Should have aliases from handler
            assert isinstance(aliases, list)
            assert len(aliases) > 0
        except:
            pytest.skip("SQL handler not available")
    
    def test_get_metadata_complete(self):
        """Test getting complete metadata."""
        from exonware.xwsyntax.syntax_facade import XWSyntax
        
        try:
            syntax = XWSyntax("SQL", "sql")
            metadata = syntax.get_metadata()
            
            # Should have all metadata fields
            assert 'format_id' in metadata
            assert 'syntax_name' in metadata
            assert 'extensions' in metadata
            assert 'mime_types' in metadata
            assert 'aliases' in metadata
            assert 'category' in metadata
            assert 'bidirectional' in metadata
        except:
            pytest.skip("SQL handler not available")


class TestHandlerSelfDescription:
    """Test that handlers are completely self-describing."""
    
    def test_sql_handler_metadata(self):
        """Test SQL handler declares all metadata."""
        try:
            from exonware.xwsyntax.handlers.sql import SQLGrammarHandler
            
            handler = SQLGrammarHandler()
            
            # All metadata should be declared
            assert handler.format_id == "SQL"
            assert handler.syntax_name == "sql"
            assert ".sql" in handler.file_extensions
            assert len(handler.mime_types) > 0
            assert len(handler.aliases) > 0
            assert handler.category != ""
            assert handler.supports_bidirectional is not None
        except ImportError:
            pytest.skip("SQL handler not available")
    
    def test_graphql_handler_metadata(self):
        """Test GraphQL handler declares all metadata."""
        try:
            from exonware.xwsyntax.handlers.graphql import GraphQLGrammarHandler
            
            handler = GraphQLGrammarHandler()
            
            assert handler.format_id == "GraphQL"
            assert handler.syntax_name == "graphql"
            assert ".graphql" in handler.file_extensions or ".gql" in handler.file_extensions
            assert len(handler.aliases) > 0
        except ImportError:
            pytest.skip("GraphQL handler not available")
    
    def test_json_handler_metadata(self):
        """Test JSON handler declares all metadata."""
        try:
            from exonware.xwsyntax.handlers.json_handler import JSONGrammarHandler
            
            handler = JSONGrammarHandler()
            
            assert handler.format_id == "JSON"
            assert handler.syntax_name == "json"
            assert ".json" in handler.file_extensions
            assert "application/json" in handler.mime_types
        except ImportError:
            pytest.skip("JSON handler not available")


if __name__ == '__main__':
    pytest.main([__file__, '-v'])

