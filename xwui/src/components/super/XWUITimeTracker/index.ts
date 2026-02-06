/**
 * XWUITimeTracker Component Exports
 */

import { XWUITimeTracker } from './XWUITimeTracker';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUITimeTracker } from './XWUITimeTracker';
export type { XWUITimeTrackerConfig, XWUITimeTrackerData, TimeEntry } from './XWUITimeTracker';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUITimeTracker, 'xwui-time-tracker', {
    flatAttrsToConfig: ['allowManualEntry', 'showProgress', 'className'],
    flatAttrsToData: ['taskName', 'isRunning', 'elapsedSeconds']
});

