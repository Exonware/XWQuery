/**
 * XWUIUpload Component Exports
 */

import { XWUIUpload } from './XWUIUpload';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIUpload } from './XWUIUpload';
export type { XWUIUploadConfig, XWUIUploadData, XWUIUploadFile } from './XWUIUpload';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIUpload, 'xwui-upload', {
    flatAttrsToConfig: ['multiple', 'accept', 'maxSize', 'maxCount', 'dragDrop', 'listType', 'className'],
    flatAttrsToData: ['files', 'label']
});

