/**
 * XWUITimelineZoom Component Exports
 */

import { XWUITimelineZoom } from './XWUITimelineZoom';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUITimelineZoom } from './XWUITimelineZoom';
export type { XWUITimelineZoomConfig, XWUITimelineZoomData, ZoomLevel } from './XWUITimelineZoom';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUITimelineZoom, 'xwui-timeline-zoom', {
    flatAttrsToConfig: ['defaultZoom', 'showCalendar', 'showZoomButtons', 'className'],
    flatAttrsToData: ['currentDate', 'zoomLevel']
});

