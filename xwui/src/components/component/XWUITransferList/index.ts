/**
 * XWUITransferList Component Exports
 */

import { XWUITransferList } from './XWUITransferList';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUITransferList } from './XWUITransferList';
export type { XWUITransferListConfig, XWUITransferListData, XWUITransferListItem } from './XWUITransferList';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUITransferList, 'xwui-transfer-list', {
    flatAttrsToConfig: ['showSearch', 'showSelectAll', 'titles', 'operations', 'listStyle', 'className'],
    flatAttrsToData: ['sourceItems', 'targetItems', 'selectedSourceKeys', 'selectedTargetKeys']
});

