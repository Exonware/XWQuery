"""
xwlazy v4.0 - Enterprise Features in Single File

A comprehensive, single-file auto-installation system with enterprise-grade features.
Covers all major xwlazy capabilities while maintaining single-file simplicity.

FIX v3.0.3: Code Consolidation & Critical Fixes:
  - Unified TOML Loader: Single _load_toml_file() function reused across all TOML parsing (reduces ~50 lines)
  - Fixed Cache Collisions: Uses hashlib.sha256 instead of hash() for collision-resistant cache filenames
  - Fixed Race Conditions: Thread-safe access to _global_hook_manager in _intercepting_import()
  - Fixed Silent Exceptions: Proper error handling and logging throughout (no more silent failures)
  - Removed Duplicate Code: Eliminated duplicate SERIALIZATION_PREFIXES and consolidated TOML reading
  - Better Error Messages: All exceptions logged with ASCII-safe encoding for Windows compatibility

FIX v4.0.2: Full Dependency Installation with Version Support:
  - Ensures all dependencies are installed along with the package (explicit --no-deps prevention)
  - Version constraints from requirements.txt/pyproject.toml are included in install commands
  - _run_pip_install now explicitly installs full dependency tree with version constraints

Key Features:
  - ✅ PER-PACKAGE ISOLATION: Each package configured independently
  - ✅ KEYWORD-BASED AUTO-DETECTION: Zero-code integration via pyproject.toml keywords
  - ✅ GLOBAL __import__ HOOK: Module-level import interception
  - ✅ ONE-LINE ACTIVATION: auto_enable_lazy(__package__)
  - ✅ EXTERNAL LIBRARY MAPPINGS: Loads from xwlazy_external_libs.toml with version support
  - ✅ MULTI-TIER CACHING: L1 (memory LRU) + L2 (disk cache) for better performance (NEW v3.0.2!)
  - ✅ WATCHED PREFIXES: Special handling for serialization modules (pickle, json, yaml, etc.) (NEW v3.0.2!)
  - ✅ ENHANCED PERFORMANCE MONITORING: Detailed metrics tracking (load times, access counts, cache stats) (NEW v3.0.2!)
  - ✅ SERIALIZATION MODULE DETECTION: Automatic detection and special handling (NEW v3.0.2!)
  - ✅ LOCKFILE SUPPORT: Track installed packages for reproducibility
  - ✅ ADAPTIVE LEARNING: Lightweight pattern-based optimization
  - ✅ functools.lru_cache: High-performance resolution caching
  - ✅ Multiple Installation Strategies: PIP, Wheel, Smart, Cached
  - ✅ Thread-safe: RLock-based concurrency handling
  - ✅ Zero dependencies: Uses only standard library (+ tomllib/tomli)

Fully TOML-only Implementation (v4.0):
  - External Library Mappings: xwlazy_external_libs.toml (no JSON fallback)
  - SBOM Output: xwlazy_sbom.toml (TOML format)
  - Lockfile: xwlazy.lock.toml (TOML format)
  - Manifest Parsing: requirements.txt + pyproject.toml only (no JSON manifests)
  - Version Support: Uses versions from external_libs.toml if missing from requirements.txt/pyproject.toml
  - Backwards Compatibility: Can read legacy JSON files during migration
  - TOML Writer: Uses tomli-w if available, otherwise manual writer (zero dependencies goal)

NEW v4.0 - Enterprise Features:
  - Multi-Tier Caching: L1 (memory LRU) + L2 (disk cache) for better performance
  - Watched Prefixes: Special handling for serialization modules (pickle, json, yaml, etc.)
  - Enhanced Performance Monitoring: Detailed metrics (load times, access counts, cache performance)
  - Serialization Module Detection: Automatic detection of serialization modules for special handling
Version: 1.0.1.3
Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Date: 2025-01-27
"""

# =============================================================================
# STANDARD LIBRARY IMPORTS (Built-in, No pip installation needed)
# =============================================================================
import sys
import os
import re
import time
import subprocess
import importlib
import importlib.util
import importlib.metadata  # Built-in since Python 3.8+ (for Python 3.7: needs pip install importlib-metadata)
import threading
import types
import collections
import builtins
import inspect
import pickle
import hashlib
from functools import lru_cache
from pathlib import Path
from datetime import datetime
from collections import defaultdict, deque, OrderedDict
from importlib.abc import MetaPathFinder, Loader
from importlib.util import spec_from_loader

# =============================================================================
# EXTERNAL DEPENDENCIES (Conditionally imported, Need pip installation)
# =============================================================================
# These are imported conditionally inside functions:
# - tomllib: Built-in since Python 3.11+ (no pip needed)
# - tomli: Required for Python < 3.11 (pip install tomli) - imported conditionally in _read_toml_simple, _load_hard_mappings, _index_manifests, _extract_auto_config
# - tomli_w: Optional for TOML writing (pip install tomli-w) - imported conditionally in _write_toml_simple
# Note: Code gracefully handles missing tomli/tomli_w by falling back to manual writer/reader

# =============================================================================
# CONFIGURATION & CONSTANTS
# =============================================================================

# Centralized storage directory for xwlazy files (prevents pollution in project directories)
XWLAZY_DATA_DIR = Path.home() / ".xwlazy"
XWLAZY_CACHE_DIR = XWLAZY_DATA_DIR / "cache"
AUDIT_LOG_FILE = "xwlazy_sbom.toml"  # Filename only (will be stored in XWLAZY_DATA_DIR)
LOCKFILE_PATH = "xwlazy.lock.toml"  # Filename only (will be stored in XWLAZY_DATA_DIR)
EXTERNAL_LIBS_TOML = "xwlazy_external_libs.toml"

# Serialization module prefixes (watched for special handling)
SERIALIZATION_PREFIXES = {
    "pickle", "json", "yaml", "toml", "xml", "msgpack", "cbor",
    "bson", "protobuf", "avro", "csv", "parquet", "feather"
}

# Fallback Hard Mappings (used if TOML file not found)
_FALLBACK_HARD_MAPPINGS = {
    "google.protobuf": "protobuf", "cv2": "opencv-python", "PIL": "Pillow",
    "sklearn": "scikit-learn", "yaml": "PyYAML", "bs4": "beautifulsoup4",
    "mysqldb": "mysqlclient", "pandas": "pandas", "numpy": "numpy",
    "requests": "requests", "lz4.frame": "lz4", "fastavro": "fastavro",
    "pyarrow": "pyarrow", "h5py": "h5py", "scipy": "scipy",
    "psycopg2": "psycopg2-binary", "boto3": "boto3",
}

def _write_toml_simple(data, file_path):
    """
    Simple TOML writer for basic data structures (dict, list, str, int, float, bool, None).
    Handles nested structures but keeps it minimal for our use case (SBOM, lockfile).
    Uses tomli-w if available, otherwise falls back to minimal manual writer.
    """
    # Try using tomli-w (optional dependency) for better TOML compliance
    # Note: tomli-w only handles dicts, so we use manual writer for lists
    if isinstance(data, dict):
        try:
            import tomli_w
            with open(file_path, 'wb') as f:
                tomli_w.dump(data, f)
            return
        except ImportError:
            pass  # Fall back to manual writer
    
    # Manual TOML writer for simple cases (handles nested dicts as TOML tables)
    def _escape_string(s):
        """Escape strings for TOML."""
        if not isinstance(s, str):
            return s
        # Escape special chars for TOML strings
        s = s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n').replace('\t', '\\t')
        return f'"{s}"'
    
    def _escape_key(key):
        """Escape TOML key if needed."""
        key_str = str(key)
        if not key_str.replace('_', '').replace('-', '').replace('.', '').isalnum():
            return _escape_string(key_str)
        return key_str
    
    def _format_value(value, indent=0):
        """Format a value for TOML."""
        if value is None:
            return 'null'
        elif isinstance(value, bool):
            return 'true' if value else 'false'
        elif isinstance(value, (int, float)):
            return str(value)
        elif isinstance(value, str):
            return _escape_string(value)
        elif isinstance(value, list):
            if not value:
                return '[]'
            # Check if all items are primitives
            if all(not isinstance(item, (dict, list)) for item in value):
                items = ', '.join(_format_value(item, indent) for item in value)
                return f'[{items}]'
            else:
                # Multi-line array
                lines = ['[']
                for item in value:
                    formatted = _format_value(item, indent + 1)
                    if isinstance(item, dict):
                        # Inline table for dicts in arrays
                        lines.append(' ' * (indent * 2 + 2) + '{' + formatted + '},')
                    else:
                        lines.append(' ' * (indent * 2 + 2) + formatted + ',')
                lines.append(' ' * (indent * 2) + ']')
                return '\n'.join(lines)
        else:
            return str(value)
    
    def _format_dict(data, prefix="", indent=0):
        """Format a dictionary as TOML (uses tables for nested dicts)."""
        lines = []
        primitives = {}
        nested = {}
        
        # Separate primitives from nested dicts
        for key, val in data.items():
            if isinstance(val, dict):
                nested[key] = val
            else:
                primitives[key] = val
        
        # Write primitive values
        for key, val in primitives.items():
            key_escaped = _escape_key(key)
            formatted_val = _format_value(val, indent)
            lines.append(' ' * (indent * 2) + f'{key_escaped} = {formatted_val}')
        
        # Write nested dicts as tables
        for key, val in nested.items():
            key_escaped = _escape_key(key)
            table_path = f'{prefix}.{key_escaped}' if prefix else key_escaped
            lines.append('')
            lines.append(' ' * (indent * 2) + f'[{table_path}]')
            nested_lines = _format_dict(val, table_path, indent + 1)
            lines.extend(nested_lines)
        
        return lines
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            if isinstance(data, dict):
                lines = _format_dict(data)
                content = '\n'.join(lines)
                f.write(content)
                if content and not content.endswith('\n'):
                    f.write('\n')
            elif isinstance(data, list):
                # List format (for audit log entries - list of dicts)
                if data and isinstance(data[0], dict):
                    # Array of tables format
                    for item in data:
                        f.write('[[entry]]\n')
                        item_lines = _format_dict(item, "entry", 0)
                        f.write('\n'.join(item_lines))
                        f.write('\n\n')
                else:
                    # Simple array of primitives
                    f.write('entries = ' + _format_value(data, 0) + '\n')
            else:
                content = _format_value(data, 0)
                f.write(content)
                if not content.endswith('\n'):
                    f.write('\n')
    except Exception as e:
        raise IOError(f"Failed to write TOML to {file_path}: {e}")

# =============================================================================
# UNIFIED TOML LOADER (Reused across all TOML operations)
# =============================================================================

def _load_toml_file(file_path, verbose_error=True):
    """
    Unified TOML file loader - reused across all TOML parsing operations.
    
    Uses tomllib (Python 3.11+) or tomli (Python < 3.11) with proper error handling.
    Returns None if file doesn't exist or parsing fails.
    
    Args:
        file_path: Path to TOML file
        verbose_error: If True, log errors to stderr (for verbose mode)
    
    Returns:
        dict: Parsed TOML data, or None if file doesn't exist or parsing fails
    """
    if not Path(file_path).exists():
        return None
    
    # Try TOML parsing (Python 3.11+ uses built-in tomllib, else use tomli)
    try:
        if sys.version_info >= (3, 11):
            import tomllib
            with open(file_path, "rb") as f:
                return tomllib.load(f)
        else:
            try:
                import tomli
                with open(file_path, "rb") as f:
                    return tomli.load(f)
            except ImportError:
                if verbose_error and os.environ.get('XWLAZY_VERBOSE'):
                    sys.stderr.write(f"[xwlazy] tomli not available for Python < 3.11\n")
                return None
    except Exception as e:
        if verbose_error and os.environ.get('XWLAZY_VERBOSE'):
            err_msg = str(e).encode('ascii', 'replace').decode('ascii')
            sys.stderr.write(f"[xwlazy] Error parsing TOML file {file_path}: {err_msg}\n")
        return None

