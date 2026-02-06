/**
 * XWUIQRCode Component Exports
 */

import { XWUIQRCode } from './XWUIQRCode';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIQRCode } from './XWUIQRCode';
export type { XWUIQRCodeConfig, XWUIQRCodeData } from './XWUIQRCode';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIQRCode, 'xwui-qrcode', {
    flatAttrsToConfig: ['size', 'level', 'color', 'bgColor', 'icon', 'iconSize', 'className'],
    flatAttrsToData: ['value']
});

