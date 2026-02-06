/**
 * XWUIStyleSwitch Component Exports
 * Usage: Custom Element <xwui-style-switch> (auto-registered)
 */

import { XWUIStyleSwitch } from './XWUIStyleSwitch';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIStyleSwitch } from './XWUIStyleSwitch';
export type { XWUIStyleSwitchConfig, XWUIStyleSwitchData } from './XWUIStyleSwitch';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes and grouped attributes (conf-comp, data)
createXWUIElement(XWUIStyleSwitch, 'xwui-style-switch', {
    flatAttrsToConfig: ['iconSize', 'size', 'className'],
    flatAttrsToData: []
});