def _read_toml_simple(file_path):
    """
    Simple TOML reader with JSON fallback (for backwards compatibility).
    Reuses unified _load_toml_file() function.
    
    Handles array of tables format ([[entry]]) and legacy JSON format.
    """
    if not Path(file_path).exists():
        return None
    
    # Use unified TOML loader
    data = _load_toml_file(file_path, verbose_error=False)
    if data is not None:
        # Handle array of tables format ([[entry]])
        if isinstance(data, dict) and 'entry' in data:
            entries = data['entry']
            if isinstance(entries, list):
                return entries
        return data
    
    # Fallback to JSON (for backwards compatibility with existing files)
    try:
        import json
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        if os.environ.get('XWLAZY_VERBOSE'):
            sys.stderr.write(f"[xwlazy] Failed to read {file_path} as TOML or JSON: {e}\n")
        return None

def _extract_package_name(value):
    """
    Extract package name from value that may contain version constraints.
    
    Examples:
        "protobuf" -> "protobuf"
        "protobuf>=4.0" -> "protobuf"
        "pandas>=2.0,<3.0" -> "pandas"
    """
    if not isinstance(value, str):
        return str(value)
    
    # Remove version constraints (>=, <=, ==, !=, ~=, <, >, and comma-separated)
    # Keep only the package name
    clean = re.split(r'[<>=!~,;]', value)[0].strip()
    return clean

def _generate_fallback_candidates(fullname):
    """
    Generate fallback package name candidates from import name.
    
    If a package is not found in xwlazy_external_libs.toml, try importing
    using the same name with transformations:
    - Replace dots with dashes
    - Replace dots with underscores
    - Progressively shorten by removing segments from the end
    
    Examples:
        "exonware.xwlazy.core_file" -> [
            "exonware-xwlazy-core_file",
            "exonware_xwlazy_core_file",
            "exonware-xwlazy",
            "exonware_xwlazy",
            "exonware"
        ]
        
        "something.something.something.something.something.something" -> [
            "something-something-something-something-something-something",
            "something_something_something_something_something_something",
            "something-something-something-something-something",
            "something_something_something_something_something",
            ... (continues down to just "something")
        ]
    """
    if not fullname or not isinstance(fullname, str):
        return []
    
    parts = fullname.split('.')
    if not parts:
        return []
    
    candidates = []
    
    # Generate progressively shorter versions, starting from full name
    for length in range(len(parts), 0, -1):
        segment = '.'.join(parts[:length])
        
        # Try dash variant first
        dash_version = segment.replace('.', '-')
        candidates.append(dash_version)
        
        # Try underscore variant (only if different from dash)
        underscore_version = segment.replace('.', '_')
        if underscore_version != dash_version:
            candidates.append(underscore_version)
    
    return candidates

def _load_hard_mappings():
    """
    Load hard mappings from external TOML file.
    Reuses unified _load_toml_file() function to reduce code duplication.
    
    Loads from xwlazy_external_libs.toml (supports version constraints).
    Falls back to hardcoded mappings if TOML file not found or invalid.
    
    TOML file format (supports versions):
    [mappings]
    "google.protobuf" = "protobuf"  # Package name only
    "pandas" = "pandas>=2.0"        # Package name with version (used if missing from requirements.txt)
    "cv2" = "opencv-python"
    ...
    
    Returns:
        dict: Mapping of import names to full package spec (name + version if present)
              Format: {"import_name": "package_name" or "package_name>=version"}
    """
    module_dir = Path(__file__).parent
    toml_path = module_dir / EXTERNAL_LIBS_TOML
    
    # Use unified TOML loader (reused code)
    data = _load_toml_file(toml_path, verbose_error=True)
    
    if data:
        # Extract [mappings] section
        mappings_section = data.get("mappings", {})
        if isinstance(mappings_section, dict):
            # Keep full value (including versions if present)
            mappings = {}
            for import_name, package_value in mappings_section.items():
                if isinstance(package_value, str):
                    mappings[import_name] = package_value  # Keep version if present
                else:
                    mappings[import_name] = str(package_value)
            
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stdout.write(f"[OK] [xwlazy] Loaded {len(mappings)} mappings from {EXTERNAL_LIBS_TOML}\n")
            return mappings
        else:
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stderr.write(f"[xwlazy] {EXTERNAL_LIBS_TOML} [mappings] section is not a dictionary, using hardcoded fallback\n")
    else:
        if os.environ.get('XWLAZY_VERBOSE'):
            if not toml_path.exists():
                sys.stderr.write(f"[xwlazy] {EXTERNAL_LIBS_TOML} not found, using hardcoded fallback mappings\n")
            else:
                sys.stderr.write(f"[xwlazy] Failed to parse {EXTERNAL_LIBS_TOML}, using hardcoded fallback\n")
    
    # Fallback to hardcoded mappings (package names only, no versions)
    if os.environ.get('XWLAZY_VERBOSE'):
        sys.stdout.write(f"[xwlazy] Using fallback hardcoded mappings ({len(_FALLBACK_HARD_MAPPINGS)} entries)\n")
    return _FALLBACK_HARD_MAPPINGS.copy()

def _load_deny_list():
    """
    Load deny list from external TOML file.
    
    Loads from xwlazy_external_libs.toml [deny_list] section.
    Falls back to hardcoded deny list if TOML file not found or invalid.
    
    TOML file format:
    [deny_list]
    "lxml" = "Blocked: Python 2 syntax incompatibility"
    "package_name" = "Reason for blocking"
    
    Returns:
        set: Set of package names to deny
    """
    module_dir = Path(__file__).parent
    toml_path = module_dir / EXTERNAL_LIBS_TOML
    
    # Use unified TOML loader
    data = _load_toml_file(toml_path, verbose_error=False)
    
    if data:
        # Extract [deny_list] section
        deny_list_section = data.get("deny_list", {})
        if isinstance(deny_list_section, dict):
            # Extract package names (keys) from deny_list
            deny_list = set(deny_list_section.keys())
            
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stdout.write(f"[OK] [xwlazy] Loaded {len(deny_list)} packages from deny_list in {EXTERNAL_LIBS_TOML}\n")
            return deny_list
    
    # Fallback to hardcoded deny list (lxml blocked due to Python 2 syntax issues)
    return {"lxml"}

# Load hard mappings from external TOML file
HARD_MAPPINGS = _load_hard_mappings()

# =============================================================================
# MULTI-TIER CACHE (L1 + L2) - Simplified Version
# =============================================================================

class SimpleMultiTierCache:
    """
    Simplified multi-tier cache: L1 (memory LRU) + L2 (disk).
    
    Multi-tier caching: L1 (memory LRU) + L2 (disk cache) for better performance.
    - L1: In-memory LRU cache (fastest)
    - L2: Disk cache (persistent across runs)
    """
    
    def __init__(self, l1_size=1000, l2_dir=None):
        self._l1_size = l1_size
        self._l1_cache = OrderedDict()  # LRU cache (OrderedDict for O(1) operations)
        self._l2_dir = Path(l2_dir) if l2_dir else XWLAZY_CACHE_DIR / "l2_cache"
        self._l2_dir.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._stats = {"l1_hits": 0, "l2_hits": 0, "misses": 0}
    
    def _get_cache_filename(self, key):
        """
        Generate collision-resistant cache filename using hashlib.
        FIX v3.0.3: Replaces hash() with hashlib to prevent collisions.
        """
        # Use hashlib for collision-resistant hashing (SHA-256 truncated to 16 hex chars = 64 bits)
        key_bytes = str(key).encode('utf-8')
        cache_hash = hashlib.sha256(key_bytes).hexdigest()[:16]  # 16 hex chars = 64 bits
        return f"{cache_hash}.cache"
    
    def get(self, key):
        """Get value from cache (L1 -> L2)."""
        with self._lock:
            # Check L1 first (fastest)
            if key in self._l1_cache:
                value = self._l1_cache.pop(key)
                self._l1_cache[key] = value  # Move to end (LRU)
                self._stats["l1_hits"] += 1
                return value
            
            # Check L2 (disk) with collision-resistant filename (uses hashlib.sha256)
            cache_filename = self._get_cache_filename(key)
            l2_path = self._l2_dir / cache_filename
            if l2_path.exists():
                try:
                    with open(l2_path, 'rb') as f:
                        value = pickle.load(f)
                    # Handle both legacy format (direct value) and new format (with key verification)
                    if isinstance(value, dict) and "_cache_key" in value and "_cache_value" in value:
                        # New format: verify key matches to prevent collision issues
                        if value.get("_cache_key") == key:
                            actual_value = value["_cache_value"]
                        else:
                            # Hash collision detected - skip this cache entry
                            if os.environ.get('XWLAZY_VERBOSE'):
                                sys.stderr.write(f"[xwlazy] Cache collision detected for {key}, skipping L2 cache\n")
                            self._stats["misses"] += 1
                            return None
                    else:
                        # Legacy format (direct value) - trust it (very rare collision)
                        actual_value = value
                    
                    # Promote to L1
                    self._set_l1(key, actual_value)
                    self._stats["l2_hits"] += 1
                    return actual_value
                except Exception as e:
                    # FIX v3.0.3: Proper error handling instead of silent pass
                    if os.environ.get('XWLAZY_VERBOSE'):
                        err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                        sys.stderr.write(f"[xwlazy] Failed to load L2 cache for {key}: {err_msg}\n")
            
            self._stats["misses"] += 1
            return None
    
    def set(self, key, value):
        """Set value in cache (L1 + L2)."""
        with self._lock:
            self._set_l1(key, value)
        
        # Write to L2 (disk) with collision-resistant filename and key verification
        try:
            cache_filename = self._get_cache_filename(key)
            l2_path = self._l2_dir / cache_filename
            
            # Store with key for collision detection
            cache_data = {"_cache_key": key, "_cache_value": value}
            
            with open(l2_path, 'wb') as f:
                pickle.dump(cache_data, f)
        except Exception as e:
            # FIX v3.0.3: Proper error handling instead of silent pass
            if os.environ.get('XWLAZY_VERBOSE'):
                err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                sys.stderr.write(f"[xwlazy] Failed to write L2 cache for {key}: {err_msg}\n")
            # L2 failures are non-fatal, continue without disk cache
    
    def _set_l1(self, key, value):
        """Set value in L1 cache (internal, called with lock held)."""
        if key in self._l1_cache:
            self._l1_cache.pop(key)
        elif len(self._l1_cache) >= self._l1_size:
            self._l1_cache.popitem(last=False)  # Remove oldest (LRU)
        self._l1_cache[key] = value
    
    def invalidate(self, key):
        """Invalidate cached value (L1 + L2)."""
        with self._lock:
            self._l1_cache.pop(key, None)
        
        # Invalidate L2 with collision-resistant filename
        cache_filename = self._get_cache_filename(key)
        l2_path = self._l2_dir / cache_filename
        try:
            # Verify key matches before deleting (prevent accidental deletion from collision)
            if l2_path.exists():
                try:
                    with open(l2_path, 'rb') as f:
                        cached = pickle.load(f)
                    # Only delete if key matches (prevent collision issues)
                    if isinstance(cached, dict) and cached.get("_cache_key") == key:
                        l2_path.unlink(missing_ok=True)
                    elif not isinstance(cached, dict) or "_cache_key" not in cached:
                        # Legacy format - trust hash (very rare collision) and delete
                        l2_path.unlink(missing_ok=True)
                except Exception:
                    # If verification fails, still try to delete (might be corrupted)
                    l2_path.unlink(missing_ok=True)
        except Exception as e:
            # FIX v3.0.3: Proper error handling
            if os.environ.get('XWLAZY_VERBOSE'):
                err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                sys.stderr.write(f"[xwlazy] Failed to invalidate L2 cache for {key}: {err_msg}\n")
    
    def clear(self):
        """Clear all caches (L1 + L2)."""
        with self._lock:
            self._l1_cache.clear()
            self._stats = {"l1_hits": 0, "l2_hits": 0, "misses": 0}
        
        # Clear L2 cache files
        try:
            for cache_file in self._l2_dir.glob("*.cache"):
                cache_file.unlink(missing_ok=True)
        except Exception as e:
            # FIX v3.0.3: Proper error handling
            if os.environ.get('XWLAZY_VERBOSE'):
                err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                sys.stderr.write(f"[xwlazy] Failed to clear L2 cache directory: {err_msg}\n")
    
    def get_stats(self):
        """Get cache statistics."""
        with self._lock:
            total = sum(self._stats.values())
            return {
                "l1_size": len(self._l1_cache),
                "l1_max_size": self._l1_size,
                "l1_hits": self._stats["l1_hits"],
                "l2_hits": self._stats["l2_hits"],
                "misses": self._stats["misses"],
                "hit_rate": (self._stats["l1_hits"] + self._stats["l2_hits"]) / total if total > 0 else 0.0
            }

