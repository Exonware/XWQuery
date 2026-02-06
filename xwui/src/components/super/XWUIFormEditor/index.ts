/**
 * XWUIFormEditor Component Exports
 */

import { XWUIFormEditor } from './XWUIFormEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIFormEditor } from './XWUIFormEditor';
export type { 
    XWUIFormEditorConfig, 
    XWUIFormEditorData,
    FormElementType,
    FormElement,
    FormField,
    DisplayElement,
    Column,
    Row,
    Section,
    FormDefinition,
    FormSchema,
    SubmittedData,
    ComponentDefinition
} from './XWUIFormEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIFormEditor, 'xwui-form-editor', {
    flatAttrsToConfig: ['mode', 'className', 'showComponentPalette'],
    flatAttrsToData: ['formDefinition', 'submittedData', 'selectedRecord']
});

