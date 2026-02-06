"""
Example Usage: Simple xwlazy Auto-Installation

This demonstrates how xwlazy automatically installs missing packages
when they are imported.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import sys
from pathlib import Path

# Configure UTF-8 encoding for Windows console
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, OSError):
        pass  # Fallback to default encoding

# Add the examples directory to the path so we can import simple_xwlazy
examples_dir = Path(__file__).parent.parent
sys.path.insert(0, str(examples_dir))

# =============================================================================
# Step 1: Import the package (this hooks xwlazy)
# =============================================================================

# When you import simple_xwlazy, it automatically hooks xwlazy
# No additional setup needed!
try:
    import simple_xwlazy
    print("✅ simple_xwlazy imported - xwlazy is now active!")
except ImportError as e:
    print(f"⚠️  Could not import simple_xwlazy: {e}")
    print("   This is expected if xwlazy is not installed.")
    print("   The example will still demonstrate the hook concept.")
    
    # Alternative: Hook xwlazy directly if available
    try:
        from exonware.xwlazy import config_package_lazy_install_enabled
        config_package_lazy_install_enabled("example", install_hook=True)
        print("✅ xwlazy hooked directly!")
    except ImportError:
        print("❌ xwlazy is not installed. Please install it first:")
        print("   pip install -e .")
        sys.exit(1)

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
