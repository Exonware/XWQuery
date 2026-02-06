/**
 * XWUISectionGrouping Component Exports
 */

import { XWUISectionGrouping } from './XWUISectionGrouping';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUISectionGrouping } from './XWUISectionGrouping';
export type { XWUISectionGroupingConfig, XWUISectionGroupingData, Section, SectionItem } from './XWUISectionGrouping';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUISectionGrouping, 'xwui-section-grouping', {
    flatAttrsToConfig: ['collapsible', 'defaultCollapsed', 'showItemCount', 'sortable', 'className'],
    flatAttrsToData: ['sections']
});

