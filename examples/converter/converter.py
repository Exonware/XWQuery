#!/usr/bin/env python3
"""
#exonware/xwquery/examples/converter/converter.py
Simple Query Format Converter
A console tool to convert queries between different formats.
Usage: python converter.py <from_format> <to_format> <query>
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""

import sys
import os
from pathlib import Path
# Suppress xwlazy installation messages for cleaner output
# Set XWLAZY_LOG_INSTALL=0 to hide installation logs
if "XWLAZY_LOG_INSTALL" not in os.environ:
    os.environ["XWLAZY_LOG_INSTALL"] = "0"
# Add src to path if running from examples directory
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))
from exonware.xwquery import XWQuery


def main():
    """Main converter function."""
    # Parse command line arguments
    if len(sys.argv) < 4:
        print("Usage: python converter.py <from_format> <to_format> <query>")
        print("\nExample:")
        print('  python converter.py SQL CYPHER "SELECT name, age FROM users WHERE age > 25"')
        print('  python converter.py CYPHER GRAPHQL "MATCH (n:User) RETURN n.name, n.age"')
        print("\nSupported formats include: SQL, CYPHER, GRAPHQL, SPARQL, N1QL, PARTIQL, etc.")
        sys.exit(1)
    from_format = sys.argv[1].upper()
    to_format = sys.argv[2].upper()
    query = sys.argv[3]
    # For multi-word queries, join all remaining arguments
    if len(sys.argv) > 4:
        query = " ".join(sys.argv[3:])
    try:
        # Convert the query
        converted_query = XWQuery.convert(
            query,
            from_format=from_format,
            to_format=to_format
        )
        # Output the result
        print(converted_query)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
if __name__ == "__main__":
    main()
