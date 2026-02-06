/**
 * XWUIDurationPicker Component Exports
 */

import { XWUIDurationPicker } from './XWUIDurationPicker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDurationPicker } from './XWUIDurationPicker';
export type { XWUIDurationPickerConfig, XWUIDurationPickerData } from './XWUIDurationPicker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDurationPicker, 'xwui-duration-picker', {
    flatAttrsToConfig: ['min', 'max', 'step', 'showPresets', 'className'],
    flatAttrsToData: ['hours', 'minutes', 'totalMinutes']
});

