/**
 * XWUIScrollArea Component Exports
 */

import { XWUIScrollArea } from './XWUIScrollArea';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIScrollArea } from './XWUIScrollArea';
export type { XWUIScrollAreaConfig, XWUIScrollAreaData } from './XWUIScrollArea';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIScrollArea, 'xwui-scroll-area', {
    flatAttrsToConfig: ['orientation', 'hideScrollbar', 'className'],
    flatAttrsToData: ['content']
});

