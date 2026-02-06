/**
 * XWUIHoverCard Component Exports
 */

import { XWUIHoverCard } from './XWUIHoverCard';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIHoverCard } from './XWUIHoverCard';
export type { XWUIHoverCardConfig, XWUIHoverCardData } from './XWUIHoverCard';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIHoverCard, 'xwui-hover-card', {
    flatAttrsToConfig: ['openDelay', 'closeDelay', 'openOnHover', 'placement', 'align', 'arrow', 'className'],
    flatAttrsToData: ['title', 'content', 'triggerElement']
});

