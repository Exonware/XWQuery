#!/usr/bin/env python3
"""
Script to generate *.grammar.info.json files for all grammar formats.
This script reads metadata from:
1. grammars_master.json (primary source)
2. Existing handler classes (if any)
3. Infers defaults for missing formats
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.2
"""

import sys
import json
from pathlib import Path
# Add parent to path to import xwsyntax
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))
from exonware.xwsystem.console.cli import ensure_utf8_console
ensure_utf8_console()


def load_grammars_master(grammar_dir: Path) -> dict:
    """Load grammars_master.json file."""
    master_file = grammar_dir / 'grammars_master.json'
    if not master_file.exists():
        return {}
    with open(master_file, 'r', encoding='utf-8') as f:
        return json.load(f)


def infer_format_metadata(format_name: str) -> dict:
    """
    Infer default metadata for a format name.
    Args:
        format_name: Format name (e.g., 'json', 'python', 'sql')
    Returns:
        Dictionary with inferred metadata
    """
    format_id = format_name.upper()
    # Default metadata structure
    metadata = {
        'format_id': format_id,
        'format_name': format_id,
        'syntax_name': format_name,
        'file_extensions': [f'.{format_name}'],
        'mime_types': [f'application/{format_name}', f'text/{format_name}'],
        'primary_mime_type': f'application/{format_name}',
        'aliases': [format_id, format_name],
        'category': 'data',  # Default category
        'supports_bidirectional': True,
        'is_binary_format': False,
        'supports_streaming': False,
        'version': '1.0.0',
        'description': f'{format_id} format support',
    }
    # Category inference based on common patterns
    if format_name in ['sql', 'sparql', 'cypher', 'graphql', 'gql', 'gremlin', 'aql', 'n1ql', 'cql', 'hql', 'pig', 'flux', 'promql', 'logql', 'kql', 'linq', 'mongodb', 'elasticsearch', 'eql', 'jq', 'jmespath', 'json_query', 'jsoniq', 'xpath', 'xquery', 'xml_query', 'xwquery', 'xwqueryscript', 'partiql', 'datalog']:
        metadata['category'] = 'query'
    elif format_name in ['json', 'yaml', 'toml', 'xml', 'html', 'csv', 'tsv', 'ini', 'properties', 'formdata', 'multipart', 'jsonl', 'json5', 'edn', 'sexpr', 'plist', 'bson', 'msgpack', 'cbor', 'ubjson', 'marshal', 'pickle', 'protobuf', 'avro', 'thrift', 'capnproto', 'flatbuffers']:
        metadata['category'] = 'data'
    elif format_name in ['python', 'javascript', 'typescript', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'lua', 'r', 'matlab', 'bash', 'shell', 'powershell', 'batch']:
        metadata['category'] = 'programming'
    elif format_name in ['markdown', 'latex', 'restructuredtext', 'plaintext', 'log', 'regex', 'css', 'dockerfile', 'makefile', 'nginx', 'apache']:
        metadata['category'] = 'text'
    elif format_name in ['parquet', 'orc', 'arrow', 'feather', 'iceberg', 'delta', 'hdf5', 'netcdf', 'zarr', 'leveldb', 'lmdb', 'graphdb', 'dbm', 'sqlite3']:
        metadata['category'] = 'storage'
    return metadata


