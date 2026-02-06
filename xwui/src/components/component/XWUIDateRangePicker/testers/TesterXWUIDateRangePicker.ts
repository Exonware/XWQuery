import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDateRangePicker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIDateRangePicker } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDateRangePicker Component Tester',
            desc: 'Date range selection component.',
            componentName: 'XWUIDateRangePicker'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuidate-range-picker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const dateRangePicker = new XWUIDateRangePicker(document.getElementById('date-range-picker-1'), {
                value: undefined
            }, {
                placeholder: 'Select date range'
            });
            
            tester.setStatus('✅ XWUIDateRangePicker initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDateRangePicker test error:', error);
        }
