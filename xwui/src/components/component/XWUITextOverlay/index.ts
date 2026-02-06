/**
 * XWUITextOverlay Component Exports
 */

import { XWUITextOverlay } from './XWUITextOverlay';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITextOverlay } from './XWUITextOverlay';
export type { XWUITextOverlayConfig, XWUITextOverlayData, TextOverlay } from './XWUITextOverlay';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITextOverlay, 'xwui-text-overlay', {
    flatAttrsToConfig: ['defaultFontSize', 'defaultFontFamily', 'defaultColor', 'className'],
    flatAttrsToData: ['overlays']
});

