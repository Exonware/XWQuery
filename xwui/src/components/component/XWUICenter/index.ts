/**
 * XWUICenter Component Exports
 */

import { XWUICenter } from './XWUICenter';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUICenter } from './XWUICenter';
export type { XWUICenterConfig, XWUICenterData } from './XWUICenter';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUICenter, 'xwui-center', {
    flatAttrsToConfig: ['horizontal', 'vertical', 'inline', 'className'],
    flatAttrsToData: ['content', 'children']
});

