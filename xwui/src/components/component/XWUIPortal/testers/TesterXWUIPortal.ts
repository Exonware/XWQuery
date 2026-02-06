import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPortal/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIPortal } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPortal Component Tester',
            desc: 'Portal component for rendering content outside normal DOM hierarchy.',
            componentName: 'XWUIPortal'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiportal-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Portal to target container (body by default, but we'll use the target div)
            const portal1 = new XWUIPortal(document.getElementById('portal-1'), {
                content: '<div class="portal-content">This content is portaled to the target container at bottom-right</div>'
            }, {
                container: document.getElementById('portal-target'),
                className: 'portal-content-wrapper'
            });
            
            // Disable portal (render in place)
            const portal2 = new XWUIPortal(document.getElementById('portal-2'), {
                content: '<div class="portal-content">This content is rendered in place (portal disabled).</div>'
            }, {
                disablePortal: true
            });
            
            // Custom container selector
            const portal3 = new XWUIPortal(document.getElementById('portal-3'), {
                content: '<div class="portal-content">This content is portaled to the custom container (top-right, purple border).</div>'
            }, {
                container: '#custom-portal-container'
            });
            
            tester.setStatus('✅ XWUIPortal initialized successfully. Check the target containers for portaled content.', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIPortal test error:', error);
        }
