/**
 * XWUIInputColor Component Exports
 */

import { XWUIInputColor } from './XWUIInputColor';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputColor } from './XWUIInputColor';
export type { XWUIInputColorConfig, XWUIInputColorData } from './XWUIInputColor';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputColor, 'xwui-input-color', {
    flatAttrsToConfig: ['format', 'presets', 'view', 'showIcon', 'iconName', 'placeholder', 'readonly', 'clearable', 'className'],
    flatAttrsToData: ['value']
});

