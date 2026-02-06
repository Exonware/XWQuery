/**
 * XWUIBreadcrumbs Component Exports
 */

import { XWUIBreadcrumbs } from './XWUIBreadcrumbs';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBreadcrumbs } from './XWUIBreadcrumbs';
export type { XWUIBreadcrumbsConfig, XWUIBreadcrumbsData, XWUIBreadcrumbItem } from './XWUIBreadcrumbs';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBreadcrumbs, 'xwui-breadcrumbs', {
    flatAttrsToConfig: ['separator', 'maxItems', 'collapseAt', 'size', 'className'],
    flatAttrsToData: ['items']
});

