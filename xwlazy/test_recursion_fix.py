#!/usr/bin/env python3
"""Quick test to verify recursion fix."""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    from exonware.xwlazy import enable_lazy_imports, LazyLoadMode
    print("✅ Import successful")
    
    # Test enabling lazy imports
    enable_lazy_imports(LazyLoadMode.INTELLIGENT)
    print("✅ Lazy imports enabled")
    
    # Test importing a module
    import json
    print("✅ Standard module import works")
    
    print("\n✅ All tests passed - recursion fix verified!")
    
except RecursionError as e:
    print(f"❌ RecursionError still present: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

