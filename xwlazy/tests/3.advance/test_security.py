"""Advance: security-related behavior via public API. xwlazy is single-file."""
import pytest
from pathlib import Path
import sys

pytestmark = pytest.mark.xwlazy_security
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import auto_enable_lazy, uninstall_global_import_hook, is_externally_managed

class TestSecurityAPI:
    def teardown_method(self):
        uninstall_global_import_hook()
    def test_auto_enable_lazy_succeeds(self):
        r = auto_enable_lazy("test_pkg", mode="smart")
        assert r is not None
    def test_is_externally_managed_returns_bool(self):
        assert isinstance(is_externally_managed(), bool)
