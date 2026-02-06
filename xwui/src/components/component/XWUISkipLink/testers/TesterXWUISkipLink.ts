import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISkipLink/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISkipLink } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISkipLink Component Tester',
            desc: 'Accessibility skip navigation link. Press Tab to focus and see it appear.',
            componentName: 'XWUISkipLink'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiskip-link-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const container = document.getElementById('skiplink-basic');
            const skipLink = new XWUISkipLink(
                container,
                {},
                {
                    targetId: 'main-content',
                    label: 'Skip to main content'
                }
            );
            
            tester.setStatus('✅ XWUISkipLink initialized. Press Tab to focus it.', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISkipLink test error:', error);
        }
