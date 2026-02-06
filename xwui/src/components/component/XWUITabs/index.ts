/**
 * XWUITabs Component Exports
 */

import { XWUITabs } from './XWUITabs';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITabs } from './XWUITabs';
export type { XWUITabsConfig, XWUITabsData, XWUITabItem } from './XWUITabs';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITabs, 'xwui-tabs', {
    flatAttrsToConfig: ['variant', 'size', 'orientation', 'centered', 'fullWidth', 'className'],
    flatAttrsToData: ['tabs', 'activeTab']
});

