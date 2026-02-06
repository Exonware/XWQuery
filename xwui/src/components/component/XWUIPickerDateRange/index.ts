/**
 * XWUIPickerDateRange Component Exports
 */

import { XWUIPickerDateRange } from './XWUIPickerDateRange';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPickerDateRange } from './XWUIPickerDateRange';
export type { XWUIPickerDateRangeConfig, XWUIPickerDateRangeData } from './XWUIPickerDateRange';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPickerDateRange, 'xwui-picker-date-range', {
    flatAttrsToConfig: ['format', 'separator', 'placement', 'offset', 'closeOnClickOutside', 'closeOnEscape', 'className'],
    flatAttrsToData: ['value', 'minDate', 'maxDate']
});

