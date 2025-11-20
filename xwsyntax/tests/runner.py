#!/usr/bin/env python3
#exonware/xwsyntax/tests/runner.py

"""
Main test runner for xwsyntax - Production Excellence Edition
Orchestrates all test layer runners with Markdown output logging.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 29-Oct-2025

Usage:
    python tests/runner.py                # Run all tests
    python tests/runner.py --core         # Run only core tests
    python tests/runner.py --unit         # Run only unit tests
    python tests/runner.py --integration  # Run only integration tests
    python tests/runner.py --advance      # Run only advance tests (v1.0.0+)
    python tests/runner.py --security     # Run only security tests
    python tests/runner.py --performance  # Run only performance tests

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

**Library:** xwsyntax  
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
    output.print(f"📂 {description}", f"**Status:** Running...")
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
    status = "✅ PASSED" if result.returncode == 0 else "❌ FAILED"
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
    output.print("xwsyntax Test Runner - Production Excellence Edition", 
                 f"**Library:** xwsyntax  \n**Type:** Main Orchestrator - Hierarchical Test Execution")
    output.print("Main Orchestrator - Hierarchical Test Execution", "")
    output.print(header, "---")
    
    # Parse arguments
    args = sys.argv[1:]
    
    # Define sub-runners
    core_runner = test_dir / "0.core" / "runner.py"
    unit_runner = test_dir / "1.unit" / "runner.py"
    integration_runner = test_dir / "2.integration" / "runner.py"
    advance_runner = test_dir / "3.advance" / "runner.py"
    
    exit_codes = []
    
    # Determine which tests to run
    if "--core" in args:
        if core_runner.exists():
            exit_codes.append(run_sub_runner(core_runner, "Core Tests", output))
    
    elif "--unit" in args:
        if unit_runner.exists():
            exit_codes.append(run_sub_runner(unit_runner, "Unit Tests", output))
    
    elif "--integration" in args:
        if integration_runner.exists():
            exit_codes.append(run_sub_runner(integration_runner, "Integration Tests", output))
    
    elif "--advance" in args:
        if advance_runner.exists():
            exit_codes.append(run_sub_runner(advance_runner, "Advance Tests", output))
        else:
            msg = "\n⚠️  Advance tests not available (requires v1.0.0)"
            output.print(msg, f"\n> {msg}")
    
    elif "--security" in args or "--performance" in args or "--usability" in args or "--maintainability" in args or "--extensibility" in args:
        # Forward to advance runner if exists
        if advance_runner.exists():
            result = subprocess.run([sys.executable, str(advance_runner)] + args)
            exit_codes.append(result.returncode)
        else:
            msg = "\n⚠️  Advance tests not available (requires v1.0.0)"
            output.print(msg, f"\n> {msg}")
    
    else:
        # Run all tests in sequence
        msg_header = "\n🚀 Running: ALL Tests"
        msg_layers = "   Layers: 0.core → 1.unit → 2.integration → 3.advance"
        output.print(msg_header, "\n## Running All Test Layers")
        output.print(msg_layers, f"\n**Execution Order:** 0.core → 1.unit → 2.integration → 3.advance\n")
        output.print("", "")
        
        # Core tests
        if core_runner.exists():
            exit_codes.append(run_sub_runner(core_runner, "Layer 0: Core Tests", output))
        
        # Unit tests
        if unit_runner.exists():
            exit_codes.append(run_sub_runner(unit_runner, "Layer 1: Unit Tests", output))
        
        # Integration tests
        if integration_runner.exists():
            exit_codes.append(run_sub_runner(integration_runner, "Layer 2: Integration Tests", output))
        
        # Advance tests (if available)
        if advance_runner.exists():
            exit_codes.append(run_sub_runner(advance_runner, "Layer 3: Advance Tests", output))
    
    # Print summary
    summary_header = f"\n{'='*80}"
    output.print(summary_header, f"\n---\n\n## 📊 Test Execution Summary")
    output.print("📊 TEST EXECUTION SUMMARY", "")
    output.print(f"{'='*80}", "")
    
    total_runs = len(exit_codes)
    passed = sum(1 for code in exit_codes if code == 0)
    failed = total_runs - passed
    
    output.print(f"Total Layers: {total_runs}", f"- **Total Layers:** {total_runs}")
    output.print(f"Passed: {passed}", f"- **Passed:** {passed}")
    output.print(f"Failed: {failed}", f"- **Failed:** {failed}")
    
    # Final status
    if all(code == 0 for code in exit_codes):
        final_msg = "\n✅ ALL TESTS PASSED!"
        output.print(final_msg, f"\n### {final_msg}")
        
        # Save output
        output.save()
        print(f"\n📝 Test results saved to: {output_file}")
        
        sys.exit(0)
    else:
        final_msg = "\n❌ SOME TESTS FAILED!"
        output.print(final_msg, f"\n### {final_msg}")
        
        # Save output
        output.save()
        print(f"\n📝 Test results saved to: {output_file}")
        
        sys.exit(1)


if __name__ == "__main__":
    main()

