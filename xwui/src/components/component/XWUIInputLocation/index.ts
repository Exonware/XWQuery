/**
 * XWUIInputLocation Component Exports
 */

import { XWUIInputLocation } from './XWUIInputLocation';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputLocation } from './XWUIInputLocation';
export type { XWUIInputLocationConfig, XWUIInputLocationData } from './XWUIInputLocation';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputLocation, 'xwui-location-input', {
    flatAttrsToConfig: ['apiKey', 'placeholder', 'showMap', 'mapHeight', 'className'],
    flatAttrsToData: ['value', 'address']
});

