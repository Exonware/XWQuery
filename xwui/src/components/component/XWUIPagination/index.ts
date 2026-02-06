/**
 * XWUIPagination Component Exports
 */

import { XWUIPagination } from './XWUIPagination';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPagination } from './XWUIPagination';
export type { XWUIPaginationConfig, XWUIPaginationData } from './XWUIPagination';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPagination, 'xwui-pagination', {
    flatAttrsToConfig: ['size', 'showSizeChanger', 'showQuickJumper', 'showTotal', 'simple', 'pageSizeOptions', 'className'],
    flatAttrsToData: ['current', 'total', 'pageSize']
});

