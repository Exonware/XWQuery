/**
 * XWUIVideoEditor Component Exports
 */

import { XWUIVideoEditor } from './XWUIVideoEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIVideoEditor } from './XWUIVideoEditor';
export type { XWUIVideoEditorConfig, XWUIVideoEditorData } from './XWUIVideoEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIVideoEditor, 'xwui-video-editor', {
    flatAttrsToConfig: ['allowTrim', 'allowCrop', 'allowFilter', 'className'],
    flatAttrsToData: ['videoSrc']
});

