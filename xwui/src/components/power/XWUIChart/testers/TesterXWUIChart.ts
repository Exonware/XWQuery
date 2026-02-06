import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIChart/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIChart } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIChart Component Tester',
            desc: 'Chart component for data visualization.',
            componentName: 'XWUIChart'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuichart-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic line chart
            new XWUIChart(document.getElementById('chart-1'), {
                series: [{
                    name: 'Sales',
                    data: [
                        { x: 'Jan', y: 10 },
                        { x: 'Feb', y: 20 },
                        { x: 'Mar', y: 15 },
                        { x: 'Apr', y: 25 },
                        { x: 'May', y: 30 }
                    ]
                }]
            }, {
                type: 'line'
            });
            
            // Bar chart
            new XWUIChart(document.getElementById('chart-2'), {
                series: [{
                    name: 'Values',
                    data: [
                        { x: 'A', y: 12 },
                        { x: 'B', y: 19 },
                        { x: 'C', y: 3 },
                        { x: 'D', y: 5 },
                        { x: 'E', y: 2 }
                    ]
                }]
            }, {
                type: 'bar'
            });
            
            tester.setStatus('✅ XWUIChart initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIChart test error:', error);
        }
