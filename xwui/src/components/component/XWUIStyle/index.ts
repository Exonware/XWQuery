/**
 * XWUIStyle Component
 * Exports and Custom Element registration
 */

import { XWUIStyle } from './XWUIStyle';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export * from './XWUIStyle';

// Register as Custom Element
createXWUIElement(XWUIStyle, 'xwui-style', {
    flatAttrsToConfig: ['basePath', 'brand', 'style', 'color', 'accent', 'lines', 'roundness', 'font', 'icons', 'emojis', 'autoLoad']
});

