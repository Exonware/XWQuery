#exonware/xwlazy/src/exonware/xwlazy/lazy/bootstrap.py
"""
Early bootstrap utilities for lazily installing import hooks.
"""

from __future__ import annotations

import atexit
import logging
import os
import sys
from typing import Optional


def _env_enabled(env_value: Optional[str]) -> Optional[bool]:
    if not env_value:
        return None
    normalized = env_value.strip().lower()
    if normalized in ('true', '1', 'yes', 'on'):
        return True
    if normalized in ('false', '0', 'no', 'off'):
        return False
    return None


def bootstrap_lazy_mode(package_name: str) -> None:
    """
    Detect whether lazy mode should be enabled for ``package_name`` and bootstrap hooks.
    """
    package_name = package_name.lower()
    env_value = os.environ.get(f"{package_name.upper()}_LAZY_INSTALL")
    env_enabled = _env_enabled(env_value)
    enabled = env_enabled

    if enabled is None:
        try:
            from xwlazy.lazy.lazy_core import _detect_lazy_installation
            enabled = _detect_lazy_installation(package_name)
        except Exception as exc:  # pragma: no cover
            logging.getLogger("xwlazy.lazy.bootstrap").debug(
                "Lazy detection failed: %s", exc, exc_info=True
            )
            enabled = False

    if not enabled:
        return

    try:
        from xwlazy.lazy.lazy_core import config_package_lazy_install_enabled

        config_package_lazy_install_enabled(
            package_name,
            enabled=True,
            install_hook=True,
        )
    except Exception as exc:  # pragma: no cover
        logging.getLogger("xwlazy.lazy.bootstrap").debug(
            "Lazy bootstrap failed for %s: %s", package_name, exc, exc_info=True
        )


def bootstrap_lazy_mode_deferred(package_name: str) -> None:
    """
    Schedule lazy mode bootstrap to run AFTER the calling package finishes importing.
    
    This avoids hook interference with the package's own imports (e.g., requests/certifi in xwsystem).
    Uses a post-import hook to detect when the package module is fully loaded.
    """
    package_name_lower = package_name.lower()
    package_module_name = f"exonware.{package_name_lower}"
    
    # Store original __import__ to restore later
    original_import = __builtins__.__import__ if hasattr(__builtins__, '__import__') else __import__
    
    def _import_hook(name, *args, **kwargs):
        # Call original import first
        result = original_import(name, *args, **kwargs)
        
        # Check if the target package just finished importing
        if name == package_module_name or name.startswith(f"{package_module_name}."):
            # Check if package root is now fully in sys.modules
            if package_module_name in sys.modules:
                # Package is loaded, install hook on next event loop iteration
                import threading
                def _install_hook():
                    # Restore original import
                    if hasattr(__builtins__, '__import__'):
                        __builtins__.__import__ = original_import
                    else:
                        import builtins
                        builtins.__import__ = original_import
                    # Now install the lazy hook
                    bootstrap_lazy_mode(package_name_lower)
                
                # Schedule for immediate execution after current import completes
                threading.Timer(0.0, _install_hook).start()
        
        return result
    
    # Install temporary import hook
    if hasattr(__builtins__, '__import__'):
        __builtins__.__import__ = _import_hook
    else:
        import builtins
        builtins.__import__ = _import_hook

