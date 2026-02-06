/**
 * XWUIChart Component Exports
 */

import { XWUIChart } from './XWUIChart';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIChart } from './XWUIChart';
export type { XWUIChartConfig, XWUIChartData, XWUIChartSeries, XWUIChartDataPoint } from './XWUIChart';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIChart, 'xwui-chart', {
    flatAttrsToConfig: ['type', 'width', 'height', 'showLegend', 'showGrid', 'className'],
    flatAttrsToData: ['series', 'title']
});

