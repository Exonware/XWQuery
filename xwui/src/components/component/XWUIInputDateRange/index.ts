/**
 * XWUIInputDateRange Component Exports
 */

import { XWUIInputDateRange } from './XWUIInputDateRange';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIInputDateRange } from './XWUIInputDateRange';
export type { XWUIInputDateRangeConfig, XWUIInputDateRangeData } from './XWUIInputDateRange';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIInputDateRange, 'xwui-input-date-range', {
    flatAttrsToConfig: ['format', 'separator', 'view', 'showIcon', 'iconName', 'placeholder', 'readonly', 'clearable', 'className'],
    flatAttrsToData: ['value', 'minDate', 'maxDate']
});

