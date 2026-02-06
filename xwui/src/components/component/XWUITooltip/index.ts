/**
 * XWUITooltip Component Exports
 */

import { XWUITooltip } from './XWUITooltip';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITooltip, tooltip } from './XWUITooltip';
export type { XWUITooltipConfig, XWUITooltipData } from './XWUITooltip';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITooltip, 'xwui-tooltip', {
    flatAttrsToConfig: ['placement', 'trigger', 'delay', 'offset', 'arrow', 'className'],
    flatAttrsToData: ['content']
});

