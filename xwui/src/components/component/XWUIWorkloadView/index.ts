/**
 * XWUIWorkloadView Component Exports
 */

import { XWUIWorkloadView } from './XWUIWorkloadView';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIWorkloadView } from './XWUIWorkloadView';
export type { XWUIWorkloadViewConfig, XWUIWorkloadViewData, PersonWorkload } from './XWUIWorkloadView';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIWorkloadView, 'xwui-workload-view', {
    flatAttrsToConfig: ['showChart', 'showCards', 'showList', 'className'],
    flatAttrsToData: ['teamFilter']
});

