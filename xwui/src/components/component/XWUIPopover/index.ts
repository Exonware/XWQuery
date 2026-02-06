/**
 * XWUIPopover Component Exports
 */

import { XWUIPopover } from './XWUIPopover';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIPopover } from './XWUIPopover';
export type { XWUIPopoverConfig, XWUIPopoverData } from './XWUIPopover';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIPopover, 'xwui-popover', {
    flatAttrsToConfig: ['trigger', 'placement', 'align', 'arrow', 'closeOnClickOutside', 'className'],
    flatAttrsToData: ['title', 'content', 'triggerElement']
});

