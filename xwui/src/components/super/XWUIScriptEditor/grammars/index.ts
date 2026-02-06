/**
 * Centralized Grammar Definitions
 * Loads from grammars_master.json and maps to actual grammar files
 * 
 * Grammar files are stored as:
 * - {grammarId}.in.grammar (input grammar)
 * - {grammarId}.out.grammar (output grammar)
 * 
 * Example: "c" -> "c.in.grammar" and "c.out.grammar"
 */

// Import grammars master JSON
import grammarsMasterJson from './grammars_master.json';

// Grammar type - union of all grammar IDs from JSON
export type GrammarType = keyof typeof grammarsMasterJson;

// Grammar definition interface matching the JSON structure
export interface GrammarDefinition {
    id: GrammarType;
    name: string;
    description?: string;
    category: string;
    file_extensions?: string[];
    mime_types?: string[];
    primary_mime_type?: string;
    aliases?: string[];
    is_binary?: boolean;
    supports_bidirectional?: boolean;
    specification?: string;
    // Computed properties
    extensions?: string[];  // Normalized from file_extensions (without dots)
    mimeTypes?: string[];   // Alias for mime_types
    xwsyntaxGrammarPath?: {
        input?: string;   // Path to .in.grammar file
        output?: string;  // Path to .out.grammar file
    };
    grammarContent?: string;  // Loaded grammar content (lazy loaded)
}

// Convert JSON structure to GrammarDefinition format
function convertJsonToGrammarDefinition(id: string, jsonData: any): GrammarDefinition {
    // Normalize file extensions (remove leading dots)
    const extensions = jsonData.file_extensions?.map((ext: string) => 
        ext.startsWith('.') ? ext.substring(1) : ext
    ) || [];

    // Map grammar ID to file names
    // Handle special cases: underscores in IDs match file names
    const grammarId = id;
    const inputFile = `${grammarId}.in.grammar`;
    const outputFile = `${grammarId}.out.grammar`;

    return {
        id: id as GrammarType,
        name: jsonData.name,
        description: jsonData.description,
        category: jsonData.category,
        file_extensions: jsonData.file_extensions,
        extensions: extensions,
        mime_types: jsonData.mime_types,
        mimeTypes: jsonData.mime_types,
        primary_mime_type: jsonData.primary_mime_type,
        aliases: jsonData.aliases,
        is_binary: jsonData.is_binary,
        supports_bidirectional: jsonData.supports_bidirectional,
        specification: jsonData.specification,
        xwsyntaxGrammarPath: {
            input: inputFile,
            output: outputFile
        }
    };
}

// Build GRAMMARS object from JSON
const GRAMMARS: Record<GrammarType, GrammarDefinition> = {} as Record<GrammarType, GrammarDefinition>;

for (const [id, jsonData] of Object.entries(grammarsMasterJson)) {
    GRAMMARS[id as GrammarType] = convertJsonToGrammarDefinition(id, jsonData);
}

/**
 * Get grammar by ID, alias, extension, or mime type
 */
export function getGrammar(identifier: string): GrammarDefinition | null {
    const lowerId = identifier.toLowerCase();
    
    // Direct match
    const grammar = GRAMMARS[lowerId as GrammarType];
    if (grammar) {
        return grammar;
    }
    
    // Check aliases
    for (const grammar of Object.values(GRAMMARS)) {
        if (grammar.aliases?.some(alias => alias.toLowerCase() === lowerId)) {
            return grammar;
        }
    }
    
    // Check extensions (normalized, without dots)
    const normalizedId = lowerId.startsWith('.') ? lowerId.substring(1) : lowerId;
    for (const grammar of Object.values(GRAMMARS)) {
        if (grammar.extensions?.some(ext => ext.toLowerCase() === normalizedId)) {
            return grammar;
        }
    }
    
    return null;
}

/**
 * Get all available grammars
 */
export function getAllGrammars(): GrammarDefinition[] {
    return Object.values(GRAMMARS);
}

/**
 * Get grammars by category
 */
