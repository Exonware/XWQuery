/**
 * XWUICommand Component Exports
 */

import { XWUICommand } from './XWUICommand';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICommand } from './XWUICommand';
export type { XWUICommandConfig, XWUICommandData, XWUICommandItem } from './XWUICommand';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICommand, 'xwui-command', {
    flatAttrsToConfig: ['placeholder', 'className'],
    flatAttrsToData: ['items']
});

