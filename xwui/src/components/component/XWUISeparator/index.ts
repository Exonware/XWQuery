/**
 * XWUISeparator Component Exports
 */

import { XWUISeparator } from './XWUISeparator';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISeparator } from './XWUISeparator';
export type { XWUISeparatorConfig, XWUISeparatorData } from './XWUISeparator';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISeparator, 'xwui-separator', {
    flatAttrsToConfig: ['orientation', 'decorative', 'className'],
    flatAttrsToData: ['label']
});