export function getGrammarsByCategory(category: string): GrammarDefinition[] {
    return Object.values(GRAMMARS).filter(g => g.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
    return Array.from(new Set(Object.values(GRAMMARS).map(g => g.category)));
}

/**
 * Get grammar from file name or path by extension
 * @param fileName - File name or path (e.g., "script.js", "/path/to/file.py", "config.json")
 * @returns Grammar definition or null if not found
 */
export function getGrammarFromFileName(fileName: string): GrammarDefinition | null {
    if (!fileName) return null;
    
    // Extract extension from file name
    const lastDot = fileName.lastIndexOf('.');
    if (lastDot === -1 || lastDot === fileName.length - 1) {
        return null; // No extension found
    }
    
    const extension = fileName.substring(lastDot + 1).toLowerCase();
    return getGrammarFromExtension(extension);
}

/**
 * Get grammar from file extension
 * Supports many-to-one relationship: multiple extensions can map to the same grammar
 * @param extension - File extension (e.g., "js", "py", "json")
 * @returns Grammar definition or null if not found
 */
export function getGrammarFromExtension(extension: string): GrammarDefinition | null {
    if (!extension) return null;
    
    const lowerExt = extension.toLowerCase().replace(/^\./, ''); // Remove leading dot if present
    
    // Check if extension matches any grammar (many-to-one: multiple extensions can map to same grammar)
    for (const grammar of Object.values(GRAMMARS)) {
        if (grammar.extensions?.some(ext => ext.toLowerCase() === lowerExt)) {
            return grammar;
        }
    }
    
    // Check if extension matches any alias
    for (const grammar of Object.values(GRAMMARS)) {
        if (grammar.aliases?.some(alias => alias.toLowerCase() === lowerExt)) {
            return grammar;
        }
    }
    
    return null;
}

/**
 * Get xwsyntax grammar path for a grammar
 * @param grammarId - Grammar ID or GrammarDefinition
 * @returns xwsyntax grammar paths or null if not available
 */
export function getXWSyntaxGrammarPath(grammarId: GrammarType | string | GrammarDefinition): { input?: string; output?: string } | null {
    let grammar: GrammarDefinition | null = null;
    
    if (typeof grammarId === 'object') {
        grammar = grammarId;
    } else {
        grammar = getGrammar(grammarId);
    }
    
    return grammar?.xwsyntaxGrammarPath || null;
}

/**
 * Get all extensions that map to a grammar (many-to-one relationship)
 * @param grammarId - Grammar ID
 * @returns Array of file extensions
 */
export function getExtensionsForGrammar(grammarId: GrammarType | string): string[] {
    const grammar = getGrammar(grammarId);
    return grammar?.extensions || [];
}

// Cache for loaded grammar content
const grammarContentCache: Map<string, string> = new Map();

/**
 * Load grammar file content dynamically
 * @param grammarId - Grammar ID
 * @param type - 'in' or 'out' (default: 'in')
 * @returns Grammar content as string, or null if not available
 */
async function loadGrammarFile(grammarId: string, type: 'in' | 'out' = 'in'): Promise<string | null> {
    const cacheKey = `${grammarId}.${type}`;
    
    // Check cache
    if (grammarContentCache.has(cacheKey)) {
        return grammarContentCache.get(cacheKey) || null;
    }
    
    try {
        const fileName = `${grammarId}.${type}.grammar`;
        
        // Use fetch to load grammar files (avoids Vite dynamic import limitations)
        // Path is relative to the current module location
        // In dev: loads from src/components/XWUIScriptEditor/grammars/
        // In production: loads from dist/src/components/XWUIScriptEditor/grammars/
        // (grammar files are copied to dist by vite plugin)
        const currentModulePath = new URL(import.meta.url).pathname;
        const basePath = currentModulePath.substring(0, currentModulePath.lastIndexOf('/') + 1);
        const grammarPath = `${basePath}${fileName}`;
        
        try {
            const response = await fetch(grammarPath);
            if (response.ok) {
                const content = await response.text();
                grammarContentCache.set(cacheKey, content);
                return content;
            } else {
                console.debug(`Grammar file not found: ${grammarPath} (status: ${response.status})`);
            }
        } catch (fetchError) {
            console.debug(`Failed to fetch grammar file: ${grammarId}.${type}.grammar`, fetchError);
        }
    } catch (error) {
        console.debug(`Failed to load grammar file: ${grammarId}.${type}.grammar`, error);
    }
    
    return null;
}

/**
 * Get grammar content (Lark format) for a grammar
 * @param grammarId - Grammar ID or GrammarDefinition
 * @param type - 'in' or 'out' (default: 'in')
 * @returns Grammar content as string, or null if not available
 */
export async function getGrammarContent(grammarId: GrammarType | string | GrammarDefinition, type: 'in' | 'out' = 'in'): Promise<string | null> {
    let grammar: GrammarDefinition | null = null;
    let id: string;
    
    if (typeof grammarId === 'object') {
        grammar = grammarId;
        id = grammar.id;
    } else {
        id = grammarId;
        grammar = getGrammar(grammarId);
    }
    
    if (!grammar) {
        return null;
    }
    
    // Check if already loaded
    const cacheKey = `${id}.${type}`;
    if (grammarContentCache.has(cacheKey)) {
        return grammarContentCache.get(cacheKey) || null;
    }
    
    // Load from file
    const content = await loadGrammarFile(id, type);
    if (content) {
        grammar.grammarContent = content;
    }
    
    return content;
}

// Export GRAMMARS for direct access if needed
export { GRAMMARS };
