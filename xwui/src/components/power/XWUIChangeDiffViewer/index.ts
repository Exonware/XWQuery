/**
 * XWUIChangeDiffViewer Component Exports
 */

import { XWUIChangeDiffViewer } from './XWUIChangeDiffViewer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIChangeDiffViewer } from './XWUIChangeDiffViewer';
export type { XWUIChangeDiffViewerConfig, XWUIChangeDiffViewerData, ChangeRecord, FieldChange } from './XWUIChangeDiffViewer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIChangeDiffViewer, 'xwui-change-diff-viewer', {
    flatAttrsToConfig: ['showTimeline', 'showAvatar', 'className'],
    flatAttrsToData: ['changes']
});

