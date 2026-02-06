/**
 * XWUIStickersOverlay Component Exports
 */

import { XWUIStickersOverlay } from './XWUIStickersOverlay';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIStickersOverlay } from './XWUIStickersOverlay';
export type { XWUIStickersOverlayConfig, XWUIStickersOverlayData, Sticker, StickerOverlay } from './XWUIStickersOverlay';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIStickersOverlay, 'xwui-stickers-overlay', {
    flatAttrsToConfig: ['showCategories', 'className'],
    flatAttrsToData: ['overlays', 'canvasElement']
});

