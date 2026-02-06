/**
 * XWUIDescriptionList Component Exports
 */

import { XWUIDescriptionList } from './XWUIDescriptionList';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIDescriptionList } from './XWUIDescriptionList';
export type { XWUIDescriptionListConfig, XWUIDescriptionListData, DescriptionListItem } from './XWUIDescriptionList';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIDescriptionList, 'xwui-description-list', {
    flatAttrsToConfig: ['bordered', 'column', 'size', 'layout', 'className'],
    flatAttrsToData: ['items']
});

