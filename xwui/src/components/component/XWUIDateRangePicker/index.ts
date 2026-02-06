/**
 * XWUIDateRangePicker Component Exports
 */

import { XWUIDateRangePicker } from './XWUIDateRangePicker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIDateRangePicker } from './XWUIDateRangePicker';
export type { XWUIDateRangePickerConfig, XWUIDateRangePickerData } from './XWUIDateRangePicker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIDateRangePicker, 'xwui-date-range-picker', {
    flatAttrsToConfig: ['format', 'placeholder', 'separator', 'showCalendarIcon', 'className'],
    flatAttrsToData: ['value', 'minDate', 'maxDate']
});

