"""
Query execution metrics and monitoring.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
"""

from exonware.xwsystem.monitoring import (
    get_metrics as get_xwsystem_metrics,
    reset_metrics as reset_xwsystem_metrics
)


def get_metrics():
    """Get XWQuery metrics instance."""
    return get_xwsystem_metrics('xwquery')


def reset_metrics():
    """Reset XWQuery metrics."""
    reset_xwsystem_metrics('xwquery')


__all__ = ['get_metrics', 'reset_metrics']

