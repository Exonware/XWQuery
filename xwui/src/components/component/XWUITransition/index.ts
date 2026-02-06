/**
 * XWUITransition Component Exports
 */

import { XWUITransition } from './XWUITransition';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITransition } from './XWUITransition';
export type { XWUITransitionConfig, XWUITransitionData } from './XWUITransition';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITransition, 'xwui-transition', {
    flatAttrsToConfig: ['type', 'duration', 'easing', 'in', 'direction', 'appear', 'unmountOnExit', 'className'],
    flatAttrsToData: ['children', 'content']
});

