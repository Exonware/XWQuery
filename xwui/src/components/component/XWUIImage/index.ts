/**
 * XWUIImage Component Exports
 */

import { XWUIImage } from './XWUIImage';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIImage } from './XWUIImage';
export type { XWUIImageConfig, XWUIImageData } from './XWUIImage';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIImage, 'xwui-image', {
    flatAttrsToConfig: ['lazy', 'placeholder', 'fallback', 'aspectRatio', 'objectFit', 'objectPosition', 'className', 'width', 'height'],
    flatAttrsToData: ['src', 'alt', 'loading']
});

