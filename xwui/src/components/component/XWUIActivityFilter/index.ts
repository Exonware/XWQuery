/**
 * XWUIActivityFilter Component Exports
 */

import { XWUIActivityFilter } from './XWUIActivityFilter';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIActivityFilter } from './XWUIActivityFilter';
export type { XWUIActivityFilterConfig, XWUIActivityFilterData, ActivityFilter } from './XWUIActivityFilter';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIActivityFilter, 'xwui-activity-filter', {
    flatAttrsToConfig: ['showSearch', 'showFilters', 'showTabs', 'className'],
    flatAttrsToData: ['contributors', 'messages']
});

