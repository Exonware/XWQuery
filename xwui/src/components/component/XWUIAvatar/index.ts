/**
 * XWUIAvatar Component Exports
 */

import { XWUIAvatar } from './XWUIAvatar';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIAvatar } from './XWUIAvatar';
export type { XWUIAvatarConfig, XWUIAvatarData } from './XWUIAvatar';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIAvatar, 'xwui-avatar', {
    flatAttrsToConfig: ['size', 'shape', 'status', 'bordered', 'className'],
    flatAttrsToData: ['src', 'alt', 'name', 'fallback']
});

