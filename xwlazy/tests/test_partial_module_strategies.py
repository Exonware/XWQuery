"""
Test different strategies for detecting partially initialized modules.

Tests all detection strategies against json_run.py scenario.

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

from exonware.xwlazy.module.partial_module_detector import (
    DetectionStrategy,
    PartialModuleDetector,
    mark_module_importing,
    unmark_module_importing
)

def test_strategy(strategy: DetectionStrategy, json_run_path: Path) -> tuple[bool, str]:
    """
    Test a specific detection strategy with json_run.py.
    
    Returns:
        (success: bool, output: str)
    """
    import subprocess
    
    # Set environment variable to use this strategy
    env = os.environ.copy()
    env['XWLAZY_PARTIAL_DETECTION_STRATEGY'] = strategy.value
    
    try:
        result = subprocess.run(
            [sys.executable, str(json_run_path)],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=str(json_run_path.parent),
            env=env
        )
        
        success = result.returncode == 0
        output = result.stdout + result.stderr
        
        return success, output
    except subprocess.TimeoutExpired:
        return False, "TIMEOUT: Script took too long"
    except Exception as e:
        return False, f"ERROR: {e}"

def main():
    """Test all strategies."""
    # json_run.py is in xwsystem which is sibling to xwlazy
    # project_root is xwlazy, so go up one level to exonware, then into xwsystem
    json_run_path = project_root.parent / "xwsystem" / "examples" / "lazy_mode_usage" / "json_run.py"
    
    # Try alternative paths
    if not json_run_path.exists():
        # Try from current working directory
        alt_path = Path("xwsystem/examples/lazy_mode_usage/json_run.py")
        if alt_path.exists():
            json_run_path = alt_path.resolve()
        else:
            print(f"❌ json_run.py not found at {json_run_path}")
            print(f"   Also tried: {alt_path.resolve()}")
            print(f"   Current dir: {Path.cwd()}")
            print(f"   Project root: {project_root}")
            return
    
    print("=" * 80)
    print("Testing Partial Module Detection Strategies")
    print("=" * 80)
    print(f"Test file: {json_run_path}\n")
    
    strategies = [
        DetectionStrategy.FRAME_STACK,
        DetectionStrategy.ATTRIBUTE_CHECK,
        DetectionStrategy.IMPORT_LOCK,
        DetectionStrategy.MODULE_STATE,
        DetectionStrategy.HYBRID,
    ]
    
    results = {}
    
    for strategy in strategies:
        print(f"\n{'='*80}")
        print(f"Testing Strategy: {strategy.value.upper()}")
        print(f"{'='*80}")
        
        success, output = test_strategy(strategy, json_run_path)
        results[strategy] = (success, output)
        
        if success:
            print(f"✅ Strategy {strategy.value} PASSED")
            # Show last few lines of output
            lines = output.split('\n')
            print("\nLast 10 lines of output:")
            for line in lines[-10:]:
                if line.strip():
                    print(f"  {line}")
        else:
            print(f"❌ Strategy {strategy.value} FAILED")
            # Show error
            if "TIMEOUT" in output or "ERROR" in output:
                print(f"  {output}")
            else:
                # Extract error from stderr
                error_lines = [l for l in output.split('\n') if 'Error' in l or 'Traceback' in l or 'ImportError' in l]
                if error_lines:
                    print("\nError details:")
                    for line in error_lines[:5]:
                        print(f"  {line}")
    
    # Summary
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    
    passed = [s for s, (success, _) in results.items() if success]
    failed = [s for s, (success, _) in results.items() if not success]
    
    print(f"\n✅ Passed: {len(passed)}/{len(strategies)}")
    for strategy in passed:
        print(f"   - {strategy.value}")
    
    if failed:
        print(f"\n❌ Failed: {len(failed)}/{len(strategies)}")
        for strategy in failed:
            print(f"   - {strategy.value}")
    
    # Recommend best strategy
    if passed:
        print(f"\n💡 Recommended Strategy: {passed[0].value}")
        if DetectionStrategy.HYBRID in passed:
            print("   (HYBRID is most comprehensive)")
    else:
        print("\n⚠️  All strategies failed - need to investigate further")

if __name__ == "__main__":
    main()
