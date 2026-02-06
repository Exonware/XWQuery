/**
 * XWUISortableList Component Exports
 */

import { XWUISortableList } from './XWUISortableList';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISortableList } from './XWUISortableList';
export type { XWUISortableListConfig, XWUISortableListData } from './XWUISortableList';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISortableList, 'xwui-sortable-list', {
    flatAttrsToConfig: ['itemClassName', 'draggingClassName', 'className'],
    flatAttrsToData: ['items']
});

