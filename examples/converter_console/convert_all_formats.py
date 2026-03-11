#!/usr/bin/env python3
"""
Convert XWQuery Script files to all supported formats.
This script automatically converts each level (easy, medium, hard) 
to all supported query formats, organized by format type.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
"""

import sys
from pathlib import Path
# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))
from exonware.xwquery import XWQuery
from exonware.xwquery.defs import FormatType
# List of all supported formats to convert to
SUPPORTED_FORMATS = [
    # Core formats
    'sql',
    # Graph query languages
    'graphql',
    'cypher',
    'gremlin',
    'sparql',
    'gql',
    # Document databases
    'mongodb',
    'mql',
    'couchdb',
    'cql',
    # Search engines
    'elasticsearch',
    'eql',
    # Time series
    'promql',
    'flux',
    'logql',
    # Data query languages
    'jmespath',
    'jq',
    'jsoniq',
    'xpath',
    'xquery',
    # Others
    'datalog',
    'linq',
    'n1ql',
    'partiql',
    'hiveql',
    'hql',
    'pig',
    'kql',
    'reql',
    'rql',
]
# Levels to convert
LEVELS = ['easy', 'medium', 'hard']


def convert_level_to_all_formats(level: str, input_dir: Path, output_base_dir: Path):
    """
    Convert a level XWQuery script to all supported formats.
    Output is organized by format type (sql/, graphql/, etc.)
    Args:
        level: Level name (easy, medium, hard)
        input_dir: Directory containing input files
        output_base_dir: Base directory to write output files (organized by format)
    """
    input_file = input_dir / f"level_{level}.xwqs"
    if not input_file.exists():
        print(f"[WARN] Input file not found: {input_file}")
        return
    print(f"\n{'='*70}")
    print(f"Converting level_{level}.xwqs to all formats...")
    print(f"{'='*70}")
    # Read input file
    try:
        query_content = input_file.read_text(encoding='utf-8')
        print(f"[OK] Read input file: {input_file.name}")
    except Exception as e:
        print(f"[ERROR] Error reading input file: {e}")
        return
    # Convert to each format
    successful = 0
    failed = 0
    for format_name in SUPPORTED_FORMATS:
        # Create format-specific directory
        format_dir = output_base_dir / format_name
        format_dir.mkdir(parents=True, exist_ok=True)
        # Output file in format directory
        output_file = format_dir / f"level_{level}.{format_name}"
        try:
            # Convert using XWQuery
            from exonware.xwquery.query.strategies.xwquery import XWQueryScriptStrategy
            parser = XWQueryScriptStrategy()
            parsed = parser.parse_script(query_content)
            try:
                # Try to get better conversion by using XWQuery.convert which may handle it better
                try:
                    converted_query = XWQuery.convert(
                        query_content,
                        from_format='xwquery',
                        to_format=format_name
                    )
                except Exception:
                    # Fallback to strategy method
                    converted_query = parsed.to_format(format_name)
                # Check if output is meaningful (not just placeholder)
                is_placeholder = (
                    not converted_query or
                    converted_query.strip() == "" or
                    converted_query.strip() in [
                        "SELECT * FROM table",
                        "MATCH (n) RETURN n",
                        "query { }",
                        "SELECT ?s ?p ?o WHERE { ?s ?p ?o }",
                        "from(bucket: \"default\")",
                        "SELECT * FROM keyspace.table"
                    ] or
                    len(converted_query.strip()) < 20
                )
                # Write output file
                output_file.write_text(converted_query, encoding='utf-8')
                if is_placeholder:
                    print(f"  [PLACEHOLDER] {format_name:20s} -> {format_name}/level_{level}.{format_name} (minimal output)")
                    successful += 1
                else:
                    print(f"  [OK] {format_name:20s} -> {format_name}/level_{level}.{format_name}")
                    successful += 1
            except Exception as e:
                # Format not supported or conversion failed
                error_msg = str(e)[:50] if len(str(e)) > 50 else str(e)
                print(f"  [FAIL] {format_name:20s} -> Failed: {error_msg}")
                failed += 1
        except Exception as e:
            error_msg = str(e)[:50] if len(str(e)) > 50 else str(e)
            print(f"  [ERROR] {format_name:20s} -> Error: {error_msg}")
            failed += 1
    print(f"\n{'='*70}")
    print(f"Level {level}: {successful} successful, {failed} failed")
    print(f"{'='*70}")


def main():
    """Main entry point."""
    # Get directories
    script_dir = Path(__file__).parent
    files_dir = script_dir / "files"
    output_dir = files_dir / "converted"
    print("XWQuery Format Conversion - All Formats")
    print("=" * 70)
    print(f"Input directory:  {files_dir}")
    print(f"Output directory: {output_dir} (organized by format)")
    print("=" * 70)
    # Convert each level
    for level in LEVELS:
        convert_level_to_all_formats(level, files_dir, output_dir)
    print(f"\n{'='*70}")
    print("Conversion complete!")
    print(f"Output files are organized by format in: {output_dir}")
    print(f"Structure: {output_dir}/<format>/level_<level>.<format>")
    print(f"{'='*70}")
if __name__ == "__main__":
    main()
