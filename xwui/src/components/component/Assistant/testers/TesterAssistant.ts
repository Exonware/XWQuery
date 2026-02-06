import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/Assistant/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { Assistant } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'Assistant Component Tester',
            desc: 'This page tests the Assistant component in isolation. Expected: Assistant container should be visible with title and content area.',
            componentName: 'Assistant'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-assistant-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const container = document.querySelector('.assistant-container');
        
        try {
            if (!container) {
                throw new Error('Container not found');
            }
            
            const assistant = new Assistant(container);
            
            // Test if assistant was created
            if (assistant) {
                tester.setStatus('✅ Assistant component initialized successfully', 'success');
                
                // Check for assistant elements
                setTimeout(() => {
                    const assistantTitle = container.querySelector('.assistant-title');
                    const assistantContent = container.querySelector('.assistant-content');
                    let statusMsg = '✅ Assistant component initialized successfully';
                    if (assistantTitle) {
                        statusMsg += ' Assistant title found.';
                    }
                    if (assistantContent) {
                        statusMsg += ' Assistant content area found.';
                    }
                    tester.setStatus(statusMsg, 'success');
                }, 100);
            } else {
                throw new Error('Assistant instance is null');
            }
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Assistant test error:', error);
        }
