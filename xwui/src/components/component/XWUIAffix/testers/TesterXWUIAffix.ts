import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAffix/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAffix } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAffix Component Tester',
            desc: 'A component that makes its content sticky to a specific position on the screen when scrolled.',
            componentName: 'XWUIAffix'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiaffix-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const affix = new XWUIAffix(document.getElementById('affix-container'), {
                content: 'This content will stick to the top when scrolling'
            }, {
                offset: 10,
                position: 'top'
            });
            
            tester.setStatus('✅ XWUIAffix initialized successfully. Scroll to see it stick', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAffix test error:', error);
        }
