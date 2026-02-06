/**
 * XWUISteps Component Exports
 */

import { XWUISteps } from './XWUISteps';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISteps } from './XWUISteps';
export type { XWUIStepsConfig, XWUIStepsData, XWUIStepItem } from './XWUISteps';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISteps, 'xwui-steps', {
    flatAttrsToConfig: ['current', 'direction', 'size', 'className'],
    flatAttrsToData: ['steps']
});

