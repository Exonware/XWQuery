/**
 * XWUIAppBar Component Exports
 */

import { XWUIAppBar } from './XWUIAppBar';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIAppBar } from './XWUIAppBar';
export type { XWUIAppBarConfig, XWUIAppBarData } from './XWUIAppBar';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIAppBar, 'xwui-appbar', {
    flatAttrsToConfig: ['position', 'variant', 'size', 'color', 'bordered', 'className'],
    flatAttrsToData: ['title']
});

