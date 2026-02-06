/**
 * XWUICascader Component Exports
 */

import { XWUICascader } from './XWUICascader';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUICascader } from './XWUICascader';
export type { XWUICascaderConfig, XWUICascaderData, CascaderOption } from './XWUICascader';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUICascader, 'xwui-cascader', {
    flatAttrsToConfig: ['expandTrigger', 'changeOnSelect', 'className'],
    flatAttrsToData: ['value', 'options', 'placeholder']
});

