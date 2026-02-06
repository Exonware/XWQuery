/**
 * XWUIScriptEditor Component Exports
 * Usage: Custom Element <xwui-script-editor> (auto-registered)
 */

import { XWUIScriptEditor } from './XWUIScriptEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIScriptEditor } from './XWUIScriptEditor';
export type { XWUIScriptEditorConfig, XWUIScriptEditorData, EditorEngine, EditorMode } from './XWUIScriptEditor';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes (grammar, engine, mode, height, content, etc.) and grouped attributes (conf-comp, data)
createXWUIElement(XWUIScriptEditor, 'xwui-script-editor', {
    flatAttrsToConfig: ['grammar', 'fileName', 'engine', 'mode', 'height'],
    flatAttrsToData: ['content']
});

// Grammar utilities
export { 
    getGrammar, 
    getAllGrammars, 
    getGrammarFromFileName, 
    getGrammarFromExtension,
    getXWSyntaxGrammarPath,
    getExtensionsForGrammar,
    getGrammarContent
} from './grammars';

// Grammar types (exported separately to avoid build issues)
export type { GrammarType, GrammarDefinition } from './grammars';

