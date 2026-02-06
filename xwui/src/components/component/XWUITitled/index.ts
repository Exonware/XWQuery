/**
 * XWUITitled Component Exports
 */

import { XWUITitled } from './XWUITitled';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITitled } from './XWUITitled';
export type { XWUITitledConfig, XWUITitledData } from './XWUITitled';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITitled, 'xwui-titled', {
    flatAttrsToConfig: ['className'],
    flatAttrsToData: ['icon', 'title', 'subtitle']
});

