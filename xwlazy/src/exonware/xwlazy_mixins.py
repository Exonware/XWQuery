"""
Optional mixins for xwlazy — all disabled by default.
⚠️ RECOMMENDATION: From a software engineering perspective we recommend AGAINST
enabling these features. They increase complexity, reduce maintainability, and
(in the case of AST/type-stub tooling) are fragile or address a different
problem domain. Enable only for edge cases or compatibility; prefer the core
hook/auto_enable_lazy/attach API.
Features (each gated by an environment variable, default OFF):
  - Per-call wrapper API: XWLAZY_PER_CALL_API=1
  - AST rewrite / lazy transform: XWLAZY_AST_LAZY=1
  - Type-stub / internal API tooling: XWLAZY_TYPING_TOOLS=1
Interoperability: When enabled, these features may or may not work well together.
E.g. per-call imports use the normal meta_path; AST finder runs on import.
Enabling both can lead to duplicate handling. We recommend enabling at most one
of the optional features at a time.
"""

import os
import sys
import importlib
import warnings
from pathlib import Path
# -----------------------------------------------------------------------------
# Environment gates (all default OFF)
# -----------------------------------------------------------------------------
ENV_PER_CALL_API = "XWLAZY_PER_CALL_API"
ENV_AST_LAZY = "XWLAZY_AST_LAZY"
ENV_TYPING_TOOLS = "XWLAZY_TYPING_TOOLS"


def per_call_api_enabled():
    """True if per-call wrapper API is enabled via env."""
    return os.environ.get(ENV_PER_CALL_API) == "1"


def ast_lazy_enabled():
    """True if AST lazy/rewrite is enabled via env."""
    return os.environ.get(ENV_AST_LAZY) == "1"


def typing_tools_enabled():
    """True if type-stub / typing tooling is enabled via env."""
    return os.environ.get(ENV_TYPING_TOOLS) == "1"


def recommendation_warning(feature_name: str):
    """Emit a one-time warning that we recommend against using this feature."""
    warnings.warn(
        f"[xwlazy] Optional feature '{feature_name}' is enabled. "
        "We recommend against it from a software engineering perspective "
        "(complexity, maintainability, fragility). Use only for edge cases.",
        UserWarning,
        stacklevel=3,
    )
# -----------------------------------------------------------------------------
# Per-call wrapper API mixin
# -----------------------------------------------------------------------------


def lazy_import_impl(guardian, module_name: str, package=None, mode: str = "smart", root: str = "."):
    """
    Implement per-call lazy import: ensure hook is active, optionally configure
    package, then import the module. Requires guardian (XWLazy instance).
    """
    if not guardian:
        raise RuntimeError("lazy_import requires an active xwlazy guardian (call hook() first).")
    if package:
        if mode == "smart":
            guardian.configure(package, enabled=True, mode="lazy", install_strategy="smart")
        else:
            guardian.configure(package, enabled=True, install_strategy=mode)
    return importlib.import_module(module_name)
# -----------------------------------------------------------------------------
# AST rewrite mixin (placeholder finder; full AST transform is out of scope)
# -----------------------------------------------------------------------------


class ASTLazyFinder:
    """
    Optional meta_path finder that can perform AST-based lazy import transforms.
    When enabled (XWLAZY_AST_LAZY=1), registering this finder allows AST-level
    rewriting of import statements. This is a placeholder: actual AST rewrite
    logic is not implemented here for maintainability reasons.
    """

    def __init__(self, root_dir="."):
        self.root_dir = Path(root_dir)

    def find_spec(self, fullname, path, target=None):
        # Delegate to next finder (no AST rewrite in this placeholder).
        return None
_ast_finder_instance = None


def register_ast_lazy_finder(root="."):
    """Register the AST lazy finder on sys.meta_path if not already present."""
    global _ast_finder_instance
    if _ast_finder_instance is not None:
        return _ast_finder_instance
    _ast_finder_instance = ASTLazyFinder(root)
    if _ast_finder_instance not in sys.meta_path:
        sys.meta_path.insert(0, _ast_finder_instance)
    return _ast_finder_instance


def unregister_ast_lazy_finder():
    """Remove the AST lazy finder from sys.meta_path."""
    global _ast_finder_instance
    if _ast_finder_instance is not None and _ast_finder_instance in sys.meta_path:
        sys.meta_path.remove(_ast_finder_instance)
    _ast_finder_instance = None
# -----------------------------------------------------------------------------
# Type-stub / internal API tooling mixin
# -----------------------------------------------------------------------------
# Minimal storage for stub paths/content (tooling can read; we don't generate .pyi here)
_stub_registry = {}  # package_name -> {"path": path or None, "content": str or None}


def attach_stub_impl(package_name: str, stub_content=None, stub_path=None):
    """
    Register stub content or path for a package (for type checkers / internal API).
    Does not modify the runtime import system; just records for tooling.
    """
    if not package_name:
        raise ValueError("package_name must be non-empty")
    _stub_registry[package_name] = {"path": stub_path, "content": stub_content}


def get_stub_registry():
    """Return the current stub registry (read-only view)."""
    return dict(_stub_registry)


def clear_stub_registry():
    """Clear the stub registry (for testing/reset only)."""
    _stub_registry.clear()
__all__ = [
    "ENV_PER_CALL_API",
    "ENV_AST_LAZY",
    "ENV_TYPING_TOOLS",
    "per_call_api_enabled",
    "ast_lazy_enabled",
    "typing_tools_enabled",
    "recommendation_warning",
    "lazy_import_impl",
    "ASTLazyFinder",
    "register_ast_lazy_finder",
    "unregister_ast_lazy_finder",
    "attach_stub_impl",
    "get_stub_registry",
    "clear_stub_registry",
]
