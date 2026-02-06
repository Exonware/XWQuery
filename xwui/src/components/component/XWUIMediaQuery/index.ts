/**
 * XWUIMediaQuery Component Exports
 */

import { XWUIMediaQuery } from './XWUIMediaQuery';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMediaQuery } from './XWUIMediaQuery';
export type { XWUIMediaQueryConfig, XWUIMediaQueryData } from './XWUIMediaQuery';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMediaQuery, 'xwui-media-query', {
    flatAttrsToConfig: ['query', 'matches', 'className'],
    flatAttrsToData: ['content']
});

