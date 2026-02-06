/**
 * XWUIAspectRatio Component Exports
 */

import { XWUIAspectRatio } from './XWUIAspectRatio';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIAspectRatio } from './XWUIAspectRatio';
export type { XWUIAspectRatioConfig, XWUIAspectRatioData, AspectRatioPreset } from './XWUIAspectRatio';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIAspectRatio, 'xwui-aspect-ratio', {
    flatAttrsToConfig: ['ratio', 'maxWidth', 'maxHeight', 'className', 'objectFit'],
    flatAttrsToData: []
});

