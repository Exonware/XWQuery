import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISubtaskExpander/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISubtaskExpander } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISubtaskExpander Component Tester',
            desc: 'Inline expandable subtasks in table/grid views.',
            componentName: 'XWUISubtaskExpander'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuisubtask-expander-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const expander = new XWUISubtaskExpander(
            document.getElementById('subtask-expander-1'),
            {
                subtasks: [
                    { id: '1', label: 'Subtask 1', completed: true },
                    { id: '2', label: 'Subtask 2', completed: false },
                    { id: '3', label: 'Subtask 3', completed: false }
                ],
                expanded: false
            },
            { showCheckbox, showProgress: true }
        );
        
        tester.data.componentInstance = expander;
        tester.data.componentConfig = expander.config;
        tester.data.componentData = expander.data;
        tester.setStatus('Component loaded successfully', 'success');
