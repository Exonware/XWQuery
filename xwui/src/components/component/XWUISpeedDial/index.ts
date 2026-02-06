/**
 * XWUISpeedDial Component Exports
 */

import { XWUISpeedDial } from './XWUISpeedDial';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUISpeedDial } from './XWUISpeedDial';
export type { XWUISpeedDialConfig, XWUISpeedDialData, SpeedDialAction } from './XWUISpeedDial';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUISpeedDial, 'xwui-speed-dial', {
    flatAttrsToConfig: ['direction', 'open', 'icon', 'position', 'className'],
    flatAttrsToData: ['actions']
});

