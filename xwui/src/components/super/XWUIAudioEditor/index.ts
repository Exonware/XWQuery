/**
 * XWUIAudioEditor Component Exports
 */

import { XWUIAudioEditor } from './XWUIAudioEditor';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIAudioEditor } from './XWUIAudioEditor';
export type { XWUIAudioEditorConfig, XWUIAudioEditorData } from './XWUIAudioEditor';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAudioEditor, 'xwui-audio-editor', {
    flatAttrsToConfig: ['allowTrim', 'allowFade', 'className'],
    flatAttrsToData: ['audioSrc']
});

