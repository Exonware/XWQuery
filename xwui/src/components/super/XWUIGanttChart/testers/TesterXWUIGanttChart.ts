import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIGanttChart/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIGanttChart } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIGanttChart Component Tester',
            desc: 'Horizontal timeline/Gantt chart with task bars, dependencies, and critical path visualization.',
            componentName: 'XWUIGanttChart'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuigantt-chart-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const gantt = new XWUIGanttChart(
            document.getElementById('gantt-chart-1'),
            {
                tasks: [
                    {
                        id: '1',
                        label: 'Task 1',
                        startDate,
                        endDate,
                        progress: 50,
                        status: 'in-progress'
                    },
                    {
                        id: '2',
                        label: 'Task 2',
                        startDate,
                        endDate,
                        progress: 0,
                        status: 'not-started',
                        dependencies: ['1']
                    }
                ]
            },
            { zoomLevel: 'week', showSidebar, showDependencies: true }
        );
        
        tester.data.componentInstance = gantt;
        tester.data.componentConfig = gantt.config;
        tester.data.componentData = gantt.data;
        tester.setStatus('Component loaded successfully', 'success');
