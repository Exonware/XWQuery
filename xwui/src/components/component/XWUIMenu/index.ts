/**
 * XWUIMenu Component Exports
 */

import { XWUIMenu } from './XWUIMenu';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMenu } from './XWUIMenu';
export type { XWUIMenuConfig, XWUIMenuData, XWUIMenuItem } from './XWUIMenu';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMenu, 'xwui-menu', {
    flatAttrsToConfig: ['mode', 'theme', 'size', 'className'],
    flatAttrsToData: ['items', 'selected']
});

