/**
 * XWUIRating Component Exports
 */

import { XWUIRating } from './XWUIRating';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIRating } from './XWUIRating';
export type { XWUIRatingConfig, XWUIRatingData } from './XWUIRating';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIRating, 'xwui-rating', {
    flatAttrsToConfig: ['max', 'allowHalf', 'readonly', 'disabled', 'size', 'className'],
    flatAttrsToData: ['value', 'label']
});

