/**
 * Grammar Converter
 * Converts Lark grammars to editor-specific syntax highlighting formats
 * 
 * Supported outputs:
 * - TextMate grammars (for Monaco Editor)
 * - Monarch grammars (for Monaco Editor alternative)
 * - CodeMirror 6 Lezer (basic support)
 * - Ace Editor modes (basic support)
 * - Highlight.js definitions (basic support)
 */

import { getGrammarContent, type GrammarDefinition } from './index';

/**
 * TextMate Grammar Pattern
 */
interface TextMatePattern {
    name?: string;
    match?: string;
    begin?: string;
    end?: string;
    beginCaptures?: Record<string, { name: string }>;
    endCaptures?: Record<string, { name: string }>;
    captures?: Record<string, { name: string }>;
    patterns?: TextMatePattern[];
    include?: string;
}

/**
 * TextMate Grammar
 */
interface TextMateGrammar {
    $schema?: string;
    name: string;
    scopeName: string;
    patterns: TextMatePattern[];
    repository?: Record<string, TextMatePattern>;
}

/**
 * Convert Lark grammar to TextMate grammar format
 * This is a simplified converter - full conversion would require a complete Lark parser
 */
export async function convertLarkToTextMate(
    grammarId: string,
    grammarDef: GrammarDefinition
): Promise<TextMateGrammar | null> {
    try {
        const grammarContent = await getGrammarContent(grammarDef, 'in');
        if (!grammarContent) {
            return null;
        }

        // Parse Lark grammar and convert to TextMate
        const textMateGrammar = parseLarkToTextMate(grammarContent, grammarId, grammarDef);
        return textMateGrammar;
    } catch (error) {
        console.error(`Failed to convert grammar ${grammarId} to TextMate:`, error);
        return null;
    }
}

/**
 * Parse Lark grammar content and convert to TextMate format
 */
function parseLarkToTextMate(
    larkContent: string,
    grammarId: string,
    grammarDef: GrammarDefinition
): TextMateGrammar {
    const lines = larkContent.split('\n');
    const patterns: TextMatePattern[] = [];
    const repository: Record<string, TextMatePattern> = {};

    // Extract terminals and rules from Lark grammar
    const terminals: Map<string, string> = new Map();
    const rules: Map<string, string[]> = new Map();
    let startRule: string | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Skip comments and empty lines
        if (!line || line.startsWith('//') || line.startsWith('#')) {
            continue;
        }

        // Parse start rule
        if (line.startsWith('?start:')) {
            startRule = line.split(':')[1].trim();
            continue;
        }

        // Parse terminals (uppercase names)
        const terminalMatch = line.match(/^([A-Z_][A-Z0-9_]*):\s*(.+)$/);
        if (terminalMatch) {
            const [, name, pattern] = terminalMatch;
            terminals.set(name, pattern.trim());
            continue;
        }

        // Parse rules (lowercase names)
        const ruleMatch = line.match(/^([a-z_][a-z0-9_]*):\s*(.+)$/);
        if (ruleMatch) {
            const [, name, definition] = ruleMatch;
            rules.set(name, [definition.trim()]);
            continue;
        }

        // Handle multi-line rules (continuation with |)
        const continuationMatch = line.match(/^\|\s*(.+)$/);
        if (continuationMatch && rules.size > 0) {
            const lastRule = Array.from(rules.keys())[rules.size - 1];
            const existing = rules.get(lastRule) || [];
            existing.push(continuationMatch[1].trim());
            rules.set(lastRule, existing);
        }
    }

    // Convert terminals to TextMate patterns
    for (const [name, pattern] of terminals) {
        const tmPattern = convertLarkPatternToTextMate(pattern, name);
        if (tmPattern) {
            repository[name] = tmPattern;
        }
    }

    // Convert rules to TextMate patterns
    for (const [name, definitions] of rules) {
        const tmPattern = convertLarkRuleToTextMate(definitions.join(' '), name, terminals);
        if (tmPattern) {
            repository[name] = tmPattern;
        }
    }

    // Create main patterns from start rule
    if (startRule && repository[startRule]) {
        patterns.push({ include: `#${startRule}` });
    } else {
        // Fallback: include all repository patterns
        for (const key of Object.keys(repository)) {
            patterns.push({ include: `#${key}` });
        }
    }

    return {
        $schema: 'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
        name: grammarDef.name,
        scopeName: `source.${grammarId}`,
        patterns: patterns.length > 0 ? patterns : [
            {
                match: '.',
                name: 'source'
            }
        ],
        repository
    };
}

