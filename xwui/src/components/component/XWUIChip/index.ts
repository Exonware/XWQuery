/**
 * XWUIChip Component Exports
 */

import { XWUIChip } from './XWUIChip';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIChip } from './XWUIChip';
export type { XWUIChipConfig, XWUIChipData } from './XWUIChip';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIChip, 'xwui-chip', {
    flatAttrsToConfig: ['variant', 'size', 'closable', 'clickable', 'avatar', 'icon', 'className'],
    flatAttrsToData: ['label']
});

