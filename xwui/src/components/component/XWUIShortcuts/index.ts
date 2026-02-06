/**
 * XWUIShortcuts Component Exports
 * Keyboard and mouse shortcut handler
 */

import { XWUIShortcuts } from './XWUIShortcuts';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIShortcuts } from './XWUIShortcuts';
export type { 
    XWUIShortcutsConfig, 
    XWUIShortcutsData,
    ShortcutsConfig,
    ShortcutAction,
    ActionHandler
} from './XWUIShortcuts';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Note: Shortcuts component typically needs programmatic setup with shortcuts config
// Custom element registration is optional
createXWUIElement(XWUIShortcuts, 'xwui-shortcuts', {
    flatAttrsToConfig: ['mode', 'enableFocusDetection', 'preventDefault'],
    flatAttrsToData: []
});

