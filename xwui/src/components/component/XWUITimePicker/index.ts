/**
 * XWUITimePicker Component Exports
 */

import { XWUITimePicker } from './XWUITimePicker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITimePicker } from './XWUITimePicker';
export type { XWUITimePickerConfig, XWUITimePickerData } from './XWUITimePicker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITimePicker, 'xwui-time-picker', {
    flatAttrsToConfig: ['format', 'showSeconds', 'className'],
    flatAttrsToData: ['value']
});

