import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIStatistic/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIStatistic } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIStatistic Component Tester',
            desc: 'Display statistics/counts with optional formatting.',
            componentName: 'XWUIStatistic'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuistatistic-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const stat1 = new XWUIStatistic(document.getElementById('stat-1'), {
                value: 12345
            }, {
                title: 'Total Users'
            });
            
            const stat2 = new XWUIStatistic(document.getElementById('stat-2'), {
                value: 98.5
            }, {
                title: 'Success Rate',
                suffix: '%',
                precision: 1
            });
            
            const stat3 = new XWUIStatistic(document.getElementById('stat-3'), {
                value: 1234
            }, {
                title: 'Visits',
                formatter: (val) => val.toLocaleString()
            });
            
            tester.setStatus('✅ XWUIStatistic initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIStatistic test error:', error);
        }
