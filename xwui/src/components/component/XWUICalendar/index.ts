/**
 * XWUICalendar Component Exports
 */

import { XWUICalendar } from './XWUICalendar';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

// Core component
export { XWUICalendar } from './XWUICalendar';
export type { XWUICalendarConfig, XWUICalendarData, XWUICalendarEvent } from './XWUICalendar';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUICalendar, 'xwui-calendar', {
    flatAttrsToConfig: ['view', 'firstDayOfWeek', 'showToday', 'showNavigation', 'className'],
    flatAttrsToData: ['selectedDate', 'events', 'minDate', 'maxDate']
});

