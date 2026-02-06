/**
 * XWUICheckbox Component Exports
 */

import { XWUICheckbox } from './XWUICheckbox';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICheckbox } from './XWUICheckbox';
export type { XWUICheckboxConfig, XWUICheckboxData } from './XWUICheckbox';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICheckbox, 'xwui-checkbox', {
    flatAttrsToConfig: ['size', 'disabled', 'indeterminate', 'color', 'className'],
    flatAttrsToData: ['checked', 'label', 'description', 'name', 'id', 'value']
});

