import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITimePicker/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITimePicker } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITimePicker Component Tester',
            desc: 'Time picker component for selecting time.',
            componentName: 'XWUITimePicker'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitime-picker-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic time picker
            new XWUITimePicker(document.getElementById('timepicker-1'), {}, {});
            
            // Time picker with initial value
            new XWUITimePicker(document.getElementById('timepicker-2'), {
                value: { hours: 14, minutes: 30 }
            }, {});
            
            tester.setStatus('✅ XWUITimePicker initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITimePicker test error:', error);
        }
