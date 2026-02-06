/**
 * XWUIGrid Component Exports
 */

import { XWUIGrid } from './XWUIGrid';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIGrid, createGridItem } from './XWUIGrid';
export type { XWUIGridConfig, XWUIGridData, XWUIGridItemConfig } from './XWUIGrid';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIGrid, 'xwui-grid', {
    flatAttrsToConfig: ['columns', 'rows', 'gap', 'rowGap', 'columnGap', 'alignItems', 'justifyItems', 'alignContent', 'justifyContent', 'autoFlow', 'autoRows', 'autoColumns', 'minChildWidth', 'className'],
    flatAttrsToData: []
});

