/**
 * XWUITree Component Exports
 */

import { XWUITree } from './XWUITree';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITree } from './XWUITree';
export type { XWUITreeConfig, XWUITreeData, XWUITreeNode } from './XWUITree';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITree, 'xwui-tree', {
    flatAttrsToConfig: ['selectable', 'multiple', 'showIcons', 'className'],
    flatAttrsToData: ['nodes']
});

