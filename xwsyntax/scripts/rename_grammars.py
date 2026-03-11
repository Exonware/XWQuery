#!/usr/bin/env python3
"""
Script to rename grammar files to new format:
- *.in.grammar -> *.grammar.in.lark
- *.out.grammar -> *.grammar.out.lark
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.2
"""

import sys
from pathlib import Path
# Add parent to path to import xwsyntax
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))
from exonware.xwsystem.console.cli import ensure_utf8_console
ensure_utf8_console()


def rename_grammar_files(grammar_dir: Path):
    """
    Rename grammar files to new format.
    Args:
        grammar_dir: Directory containing grammar files
    """
    grammar_dir = Path(grammar_dir)
    if not grammar_dir.exists():
        print(f"[ERROR] Grammar directory does not exist: {grammar_dir}")
        return
    renamed_count = 0
    # Rename .in.grammar files to .grammar.in.lark
    for in_file in grammar_dir.glob("*.in.grammar"):
        # Extract base name (e.g., "python" from "python.in.grammar")
        base_name = in_file.stem.replace('.in', '')
        new_name = grammar_dir / f"{base_name}.grammar.in.lark"
        if new_name.exists():
            print(f"[SKIP] Target already exists: {new_name.name}")
            continue
        in_file.rename(new_name)
        print(f"[OK] Renamed: {in_file.name} -> {new_name.name}")
        renamed_count += 1
    # Rename .out.grammar files to .grammar.out.lark
    for out_file in grammar_dir.glob("*.out.grammar"):
        # Extract base name (e.g., "python" from "python.out.grammar")
        base_name = out_file.stem.replace('.out', '')
        new_name = grammar_dir / f"{base_name}.grammar.out.lark"
        if new_name.exists():
            print(f"[SKIP] Target already exists: {new_name.name}")
            continue
        out_file.rename(new_name)
        print(f"[OK] Renamed: {out_file.name} -> {new_name.name}")
        renamed_count += 1
    print(f"\n[INFO] Total files renamed: {renamed_count}")


def main():
    """Main entry point."""
    # Default grammar directory
    grammar_dir = Path(__file__).parent.parent / 'src' / 'exonware' / 'xwsyntax' / 'grammars'
    if len(sys.argv) > 1:
        grammar_dir = Path(sys.argv[1])
    print("=" * 60)
    print("Grammar File Renaming Script")
    print("=" * 60)
    print(f"Grammar directory: {grammar_dir}")
    print()
    rename_grammar_files(grammar_dir)
    print("\n[OK] Renaming completed!")
if __name__ == '__main__':
    main()
