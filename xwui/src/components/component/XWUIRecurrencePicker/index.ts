/**
 * XWUIRecurrencePicker Component Exports
 */

import { XWUIRecurrencePicker } from './XWUIRecurrencePicker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIRecurrencePicker } from './XWUIRecurrencePicker';
export type { XWUIRecurrencePickerConfig, XWUIRecurrencePickerData, RecurrencePattern, RecurrenceType } from './XWUIRecurrencePicker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIRecurrencePicker, 'xwui-recurrence-picker', {
    flatAttrsToConfig: ['showPreview', 'className'],
    flatAttrsToData: ['startDate']
});

