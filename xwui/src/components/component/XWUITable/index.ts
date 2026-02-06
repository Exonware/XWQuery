/**
 * XWUITable Component Exports
 */

import { XWUITable } from './XWUITable';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITable } from './XWUITable';
export type { XWUITableConfig, XWUITableData, XWUITableColumn } from './XWUITable';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITable, 'xwui-table', {
    flatAttrsToConfig: ['bordered', 'striped', 'hoverable', 'size', 'selectable', 'pagination', 'pageSize', 'className'],
    flatAttrsToData: ['columns', 'data']
});

