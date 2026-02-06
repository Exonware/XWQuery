/**
 * XWUISwitch Component Exports
 */

import { XWUISwitch } from './XWUISwitch';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISwitch } from './XWUISwitch';
export type { XWUISwitchConfig, XWUISwitchData, XWUISwitchOption } from './XWUISwitch';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISwitch, 'xwui-switch', {
    flatAttrsToConfig: ['size', 'disabled', 'color', 'labelPlacement', 'className', 'checkedContent', 'uncheckedContent', 'showThumb', 'checkedColor', 'uncheckedColor', 'checkedTrackColor', 'uncheckedTrackColor', 'mode'],
    flatAttrsToData: ['checked', 'selectedValue', 'label', 'description', 'name', 'id'],
    jsonAttrsToConfig: ['options'], // Options is a complex object, needs JSON parsing
    jsonAttrsToData: []
});

