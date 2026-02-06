/**
 * XWUIMentions Component Exports
 */

import { XWUIMentions } from './XWUIMentions';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIMentions } from './XWUIMentions';
export type { XWUIMentionsConfig, XWUIMentionsData, MentionOption } from './XWUIMentions';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIMentions, 'xwui-mentions', {
    flatAttrsToConfig: ['prefix', 'split', 'placement', 'notFoundContent', 'className'],
    flatAttrsToData: ['value', 'options']
});