/**
 * Convert Lark pattern (regex/terminal) to TextMate pattern
 */
function convertLarkPatternToTextMate(pattern: string, name: string): TextMatePattern | null {
    // Remove quotes and clean up pattern
    let cleaned = pattern.trim();
    
    // Handle quoted strings
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
    }

    // Convert Lark regex to JavaScript regex (simplified)
    // Lark uses /pattern/ syntax, TextMate uses string patterns
    const regexMatch = cleaned.match(/^\/(.+)\/([gimuy]*)$/);
    if (regexMatch) {
        const [, regexPattern, flags] = regexMatch;
        // Convert to TextMate format (escape special chars)
        const tmPattern = regexPattern
            .replace(/\\\//g, '/')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/\[/g, '\\[')
            .replace(/\]/g, '\\]')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}');
        
        return {
            match: tmPattern,
            name: `constant.${name.toLowerCase()}`
        };
    }

    // Handle literal strings
    if (cleaned.match(/^"[^"]*"$/) || cleaned.match(/^'[^']*'$/)) {
        const literal = cleaned.slice(1, -1);
        return {
            match: escapeRegex(literal),
            name: `keyword.${name.toLowerCase()}`
        };
    }

    return null;
}

/**
 * Convert Lark rule to TextMate pattern
 */
function convertLarkRuleToTextMate(
    definition: string,
    name: string,
    terminals: Map<string, string>
): TextMatePattern | null {
    // Simple conversion - match the rule definition
    // This is a simplified version; full conversion would require proper parsing
    
    // Check if it references terminals
    for (const [termName] of terminals) {
        if (definition.includes(termName)) {
            return {
                include: `#${termName}`
            };
        }
    }

    // Try to extract regex patterns
    const regexMatch = definition.match(/\/[^\/]+\//);
    if (regexMatch) {
        const pattern = regexMatch[0].slice(1, -1);
        return {
            match: pattern,
            name: `entity.name.${name.toLowerCase()}`
        };
    }

    return null;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Register TextMate grammar with Monaco Editor
 */
export async function registerTextMateGrammarWithMonaco(
    monaco: any,
    grammarId: string,
    grammarDef: GrammarDefinition
): Promise<boolean> {
    try {
        // Check if monaco-textmate is available
        if (typeof (window as any).monacoTextmate === 'undefined') {
            console.warn('monaco-textmate not available, falling back to native Monaco language');
            return false;
        }

        const textMateGrammar = await convertLarkToTextMate(grammarId, grammarDef);
        if (!textMateGrammar) {
            return false;
        }

        // Register with monaco-textmate
        const registry = (window as any).monacoTextmate.Registry;
        if (registry) {
            await registry.loadGrammar(textMateGrammar.scopeName, () => 
                Promise.resolve(textMateGrammar)
            );
            return true;
        }

        return false;
    } catch (error) {
        console.error(`Failed to register TextMate grammar for ${grammarId}:`, error);
        return false;
    }
}

/**
 * Convert grammar to Monarch format (Monaco's native format)
 * This is a simplified converter
 */
export async function convertLarkToMonarch(
    grammarId: string,
    grammarDef: GrammarDefinition
): Promise<any> {
    try {
        const grammarContent = await getGrammarContent(grammarDef, 'in');
        if (!grammarContent) {
            return null;
        }

        // Parse and convert to Monarch
        const monarchGrammar = parseLarkToMonarch(grammarContent, grammarId);
        return monarchGrammar;
    } catch (error) {
        console.error(`Failed to convert grammar ${grammarId} to Monarch:`, error);
        return null;
    }
}

/**
 * Parse Lark grammar to Monarch format
 */
function parseLarkToMonarch(larkContent: string, grammarId: string): any {
    const lines = larkContent.split('\n');
    const tokenizer: Record<string, any[]> = {};
    const terminals: Map<string, string> = new Map();

    // Extract terminals
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
            continue;
        }

        const terminalMatch = trimmed.match(/^([A-Z_][A-Z0-9_]*):\s*(.+)$/);
        if (terminalMatch) {
            const [, name, pattern] = terminalMatch;
            terminals.set(name, pattern.trim());
        }
    }

    // Convert terminals to Monarch tokens
    const defaultTokens: any[] = [];
    for (const [name, pattern] of terminals) {
        const regexMatch = pattern.match(/^\/(.+)\/([gimuy]*)$/);
        if (regexMatch) {
            const [, regexPattern] = regexMatch;
            defaultTokens.push({
                regex: regexPattern,
                token: name.toLowerCase()
            });
        }
    }

    tokenizer.root = defaultTokens.length > 0 ? defaultTokens : [
        { regex: '.', token: 'text' }
    ];

    return {
        tokenizer,
        defaultToken: 'text'
    };
}

