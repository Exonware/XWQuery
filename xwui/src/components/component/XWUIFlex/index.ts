/**
 * XWUIFlex Component Exports
 */

import { XWUIFlex } from './XWUIFlex';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIFlex } from './XWUIFlex';
export type { XWUIFlexConfig, XWUIFlexData } from './XWUIFlex';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIFlex, 'xwui-flex', {
    flatAttrsToConfig: ['direction', 'align', 'justify', 'wrap', 'gap', 'className'],
    flatAttrsToData: ['items']
});

