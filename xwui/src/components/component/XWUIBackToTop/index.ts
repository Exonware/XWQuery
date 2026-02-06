/**
 * XWUIBackToTop Component Exports
 */

import { XWUIBackToTop } from './XWUIBackToTop';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIBackToTop } from './XWUIBackToTop';
export type { XWUIBackToTopConfig, XWUIBackToTopData } from './XWUIBackToTop';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIBackToTop, 'xwui-back-to-top', {
    flatAttrsToConfig: ['visible', 'threshold', 'position', 'offset', 'smooth', 'className'],
    flatAttrsToData: ['icon']
});

