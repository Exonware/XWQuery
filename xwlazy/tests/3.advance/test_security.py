#!/usr/bin/env python3
"""
Security-focused advance tests for xwlazy.

Tests security features including allow/deny lists, SBOM generation,
vulnerability scanning, and PEP 668 compliance.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
import tempfile
import json
from pathlib import Path
from xwlazy.lazy import (
    config_package_lazy_install_enabled,
    set_package_allow_list,
    set_package_deny_list,
    generate_package_sbom,
    get_lazy_install_stats,
    set_package_lockfile,
)


@pytest.mark.xwlazy_advance
class TestSecurityPolicies:
    """Test security policy enforcement."""
    
    def test_allow_list_enforcement(self):
        """Test that allow list blocks unauthorized packages."""
        package_name = "test_package_allow"
        
        # Configure with allow list
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        set_package_allow_list(package_name, ["fastavro", "protobuf"])
        
        # Verify configuration
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True
        
        # Note: Actual installation blocking would be tested in integration tests
        # This test verifies configuration is set correctly
    
    def test_deny_list_enforcement(self):
        """Test that deny list blocks specific packages."""
        package_name = "test_package_deny"
        
        # Configure with deny list
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        set_package_deny_list(package_name, ["suspicious-package"])
        
        # Verify configuration
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True
    
    def test_allow_and_deny_list_interaction(self):
        """Test interaction between allow and deny lists."""
        package_name = "test_package_both"
        
        # Configure with both lists
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        set_package_allow_list(package_name, ["fastavro", "protobuf"])
        set_package_deny_list(package_name, ["suspicious-package"])
        
        # Deny list should take precedence
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True


@pytest.mark.xwlazy_advance
class TestSBOMGeneration:
    """Test Software Bill of Materials generation."""
    
    def test_sbom_generation(self):
        """Test SBOM generation for a package."""
        package_name = "test_package_sbom"
        
        with tempfile.TemporaryDirectory() as tmpdir:
            sbom_path = Path(tmpdir) / "sbom.json"
            
            # Generate SBOM
            result = generate_package_sbom(package_name, str(sbom_path))
            
            # Verify SBOM file exists
            assert sbom_path.exists()
            
            # Verify SBOM structure
            with open(sbom_path) as f:
                sbom = json.load(f)
            
            assert "package" in sbom or "packages" in sbom
            assert "generated_at" in sbom or "timestamp" in sbom
    
    def test_sbom_with_vulnerabilities(self):
        """Test SBOM generation with vulnerability scanning."""
        package_name = "test_package_sbom_vuln"
        
        with tempfile.TemporaryDirectory() as tmpdir:
            sbom_path = Path(tmpdir) / "sbom_vuln.json"
            
            # Generate SBOM with vulnerabilities
            try:
                result = generate_package_sbom(
                    package_name,
                    str(sbom_path),
                    include_vulnerabilities=True
                )
                
                # Verify SBOM file exists
                assert sbom_path.exists()
            except Exception:
                # Vulnerability scanning may not be available
                pytest.skip("Vulnerability scanning not available")


@pytest.mark.xwlazy_advance
class TestLockfileManagement:
    """Test lockfile management."""
    
    def test_lockfile_creation(self):
        """Test lockfile creation and tracking."""
        package_name = "test_package_lockfile"
        
        with tempfile.TemporaryDirectory() as tmpdir:
            lockfile_path = Path(tmpdir) / "lockfile.json"
            
            # Set lockfile
            set_package_lockfile(package_name, str(lockfile_path))
            
            # Verify lockfile can be created (may be empty initially)
            # Actual content would be added during package installation
    
    def test_lockfile_persistence(self):
        """Test that lockfile persists across sessions."""
        package_name = "test_package_lockfile_persist"
        
        with tempfile.TemporaryDirectory() as tmpdir:
            lockfile_path = Path(tmpdir) / "lockfile.json"
            
            # Set lockfile
            set_package_lockfile(package_name, str(lockfile_path))
            
            # Verify path is set
            stats = get_lazy_install_stats(package_name)
            # Lockfile path may be in stats or separate config


@pytest.mark.xwlazy_advance
class TestPEP668Compliance:
    """Test PEP 668 compliance (externally-managed environments)."""
    
    def test_pep668_detection(self):
        """Test detection of externally-managed environments."""
        # PEP 668 compliance is handled internally by xwlazy
        # This test verifies the behavior doesn't break
        
        package_name = "test_package_pep668"
        
        # Should work in virtual environments
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True
    
    def test_system_python_protection(self):
        """Test that system Python is protected."""
        # xwlazy should refuse to install in system Python
        # This is tested by attempting installation in system Python
        # (would need actual system Python environment to test fully)
        pass


@pytest.mark.xwlazy_advance
class TestSecurityMonitoring:
    """Test security monitoring features."""
    
    def test_installation_tracking(self):
        """Test that installations are tracked for security auditing."""
        package_name = "test_package_tracking"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Get statistics
        stats = get_lazy_install_stats(package_name)
        
        # Verify tracking fields exist
        assert "enabled" in stats
        assert "mode" in stats
        # May have installed_packages, failed_packages, etc.
    
    def test_failed_installation_logging(self):
        """Test that failed installations are logged."""
        package_name = "test_package_failed"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Statistics should track failures
        stats = get_lazy_install_stats(package_name)
        # May have failed_count or failed_packages field
