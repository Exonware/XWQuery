/**
 * XWUIKanbanBoard Component Exports
 */

import { XWUIKanbanBoard } from './XWUIKanbanBoard';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIKanbanBoard } from './XWUIKanbanBoard';
export type { XWUIKanbanBoardConfig, XWUIKanbanBoardData, KanbanColumn, KanbanCard } from './XWUIKanbanBoard';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIKanbanBoard, 'xwui-kanban-board', {
    flatAttrsToConfig: ['allowAddCards', 'allowReorder', 'className'],
    flatAttrsToData: ['columns']
});

