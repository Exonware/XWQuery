/**
 * XWUIMilestoneMarker Component Exports
 */

import { XWUIMilestoneMarker } from './XWUIMilestoneMarker';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMilestoneMarker } from './XWUIMilestoneMarker';
export type { XWUIMilestoneMarkerConfig, XWUIMilestoneMarkerData } from './XWUIMilestoneMarker';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMilestoneMarker, 'xwui-milestone-marker', {
    flatAttrsToConfig: ['variant', 'size', 'showLabel', 'showProgress', 'className'],
    flatAttrsToData: ['label', 'date', 'progress', 'completed', 'color', 'icon']
});

