/**
 * XWUISplitButton Component Exports
 */

import { XWUISplitButton } from './XWUISplitButton';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUISplitButton } from './XWUISplitButton';
export type { XWUISplitButtonConfig, XWUISplitButtonData, XWUISplitButtonItem } from './XWUISplitButton';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUISplitButton, 'xwui-split-button', {
    flatAttrsToConfig: ['variant', 'size', 'disabled', 'loading', 'dropdownPlacement', 'className'],
    flatAttrsToData: ['label', 'text', 'items']
});

