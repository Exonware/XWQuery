/**
 * XWUIWorkflow Component Exports
 */

import { XWUIWorkflow } from './XWUIWorkflow';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

// Core component
export { XWUIWorkflow } from './XWUIWorkflow';
export type { XWUIWorkflowConfig, XWUIWorkflowData } from './XWUIWorkflow';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

// Auto-register Custom Element
createXWUIElement(XWUIWorkflow, 'xwui-workflow', {
    flatAttrsToConfig: ['showTabs', 'defaultTab', 'className'],
    flatAttrsToData: ['workflow']
});

