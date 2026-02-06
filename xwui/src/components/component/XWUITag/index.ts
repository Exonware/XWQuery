/**
 * XWUITag Component Exports
 */

import { XWUITag } from './XWUITag';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITag } from './XWUITag';
export type { XWUITagConfig, XWUITagData } from './XWUITag';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITag, 'xwui-tag', {
    flatAttrsToConfig: ['variant', 'size', 'className'],
    flatAttrsToData: ['label']
});

