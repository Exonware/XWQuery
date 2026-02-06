/**
 * XWUITypingIndicator Component Exports
 */

import { XWUITypingIndicator } from './XWUITypingIndicator';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITypingIndicator } from './XWUITypingIndicator';
export type { XWUITypingIndicatorConfig, XWUITypingIndicatorData } from './XWUITypingIndicator';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITypingIndicator, 'xwui-typing-indicator', {
    flatAttrsToConfig: ['userName', 'showAvatar', 'avatarUrl', 'animationSpeed', 'autoHide', 'autoHideDelay', 'className'],
    flatAttrsToData: ['visible', 'users']
});

