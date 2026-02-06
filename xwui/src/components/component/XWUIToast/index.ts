/**
 * XWUIToast Component Exports
 */

import { XWUIToast } from './XWUIToast';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIToast, toast } from './XWUIToast';
export type { XWUIToastConfig, XWUIToastData, ToastOptions, ToastVariant, ToastPosition } from './XWUIToast';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIToast, 'xwui-toast', {
    flatAttrsToConfig: ['position', 'maxToasts', 'className'],
    flatAttrsToData: []
});

