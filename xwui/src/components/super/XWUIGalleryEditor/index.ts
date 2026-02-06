/**
 * XWUIGalleryEditor Component Exports
 */

import { XWUIGalleryEditor } from './XWUIGalleryEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIGalleryEditor } from './XWUIGalleryEditor';
export type { XWUIGalleryEditorConfig, XWUIGalleryEditorData } from './XWUIGalleryEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIGalleryEditor, 'xwui-gallery-editor', {
    flatAttrsToConfig: ['layout', 'columns', 'showUpload', 'allowDelete', 'allowReorder', 'maxImages', 'className'],
    flatAttrsToData: ['images']
});