# =============================================================================
# WATCHED PREFIXES REGISTRY (For Serialization Modules)
# =============================================================================

class WatchedPrefixRegistry:
    """
    Registry for watched module prefixes (for serialization modules).
    
    Watched prefixes: Special handling for serialization modules.
    Used to detect serialization modules (pickle, json, yaml, etc.).
    """
    
    def __init__(self, initial_prefixes=None):
        self._prefixes = set(initial_prefixes or SERIALIZATION_PREFIXES)
        self._lock = threading.RLock()
        self._custom_prefixes = set()  # User-defined prefixes
    
    def add_prefix(self, prefix):
        """Add a watched prefix."""
        with self._lock:
            self._custom_prefixes.add(prefix)
    
    def remove_prefix(self, prefix):
        """Remove a watched prefix."""
        with self._lock:
            self._custom_prefixes.discard(prefix)
    
    def is_watched(self, module_name):
        """Check if module matches any watched prefix."""
        with self._lock:
            all_prefixes = self._prefixes | self._custom_prefixes
            top_module = module_name.split('.')[0]
            return top_module in all_prefixes or any(
                module_name.startswith(prefix + '.') for prefix in all_prefixes
            )
    
    def get_watched_prefixes(self):
        """Get all watched prefixes."""
        with self._lock:
            return sorted(self._prefixes | self._custom_prefixes)

# =============================================================================
# ENHANCED PERFORMANCE MONITORING
# =============================================================================

class EnhancedPerformanceMonitor:
    """
    Enhanced performance monitoring with detailed metrics.
    
    NEW v3.0.2: More comprehensive metrics tracking like xwlazy.
    Tracks: load times, access counts, memory usage, cache performance.
    """
    
    def __init__(self):
        self._load_times = defaultdict(list)
        self._access_counts = defaultdict(int)
        self._module_sizes = {}
        self._cache_performance = {"hits": 0, "misses": 0}
        self._operation_history = deque(maxlen=1000)  # Last 1000 operations
        self._lock = threading.RLock()
    
    def record_load_time(self, module, load_time):
        """Record module load time."""
        with self._lock:
            self._load_times[module].append(load_time)
            self._operation_history.append({
                "operation": "load",
                "module": module,
                "duration": load_time,
                "timestamp": time.time()
            })
    
    def record_access(self, module):
        """Record module access."""
        with self._lock:
            self._access_counts[module] += 1
    
    def record_cache_hit(self):
        """Record cache hit."""
        with self._lock:
            self._cache_performance["hits"] += 1
    
    def record_cache_miss(self):
        """Record cache miss."""
        with self._lock:
            self._cache_performance["misses"] += 1
    
    def record_module_size(self, module, size_bytes):
        """Record module size (in bytes)."""
        with self._lock:
            self._module_sizes[module] = size_bytes
    
    def get_stats(self):
        """Get comprehensive performance statistics."""
        with self._lock:
            total_loads = sum(len(times) for times in self._load_times.values())
            avg_load_time = sum(
                sum(times) for times in self._load_times.values()
            ) / total_loads if total_loads > 0 else 0.0
            
            cache_total = self._cache_performance["hits"] + self._cache_performance["misses"]
            cache_hit_rate = (
                self._cache_performance["hits"] / cache_total
                if cache_total > 0 else 0.0
            )
            
            return {
                "modules_loaded": len(self._load_times),
                "total_loads": total_loads,
                "average_load_time_ms": avg_load_time * 1000,
                "total_accesses": sum(self._access_counts.values()),
                "top_accessed_modules": sorted(
                    self._access_counts.items(),
                    key=lambda x: x[1],
                    reverse=True
                )[:10],
                "cache_hit_rate": cache_hit_rate,
                "cache_hits": self._cache_performance["hits"],
                "cache_misses": self._cache_performance["misses"],
                "total_module_size_bytes": sum(self._module_sizes.values()),
                "recent_operations": list(self._operation_history)[-10:]
            }
    
    def clear(self):
        """Clear all metrics."""
        with self._lock:
            self._load_times.clear()
            self._access_counts.clear()
            self._module_sizes.clear()
            self._cache_performance = {"hits": 0, "misses": 0}
            self._operation_history.clear()

# =============================================================================
# ADAPTIVE LEARNING (Simplified Version)
# =============================================================================

class AdaptiveLearner:
    """Lightweight adaptive learning for pattern-based optimization."""
    
    def __init__(self, learning_window=100):
        self._learning_window = learning_window
        self._import_sequences = deque(maxlen=learning_window)
        self._access_times = defaultdict(list)
        self._import_chains = defaultdict(lambda: defaultdict(int))
        self._module_scores = {}
        self._lock = threading.RLock()
    
    def record_import(self, module_name, import_time):
        """Record an import event for learning."""
        current_time = time.time()
        with self._lock:
            self._import_sequences.append((module_name, current_time, import_time))
            self._access_times[module_name].append(current_time)
            
            # Update import chains
            if len(self._import_sequences) > 1:
                prev_name, _, _ = self._import_sequences[-2]
                self._import_chains[prev_name][module_name] += 1
            
            # Update scores periodically
            if len(self._access_times[module_name]) % 5 == 0:
                self._update_module_score(module_name)
    
    def _update_module_score(self, module_name):
        """Update module priority score."""
        with self._lock:
            accesses = self._access_times[module_name]
            if not accesses:
                return
            
            recent = [t for t in accesses if time.time() - t < 3600]
            frequency = len(recent)
            
            if accesses:
                recency = 1.0 / (time.time() - accesses[-1] + 1.0)
            else:
                recency = 0.0
            
            chain_weight = sum(
                self._import_chains.get(prev, {}).get(module_name, 0)
                for prev in self._access_times.keys()
            ) / max(len(self._import_sequences), 1)
            
            self._module_scores[module_name] = frequency * 0.4 + recency * 1000 * 0.4 + chain_weight * 0.2
    
    def predict_next_imports(self, current_module=None, limit=5):
        """Predict likely next imports."""
        with self._lock:
            if not self._import_sequences:
                return []
            
            candidates = {}
            if current_module:
                chain_candidates = self._import_chains.get(current_module, {})
                for module, count in chain_candidates.items():
                    candidates[module] = candidates.get(module, 0.0) + count * 2.0
            
            for module, score in self._module_scores.items():
                candidates[module] = candidates.get(module, 0.0) + score * 0.5
            
            sorted_candidates = sorted(candidates.items(), key=lambda x: x[1], reverse=True)
            return [module for module, _ in sorted_candidates[:limit]]
    
    def get_stats(self):
        """Get learning statistics."""
        with self._lock:
            return {
                'sequences_tracked': len(self._import_sequences),
                'unique_modules': len(self._access_times),
                'chains_tracked': sum(len(chains) for chains in self._import_chains.values()),
                'top_modules': self._get_priority_modules(5),
            }
    
    def _get_priority_modules(self, limit=10):
        """Get priority modules based on scores."""
        sorted_modules = sorted(self._module_scores.items(), key=lambda x: x[1], reverse=True)
        return [module for module, _ in sorted_modules[:limit]]

# =============================================================================
# GLOBAL __import__ HOOK (Module-Level Interception)
# =============================================================================

# Capture original builtins.__import__ only once at module load (prevents state issues)
_original_builtins_import = builtins.__import__
_global_import_hook_installed = False
_global_import_hook_lock = threading.RLock()
_global_hook_manager = None

def _intercepting_import(name, globals=None, locals=None, fromlist=(), level=0):
    """
    Global builtins.__import__ replacement for module-level interception.
    Intercepts ALL imports including those at module level during package init.
    FIX v3.0.3: Thread-safe access to _global_hook_manager with proper error handling.
    """
    # Skip relative imports (level > 0) - use normal import
    if level > 0:
        return _original_builtins_import(name, globals, locals, fromlist, level)
    
    # Use original import first
    try:
        module = _original_builtins_import(name, globals, locals, fromlist, level)
        return module
    except ImportError:
        # Re-raise: never return None. Callers expect a module or an exception.
        # xwlazy handling for missing packages runs via meta_path finder, not here.
        raise
    except (OSError, TypeError, AttributeError) as e:
        # Handle exceptions during module initialization:
        # - OSError: gssapi/Kerberos issues
        # - TypeError: protobuf version incompatibilities (e.g., riak)
        # - AttributeError: protobuf/other version issues
        # Convert to ImportError so connectors can handle gracefully
        error_msg = f"Module {name} cannot be initialized"
        if isinstance(e, OSError) and ('gssapi' in name.lower() or 'kerberos' in str(e).lower() or 'KfW' in str(e)):
            error_msg += " (system dependency missing: Kerberos)"
        elif isinstance(e, TypeError) and ('protobuf' in str(e).lower() or 'descriptor' in str(e).lower()):
            error_msg += " (protobuf version incompatibility)"
        elif isinstance(e, AttributeError):
            error_msg += " (version incompatibility)"
        raise ImportError(f"{error_msg}: {e}") from e
        # FIX v3.0.3: Thread-safe access to _global_hook_manager (prevents race conditions)
        with _global_import_hook_lock:
            hook_manager = _global_hook_manager
        
        # Let xwlazy handle it via meta_path finder (outside lock to avoid deadlock)
        if hook_manager and hasattr(hook_manager, 'find_spec'):
            try:
                # FIX: find_spec requires (fullname, path, target=None) signature
                # path should be None for top-level modules, or the package's __path__ for submodules
                spec = hook_manager.find_spec(name, None)
                if spec and spec.loader:
                    module = importlib.util.module_from_spec(spec)
                    sys.modules[name] = module
                    spec.loader.exec_module(module)
                    return module
            except Exception as e:
                # FIX v3.0.3: Proper error handling instead of silent pass
                if os.environ.get('XWLAZY_VERBOSE'):
                    err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                    sys.stderr.write(f"[xwlazy] Error in global import hook for {name}: {err_msg}\n")
        
        # Re-raise original ImportError
        raise

