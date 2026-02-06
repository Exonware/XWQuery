/**
 * XWUIBadge Component Exports
 */

import { XWUIBadge } from './XWUIBadge';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIBadge } from './XWUIBadge';
export type { XWUIBadgeConfig, XWUIBadgeData } from './XWUIBadge';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIBadge, 'xwui-badge', {
    flatAttrsToConfig: ['variant', 'size', 'dot', 'max', 'showZero', 'position', 'standalone', 'className'],
    flatAttrsToData: ['count', 'text']
});

