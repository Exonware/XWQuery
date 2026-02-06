/**
 * XWUIBrightness Component Exports
 */

import { XWUIBrightness } from './XWUIBrightness';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBrightness } from './XWUIBrightness';
export type { XWUIBrightnessConfig, XWUIBrightnessData } from './XWUIBrightness';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBrightness, 'xwui-brightness', {
    flatAttrsToConfig: ['showController', 'controlPosition', 'minBrightness', 'maxBrightness', 'defaultBrightness', 'step', 'targetSelector', 'className'],
    flatAttrsToData: ['brightness']
});

