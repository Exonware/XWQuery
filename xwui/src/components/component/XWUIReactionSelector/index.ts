/**
 * XWUIReactionSelector Component Exports
 */

import { XWUIReactionSelector } from './XWUIReactionSelector';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIReactionSelector } from './XWUIReactionSelector';
export type { XWUIReactionSelectorConfig, XWUIReactionSelectorData, Reaction } from './XWUIReactionSelector';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIReactionSelector, 'xwui-reaction-selector', {
    flatAttrsToConfig: ['showCount', 'showUserList', 'placement', 'className'],
    flatAttrsToData: ['reactions']
});

