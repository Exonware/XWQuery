"""
Unit Tests: Package Mapping Strategies

Tests all package mapping strategy implementations in detail.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, patch

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.package.strategies import (
    ManifestFirstMapping,
    DiscoveryFirstMapping,
    HybridMapping,
)

@pytest.mark.xwlazy_unit
class TestManifestFirstMapping:
    """Test ManifestFirstMapping strategy."""
    
    def test_manifest_first_mapping_initialization(self):
        """Test ManifestFirstMapping can be instantiated."""
        strategy = ManifestFirstMapping("test_pkg")
        assert strategy is not None
    
    @patch('exonware.xwlazy.package.services.discovery.LazyDiscovery')
    def test_manifest_first_mapping_map_import_to_package(self, mock_discovery_class):
        """Test ManifestFirstMapping.map_import_to_package."""
        # Mock discovery to avoid abstract class instantiation
        mock_discovery = Mock()
        mock_discovery.get_import_package_mapping.return_value = {}
        mock_discovery.COMMON_MAPPINGS = {}
        mock_discovery_class.return_value = mock_discovery
        
        strategy = ManifestFirstMapping("test_pkg")
        # Method should exist and return a value (may be None if not found)
        result = strategy.map_import_to_package("test_import")
        # Result can be None or a string
        assert result is None or isinstance(result, str)
    
    @patch('exonware.xwlazy.package.services.discovery.LazyDiscovery')
    def test_manifest_first_mapping_map_package_to_imports(self, mock_discovery_class):
        """Test ManifestFirstMapping.map_package_to_imports."""
        # Mock discovery to avoid abstract class instantiation
        mock_discovery = Mock()
        mock_discovery.get_package_import_mapping.return_value = {}
        mock_discovery_class.return_value = mock_discovery
        
        strategy = ManifestFirstMapping("test_pkg")
        result = strategy.map_package_to_imports("test_package")
        # Should return a list (may be empty if no manifest)
        assert isinstance(result, list)

@pytest.mark.xwlazy_unit
class TestDiscoveryFirstMapping:
    """Test DiscoveryFirstMapping strategy."""
    
    def test_discovery_first_mapping_initialization(self):
        """Test DiscoveryFirstMapping can be instantiated."""
        strategy = DiscoveryFirstMapping("test_pkg")
        assert strategy is not None
    
    @patch('exonware.xwlazy.package.services.discovery.LazyDiscovery')
    def test_discovery_first_mapping_map_import_to_package(self, mock_discovery_class):
        """Test DiscoveryFirstMapping.map_import_to_package."""
        # Mock discovery to avoid abstract class instantiation
        mock_discovery = Mock()
        mock_discovery.get_import_package_mapping.return_value = {}
        mock_discovery.COMMON_MAPPINGS = {}
        mock_discovery_class.return_value = mock_discovery
        
        strategy = DiscoveryFirstMapping("test_pkg")
        result = strategy.map_import_to_package("test_import")
        # May return None if not found
        assert result is None or isinstance(result, str)
    
    @patch('exonware.xwlazy.package.services.discovery.LazyDiscovery')
    def test_discovery_first_mapping_map_package_to_imports(self, mock_discovery_class):
        """Test DiscoveryFirstMapping.map_package_to_imports."""
        # Mock discovery to avoid abstract class instantiation
        mock_discovery = Mock()
        mock_discovery.get_package_import_mapping.return_value = {}
        mock_discovery_class.return_value = mock_discovery
        
        strategy = DiscoveryFirstMapping("test_pkg")
        result = strategy.map_package_to_imports("test_package")
        assert isinstance(result, list)

@pytest.mark.xwlazy_unit
class TestHybridMapping:
    """Test HybridMapping strategy."""
    
    def test_hybrid_mapping_initialization(self):
        """Test HybridMapping can be instantiated."""
        strategy = HybridMapping("test_pkg")
        assert strategy is not None
    
    @patch('exonware.xwlazy.package.services.discovery.LazyDiscovery')
    def test_hybrid_mapping_map_import_to_package(self, mock_discovery_class):
        """Test HybridMapping.map_import_to_package."""
        # Mock discovery to avoid abstract class instantiation
        mock_discovery = Mock()
        mock_discovery.get_import_package_mapping.return_value = {}
        mock_discovery.COMMON_MAPPINGS = {}
        mock_discovery_class.return_value = mock_discovery
        
        strategy = HybridMapping("test_pkg")
        result = strategy.map_import_to_package("test_import")
        # May return None if not found
        assert result is None or isinstance(result, str)
    
    @patch('exonware.xwlazy.package.services.discovery.LazyDiscovery')
    def test_hybrid_mapping_map_package_to_imports(self, mock_discovery_class):
        """Test HybridMapping.map_package_to_imports."""
        # Mock discovery to avoid abstract class instantiation
        mock_discovery = Mock()
        mock_discovery.get_package_import_mapping.return_value = {}
        mock_discovery_class.return_value = mock_discovery
        
        strategy = HybridMapping("test_pkg")
        result = strategy.map_package_to_imports("test_package")
        assert isinstance(result, list)
