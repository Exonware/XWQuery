/**
 * XWUIDiffEditor Component Exports
 */

import { XWUIDiffEditor } from './XWUIDiffEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDiffEditor } from './XWUIDiffEditor';
export type { XWUIDiffEditorConfig, XWUIDiffEditorData } from './XWUIDiffEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDiffEditor, 'xwui-diff-editor', {
    flatAttrsToConfig: ['mode', 'language', 'showLineNumbers', 'ignoreWhitespace', 'renderSideBySide', 'className'],
    flatAttrsToData: ['original', 'modified', 'originalFileName', 'modifiedFileName']
});

