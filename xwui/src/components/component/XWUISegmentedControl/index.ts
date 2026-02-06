/**
 * XWUISegmentedControl Component Exports
 */

import { XWUISegmentedControl } from './XWUISegmentedControl';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUISegmentedControl } from './XWUISegmentedControl';
export type { XWUISegmentedControlConfig, XWUISegmentedControlData, SegmentedOption } from './XWUISegmentedControl';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUISegmentedControl, 'xwui-segmented-control', {
    flatAttrsToConfig: ['options', 'size', 'block', 'disabled', 'className'],
    flatAttrsToData: ['value']
});

