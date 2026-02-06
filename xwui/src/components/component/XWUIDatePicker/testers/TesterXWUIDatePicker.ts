import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDatePicker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIDatePicker } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDatePicker Component Tester',
            desc: 'Date picker component for selecting dates.',
            componentName: 'XWUIDatePicker'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuidate-picker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic date picker
            new XWUIDatePicker(document.getElementById('datepicker-1'), {}, {});
            
            // Date picker with initial value
            const today = new Date();
            new XWUIDatePicker(document.getElementById('datepicker-2'), {
                value: today
            }, {});
            
            tester.setStatus('✅ XWUIDatePicker initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDatePicker test error:', error);
        }
