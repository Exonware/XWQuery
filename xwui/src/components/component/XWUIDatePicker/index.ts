/**
 * XWUIDatePicker Component Exports
 */

import { XWUIDatePicker } from './XWUIDatePicker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDatePicker } from './XWUIDatePicker';
export type { XWUIDatePickerConfig, XWUIDatePickerData } from './XWUIDatePicker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDatePicker, 'xwui-date-picker', {
    flatAttrsToConfig: ['format', 'placeholder', 'showCalendarIcon', 'className'],
    flatAttrsToData: ['value', 'minDate', 'maxDate']
});

