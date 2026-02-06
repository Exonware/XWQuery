/**
 * XWUISpace Component Exports
 */

import { XWUISpace } from './XWUISpace';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUISpace } from './XWUISpace';
export type { XWUISpaceConfig, XWUISpaceData } from './XWUISpace';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUISpace, 'xwui-space', {
    flatAttrsToConfig: ['size', 'direction', 'wrap', 'split', 'className'],
    flatAttrsToData: ['items']
});

