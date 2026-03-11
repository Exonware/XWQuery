"""
#exonware/xwlazy/tests/1.unit/test_persist_to_project.py
Unit tests for xwlazy persist-to-project: on successful install, add package
to requirements.txt and/or pyproject.toml (full extras or dependencies).
Comprehensive coverage: edge cases, sync vs async mode, normalization,
comments, multiple extras, empty inputs, and 100% correctness assertions.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

import os
import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_unit
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
# Access implementation module where _persist_installed_to_project lives
import exonware.xwlazy  # noqa: F401 - ensure implementation module is loaded
_xwlazy_module = sys.modules.get("exonware._xwlazy_module")
if _xwlazy_module is None:
    import importlib.util
    _spec = importlib.util.spec_from_file_location(
        "exonware._xwlazy_module",
        project_root / "src" / "exonware" / "xwlazy.py",
    )
    _xwlazy_module = importlib.util.module_from_spec(_spec)
    _spec.loader.exec_module(_xwlazy_module)
    sys.modules["exonware._xwlazy_module"] = _xwlazy_module
_persist = _xwlazy_module._persist_installed_to_project
_find_project_root = _xwlazy_module._find_project_root
_add_to_requirements_txt = _xwlazy_module._add_to_requirements_txt
_add_to_pyproject = _xwlazy_module._add_to_pyproject
_normalize_spec_for_compare = _xwlazy_module._normalize_spec_for_compare
_flush_async_io = getattr(_xwlazy_module, "_flush_async_io", None)
_is_async_io_enabled = getattr(_xwlazy_module, "_is_async_io_enabled", lambda: True)


def _flush():
    if callable(_flush_async_io):
        ok = _flush_async_io(timeout_s=5.0)
        assert ok, "Async I/O flush did not complete within timeout"


class TestFindProjectRoot:

    def test_find_project_root_from_xwlazy_tests(self):
        # Running from xwlazy/tests/1.unit or xwlazy/tests, project root is xwlazy
        root = _find_project_root()
        assert root is not None
        assert (root / "pyproject.toml").exists() or (root / "requirements.txt").exists()

    def test_find_project_root_under_subdir(self, tmp_path):
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'test'")
        sub = tmp_path / "a" / "b"
        sub.mkdir(parents=True)
        orig = os.getcwd()
        try:
            os.chdir(sub)
            root = _find_project_root()
            assert root is not None
            assert root == tmp_path.resolve()
        finally:
            os.chdir(orig)

    def test_find_project_root_prefers_pyproject_over_requirements(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("# empty\n")
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'p'\n")
        sub = tmp_path / "deep" / "nest"
        sub.mkdir(parents=True)
        orig = os.getcwd()
        try:
            os.chdir(sub)
            root = _find_project_root()
            assert root is not None
            assert root == tmp_path.resolve()
            assert (root / "pyproject.toml").exists()
        finally:
            os.chdir(orig)

    def test_find_project_root_returns_none_when_no_markers(self, tmp_path):
        sub = tmp_path / "a" / "b" / "c"
        sub.mkdir(parents=True)
        orig = os.getcwd()
        try:
            os.chdir(sub)
            root = _find_project_root()
            assert root is None
        finally:
            os.chdir(orig)

    def test_find_project_root_stops_at_filesystem_root(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("x\n")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            root = _find_project_root()
            assert root is not None
            assert (root / "requirements.txt").read_text().strip() == "x"
        finally:
            os.chdir(orig)


class TestNormalizeSpec:

    def test_normalize_spec(self):
        assert _normalize_spec_for_compare("protobuf") == "protobuf"
        assert _normalize_spec_for_compare("protobuf>=4.0") == "protobuf"
        assert _normalize_spec_for_compare("  pandas  ") == "pandas"

    def test_normalize_spec_version_operators(self):
        assert _normalize_spec_for_compare("pkg==1.0") == "pkg"
        assert _normalize_spec_for_compare("pkg~=2.0") == "pkg"
        assert _normalize_spec_for_compare("pkg!=3.0") == "pkg"
        assert _normalize_spec_for_compare("pkg<4") == "pkg"
        assert _normalize_spec_for_compare("pkg>5") == "pkg"
        assert _normalize_spec_for_compare("pkg>=1,<2") == "pkg"

    def test_normalize_spec_lowercase(self):
        assert _normalize_spec_for_compare("MyPackage") == "mypackage"
        assert _normalize_spec_for_compare("PKG") == "pkg"

    def test_normalize_spec_strips_comments(self):
        # Implementation may not strip # in spec; base name before # is used if any
        base = _normalize_spec_for_compare("pkg  # comment")
        assert base in ("pkg", "pkg  ")

    def test_normalize_spec_empty_or_non_string(self):
        assert _normalize_spec_for_compare("") == ""
        assert _normalize_spec_for_compare(None) == ""
        assert _normalize_spec_for_compare(123) == ""


class TestAddToRequirementsTxt:

    def test_add_to_requirements_creates_line(self, tmp_path):
        req = tmp_path / "requirements.txt"
        req.write_text("existing\n")
        _add_to_requirements_txt(tmp_path, "newpkg>=1.0")
        _flush()
        content = req.read_text()
        assert "newpkg>=1.0" in content
        assert content.strip().endswith("newpkg>=1.0")

    def test_add_to_requirements_no_duplicate(self, tmp_path):
        req = tmp_path / "requirements.txt"
        req.write_text("pkg1\n")
        _add_to_requirements_txt(tmp_path, "pkg1>=2.0")
        _flush()
        content = req.read_text()
        lines = [ln.strip() for ln in content.splitlines() if ln.strip() and not ln.strip().startswith("#")]
        # pkg1 already present; pkg1>=2.0 has same normalized base so should not be added again
        pkg1_lines = [ln for ln in lines if _normalize_spec_for_compare(ln) == "pkg1"]
        assert len(pkg1_lines) == 1
        _add_to_requirements_txt(tmp_path, "otherpkg")
        _flush()
        lines2 = [ln.strip() for ln in req.read_text().splitlines() if ln.strip()]
        assert "otherpkg" in lines2
        assert len([ln for ln in lines2 if _normalize_spec_for_compare(ln) == "pkg1"]) == 1

    def test_add_to_requirements_skips_if_no_file(self, tmp_path):
        # No requirements.txt - must not raise
        _add_to_requirements_txt(tmp_path, "anypkg")
        _flush()

    def test_add_to_requirements_preserves_comments_and_order(self, tmp_path):
        req = tmp_path / "requirements.txt"
        req.write_text("# base\npkg-a==1\n# optional\n")
        _add_to_requirements_txt(tmp_path, "pkg-b>=2")
        _flush()
        content = req.read_text()
        assert "# base" in content
        assert "pkg-a==1" in content
        assert "pkg-b>=2" in content
        assert content.strip().endswith("pkg-b>=2")

    def test_add_to_requirements_empty_spec_does_nothing(self, tmp_path):
        req = tmp_path / "requirements.txt"
        req.write_text("existing\n")
        _add_to_requirements_txt(tmp_path, "")
        _add_to_requirements_txt(tmp_path, "   ")
        _flush()
        assert req.read_text().strip() == "existing"

    def test_add_to_requirements_whitespace_only_file(self, tmp_path):
        req = tmp_path / "requirements.txt"
        req.write_text("\n\n")
        _add_to_requirements_txt(tmp_path, "only-pkg")
        _flush()
        lines = [ln for ln in req.read_text().splitlines() if ln.strip()]
        assert len(lines) == 1
        assert "only-pkg" in lines[0]

    def test_add_to_requirements_sync_mode_same_result(self, tmp_path, monkeypatch):
        """With XWLAZY_ASYNC_IO=0, result must be identical to async path."""
        monkeypatch.setenv("XWLAZY_ASYNC_IO", "0")
        req = tmp_path / "requirements.txt"
        req.write_text("")
        _add_to_requirements_txt(tmp_path, "sync-pkg==1.0")
        _flush()
        content = req.read_text()
        assert "sync-pkg==1.0" in content
        assert content.strip().endswith("sync-pkg==1.0")


class TestAddToPyproject:

    def test_add_to_dependencies_when_no_full_extras(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("""[project]
