/**
 * XWUICollapse Component Exports
 */

import { XWUICollapse } from './XWUICollapse';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICollapse } from './XWUICollapse';
export type { XWUICollapseConfig, XWUICollapseData } from './XWUICollapse';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICollapse, 'xwui-collapse', {
    flatAttrsToConfig: ['expanded', 'duration', 'easing', 'destroyOnCollapse', 'className'],
    flatAttrsToData: []
});

