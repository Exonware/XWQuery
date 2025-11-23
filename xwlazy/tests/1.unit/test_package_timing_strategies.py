"""
Unit Tests: Package Timing Strategies

Tests all package timing strategy implementations in detail.

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
    SmartTiming,
    FullTiming,
    CleanTiming,
    TemporaryTiming,
)

@pytest.mark.xwlazy_unit
class TestSmartTiming:
    """Test SmartTiming strategy."""
    
    def test_smart_timing_initialization(self):
        """Test SmartTiming can be instantiated."""
        strategy = SmartTiming()
        assert strategy is not None
    
    def test_smart_timing_should_install_now_with_context(self):
        """Test SmartTiming.should_install_now with context."""
        strategy = SmartTiming()
        # Smart mode: install when context indicates need
        # Check actual implementation behavior
        result1 = strategy.should_install_now("test_pkg", {"need": True})
        result2 = strategy.should_install_now("test_pkg", {"need": False})
        result3 = strategy.should_install_now("test_pkg", None)
        # Results should be boolean
        assert isinstance(result1, bool)
        assert isinstance(result2, bool)
        assert isinstance(result3, bool)
    
    def test_smart_timing_should_uninstall_after(self):
        """Test SmartTiming.should_uninstall_after."""
        strategy = SmartTiming()
        # Smart mode: keep installed
        assert strategy.should_uninstall_after("test_pkg", None) == False
    
    def test_smart_timing_get_install_priority(self):
        """Test SmartTiming.get_install_priority."""
        strategy = SmartTiming()
        packages = ["pkg3", "pkg1", "pkg2"]
        priority = strategy.get_install_priority(packages)
        # Should return packages in some order
        assert len(priority) == len(packages)
        assert set(priority) == set(packages)

@pytest.mark.xwlazy_unit
class TestFullTiming:
    """Test FullTiming strategy."""
    
    def test_full_timing_initialization(self):
        """Test FullTiming can be instantiated."""
        strategy = FullTiming()
        assert strategy is not None
    
    def test_full_timing_should_install_now(self):
        """Test FullTiming.should_install_now always returns True."""
        strategy = FullTiming()
        assert strategy.should_install_now("test_pkg", None) == True
        assert strategy.should_install_now("test_pkg", {}) == True
    
    def test_full_timing_should_uninstall_after(self):
        """Test FullTiming.should_uninstall_after."""
        strategy = FullTiming()
        # Full mode: keep installed
        assert strategy.should_uninstall_after("test_pkg", None) == False

@pytest.mark.xwlazy_unit
class TestCleanTiming:
    """Test CleanTiming strategy."""
    
    def test_clean_timing_initialization(self):
        """Test CleanTiming can be instantiated."""
        strategy = CleanTiming()
        assert strategy is not None
    
    def test_clean_timing_should_install_now(self):
        """Test CleanTiming.should_install_now."""
        strategy = CleanTiming()
        # Clean mode: install on demand
        assert strategy.should_install_now("test_pkg", {"need": True}) == True
    
    def test_clean_timing_should_uninstall_after(self):
        """Test CleanTiming.should_uninstall_after."""
        strategy = CleanTiming()
        # Clean mode: uninstall after use
        assert strategy.should_uninstall_after("test_pkg", None) == True

@pytest.mark.xwlazy_unit
class TestTemporaryTiming:
    """Test TemporaryTiming strategy."""
    
    def test_temporary_timing_initialization(self):
        """Test TemporaryTiming can be instantiated."""
        strategy = TemporaryTiming()
        assert strategy is not None
    
    def test_temporary_timing_should_install_now(self):
        """Test TemporaryTiming.should_install_now."""
        strategy = TemporaryTiming()
        # Temporary mode: install when needed
        assert strategy.should_install_now("test_pkg", {"need": True}) == True
    
    def test_temporary_timing_should_uninstall_after(self):
        """Test TemporaryTiming.should_uninstall_after always returns True."""
        strategy = TemporaryTiming()
        # Temporary mode: always uninstall after
        assert strategy.should_uninstall_after("test_pkg", None) == True
        assert strategy.should_uninstall_after("test_pkg", {}) == True

