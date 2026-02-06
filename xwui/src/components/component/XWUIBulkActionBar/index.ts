/**
 * XWUIBulkActionBar Component Exports
 */

import { XWUIBulkActionBar } from './XWUIBulkActionBar';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBulkActionBar } from './XWUIBulkActionBar';
export type { XWUIBulkActionBarConfig, XWUIBulkActionBarData, BulkAction } from './XWUIBulkActionBar';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBulkActionBar, 'xwui-bulk-action-bar', {
    flatAttrsToConfig: ['position', 'showCount', 'className'],
    flatAttrsToData: ['selectedCount', 'visible']
});

