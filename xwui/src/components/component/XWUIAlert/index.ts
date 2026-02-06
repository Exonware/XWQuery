/**
 * XWUIAlert Component Exports
 */

import { XWUIAlert } from './XWUIAlert';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIAlert } from './XWUIAlert';
export type { XWUIAlertConfig, XWUIAlertData } from './XWUIAlert';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIAlert, 'xwui-alert', {
    flatAttrsToConfig: ['variant', 'closable', 'showIcon', 'bordered', 'filled', 'className'],
    flatAttrsToData: ['title', 'message']
});

