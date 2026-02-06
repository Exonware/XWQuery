import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAlert/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAlert } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAlert Component Tester',
            desc: 'Alert message box component with variants.',
            componentName: 'XWUIAlert'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuialert-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            new XWUIAlert(document.getElementById('alert-info'), {
                message: 'This is an informational alert message.'
            }, { variant: 'info' });
            
            new XWUIAlert(document.getElementById('alert-success'), {
                message: 'Operation completed successfully'
            }, { variant: 'success' });
            
            new XWUIAlert(document.getElementById('alert-warning'), {
                message: 'Please review this action before proceeding.'
            }, { variant: 'warning' });
            
            new XWUIAlert(document.getElementById('alert-error'), {
                message: 'An error occurred. Please try again.'
            }, { variant: 'error' });
            
            // Closable
            new XWUIAlert(document.getElementById('alert-closable-1'), {
                message: 'This alert can be closed.'
            }, { variant: 'info', closable: true });
            
            new XWUIAlert(document.getElementById('alert-closable-2'), {
                message: 'Another closable alert with warning variant.'
            }, { variant: 'warning', closable: true });
            
            // With Title
            new XWUIAlert(document.getElementById('alert-title-1'), {
                title: 'Success',
                message: 'Your changes have been saved successfully.'
            }, { variant: 'success' });
            
            new XWUIAlert(document.getElementById('alert-title-2'), {
                title: 'Error',
                message: 'Failed to save changes. Please try again.'
            }, { variant: 'error', closable: true });
            
            // Filled
            new XWUIAlert(document.getElementById('alert-filled-1'), {
                message: 'This is a filled alert.'
            }, { variant: 'info', filled: true });
            
            new XWUIAlert(document.getElementById('alert-filled-2'), {
                message: 'Another filled alert with success variant.'
            }, { variant: 'success', filled: true });
            
            tester.setStatus('✅ XWUIAlert initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAlert test error:', error);
        }
