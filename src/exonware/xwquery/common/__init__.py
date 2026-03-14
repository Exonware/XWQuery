"""
Common utilities and shared components for xwquery.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
"""
"""
Common utilities and shared components for xwquery.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
"""
# Use xwsystem directly - no wrappers needed

from exonware.xwsystem.caching import create_cache
from exonware.xwsystem.monitoring import get_metrics, reset_metrics
# xwquery-specific metrics helpers

def get_metrics(component_name: str = 'xwquery'):
    """Get metrics for xwquery component."""
    from exonware.xwsystem.monitoring import get_metrics as _get_metrics
    return _get_metrics(component_name)


def reset_metrics(component_name: str = 'xwquery'):
    """Reset metrics for xwquery component."""
    from exonware.xwsystem.monitoring import reset_metrics as _reset_metrics
    _reset_metrics(component_name)
__all__ = [
    # Monitoring - use xwsystem.monitoring directly
    'get_metrics',
    'reset_metrics',
    # Cache - use xwsystem.caching.create_cache() directly
    'create_cache',
]
