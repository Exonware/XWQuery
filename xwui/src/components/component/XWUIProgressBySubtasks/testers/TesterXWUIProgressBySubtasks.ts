import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIProgressBySubtasks/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIProgressBySubtasks } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIProgressBySubtasks Component Tester',
            desc: 'Automatically calculate parent task progress based on subtask completion.',
            componentName: 'XWUIProgressBySubtasks'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiprogress-by-subtasks-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const progressComp = new XWUIProgressBySubtasks(
            document.getElementById('progress-subtasks'),
            {
                parentLabel: 'Project Setup',
                subtasks: [
                    { id: '1', label: 'Design mockups', completed: true },
                    { id: '2', label: 'Setup database', completed: true },
                    { id: '3', label: 'Create API endpoints', completed: false },
                    { id: '4', label: 'Write tests', completed: false }
                ]
            },
            { showTree, showProgressBar, showStatistics: true }
        );
        
        tester.data.componentInstance = progressComp;
        tester.data.componentConfig = progressComp.config;
        tester.data.componentData = progressComp.data;
        tester.setStatus('Component loaded successfully', 'success');
