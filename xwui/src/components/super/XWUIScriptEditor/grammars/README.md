# Grammar Files

This directory contains grammar definitions for the XWUIScriptEditor component.

## Using .grammar Files Directly

You can now use `.grammar` files (Lark format) directly in TypeScript! The Vite plugin automatically converts `.grammar` files to ES modules that export the grammar content as a string.

### Example

```typescript
// Import grammar file directly
import sqlGrammar from './sql.grammar';

// Use in grammar definition
export const queryLanguageGrammars = {
    sql: {
        id: 'sql',
        name: 'SQL',
        category: 'Query Languages',
        extensions: ['sql'],
        grammarContent: sqlGrammar  // Direct grammar content!
    }
};
```

### How It Works

1. **Vite Plugin**: The `grammar-file-loader` plugin in `vite.config.ts` intercepts `.grammar` file imports
2. **Type Declaration**: `grammar.d.ts` provides TypeScript type definitions for `.grammar` files
3. **Automatic Conversion**: `.grammar` files are automatically converted to ES modules that export the content as a string

### Benefits

- **Single Source of Truth**: Grammar definitions live in `.grammar` files, not duplicated in TypeScript
- **Type Safety**: TypeScript knows about `.grammar` imports
- **Easy Maintenance**: Just edit the `.grammar` file, no need to update TypeScript code
- **xwsyntax Compatible**: Grammar files can be shared with the xwsyntax system

### File Structure

```
grammars/
├── sql.grammar              # Lark grammar file (can be imported directly)
├── query-languages.ts       # TypeScript definitions that import .grammar files
├── grammar.d.ts            # Type declarations for .grammar imports
└── index.ts                # Main exports
```

### Adding a New Grammar

1. Create a `.grammar` file (e.g., `mygrammar.grammar`)
2. Import it in your grammar definition file:
   ```typescript
   import myGrammar from './mygrammar.grammar';
   ```
3. Use it in your grammar definition:
   ```typescript
   mygrammar: {
       id: 'mygrammar',
       name: 'My Grammar',
       grammarContent: myGrammar
   }
   ```

That's it! TypeScript will automatically handle the import.

