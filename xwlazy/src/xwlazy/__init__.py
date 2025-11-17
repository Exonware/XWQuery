"""
Top-level xwlazy package exposing lazy runtime utilities.
"""

from .version import (
    __version__,
    VERSION_MAJOR,
    VERSION_MINOR,
    VERSION_PATCH,
    VERSION_BUILD,
    VERSION_SUFFIX,
    VERSION_STRING,
    get_version,
    get_version_info,
    get_version_dict,
    is_dev_version,
    is_release_version,
)

__all__ = [
    "__version__",
    "VERSION_MAJOR",
    "VERSION_MINOR",
    "VERSION_PATCH",
    "VERSION_BUILD",
    "VERSION_SUFFIX",
    "VERSION_STRING",
    "get_version",
    "get_version_info",
    "get_version_dict",
    "is_dev_version",
    "is_release_version",
]

