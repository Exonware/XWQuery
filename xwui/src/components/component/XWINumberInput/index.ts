/**
 * XWUIInputNumber Component Exports
 */

import { XWUIInputNumber } from './XWINumberInput';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIInputNumber } from './XWINumberInput';
export type { XWUIInputNumberConfig, XWUIInputNumberData } from './XWINumberInput';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIInputNumber, 'xwui-number-input', {
    flatAttrsToConfig: ['min', 'max', 'step', 'precision', 'controls', 'size', 'disabled', 'className'],
    flatAttrsToData: ['value', 'placeholder']
});

