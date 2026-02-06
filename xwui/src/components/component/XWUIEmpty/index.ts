/**
 * XWUIEmpty Component Exports
 */

import { XWUIEmpty } from './XWUIEmpty';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIEmpty } from './XWUIEmpty';
export type { XWUIEmptyConfig, XWUIEmptyData } from './XWUIEmpty';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIEmpty, 'xwui-empty', {
    flatAttrsToConfig: ['size', 'className'],
    flatAttrsToData: ['title', 'description', 'image', 'icon', 'action']
});

