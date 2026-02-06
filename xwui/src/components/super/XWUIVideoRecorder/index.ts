/**
 * XWUIVideoRecorder Component Exports
 */

import { XWUIVideoRecorder } from './XWUIVideoRecorder';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIVideoRecorder } from './XWUIVideoRecorder';
export type { XWUIVideoRecorderConfig, XWUIVideoRecorderData } from './XWUIVideoRecorder';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIVideoRecorder, 'xwui-video-recorder', {
    flatAttrsToConfig: ['maxDuration', 'showPreview', 'className'],
    flatAttrsToData: ['recordedBlob', 'recordedUrl']
});

