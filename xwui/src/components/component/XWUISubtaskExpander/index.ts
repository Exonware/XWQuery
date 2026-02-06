/**
 * XWUISubtaskExpander Component Exports
 */

import { XWUISubtaskExpander } from './XWUISubtaskExpander';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUISubtaskExpander } from './XWUISubtaskExpander';
export type { XWUISubtaskExpanderConfig, XWUISubtaskExpanderData, SubtaskItem } from './XWUISubtaskExpander';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUISubtaskExpander, 'xwui-subtask-expander', {
    flatAttrsToConfig: ['showCheckbox', 'showProgress', 'indentSize', 'className'],
    flatAttrsToData: ['expanded']
});

