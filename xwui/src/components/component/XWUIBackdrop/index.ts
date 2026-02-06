/**
 * XWUIBackdrop Component Exports
 * Usage: Custom Element <xwui-backdrop> (auto-registered)
 */

import { XWUIBackdrop } from './XWUIBackdrop';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIBackdrop } from './XWUIBackdrop';
export type { XWUIBackdropConfig, XWUIBackdropData } from './XWUIBackdrop';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes and grouped attributes (conf-comp, data)
createXWUIElement(XWUIBackdrop, 'xwui-backdrop', {
    flatAttrsToConfig: ['visible', 'invisible', 'className', 'zIndex'],
    flatAttrsToData: []
});

