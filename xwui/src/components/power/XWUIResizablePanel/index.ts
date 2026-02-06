/**
 * XWUIResizablePanel Component Exports
 */

import { XWUIResizablePanel } from './XWUIResizablePanel';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIResizablePanel } from './XWUIResizablePanel';
export type { XWUIResizablePanelConfig, XWUIResizablePanelData } from './XWUIResizablePanel';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIResizablePanel, 'xwui-resizable-panel', {
    flatAttrsToConfig: ['direction', 'initialSize', 'minSize', 'maxSize', 'dividerSize', 'className'],
    flatAttrsToData: ['leftPane', 'rightPane']
});

