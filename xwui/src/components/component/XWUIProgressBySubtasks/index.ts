/**
 * XWUIProgressBySubtasks Component Exports
 */

import { XWUIProgressBySubtasks } from './XWUIProgressBySubtasks';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIProgressBySubtasks } from './XWUIProgressBySubtasks';
export type { XWUIProgressBySubtasksConfig, XWUIProgressBySubtasksData, Subtask } from './XWUIProgressBySubtasks';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIProgressBySubtasks, 'xwui-progress-by-subtasks', {
    flatAttrsToConfig: ['showTree', 'showProgressBar', 'showStatistics', 'className'],
    flatAttrsToData: ['parentLabel']
});

