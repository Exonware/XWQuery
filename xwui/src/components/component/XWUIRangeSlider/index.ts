/**
 * XWUIRangeSlider Component Exports
 */

import { XWUIRangeSlider } from './XWUIRangeSlider';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIRangeSlider } from './XWUIRangeSlider';
export type { XWUIRangeSliderConfig, XWUIRangeSliderData } from './XWUIRangeSlider';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIRangeSlider, 'xwui-range-slider', {
    flatAttrsToConfig: ['min', 'max', 'step', 'disabled', 'showValue', 'orientation', 'color', 'size', 'className'],
    flatAttrsToData: ['value', 'label']
});

