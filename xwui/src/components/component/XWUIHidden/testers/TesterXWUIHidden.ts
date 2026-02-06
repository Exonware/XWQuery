import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIHidden/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIHidden } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIHidden Component Tester',
            desc: 'Show/hide content based on breakpoints (similar to Material UI Hidden).',
            componentName: 'XWUIHidden'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuihidden-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Hide below md (768px)
            new XWUIHidden(document.getElementById('hidden-1'), {
                content: '<div style="padding: var(--spacing-sm); background: var(--bg-secondary); border-radius: var(--radius-sm);">Hidden below md (768px)</div>'
            }, {
                below: 'md',
                implementation: 'js'
            });
            
            // Hide above lg (1024px)
            new XWUIHidden(document.getElementById('hidden-2'), {
                content: '<div style="padding: var(--spacing-sm); background: var(--bg-secondary); border-radius: var(--radius-sm);">Hidden above lg (1024px)</div>'
            }, {
                above: 'lg',
                implementation: 'js'
            });
            
            // Show only on md
            new XWUIHidden(document.getElementById('hidden-3'), {
                content: '<div style="padding: var(--spacing-sm); background: var(--bg-secondary); border-radius: var(--radius-sm);">Visible only on md breakpoint (768px - 1023px)</div>'
            }, {
                only: 'md',
                implementation: 'js'
            });
            
            // CSS implementation
            new XWUIHidden(document.getElementById('hidden-4'), {
                content: '<div style="padding: var(--spacing-sm); background: var(--bg-secondary); border-radius: var(--radius-sm);">CSS-based hiding (below sm: 640px)</div>'
            }, {
                below: 'sm',
                implementation: 'css'
            });
            
            tester.setStatus('✅ XWUIHidden initialized - Resize window to see responsive behavior', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIHidden test error:', error);
        }
