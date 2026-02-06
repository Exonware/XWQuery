import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIField/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIField } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIField Component Tester',
            desc: 'Form field component wrapper.',
            componentName: 'XWUIField'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuifield-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic field
            new XWUIField(document.getElementById('field-1'), {
                label: 'Field Label',
                children: '<input type="text" placeholder="Enter value">'
            }, {});
            
            // Field with error
            new XWUIField(document.getElementById('field-2'), {
                label: 'Field with Error',
                error: 'This field is required',
                children: '<input type="text">'
            }, {});
            
            tester.setStatus('✅ XWUIField initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIField test error:', error);
        }
