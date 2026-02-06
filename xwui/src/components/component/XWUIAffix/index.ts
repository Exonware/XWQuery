/**
 * XWUIAffix Component Exports
 */

import { XWUIAffix } from './XWUIAffix';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIAffix } from './XWUIAffix';
export type { XWUIAffixConfig, XWUIAffixData } from './XWUIAffix';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAffix, 'xwui-affix', {
    flatAttrsToConfig: ['offset', 'position', 'target', 'className'],
    flatAttrsToData: ['content']
});