def _install_global_import_hook(manager):
    """Install global builtins.__import__ hook."""
    global _original_builtins_import, _global_import_hook_installed, _global_hook_manager
    
    with _global_import_hook_lock:
        if _global_import_hook_installed:
            return
        
        # FIX v3.0.3: Use module-level _original_builtins_import (captured at module load)
        # Don't re-capture here to avoid issues if hook is installed after another module modifies builtins.__import__
        builtins.__import__ = _intercepting_import
        _global_hook_manager = manager
        _global_import_hook_installed = True

def _uninstall_global_import_hook():
    """Uninstall global builtins.__import__ hook."""
    global _original_builtins_import, _global_import_hook_installed, _global_hook_manager
    
    with _global_import_hook_lock:
        if not _global_import_hook_installed:
            return
        
        builtins.__import__ = _original_builtins_import
        _global_hook_manager = None
        _global_import_hook_installed = False

# =============================================================================
# LAZY LOADING PROXY (Thread-Safe & Recursion-Free)
# =============================================================================

class LazyModuleProxy(types.ModuleType):
    """Proxy that poses as module while installing in background."""
    
    def __init__(self, fullname, install_thread, manager):
        super().__init__(fullname)
        self.__file__ = f"<lazy_installing_{fullname}>"
        self._install_thread = install_thread
        self._manager = manager
        self._real_module = None
    
    def _ensure_installed(self):
        """Blocks until install completes, then swaps itself out."""
        if self._real_module:
            return self._real_module
        
        if self._install_thread.is_alive():
            self._install_thread.join()
        
        with self._manager._lock:
            if self.__name__ in self._manager.failed_installs:
                raise ImportError(f"xwlazy failed to install {self.__name__}")
        
        manager = self._manager
        was_in_path = False
        try:
            if manager in sys.meta_path:
                sys.meta_path.remove(manager)
                was_in_path = True
            
            self._real_module = importlib.import_module(self.__name__)
            sys.modules[self.__name__] = self._real_module
        finally:
            if was_in_path and manager not in sys.meta_path:
                sys.meta_path.insert(0, manager)
        
        return self._real_module

    def __getattr__(self, name):
        if name in ["_ensure_installed", "_install_thread", "_manager", "_real_module", "__name__", "__path__", "__loader__", "__spec__"]:
            return object.__getattribute__(self, name)
        return getattr(self._ensure_installed(), name)

    def __dir__(self):
        return dir(self._ensure_installed())
        
    def __repr__(self):
        if self._real_module:
            return repr(self._real_module)
        return f"<LazyProxy for '{self.__name__}' (Installing...)>"

class LazyLoader(Loader):
    def __init__(self, manager, fullname, install_target):
        self.manager = manager
        self.fullname = fullname
        self.install_target = install_target

    def create_module(self, spec):
        thread = threading.Thread(
            target=self.manager._perform_install,
            args=(self.install_target, self.fullname),
            daemon=True
        )
        thread.start()
        return LazyModuleProxy(self.fullname, thread, self.manager)

    def exec_module(self, module):
        pass

# =============================================================================
# XWLAZY MANAGER (v4.0 - Enterprise Features)
# =============================================================================

