import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMediaQuery/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMediaQuery } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMediaQuery Component Tester',
            desc: 'Component that shows/hides content based on media query matches.',
            componentName: 'XWUIMediaQuery'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuimedia-query-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Show only on mobile (max-width: 768px)
            new XWUIMediaQuery(document.getElementById('media-query-1'), {
                content: '<div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-md);"><strong>Mobile Only:</strong> This content is only visible on screens smaller than 768px</div>'
            }, {
                query: '(max-width: 768px)'
            });
            
            // Show only on desktop (min-width: 1024px)
            new XWUIMediaQuery(document.getElementById('media-query-2'), {
                content: '<div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-md);"><strong>Desktop Only:</strong> This content is only visible on screens larger than 1024px</div>'
            }, {
                query: '(min-width: 1024px)'
            });
            
            // Show only in portrait mode
            new XWUIMediaQuery(document.getElementById('media-query-3'), {
                content: '<div style="padding: var(--spacing-md); background: var(--bg-secondary); border-radius: var(--radius-md);"><strong>Portrait Mode:</strong> This content is only visible in portrait orientation</div>'
            }, {
                query: '(orientation)'
            });
            
            tester.setStatus('✅ XWUIMediaQuery initialized - Resize window to see content show/hide', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMediaQuery test error:', error);
        }