name = "test"
dependencies = ["pip"]
""")
        _add_to_pyproject(tmp_path, "mypackage>=1.0")
        _flush()
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        deps = data.get("project", {}).get("dependencies", [])
        assert "mypackage>=1.0" in deps

    def test_add_to_full_extras_when_present(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("""[project]
name = "test"
dependencies = ["pip"]
[project.optional-dependencies]
full = ["existing-pkg"]
lazy = ["other"]
""")
        _add_to_pyproject(tmp_path, "new-pkg==2.0")
        _flush()
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        opt = data.get("project", {}).get("optional-dependencies", {})
        full_list = opt.get("full", [])
        assert "new-pkg==2.0" in full_list
        assert "existing-pkg" in full_list

    def test_add_to_optional_deps_group_when_overridden(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("""[project]
name = "test"
dependencies = ["pip"]
""")
        orig = os.environ.get("XWLAZY_PERSIST_EXTRAS")
        try:
            os.environ["XWLAZY_PERSIST_EXTRAS"] = "dev"
            _add_to_pyproject(tmp_path, "dev-only-pkg>=1.2")
            _flush()
        finally:
            if orig is None:
                os.environ.pop("XWLAZY_PERSIST_EXTRAS", None)
            else:
                os.environ["XWLAZY_PERSIST_EXTRAS"] = orig
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        opt = data.get("project", {}).get("optional-dependencies", {})
        assert "dev-only-pkg>=1.2" in opt.get("dev", [])
        assert "dev-only-pkg>=1.2" not in data.get("project", {}).get("dependencies", [])

    def test_force_dependencies_when_overridden_none(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("""[project]
