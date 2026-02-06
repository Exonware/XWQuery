/**
 * XWUISlider Component Exports
 */

import { XWUISlider } from './XWUISlider';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISlider } from './XWUISlider';
export type { XWUISliderConfig, XWUISliderData } from './XWUISlider';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISlider, 'xwui-slider', {
    flatAttrsToConfig: ['min', 'max', 'step', 'disabled', 'showValue', 'showMarks', 'marks', 'orientation', 'color', 'size', 'className'],
    flatAttrsToData: ['value', 'label', 'name', 'id']
});

