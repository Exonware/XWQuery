/**
 * XWUIMenuContext Component Exports
 */

import { XWUIMenuContext } from './XWUIMenuContext';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMenuContext } from './XWUIMenuContext';
export type { XWUIMenuContextConfig, XWUIMenuContextData } from './XWUIMenuContext';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMenuContext, 'xwui-context-menu', {
    flatAttrsToConfig: ['className'],
    flatAttrsToData: ['items', 'targetElement']
});

