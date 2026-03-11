#!/usr/bin/env python3
#exonware/xwsyntax/tests/verify_installation.py
"""
Verify xwsyntax installation and basic functionality.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Usage:
    python tests/verify_installation.py
"""

import sys
from pathlib import Path
# Add src to path
src_path = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(src_path))


def verify_import():
    """Verify library can be imported."""
    try:
        import exonware.xwsyntax
        print("✅ Import successful")
        return True
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False


def verify_basic_functionality():
    """Verify basic operations work."""
    try:
        from exonware.xwsyntax import BidirectionalGrammar
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"test": "value"}')
        output = grammar.generate(ast)
        print("✅ Basic functionality works")
        print(f"   Roundtrip: {output}")
        return True
    except Exception as e:
        print(f"❌ Basic functionality failed: {e}")
        return False


def verify_dependencies():
    """Verify critical dependencies are available."""
    try:
        import lark
        print("✅ lark available")
        try:
            import exonware.xwnode
            print("✅ exonware-xwnode available")
        except ImportError:
            print("⚠️  exonware-xwnode not available (optimization will use fallback)")
        return True
    except ImportError as e:
        print(f"❌ Dependency check failed: {e}")
        return False


def main():
    """Run all verification checks."""
    print("="*80)
    print("🔍 Verifying xwsyntax installation...")
    print("="*80)
    print()
    checks = [
        ("Import", verify_import),
        ("Basic Functionality", verify_basic_functionality),
        ("Dependencies", verify_dependencies),
    ]
    results = []
    for name, check_func in checks:
        print(f"Testing {name}...")
        results.append(check_func())
        print()
    print("="*80)
    if all(results):
        print("🎉 SUCCESS! xwsyntax is ready to use!")
        print("="*80)
        sys.exit(0)
    else:
        print("💥 FAILED! Some checks did not pass.")
        print("="*80)
        sys.exit(1)
if __name__ == "__main__":
    main()
