/**
 * XWUIAccordion Component Exports
 */

import { XWUIAccordion } from './XWUIAccordion';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIAccordion } from './XWUIAccordion';
export type { XWUIAccordionConfig, XWUIAccordionData, XWUIAccordionItem } from './XWUIAccordion';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIAccordion, 'xwui-accordion', {
    flatAttrsToConfig: ['mode', 'duration', 'easing', 'bordered', 'flush', 'className'],
    flatAttrsToData: ['items']
});

