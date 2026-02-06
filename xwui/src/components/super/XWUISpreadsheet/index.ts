/**
 * XWUISpreadsheet Component Exports
 */

import { XWUISpreadsheet } from './XWUISpreadsheet';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISpreadsheet } from './XWUISpreadsheet';
export type { XWUISpreadsheetConfig, XWUISpreadsheetData, SpreadsheetCell, SpreadsheetRow } from './XWUISpreadsheet';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISpreadsheet, 'xwui-spreadsheet', {
    flatAttrsToConfig: ['rows', 'columns', 'showToolbar', 'showFormulaBar', 'showRowNumbers', 'showColumnHeaders', 'freezeRows', 'freezeColumns', 'className'],
    flatAttrsToData: ['data', 'activeCell', 'selectedRange']
});

