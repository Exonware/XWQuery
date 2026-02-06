/**
 * XWUIToggleGroup Component Exports
 */

import { XWUIToggleGroup } from './XWUIToggleGroup';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIToggleGroup } from './XWUIToggleGroup';
export type { XWUIToggleGroupConfig, XWUIToggleGroupData, XWUIToggleGroupItem } from './XWUIToggleGroup';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIToggleGroup, 'xwui-toggle-group', {
    flatAttrsToConfig: ['variant', 'size', 'multiple', 'className'],
    flatAttrsToData: ['items', 'selected']
});

