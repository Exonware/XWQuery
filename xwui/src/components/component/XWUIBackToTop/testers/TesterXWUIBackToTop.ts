import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBackToTop/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBackToTop } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBackToTop Component Tester',
            desc: 'A floating button that appears when the user scrolls down and, when clicked, scrolls the page back to the top.',
            componentName: 'XWUIBackToTop'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiback-to-top-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Create back to top button
            const backToTop = new XWUIBackToTop(document.getElementById('back-to-top-container'), {
                icon: 'arrow-up'
            }, {
                threshold: 100,
                position: 'bottom-right',
                smooth: true
            });
            
            tester.setStatus('✅ XWUIBackToTop initialized successfully. Scroll down to see it in action', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBackToTop test error:', error);
        }
