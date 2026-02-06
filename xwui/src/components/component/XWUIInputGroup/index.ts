/**
 * XWUIInputGroup Component Exports
 */

import { XWUIInputGroup } from './XWUIInputGroup';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputGroup } from './XWUIInputGroup';
export type { XWUIInputGroupConfig, XWUIInputGroupData } from './XWUIInputGroup';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputGroup, 'xwui-input-group', {
    flatAttrsToConfig: ['size', 'className'],
    flatAttrsToData: ['prefix', 'suffix', 'input']
});

