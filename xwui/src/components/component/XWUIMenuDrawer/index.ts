/**
 * XWUIMenuDrawer Component Exports
 */

import { XWUIMenuDrawer } from './XWUIMenuDrawer';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIMenuDrawer } from './XWUIMenuDrawer';
export type { XWUIMenuDrawerConfig, XWUIMenuDrawerData } from './XWUIMenuDrawer';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIMenuDrawer, 'xwui-drawer', {
    flatAttrsToConfig: ['placement', 'size', 'closable', 'closeOnBackdrop', 'closeOnEscape', 'mask', 'className'],
    flatAttrsToData: ['title']
});

