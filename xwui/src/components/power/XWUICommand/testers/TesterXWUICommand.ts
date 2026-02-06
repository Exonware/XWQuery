import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICommand/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUICommand } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICommand Component Tester',
            desc: 'Command palette component for quick actions.',
            componentName: 'XWUICommand'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicommand-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic command palette
            new XWUICommand(document.getElementById('command-1'), {
                items: [
                    { id: 'new-file', label: 'New File', action: () => console.log('New File') },
                    { id: 'open-file', label: 'Open File', action: () => console.log('Open File') },
                    { id: 'save', label: 'Save', action: () => console.log('Save') }
                ]
            }, {});
            
            tester.setStatus('✅ XWUICommand initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICommand test error:', error);
        }
