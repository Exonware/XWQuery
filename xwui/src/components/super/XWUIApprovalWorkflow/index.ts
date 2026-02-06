/**
 * XWUIApprovalWorkflow Component Exports
 */

import { XWUIApprovalWorkflow } from './XWUIApprovalWorkflow';
import { createXWUIElement } from '../../component/XWUIComponent/XWUIComponent.element';

export { XWUIApprovalWorkflow } from './XWUIApprovalWorkflow';
export type { XWUIApprovalWorkflowConfig, XWUIApprovalWorkflowData, ApprovalStage, Approver } from './XWUIApprovalWorkflow';
export type { XWUISystemConfig, XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

createXWUIElement(XWUIApprovalWorkflow, 'xwui-approval-workflow', {
    flatAttrsToConfig: ['allowActions', 'showHistory', 'className'],
    flatAttrsToData: ['currentStageId']
});

