/**
 * XWUIPage Component Exports
 * Usage: Custom Element <xwui-page> (auto-registered)
 */

import { XWUIPage } from './XWUIPage';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIPage } from './XWUIPage';
export type { XWUIPageConfig, XWUIPageData, XWUIPageComponentDescriptor } from './XWUIPage';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes and grouped attributes (conf-comp, data)
createXWUIElement(XWUIPage, 'xwui-page', {
    flatAttrsToConfig: ['pageType', 'className'],
    flatAttrsToData: ['title', 'subtitle', 'description']
});


