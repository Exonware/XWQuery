/**
 * XWUIAnchor Component Exports
 */

import { XWUIAnchor } from './XWUIAnchor';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIAnchor } from './XWUIAnchor';
export type { XWUIAnchorConfig, XWUIAnchorData, AnchorItem } from './XWUIAnchor';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAnchor, 'xwui-anchor', {
    flatAttrsToConfig: ['offset', 'affix', 'bounds', 'targetOffset', 'className'],
    flatAttrsToData: ['items']
});