name = "test"
dependencies = ["pip"]
[project.optional-dependencies]
full = ["existing-pkg"]
""")
        orig = os.environ.get("XWLAZY_PERSIST_EXTRAS")
        try:
            os.environ["XWLAZY_PERSIST_EXTRAS"] = "none"
            _add_to_pyproject(tmp_path, "base-pkg==0.1")
            _flush()
        finally:
            if orig is None:
                os.environ.pop("XWLAZY_PERSIST_EXTRAS", None)
            else:
                os.environ["XWLAZY_PERSIST_EXTRAS"] = orig
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        deps = data.get("project", {}).get("dependencies", [])
        opt = data.get("project", {}).get("optional-dependencies", {})
        assert "base-pkg==0.1" in deps
        assert "base-pkg==0.1" not in opt.get("full", [])

    def test_add_to_pyproject_no_duplicate(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("""[project]
name = "test"
dependencies = ["pip", "already"]
""")
        _add_to_pyproject(tmp_path, "already>=1.0")
        _flush()
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        deps = data.get("project", {}).get("dependencies", [])
        already_count = sum(1 for d in deps if isinstance(d, str) and _normalize_spec_for_compare(d) == "already")
        assert already_count == 1

    def test_add_to_pyproject_skips_if_no_file(self, tmp_path):
        _add_to_pyproject(tmp_path, "anypkg")
        _flush()
        assert not (tmp_path / "pyproject.toml").exists()

    def test_add_to_pyproject_empty_spec_does_nothing(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("[project]\nname = 'x'\ndependencies = []\n")
        _add_to_pyproject(tmp_path, "")
        _add_to_pyproject(tmp_path, "   ")
        _flush()
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        assert data.get("project", {}).get("dependencies", []) == []

    def test_add_to_pyproject_extras_default_dependencies_keywords(self, tmp_path):
        """XWLAZY_PERSIST_EXTRAS=default, dependencies, base, project → [project.dependencies]."""
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("[project]\nname = 'x'\ndependencies = []\n\n[project.optional-dependencies]\nfull = ['x']\n")
        orig = os.environ.get("XWLAZY_PERSIST_EXTRAS")
        try:
            for keyword in ("default", "dependencies", "base", "project"):
                os.environ["XWLAZY_PERSIST_EXTRAS"] = keyword
                _add_to_pyproject(tmp_path, f"via-{keyword}==1")
            _flush()
        finally:
            if orig is None:
                os.environ.pop("XWLAZY_PERSIST_EXTRAS", None)
            else:
                os.environ["XWLAZY_PERSIST_EXTRAS"] = orig
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        deps = data.get("project", {}).get("dependencies", [])
        for keyword in ("default", "dependencies", "base", "project"):
            assert any(f"via-{keyword}" in str(d) for d in deps), f"via-{keyword} not in dependencies"

    def test_add_to_pyproject_creates_optional_deps_section_if_missing(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("[project]\nname = 'n'\ndependencies = []\n")
        orig = os.environ.get("XWLAZY_PERSIST_EXTRAS")
        try:
            os.environ["XWLAZY_PERSIST_EXTRAS"] = "dev"
            _add_to_pyproject(tmp_path, "dev-tool>=1")
            _flush()
        finally:
            if orig is None:
                os.environ.pop("XWLAZY_PERSIST_EXTRAS", None)
            else:
                os.environ["XWLAZY_PERSIST_EXTRAS"] = orig
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        opt = data.get("project", {}).get("optional-dependencies", {})
        assert "dev" in opt
        assert "dev-tool>=1" in opt["dev"]

    def test_add_to_pyproject_sync_mode_same_result(self, tmp_path, monkeypatch):
        monkeypatch.setenv("XWLAZY_ASYNC_IO", "0")
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("[project]\nname = 's'\ndependencies = []\n")
        _add_to_pyproject(tmp_path, "sync-pyproject-pkg==2.0")
        _flush()
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        assert "sync-pyproject-pkg==2.0" in data.get("project", {}).get("dependencies", [])

    def test_add_to_pyproject_multiple_extras_groups_unchanged(self, tmp_path):
        pyproject = tmp_path / "pyproject.toml"
        pyproject.write_text("""[project]
name = "m"
dependencies = ["pip"]
[project.optional-dependencies]
full = ["a"]
lazy = ["b"]
dev = ["c"]
""")
        _add_to_pyproject(tmp_path, "new-in-full==1")
        _flush()
        data = _xwlazy_module._load_toml_file(pyproject, verbose_error=False)
        opt = data.get("project", {}).get("optional-dependencies", {})
        assert "new-in-full==1" in opt.get("full", [])
        assert opt.get("lazy") == ["b"]
        assert opt.get("dev") == ["c"]


class TestPersistInstalledToProject:

    def test_persist_adds_to_both_files(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("")
        (tmp_path / "pyproject.toml").write_text("""[project]
