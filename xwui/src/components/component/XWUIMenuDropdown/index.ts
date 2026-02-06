/**
 * XWUIMenuDropdown Component Exports
 */

import { XWUIMenuDropdown } from './XWUIMenuDropdown';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMenuDropdown } from './XWUIMenuDropdown';
export type { XWUIMenuDropdownConfig, XWUIMenuDropdownData, XWUIMenuDropdownItem } from './XWUIMenuDropdown';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMenuDropdown, 'xwui-dropdown-menu', {
    flatAttrsToConfig: ['trigger', 'placement', 'align', 'closeOnSelect', 'className'],
    flatAttrsToData: ['items', 'triggerElement']
});

