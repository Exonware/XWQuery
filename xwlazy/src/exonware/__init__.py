"""
exonware.xwlazy - Enterprise Lazy Installation System

Main module for xwlazy auto-installation system.
Supports both import styles:
    import exonware.xwlazy
    import xwlazy (via convenience import)
"""

# Import from xwlazy.py module explicitly using importlib
# This handles the case where both xwlazy.py and xwlazy/ directory exist
import sys
import importlib.util
from pathlib import Path

# Explicitly load xwlazy.py as a module
_xwlazy_file = Path(__file__).parent / "xwlazy.py"
if _xwlazy_file.exists():
    # Load the module explicitly from the .py file
    spec = importlib.util.spec_from_file_location("exonware._xwlazy_module", _xwlazy_file)
    _xwlazy = importlib.util.module_from_spec(spec)
    sys.modules["exonware._xwlazy_module"] = _xwlazy
    spec.loader.exec_module(_xwlazy)
    
    # Import all exports from the module
    hook = _xwlazy.hook
    auto_enable_lazy = _xwlazy.auto_enable_lazy
    attach = _xwlazy.attach
    XWLazy = _xwlazy.XWLazy
    enable_keyword_detection = _xwlazy.enable_keyword_detection
    is_keyword_detection_enabled = _xwlazy.is_keyword_detection_enabled
    check_package_keywords = _xwlazy.check_package_keywords
    enable_learning = _xwlazy.enable_learning
    predict_next_imports = _xwlazy.predict_next_imports
    get_all_stats = _xwlazy.get_all_stats
    generate_sbom = _xwlazy.generate_sbom
    get_lockfile = _xwlazy.get_lockfile
    save_lockfile = _xwlazy.save_lockfile
    install_global_import_hook = _xwlazy.install_global_import_hook
    uninstall_global_import_hook = _xwlazy.uninstall_global_import_hook
    is_global_import_hook_installed = _xwlazy.is_global_import_hook_installed
    is_externally_managed = _xwlazy.is_externally_managed
    add_watched_prefix = _xwlazy.add_watched_prefix
    remove_watched_prefix = _xwlazy.remove_watched_prefix
    get_watched_prefixes = _xwlazy.get_watched_prefixes
    is_module_watched = _xwlazy.is_module_watched
    get_cache_stats = _xwlazy.get_cache_stats
    clear_cache = _xwlazy.clear_cache
    invalidate_cache = _xwlazy.invalidate_cache
    get_performance_stats = _xwlazy.get_performance_stats
    clear_performance_stats = _xwlazy.clear_performance_stats
else:
    raise ImportError("xwlazy.py module not found!")

# Import version from version module if it exists
# Note: version.py is at src/exonware/xwlazy/version.py (for hatch build system)
try:
    _version_file = Path(__file__).parent / "xwlazy" / "version.py"
    if _version_file.exists():
        _version_spec = importlib.util.spec_from_file_location("exonware.xwlazy.version", _version_file)
        _version_module = importlib.util.module_from_spec(_version_spec)
        _version_spec.loader.exec_module(_version_module)
        __version__ = _version_module.__version__
    else:
        __version__ = "1.0.1"
except (ImportError, AttributeError, Exception):
    # Fallback: use default version
    __version__ = "1.0.1"

__all__ = [
    # Core activation
    'hook', 'auto_enable_lazy', 'attach',
    # Main class
    'XWLazy',
    # Keyword detection
    'enable_keyword_detection', 'is_keyword_detection_enabled', 'check_package_keywords',
    # Adaptive learning
    'enable_learning', 'predict_next_imports',
    # Stats & monitoring
    'get_all_stats', 'generate_sbom',
    # Lockfile
    'get_lockfile', 'save_lockfile',
    # Global hook
    'install_global_import_hook', 'uninstall_global_import_hook', 'is_global_import_hook_installed',
    # Utility
    'is_externally_managed',
    # Watched prefixes
    'add_watched_prefix', 'remove_watched_prefix', 'get_watched_prefixes', 'is_module_watched',
    # Cache management
    'get_cache_stats', 'clear_cache', 'invalidate_cache',
    # Performance monitoring
    'get_performance_stats', 'clear_performance_stats',
]