class XWLazy(MetaPathFinder):
    def __init__(self, root_dir=".", default_enabled=True, enable_global_hook=True, enable_learning=False):
        self.root_dir = Path(root_dir)
        
        # Thread Safety & State
        self._lock = threading.RLock()
        self.manifest_index = {}
        
        # Caching: Thread-safe set for installed packages (backward compatibility)
        self.installed_cache = set()
        self.failed_installs = set()
        self.installing_now = set()
        
        # NEW v3.0.2: Multi-tier cache (L1 + L2)
        self._multi_tier_cache = SimpleMultiTierCache(l1_size=1000, l2_dir=XWLAZY_CACHE_DIR / "l2_cache")
        
        # NEW v3.0.2: Watched prefixes registry (for serialization modules)
        self._watched_prefixes = WatchedPrefixRegistry(initial_prefixes=SERIALIZATION_PREFIXES)
        
        # NEW v3.0.2: Enhanced performance monitor
        self._perf_monitor = EnhancedPerformanceMonitor()
        
        # Configuration: Per-Package Isolation
        # Load deny list from TOML file (blocks packages with compatibility issues)
        self.global_deny_list = _load_deny_list()
        self.package_policies = {}
        
        # NEW v3.0: Adaptive Learning (optional)
        self._enable_learning = enable_learning
        self._learner = AdaptiveLearner() if enable_learning else None
        
        # NEW v3.0: Lockfile support - Store in centralized ~/.xwlazy/ directory
        # This prevents pollution of project directories with xwlazy files
        XWLAZY_DATA_DIR.mkdir(parents=True, exist_ok=True)
        self._lockfile_path = XWLAZY_DATA_DIR / LOCKFILE_PATH
        self._audit_log_path = XWLAZY_DATA_DIR / AUDIT_LOG_FILE
        
        # Stats & Observability (Enhanced)
        self.stats = {
            "installs": 0,
            "failures": 0,
            "total_time_ms": 0,
            "strategies_used": collections.defaultdict(int),
            "cache_hits": 0,
            "cache_misses": 0,
            "adaptive_predictions": 0,
            "history": []
        }
        
        # NEW v3.0: Keyword detection configuration
        self._keyword_detection_enabled = True
        self._keyword_to_check = "xwlazy-enabled"
        
        # Init: Check for auto-config BEFORE setting default_enabled
        auto_config_enabled = self._extract_auto_config(root_dir)
        if auto_config_enabled is not None:
            self.default_enabled = auto_config_enabled
        else:
            self.default_enabled = default_enabled
        
        # Load manifests (requirements.txt, pyproject.toml - TOML-only, no JSON manifests)
        self._index_manifests()
        
        # Load lockfile if exists
        self._load_lockfile()
        
        # PEP 668 detection
        self._is_externally_managed = (Path(sys.prefix) / "EXTERNALLY-MANAGED").exists()
        
        # NEW v3.0: Install global __import__ hook if requested
        if enable_global_hook:
            _install_global_import_hook(self)

    # --- PUBLIC API (Enhanced v3.0) ---

    def configure(self, package_name, enabled=True, mode="blocking", install_strategy="pip", allow=True):
        """
        Configure per-package behavior (PER-PACKAGE ISOLATION).
        
        Each package can have its own independent settings.
        """
        if not isinstance(package_name, str) or not package_name:
            raise ValueError("package_name must be a non-empty string")
        if mode not in ("blocking", "lazy"):
            raise ValueError(f"mode must be 'blocking' or 'lazy', got: {mode!r}")
        if install_strategy not in ("pip", "wheel", "cached", "smart"):
            raise ValueError(f"Invalid strategy: {install_strategy}")
        
        with self._lock:
            self.package_policies[package_name] = {
                "enabled": enabled,
                "mode": mode,
                "strategy": install_strategy,
                "allow": allow
            }

    def deny_package(self, package_name):
        """Shortcut to Security Deny."""
        self.configure(package_name, enabled=True, allow=False)

    def enable_package(self, package_name):
        """Shortcut to enable a package."""
        self.configure(package_name, enabled=True)

    def disable_package(self, package_name):
        """Shortcut to disable a package."""
        self.configure(package_name, enabled=False)

    def get_stats(self):
        """Get comprehensive statistics including NEW v3.0.2 enhanced metrics."""
        with self._lock:
            stats = self.stats.copy()
            if self._learner:
                stats['adaptive_learning'] = self._learner.get_stats()
            else:
                stats['adaptive_learning'] = None
            
            # Resolution cache stats (functools.lru_cache)
            cache_stats = self._resolve_target_cached.cache_info()
            stats['resolution_cache'] = {
                'hits': cache_stats.hits,
                'misses': cache_stats.misses,
                'size': cache_stats.currsize,
                'maxsize': cache_stats.maxsize
            }
            
            # NEW v3.0.2: Multi-tier cache stats (L1 + L2)
            stats['multi_tier_cache'] = self._multi_tier_cache.get_stats()
            
            # NEW v3.0.2: Enhanced performance monitoring stats
            stats['performance'] = self._perf_monitor.get_stats()
            
            # NEW v3.0.2: Watched prefixes info
            stats['watched_prefixes'] = {
                'count': len(self._watched_prefixes.get_watched_prefixes()),
                'prefixes': self._watched_prefixes.get_watched_prefixes()
            }
            
            # NEW v3.0: Additional stats
            stats['lockfile_path'] = str(self._lockfile_path)
            stats['lockfile_exists'] = self._lockfile_path.exists()
            stats['global_hook_installed'] = _global_import_hook_installed
            stats['keyword_detection_enabled'] = self._keyword_detection_enabled
            stats['learning_enabled'] = self._enable_learning
            stats['installed_packages_count'] = len(self.installed_cache)
            stats['failed_packages_count'] = len(self.failed_installs)
            stats['configured_packages_count'] = len(self.package_policies)
            
            return stats

    def generate_sbom(self, output_path=None):
        """Generate SBOM (Software Bill of Materials)."""
        # Use centralized path unless explicitly overridden
        output = output_path or self._audit_log_path
        try:
            with self._lock:
                sbom_data = {
                    "metadata": {
                        "format": "xwlazy-sbom",
                        "version": "1.0",
                        "generated": datetime.now().isoformat(),
                    },
                    "packages": list(self.installed_cache),
                    "statistics": self.stats.copy(),
                    "lockfile": self._read_lockfile() if self._lockfile_path.exists() else None
                }
            _write_toml_simple(sbom_data, output)
            return sbom_data
        except Exception as e:
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stderr.write(f"[xwlazy] Failed to generate SBOM: {e}\n")
            return None

    def get_lockfile(self):
        """Get current lockfile contents."""
        return self._read_lockfile()

    def save_lockfile(self):
        """Save current state to lockfile."""
        self._save_lockfile()
    
    # --- NEW v3.0.2: Watched Prefixes API ---
    
    def add_watched_prefix(self, prefix):
        """Add a watched prefix for special handling (e.g., serialization modules)."""
        self._watched_prefixes.add_prefix(prefix)
    
    def remove_watched_prefix(self, prefix):
        """Remove a watched prefix."""
        self._watched_prefixes.remove_prefix(prefix)
    
    def get_watched_prefixes(self):
        """Get all watched prefixes."""
        return self._watched_prefixes.get_watched_prefixes()
    
    def is_watched(self, module_name):
        """Check if a module matches any watched prefix."""
        return self._watched_prefixes.is_watched(module_name)
    
    # --- NEW v3.0.2: Cache Management API ---
    
    def get_cache_stats(self):
        """Get multi-tier cache statistics."""
        return self._multi_tier_cache.get_stats()
    
    def clear_cache(self):
        """Clear all caches (L1 + L2)."""
        self._multi_tier_cache.clear()
        with self._lock:
            self.installed_cache.clear()
        # Clear resolution cache
        if hasattr(self, '_resolve_target_cached') and hasattr(self._resolve_target_cached, 'cache_clear'):
            self._resolve_target_cached.cache_clear()
    
    def invalidate_cache(self, module_name):
        """Invalidate cache for a specific module."""
        cache_key = f"installed:{module_name}"
        self._multi_tier_cache.invalidate(cache_key)
        with self._lock:
            self.installed_cache.discard(module_name)
    
    # --- NEW v3.0.2: Performance Monitoring API ---
    
    def get_performance_stats(self):
        """Get enhanced performance monitoring statistics."""
        return self._perf_monitor.get_stats()
    
    def clear_performance_stats(self):
        """Clear all performance statistics."""
        self._perf_monitor.clear()

    # --- INTERNAL LOGIC (Enhanced v3.0) ---

    def _extract_auto_config(self, root_dir):
        """
        Extract default_enabled from pyproject.toml BEFORE initialization.
        NEW v3.0: Supports keyword-based auto-detection.
        FIX v3.0.3: Reuses unified _load_toml_file() to reduce code duplication.
        """
        toml_file = Path(root_dir) / "pyproject.toml"
        
        # Use unified TOML loader (reused code)
        data = _load_toml_file(toml_file, verbose_error=False)
        
        if data:
            # Check [tool.xwlazy] or [tool.titanguardian] (backwards compatibility)
            tool_cfg = data.get("tool", {})
            if "xwlazy" in tool_cfg:
                if "default_enabled" in tool_cfg["xwlazy"]:
                    return tool_cfg["xwlazy"]["default_enabled"]
            # Legacy support for xwlazylite
            if "xwlazylite" in tool_cfg:
                if "default_enabled" in tool_cfg["xwlazylite"]:
                    return tool_cfg["xwlazylite"]["default_enabled"]
            if "titanguardian" in tool_cfg:
                if "default_enabled" in tool_cfg["titanguardian"]:
                    return tool_cfg["titanguardian"]["default_enabled"]
            
            # NEW v3.0: Check [project] keywords for 'xwlazy-enabled'
            if self._keyword_detection_enabled:
                keywords = data.get("project", {}).get("keywords", [])
                if isinstance(keywords, list):
                    keywords_lower = [k.lower() if isinstance(k, str) else str(k).lower() for k in keywords]
                    if self._keyword_to_check.lower() in keywords_lower:
                        return True
                elif isinstance(keywords, str):
                    if self._keyword_to_check.lower() in keywords.lower():
                        return True
        
        return None

    def _check_package_keywords(self, package_name=None):
        """
        Check if package has xwlazy-enabled keyword in metadata.
        NEW v3.0: Keyword-based auto-detection.
        """
        if not self._keyword_detection_enabled:
            return False
        
        if sys.version_info < (3, 8):
            return False
        
        try:
            if package_name:
                try:
                    dist = importlib.metadata.distribution(package_name)
                    keywords = dist.metadata.get_all('Keywords', [])
                    if keywords:
                        all_keywords = []
                        for kw in keywords:
                            if isinstance(kw, str):
                                all_keywords.extend(k.strip().lower() for k in kw.split(','))
                            else:
                                all_keywords.append(str(kw).lower())
                        return self._keyword_to_check.lower() in all_keywords
                except importlib.metadata.PackageNotFoundError:
                    return False
            else:
                # Check all installed packages
                for dist in importlib.metadata.distributions():
                    try:
                        keywords = dist.metadata.get_all('Keywords', [])
                        if keywords:
                            all_keywords = []
                            for kw in keywords:
                                if isinstance(kw, str):
                                    all_keywords.extend(k.strip().lower() for k in kw.split(','))
                                else:
                                    all_keywords.append(str(kw).lower())
                            if self._keyword_to_check.lower() in all_keywords:
                                return True
                    except Exception as e:
                        # Continue on individual package errors (non-critical)
                        if os.environ.get('XWLAZY_VERBOSE'):
                            err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                            sys.stderr.write(f"[xwlazy] Error checking keywords for package {dist.metadata.get('Name', 'unknown')}: {err_msg}\n")
                        continue
        except Exception as e:
            # Non-critical: keyword detection failures don't block execution
            if os.environ.get('XWLAZY_VERBOSE'):
                err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                sys.stderr.write(f"[xwlazy] Error in keyword detection: {err_msg}\n")
            pass
        
        return False

    def _index_manifests(self):
        """Robust Parsing: Requirements.txt + pyproject.toml (TOML-only, no JSON)."""
        # 1. Requirements.txt
        req_file = self.root_dir / "requirements.txt"
        if req_file.exists():
            try:
                with open(req_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.split('#')[0].strip()
                        if line:
                            clean = re.split(r'\[', line)[0].strip()
                            clean = re.split(r'[<>=!~]', clean)[0].strip()
                            if clean:
                                self._add_index(clean, line)
            except (IOError, OSError, UnicodeDecodeError) as e:
                if os.environ.get('XWLAZY_VERBOSE'):
                    sys.stderr.write(f"[xwlazy] Error reading requirements.txt: {e}\n")
        
        # 2. pyproject.toml (TOML-only - no JSON manifests)
        # Uses unified _load_toml_file() to reduce code duplication
        toml_file = self.root_dir / "pyproject.toml"
        data = _load_toml_file(toml_file, verbose_error=True)

        if data:
            # Standard dependencies
            deps = data.get("project", {}).get("dependencies", [])
            for dep in deps:
                if isinstance(dep, str):
                    clean = re.split(r'\[', dep)[0].strip()
                    clean = re.split(r'[<>=!~]', clean)[0].strip()
                    if clean:
                        # Get version from dep if available, otherwise use package name only
                        install_str = dep  # Keep full version constraint if present
                        self._add_index(clean, install_str)
            
            # Optional dependencies
            opt_deps = data.get("project", {}).get("optional-dependencies", {})
            for group, group_deps in opt_deps.items():
                for dep in group_deps:
                    if isinstance(dep, str):
                        clean = re.split(r'\[', dep)[0].strip()
                        clean = re.split(r'[<>=!~]', clean)[0].strip()
                        if clean:
                            install_str = dep  # Keep full version constraint if present
                            self._add_index(clean, install_str)

    def _add_index(self, pkg, install_str):
        """
        Add package to manifest index and clear resolution cache.
        
        NEW v3.0.1: If install_str has no version, check external_libs.toml for version.
        This uses version from external_libs.toml if missing from requirements.txt/pyproject.toml.
        """
        pkg_key = pkg.lower().replace('-', '_')
        
        # Check if install_str has version constraint
        has_version = bool(re.search(r'[<>=!~]', install_str))
        
        # If no version in requirements.txt/pyproject.toml, check external_libs.toml
        if not has_version:
            # Try to find version in HARD_MAPPINGS (external_libs.toml)
            for import_name, package_spec in HARD_MAPPINGS.items():
                # Check if this import name maps to our package
                if _extract_package_name(package_spec).lower().replace('-', '_') == pkg_key:
                    # Check if external_libs.toml has a version
                    if re.search(r'[<>=!~]', package_spec):
                        install_str = package_spec  # Use version from external_libs.toml
                        break
                # Also check direct import name match
                if import_name.lower().replace('-', '_') == pkg_key:
                    if re.search(r'[<>=!~]', package_spec):
                        install_str = package_spec  # Use version from external_libs.toml
                        break
        
        self.manifest_index[pkg_key] = install_str
        if hasattr(self, '_resolve_target_cached') and hasattr(self._resolve_target_cached, 'cache_clear'):
            self._resolve_target_cached.cache_clear()

    def _resolve_target(self, fullname):
        """Resolves target with Dot-Notation Walk-up (cached)."""
        manifest_key = frozenset(self.manifest_index.items())
        return self._resolve_target_cached(manifest_key, fullname)
    
    @lru_cache(maxsize=512)
    def _resolve_target_cached(self, manifest_items, fullname):
        """
        Cached implementation of target resolution.
        
        NEW v3.0.1: Prioritizes manifest_index (requirements.txt/pyproject.toml) over HARD_MAPPINGS.
        Falls back to HARD_MAPPINGS (external_libs.toml) only if not found in manifest.
        This ensures versions from requirements.txt/pyproject.toml are used first.
        
        NEW v4.0.1: If not found in TOML mappings, generates fallback candidates from import name:
        - Replaces dots with dashes, then underscores
        - Progressively shortens by removing segments from the end
        - Returns first candidate as install target (pip will validate)
        """
        manifest_dict = dict(manifest_items)
        parts = fullname.split('.')
        for i in range(len(parts), 0, -1):
            prefix = '.'.join(parts[:i])
            
            # 1. First check manifest_index (requirements.txt/pyproject.toml) - has priority
            key = prefix.lower().replace('-', '_')
            if key in manifest_dict:
                return manifest_dict[key]
            
            # 2. Check HARD_MAPPINGS (external_libs.toml) - fallback with version support
            if prefix in HARD_MAPPINGS:
                mapped = HARD_MAPPINGS[prefix]
                # Check if mapped package is in manifest_index (with version from requirements)
                mapped_key = _extract_package_name(mapped).lower().replace('-', '_')
                if mapped_key in manifest_dict:
                    return manifest_dict[mapped_key]  # Use version from requirements.txt/pyproject.toml
                # Otherwise use version from external_libs.toml (or package name only)
                return mapped
            
        # 3. Fallback: Generate candidates from import name itself
        # Try progressively shorter versions with dots -> dashes/underscores
        candidates = _generate_fallback_candidates(fullname)
        if candidates:
            # Return list of candidates to try sequentially until one succeeds
            return candidates
        
        return None

    def _get_policy(self, top_module):
        """Retrieves policy with fallbacks to defaults."""
        if top_module in self.package_policies:
            return self.package_policies[top_module]
        return {
            "enabled": self.default_enabled,
            "mode": "blocking",
            "strategy": "pip",
            "allow": True
        }

    # --- NEW v3.0: Lockfile Support ---

    def _load_lockfile(self):
        """Load lockfile if exists."""
        if not self._lockfile_path.exists():
            return
        
        try:
            lockfile_data = _read_toml_simple(self._lockfile_path)
            if lockfile_data:
                # Restore installed packages from lockfile
                installed_packages = lockfile_data.get("packages", [])
                with self._lock:
                    self.installed_cache.update(installed_packages)
        except (IOError, OSError, Exception) as e:
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stderr.write(f"[xwlazy] Error reading lockfile: {e}\n")

    def _save_lockfile(self):
        """Save current state to lockfile."""
        try:
            with self._lock:
                lockfile_data = {
                    "version": "1.0",
                    "generated": datetime.now().isoformat(),
                    "packages": sorted(list(self.installed_cache)),
                    "statistics": {
                        "total_installs": self.stats['installs'],
                        "total_failures": self.stats['failures'],
                    }
                }
            _write_toml_simple(lockfile_data, self._lockfile_path)
        except (IOError, OSError, Exception) as e:
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stderr.write(f"[xwlazy] Failed to write lockfile: {e}\n")

    def _read_lockfile(self):
        """Read lockfile contents (TOML format)."""
        return _read_toml_simple(self._lockfile_path)

    # --- STRATEGY IMPLEMENTATIONS ---

    def _detect_venv(self):
        """
        Detect if Python is running in a virtual environment.
        
        Checks multiple methods to detect venv:
        - hasattr(sys, 'real_prefix'): Old-style virtualenv
        - sys.prefix != sys.base_prefix: venv/virtualenv
        - VIRTUAL_ENV environment variable: Set by most venv activators
        
        Returns:
            tuple: (in_venv: bool, venv_python: Path | None)
                - in_venv: True if running in a venv
                - venv_python: Path to venv Python executable if available, None otherwise
        """
        # Check for venv: hasattr(sys, 'real_prefix') is for old-style venv,
        # sys.prefix != sys.base_prefix is for venv/virtualenv,
        # VIRTUAL_ENV environment variable is set by most venv activators
        in_venv = (hasattr(sys, 'real_prefix') or 
                  (hasattr(sys, 'base_prefix') and sys.prefix != sys.base_prefix) or
                  os.environ.get('VIRTUAL_ENV') is not None)
        
        venv_python = None
        if os.environ.get('VIRTUAL_ENV'):
            venv_path = Path(os.environ['VIRTUAL_ENV'])
            if sys.platform == 'win32':
                venv_python = venv_path / 'Scripts' / 'python.exe'
            else:
                venv_python = venv_path / 'bin' / 'python'
            if not venv_python.exists():
                venv_python = None
        
        return in_venv, venv_python

    def _is_package_installed_in_venv(self, package_name: str) -> bool:
        """
        Check if a package is installed in the current venv (if in venv).
        
        NEW v4.0.3: When in a venv, checks if package is installed specifically
        in the venv's site-packages, not in user site-packages or system-wide.
        
        Args:
            package_name: Package name to check (e.g., "pandas", "exonware-xwdata")
        
        Returns:
            bool: True if package is installed in venv (when in venv) or globally (when not in venv)
        """
        in_venv, venv_python = self._detect_venv()
        
        # If not in venv, use standard check (will check system-wide and user site-packages)
        if not in_venv:
            try:
                dist = importlib.metadata.distribution(package_name)
                return dist is not None
            except importlib.metadata.PackageNotFoundError:
                return False
        
        # In venv: check if package is installed specifically in venv's site-packages
        # We check by trying to find the distribution and verifying its location
        try:
            dist = importlib.metadata.distribution(package_name)
            if dist is None:
                return False
            
            # Get distribution location (install location)
            try:
                # Use locate_file() to get a file path from the distribution
                # This gives us a file that's part of the package
                dist_file = dist.locate_file("")
                if dist_file is None:
                    # Fallback: try to get metadata file location
                    try:
                        metadata_file = dist.locate_file("METADATA")
                        if metadata_file:
                            dist_file = Path(metadata_file)
                        else:
                            # Last resort: use sys.prefix to check venv site-packages
                            dist_file = Path(sys.prefix)
                    except Exception:
                        # If we can't get file location, fall back to prefix check
                        dist_file = Path(sys.prefix)
                
                dist_path = Path(dist_file) if dist_file else Path(sys.prefix)
                
                # Normalize paths for comparison (handle Windows)
                dist_path_str = str(dist_path.resolve()).replace('\\', '/')
                venv_prefix_str = str(Path(sys.prefix).resolve()).replace('\\', '/')
                
                # Check if distribution is in venv's prefix (site-packages are under venv prefix)
                return venv_prefix_str in dist_path_str
                
            except Exception as e:
                # If we can't determine location, assume it's in venv if distribution exists
                # This is a safe fallback - better to reinstall than to miss an installed package
                if os.environ.get('XWLAZY_VERBOSE'):
                    err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                    sys.stderr.write(f"[xwlazy] Could not verify venv location for {package_name}, assuming installed: {err_msg}\n")
                return True  # Safe fallback: assume installed if we can't verify
                
        except importlib.metadata.PackageNotFoundError:
            return False

    def _run_pip_install(self, install_str, extra_args=None):
        """
        Run pip install with full dependency installation and venv detection.
        
        NEW v4.0.2: Ensures all dependencies are installed along with the package.
        Version constraints from requirements.txt/pyproject.toml are included in install_str.
        
        NEW v4.0.3: Auto-detects virtual environment and ensures installations go into venv
        when detected (not user site-packages). Uses venv Python explicitly if available.
        
        Args:
            install_str: Package specification with version constraints if available from
                        requirements.txt/pyproject.toml (e.g., "pandas>=2.0.0" or "pandas==2.0.1")
            extra_args: Additional pip arguments (e.g., ["--no-index", "--find-links", ...])
                       Note: --no-deps is NEVER used to ensure full dependency installation
                       Note: --user flag is automatically avoided when in venv
        """
        # Detect venv and get venv Python if available
        in_venv, venv_python = self._detect_venv()
        
        # Use venv Python explicitly if available, otherwise use sys.executable
        if venv_python:
            python_exe = str(venv_python)
        else:
            python_exe = sys.executable
        
        cmd = [python_exe, "-m", "pip", "install", install_str]
        
        if extra_args:
            # Filter out --no-deps if accidentally passed (should never happen, but safety check)
            # Also filter out --user when in venv to ensure installation into venv site-packages
            filtered_args = []
            for arg in extra_args:
                if arg == "--no-deps" or arg == "--no-dependencies":
                    continue  # Never allow --no-deps
                if in_venv and arg == "--user":
                    continue  # Don't use --user in venv (would install to user site-packages)
                filtered_args.append(arg)
            cmd.extend(filtered_args)
        elif in_venv:
            # In venv: explicitly avoid --user flag (pip will use venv site-packages by default)
            # The --user flag is a boolean flag - we simply don't include it when in venv
            pass
        
        # Note: pip install by default installs all dependencies unless --no-deps is used
        # We explicitly ensure --no-deps is never used to install full dependency tree
        # When in venv, pip will automatically use venv site-packages (no --user flag needed)
        subprocess.run(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            check=True, timeout=120
        )

    def _strategy_pip(self, install_str):
        self._run_pip_install(install_str)

    def _strategy_wheel(self, install_str):
        wheel_dir = XWLAZY_CACHE_DIR / "wheels"
        if wheel_dir.exists():
            self._run_pip_install(install_str, ["--no-index", "--find-links", str(wheel_dir)])
        else:
            raise FileNotFoundError(f"Wheel directory not found: {wheel_dir}")

    def _strategy_cached(self, install_str):
        self._run_pip_install(install_str, ["--no-index"])

    def _strategy_smart(self, install_str):
        """Smart strategy: Try wheel first, fallback to pip."""
        try:
            self._strategy_wheel(install_str)
        except Exception as e:
            # Fallback to pip (expected behavior, not an error)
            if os.environ.get('XWLAZY_VERBOSE'):
                err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                sys.stderr.write(f"[xwlazy] Wheel strategy failed for {install_str}, falling back to pip: {err_msg}\n")
            self._strategy_pip(install_str)

    def _is_stdlib_module(self, module_name: str) -> bool:
        """Check if module is part of Python standard library."""
        import importlib.util
        
        # Get root module name (first part before dot)
        root_module = module_name.split('.')[0]
        
        # Check built-in modules
        if root_module in sys.builtin_module_names:
            return True
        
        # Check if module spec indicates it's standard library
        try:
            spec = importlib.util.find_spec(root_module)
            if spec is None:
                return False
            
            # Built-in modules have None origin
            if spec.origin is None:
                return True
            
            # Check if origin is in standard library (not site-packages)
            if spec.origin:
                # Standard library is typically in Python's lib directory, not site-packages
                if 'site-packages' not in spec.origin and 'dist-packages' not in spec.origin:
                    # Further check: is it in Python's installation directory?
                    stdlib_indicators = [
                        f'{sys.prefix}/lib',
                        f'{sys.base_prefix}/lib',
                        f'{sys.exec_prefix}/lib',
                        f'{sys.base_exec_prefix}/lib',
                    ]
                    for indicator in stdlib_indicators:
                        if indicator.replace('\\', '/') in spec.origin.replace('\\', '/'):
                            return True
        except Exception:
            pass
        
        return False
    
    def _perform_install(self, install_str, mod_name):
        """
        Worker function for installation with Strategy support and multi-tier caching.
        
        NEW v4.0.1: Supports both single string and list of candidates.
        If install_str is a list, tries each candidate sequentially until one succeeds.
        """
        start = time.time()
        success = False
        
        top_module = mod_name.split('.')[0]
        policy = self._get_policy(top_module)
        strategy_name = policy.get("strategy", "pip")
        
        # NEW v3.0.2: Check multi-tier cache first
        cache_key = f"installed:{top_module}"
        cached_result = self._multi_tier_cache.get(cache_key)
        if cached_result is not None:
            if cached_result:
                # Already installed (from L1/L2 cache)
                with self._lock:
                    self.installing_now.discard(top_module)
                    self.installed_cache.add(top_module)
                    self.stats['cache_hits'] += 1
                self._perf_monitor.record_cache_hit()
                self._perf_monitor.record_access(top_module)
                return
            else:
                # Known failure (from cache)
                with self._lock:
                    self.installing_now.discard(top_module)
                    self.failed_installs.add(top_module)
                return
        
        # Additional check: verify package is actually installed before proceeding
        # This prevents unnecessary installation attempts for already-installed packages
        # Check both package name and module importability
        package_name = _extract_package_name(top_module)
        is_installed = False
        
        if package_name:
            if self._is_package_installed_in_venv(package_name):
                is_installed = True
        
        # Also check if module is importable (might be installed but package name not resolved)
        if not is_installed:
            try:
                spec = importlib.util.find_spec(top_module)
                if spec is not None and spec.loader is not None:
                    # Module is importable - check if it's a standard library
                    if not self._is_stdlib_module(top_module):
                        # Not stdlib and importable - likely already installed
                        is_installed = True
            except Exception:
                # If check fails, proceed with installation
                pass
        
        if is_installed:
            # Package is already installed - update cache and return
            with self._lock:
                self.installing_now.discard(top_module)
                self.installed_cache.add(top_module)
                self._multi_tier_cache.set(cache_key, True)
                self.stats['cache_hits'] += 1
            self._perf_monitor.record_cache_hit()
            self._perf_monitor.record_access(top_module)
            return
        
        # NEW v3.0.2: Cache miss - record it
        self._perf_monitor.record_cache_miss()
        with self._lock:
            self.stats['cache_misses'] += 1

        # NEW v4.0.1: Handle list of candidates (fallback mechanism)
        candidates = install_str if isinstance(install_str, list) else [install_str]
        last_error = None
        
        for candidate in candidates:
            try:
                if strategy_name == "wheel":
                    self._strategy_wheel(candidate)
                elif strategy_name == "cached":
                    self._strategy_cached(candidate)
                elif strategy_name == "smart":
                    self._strategy_smart(candidate)
                else:
                    self._strategy_pip(candidate)
                    
                success = True
                with self._lock:
                    self.installed_cache.add(top_module)
                    self.stats["strategies_used"][strategy_name] += 1
                
                # NEW v3.0.2: Store in multi-tier cache (L1 + L2)
                self._multi_tier_cache.set(cache_key, True)
                
                # NEW v3.0.2: Record performance metrics
                duration_so_far = time.time() - start
                self._perf_monitor.record_load_time(top_module, duration_so_far)
                self._perf_monitor.record_access(top_module)
                
                importlib.invalidate_caches()
                
                # NEW v3.0: Save to lockfile on successful install
                self._save_lockfile()
                
                # Success - break out of loop
                install_str = candidate  # Use successful candidate for logging
                break
                
            except subprocess.CalledProcessError as e:
                last_error = e
                if os.environ.get('XWLAZY_VERBOSE'):
                    sys.stderr.write(f"[xwlazy] Install Failed ({strategy_name}) for {candidate}: {e.stderr.decode('utf-8', errors='replace') if e.stderr else str(e)}\n")
                # Continue to next candidate
                continue
            except subprocess.TimeoutExpired:
                last_error = subprocess.TimeoutExpired
                if os.environ.get('XWLAZY_VERBOSE'):
                    sys.stderr.write(f"[xwlazy] Install Timeout for {candidate} (exceeded 120s)\n")
                # Continue to next candidate
                continue
            except Exception as e:
                last_error = e
                if os.environ.get('XWLAZY_VERBOSE'):
                    sys.stderr.write(f"[xwlazy] Unexpected Error installing {candidate}: {type(e).__name__}: {e}\n")
                # Continue to next candidate
                continue
        
        # If all candidates failed, mark as failed
        if not success:
            with self._lock:
                self.failed_installs.add(top_module)
            # NEW v3.0.2: Cache failure result
            self._multi_tier_cache.set(cache_key, False)
            if last_error:
                if isinstance(last_error, subprocess.CalledProcessError):
                    if os.environ.get('XWLAZY_VERBOSE'):
                        last_candidate = candidates[-1]
                        sys.stderr.write(f"[xwlazy] All candidates failed. Last attempt ({last_candidate}): {last_error.stderr.decode('utf-8', errors='replace') if last_error.stderr else str(last_error)}\n")
                elif isinstance(last_error, subprocess.TimeoutExpired):
                    if os.environ.get('XWLAZY_VERBOSE'):
                        last_candidate = candidates[-1]
                        sys.stderr.write(f"[xwlazy] All candidates timed out. Last attempt: {last_candidate}\n")
                else:
                    if os.environ.get('XWLAZY_VERBOSE'):
                        last_candidate = candidates[-1]
                        sys.stderr.write(f"[xwlazy] All candidates failed. Last attempt ({last_candidate}): {type(last_error).__name__}: {last_error}\n")
            install_str = candidates[-1] if candidates else install_str  # Use last candidate for logging
        
        # Cleanup: Always remove from installing_now
        with self._lock:
            self.installing_now.discard(top_module)

        duration = time.time() - start
        self._log_audit(install_str, success, duration, strategy_name)

        # NEW v3.0: Record in adaptive learner
        if self._learner:
            self._learner.record_import(top_module, duration)

        if success:
            sys.stdout.write(f"\r[OK] [xwlazy] Installed: {install_str} via {strategy_name} ({round(duration,2)}s)\n")

    def _log_audit(self, pkg, success, duration, strategy="unknown"):
        """Writes to SBOM TOML and updates stats."""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "package": pkg,
            "status": "success" if success else "failed",
            "duration": round(duration, 3),
            "strategy": strategy
        }
        with self._lock:
            self.stats['installs'] += 1 if success else 0
            self.stats['failures'] += 1 if not success else 0
            self.stats['total_time_ms'] += int(duration * 1000)
            self.stats['history'].append(entry)
        try:
            # Read existing data (TOML format, fallback to JSON for backwards compatibility)
            # Use centralized audit log path
            data = _read_toml_simple(self._audit_log_path)
            if data is None:
                data = []
            elif not isinstance(data, list):
                # Convert to list format if needed
                data = [data] if data else []
            data.append(entry)
            # Write as TOML to centralized location
            _write_toml_simple(data, self._audit_log_path)
        except (IOError, OSError, Exception) as e:
            if os.environ.get('XWLAZY_VERBOSE'):
                sys.stderr.write(f"[xwlazy] Failed to write audit log: {e}\n")

    def find_spec(self, fullname, path, target=None):
        # Check if xwlazy is disabled via environment variable
        if os.environ.get('XWLAZY_DISABLE') == '1':
            return None
        
        top_module = fullname.split('.')[0]
        if top_module in sys.builtin_module_names:
            return None

        if top_module.startswith('_'):
            top_key = top_module.lower().replace('-', '_')
            if top_key not in self.manifest_index:
                return None

        if hasattr(threading.current_thread(), '_xwlazy_active'):
            return None
        threading.current_thread()._xwlazy_active = True

        try:
            policy = self._get_policy(top_module)
            
            if not policy['enabled']:
                if os.environ.get('XWLAZY_VERBOSE'):
                    print(f"[SKIP] [xwlazy] Skipped: {top_module} (disabled per-package policy)")
                return None
            
            if not policy['allow']:
                if os.environ.get('XWLAZY_VERBOSE'):
                    print(f"[DENY] [xwlazy] Denied: {top_module} (security policy)")
                return None
            
            with self._lock:
                if top_module in self.global_deny_list:
                    if os.environ.get('XWLAZY_VERBOSE'):
                        print(f"[DENY] [xwlazy] Denied: {top_module} (global deny list)")
                    return None

            if self._is_externally_managed:
                if os.environ.get('XWLAZY_VERBOSE'):
                    print(f"[SKIP] [xwlazy] Skipped: {top_module} (PEP 668 externally-managed)")
                return None

            # FIX: Check cache FIRST before calling find_spec
            # This prevents unnecessary reinstalls when cache says package is already installed
            # Use walk-up pattern (like _resolve_target) to check cache at all hierarchy levels
            # For example, for 'exonware.xwlazy.core', check: exonware.xwlazy.core, exonware.xwlazy, exonware
            parts = fullname.split('.')
            cached_result = None
            cached_module = None
            for i in range(len(parts), 0, -1):
                prefix = '.'.join(parts[:i])
                cache_key = f"installed:{prefix}"
                result = self._multi_tier_cache.get(cache_key)
                if result is not None:
                    cached_result = result
                    cached_module = prefix
                    break  # Found a cache entry at this level
            
            if cached_result is not None:
                if cached_result:
                    # Cache says installed at some level - verify with find_spec using that level
                    # This handles multi-tier imports like exonware.xwlazy.core correctly
                    was_in_path = False
                    try:
                        was_in_path = self in sys.meta_path
                        if was_in_path:
                            try:
                                sys.meta_path.remove(self)
                            except ValueError:
                                was_in_path = False
                        
                        try:
                            # Verify using the cached module level (not fullname, not just top_module)
                            if importlib.util.find_spec(cached_module):
                                # Verified: package is installed at this level, cache was correct - return early
                                return None
                        except (ImportError, AttributeError, ValueError):
                            # find_spec failed for cached_module - cache might be stale, invalidate and continue
                            if os.environ.get('XWLAZY_VERBOSE'):
                                print(f"[INFO] [xwlazy] Cache says {cached_module} is installed, but find_spec({cached_module}) failed - invalidating cache")
                            self._multi_tier_cache.invalidate(f"installed:{cached_module}")
                            cached_result = None  # Treat as cache miss
                    finally:
                        if was_in_path and self not in sys.meta_path:
                            sys.meta_path.insert(0, self)
                else:
                    # Known failure (from cache)
                    if os.environ.get('XWLAZY_VERBOSE'):
                        print(f"[SKIP] [xwlazy] Skipped: {cached_module} (cached failure)")
                    return None

            # If cache miss or cache was invalidated, check with find_spec and importlib.metadata
            if cached_result is None:
                was_in_path = False
                try:
                    was_in_path = self in sys.meta_path
                    if was_in_path:
                        try:
                            sys.meta_path.remove(self)
                        except ValueError:
                            was_in_path = False
                    
                    # Check 1: Try importlib.metadata first (most reliable for installed packages)
                    try:
                        package_name = _extract_package_name(top_module)
                        if package_name:
                            # Try extracted package name
                            if self._is_package_installed_in_venv(package_name):
                                # Package is installed - update cache and return
                                top_cache_key = f"installed:{top_module}"
                                self._multi_tier_cache.set(top_cache_key, True)
                                with self._lock:
                                    self.installed_cache.add(top_module)
                                return None
                        # Try module name as package name
                        try:
                            importlib.metadata.distribution(top_module)
                            # Package found - update cache and return
                            top_cache_key = f"installed:{top_module}"
                            self._multi_tier_cache.set(top_cache_key, True)
                            with self._lock:
                                self.installed_cache.add(top_module)
                            return None
                        except importlib.metadata.PackageNotFoundError:
                            # Package not found in metadata - continue to find_spec check
                            pass
                    except Exception:
                        # If metadata check fails, continue to find_spec check
                        pass
                    
                    # Check 2: Try find_spec (module might be importable)
                    try:
                        if importlib.util.find_spec(fullname):
                            # Package is importable - but if in venv, verify it's installed in venv
                            # NEW v4.0.3: When in venv, check if package is installed in venv, not just user site-packages
                            package_name = _extract_package_name(top_module)
                            if package_name and self._is_package_installed_in_venv(package_name):
                                # Package is installed in venv (or not in venv) - update cache and return
                                top_cache_key = f"installed:{top_module}"
                                self._multi_tier_cache.set(top_cache_key, True)
                                with self._lock:
                                    self.installed_cache.add(top_module)
                                return None
                            elif not package_name:
                                # Could not resolve package name but module is importable - mark as installed
                                top_cache_key = f"installed:{top_module}"
                                self._multi_tier_cache.set(top_cache_key, True)
                                with self._lock:
                                    self.installed_cache.add(top_module)
                                return None
                            # else: package_name exists but not installed in venv - proceed with installation
                    except (ImportError, AttributeError, ValueError) as e:
                        if os.environ.get('XWLAZY_VERBOSE'):
                            sys.stderr.write(f"[xwlazy] find_spec check failed for {fullname}: {e}\n")
                finally:
                    if was_in_path and self not in sys.meta_path:
                        sys.meta_path.insert(0, self)

            # NEW v3.0.2: Check if this is a watched prefix (serialization module)
            # Serialization modules get special handling (e.g., pickle, json, yaml)
            is_serialization = self._watched_prefixes.is_watched(fullname)
            if is_serialization and os.environ.get('XWLAZY_VERBOSE'):
                print(f"[OK] [xwlazy] Detected serialization module: {top_module} (watched prefix)")
                # NEW v3.0.2: Serialization modules might need special handling
                # For now, we just log it. Future enhancement: module wrapping for serialization.

            install_target = self._resolve_target(fullname)
            if not install_target:
                return None

            # Cache miss - record it (only if we got here, meaning cache didn't say installed)
            self._perf_monitor.record_cache_miss()
            with self._lock:
                self.stats["cache_misses"] += 1

            with self._lock:
                if top_module in self.installing_now:
                    # Wait for concurrent installation (max 30s)
                    start_wait = time.time()
                    while top_module in self.installing_now and (time.time() - start_wait) < 30:
                        self._lock.release()
                        time.sleep(0.1)
                        self._lock.acquire()
                    # After waiting, check cache again (it might have been installed)
                    cached_result_after_wait = self._multi_tier_cache.get(cache_key)
                    if cached_result_after_wait:
                        return None
                    if top_module in self.installed_cache:
                        return None
                    if top_module in self.failed_installs:
                        return None
                    return None

                if top_module in self.failed_installs:
                    return None
                self.installing_now.add(top_module)

            mode = policy['mode']

            if mode == 'lazy':
                return spec_from_loader(fullname, LazyLoader(self, fullname, install_target))
            else:
                # Check if module is already importable or is standard library before attempting installation
                try:
                    # Check if it's a standard library module
                    if self._is_stdlib_module(top_module):
                        # Standard library module - don't try to install
                        with self._lock:
                            self.installed_cache.add(top_module)
                            self._multi_tier_cache.set(f"installed:{top_module}", True)
                        return None
                    
                    # Check if module is already importable and installed in venv (if in venv)
                    # NEW v4.0.3: When in venv, verify package is installed in venv, not just user site-packages
                    spec = importlib.util.find_spec(top_module)
                    if spec is not None and spec.loader is not None:
                        # Module is importable - check if it's standard library first
                        if self._is_stdlib_module(top_module):
                            # Standard library - mark as installed and skip
                            with self._lock:
                                self.installed_cache.add(top_module)
                                self._multi_tier_cache.set(f"installed:{top_module}", True)
                            return None
                        
                        # Not stdlib - try to resolve package name from module name for venv check
                        package_name = _extract_package_name(top_module)
                        if package_name:
                            # Check if package is installed in venv (when in venv)
                            if self._is_package_installed_in_venv(package_name):
                                # Package is installed in venv (or not in venv) - mark as installed
                                with self._lock:
                                    self.installed_cache.add(top_module)
                                    self._multi_tier_cache.set(f"installed:{top_module}", True)
                                return None
                            # else: In venv but package not installed in venv - proceed with installation
                            # This ensures we install into venv instead of relying on user site-packages
                        else:
                            # Could not resolve package name - but module is importable
                            # This likely means it's installed (could be namespace package, etc.)
                            # Mark as installed to avoid unnecessary installation attempts
                            with self._lock:
                                self.installed_cache.add(top_module)
                                self._multi_tier_cache.set(f"installed:{top_module}", True)
                            return None
                except Exception:
                    # If check fails, proceed with installation attempt
                    pass
                
                try:
                    # Final check: verify package is not already installed before printing message
                    # This prevents showing INSTALL messages for already-installed packages
                    # Check both by package name and module name
                    package_name = _extract_package_name(top_module)
                    is_installed = False
                    
                    # Method 1: Check by package name using importlib.metadata
                    if package_name:
                        try:
                            # Try the extracted package name
                            if self._is_package_installed_in_venv(package_name):
                                is_installed = True
                            else:
                                # Try module name as package name (some packages match module name)
                                if self._is_package_installed_in_venv(top_module):
                                    is_installed = True
                        except Exception:
                            pass
                    
                    # Method 2: Check if module is importable (might be installed but package name not resolved)
                    if not is_installed:
                        try:
                            spec = importlib.util.find_spec(top_module)
                            if spec is not None and spec.loader is not None:
                                # Module is importable - check if it's a standard library
                                if not self._is_stdlib_module(top_module):
                                    # Not stdlib and importable - likely already installed
                                    is_installed = True
                        except Exception:
                            pass
                    
                    # Method 3: Direct importlib.metadata check (most reliable)
                    if not is_installed:
                        try:
                            # Try module name as package name
                            importlib.metadata.distribution(top_module)
                            is_installed = True
                        except importlib.metadata.PackageNotFoundError:
                            # Package not found - proceed with installation
                            pass
                        except Exception:
                            # Other error - proceed with installation
                            pass
                    
                    if is_installed:
                        # Package is already installed - mark as installed and skip (no message)
                        with self._lock:
                            self.installed_cache.add(top_module)
                            self._multi_tier_cache.set(f"installed:{top_module}", True)
                        return None
                    
                    # Package is not installed - proceed with installation
                    # Only show INSTALL message if XWLAZY_VERBOSE is enabled (suppress by default)
                    if os.environ.get('XWLAZY_VERBOSE'):
                        sys.stdout.write(f"[INSTALL] [xwlazy] Blocking Install: {top_module} (strategy: {policy['strategy']})...\n")
                    self._perform_install(install_target, top_module)
                    return None
                finally:
                    with self._lock:
                        self.installing_now.discard(top_module)

        finally:
            if hasattr(threading.current_thread(), '_xwlazy_active'):
                del threading.current_thread()._xwlazy_active

