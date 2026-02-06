/**
 * XWUIContainer Component Exports
 */

import { XWUIContainer } from './XWUIContainer';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIContainer } from './XWUIContainer';
export type { XWUIContainerConfig, XWUIContainerData } from './XWUIContainer';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIContainer, 'xwui-container', {
    flatAttrsToConfig: ['maxWidth', 'center', 'padding', 'className'],
    flatAttrsToData: ['content', 'children']
});

