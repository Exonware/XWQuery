#!/usr/bin/env python3
# exonware/xwquery/examples/monaco_export_example.py
"""
Example demonstrating Monaco Editor syntax highlighting export.

This shows how to automatically generate Monaco Monarch definitions
from Lark grammars for IDE integration.
"""

import sys
import json
from pathlib import Path

# Add src to path for development
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'xwsystem' / 'src'))

from exonware.xwsyntax import SyntaxEngine

# Get grammars directory
GRAMMARS_DIR = Path(__file__).parent.parent / 'src' / 'exonware' / 'xwquery' / 'query' / 'grammars'


def main():
    """Main example function."""
    print("=" * 70)
    print("Monaco Editor Export Example")
    print("=" * 70)
    print()
    
    # Initialize engine
    engine = SyntaxEngine(grammar_dir=GRAMMARS_DIR)
    
    # Load JSON grammar
    grammar = engine.load_grammar('json')
    
    print("1. Exporting JSON grammar to Monaco Monarch format...")
    print()
    
    # Export to Monaco (returns dict)
    monaco_def = grammar.export_to_monaco(case_insensitive=False)
    
    print("Monaco Language Definition:")
    print("-" * 70)
    print(json.dumps(monaco_def['language'], indent=2))
    print()
    
    print("Monaco Configuration:")
    print("-" * 70)
    print(json.dumps(monaco_def['config'], indent=2))
    print()
    
    # Export to TypeScript
    print("=" * 70)
    print("2. Generating TypeScript code for Monaco registration...")
    print("=" * 70)
    print()
    
    ts_code = grammar.export_to_monaco_typescript(case_insensitive=False)
    print(ts_code)
    
    # Save to file
    output_file = Path(__file__).parent.parent / 'examples' / 'json.monarch.ts'
    output_file.write_text(ts_code)
    print(f"[OK] Saved to: {output_file}")
    print()
    
    # Show usage in HTML
    print("=" * 70)
    print("3. Usage in HTML/JavaScript:")
    print("=" * 70)
    print()
    
    html_example = """<!DOCTYPE html>
<html>
<head>
    <title>Monaco JSON Editor</title>
    <script src="https://unpkg.com/monaco-editor@latest/min/vs/loader.js"></script>
</head>
<body>
    <div id="editor" style="width:800px;height:600px;border:1px solid grey"></div>
    
    <script>
        require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' }});
        
        require(['vs/editor/editor.main'], function() {
            // Import our generated Monaco definition
            const jsonLanguage = """ + json.dumps(monaco_def['language']) + """;
            const jsonConfig = """ + json.dumps(monaco_def['config']) + """;
            
            // Register JSON language
            monaco.languages.register({ id: 'json' });
            monaco.languages.setMonarchTokensProvider('json', jsonLanguage);
            monaco.languages.setLanguageConfiguration('json', jsonConfig);
            
            // Create editor with JSON syntax highlighting
            const editor = monaco.editor.create(document.getElementById('editor'), {
                value: '{"name": "Alice", "age": 30}',
                language: 'json',
                theme: 'vs-dark'
            });
        });
    </script>
</body>
</html>"""
    
    print(html_example[:500] + "...")
    print()
    
    # Save HTML example
    html_file = Path(__file__).parent.parent / 'examples' / 'monaco_json_editor.html'
    html_file.write_text(html_example)
    print(f"[OK] Full HTML saved to: {html_file}")
    print()
    
    print("=" * 70)
    print("Key Features:")
    print("=" * 70)
    print()
    print("[OK] Automatic syntax highlighting from grammar")
    print("[OK] Keyword recognition")
    print("[OK] Bracket matching and auto-closing")
    print("[OK] Operator highlighting")
    print("[OK] String and number detection")
    print("[OK] Comment support")
    print("[OK] Ready for Monaco Editor integration")
    print()
    
    print("=" * 70)
    print("Next Steps:")
    print("=" * 70)
    print()
    print("1. Create SQL grammar -> Auto-generate Monaco highlighting")
    print("2. Create XPath grammar -> Auto-generate Monaco highlighting")
    print("3. Create 31 grammars -> Get Monaco support for FREE!")
    print()
    print("No manual Monaco work needed - it's ALL automated! " + "[OK]")
    print()


if __name__ == '__main__':
    main()