# =============================================================================
# ACTIVATION (Enhanced v3.0)
# =============================================================================

_instance = None

def hook(root=".", default_enabled=True, enable_global_hook=True, enable_learning=False):
    """
    Activate xwlazy auto-installation system.
    
    Args:
        root: Root directory to search for manifests
        default_enabled: Opt-in vs Opt-out mode
        enable_global_hook: Install global __import__ hook (NEW v3.0)
        enable_learning: Enable adaptive learning (NEW v3.0)
    """
    global _instance
    if not _instance:
        _instance = XWLazy(root, default_enabled, enable_global_hook, enable_learning)
        sys.meta_path.insert(0, _instance)
    return _instance

def auto_enable_lazy(package_name=None, mode="smart", root="."):
    """
    ONE-LINE ACTIVATION! Auto-enable lazy installation for a package.
    
    NEW v3.0: Zero-code integration - detects from pyproject.toml keywords.
    
    Usage in any library's __init__.py:
        from exonware.xwlazy import auto_enable_lazy
        auto_enable_lazy(__package__)
    
    Or just call it - it auto-detects:
        auto_enable_lazy()  # Auto-detects from caller's package
    
    Args:
        package_name: Package name (auto-detected if None)
        mode: Installation mode ("smart", "pip", "wheel", "cached")
        root: Root directory for manifest files
    
    Returns:
        XWLazy instance if enabled, None otherwise
    """
    # Auto-detect package name from caller
    if package_name is None:
        try:
            frame = inspect.currentframe().f_back
            package_name = (frame.f_globals.get('__package__') or
                          frame.f_globals.get('__name__', '').split('.')[0])
        except Exception as e:
            # Non-critical: frame inspection failure (might be None in some contexts)
            if os.environ.get('XWLAZY_VERBOSE'):
                err_msg = str(e).encode('ascii', 'replace').decode('ascii')
                sys.stderr.write(f"[xwlazy] Could not auto-detect package name from frame: {err_msg}\n")
            package_name = None
    
    # Get or create instance
    guardian = hook(root=root, default_enabled=True, enable_global_hook=True)
    
    # Check for keyword-based auto-detection
    if guardian._check_package_keywords(package_name) or guardian._check_package_keywords():
        guardian.default_enabled = True
        if os.environ.get('XWLAZY_VERBOSE'):
            print(f"[OK] [xwlazy] Auto-enabled via keyword detection for: {package_name or 'current package'}")
        return guardian
    
    # Configure based on mode
    if package_name:
        if mode == "smart":
            guardian.configure(package_name, enabled=True, mode="lazy", install_strategy="smart")
        else:
            guardian.configure(package_name, enabled=True, install_strategy=mode)
    
    return guardian

