/**
 * XWUITreeSelect Component Exports
 */

import { XWUITreeSelect } from './XWUITreeSelect';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUITreeSelect } from './XWUITreeSelect';
export type { XWUITreeSelectConfig, XWUITreeSelectData } from './XWUITreeSelect';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUITreeSelect, 'xwui-tree-select', {
    flatAttrsToConfig: ['treeCheckable', 'treeDefaultExpandAll', 'treeIcon', 'showCheckedStrategy', 'className'],
    flatAttrsToData: ['value', 'treeData', 'placeholder']
});

