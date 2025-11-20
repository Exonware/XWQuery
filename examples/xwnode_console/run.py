#!/usr/bin/env python3
"""
XWQuery Interactive Console Runner

Entry point script for running the interactive console.

NOTE: This console requires xwsystem and xwnode to be installed.
      For development, install with: tools/ci/install_dev.bat xwsystem
                                     tools/ci/install_dev.bat xwnode
"""

import argparse
import sys
from pathlib import Path

# Add examples directory for local console imports
xwnode_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(xwnode_root / "examples"))

# Normal imports - packages installed via pip (editable for dev)
from xwnode_console.console import main


def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="XWQuery Interactive Console - All 56 operations available!",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Usage Examples:
  python run.py                    # Run with default settings
  python run.py --seed 42          # Run with specific random seed
  python run.py --verbose          # Run with verbose output
  python run.py --file queries.xwq # Execute queries from file (future)

Console Commands:
  .help              - Show help and basic commands
  .examples          - Show ALL 56 operations with examples
  .collections       - List available collections
  .show <name>       - Show collection sample data
  .random            - Show random example query
  .exit              - Exit console

Type .examples in the console to see all 56 operations!
        """
    )
    
    parser.add_argument(
        '--seed',
        type=int,
        default=42,
        help='Random seed for data generation (default: 42)'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output'
    )
    
    parser.add_argument(
        '--file', '-f',
        type=str,
        help='Execute queries from file (not yet implemented)'
    )
    
    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()
    
    if args.file:
        print("File execution not yet implemented")
        print("Run without --file for interactive mode")
        sys.exit(1)
    
    try:
        main(seed=args.seed, verbose=args.verbose)
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Exiting...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)