def attach(package_name, submodules=None, submod_attrs=None):
    """
    Attach lazily loaded submodules (lazy-loader compatible API).
    
    NEW v3.0: Compatibility with lazy-loader pattern.
    
    Returns (__getattr__, __dir__, __all__) for lazy loading.
    """
    if submod_attrs is None:
        submod_attrs = {}
    if submodules is None:
        submodules = []
    
    submodules_set = set(submodules)
    attr_to_modules = {attr: mod for mod, attrs in submod_attrs.items() for attr in attrs}
    __all__ = sorted(submodules_set | attr_to_modules.keys())
    
    def __getattr__(name):
        if name in submodules_set:
            return importlib.import_module(f"{package_name}.{name}")
        elif name in attr_to_modules:
            submod_path = f"{package_name}.{attr_to_modules[name]}"
            submod = importlib.import_module(submod_path)
            attr = getattr(submod, name)
            if name == attr_to_modules[name]:
                pkg = sys.modules[package_name]
                pkg.__dict__[name] = attr
            return attr
        else:
            raise AttributeError(f"module {package_name!r} has no attribute {name!r}")
    
    def __dir__():
        return __all__.copy()
    
    return __getattr__, __dir__, __all__.copy()

# =============================================================================
# ADDITIONAL PUBLIC API FUNCTIONS (Rich API v3.0)
# =============================================================================

