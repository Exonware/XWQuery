import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/Console/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { Console } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'Console Component Tester',
            desc: 'This page tests the Console component in isolation. Expected: Console should display messages with different types (info, success, warning, error).',
            componentName: 'Console'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-console-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const container = document.querySelector('.console-container');
        let consoleInstance = null;
        
        try {
            if (!container) {
                throw new Error('Container not found');
            }
            
            consoleInstance = new Console(container);
            
            // Test if console was created
            if (consoleInstance) {
                tester.setStatus('✅ Console component initialized successfully', 'success');
                
                // Add a test message
                setTimeout(() => {
                    consoleInstance.addMessage('Console tester initialized', 'info');
                }, 100);
            } else {
                throw new Error('Console instance is null');
            }
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Console test error:', error);
        }
        
        // Expose test functions
        window.testInfo = () => {
            if (consoleInstance) {
                consoleInstance.addMessage('This is an info message', 'info');
            }
        };
        
        window.testSuccess = () => {
            if (consoleInstance) {
                consoleInstance.addMessage('This is a success message', 'success');
            }
        };
        
        window.testWarning = () => {
            if (consoleInstance) {
                consoleInstance.addMessage('This is a warning message', 'warn');
            }
        };
        
        window.testError = () => {
            if (consoleInstance) {
                consoleInstance.addMessage('This is an error message', 'error');
            }
        };
        
        window.testClear = () => {
            if (consoleInstance) {
                consoleInstance.clear();
            }
        };
