/**
 * XWUIThread Component Exports
 */

import { XWUIThread } from './XWUIThread';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIThread } from './XWUIThread';
export type { XWUIThreadConfig, XWUIThreadData, XWUIThreadMessage, XWUIThreadContributor } from './XWUIThread';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIThread, 'xwui-thread', {
    flatAttrsToConfig: ['viewerId', 'autoScroll', 'className'],
    flatAttrsToData: ['contributors', 'messages']
});

