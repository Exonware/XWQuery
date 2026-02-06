/**
 * XWUIChannelList Component Exports
 */

import { XWUIChannelList } from './XWUIChannelList';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIChannelList } from './XWUIChannelList';
export type { XWUIChannelListConfig, XWUIChannelListData, Channel } from './XWUIChannelList';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIChannelList, 'xwui-channel-list', {
    flatAttrsToConfig: ['showSearch', 'showUnreadCount', 'showLastMessage', 'showOnlineStatus', 'groupBy', 'className'],
    flatAttrsToData: ['channels', 'selectedChannelId', 'searchQuery']
});

