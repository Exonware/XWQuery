/**
 * XWUINavigationRail Component Exports
 */

import { XWUINavigationRail } from './XWUINavigationRail';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUINavigationRail } from './XWUINavigationRail';
export type { XWUINavigationRailConfig, XWUINavigationRailData, XWUINavigationRailItem } from './XWUINavigationRail';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUINavigationRail, 'xwui-navigation-rail', {
    flatAttrsToConfig: ['direction', 'className'],
    flatAttrsToData: ['items']
});

