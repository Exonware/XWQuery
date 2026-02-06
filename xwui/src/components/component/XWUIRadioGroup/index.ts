/**
 * XWUIRadioGroup Component Exports
 */

import { XWUIRadioGroup } from './XWUIRadioGroup';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIRadioGroup } from './XWUIRadioGroup';
export type { XWUIRadioGroupConfig, XWUIRadioGroupData, XWUIRadioOption } from './XWUIRadioGroup';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIRadioGroup, 'xwui-radio-group', {
    flatAttrsToConfig: ['size', 'orientation', 'disabled', 'color', 'className'],
    flatAttrsToData: ['options', 'value', 'name', 'label']
});

