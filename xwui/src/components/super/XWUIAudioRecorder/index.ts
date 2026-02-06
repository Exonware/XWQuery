/**
 * XWUIAudioRecorder Component Exports
 */

import { XWUIAudioRecorder } from './XWUIAudioRecorder';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIAudioRecorder } from './XWUIAudioRecorder';
export type { XWUIAudioRecorderConfig, XWUIAudioRecorderData } from './XWUIAudioRecorder';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAudioRecorder, 'xwui-audio-recorder', {
    flatAttrsToConfig: ['maxDuration', 'showWaveform', 'className'],
    flatAttrsToData: ['recordedBlob', 'recordedUrl']
});

