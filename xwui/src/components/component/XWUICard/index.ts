/**
 * XWUICard Component Exports
 */

import { XWUICard } from './XWUICard';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICard } from './XWUICard';
export type { XWUICardConfig, XWUICardData } from './XWUICard';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICard, 'xwui-card', {
    flatAttrsToConfig: ['variant', 'hoverable', 'clickable', 'padding', 'className'],
    flatAttrsToData: ['title', 'subtitle', 'cover']
});

