/**
 * Centralized Grammar Definitions
 * Re-exported from grammars/index.ts
 * Single source of truth for all supported languages/grammars
 * Used by all editor engines
 * 
 * Grammar definitions are loaded from grammars_master.json
 * and mapped to actual grammar files (.in.grammar and .out.grammar)
 */

// Re-export everything from the grammar system
export * from './grammars/index';

// Explicitly re-export type to ensure it's available at build time
export type { GrammarType, GrammarDefinition } from './grammars/index';

