/**
 * XWUIMenuNavigation Component Exports
 */

import { XWUIMenuNavigation } from './XWUIMenuNavigation';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMenuNavigation } from './XWUIMenuNavigation';
export type { XWUIMenuNavigationConfig, XWUIMenuNavigationData } from './XWUIMenuNavigation';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMenuNavigation, 'xwui-navigation-menu', {
    flatAttrsToConfig: ['orientation', 'className'],
    flatAttrsToData: ['items']
});

