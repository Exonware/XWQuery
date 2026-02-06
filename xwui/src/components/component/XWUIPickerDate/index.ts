/**
 * XWUIPickerDate Component Exports
 */

import { XWUIPickerDate } from './XWUIPickerDate';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPickerDate } from './XWUIPickerDate';
export type { XWUIPickerDateConfig, XWUIPickerDateData } from './XWUIPickerDate';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPickerDate, 'xwui-picker-date', {
    flatAttrsToConfig: ['format', 'placement', 'offset', 'closeOnClickOutside', 'closeOnEscape', 'className'],
    flatAttrsToData: ['value', 'minDate', 'maxDate']
});

