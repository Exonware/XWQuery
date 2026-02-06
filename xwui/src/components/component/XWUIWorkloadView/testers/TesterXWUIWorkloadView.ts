import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIWorkloadView/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIWorkloadView } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIWorkloadView Component Tester',
            desc: 'Resource allocation view showing tasks per person and capacity.',
            componentName: 'XWUIWorkloadView'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiworkload-view-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const workload = new XWUIWorkloadView(
            document.getElementById('workload-view-1'),
            {
                workloads: [
                    { personId: '1', personName: 'John Doe', tasks: 5, capacity: 8, utilization: 62.5 },
                    { personId: '2', personName: 'Jane Smith', tasks: 7, capacity: 8, utilization: 87.5 },
                    { personId: '3', personName: 'Bob Johnson', tasks: 10, capacity: 8, utilization: 125 }
                ]
            },
            { showChart, showCards: true }
        );
        
        tester.data.componentInstance = workload;
        tester.data.componentConfig = workload.config;
        tester.data.componentData = workload.data;
        tester.setStatus('Component loaded successfully', 'success');
