/**
 * XWUIGanttChart Component Exports
 */

import { XWUIGanttChart } from './XWUIGanttChart';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIGanttChart } from './XWUIGanttChart';
export type { XWUIGanttChartConfig, XWUIGanttChartData, GanttTask, GanttZoomLevel } from './XWUIGanttChart';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIGanttChart, 'xwui-gantt-chart', {
    flatAttrsToConfig: ['zoomLevel', 'showSidebar', 'showDependencies', 'showCriticalPath', 'className'],
    flatAttrsToData: ['startDate', 'endDate']
});

