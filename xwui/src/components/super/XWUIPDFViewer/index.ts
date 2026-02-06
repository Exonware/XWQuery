/**
 * XWUIPDFViewer Component Exports
 */

import { XWUIPDFViewer } from './XWUIPDFViewer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPDFViewer } from './XWUIPDFViewer';
export type { XWUIPDFViewerConfig, XWUIPDFViewerData } from './XWUIPDFViewer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPDFViewer, 'xwui-pdf-viewer', {
    flatAttrsToConfig: ['showToolbar', 'showThumbnails', 'showPageNumbers', 'enableAnnotations', 'enableTextSelection', 'className'],
    flatAttrsToData: ['pdfUrl', 'currentPage', 'totalPages', 'zoom']
});

