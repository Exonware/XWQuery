/**
 * XWUIComponentPropertyForm Component Exports
 */

import { XWUIComponentPropertyForm } from './XWUIComponentPropertyForm';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIComponentPropertyForm } from './XWUIComponentPropertyForm';
export type { XWUIComponentPropertyFormConfig, XWUIComponentPropertyFormData } from './XWUIComponentPropertyForm';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIComponentPropertyForm, 'xwui-component-property-form', {
    flatAttrsToConfig: ['mode', 'layout', 'labelWidth', 'size', 'className'],
    flatAttrsToData: ['schema', 'values']
});
