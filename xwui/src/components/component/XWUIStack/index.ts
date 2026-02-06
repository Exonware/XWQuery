/**
 * XWUIStack Component Exports
 */

import { XWUIStack } from './XWUIStack';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIStack } from './XWUIStack';
export type { XWUIStackConfig, XWUIStackData } from './XWUIStack';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIStack, 'xwui-stack', {
    flatAttrsToConfig: ['direction', 'align', 'justify', 'wrap', 'spacing', 'gap', 'className'],
    flatAttrsToData: ['items']
});

