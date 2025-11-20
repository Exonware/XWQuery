"""
Comprehensive tests for all lazy loading modes.

Tests cover:
- LazyLoadMode: NONE, AUTO, PRELOAD, BACKGROUND, CACHED
- LazyInstallMode: NONE, SMART, FULL, CLEAN, TEMPORARY, SIZE_AWARE
- Mode combinations and presets
"""

from __future__ import annotations

import pytest

# Mark all tests in this file as unit tests
pytestmark = pytest.mark.xwlazy_unit

import sys
import time
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock, AsyncMock
import pytest

PROJECT_ROOT = Path(__file__).resolve().parents[4]
SRC_ROOT = PROJECT_ROOT / "src"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

from exonware.xwlazy import (
    config_package_lazy_install_enabled,
    LazyLoadMode,
    LazyInstallMode,
    LazyModeConfig,
    get_preset_mode,
    enable_lazy_imports,
    disable_lazy_imports,
    LazyInstallerRegistry,
    LazyInstallConfig,
    _lazy_importer,
)


class TestLazyLoadModes:
    """Test suite for LazyLoadMode enum and functionality."""

    def test_load_mode_none(self):
        """Test NONE load mode (standard imports)."""
        disable_lazy_imports()
        config_package_lazy_install_enabled(
            "test_pkg_none",
            enabled=True,
            load_mode=LazyLoadMode.NONE,
            install_mode=LazyInstallMode.NONE,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_none")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_none")
        assert load_mode == LazyLoadMode.NONE
        assert install_mode == LazyInstallMode.NONE
        assert not _lazy_importer.is_enabled()

    def test_load_mode_auto(self):
        """Test AUTO load mode (lazy loading enabled)."""
        config_package_lazy_install_enabled(
            "test_pkg_auto",
            enabled=True,
            load_mode=LazyLoadMode.AUTO,
            install_mode=LazyInstallMode.NONE,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_auto")
        assert load_mode == LazyLoadMode.AUTO
        assert _lazy_importer.is_enabled()

    def test_load_mode_preload(self):
        """Test PRELOAD mode (preload all modules on start)."""
        config_package_lazy_install_enabled(
            "test_pkg_preload",
            enabled=True,
            load_mode=LazyLoadMode.PRELOAD,
            install_mode=LazyInstallMode.NONE,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preload")
        assert load_mode == LazyLoadMode.PRELOAD
        assert _lazy_importer.is_enabled()

    def test_load_mode_background(self):
        """Test BACKGROUND mode (load modules in background)."""
        config_package_lazy_install_enabled(
            "test_pkg_background",
            enabled=True,
            load_mode=LazyLoadMode.BACKGROUND,
            install_mode=LazyInstallMode.NONE,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_background")
        assert load_mode == LazyLoadMode.BACKGROUND
        assert _lazy_importer.is_enabled()

    def test_load_mode_cached(self):
        """Test CACHED mode (cache loaded modules)."""
        config_package_lazy_install_enabled(
            "test_pkg_cached",
            enabled=True,
            load_mode=LazyLoadMode.CACHED,
            install_mode=LazyInstallMode.NONE,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_cached")
        assert load_mode == LazyLoadMode.CACHED
        assert _lazy_importer.is_enabled()


class TestLazyInstallModes:
    """Test suite for LazyInstallMode enum and functionality."""

    def test_install_mode_none(self):
        """Test NONE install mode (no auto-installation)."""
        config_package_lazy_install_enabled(
            "test_pkg_install_none",
            enabled=True,
            install_mode=LazyInstallMode.NONE,
        )
        
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_install_none")
        assert install_mode == LazyInstallMode.NONE

    def test_install_mode_smart(self):
        """Test SMART install mode (install on first usage)."""
        config_package_lazy_install_enabled(
            "test_pkg_install_smart",
            enabled=True,
            install_mode=LazyInstallMode.SMART,
        )
        
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_install_smart")
        assert install_mode == LazyInstallMode.SMART
        
        installer = LazyInstallerRegistry.get_instance("test_pkg_install_smart")
        assert installer._async_enabled is True

    def test_install_mode_full(self):
        """Test FULL install mode (install all dependencies on start)."""
        config_package_lazy_install_enabled(
            "test_pkg_install_full",
            enabled=True,
            install_mode=LazyInstallMode.FULL,
        )
        
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_install_full")
        assert install_mode == LazyInstallMode.FULL
        
        installer = LazyInstallerRegistry.get_instance("test_pkg_install_full")
        assert installer._async_enabled is True

    def test_install_mode_clean(self):
        """Test CLEAN install mode (install on usage + uninstall after)."""
        config_package_lazy_install_enabled(
            "test_pkg_install_clean",
            enabled=True,
            install_mode=LazyInstallMode.CLEAN,
        )
        
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_install_clean")
        assert install_mode == LazyInstallMode.CLEAN
        
        installer = LazyInstallerRegistry.get_instance("test_pkg_install_clean")
        assert installer._async_enabled is True

    def test_install_mode_temporary(self):
        """Test TEMPORARY install mode (always uninstall after use)."""
        config_package_lazy_install_enabled(
            "test_pkg_install_temporary",
            enabled=True,
            install_mode=LazyInstallMode.TEMPORARY,
        )
        
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_install_temporary")
        assert install_mode == LazyInstallMode.TEMPORARY
        
        installer = LazyInstallerRegistry.get_instance("test_pkg_install_temporary")
        assert installer._async_enabled is True

    def test_install_mode_size_aware(self):
        """Test SIZE_AWARE install mode (install small packages, skip large ones)."""
        config_package_lazy_install_enabled(
            "test_pkg_install_size_aware",
            enabled=True,
            install_mode=LazyInstallMode.SIZE_AWARE,
        )
        
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_install_size_aware")
        assert install_mode == LazyInstallMode.SIZE_AWARE


class TestPresetModes:
    """Test suite for preset mode combinations."""

    def test_preset_none(self):
        """Test 'none' preset mode."""
        config_package_lazy_install_enabled(
            "test_pkg_preset_none",
            enabled=True,
            mode="none",
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preset_none")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preset_none")
        assert load_mode == LazyLoadMode.NONE
        assert install_mode == LazyInstallMode.NONE

    def test_preset_lite(self):
        """Test 'lite' preset mode."""
        config_package_lazy_install_enabled(
            "test_pkg_preset_lite",
            enabled=True,
            mode="lite",
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preset_lite")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preset_lite")
        assert load_mode == LazyLoadMode.AUTO
        assert install_mode == LazyInstallMode.NONE

    def test_preset_smart(self):
        """Test 'smart' preset mode."""
        config_package_lazy_install_enabled(
            "test_pkg_preset_smart",
            enabled=True,
            mode="smart",
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preset_smart")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preset_smart")
        assert load_mode == LazyLoadMode.AUTO
        assert install_mode == LazyInstallMode.SMART

    def test_preset_full(self):
        """Test 'full' preset mode."""
        config_package_lazy_install_enabled(
            "test_pkg_preset_full",
            enabled=True,
            mode="full",
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preset_full")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preset_full")
        assert load_mode == LazyLoadMode.AUTO
        assert install_mode == LazyInstallMode.FULL

    def test_preset_clean(self):
        """Test 'clean' preset mode."""
        config_package_lazy_install_enabled(
            "test_pkg_preset_clean",
            enabled=True,
            mode="clean",
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preset_clean")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preset_clean")
        assert load_mode == LazyLoadMode.AUTO
        assert install_mode == LazyInstallMode.CLEAN

    def test_preset_auto(self):
        """Test 'auto' preset mode."""
        config_package_lazy_install_enabled(
            "test_pkg_preset_auto",
            enabled=True,
            mode="auto",
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preset_auto")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preset_auto")
        mode_config = LazyInstallConfig.get_mode_config("test_pkg_preset_auto")
        assert load_mode == LazyLoadMode.AUTO
        assert install_mode == LazyInstallMode.SMART
        assert mode_config is not None
        assert mode_config.auto_uninstall_large is True


class TestLazyModeConfig:
    """Test suite for LazyModeConfig dataclass."""

    def test_mode_config_creation(self):
        """Test creating LazyModeConfig with explicit modes."""
        config = LazyModeConfig(
            load_mode=LazyLoadMode.PRELOAD,
            install_mode=LazyInstallMode.SMART,
            large_package_threshold_mb=100.0,
            background_workers=4,
        )
        
        assert config.load_mode == LazyLoadMode.PRELOAD
        assert config.install_mode == LazyInstallMode.SMART
        assert config.large_package_threshold_mb == 100.0
        assert config.background_workers == 4

    def test_mode_config_string_conversion(self):
        """Test LazyModeConfig with string enum values."""
        config = LazyModeConfig(
            load_mode="preload",
            install_mode="smart",
        )
        
        assert config.load_mode == LazyLoadMode.PRELOAD
        assert config.install_mode == LazyInstallMode.SMART

    def test_mode_config_with_mode_config_param(self):
        """Test using mode_config parameter in config_package_lazy_install_enabled."""
        mode_config = LazyModeConfig(
            load_mode=LazyLoadMode.BACKGROUND,
            install_mode=LazyInstallMode.SIZE_AWARE,
            large_package_threshold_mb=75.0,
        )
        
        config_package_lazy_install_enabled(
            "test_pkg_mode_config",
            enabled=True,
            mode_config=mode_config,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_mode_config")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_mode_config")
        assert load_mode == LazyLoadMode.BACKGROUND
        assert install_mode == LazyInstallMode.SIZE_AWARE


class TestModeCombinations:
    """Test suite for various mode combinations."""

    def test_auto_smart_combination(self):
        """Test AUTO load + SMART install combination."""
        config_package_lazy_install_enabled(
            "test_pkg_auto_smart",
            enabled=True,
            load_mode=LazyLoadMode.AUTO,
            install_mode=LazyInstallMode.SMART,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_auto_smart")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_auto_smart")
        assert load_mode == LazyLoadMode.AUTO
        assert install_mode == LazyInstallMode.SMART

    def test_preload_full_combination(self):
        """Test PRELOAD load + FULL install combination."""
        config_package_lazy_install_enabled(
            "test_pkg_preload_full",
            enabled=True,
            load_mode=LazyLoadMode.PRELOAD,
            install_mode=LazyInstallMode.FULL,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_preload_full")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_preload_full")
        assert load_mode == LazyLoadMode.PRELOAD
        assert install_mode == LazyInstallMode.FULL

    def test_background_clean_combination(self):
        """Test BACKGROUND load + CLEAN install combination."""
        config_package_lazy_install_enabled(
            "test_pkg_background_clean",
            enabled=True,
            load_mode=LazyLoadMode.BACKGROUND,
            install_mode=LazyInstallMode.CLEAN,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_background_clean")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_background_clean")
        assert load_mode == LazyLoadMode.BACKGROUND
        assert install_mode == LazyInstallMode.CLEAN

    def test_cached_size_aware_combination(self):
        """Test CACHED load + SIZE_AWARE install combination."""
        config_package_lazy_install_enabled(
            "test_pkg_cached_size_aware",
            enabled=True,
            load_mode=LazyLoadMode.CACHED,
            install_mode=LazyInstallMode.SIZE_AWARE,
        )
        
        load_mode = LazyInstallConfig.get_load_mode("test_pkg_cached_size_aware")
        install_mode = LazyInstallConfig.get_install_mode("test_pkg_cached_size_aware")
        assert load_mode == LazyLoadMode.CACHED
        assert install_mode == LazyInstallMode.SIZE_AWARE


class TestGetPresetMode:
    """Test suite for get_preset_mode function."""

    def test_get_preset_mode_lite(self):
        """Test getting 'lite' preset mode."""
        preset = get_preset_mode("lite")
        assert preset.load_mode == LazyLoadMode.AUTO
        assert preset.install_mode == LazyInstallMode.NONE

    def test_get_preset_mode_smart(self):
        """Test getting 'smart' preset mode."""
        preset = get_preset_mode("smart")
        assert preset.load_mode == LazyLoadMode.AUTO
        assert preset.install_mode == LazyInstallMode.SMART

    def test_get_preset_mode_full(self):
        """Test getting 'full' preset mode."""
        preset = get_preset_mode("full")
        assert preset.load_mode == LazyLoadMode.AUTO
        assert preset.install_mode == LazyInstallMode.FULL

    def test_get_preset_mode_clean(self):
        """Test getting 'clean' preset mode."""
        preset = get_preset_mode("clean")
        assert preset.load_mode == LazyLoadMode.AUTO
        assert preset.install_mode == LazyInstallMode.CLEAN

    def test_get_preset_mode_auto(self):
        """Test getting 'auto' preset mode."""
        preset = get_preset_mode("auto")
        assert preset.load_mode == LazyLoadMode.AUTO
        assert preset.install_mode == LazyInstallMode.SMART
        assert preset.auto_uninstall_large is True

    def test_get_preset_mode_invalid(self):
        """Test getting invalid preset mode returns None."""
        preset = get_preset_mode("invalid_mode")
        assert preset is None


class TestEnableLazyImports:
    """Test suite for enable_lazy_imports function."""

    def test_enable_lazy_imports_default(self):
        """Test enable_lazy_imports with default mode."""
        disable_lazy_imports()
        enable_lazy_imports()
        assert _lazy_importer.is_enabled()
        assert _lazy_importer._load_mode == LazyLoadMode.AUTO

    def test_enable_lazy_imports_with_mode(self):
        """Test enable_lazy_imports with explicit mode."""
        disable_lazy_imports()
        enable_lazy_imports(LazyLoadMode.PRELOAD)
        assert _lazy_importer.is_enabled()
        assert _lazy_importer._load_mode == LazyLoadMode.PRELOAD

    def test_enable_lazy_imports_background(self):
        """Test enable_lazy_imports with BACKGROUND mode."""
        disable_lazy_imports()
        enable_lazy_imports(LazyLoadMode.BACKGROUND)
        assert _lazy_importer.is_enabled()
        assert _lazy_importer._load_mode == LazyLoadMode.BACKGROUND


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

