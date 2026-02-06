/**
 * XWUIForm Component Exports
 */

import { XWUIForm } from './XWUIForm';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIForm } from './XWUIForm';
export type { XWUIFormConfig, XWUIFormData } from './XWUIForm';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIForm, 'xwui-form', {
    flatAttrsToConfig: ['layout', 'labelWidth', 'size', 'className'],
    flatAttrsToData: ['fields']
});

