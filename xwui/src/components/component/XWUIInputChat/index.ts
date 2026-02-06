/**
 * XWUIInputChat Component Exports
 */

import { XWUIInputChat } from './XWUIInputChat';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputChat } from './XWUIInputChat';
export type { XWUIInputChatConfig, XWUIInputChatData } from './XWUIInputChat';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputChat, 'xwui-chat-input', {
    flatAttrsToConfig: ['placeholder', 'maxRows', 'minRows', 'showFileButton', 'showSendButton', 'className'],
    flatAttrsToData: ['value']
});

