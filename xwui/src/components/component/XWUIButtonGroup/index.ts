/**
 * XWUIButtonGroup Component Exports
 */

import { XWUIButtonGroup } from './XWUIButtonGroup';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIButtonGroup } from './XWUIButtonGroup';
export type { XWUIButtonGroupConfig, XWUIButtonGroupData, XWUIButtonGroupItem } from './XWUIButtonGroup';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIButtonGroup, 'xwui-button-group', {
    flatAttrsToConfig: ['variant', 'size', 'orientation', 'className'],
    flatAttrsToData: ['buttons', 'selected']
});

