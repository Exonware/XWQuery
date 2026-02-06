/**
 * XWUIField Component Exports
 */

import { XWUIField } from './XWUIField';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIField } from './XWUIField';
export type { XWUIFieldConfig, XWUIFieldData } from './XWUIField';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIField, 'xwui-field', {
    flatAttrsToConfig: ['required', 'disabled', 'size', 'className'],
    flatAttrsToData: ['label', 'error', 'hint', 'input']
});

