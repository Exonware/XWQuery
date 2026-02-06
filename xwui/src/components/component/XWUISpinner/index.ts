/**
 * XWUISpinner Component Exports
 */

import { XWUISpinner } from './XWUISpinner';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISpinner } from './XWUISpinner';
export type { XWUISpinnerConfig, XWUISpinnerData } from './XWUISpinner';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISpinner, 'xwui-spinner', {
    flatAttrsToConfig: ['size', 'color', 'overlay', 'blur', 'className'],
    flatAttrsToData: ['label', 'spinning']
});

