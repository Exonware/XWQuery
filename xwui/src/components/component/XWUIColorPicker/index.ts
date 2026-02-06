/**
 * XWUIColorPicker Component Exports
 */

import { XWUIColorPicker } from './XWUIColorPicker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIColorPicker } from './XWUIColorPicker';
export type { XWUIColorPickerConfig, XWUIColorPickerData } from './XWUIColorPicker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIColorPicker, 'xwui-color-picker', {
    flatAttrsToConfig: ['format', 'showText', 'allowClear', 'presets', 'className'],
    flatAttrsToData: ['value']
});

