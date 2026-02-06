/**
 * XWUIVideoPlayer Component Exports
 */

import { XWUIVideoPlayer } from './XWUIVideoPlayer';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIVideoPlayer } from './XWUIVideoPlayer';
export type { XWUIVideoPlayerConfig, XWUIVideoPlayerData, XWUIVideoSource } from './XWUIVideoPlayer';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIVideoPlayer, 'xwui-video-player', {
    flatAttrsToConfig: ['autoplay', 'controls', 'loop', 'muted', 'playsInline', 'preload', 'aspectRatio', 'showCustomControls', 'className'],
    flatAttrsToData: ['sources', 'poster', 'title']
});

