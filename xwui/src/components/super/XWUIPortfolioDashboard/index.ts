/**
 * XWUIPortfolioDashboard Component Exports
 */

import { XWUIPortfolioDashboard } from './XWUIPortfolioDashboard';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIPortfolioDashboard } from './XWUIPortfolioDashboard';
export type { XWUIPortfolioDashboardConfig, XWUIPortfolioDashboardData, Project } from './XWUIPortfolioDashboard';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIPortfolioDashboard, 'xwui-portfolio-dashboard', {
    flatAttrsToConfig: ['showKPIs', 'showCharts', 'showProjects', 'className'],
    flatAttrsToData: ['statusFilter']
});

