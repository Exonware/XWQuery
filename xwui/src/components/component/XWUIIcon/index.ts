/**
 * XWUIIcon Component Exports
 */

import { XWUIIcon } from './XWUIIcon';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIIcon } from './XWUIIcon';
export type { XWUIIconConfig, XWUIIconData } from './XWUIIcon';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Utility functions
export { createIcon, createIconButton, createIconSpan } from './icon-utils';

// Auto-register Custom Element
createXWUIElement(XWUIIcon, 'xwui-icon', {
    flatAttrsToConfig: ['size', 'color', 'spin', 'rotate', 'className'],
    flatAttrsToData: ['name', 'svg']
});

