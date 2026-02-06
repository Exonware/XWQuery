import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIApprovalWorkflow/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIApprovalWorkflow } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIApprovalWorkflow Component Tester',
            desc: 'Visual approval workflow with status transitions.',
            componentName: 'XWUIApprovalWorkflow'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiapproval-workflow-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const workflow = new XWUIApprovalWorkflow(
            document.getElementById('approval-workflow-1'),
            {
                stages: [
                    {
                        id: 's1',
                        title: 'Manager Review',
                        approvers: [{ id: '1', name: 'John Doe', avatar: '' }],
                        status: 'approved'
                    },
                    {
                        id: 's2',
                        title: 'Director Approval',
                        approvers: [{ id: '2', name: 'Jane Smith', avatar: '' }],
                        status: 'pending'
                    }
                ],
                currentStageId: 's2'
            },
            { allowActions: true, showHistory: true }
        );
        
        tester.data.componentInstance = workflow;
        tester.data.componentConfig = workflow.config;
        tester.data.componentData = workflow.data;
        tester.setStatus('Component loaded successfully', 'success');
