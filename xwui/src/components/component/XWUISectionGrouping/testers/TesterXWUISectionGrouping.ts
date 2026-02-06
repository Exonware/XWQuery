import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISectionGrouping/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISectionGrouping } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISectionGrouping Component Tester',
            desc: 'Group tasks/projects into collapsible sections.',
            componentName: 'XWUISectionGrouping'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuisection-grouping-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const grouping = new XWUISectionGrouping(
            document.getElementById('section-grouping-1'),
            {
                sections: [
                    {
                        id: 's1',
                        title: 'To Do',
                        items: [
                            { id: '1', label: 'Task 1' },
                            { id: '2', label: 'Task 2' }
                        ]
                    },
                    {
                        id: 's2',
                        title: 'In Progress',
                        items: [
                            { id: '3', label: 'Task 3' }
                        ]
                    },
                    {
                        id: 's3',
                        title: 'Done',
                        items: [
                            { id: '4', label: 'Task 4' }
                        ]
                    }
                ]
            },
            { collapsible, showItemCount: true }
        );
        
        tester.data.componentInstance = grouping;
        tester.data.componentConfig = grouping.config;
        tester.data.componentData = grouping.data;
        tester.setStatus('Component loaded successfully', 'success');
