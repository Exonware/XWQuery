/**
 * XWUIList Component Exports
 */

import { XWUIList } from './XWUIList';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIList } from './XWUIList';
export type { XWUIListConfig, XWUIListData, XWUIListItem } from './XWUIList';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIList, 'xwui-list', {
    flatAttrsToConfig: ['size', 'bordered', 'hoverable', 'className'],
    flatAttrsToData: ['items']
});

