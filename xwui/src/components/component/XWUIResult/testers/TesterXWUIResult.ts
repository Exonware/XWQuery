import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIResult/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIResult } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIResult Component Tester',
            desc: 'Result component for displaying operation results.',
            componentName: 'XWUIResult'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiresult-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Success result
            new XWUIResult(document.getElementById('result-1'), {
                status: 'success',
                title: 'Success',
                description: 'Your operation completed successfully.'
            }, {});
            
            // Error result
            new XWUIResult(document.getElementById('result-2'), {
                status: 'error',
                title: 'Error',
                description: 'Something went wrong. Please try again.'
            }, {});
            
            // Info result
            new XWUIResult(document.getElementById('result-3'), {
                status: 'info',
                title: 'Information',
                description: 'This is an informational message.'
            }, {});
            
            tester.setStatus('✅ XWUIResult initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIResult test error:', error);
        }
