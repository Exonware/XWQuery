/**
 * XWUIHidden Component Exports
 */

import { XWUIHidden } from './XWUIHidden';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIHidden } from './XWUIHidden';
export type { XWUIHiddenConfig, XWUIHiddenData, Breakpoint } from './XWUIHidden';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIHidden, 'xwui-hidden', {
    flatAttrsToConfig: ['below', 'above', 'only', 'implementation', 'className'],
    flatAttrsToData: ['content']
});

