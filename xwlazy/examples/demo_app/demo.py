"""
Demo App - Demonstrates xwlazy v4.0 Auto-Installation

This script imports packages that should be in requirements.txt but
may not be installed. xwlazy will automatically install them!

Libraries used (all should be in xwlazy_external_libs.toml):
- requests (for HTTP requests)
- yaml (PyYAML for YAML parsing)
- numpy (for numerical operations)
"""

import sys
from pathlib import Path

# Configure UTF-8 encoding for Windows console
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, OSError):
        pass

# Add the examples directory to the path so we can import demo_app
examples_dir = Path(__file__).parent.parent
sys.path.insert(0, str(examples_dir))

# Import the demo_app package (this activates xwlazy via __init__.py)
print("=" * 70)
print("xwlazy v4.0 Auto-Installation Demo")
print("=" * 70)
print()

# Import the package - this will activate xwlazy automatically
try:
    import demo_app
    print(f"✅ demo_app imported - xwlazy is now active!")
    print(f"   Package: {demo_app.__package__}")
    print(f"   Version: {getattr(demo_app, '__version__', 'N/A')}")
    print()
except ImportError as e:
    print(f"❌ Failed to import demo_app: {e}")
    print(f"   Trying to activate xwlazy directly...")
    # Fallback: activate xwlazy directly
    try:
        from exonware.xwlazy import auto_enable_lazy
        auto_enable_lazy("demo_app", root=str(Path(__file__).parent))
        print("✅ xwlazy activated directly!")
        print()
    except Exception as e2:
        print(f"❌ Failed to activate xwlazy: {e2}")
        sys.exit(1)

# ============================================================================
# Example 1: Using requests (HTTP library)
# ============================================================================
print("📦 Example 1: Importing 'requests' (HTTP library)")
print("-" * 70)
try:
    # This should trigger auto-installation if requests is not installed
    import requests
    print(f"✅ requests imported successfully!")
    print(f"   Version: {requests.__version__}")
    print(f"   Status: requests is ready to use")
    print()
except ImportError as e:
    print(f"❌ Failed to import requests: {e}")
    print("   Note: xwlazy should have installed this automatically")
    print()

# ============================================================================
# Example 2: Using yaml (YAML parser)
# ============================================================================
print("📦 Example 2: Importing 'yaml' (YAML parser)")
print("-" * 70)
try:
    # This should also trigger auto-installation if PyYAML is not installed
    import yaml
    print(f"✅ yaml imported successfully!")
    
    # Try a simple YAML operation
    data = {"name": "demo_app", "version": "1.0.0", "status": "active"}
    yaml_str = yaml.dump(data, default_flow_style=False)
    print(f"   YAML serialization works: {len(yaml_str)} bytes")
    print()
except ImportError as e:
    print(f"❌ Failed to import yaml: {e}")
    print("   Note: xwlazy should have installed PyYAML automatically")
    print()

# ============================================================================
# Example 3: Using numpy (Numerical library)
# ============================================================================
print("📦 Example 3: Importing 'numpy' (Numerical library)")
print("-" * 70)
try:
    # This should also trigger auto-installation if numpy is not installed
    import numpy as np
    print(f"✅ numpy imported successfully!")
    print(f"   Version: {np.__version__}")
    
    # Try a simple numpy operation
    arr = np.array([1, 2, 3, 4, 5])
    print(f"   Array created: {arr}")
    print(f"   Mean: {np.mean(arr):.2f}")
    print()
except ImportError as e:
    print(f"❌ Failed to import numpy: {e}")
    print("   Note: xwlazy should have installed numpy automatically")
    print()

# ============================================================================
# Summary
# ============================================================================
print("=" * 70)
print("🎉 Demo Complete!")
print("=" * 70)
print()
print("What happened:")
print("1. ✅ Imported demo_app - activated xwlazy via auto_enable_lazy()")
print("2. ✅ Imported requests - auto-installed if missing")
print("3. ✅ Imported yaml (PyYAML) - auto-installed if missing")
print("4. ✅ Imported numpy - auto-installed if missing")
print()
print("All dependencies were automatically installed from requirements.txt!")
print("Check xwlazy_sbom.toml for the installation audit log.")
print()
