import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIResourceAllocationChart/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIResourceAllocationChart } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIResourceAllocationChart Component Tester',
            desc: 'Visual resource allocation and capacity planning chart.',
            componentName: 'XWUIResourceAllocationChart'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiresource-allocation-chart-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const chart = new XWUIResourceAllocationChart(
            document.getElementById('resource-chart-1'),
            {
                allocations: [
                    { resourceId: '1', resourceName: 'Developer 1', allocated: 6, capacity: 8, type: 'developer' },
                    { resourceId: '2', resourceName: 'Developer 2', allocated: 7, capacity: 8, type: 'developer' },
                    { resourceId: '3', resourceName: 'Designer 1', allocated: 4, capacity: 8, type: 'designer' }
                ]
            },
            { chartType: 'stacked-bar', showLegend: true }
        );
        
        tester.data.componentInstance = chart;
        tester.data.componentConfig = chart.config;
        tester.data.componentData = chart.data;
        tester.setStatus('Component loaded successfully', 'success');
