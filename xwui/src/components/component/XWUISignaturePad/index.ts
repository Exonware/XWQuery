/**
 * XWUISignaturePad Component Exports
 */

import { XWUISignaturePad } from './XWUISignaturePad';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISignaturePad } from './XWUISignaturePad';
export type { XWUISignaturePadConfig, XWUISignaturePadData } from './XWUISignaturePad';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISignaturePad, 'xwui-signature-pad', {
    flatAttrsToConfig: ['penColor', 'penWidth', 'backgroundColor', 'showClearButton', 'showSaveButton', 'className'],
    flatAttrsToData: ['imageData']
});

