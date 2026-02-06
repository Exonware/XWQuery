/**
 * XWUICopyButton Component Exports
 */

import { XWUICopyButton } from './XWUICopyButton';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICopyButton } from './XWUICopyButton';
export type { XWUICopyButtonConfig, XWUICopyButtonData } from './XWUICopyButton';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICopyButton, 'xwui-copy-button', {
    flatAttrsToConfig: ['variant', 'size', 'copiedTimeout', 'copyIcon', 'copiedIcon', 'showIcon', 'className'],
    flatAttrsToData: ['text', 'value', 'copiedText']
});

