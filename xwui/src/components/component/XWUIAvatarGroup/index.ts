/**
 * XWUIAvatarGroup Component Exports
 */

import { XWUIAvatarGroup } from './XWUIAvatarGroup';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIAvatarGroup } from './XWUIAvatarGroup';
export type { XWUIAvatarGroupConfig, XWUIAvatarGroupData, AvatarGroupItem } from './XWUIAvatarGroup';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAvatarGroup, 'xwui-avatar-group', {
    flatAttrsToConfig: ['max', 'size', 'spacing', 'total', 'className'],
    flatAttrsToData: ['avatars']
});

