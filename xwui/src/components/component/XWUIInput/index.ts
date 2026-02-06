/**
 * XWUIInput Component Exports
 */

import { XWUIInput } from './XWUIInput';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInput } from './XWUIInput';
export type { XWUIInputConfig, XWUIInputData } from './XWUIInput';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInput, 'xwui-input', {
    flatAttrsToConfig: ['type', 'size', 'variant', 'disabled', 'readonly', 'required', 'error', 'fullWidth', 'clearable', 'showPasswordToggle', 'className'],
    flatAttrsToData: ['value', 'placeholder', 'label', 'helperText', 'errorText', 'name', 'id', 'min', 'max', 'step', 'maxLength', 'pattern', 'autocomplete']
});

