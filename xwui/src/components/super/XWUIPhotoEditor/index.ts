/**
 * XWUIPhotoEditor Component Exports
 */

import { XWUIPhotoEditor } from './XWUIPhotoEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIPhotoEditor } from './XWUIPhotoEditor';
export type { XWUIPhotoEditorConfig, XWUIPhotoEditorData } from './XWUIPhotoEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIPhotoEditor, 'xwui-photo-editor', {
    flatAttrsToConfig: ['width', 'height', 'allowCrop', 'allowFilter', 'allowAdjustments', 'className'],
    flatAttrsToData: ['imageSrc']
});

