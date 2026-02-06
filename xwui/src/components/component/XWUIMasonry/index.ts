/**
 * XWUIMasonry Component Exports
 */

import { XWUIMasonry } from './XWUIMasonry';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMasonry } from './XWUIMasonry';
export type { XWUIMasonryConfig, XWUIMasonryData } from './XWUIMasonry';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMasonry, 'xwui-masonry', {
    flatAttrsToConfig: ['columns', 'columnWidth', 'gap', 'responsive', 'className'],
    flatAttrsToData: ['items']
});