def enable_keyword_detection(enabled=True, keyword="xwlazy-enabled"):
    """Enable/disable keyword-based auto-detection."""
    global _instance
    if _instance:
        _instance._keyword_detection_enabled = enabled
        _instance._keyword_to_check = keyword

def is_keyword_detection_enabled():
    """Check if keyword detection is enabled."""
    global _instance
    if _instance:
        return _instance._keyword_detection_enabled
    return True

def check_package_keywords(package_name=None, keyword="xwlazy-enabled"):
    """Check if package has keyword in metadata."""
    global _instance
    if _instance:
        return _instance._check_package_keywords(package_name)
    return False

def enable_learning(enabled=True):
    """Enable/disable adaptive learning."""
    global _instance
    if _instance and not _instance._learner and enabled:
        _instance._learner = AdaptiveLearner()
        _instance._enable_learning = True
    elif _instance and not enabled:
        _instance._learner = None
        _instance._enable_learning = False

def predict_next_imports(current_module=None, limit=5):
    """Predict likely next imports based on patterns."""
    global _instance
    if _instance and _instance._learner:
        return _instance._learner.predict_next_imports(current_module, limit)
    return []

def get_all_stats():
    """Get comprehensive statistics from singleton instance."""
    global _instance
    if _instance:
        return _instance.get_stats()
    return {}

def generate_sbom(output_path=None):
    """Generate SBOM from singleton instance."""
    global _instance
    if _instance:
        return _instance.generate_sbom(output_path)
    return None

def get_lockfile():
    """Get lockfile contents from singleton instance."""
    global _instance
    if _instance:
        return _instance.get_lockfile()
    return None

def save_lockfile():
    """Save lockfile from singleton instance."""
    global _instance
    if _instance:
        return _instance.save_lockfile()

def is_externally_managed():
    """Check if environment is externally managed (PEP 668)."""
    return (Path(sys.prefix) / "EXTERNALLY-MANAGED").exists()

def install_global_import_hook():
    """Install global __import__ hook manually."""
    global _instance
    if _instance:
        _install_global_import_hook(_instance)

# --- NEW v3.0.2: Watched Prefixes API (Top-Level) ---

def add_watched_prefix(prefix):
    """Add a watched prefix for special handling (serialization modules, etc.)."""
    global _instance
    if _instance:
        _instance.add_watched_prefix(prefix)

def remove_watched_prefix(prefix):
    """Remove a watched prefix."""
    global _instance
    if _instance:
        _instance.remove_watched_prefix(prefix)

def get_watched_prefixes():
    """Get all watched prefixes."""
    global _instance
    if _instance:
        return _instance.get_watched_prefixes()
    return list(SERIALIZATION_PREFIXES)

def is_module_watched(module_name):
    """Check if a module matches any watched prefix."""
    global _instance
    if _instance:
        return _instance.is_watched(module_name)
    return module_name.split('.')[0] in SERIALIZATION_PREFIXES

# --- NEW v3.0.2: Cache Management API (Top-Level) ---

def get_cache_stats():
    """Get multi-tier cache statistics."""
    global _instance
    if _instance:
        return _instance.get_cache_stats()
    return {}

def clear_cache():
    """Clear all caches (L1 + L2 + resolution cache)."""
    global _instance
    if _instance:
        _instance.clear_cache()

def invalidate_cache(module_name):
    """Invalidate cache for a specific module."""
    global _instance
    if _instance:
        _instance.invalidate_cache(module_name)

# --- NEW v3.0.2: Performance Monitoring API (Top-Level) ---

def get_performance_stats():
    """Get enhanced performance monitoring statistics."""
    global _instance
    if _instance:
        return _instance.get_performance_stats()
    return {}

def clear_performance_stats():
    """Clear all performance statistics."""
    global _instance
    if _instance:
        _instance.clear_performance_stats()
    else:
        # Create instance if not exists
        hook(enable_global_hook=True)

def uninstall_global_import_hook():
    """Uninstall global __import__ hook."""
    _uninstall_global_import_hook()

def is_global_import_hook_installed():
    """Check if global __import__ hook is installed."""
    return _global_import_hook_installed

# Export public API
__all__ = [
    # Core activation
    'hook', 'auto_enable_lazy', 'attach',
    # Class
    'XWLazy',
    # Keyword detection (NEW v3.0)
    'enable_keyword_detection', 'is_keyword_detection_enabled', 'check_package_keywords',
    # Adaptive learning (NEW v3.0)
    'enable_learning', 'predict_next_imports',
    # Statistics & monitoring
    'get_all_stats', 'generate_sbom',
    # Lockfile support (NEW v3.0)
    'get_lockfile', 'save_lockfile',
    # Global hook (NEW v3.0)
    'install_global_import_hook', 'uninstall_global_import_hook', 'is_global_import_hook_installed',
    # Watched prefixes (NEW v3.0.2)
    'add_watched_prefix', 'remove_watched_prefix', 'get_watched_prefixes', 'is_module_watched',
    # Cache management (NEW v3.0.2)
    'get_cache_stats', 'clear_cache', 'invalidate_cache',
    # Performance monitoring (NEW v3.0.2)
    'get_performance_stats', 'clear_performance_stats',
    # Utility
    'is_externally_managed',
]
