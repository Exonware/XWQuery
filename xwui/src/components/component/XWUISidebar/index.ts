/**
 * XWUISidebar Component Exports
 */

import { XWUISidebar } from './XWUISidebar';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISidebar } from './XWUISidebar';
export type { XWUISidebarConfig, XWUISidebarData } from './XWUISidebar';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISidebar, 'xwui-sidebar', {
    flatAttrsToConfig: ['position', 'collapsible', 'collapsed', 'width', 'collapsedWidth', 'className'],
    flatAttrsToData: ['items', 'header', 'footer']
});

