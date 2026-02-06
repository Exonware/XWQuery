/**
 * XWUIFocusTrap Component Exports
 */

import { XWUIFocusTrap } from './XWUIFocusTrap';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIFocusTrap } from './XWUIFocusTrap';
export type { XWUIFocusTrapConfig, XWUIFocusTrapData } from './XWUIFocusTrap';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIFocusTrap, 'xwui-focus-trap', {
    flatAttrsToConfig: ['active', 'returnFocusOnDeactivate', 'initialFocus', 'fallbackFocus', 'className'],
    flatAttrsToData: ['container']
});

