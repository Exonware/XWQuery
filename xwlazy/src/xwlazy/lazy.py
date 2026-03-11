"""
xwlazy.lazy - public API for package-level lazy install configuration.
Used by xwnode, xwsystem, etc. for: from xwlazy.lazy import config_package_lazy_install_enabled.
Company: eXonware.com
"""
from exonware.xwlazy import auto_enable_lazy, lazy_import

# Alias used by xwnode and others
xwimport = lazy_import

__all__ = ["config_package_lazy_install_enabled", "xwimport"]


def config_package_lazy_install_enabled(
    package_name: str,
    enabled: bool = True,
    mode: str = "smart",
    install_hook: bool = True,
    **kwargs,
) -> None:
    """Configure a package for lazy installation. Wrapper over auto_enable_lazy."""
    if enabled:
        auto_enable_lazy(package_name, mode=mode, **kwargs)
