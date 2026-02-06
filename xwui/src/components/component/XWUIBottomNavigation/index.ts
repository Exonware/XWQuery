/**
 * XWUIBottomNavigation Component Exports
 */

import { XWUIBottomNavigation } from './XWUIBottomNavigation';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBottomNavigation } from './XWUIBottomNavigation';
export type { XWUIBottomNavigationConfig, XWUIBottomNavigationData, XWUIBottomNavigationItem } from './XWUIBottomNavigation';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBottomNavigation, 'xwui-bottom-navigation', {
    flatAttrsToConfig: ['variant', 'showLabels', 'fixed', 'className'],
    flatAttrsToData: ['items', 'activeId']
});

