"""
Tests for keyword-based auto-detection of lazy loading.

This feature allows packages to opt-in to lazy loading by adding
a keyword to their pyproject.toml metadata.
"""

from __future__ import annotations

import pytest

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.xwlazy_unit

import sys
from unittest.mock import MagicMock, patch

import pytest

# Add src to path for imports
if str(__file__).endswith("test_keyword_detection.py"):
    import os
    from pathlib import Path
    
    project_root = Path(__file__).resolve().parents[3]
    src_root = project_root / "src"
    if str(src_root) not in sys.path:
        sys.path.insert(0, str(src_root))

from exonware.xwlazy import (
    _check_package_keywords,
    check_package_keywords,
    enable_keyword_detection,
    get_keyword_detection_keyword,
    is_keyword_detection_enabled,
)


class TestKeywordDetection:
    """Test keyword-based detection functionality."""
    
    def test_keyword_detection_disabled(self):
        """Test that detection returns False when disabled."""
        enable_keyword_detection(enabled=False)
        assert not is_keyword_detection_enabled()
        
        # Should return False even if keyword exists (no need to mock, disabled check happens first)
        result = _check_package_keywords()
        assert result is False
    
    def test_keyword_detection_enabled(self):
        """Test that detection can be enabled."""
        enable_keyword_detection(enabled=True)
        assert is_keyword_detection_enabled()
    
    def test_default_keyword(self):
        """Test that default keyword is 'xwlazy-enabled'."""
        enable_keyword_detection(enabled=True)
        assert get_keyword_detection_keyword() == "xwlazy-enabled"
    
    def test_custom_keyword(self):
        """Test that custom keyword can be set."""
        enable_keyword_detection(enabled=True, keyword="custom-keyword")
        assert get_keyword_detection_keyword() == "custom-keyword"
        
        # Reset to default
        enable_keyword_detection(enabled=True, keyword="xwlazy-enabled")
    
    @pytest.mark.skipif(sys.version_info < (3, 8), reason="importlib.metadata requires Python 3.8+")
    def test_check_package_keywords_with_mock(self):
        """Test keyword checking with mocked metadata."""
        enable_keyword_detection(enabled=True, keyword="test-keyword")
        
        # Mock distribution with keyword
        mock_metadata = MagicMock()
        mock_metadata.get = lambda key, default=None: {
            'Name': 'test-package'
        }.get(key, default)
        mock_metadata.get_all = lambda key, default=[]: {
            'Keywords': ['test-keyword', 'other-keyword']
        }.get(key, default)
        
        mock_dist = MagicMock()
        mock_dist.metadata = mock_metadata
        
        with patch('importlib.metadata.distributions', return_value=[mock_dist]):
            with patch('importlib.metadata.distribution', return_value=mock_dist):
                # Check all packages
                result = _check_package_keywords(keyword="test-keyword")
                assert result is True
                
                # Check specific package
                result = _check_package_keywords(package_name="test-package", keyword="test-keyword")
                assert result is True
    
    @pytest.mark.skipif(sys.version_info < (3, 8), reason="importlib.metadata requires Python 3.8+")
    def test_check_package_keywords_not_found(self):
        """Test keyword checking when keyword is not found."""
        enable_keyword_detection(enabled=True, keyword="nonexistent-keyword")
        
        # Mock distribution without the keyword
        mock_metadata = MagicMock()
        mock_metadata.get = lambda key, default=None: {
            'Name': 'test-package'
        }.get(key, default)
        mock_metadata.get_all = lambda key, default=[]: {
            'Keywords': ['other-keyword']
        }.get(key, default)
        
        mock_dist = MagicMock()
        mock_dist.metadata = mock_metadata
        
        with patch('importlib.metadata.distributions', return_value=[mock_dist]):
            result = _check_package_keywords(keyword="nonexistent-keyword")
            assert result is False
    
    @pytest.mark.skipif(sys.version_info < (3, 8), reason="importlib.metadata requires Python 3.8+")
    def test_check_package_keywords_comma_separated(self):
        """Test keyword checking with comma-separated keywords."""
        enable_keyword_detection(enabled=True, keyword="test-keyword")
        
        # Mock distribution with comma-separated keywords
        mock_metadata = MagicMock()
        mock_metadata.get = lambda key, default=None: {
            'Name': 'test-package'
        }.get(key, default)
        mock_metadata.get_all = lambda key, default=[]: {
            'Keywords': ['test-keyword, other-keyword, third-keyword']
        }.get(key, default)
        
        mock_dist = MagicMock()
        mock_dist.metadata = mock_metadata
        
        with patch('importlib.metadata.distributions', return_value=[mock_dist]):
            result = _check_package_keywords(keyword="test-keyword")
            assert result is True
            
            result = _check_package_keywords(keyword="other-keyword")
            assert result is True
    
    @pytest.mark.skipif(sys.version_info < (3, 8), reason="importlib.metadata requires Python 3.8+")
    def test_check_package_keywords_case_insensitive(self):
        """Test that keyword checking is case-insensitive."""
        enable_keyword_detection(enabled=True, keyword="TEST-KEYWORD")
        
        # Mock distribution with lowercase keyword
        mock_metadata = MagicMock()
        mock_metadata.get = lambda key, default=None: {
            'Name': 'test-package'
        }.get(key, default)
        mock_metadata.get_all = lambda key, default=[]: {
            'Keywords': ['test-keyword']
        }.get(key, default)
        
        mock_dist = MagicMock()
        mock_dist.metadata = mock_metadata
        
        with patch('importlib.metadata.distributions', return_value=[mock_dist]):
            result = _check_package_keywords(keyword="TEST-KEYWORD")
            assert result is True
    
    def test_public_api_check_package_keywords(self):
        """Test the public API function."""
        enable_keyword_detection(enabled=True)
        
        # Should work the same as private function
        with patch('exonware.xwlazy.facade._check_package_keywords', return_value=True) as mock_check:
            result = check_package_keywords()
            assert result is True
            mock_check.assert_called_once_with(None, None)
    
    @pytest.mark.skipif(sys.version_info < (3, 8), reason="importlib.metadata requires Python 3.8+")
    def test_package_not_found(self):
        """Test behavior when package is not found."""
        enable_keyword_detection(enabled=True)
        
        from importlib import metadata
        
        with patch('importlib.metadata.distribution', side_effect=metadata.PackageNotFoundError("test")):
            result = _check_package_keywords(package_name="nonexistent-package")
            assert result is False
    
    def test_python_version_check(self):
        """Test that detection returns False on Python < 3.8."""
        enable_keyword_detection(enabled=True)
        
        with patch('sys.version_info', (3, 7, 0)):
            result = _check_package_keywords()
            assert result is False
    
    def test_exception_handling(self):
        """Test that exceptions are handled gracefully."""
        enable_keyword_detection(enabled=True)
        
        # Mock importlib.metadata to raise exception when importing
        with patch('importlib.metadata', side_effect=Exception("Test error")):
            # The function should catch the exception and return False
            result = _check_package_keywords()
            assert result is False

