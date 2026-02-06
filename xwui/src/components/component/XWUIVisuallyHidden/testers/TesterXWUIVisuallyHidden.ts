import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIVisuallyHidden/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIVisuallyHidden } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIVisuallyHidden Component Tester',
            desc: 'Visually hides content while keeping it accessible to screen readers.',
            componentName: 'XWUIVisuallyHidden'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuivisually-hidden-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic visually hidden content
            const hidden1 = new XWUIVisuallyHidden(document.getElementById('visually-hidden-1'), {
                content: 'This text is hidden visually but accessible to screen readers.'
            }, {});
            
            // Different element types
            const hidden2 = new XWUIVisuallyHidden(document.getElementById('visually-hidden-2'), {
                content: 'This is a div element (default span).'
            }, { as: 'div' });
            
            const hidden3 = new XWUIVisuallyHidden(document.getElementById('visually-hidden-3'), {
                children: 'This content is set via children property.'
            }, {});
            
            // Toggle visibility
            const hidden4 = new XWUIVisuallyHidden(document.getElementById('visually-hidden-4'), {
                content: 'Click the button to toggle my visibility.'
            }, {});
            
            let isVisible = false;
            document.getElementById('toggle-btn').addEventListener('click', () => {
                isVisible = !isVisible;
                if (isVisible) {
                    hidden4.show();
                } else {
                    hidden4.hide();
                }
            });
            
            tester.setStatus('✅ XWUIVisuallyHidden initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIVisuallyHidden test error:', error);
        }
