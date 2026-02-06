/**
 * XWUIMenuBar Component Exports
 */

import { XWUIMenuBar } from './XWUIMenuBar';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMenuBar } from './XWUIMenuBar';
export type { XWUIMenuBarConfig, XWUIMenuBarData } from './XWUIMenuBar';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMenuBar, 'xwui-menubar', {
    flatAttrsToConfig: ['className'],
    flatAttrsToData: ['items']
});

