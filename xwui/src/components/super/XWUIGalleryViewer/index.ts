/**
 * XWUIGalleryViewer Component Exports
 */

import { XWUIGalleryViewer } from './XWUIGalleryViewer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIGalleryViewer } from './XWUIGalleryViewer';
export type { XWUIGalleryViewerConfig, XWUIGalleryViewerData, XWUIGalleryImage } from './XWUIGalleryViewer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIGalleryViewer, 'xwui-gallery-viewer', {
    flatAttrsToConfig: ['layout', 'columns', 'gap', 'thumbnailSize', 'showLightbox', 'showPagination', 'itemsPerPage', 'aspectRatio', 'className'],
    flatAttrsToData: ['images']
});