/**
 * Get editor-specific language configuration
 * Returns the appropriate language ID or configuration based on editor type
 */
export async function getEditorLanguageConfig(
    editorType: 'monaco' | 'codemirror6' | 'ace' | 'highlightjs',
    grammarId: string,
    grammarDef: GrammarDefinition
): Promise<string | any> {
    switch (editorType) {
        case 'monaco':
            // Try to use TextMate grammar, fallback to native language ID
            const hasTextMate = await registerTextMateGrammarWithMonaco(
                (window as any).monaco,
                grammarId,
                grammarDef
            );
            if (hasTextMate) {
                return `source.${grammarId}`;
            }
            // Fallback to native Monaco language
            return mapGrammarToNativeMonaco(grammarId);
        
        case 'codemirror6':
            // CodeMirror 6 would need Lezer grammar conversion
            // For now, return a basic mapping
            return mapGrammarToCodeMirror6(grammarId);
        
        case 'ace':
            return mapGrammarToAce(grammarId);
        
        case 'highlightjs':
            return mapGrammarToHighlightJS(grammarId);
        
        default:
            return grammarId;
    }
}

/**
 * Map grammar to native Monaco language ID (fallback)
 */
function mapGrammarToNativeMonaco(grammarId: string): string {
    const map: Record<string, string> = {
        javascript: 'javascript',
        typescript: 'typescript',
        json: 'json',
        html: 'html',
        css: 'css',
        python: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        csharp: 'csharp',
        go: 'go',
        rust: 'rust',
        php: 'php',
        ruby: 'ruby',
        sql: 'sql',
        xml: 'xml',
        yaml: 'yaml',
        toml: 'toml',
        markdown: 'markdown',
        dockerfile: 'dockerfile',
        makefile: 'makefile',
        bash: 'shell',
        powershell: 'powershell',
        plaintext: 'plaintext'
    };
    return map[grammarId] || 'plaintext';
}

/**
 * Map grammar to CodeMirror 6 language
 */
function mapGrammarToCodeMirror6(grammarId: string): string {
    // CodeMirror 6 uses specific language packages
    const map: Record<string, string> = {
        json: 'json',
        javascript: 'javascript',
        typescript: 'typescript',
        python: 'python',
        html: 'html',
        css: 'css',
        sql: 'sql',
        java: 'java',
        cpp: 'cpp',
        xml: 'xml',
        yaml: 'yaml',
        markdown: 'markdown'
    };
    return map[grammarId] || grammarId;
}

/**
 * Map grammar to Ace Editor mode
 */
function mapGrammarToAce(grammarId: string): string {
    const map: Record<string, string> = {
        javascript: 'javascript',
        typescript: 'typescript',
        json: 'json',
        html: 'html',
        css: 'css',
        python: 'python',
        java: 'java',
        cpp: 'c_cpp',
        c: 'c_cpp',
        csharp: 'csharp',
        go: 'golang',
        rust: 'rust',
        php: 'php',
        ruby: 'ruby',
        sql: 'sql',
        xml: 'xml',
        yaml: 'yaml',
        toml: 'toml',
        markdown: 'markdown',
        dockerfile: 'dockerfile',
        makefile: 'makefile',
        bash: 'sh',
        powershell: 'powershell',
        plaintext: 'text'
    };
    return map[grammarId] || 'text';
}

/**
 * Map grammar to Highlight.js language
 */
function mapGrammarToHighlightJS(grammarId: string): string {
    const map: Record<string, string> = {
        javascript: 'javascript',
        typescript: 'typescript',
        json: 'json',
        html: 'xml',
        css: 'css',
        python: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        csharp: 'csharp',
        go: 'go',
        rust: 'rust',
        php: 'php',
        ruby: 'ruby',
        sql: 'sql',
        xml: 'xml',
        yaml: 'yaml',
        toml: 'toml',
        markdown: 'markdown',
        dockerfile: 'dockerfile',
        bash: 'bash',
        plaintext: 'plaintext'
    };
    return map[grammarId] || 'plaintext';
}

