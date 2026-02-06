/**
 * XWUIStatistic Component Exports
 */

import { XWUIStatistic } from './XWUIStatistic';
import { createXWUIElement } from '../XWUIComponent/XWUIComponent.element';

export { XWUIStatistic } from './XWUIStatistic';
export type { XWUIStatisticConfig, XWUIStatisticData } from './XWUIStatistic';
export type { XWUISystemConfig, XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

createXWUIElement(XWUIStatistic, 'xwui-statistic', {
    flatAttrsToConfig: ['title', 'prefix', 'suffix', 'precision', 'className'],
    flatAttrsToData: ['value']
});

