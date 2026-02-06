/**
 * XWUILabel Component Exports
 */

import { XWUILabel } from './XWUILabel';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUILabel } from './XWUILabel';
export type { XWUILabelConfig, XWUILabelData } from './XWUILabel';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUILabel, 'xwui-label', {
    flatAttrsToConfig: ['required', 'disabled', 'size', 'htmlFor', 'className'],
    flatAttrsToData: ['text']
});

