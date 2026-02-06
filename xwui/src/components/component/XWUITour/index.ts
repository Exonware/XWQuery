/**
 * XWUITour Component Exports
 */

import { XWUITour } from './XWUITour';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUITour } from './XWUITour';
export type { XWUITourConfig, XWUITourData, TourStep } from './XWUITour';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUITour, 'xwui-tour', {
    flatAttrsToConfig: ['steps', 'current', 'type', 'mask', 'className'],
    flatAttrsToData: ['open']
});

