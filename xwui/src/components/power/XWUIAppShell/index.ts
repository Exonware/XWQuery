/**
 * XWUIAppShell Component Exports
 */

import { XWUIAppShell } from './XWUIAppShell';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIAppShell } from './XWUIAppShell';
export type { XWUIAppShellConfig, XWUIAppShellData } from './XWUIAppShell';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIAppShell, 'xwui-app-shell', {
    flatAttrsToConfig: ['sidebarCollapsible', 'sidebarCollapsed', 'sidebarWidth', 'direction', 'className'],
    flatAttrsToData: ['header', 'sidebar', 'main', 'footer']
});

