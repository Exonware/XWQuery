/**
 * XWUIPickerColor Component Exports
 */

import { XWUIPickerColor } from './XWUIPickerColor';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPickerColor } from './XWUIPickerColor';
export type { XWUIPickerColorConfig, XWUIPickerColorData } from './XWUIPickerColor';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPickerColor, 'xwui-picker-color', {
    flatAttrsToConfig: ['format', 'presets', 'placement', 'offset', 'closeOnClickOutside', 'closeOnEscape', 'className'],
    flatAttrsToData: ['value']
});

