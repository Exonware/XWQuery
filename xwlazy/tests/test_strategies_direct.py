"""
Direct test of partial module detection strategies.

Tests strategies directly by running json_run.py with each strategy.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 27-Dec-2025
"""

import sys
import os
from pathlib import Path

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

# Configure UTF-8 for Windows
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

from exonware.xwlazy.module.partial_module_detector import DetectionStrategy

def test_strategy_direct(strategy: DetectionStrategy) -> tuple[bool, str]:
    """
    Test strategy by directly importing and running json_run logic.
    
    Returns:
        (success: bool, error_message: str)
    """
    # Set environment variable
    os.environ['XWLAZY_PARTIAL_DETECTION_STRATEGY'] = strategy.value
    
    try:
        # Clear any existing imports
        modules_to_clear = [k for k in sys.modules.keys() if k.startswith('exonware.xwsystem')]
        for mod in modules_to_clear:
            del sys.modules[mod]
        
        # Import xwlazy and enable lazy mode
        from exonware.xwlazy import auto_enable_lazy
        auto_enable_lazy("xwsystem", mode="smart")
        
        # Try the critical import
        from exonware.xwsystem.io.serialization.formats.binary import BsonSerializer as serializer
        
        # Try calling encode (this is what fails)
        data = {"name": "John", "age": 30}
        result = serializer.encode(data)
        
        return True, "Success"
        
    except Exception as e:
        return False, str(e)
    finally:
        # Clean up
        if 'XWLAZY_PARTIAL_DETECTION_STRATEGY' in os.environ:
            del os.environ['XWLAZY_PARTIAL_DETECTION_STRATEGY']

def main():
    """Test all strategies directly."""
    print("=" * 80)
    print("Testing Partial Module Detection Strategies (Direct)")
    print("=" * 80)
    print()
    
    strategies = [
        DetectionStrategy.FRAME_STACK,
        DetectionStrategy.ATTRIBUTE_CHECK,
        DetectionStrategy.IMPORT_LOCK,
        DetectionStrategy.MODULE_STATE,
        DetectionStrategy.HYBRID,
    ]
    
    results = {}
    
    for strategy in strategies:
        print(f"Testing Strategy: {strategy.value.upper()}")
        print("-" * 80)
        
        success, message = test_strategy_direct(strategy)
        results[strategy] = (success, message)
        
        if success:
            print(f"✅ Strategy {strategy.value} PASSED")
            print(f"   Message: {message}\n")
        else:
            print(f"❌ Strategy {strategy.value} FAILED")
            print(f"   Error: {message}\n")
    
    # Summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    passed = [s for s, (success, _) in results.items() if success]
    failed = [s for s, (success, _) in results.items() if not success]
    
    print(f"\n✅ Passed: {len(passed)}/{len(strategies)}")
    for strategy in passed:
        print(f"   - {strategy.value}")
    
    if failed:
        print(f"\n❌ Failed: {len(failed)}/{len(strategies)}")
        for strategy in failed:
            error_msg = results[strategy][1]
            print(f"   - {strategy.value}: {error_msg[:100]}...")
    
    # Recommend best strategy
    if passed:
        print(f"\n💡 Recommended Strategy: {passed[0].value}")
        if DetectionStrategy.HYBRID in passed:
            print("   (HYBRID is most comprehensive)")
    else:
        print("\n⚠️  All strategies failed - need to investigate further")

if __name__ == "__main__":
    main()

