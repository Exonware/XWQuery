/**
 * XWUISpoiler Component Exports
 */

import { XWUISpoiler } from './XWUISpoiler';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUISpoiler } from './XWUISpoiler';
export type { XWUISpoilerConfig, XWUISpoilerData } from './XWUISpoiler';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUISpoiler, 'xwui-spoiler', {
    flatAttrsToConfig: ['maxHeight', 'showLabel', 'hideLabel', 'transitionDuration', 'className'],
    flatAttrsToData: ['content']
});

