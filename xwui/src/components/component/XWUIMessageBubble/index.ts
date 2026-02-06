/**
 * XWUIMessageBubble Component Exports
 */

import { XWUIMessageBubble } from './XWUIMessageBubble';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMessageBubble } from './XWUIMessageBubble';
export type { XWUIMessageBubbleConfig, XWUIMessageBubbleData, XWUIMessageBubbleMessage } from './XWUIMessageBubble';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMessageBubble, 'xwui-message-bubble', {
    flatAttrsToConfig: ['isOwn', 'showAvatar', 'showTimestamp', 'showSenderName', 'maxLength', 'className'],
    flatAttrsToData: ['message']
});

