"""
xwlazy package - convenience import and re-exports.
Allows: import xwlazy and from xwlazy.lazy import config_package_lazy_install_enabled.
Company: eXonware.com
"""
import sys
from exonware.xwlazy import *  # noqa: F401, F403
try:
    from exonware.xwlazy.version import __version__
except ImportError:
    __version__ = getattr(sys.modules.get("exonware.xwlazy"), "__version__", "0.0.0")
