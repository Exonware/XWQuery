/**
 * XWUIResizable Component Exports
 */

import { XWUIResizable } from './XWUIResizable';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIResizable } from './XWUIResizable';
export type { XWUIResizableConfig, XWUIResizableData } from './XWUIResizable';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIResizable, 'xwui-resizable', {
    flatAttrsToConfig: ['direction', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'className'],
    flatAttrsToData: ['content', 'width', 'height']
});

