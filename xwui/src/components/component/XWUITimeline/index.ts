/**
 * XWUITimeline Component Exports
 */

import { XWUITimeline } from './XWUITimeline';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITimeline } from './XWUITimeline';
export type { 
    XWUITimelineConfig, 
    XWUITimelineData, 
    XWUITimelineItem,
    TimelinePosition,
    TimelineColor,
    TimelineDotVariant
} from './XWUITimeline';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITimeline, 'xwui-timeline', {
    flatAttrsToConfig: ['position', 'mode', 'className', 'dotSize'], // 'mode' for backward compatibility
    flatAttrsToData: ['items']
});

