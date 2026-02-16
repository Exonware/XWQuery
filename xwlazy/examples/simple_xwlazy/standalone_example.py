"""
Standalone Example: Simple xwlazy Auto-Installation

This is a standalone example that doesn't require importing simple_xwlazy.
It demonstrates the hook directly.

Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

# =============================================================================
# Step 1: Hook xwlazy (this is the one-liner!)
# =============================================================================

from exonware.xwlazy import config_package_lazy_install_enabled

# This is the simplest way to hook xwlazy - just one line!
# Replace "my_package" with your actual package name
config_package_lazy_install_enabled("my_package", install_hook=True)

print("✅ xwlazy is now active and will auto-install missing packages!")

# =============================================================================
# Step 2: Import any package - it will be auto-installed if missing
# =============================================================================

# Try importing a package that might not be installed
# xwlazy will automatically install it for you!

try:
    # This will trigger automatic installation if pandas is not installed
    import pandas as pd
    print("✅ pandas imported successfully!")
    print(f"   Pandas version: {pd.__version__}")
except ImportError as e:
    print(f"❌ Failed to import pandas: {e}")

# =============================================================================
# Step 3: Use the package normally
# =============================================================================

# Once installed, use it like normal
try:
    df = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]})
    print("✅ Created DataFrame successfully!")
    print(f"   DataFrame:\n{df}")
except NameError:
    print("⚠️  pandas not available")

# =============================================================================
# Step 4: Try another package
# =============================================================================

try:
    # This will also be auto-installed if missing
    import numpy as np
    print("✅ numpy imported successfully!")
    print(f"   NumPy version: {np.__version__}")
except ImportError as e:
    print(f"❌ Failed to import numpy: {e}")

print("\n🎉 Example complete! xwlazy handled everything automatically.")
print("\n💡 Key takeaway: Just one line hooks xwlazy:")
print("   config_package_lazy_install_enabled('my_package', install_hook=True)")
