/**
 * XWUIInputDate Component Exports
 */

import { XWUIInputDate } from './XWUIInputDate';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputDate } from './XWUIInputDate';
export type { XWUIInputDateConfig, XWUIInputDateData } from './XWUIInputDate';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputDate, 'xwui-input-date', {
    flatAttrsToConfig: ['format', 'view', 'showIcon', 'iconName', 'placeholder', 'readonly', 'clearable', 'className'],
    flatAttrsToData: ['value', 'minDate', 'maxDate']
});

