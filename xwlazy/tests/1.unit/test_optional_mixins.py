"""
Unit tests for optional xwlazy mixins (per-call API, AST lazy, type-stub tooling).

All three features are disabled by default; tests verify disabled behavior,
env gates, and enabled behavior. Per GUIDE_51_TEST and REF_51_TEST.
Fixes go in the mixin file only; main xwlazy code is not modified.
"""

from __future__ import annotations

import importlib.util
import os
import sys
import warnings
from pathlib import Path
from unittest.mock import MagicMock

import pytest

pytestmark = pytest.mark.xwlazy_unit

# Ensure src is on path
_project_root = Path(__file__).resolve().parent.parent.parent
_src_path = _project_root / "src"
if str(_src_path) not in sys.path:
    sys.path.insert(0, str(_src_path))

# Load mixin module the same way xwlazy.py does (no import of exonware.xwlazy_mixins package)
_mixin_path = _project_root / "src" / "exonware" / "xwlazy_mixins.py"


def _load_mixins():
    """Load xwlazy_mixins module from file."""
    if not _mixin_path.exists():
        pytest.skip(f"Mixin file not found: {_mixin_path}")
    spec = importlib.util.spec_from_file_location("exonware.xwlazy_mixins", _mixin_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def mixins():
    """Provide the loaded mixin module."""
    return _load_mixins()


@pytest.fixture
def save_restore_env():
    """Save and restore the three mixin env vars around a test."""
    keys = ("XWLAZY_PER_CALL_API", "XWLAZY_AST_LAZY", "XWLAZY_TYPING_TOOLS")
    saved = {k: os.environ.pop(k, None) for k in keys}
    try:
        yield
    finally:
        for k, v in saved.items():
            if v is not None:
                os.environ[k] = v
            elif k in os.environ:
                del os.environ[k]


@pytest.fixture
def clean_stub_registry(mixins):
    """Clear stub registry before and after test (if mixin has clear_stub_registry)."""
    if hasattr(mixins, "clear_stub_registry"):
        mixins.clear_stub_registry()
    try:
        yield
    finally:
        if hasattr(mixins, "clear_stub_registry"):
            mixins.clear_stub_registry()


# -----------------------------------------------------------------------------
# Mixin module: env gates and helpers
# -----------------------------------------------------------------------------


class TestMixinEnvGates:
    """Test environment gates (all default OFF)."""

    def test_mixin_module_loads(self, mixins):
        """Mixin module loads and exposes expected names."""
        assert hasattr(mixins, "per_call_api_enabled")
        assert hasattr(mixins, "ast_lazy_enabled")
        assert hasattr(mixins, "typing_tools_enabled")
        assert hasattr(mixins, "lazy_import_impl")
        assert hasattr(mixins, "ASTLazyFinder")
        assert hasattr(mixins, "register_ast_lazy_finder")
        assert hasattr(mixins, "unregister_ast_lazy_finder")
        assert hasattr(mixins, "attach_stub_impl")
        assert hasattr(mixins, "get_stub_registry")

    def test_env_gates_default_off(self, mixins, save_restore_env):
        """With no env set, all gates are False."""
        assert mixins.per_call_api_enabled() is False
        assert mixins.ast_lazy_enabled() is False
        assert mixins.typing_tools_enabled() is False

    def test_per_call_gate_on_off(self, mixins, save_restore_env):
        """XWLAZY_PER_CALL_API=1 enables per-call; 0 or unset disables."""
        os.environ["XWLAZY_PER_CALL_API"] = "1"
        assert mixins.per_call_api_enabled() is True
        os.environ["XWLAZY_PER_CALL_API"] = "0"
        assert mixins.per_call_api_enabled() is False
        del os.environ["XWLAZY_PER_CALL_API"]
        assert mixins.per_call_api_enabled() is False

    def test_ast_lazy_gate_on_off(self, mixins, save_restore_env):
        """XWLAZY_AST_LAZY=1 enables AST lazy; 0 or unset disables."""
        os.environ["XWLAZY_AST_LAZY"] = "1"
        assert mixins.ast_lazy_enabled() is True
        os.environ["XWLAZY_AST_LAZY"] = "0"
        assert mixins.ast_lazy_enabled() is False
        del os.environ["XWLAZY_AST_LAZY"]
        assert mixins.ast_lazy_enabled() is False

    def test_typing_tools_gate_on_off(self, mixins, save_restore_env):
        """XWLAZY_TYPING_TOOLS=1 enables typing tools; 0 or unset disables."""
        os.environ["XWLAZY_TYPING_TOOLS"] = "1"
        assert mixins.typing_tools_enabled() is True
        os.environ["XWLAZY_TYPING_TOOLS"] = "0"
        assert mixins.typing_tools_enabled() is False
        del os.environ["XWLAZY_TYPING_TOOLS"]
        assert mixins.typing_tools_enabled() is False


class TestRecommendationWarning:
    """Test that recommendation_warning emits UserWarning."""

    def test_recommendation_warning_emits(self, mixins):
        """recommendation_warning('X') emits UserWarning with expected text."""
        with pytest.warns(UserWarning, match=r"Optional feature 'X' is enabled"):
            mixins.recommendation_warning("X")
        with pytest.warns(UserWarning, match=r"recommend against"):
            mixins.recommendation_warning("Y")


# -----------------------------------------------------------------------------
# Mixin: per-call lazy_import_impl
# -----------------------------------------------------------------------------


class TestLazyImportImpl:
    """Test lazy_import_impl in mixin (guardian required, optional package)."""

    def test_lazy_import_impl_requires_guardian(self, mixins):
        """lazy_import_impl(None, 'json') raises RuntimeError."""
        with pytest.raises(RuntimeError, match="guardian"):
            mixins.lazy_import_impl(None, "json")

    def test_lazy_import_impl_with_guardian_no_package(self, mixins):
        """lazy_import_impl(guardian, 'json') returns stdlib json module; configure not called."""
        guardian = MagicMock()
        result = mixins.lazy_import_impl(guardian, "json")
        assert result is not None
        assert result.__name__ == "json"
        guardian.configure.assert_not_called()

    def test_lazy_import_impl_with_package_smart(self, mixins):
        """lazy_import_impl(guardian, 'mymod', package='mypkg', mode='smart') calls configure."""
        guardian = MagicMock()
        result = mixins.lazy_import_impl(guardian, "json", package="mypkg", mode="smart")
        assert result is not None
        guardian.configure.assert_called_once()
        call_kw = guardian.configure.call_args[1]
        assert call_kw.get("enabled") is True
        assert call_kw.get("mode") == "lazy"
        assert call_kw.get("install_strategy") == "smart"

    def test_lazy_import_impl_with_package_pip(self, mixins):
        """lazy_import_impl(guardian, 'mymod', package='mypkg', mode='pip') uses install_strategy pip."""
        guardian = MagicMock()
        mixins.lazy_import_impl(guardian, "json", package="mypkg", mode="pip")
        call_kw = guardian.configure.call_args[1]
        assert call_kw.get("install_strategy") == "pip"


# -----------------------------------------------------------------------------
# Mixin: AST finder
# -----------------------------------------------------------------------------


class TestASTLazyFinder:
    """Test ASTLazyFinder and register/unregister."""

    def test_ast_finder_find_spec_returns_none(self, mixins):
        """ASTLazyFinder().find_spec returns None (placeholder)."""
        finder = mixins.ASTLazyFinder(".")
        assert finder.find_spec("any.module", None, None) is None

    def test_register_unregister_ast_finder(self, mixins, save_restore_env):
        """register_ast_lazy_finder adds finder to meta_path; unregister removes it."""
        os.environ["XWLAZY_AST_LAZY"] = "1"
        meta_path_before = list(sys.meta_path)
        finder = mixins.register_ast_lazy_finder(root=".")
        assert finder is not None
        assert finder in sys.meta_path
        mixins.unregister_ast_lazy_finder()
        assert finder not in sys.meta_path
        # Restore in case other tests rely on meta_path
        sys.meta_path[:] = meta_path_before

    def test_register_ast_finder_idempotent(self, mixins, save_restore_env):
        """Calling register_ast_lazy_finder twice returns same instance."""
        os.environ["XWLAZY_AST_LAZY"] = "1"
        try:
            f1 = mixins.register_ast_lazy_finder(root=".")
            f2 = mixins.register_ast_lazy_finder(root="/other")
            assert f1 is f2
        finally:
            mixins.unregister_ast_lazy_finder()


# -----------------------------------------------------------------------------
# Mixin: type-stub attach_stub_impl / get_stub_registry / clear_stub_registry
# -----------------------------------------------------------------------------


class TestStubRegistry:
    """Test attach_stub_impl, get_stub_registry, clear_stub_registry."""

    def test_attach_stub_impl_empty_package_raises(self, mixins):
        """attach_stub_impl('') raises ValueError."""
        with pytest.raises(ValueError, match="non-empty"):
            mixins.attach_stub_impl("")

    def test_attach_stub_impl_and_get_stub_registry(self, mixins, clean_stub_registry):
        """attach_stub_impl then get_stub_registry returns the entry."""
        mixins.attach_stub_impl("pkg_a", stub_path="/a.pyi", stub_content=None)
        reg = mixins.get_stub_registry()
        assert reg == {"pkg_a": {"path": "/a.pyi", "content": None}}

    def test_attach_stub_impl_content(self, mixins, clean_stub_registry):
        """attach_stub_impl with stub_content stores it."""
        mixins.attach_stub_impl("pkg_b", stub_content="def f(): ...")
        reg = mixins.get_stub_registry()
        assert reg["pkg_b"]["content"] == "def f(): ..."
        assert reg["pkg_b"]["path"] is None

    def test_clear_stub_registry(self, mixins, clean_stub_registry):
        """clear_stub_registry empties the registry."""
        mixins.attach_stub_impl("pkg_c", stub_path="/c.pyi")
        assert mixins.get_stub_registry()
        mixins.clear_stub_registry()
        assert mixins.get_stub_registry() == {}


# -----------------------------------------------------------------------------
# Public API (exonware.xwlazy): disabled behavior
# -----------------------------------------------------------------------------


class TestPublicAPIDisabled:
    """Test public lazy_import, enable_ast_lazy, attach_stub when features are disabled."""

    def test_lazy_import_disabled_raises(self, save_restore_env):
        """lazy_import('json') raises RuntimeError when XWLAZY_PER_CALL_API not set."""
        from exonware.xwlazy import lazy_import

        with pytest.raises(RuntimeError, match="disabled"):
            lazy_import("json")
        with pytest.raises(RuntimeError, match="recommend"):
            lazy_import("json")

    def test_enable_ast_lazy_disabled_returns_none(self, save_restore_env):
        """enable_ast_lazy() returns None when XWLAZY_AST_LAZY not set."""
        from exonware.xwlazy import enable_ast_lazy

        assert enable_ast_lazy() is None
        assert enable_ast_lazy(root="/any") is None

    def test_attach_stub_disabled_raises(self, save_restore_env):
        """attach_stub('pkg') raises RuntimeError when XWLAZY_TYPING_TOOLS not set."""
        from exonware.xwlazy import attach_stub

        with pytest.raises(RuntimeError, match="disabled"):
            attach_stub("somepkg")
        with pytest.raises(RuntimeError, match="recommend"):
            attach_stub("somepkg")

    def test_get_stub_registry_disabled_returns_empty(self, save_restore_env):
        """get_stub_registry() returns {} when typing tools disabled."""
        from exonware.xwlazy import get_stub_registry

        assert get_stub_registry() == {}


# -----------------------------------------------------------------------------
# Public API: enabled behavior (env set)
# -----------------------------------------------------------------------------


class TestPublicAPIEnabled:
    """Test public API when corresponding env var is set."""

    def test_lazy_import_enabled_returns_module(self, save_restore_env):
        """With XWLAZY_PER_CALL_API=1, lazy_import('json') returns module and warns."""
        os.environ["XWLAZY_PER_CALL_API"] = "1"
        from exonware.xwlazy import hook, lazy_import

        hook(root=".")  # ensure guardian exists
        with pytest.warns(UserWarning, match="Per-call wrapper API"):
            mod = lazy_import("json")
        assert mod is not None
        assert mod.__name__ == "json"

    def test_enable_ast_lazy_enabled_registers_finder(self, save_restore_env):
        """With XWLAZY_AST_LAZY=1, enable_ast_lazy() returns finder and it's in meta_path."""
        os.environ["XWLAZY_AST_LAZY"] = "1"
        from exonware.xwlazy import enable_ast_lazy, disable_ast_lazy

        meta_before = list(sys.meta_path)
        with pytest.warns(UserWarning, match="recommend against"):
            finder = enable_ast_lazy(root=".")
        assert finder is not None
        assert finder in sys.meta_path
        disable_ast_lazy()
        assert finder not in sys.meta_path
        sys.meta_path[:] = meta_before

    def test_attach_stub_and_get_stub_registry_enabled(self, save_restore_env, mixins):
        """With XWLAZY_TYPING_TOOLS=1, attach_stub then get_stub_registry returns entry."""
        os.environ["XWLAZY_TYPING_TOOLS"] = "1"
        if hasattr(mixins, "clear_stub_registry"):
            mixins.clear_stub_registry()
        try:
            from exonware.xwlazy import attach_stub, get_stub_registry

            with pytest.warns(UserWarning, match="Type-stub"):
                attach_stub("test_pkg_xyz", stub_path="/x.pyi")
            reg = get_stub_registry()
            assert "test_pkg_xyz" in reg
            assert reg["test_pkg_xyz"]["path"] == "/x.pyi"
        finally:
            if hasattr(mixins, "clear_stub_registry"):
                mixins.clear_stub_registry()


# -----------------------------------------------------------------------------
# disable_ast_lazy when AST was enabled
# -----------------------------------------------------------------------------


class TestDisableAstLazy:
    """Test disable_ast_lazy after enable_ast_lazy (env on)."""

    def test_disable_ast_lazy_removes_finder(self, save_restore_env):
        """enable_ast_lazy then disable_ast_lazy removes finder from meta_path."""
        os.environ["XWLAZY_AST_LAZY"] = "1"
        from exonware.xwlazy import enable_ast_lazy, disable_ast_lazy

        finder = None
        try:
            with pytest.warns(UserWarning, match="recommend against"):
                finder = enable_ast_lazy()
            assert finder in sys.meta_path
            disable_ast_lazy()
            assert finder not in sys.meta_path
        finally:
            if finder is not None and finder in sys.meta_path:
                sys.meta_path.remove(finder)
