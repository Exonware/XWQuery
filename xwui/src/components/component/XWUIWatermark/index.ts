/**
 * XWUIWatermark Component Exports
 */

import { XWUIWatermark } from './XWUIWatermark';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIWatermark } from './XWUIWatermark';
export type { XWUIWatermarkConfig, XWUIWatermarkData } from './XWUIWatermark';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIWatermark, 'xwui-watermark', {
    flatAttrsToConfig: ['content', 'gap', 'offset', 'rotate', 'zIndex', 'font', 'className'],
    flatAttrsToData: ['image']
});

