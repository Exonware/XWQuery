/**
 * XWUISelect Component Exports
 */

import { XWUISelect } from './XWUISelect';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISelect } from './XWUISelect';
export type { XWUISelectConfig, XWUISelectData, XWUISelectOption } from './XWUISelect';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISelect, 'xwui-select', {
    flatAttrsToConfig: ['size', 'variant', 'disabled', 'multiple', 'searchable', 'clearable', 'fullWidth', 'error', 'maxHeight', 'className'],
    flatAttrsToData: ['options', 'value', 'placeholder', 'label', 'helperText', 'errorText', 'name', 'id']
});

