/**
 * XWUIResult Component Exports
 */

import { XWUIResult } from './XWUIResult';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIResult } from './XWUIResult';
export type { XWUIResultConfig, XWUIResultData } from './XWUIResult';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIResult, 'xwui-result', {
    flatAttrsToConfig: ['status', 'size', 'className'],
    flatAttrsToData: ['title', 'description', 'icon', 'extra']
});

