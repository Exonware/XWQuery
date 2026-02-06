/**
 * XWUIFilePreview Component Exports
 */

import { XWUIFilePreview } from './XWUIFilePreview';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIFilePreview } from './XWUIFilePreview';
export type { XWUIFilePreviewConfig, XWUIFilePreviewData, FilePreview } from './XWUIFilePreview';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIFilePreview, 'xwui-file-preview', {
    flatAttrsToConfig: ['showThumbnail', 'showDialog', 'thumbnailSize', 'className'],
    flatAttrsToData: ['mode']
});

