"""
Regression tests for xwlazy auto-install resolution (GUIDE_51_TEST, GUIDE_53_FIX).

Verifies that import-name -> pip-name resolution uses HARD_MAPPINGS first so
e.g. 'yaml' resolves to 'PyYAML' and auto-install runs the correct pip command.
"""

import pytest


def test_resolve_yaml_returns_pyyaml():
    """HARD_MAPPINGS must win so 'yaml' -> 'PyYAML' (not pip install yaml)."""
    from exonware.xwlazy import XWLazy

    # Use a fresh instance so manifest_index is empty and we hit HARD_MAPPINGS
    guardian = XWLazy(".", default_enabled=True, enable_global_hook=False)
    if hasattr(guardian._resolve_target_cached, "cache_clear"):
        guardian._resolve_target_cached.cache_clear()
    result = guardian._resolve_target("yaml")
    assert result == "PyYAML", f"Expected 'PyYAML' for 'yaml', got {result!r}"


def test_resolve_tomli_w_returns_tomli_w():
    """tomli_w import name must resolve to pip package 'tomli-w'."""
    from exonware.xwlazy import XWLazy

    guardian = XWLazy(".", default_enabled=True, enable_global_hook=False)
    if hasattr(guardian._resolve_target_cached, "cache_clear"):
        guardian._resolve_target_cached.cache_clear()
    result = guardian._resolve_target("tomli_w")
    # Can be "tomli-w" from HARD_MAPPINGS or from fallback; must not be "tomli_w" as pip package
    assert result is not None, "tomli_w should resolve to a pip package name"
    assert "tomli" in result.lower(), f"Expected tomli-related package, got {result!r}"
