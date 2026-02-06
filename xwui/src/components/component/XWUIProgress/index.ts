/**
 * XWUIProgress Component Exports
 */

import { XWUIProgress } from './XWUIProgress';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIProgress } from './XWUIProgress';
export type { XWUIProgressConfig, XWUIProgressData } from './XWUIProgress';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIProgress, 'xwui-progress', {
    flatAttrsToConfig: ['variant', 'size', 'color', 'indeterminate', 'showValue', 'strokeWidth', 'className'],
    flatAttrsToData: ['value', 'label']
});

