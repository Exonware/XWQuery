/**
 * XWUIMultiSelect Component Exports
 */

import { XWUIMultiSelect } from './XWUIMultiSelect';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIMultiSelect } from './XWUIMultiSelect';
export type { XWUIMultiSelectConfig, XWUIMultiSelectData } from './XWUIMultiSelect';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIMultiSelect, 'xwui-multi-select', {
    flatAttrsToConfig: ['maxTagCount', 'size', 'variant', 'disabled', 'searchable', 'clearable', 'fullWidth', 'className'],
    flatAttrsToData: ['options', 'value', 'placeholder']
});

