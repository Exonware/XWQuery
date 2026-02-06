/**
 * XWUIAudioPlayer Component Exports
 */

import { XWUIAudioPlayer } from './XWUIAudioPlayer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIAudioPlayer } from './XWUIAudioPlayer';
export type { XWUIAudioPlayerConfig, XWUIAudioPlayerData, XWUIAudioSource } from './XWUIAudioPlayer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIAudioPlayer, 'xwui-audio-player', {
    flatAttrsToConfig: ['autoplay', 'controls', 'loop', 'muted', 'preload', 'showCustomControls', 'className'],
    flatAttrsToData: ['sources', 'title', 'artist', 'cover']
});

