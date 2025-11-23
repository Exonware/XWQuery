"""
Unit Tests: Package Policy Strategies

Tests all package policy strategy implementations in detail.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.package.strategies import (
    PermissivePolicy,
    AllowListPolicy,
    DenyListPolicy,
)

@pytest.mark.xwlazy_unit
class TestPermissivePolicy:
    """Test PermissivePolicy strategy."""
    
    def test_permissive_policy_initialization(self):
        """Test PermissivePolicy can be instantiated."""
        strategy = PermissivePolicy()
        assert strategy is not None
    
    def test_permissive_policy_allows_all_packages(self):
        """Test PermissivePolicy allows all packages."""
        strategy = PermissivePolicy()
        allowed, reason = strategy.is_allowed("any_package")
        assert allowed == True
        assert "allows" in reason.lower() or "allowed" in reason.lower()
    
    def test_permissive_policy_get_pip_args(self):
        """Test PermissivePolicy.get_pip_args returns empty list."""
        strategy = PermissivePolicy()
        args = strategy.get_pip_args("any_package")
        assert args == []

@pytest.mark.xwlazy_unit
class TestAllowListPolicy:
    """Test AllowListPolicy strategy."""
    
    def test_allow_list_policy_initialization(self):
        """Test AllowListPolicy can be instantiated."""
        strategy = AllowListPolicy(allowed_packages={"pkg1", "pkg2"})
        assert strategy is not None
    
    def test_allow_list_policy_allows_listed_packages(self):
        """Test AllowListPolicy allows listed packages."""
        strategy = AllowListPolicy(allowed_packages={"pkg1", "pkg2", "pkg3"})
        allowed, reason = strategy.is_allowed("pkg1")
        assert allowed == True
        assert "allow list" in reason.lower()
    
    def test_allow_list_policy_blocks_unlisted_packages(self):
        """Test AllowListPolicy blocks unlisted packages."""
        strategy = AllowListPolicy(allowed_packages={"pkg1", "pkg2"})
        allowed, reason = strategy.is_allowed("pkg3")
        assert allowed == False
        assert "not in allow list" in reason.lower()
    
    def test_allow_list_policy_case_insensitive(self):
        """Test AllowListPolicy is case insensitive."""
        strategy = AllowListPolicy(allowed_packages={"PKG1", "pkg2"})
        allowed, _ = strategy.is_allowed("pkg1")
        assert allowed == True
        allowed, _ = strategy.is_allowed("PKG2")
        assert allowed == True
    
    def test_allow_list_policy_get_pip_args(self):
        """Test AllowListPolicy.get_pip_args returns empty list."""
        strategy = AllowListPolicy(allowed_packages={"pkg1"})
        args = strategy.get_pip_args("pkg1")
        assert args == []

@pytest.mark.xwlazy_unit
class TestDenyListPolicy:
    """Test DenyListPolicy strategy."""
    
    def test_deny_list_policy_initialization(self):
        """Test DenyListPolicy can be instantiated."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg"})
        assert strategy is not None
    
    def test_deny_list_policy_blocks_listed_packages(self):
        """Test DenyListPolicy blocks listed packages."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg", "malware"})
        allowed, reason = strategy.is_allowed("bad_pkg")
        assert allowed == False
        assert "deny list" in reason.lower()
    
    def test_deny_list_policy_allows_unlisted_packages(self):
        """Test DenyListPolicy allows unlisted packages."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg"})
        allowed, reason = strategy.is_allowed("good_pkg")
        assert allowed == True
        assert "not in deny list" in reason.lower()
    
    def test_deny_list_policy_case_insensitive(self):
        """Test DenyListPolicy is case insensitive."""
        strategy = DenyListPolicy(denied_packages={"BAD_PKG"})
        allowed, _ = strategy.is_allowed("bad_pkg")
        assert allowed == False
    
    def test_deny_list_policy_get_pip_args(self):
        """Test DenyListPolicy.get_pip_args returns empty list."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg"})
        args = strategy.get_pip_args("good_pkg")
        assert args == []

