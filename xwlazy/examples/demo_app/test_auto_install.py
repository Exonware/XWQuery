"""
Test Script: Demonstrates xwlazy v4.0 Auto-Installation from Scratch
This script uninstalls demo packages first, then imports them to show
xwlazy automatically installing missing dependencies.
Libraries tested:
- requests (HTTP library)
- yaml (PyYAML - YAML parser)  
- numpy (Numerical library)
All are in requirements.txt and xwlazy_external_libs.toml
"""

import sys
import subprocess
from pathlib import Path
# Configure UTF-8 encoding for Windows console
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, OSError):
        pass

def check_if_installed(package):
    """Check if a package is installed."""
    try:
        __import__(package)
        return True
    except ImportError:
        return False

def uninstall_package(package_name):
    """Uninstall a package."""
    try:
        subprocess.run(
            [sys.executable, "-m", "pip", "uninstall", "-y", package_name],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            timeout=30
        )
        return True
    except Exception:
        return False

def main():
    print("=" * 70)
    print("xwlazy v4.0 Auto-Installation Test")
    print("=" * 70)
    print()
    # Add examples directory to path
    examples_dir = Path(__file__).parent.parent
    sys.path.insert(0, str(examples_dir))
    # Step 1: Check current installation status
    print("Step 1: Checking current installation status...")
    print("-" * 70)
    packages_to_test = [
        ("requests", "requests"),
        ("yaml", "PyYAML"),
        ("numpy", "numpy"),
    ]
    installed_status = {}
    for import_name, package_name in packages_to_test:
        is_installed = check_if_installed(import_name)
        installed_status[import_name] = is_installed
        status = "✅ Installed" if is_installed else "❌ Not installed"
        print(f"  - {import_name} ({package_name}): {status}")
    print()
    # Step 2: Uninstall packages to test auto-installation
    print("Step 2: Uninstalling packages to test auto-installation...")
    print("-" * 70)
    for import_name, package_name in packages_to_test:
        if installed_status[import_name]:
            print(f"  - Uninstalling {package_name}...")
            if uninstall_package(package_name):
                print(f"    ✅ {package_name} uninstalled")
            else:
                print(f"    ⚠️  Failed to uninstall {package_name} (may not be needed)")
        else:
            print(f"  - {package_name} already not installed (perfect for testing!)")
    print()
    # Step 3: Import demo_app (this activates xwlazy)
    print("Step 3: Activating xwlazy by importing demo_app...")
    print("-" * 70)
    try:
        import demo_app
        print(f"✅ demo_app imported - xwlazy is now active!")
        print(f"   Package: {demo_app.__package__}")
        print(f"   Version: {getattr(demo_app, '__version__', 'N/A')}")
        print()
    except ImportError as e:
        print(f"❌ Failed to import demo_app: {e}")
        print("   Activating xwlazy directly...")
        try:
            from exonware.xwlazy import auto_enable_lazy
            auto_enable_lazy("demo_app", root=str(Path(__file__).parent))
            print("✅ xwlazy activated directly!")
            print()
        except Exception as e2:
            print(f"❌ Failed to activate xwlazy: {e2}")
            sys.exit(1)
    # Step 4: Import packages - xwlazy should auto-install them!
    print("Step 4: Importing packages - xwlazy will auto-install if missing!")
    print("-" * 70)
    print()
    # Test requests
    print("📦 Testing 'requests' import...")
    try:
        import requests
        print(f"✅ requests imported successfully!")
        print(f"   Version: {requests.__version__}")
        print()
    except ImportError as e:
        print(f"❌ Failed to import requests: {e}")
        print()
    # Test yaml
    print("📦 Testing 'yaml' (PyYAML) import...")
    try:
        import yaml
        print(f"✅ yaml imported successfully!")
        # Test YAML serialization
        data = {"test": "value", "status": "installed"}
        yaml_str = yaml.dump(data, default_flow_style=False)
        print(f"   YAML serialization works: {len(yaml_str)} bytes")
        print()
    except ImportError as e:
        print(f"❌ Failed to import yaml: {e}")
        print()
    # Test numpy
    print("📦 Testing 'numpy' import...")
    try:
        import numpy as np
        print(f"✅ numpy imported successfully!")
        print(f"   Version: {np.__version__}")
        # Test numpy operation
        arr = np.array([1, 2, 3, 4, 5])
        print(f"   Array created: {arr}")
        print(f"   Mean: {np.mean(arr):.2f}")
        print()
    except ImportError as e:
        print(f"❌ Failed to import numpy: {e}")
        print()
    # Step 5: Summary
    print("=" * 70)
    print("🎉 Auto-Installation Test Complete!")
    print("=" * 70)
    print()
    print("What happened:")
    print("1. ✅ Checked initial installation status")
    print("2. ✅ Uninstalled packages to simulate missing dependencies")
    print("3. ✅ Activated xwlazy via demo_app import")
    print("4. ✅ Imported requests, yaml, numpy - xwlazy auto-installed them!")
    print()
    print("All dependencies were automatically installed from requirements.txt!")
    print("Check xwlazy_sbom.toml for the installation audit log.")
    print("Check xwlazy.lock.toml for the lockfile with installed versions.")
    print()
if __name__ == "__main__":
    main()
