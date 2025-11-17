#exonware/xwlazy/src/exonware/xwlazy/lazy/logging_utils.py
"""
Lightweight logging helper for the xwlazy lazy subsystem.

Adds category-based filtering so noisy traces (hook/install/audit/etc.) can be
turned on or off individually via configuration or environment variables.
"""

from __future__ import annotations

import logging
import os
import sys
from datetime import datetime
from typing import Dict, Optional

_configured = False

_CATEGORY_DEFAULTS: Dict[str, bool] = {
    "install": True,     # always show installs by default
    "hook": False,
    "enhance": False,
    "audit": False,
    "sbom": False,
    "config": False,
    "discovery": False,
}
_category_overrides: Dict[str, bool] = {}


def _normalize_category(name: str) -> str:
    return name.strip().lower()


def _load_env_overrides() -> None:
    for category in _CATEGORY_DEFAULTS:
        env_key = f"XWLAZY_LOG_{category.upper()}"
        env_val = os.getenv(env_key)
        if env_val is None:
            continue
        enabled = env_val.strip().lower() not in {"0", "false", "off", "no"}
        _category_overrides[_normalize_category(category)] = enabled


class XWLazyFormatter(logging.Formatter):
    """Custom formatter for xwlazy that uses exonware.xwlazy [HH:MM:SS]: [FLAG] format."""
    
    # Map logging levels to flags
    LEVEL_FLAGS = {
        logging.DEBUG: "DEBUG",
        logging.INFO: "INFO",
        logging.WARNING: "WARN",
        logging.ERROR: "ERROR",
        logging.CRITICAL: "CRITICAL",
    }
    
    # Map flags to emojis
    EMOJI_MAP = {
        "WARN": "⚠️",
        "INFO": "ℹ️",
        "ACTION": "⚙️",
        "SUCCESS": "✅",
        "ERROR": "❌",
        "FAIL": "⛔",
        "DEBUG": "🔍",
        "CRITICAL": "🚨",
    }
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record with custom format."""
        # Get flag from level or use INFO as default
        flag = self.LEVEL_FLAGS.get(record.levelno, "INFO")
        
        # Get emoji for flag
        emoji = self.EMOJI_MAP.get(flag, "ℹ️")
        
        # Format time as HH:MM:SS
        time_str = datetime.now().strftime("%H:%M:%S")
        
        # Format message
        message = record.getMessage()
        
        # Return formatted: emoji exonware.xwlazy [HH:MM:SS]: [FLAG] message
        return f"{emoji} exonware.xwlazy [{time_str}]: [{flag}] {message}"


def _ensure_basic_config() -> None:
    global _configured
    if _configured:
        return
    
    # Configure root logger with custom formatter
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)
    
    # Remove existing handlers to avoid duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Create console handler with custom formatter
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(XWLazyFormatter())
    root_logger.addHandler(console_handler)
    
    _load_env_overrides()
    _configured = True


def get_logger(name: Optional[str] = None) -> logging.Logger:
    """Return a logger configured for the lazy subsystem."""
    _ensure_basic_config()
    return logging.getLogger(name or "xwlazy.lazy")


def is_log_category_enabled(category: str) -> bool:
    """Return True if the provided log category is enabled."""
    _ensure_basic_config()
    normalized = _normalize_category(category)
    if normalized in _category_overrides:
        return _category_overrides[normalized]
    return _CATEGORY_DEFAULTS.get(normalized, True)


def set_log_category(category: str, enabled: bool) -> None:
    """Enable/disable an individual log category at runtime."""
    _category_overrides[_normalize_category(category)] = bool(enabled)


def set_log_categories(overrides: Dict[str, bool]) -> None:
    """Bulk update multiple categories."""
    for category, enabled in overrides.items():
        set_log_category(category, enabled)


def get_log_categories() -> Dict[str, bool]:
    """Return the effective state for each built-in log category."""
    _ensure_basic_config()
    result = {}
    for category, default_enabled in _CATEGORY_DEFAULTS.items():
        normalized = _normalize_category(category)
        result[category] = _category_overrides.get(normalized, default_enabled)
    return result


def log_event(category: str, level_fn, msg: str, *args, **kwargs) -> None:
    """Emit a log for the given category if it is enabled."""
    if is_log_category_enabled(category):
        level_fn(msg, *args, **kwargs)


def format_message(flag: str, message: str) -> str:
    """
    Format a message with exonware.xwlazy [HH:MM:SS]: [FLAG] format.
    
    Args:
        flag: Message flag (WARN, ACTION, SUCCESS, etc.)
        message: Message content
        
    Returns:
        Formatted message string
    """
    # Map flags to emojis
    emoji_map = {
        "WARN": "⚠️",
        "INFO": "ℹ️",
        "ACTION": "⚙️",
        "SUCCESS": "✅",
        "ERROR": "❌",
        "FAIL": "⛔",
        "DEBUG": "🔍",
        "CRITICAL": "🚨",
    }
    emoji = emoji_map.get(flag, "ℹ️")
    time_str = datetime.now().strftime("%H:%M:%S")
    return f"{emoji} exonware.xwlazy [{time_str}]: [{flag}] {message}"


def print_formatted(flag: str, message: str, same_line: bool = False) -> None:
    """
    Print a formatted message with optional same-line support.
    
    Args:
        flag: Message flag (WARN, ACTION, SUCCESS, etc.)
        message: Message content
        same_line: If True, use \r to overwrite previous line
    """
    formatted = format_message(flag, message)
    if same_line:
        sys.stdout.write(f"\r{formatted}")
        sys.stdout.flush()
    else:
        print(formatted)

