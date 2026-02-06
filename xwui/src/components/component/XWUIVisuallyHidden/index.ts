/**
 * XWUIVisuallyHidden Component Exports
 */

import { XWUIVisuallyHidden } from './XWUIVisuallyHidden';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIVisuallyHidden } from './XWUIVisuallyHidden';
export type { XWUIVisuallyHiddenConfig, XWUIVisuallyHiddenData } from './XWUIVisuallyHidden';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIVisuallyHidden, 'xwui-visually-hidden', {
    flatAttrsToConfig: ['as', 'className'],
    flatAttrsToData: ['content']
});

