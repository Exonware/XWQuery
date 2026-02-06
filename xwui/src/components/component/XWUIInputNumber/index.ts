/**
 * XWUIInputNumber Component Exports
 */

import { XWUIInputNumber } from './XWUIInputNumber';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIInputNumber } from './XWUIInputNumber';
export type { XWUIInputNumberConfig, XWUIInputNumberData } from './XWUIInputNumber';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIInputNumber, 'xwui-number-input', {
    flatAttrsToConfig: ['min', 'max', 'step', 'precision', 'controls', 'size', 'disabled', 'className'],
    flatAttrsToData: ['value', 'placeholder']
});

