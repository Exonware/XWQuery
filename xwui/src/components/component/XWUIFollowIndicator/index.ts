/**
 * XWUIFollowIndicator Component Exports
 */

import { XWUIFollowIndicator } from './XWUIFollowIndicator';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIFollowIndicator } from './XWUIFollowIndicator';
export type { XWUIFollowIndicatorConfig, XWUIFollowIndicatorData } from './XWUIFollowIndicator';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIFollowIndicator, 'xwui-follow-indicator', {
    flatAttrsToConfig: ['variant', 'size', 'showNotificationCount', 'className'],
    flatAttrsToData: ['following', 'notificationCount', 'label']
});

