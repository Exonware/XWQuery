/**
 * XWUIRichTextEditor Component Exports
 */

import { XWUIRichTextEditor } from './XWUIRichTextEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIRichTextEditor } from './XWUIRichTextEditor';
export type { XWUIRichTextEditorConfig, XWUIRichTextEditorData } from './XWUIRichTextEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIRichTextEditor, 'xwui-rich-text-editor', {
    flatAttrsToConfig: ['toolbar', 'placeholder', 'readOnly', 'formats', 'className'],
    flatAttrsToData: ['value']
});

