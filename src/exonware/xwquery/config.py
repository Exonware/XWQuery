"""
Configuration management for the xwquery library.

Thread-safe, centralized configuration for performance tuning 
and behavior customization.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 26, 2025
"""

import os
import threading
from dataclasses import dataclass, fields
from typing import Optional

from exonware.xwsystem import get_logger
logger = get_logger('xwquery.config')

_config_lock = threading.Lock()
_config: Optional['XWQueryConfig'] = None


def _get_env_var(key: str, default: str, target_type: type):
    """
    Safely retrieve and cast an environment variable.
    
    Args:
        key: The environment variable name
        default: The default value (as a string)
        target_type: The type to cast the value to (int, float, bool)
    
    Returns:
        The casted value
    
    Raises:
        XWQueryValueError: If the environment variable has an invalid value
    """
    value = os.getenv(key, default)
    try:
        if target_type is bool:
            return value.lower() in ('true', '1', 'yes', 'y', 't')
        if target_type is int:
            return int(value)
        if target_type is float:
            return float(value)
        return value
    except (ValueError, TypeError) as e:
        # Import here to avoid circular dependency
        from .errors import XWQueryValueError
        raise XWQueryValueError(
            f"Invalid value for environment variable {key}: '{value}'. "
            f"Could not convert to {target_type.__name__}."
        ) from e


@dataclass
class XWQueryConfig:
    """
    Configuration for XWQuery performance and behavior tuning.
    
    Defines default values for various operational parameters. These can be
    overridden by environment variables or by setting a custom config object.
    """
    
    # --- Query Execution ---
    max_query_depth: int = 50
    query_timeout_seconds: float = 30.0
    enable_query_caching: bool = True
    query_cache_size: int = 1024
    
    # --- Parser Configuration ---
    max_tokens: int = 10_000
    enable_strict_parsing: bool = False
    max_statement_length: int = 10_000
    
    # --- Performance Features ---
    enable_optimization: bool = True
    enable_parallel_execution: bool = False
    max_workers: int = 4
    
    # --- Security Limits ---
    max_result_size: int = 1_000_000
    enable_sql_injection_protection: bool = True
    max_filter_complexity: int = 100
    
    # --- Format Conversion ---
    conversion_cache_size: int = 512
    enable_conversion_caching: bool = True
    
    # --- Memory Management ---
    enable_result_streaming: bool = False
    result_batch_size: int = 1000
    
    # --- Monitoring ---
    enable_metrics: bool = True
    enable_query_logging: bool = True
    log_slow_queries: bool = True
    slow_query_threshold_ms: float = 1000.0
    
    @classmethod
    def from_env(cls) -> 'XWQueryConfig':
        """Load configuration from environment variables with robust type casting."""
        logger.debug("Loading XWQuery configuration from environment variables.")
        kwargs = {}
        for field in fields(cls):
            env_key = f"XWQUERY_{field.name.upper()}"
            kwargs[field.name] = _get_env_var(env_key, str(field.default), field.type)
        return cls(**kwargs)
    
    def validate(self) -> None:
        """
        Validate configuration values, raising specific errors on failure.
        
        Raises:
            XWQueryValueError: If any configuration value is invalid.
        """
        from .errors import XWQueryValueError
        
        if self.query_cache_size <= 0:
            raise XWQueryValueError("query_cache_size must be positive")
        if self.max_query_depth <= 0:
            raise XWQueryValueError("max_query_depth must be positive")
        if self.query_timeout_seconds <= 0:
            raise XWQueryValueError("query_timeout_seconds must be positive")
        if self.max_tokens <= 0:
            raise XWQueryValueError("max_tokens must be positive")
        if self.max_result_size <= 0:
            raise XWQueryValueError("max_result_size must be positive")
        if self.conversion_cache_size <= 0:
            raise XWQueryValueError("conversion_cache_size must be positive")
        if self.max_workers <= 0:
            raise XWQueryValueError("max_workers must be positive")


def get_config() -> XWQueryConfig:
    """
    Get the global, thread-safe XWQuery configuration instance.
    
    Initializes the configuration from environment variables on first call.
    """
    global _config
    if _config is not None:
        return _config
    
    with _config_lock:
        if _config is None:
            _config = XWQueryConfig.from_env()
            _config.validate()
            logger.info(f"Initialized XWQuery configuration: {_config}")
    return _config


def set_config(config: XWQueryConfig) -> None:
    """
    Set the global XWQuery configuration. Thread-safe operation.
    
    Args:
        config: A validated XWQueryConfig instance.
    """
    global _config
    config.validate()
    with _config_lock:
        _config = config
        logger.info(f"Updated XWQuery configuration: {config}")


def reset_config() -> None:
    """Reset the global configuration to its default state."""
    global _config
    with _config_lock:
        _config = None
        logger.info("Reset XWQuery configuration. It will be re-initialized on next get_config() call.")


__all__ = [
    'XWQueryConfig',
    'get_config',
    'set_config',
    'reset_config',
]

