#!/usr/bin/env python3
"""
#exonware/xwquery/tests/runner.py

Main test runner for xwquery - Production Excellence Edition
Orchestrates all test layer runners with Markdown output logging.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0
Generation Date: October 26, 2025

Usage:
    python tests/runner.py                # Run all tests
    python tests/runner.py --core         # Run only core tests
    python tests/runner.py --unit         # Run only unit tests
    python tests/runner.py --integration  # Run only integration tests

Output:
    - Terminal: Colored, formatted output
    - File: runner_out.md (Markdown-friendly format)
"""

import sys
import subprocess
from pathlib import Path
from datetime import datetime


class DualOutput:
    """Capture output for both terminal and Markdown file."""
    
    def __init__(self, output_file: Path):
        self.output_file = output_file
        self.terminal_lines = []
        self.markdown_lines = []
        
    def print(self, text: str, markdown_format: str = None):
        """Print to terminal and capture for Markdown."""
        # Terminal output
        print(text)
        self.terminal_lines.append(text)
        
        # Markdown output (use markdown_format if provided, else clean terminal output)
        if markdown_format:
            self.markdown_lines.append(markdown_format)
        else:
            # Clean emoji and special chars for Markdown
            cleaned = text.replace("="*80, "---")
            self.markdown_lines.append(cleaned)
    
    def save(self):
        """Save Markdown output to file."""
        header = f"""# Test Runner Output

**Library:** xwquery  
**Generated:** {datetime.now().strftime("%d-%b-%Y %H:%M:%S")}  
**Runner:** Main Orchestrator

---

"""
        content = header + "\n".join(self.markdown_lines) + "\n"
        self.output_file.write_text(content, encoding='utf-8')


def run_sub_runner(runner_path: Path, description: str, output: DualOutput) -> int:
    """Run a sub-runner and return exit code."""
    separator = "="*80
    output.print(f"\n{separator}", f"\n## {description}\n")
    output.print(f"[RUNNING] {description}", f"**Status:** Running...")
    output.print(f"{separator}\n", "")
    
    result = subprocess.run(
        [sys.executable, str(runner_path)],
        cwd=runner_path.parent,
        capture_output=True,
        text=True
    )
    
    # Print sub-runner output
    if result.stdout:
        output.print(result.stdout, f"```\n{result.stdout}\n```")
    if result.stderr:
        output.print(result.stderr, f"**Errors:**\n```\n{result.stderr}\n```")
    
    # Status
    status = "[OK] PASSED" if result.returncode == 0 else "[FAIL] FAILED"
    output.print(f"\n{status}", f"\n**Result:** {status}")
    
    return result.returncode


