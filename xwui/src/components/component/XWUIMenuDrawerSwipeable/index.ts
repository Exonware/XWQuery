/**
 * XWUIMenuDrawerSwipeable Component Exports
 * Usage: Custom Element <xwui-swipeable-drawer> (auto-registered)
 */

import { XWUIMenuDrawerSwipeable } from './XWUIMenuDrawerSwipeable';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component (framework-agnostic)
export { XWUIMenuDrawerSwipeable } from './XWUIMenuDrawerSwipeable';
export type { XWUIMenuDrawerSwipeableConfig, XWUIMenuDrawerSwipeableData } from './XWUIMenuDrawerSwipeable';
// Re-export types from XWUIComponent
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element using generic factory
// Supports both flat attributes and grouped attributes (conf-comp, data)
createXWUIElement(XWUIMenuDrawerSwipeable, 'xwui-swipeable-drawer', {
    flatAttrsToConfig: ['placement', 'size', 'closable', 'closeOnBackdrop', 'closeOnEscape', 'mask', 'className', 'swipeable', 'swipeThreshold', 'disableSwipeToOpen', 'disableDiscovery'],
    flatAttrsToData: ['title', 'content', 'footer']
});

