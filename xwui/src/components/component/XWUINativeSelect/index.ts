/**
 * XWUINativeSelect Component Exports
 */

import { XWUINativeSelect } from './XWUINativeSelect';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUINativeSelect } from './XWUINativeSelect';
export type { XWUINativeSelectConfig, XWUINativeSelectData, XWUINativeSelectOption, XWUINativeSelectOptGroup } from './XWUINativeSelect';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUINativeSelect, 'xwui-native-select', {
    flatAttrsToConfig: ['size', 'variant', 'disabled', 'multiple', 'fullWidth', 'error', 'className', 'required', 'autofocus'],
    flatAttrsToData: ['options', 'value', 'placeholder', 'label', 'helperText', 'errorText', 'name', 'id']
});

