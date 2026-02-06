/**
 * XWUITextarea Component Exports
 */

import { XWUITextarea } from './XWUITextarea';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITextarea } from './XWUITextarea';
export type { XWUITextareaConfig, XWUITextareaData } from './XWUITextarea';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITextarea, 'xwui-textarea', {
    flatAttrsToConfig: ['size', 'variant', 'disabled', 'readonly', 'required', 'error', 'fullWidth', 'autoResize', 'minRows', 'maxRows', 'resize', 'className'],
    flatAttrsToData: ['value', 'placeholder', 'label', 'helperText', 'errorText', 'name', 'id', 'maxLength', 'rows']
});

