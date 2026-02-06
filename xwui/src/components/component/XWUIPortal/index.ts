/**
 * XWUIPortal Component Exports
 */

import { XWUIPortal } from './XWUIPortal';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPortal } from './XWUIPortal';
export type { XWUIPortalConfig, XWUIPortalData } from './XWUIPortal';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPortal, 'xwui-portal', {
    flatAttrsToConfig: ['container', 'disablePortal', 'className', 'zIndex'],
    flatAttrsToData: ['content', 'children']
});

