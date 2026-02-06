/**
 * XWUIKbd Component Exports
 */

import { XWUIKbd } from './XWUIKbd';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIKbd } from './XWUIKbd';
export type { XWUIKbdConfig, XWUIKbdData } from './XWUIKbd';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIKbd, 'xwui-kbd', {
    flatAttrsToConfig: ['size', 'className'],
    flatAttrsToData: ['keys']
});

