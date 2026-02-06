/**
 * XWUIMobileStepper Component Exports
 * Usage: Custom Element <xwui-mobile-stepper> (auto-registered)
 */

import { XWUIMobileStepper } from './XWUIMobileStepper';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIMobileStepper } from './XWUIMobileStepper';
export type { XWUIMobileStepperConfig, XWUIMobileStepperData } from './XWUIMobileStepper';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIMobileStepper, 'xwui-mobile-stepper', {
    flatAttrsToConfig: ['variant', 'position', 'steps', 'activeStep', 'nextButtonText', 'backButtonText', 'showNextButton', 'showBackButton', 'className'],
    flatAttrsToData: ['nextButtonDisabled', 'backButtonDisabled']
});

