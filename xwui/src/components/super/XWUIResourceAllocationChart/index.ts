/**
 * XWUIResourceAllocationChart Component Exports
 */

import { XWUIResourceAllocationChart } from './XWUIResourceAllocationChart';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIResourceAllocationChart } from './XWUIResourceAllocationChart';
export type { XWUIResourceAllocationChartConfig, XWUIResourceAllocationChartData, ResourceAllocation } from './XWUIResourceAllocationChart';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIResourceAllocationChart, 'xwui-resource-allocation-chart', {
    flatAttrsToConfig: ['chartType', 'showTooltip', 'showLegend', 'className'],
    flatAttrsToData: ['timeRange']
});