def convert_master_to_info_format(master_entry: dict, format_name: str) -> dict:
    """
    Convert grammars_master.json entry to info.json format.
    Args:
        master_entry: Entry from grammars_master.json
        format_name: Format name (key)
    Returns:
        Dictionary in info.json format
    """
    # Start with inferred defaults
    info = infer_format_metadata(format_name)
    # Override with master entry data
    if 'name' in master_entry:
        info['format_name'] = master_entry['name']
        info['format_id'] = master_entry['name'].upper()
    if 'file_extensions' in master_entry:
        info['file_extensions'] = master_entry['file_extensions']
    if 'mime_types' in master_entry:
        info['mime_types'] = master_entry['mime_types']
    if 'primary_mime_type' in master_entry:
        info['primary_mime_type'] = master_entry['primary_mime_type']
    if 'aliases' in master_entry:
        # Merge with format_id and syntax_name
        aliases = set(master_entry['aliases'])
        aliases.add(info['format_id'])
        aliases.add(format_name)
        info['aliases'] = sorted(list(aliases))
    if 'category' in master_entry:
        # Map category names
        category_map = {
            'text_serialization': 'data',
            'query_language': 'query',
            'programming_language': 'programming',
            'markup_language': 'text',
            'config_language': 'data',
        }
        category = master_entry['category']
        info['category'] = category_map.get(category, category)
    if 'is_binary' in master_entry:
        info['is_binary_format'] = master_entry['is_binary']
    if 'supports_bidirectional' in master_entry:
        info['supports_bidirectional'] = master_entry['supports_bidirectional']
    if 'description' in master_entry:
        info['description'] = master_entry['description']
    if 'specification' in master_entry:
        info['specification'] = master_entry['specification']
    # Ensure syntax_name is lowercase format name
    info['syntax_name'] = format_name.lower()
    return info


def generate_info_json(grammar_dir: Path, format_name: str, master_data: dict) -> dict:
    """
    Generate info.json data for a format.
    Args:
        grammar_dir: Directory containing grammar files
        format_name: Format name
        master_data: Data from grammars_master.json
    Returns:
        Dictionary with info.json data
    """
    # Check if format exists in master data
    if format_name in master_data:
        return convert_master_to_info_format(master_data[format_name], format_name)
    else:
        # Use inferred defaults
        return infer_format_metadata(format_name)


def main():
    """Main entry point."""
    # Default grammar directory
    grammar_dir = Path(__file__).parent.parent / 'src' / 'exonware' / 'xwsyntax' / 'grammars'
    if len(sys.argv) > 1:
        grammar_dir = Path(sys.argv[1])
    print("=" * 60)
    print("Grammar Info JSON Generator")
    print("=" * 60)
    print(f"Grammar directory: {grammar_dir}")
    print()
    if not grammar_dir.exists():
        print(f"[ERROR] Grammar directory does not exist: {grammar_dir}")
        return
    # Load master data
    master_data = load_grammars_master(grammar_dir)
    print(f"[INFO] Loaded {len(master_data)} entries from grammars_master.json")
    # Find all grammar files
    grammar_files = list(grammar_dir.glob("*.grammar.in.lark"))
    format_names = set()
    for grammar_file in grammar_files:
        # Extract format name (e.g., "json" from "json.grammar.in.lark")
        format_name = grammar_file.stem.replace('.grammar.in', '')
        format_names.add(format_name)
    print(f"[INFO] Found {len(format_names)} grammar formats")
    print()
    generated_count = 0
    updated_count = 0
    # Generate info.json for each format
    for format_name in sorted(format_names):
        info_file = grammar_dir / f"{format_name}.grammar.info.json"
        # Generate info data
        info_data = generate_info_json(grammar_dir, format_name, master_data)
        # Write info.json file
        if info_file.exists():
            # Compare with existing
            with open(info_file, 'r', encoding='utf-8') as f:
                existing = json.load(f)
            if existing != info_data:
                updated_count += 1
                print(f"[UPDATE] {format_name}.grammar.info.json")
            else:
                print(f"[SKIP] {format_name}.grammar.info.json (unchanged)")
        else:
            generated_count += 1
            print(f"[CREATE] {format_name}.grammar.info.json")
        # Write file with pretty formatting
        with open(info_file, 'w', encoding='utf-8') as f:
            json.dump(info_data, f, indent=2, ensure_ascii=False)
            f.write('\n')  # Trailing newline
    print()
    print("=" * 60)
    print(f"[INFO] Generated: {generated_count}")
    print(f"[INFO] Updated: {updated_count}")
    print(f"[OK] Total formats processed: {len(format_names)}")
    print("=" * 60)
if __name__ == '__main__':
    main()
