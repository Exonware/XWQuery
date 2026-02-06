/**
 * XWUIPivotTable Component Exports
 */

import { XWUIPivotTable } from './XWUIPivotTable';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPivotTable } from './XWUIPivotTable';
export type { XWUIPivotTableConfig, XWUIPivotTableData, PivotField, PivotConfig } from './XWUIPivotTable';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPivotTable, 'xwui-pivot-table', {
    flatAttrsToConfig: ['showFieldPanel', 'className'],
    flatAttrsToData: ['fields', 'data', 'config']
});

