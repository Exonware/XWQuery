#!/usr/bin/env python3
"""
XWQuery Converter Console
A command-line tool for converting query files between different formats.
Usage:
    convert <from_format> <to_format> <input_file> <output_file>
Example:
    convert xwqs sql input.xwqs output.sql
    convert sql xwquery query.sql query.xwqs
    convert cypher graphql data.cypher data.graphql
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: January 2, 2025
"""

import sys
from pathlib import Path
# Add src to path if running from examples directory
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))
# Test xwlazy auto-installation with colorama (should be in xwlazy TOML)
# This will trigger xwlazy to install colorama if it's not already installed
# Note: Import happens after xwquery import to avoid conflicts with xwsystem's colorama usage
USE_COLORS = False
Fore = Style = type('obj', (object,), {'__getattr__': lambda self, name: ''})()
from exonware.xwquery import XWQuery
# Test xwlazy auto-installation with tqdm (should be in xwlazy TOML)
# This demonstrates xwlazy's ability to automatically install missing packages
# The library must be listed in xwlazy_external_libs.toml for this to work
try:
    import tqdm
    HAS_TQDM = True
    # tqdm is now available for use (e.g., progress bars)
except ImportError:
    HAS_TQDM = False


def normalize_format(format_name: str) -> str:
    """
    Normalize format name to standard format.
    Maps common aliases to standard format names:
    - xwqs -> xwquery
    - xwquery -> xwquery
    """
    format_lower = format_name.lower().strip()
    # Map aliases to standard format names
    format_map = {
        'xwqs': 'xwquery',
        'xwqueryscript': 'xwquery',
        'xwquery_script': 'xwquery',
    }
    return format_map.get(format_lower, format_lower)


def convert_file(
    from_format: str,
    to_format: str,
    input_file: Path,
    output_file: Path
) -> None:
    """
    Convert a query file from one format to another.
    Args:
        from_format: Source format (e.g., 'xwqs', 'sql', 'cypher')
        to_format: Target format (e.g., 'sql', 'xwquery', 'graphql')
        input_file: Path to input file
        output_file: Path to output file
    """
    # Validate input file exists
    if not input_file.exists():
        print(f"Error: Input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)
    # Normalize format names
    from_format_norm = normalize_format(from_format)
    to_format_norm = normalize_format(to_format)
    try:
        # Read input file
        print(f"Reading {input_file}...")
        query_content = input_file.read_text(encoding='utf-8')
        if not query_content.strip():
            print(f"Warning: Input file is empty: {input_file}", file=sys.stderr)
            sys.exit(1)
        # Convert the query
        print(f"Converting from {from_format_norm} to {to_format_norm}...")
        # Handle xwquery format specially
        from exonware.xwquery.query.strategies.xwquery import XWQueryScriptStrategy
        if from_format_norm == 'xwquery':
            # Parse XWQuery script directly
            parser = XWQueryScriptStrategy()
            parsed = parser.parse_script(query_content)
            if to_format_norm == 'xwquery':
                # Already in xwquery format, return original
                converted_query = query_content
            else:
                converted_query = parsed.to_format(to_format_norm)
        elif to_format_norm == 'xwquery':
            # Converting TO xwquery format
            parser = XWQueryScriptStrategy()
            parsed = parser.from_format(query_content, from_format_norm)
            # Generate xwquery script from actions tree
            if hasattr(parsed, '_actions_tree') and parsed._actions_tree:
                # Use the strategy's from_actions_tree method to generate script
                xwquery_strategy = XWQueryScriptStrategy()
                converted_query = xwquery_strategy.from_actions_tree(parsed._actions_tree)
            else:
                # Fallback: return original query
                converted_query = query_content
        else:
            converted_query = XWQuery.convert(
                query_content,
                from_format=from_format_norm,
                to_format=to_format_norm
            )
        # Write output file
        print(f"Writing {output_file}...")
        output_file.parent.mkdir(parents=True, exist_ok=True)
        output_file.write_text(converted_query, encoding='utf-8')
        print("Conversion successful!")
        print(f"  Input:  {input_file}")
        print(f"  Output: {output_file}")
    except FileNotFoundError as e:
        print(f"Error: File not found: {e}", file=sys.stderr)
        sys.exit(1)
    except PermissionError as e:
        print(f"Error: Permission denied: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error during conversion: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


def main():
    """Main entry point for the converter console."""
    # Check if first argument is 'convert' command
    if len(sys.argv) >= 2 and sys.argv[1].lower() == 'convert':
        # Command format: convert <from_format> <to_format> <input_file> <output_file>
        if len(sys.argv) < 6:
            print("Usage: convert <from_format> <to_format> <input_file> <output_file>")
            print("\nExamples:")
            print("  convert xwqs sql input.xwqs output.sql")
            print("  convert sql xwquery query.sql query.xwqs")
            print("  convert cypher graphql data.cypher data.graphql")
            print("  convert sql mongodb query.sql query.mongodb")
            print("\nSupported formats include:")
            print("  - SQL, CYPHER, GRAPHQL, SPARQL, N1QL, PARTIQL")
            print("  - MONGODB, GREMLIN, JMESPATH, JQ, JSONIQ")
            print("  - XWQUERY (or XWQS), and many more...")
            print("\nNote: Format names are case-insensitive.")
            print("      'xwqs' is an alias for 'xwquery'.")
            sys.exit(1)
        from_format = sys.argv[2]
        to_format = sys.argv[3]
        input_file = Path(sys.argv[4])
        output_file = Path(sys.argv[5])
    else:
        # Direct format: <from_format> <to_format> <input_file> <output_file>
        if len(sys.argv) < 5:
            print("Usage:")
            print("  convert <from_format> <to_format> <input_file> <output_file>")
            print("  OR")
            print("  <from_format> <to_format> <input_file> <output_file>")
            print("\nExamples:")
            print("  convert xwqs sql input.xwqs output.sql")
            print("  python converter_console.py convert xwqs sql input.xwqs output.sql")
            print("  python converter_console.py sql xwquery query.sql query.xwqs")
            print("\nSupported formats include:")
            print("  - SQL, CYPHER, GRAPHQL, SPARQL, N1QL, PARTIQL")
            print("  - MONGODB, GREMLIN, JMESPATH, JQ, JSONIQ")
            print("  - XWQUERY (or XWQS), and many more...")
            print("\nNote: Format names are case-insensitive.")
            print("      'xwqs' is an alias for 'xwquery'.")
            sys.exit(1)
        from_format = sys.argv[1]
        to_format = sys.argv[2]
        input_file = Path(sys.argv[3])
        output_file = Path(sys.argv[4])
    convert_file(from_format, to_format, input_file, output_file)
if __name__ == "__main__":
    main()
