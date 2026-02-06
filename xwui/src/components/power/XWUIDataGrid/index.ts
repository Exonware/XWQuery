/**
 * XWUIDataGrid Component Exports
 */

import { XWUIDataGrid } from './XWUIDataGrid';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIDataGrid } from './XWUIDataGrid';
export type { XWUIDataGridConfig, XWUIDataGridData, XWUIDataGridColumn } from './XWUIDataGrid';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIDataGrid, 'xwui-datagrid', {
    flatAttrsToConfig: ['bordered', 'striped', 'hoverable', 'size', 'selectable', 'pagination', 'pageSize', 'className'],
    flatAttrsToData: ['columns', 'data']
});

