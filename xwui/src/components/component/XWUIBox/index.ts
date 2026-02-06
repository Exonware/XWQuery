/**
 * XWUIBox Component Exports
 */

import { XWUIBox } from './XWUIBox';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBox } from './XWUIBox';
export type { XWUIBoxConfig, XWUIBoxData, XWUIBoxGlassEffect } from './XWUIBox';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBox, 'xwui-box', {
    flatAttrsToConfig: ['as', 'className', 'padding', 'margin', 'width', 'height', 'display'],
    flatAttrsToData: ['content', 'children']
});

