/**
 * XWUIInputPassword Component Exports
 */

import { XWUIInputPassword } from './XWUIInputPassword';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIInputPassword } from './XWUIInputPassword';
export type { XWUIInputPasswordConfig, XWUIInputPasswordData } from './XWUIInputPassword';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIInputPassword, 'xwui-password-input', {
    flatAttrsToConfig: ['showToggle', 'strengthMeter'],
    flatAttrsToData: ['value', 'placeholder', 'label', 'helperText', 'errorText']
});

