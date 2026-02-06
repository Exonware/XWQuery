import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIContainer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIContainer } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIContainer Component Tester',
            desc: 'A layout component that centers content horizontally and sets a maximum width.',
            componentName: 'XWUIContainer'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuicontainer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Default container
            const defaultContainer = new XWUIContainer(document.getElementById('container-default'), {
                content: 'This is container content that will be centered with a max-width.'
            });
            
            // Container with max width
            const maxWidthContainer = new XWUIContainer(document.getElementById('container-maxwidth'), {
                content: 'Container with custom max-width of 600px.'
            }, {
                maxWidth: '600px'
            });
            
            // Container with centering
            const centerContainer = new XWUIContainer(document.getElementById('container-center'), {
                content: 'Container with centering enabled and padding.'
            }, {
                center,
                padding: 'var(--spacing-md)'
            });
            
            tester.setStatus('✅ XWUIContainer initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIContainer test error:', error);
        }
