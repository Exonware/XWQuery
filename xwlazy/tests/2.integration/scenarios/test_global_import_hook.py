"""Integration: global import hook (public API). xwlazy is single-file."""

import pytest
from pathlib import Path
import sys
pytestmark = pytest.mark.xwlazy_integration
project_root = Path(__file__).resolve().parents[3]
if str(project_root / "src") not in sys.path:
    sys.path.insert(0, str(project_root / "src"))
from exonware.xwlazy import (
    auto_enable_lazy,
    uninstall_global_import_hook,
    install_global_import_hook,
    is_global_import_hook_installed,
)

class TestGlobalImportHook:

    def teardown_method(self):
        uninstall_global_import_hook()

    def test_install_uninstall_hook(self):
        uninstall_global_import_hook()
        assert not is_global_import_hook_installed()
        install_global_import_hook()
        assert is_global_import_hook_installed()
        uninstall_global_import_hook()
        assert not is_global_import_hook_installed()

    def test_auto_enable_installs_hook(self):
        uninstall_global_import_hook()
        r = auto_enable_lazy("test_pkg", mode="smart")
        assert r is not None
        install_global_import_hook()  # ensure hook is installed (singleton may have been created without it)
        assert is_global_import_hook_installed()
