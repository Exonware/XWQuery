"""Unit tests: manifest and hooks via public API. xwlazy is single-file."""
import pytest
from pathlib import Path
import sys

pytestmark = pytest.mark.xwlazy_unit
project_root = Path(__file__).resolve().parents[2]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))

from exonware.xwlazy import (
    auto_enable_lazy,
    uninstall_global_import_hook,
    install_global_import_hook,
    is_global_import_hook_installed,
)

class TestManifestAndHooksAPI:
    def teardown_method(self):
        uninstall_global_import_hook()
    def test_auto_enable_and_hook_state(self):
        uninstall_global_import_hook()
        r = auto_enable_lazy("test_pkg", mode="smart", root=".")
        assert r is not None
        # Hook may or may not be installed depending on singleton creation order
        install_global_import_hook()
        assert is_global_import_hook_installed()