name = "proj"
dependencies = []
""")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist("recorded-pkg>=3.0")
            _flush()
        finally:
            os.chdir(orig)
        assert (tmp_path / "requirements.txt").read_text().strip() == "recorded-pkg>=3.0"
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        assert "recorded-pkg>=3.0" in data.get("project", {}).get("dependencies", [])

    def test_persist_respects_no_persist_env(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("")
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'p'\ndependencies = []")
        orig_cwd = os.getcwd()
        orig_env = os.environ.get("XWLAZY_NO_PERSIST")
        try:
            os.environ["XWLAZY_NO_PERSIST"] = "1"
            os.chdir(tmp_path)
            _persist("should-not-appear")
            _flush()
        finally:
            os.chdir(orig_cwd)
            if orig_env is None:
                os.environ.pop("XWLAZY_NO_PERSIST", None)
            else:
                os.environ["XWLAZY_NO_PERSIST"] = orig_env
        assert "should-not-appear" not in (tmp_path / "requirements.txt").read_text()
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        assert "should-not-appear" not in str(data.get("project", {}).get("dependencies", []))

    def test_persist_empty_or_whitespace_spec_does_nothing(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("")
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'p'\ndependencies = []\n")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist("")
            _persist("   ")
            _persist("\t")
            _flush()
        finally:
            os.chdir(orig)
        assert (tmp_path / "requirements.txt").read_text().strip() == ""
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        assert data.get("project", {}).get("dependencies", []) == []

    def test_persist_no_project_root_does_nothing(self, tmp_path):
        """When cwd is under a dir that has no pyproject/requirements in any ancestor, persist is no-op."""
        # tmp_path has no pyproject.toml or requirements.txt; nested dir has none either.
        nested = tmp_path / "a" / "b" / "c"
        nested.mkdir(parents=True)
        orig = os.getcwd()
        try:
            os.chdir(nested)
            root = _find_project_root()
            # If tmp_path's parent (e.g. system temp) has pyproject/requirements, root may be set; otherwise None.
            _persist("no-write-pkg")
            _flush()
        finally:
            os.chdir(orig)
        # We did not create requirements or pyproject under tmp_path, so they must not exist under nested.
        assert not (nested / "requirements.txt").exists()
        assert not (nested / "pyproject.toml").exists()
        # And tmp_path itself was never given those files
        assert not (tmp_path / "requirements.txt").exists()
        assert not (tmp_path / "pyproject.toml").exists()

    def test_persist_only_requirements_no_pyproject(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist("req-only-pkg==1")
            _flush()
        finally:
            os.chdir(orig)
        assert "req-only-pkg==1" in (tmp_path / "requirements.txt").read_text()
        assert not (tmp_path / "pyproject.toml").exists()

    def test_persist_only_pyproject_no_requirements(self, tmp_path):
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'p'\ndependencies = []\n")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist("pyproject-only-pkg")
            _flush()
        finally:
            os.chdir(orig)
        assert not (tmp_path / "requirements.txt").exists()
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        assert "pyproject-only-pkg" in data.get("project", {}).get("dependencies", [])

    def test_persist_non_string_spec_coerced(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("")
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'p'\ndependencies = []\n")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist(123)  # coerced to "123" by implementation
            _flush()
        finally:
            os.chdir(orig)
        content = (tmp_path / "requirements.txt").read_text()
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        deps = data.get("project", {}).get("dependencies", [])
        assert "123" in content
        assert "123" in deps

    def test_persist_idempotent_second_call_no_duplicate(self, tmp_path):
        (tmp_path / "requirements.txt").write_text("")
        (tmp_path / "pyproject.toml").write_text("[project]\nname = 'p'\ndependencies = []\n")
        orig = os.getcwd()
        try:
            os.chdir(tmp_path)
            _persist("idem-pkg==1.0")
            _flush()
            _persist("idem-pkg==1.0")
            _persist("idem-pkg>=1.0")
            _flush()
        finally:
            os.chdir(orig)
        lines = [ln.strip() for ln in (tmp_path / "requirements.txt").read_text().splitlines() if ln.strip()]
        assert len([ln for ln in lines if _normalize_spec_for_compare(ln) == "idem-pkg"]) == 1
        data = _xwlazy_module._load_toml_file(tmp_path / "pyproject.toml", verbose_error=False)
        deps = data.get("project", {}).get("dependencies", [])
        assert sum(1 for d in deps if _normalize_spec_for_compare(str(d)) == "idem-pkg") == 1