def main():
    """Main test runner function following GUIDELINES_DEV.md."""
    # Setup output logger
    test_dir = Path(__file__).parent
    output_file = test_dir / "runner_out.md"
    output = DualOutput(output_file)
    
    # Add src to Python path for testing
    src_path = test_dir.parent / "src"
    sys.path.insert(0, str(src_path))
    
    # Header
    header = "="*80
    output.print(header, "# Test Execution Report")
    output.print("xwquery Test Runner - Production Excellence Edition", 
                 f"**Library:** xwquery  \n**Type:** Main Orchestrator - Hierarchical Test Execution")
    output.print("Main Orchestrator - Hierarchical Test Execution", "")
    output.print(header, "---")
    
    # Parse arguments
    args = sys.argv[1:]
    
    # Define sub-runners
    core_runner = test_dir / "0.core" / "runner.py"
    unit_runner = test_dir / "1.unit" / "runner.py"
    integration_runner = test_dir / "2.integration" / "runner.py"
    
    exit_codes = []
    
    # Determine which tests to run
    if "--core" in args:
        if core_runner.exists():
            exit_codes.append(run_sub_runner(core_runner, "Core Tests", output))
        else:
            # Fallback: run core tests directly
            import pytest
            output.print("\n[INFO] Running core tests directly (no layer runner)", "\n**Running core tests directly**\n")
            exit_code = pytest.main(["-v", "--tb=short", str(test_dir / "0.core")])
            exit_codes.append(exit_code)
    
    elif "--unit" in args:
        if unit_runner.exists():
            exit_codes.append(run_sub_runner(unit_runner, "Unit Tests", output))
        else:
            # Fallback: run unit tests directly
            import pytest
            output.print("\n[INFO] Running unit tests directly (no layer runner)", "\n**Running unit tests directly**\n")
            exit_code = pytest.main(["-v", "--tb=short", str(test_dir / "1.unit")])
            exit_codes.append(exit_code)
    
    elif "--integration" in args:
        if integration_runner.exists():
            exit_codes.append(run_sub_runner(integration_runner, "Integration Tests", output))
        else:
            # Fallback: run integration tests directly
            import pytest
            output.print("\n[INFO] Running integration tests directly (no layer runner)", "\n**Running integration tests directly**\n")
            exit_code = pytest.main(["-v", "--tb=short", str(test_dir / "2.integration")])
            exit_codes.append(exit_code)
    
    else:
        # Run all tests in sequence
        msg_header = "\n[RUNNING] ALL Tests"
        msg_layers = "   Layers: 0.core -> 1.unit -> 2.integration"
        output.print(msg_header, "\n## Running All Test Layers")
        output.print(msg_layers, "\n**Execution Order:** 0.core -> 1.unit -> 2.integration\n")
        output.print("", "")
        
        # Core tests
        import pytest
        output.print(f"\n{'='*80}", "\n## Layer 0: Core Tests\n")
        output.print("[RUNNING] Layer 0: Core Tests", "**Status:** Running...")
        exit_code = pytest.main(["-v", "--tb=short", "-x", str(test_dir / "0.core")])
        exit_codes.append(exit_code)
        status = "[OK] PASSED" if exit_code == 0 else "[FAIL] FAILED"
        output.print(f"{status}\n", f"\n**Result:** {status}\n")
        
        # Unit tests (if any exist)
        unit_tests = list((test_dir / "1.unit").rglob("test_*.py"))
        if unit_tests:
            output.print(f"\n{'='*80}", "\n## Layer 1: Unit Tests\n")
            output.print("[RUNNING] Layer 1: Unit Tests", "**Status:** Running...")
            exit_code = pytest.main(["-v", "--tb=short", "-x", str(test_dir / "1.unit")])
            exit_codes.append(exit_code)
            status = "[OK] PASSED" if exit_code == 0 else "[FAIL] FAILED"
            output.print(f"{status}\n", f"\n**Result:** {status}\n")
        
        # Integration tests (if any exist)
        integration_tests = list((test_dir / "2.integration").rglob("test_*.py"))
        if integration_tests:
            output.print(f"\n{'='*80}", "\n## Layer 2: Integration Tests\n")
            output.print("[RUNNING] Layer 2: Integration Tests", "**Status:** Running...")
            exit_code = pytest.main(["-v", "--tb=short", "-x", str(test_dir / "2.integration")])
            exit_codes.append(exit_code)
            status = "[OK] PASSED" if exit_code == 0 else "[FAIL] FAILED"
            output.print(f"{status}\n", f"\n**Result:** {status}\n")
    
    # Print summary
    summary_header = f"\n{'='*80}"
    output.print(summary_header, f"\n---\n\n## Test Execution Summary")
    output.print("[SUMMARY] TEST EXECUTION SUMMARY", "")
    output.print(f"{'='*80}", "")
    
    total_runs = len(exit_codes)
    passed = sum(1 for code in exit_codes if code == 0)
    failed = total_runs - passed
    
    output.print(f"Total Layers: {total_runs}", f"- **Total Layers:** {total_runs}")
    output.print(f"Passed: {passed}", f"- **Passed:** {passed}")
    output.print(f"Failed: {failed}", f"- **Failed:** {failed}")
    
    # Final status
    if all(code == 0 for code in exit_codes):
        final_msg = "\n[SUCCESS] ALL TESTS PASSED!"
        output.print(final_msg, f"\n### {final_msg}")
        
        # Save output
        output.save()
        print(f"\n[INFO] Test results saved to: {output_file}")
        
        sys.exit(0)
    else:
        final_msg = "\n[FAIL] SOME TESTS FAILED!"
        output.print(final_msg, f"\n### {final_msg}")
        
        # Save output
        output.save()
        print(f"\n[INFO] Test results saved to: {output_file}")
        
        sys.exit(1)


if __name__ == "__main__":
    main()
