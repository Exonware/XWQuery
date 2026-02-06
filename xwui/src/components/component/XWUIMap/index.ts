/**
 * XWUIMap Component Exports
 */

import { XWUIMap } from './XWUIMap';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMap } from './XWUIMap';
export type { XWUIMapConfig, XWUIMapData, XWUIMapLocation } from './XWUIMap';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMap, 'xwui-map', {
    flatAttrsToConfig: ['apiKey', 'center', 'zoom', 'className'],
    flatAttrsToData: ['markers']
});

