/**
 * XWUIScrollTo Component Exports
 */

import { XWUIScrollTo } from './XWUIScrollTo';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIScrollTo } from './XWUIScrollTo';
export type { XWUIScrollToConfig, XWUIScrollToData } from './XWUIScrollTo';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIScrollTo, 'xwui-scroll-to', {
    flatAttrsToConfig: ['behavior', 'block', 'inline', 'offset', 'className'],
    flatAttrsToData: ['targetId', 'content']
});

