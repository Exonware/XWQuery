/**
 * XWUIApprovalWorkflow Component
 * Visual approval workflow with status transitions
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUISteps, type XWUIStepItem } from '../XWUISteps/XWUISteps';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';
import { XWUIAvatarGroup } from '../XWUIAvatarGroup/XWUIAvatarGroup';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';
import { XWUITimeline } from '../XWUITimeline/XWUITimeline';

export interface Approver {
    id: string;
    name: string;
    avatar?: string;
}

export interface ApprovalStage {
    id: string;
    title: string;
    approvers: Approver[];
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
    timestamp?: Date;
}

// Component-level configuration
export interface XWUIApprovalWorkflowConfig {
    allowActions?: boolean;
    showHistory?: boolean;
    className?: string;
}

// Data type
export interface XWUIApprovalWorkflowData {
    stages: ApprovalStage[];
    currentStageId?: string;
}

export class XWUIApprovalWorkflow extends XWUIComponent<XWUIApprovalWorkflowData, XWUIApprovalWorkflowConfig> {
    private wrapperElement: HTMLElement | null = null;
    private stepsComponent: XWUISteps | null = null;
    private actionHandlers: Array<(stageId: string, action: 'approve' | 'reject', comment?: string) => void> = [];
    private textareaInstance: XWUITextarea | null = null;
    private approveBtn: XWUIButton | null = null;
    private rejectBtn: XWUIButton | null = null;
    private timelineInstance: XWUITimeline | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIApprovalWorkflowData,
        conf_comp: XWUIApprovalWorkflowConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIApprovalWorkflowConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIApprovalWorkflowConfig {
        return {
            allowActions: conf_comp?.allowActions ?? true,
            showHistory: conf_comp?.showHistory ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-approval-workflow';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Convert stages to steps
        const steps: XWUIStepItem[] = this.data.stages.map((stage, index) => {
            let status: 'wait' | 'process' | 'finish' | 'error' = 'wait';
            if (stage.status === 'approved') {
                status = 'finish';
            } else if (stage.status === 'rejected') {
                status = 'error';
            } else if (stage.id === this.data.currentStageId) {
                status = 'process';
            }

            return {
                title: stage.title,
                description: stage.approvers.map(a => a.name).join(', '),
                status: status,
                icon: stage.status === 'approved' ? '✓' : stage.status === 'rejected' ? '✗' : undefined
            };
        });

        const currentIndex = this.data.stages.findIndex(s => s.id === this.data.currentStageId);
        
        // Steps component
        const stepsContainer = document.createElement('div');
        this.stepsComponent = new XWUISteps(stepsContainer, {
            steps: steps
        }, {
            current: currentIndex >= 0 ? currentIndex : 0,
            direction: 'horizontal'
        });
        this.wrapperElement.appendChild(stepsContainer);

        // Current stage actions
        if (this.config.allowActions && this.data.currentStageId) {
            const currentStage = this.data.stages.find(s => s.id === this.data.currentStageId);
            if (currentStage && currentStage.status === 'pending') {
                this.renderActions(currentStage);
            }
        }

        // History
        if (this.config.showHistory) {
            this.renderHistory();
        }

        this.container.appendChild(this.wrapperElement);
    }

    private renderActions(stage: ApprovalStage): void {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'xwui-approval-workflow-actions';

        const commentContainer = document.createElement('div');
        commentContainer.className = 'xwui-approval-workflow-comment';
        
        const commentLabel = document.createElement('label');
        commentLabel.textContent = 'Comment (optional)';
        commentLabel.className = 'xwui-approval-workflow-label';
        commentContainer.appendChild(commentLabel);

        const textareaContainer = document.createElement('div');
        this.textareaInstance = new XWUITextarea(textareaContainer, {
            placeholder: 'Add a comment...',
            rows: 3
        });
        commentContainer.appendChild(textareaContainer);
        actionsContainer.appendChild(commentContainer);

        // Buttons
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'xwui-approval-workflow-buttons';

        const approveBtnContainer = document.createElement('div');
        this.approveBtn = new XWUIButton(approveBtnContainer, {
            label: 'Approve',
            variant: 'success'
        });
        this.approveBtn.onClick(() => {
            const comment = this.textareaInstance?.getValue();
            this.approve(stage.id, comment);
        });
        buttonsContainer.appendChild(approveBtnContainer);

        const rejectBtnContainer = document.createElement('div');
        this.rejectBtn = new XWUIButton(rejectBtnContainer, {
            label: 'Reject',
            variant: 'danger'
        });
        this.rejectBtn.onClick(() => {
            const comment = this.textareaInstance?.getValue();
            this.reject(stage.id, comment);
        });
        buttonsContainer.appendChild(rejectBtnContainer);

        actionsContainer.appendChild(buttonsContainer);
        this.wrapperElement!.appendChild(actionsContainer);
    }

    private renderHistory(): void {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'xwui-approval-workflow-history';

        const completedStages = this.data.stages.filter(s => s.status !== 'pending');
        if (completedStages.length > 0) {
            const timelineItems = completedStages.map(stage => ({
                title: `${stage.title} - ${stage.status === 'approved' ? 'Approved' : 'Rejected'}`,
                description: stage.comment || '',
                timestamp: stage.timestamp || new Date(),
                color: stage.status === 'approved' ? 'success' : 'error'
            }));

            const timelineContainer = document.createElement('div');
            this.timelineInstance = new XWUITimeline(timelineContainer, {
                items: timelineItems
            });
            historyContainer.appendChild(timelineContainer);
        }

        this.wrapperElement!.appendChild(historyContainer);
    }

    private approve(stageId: string, comment?: string): void {
        const stage = this.data.stages.find(s => s.id === stageId);
        if (stage) {
            stage.status = 'approved';
            stage.comment = comment;
            stage.timestamp = new Date();
            
            // Move to next stage
            const currentIndex = this.data.stages.indexOf(stage);
            if (currentIndex < this.data.stages.length - 1) {
                this.data.currentStageId = this.data.stages[currentIndex + 1].id;
            } else {
                this.data.currentStageId = undefined;
            }
            
            this.render();
            this.notifyAction(stageId, 'approve', comment);
        }
    }

    private reject(stageId: string, comment?: string): void {
        const stage = this.data.stages.find(s => s.id === stageId);
        if (stage) {
            stage.status = 'rejected';
            stage.comment = comment;
            stage.timestamp = new Date();
            this.data.currentStageId = undefined;
            this.render();
            this.notifyAction(stageId, 'reject', comment);
        }
    }

    private notifyAction(stageId: string, action: 'approve' | 'reject', comment?: string): void {
        this.actionHandlers.forEach(handler => handler(stageId, action, comment));
    }

    public onAction(handler: (stageId: string, action: 'approve' | 'reject', comment?: string) => void): void {
        this.actionHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.stepsComponent) {
            this.stepsComponent.destroy();
            this.stepsComponent = null;
        }
        if (this.textareaInstance) {
            this.textareaInstance.destroy();
            this.textareaInstance = null;
        }
        if (this.approveBtn) {
            this.approveBtn.destroy();
            this.approveBtn = null;
        }
        if (this.rejectBtn) {
            this.rejectBtn.destroy();
            this.rejectBtn = null;
        }
        if (this.timelineInstance) {
            this.timelineInstance.destroy();
            this.timelineInstance = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.actionHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIApprovalWorkflow as any).componentName = 'XWUIApprovalWorkflow';


