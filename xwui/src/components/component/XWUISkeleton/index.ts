/**
 * XWUISkeleton Component Exports
 */

import { XWUISkeleton } from './XWUISkeleton';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISkeleton } from './XWUISkeleton';
export type { XWUISkeletonConfig, XWUISkeletonData } from './XWUISkeleton';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISkeleton, 'xwui-skeleton', {
    flatAttrsToConfig: ['variant', 'animation', 'width', 'height', 'lines', 'lineHeight', 'className'],
    flatAttrsToData: []
});

