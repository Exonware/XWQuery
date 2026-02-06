import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIScrollTo/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIScrollTo } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIScrollTo Component Tester',
            desc: 'Smooth scroll to target element.',
            componentName: 'XWUIScrollTo'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwui-scroll-to-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        const paragraphsHtml = Array.from({ length: 20 }, (_, i) => `<p>Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`).join('');
        const above = document.getElementById('scroll-content-above');
        const below = document.getElementById('scroll-content-below');
        if (above) above.innerHTML = paragraphsHtml;
        if (below) below.innerHTML = paragraphsHtml;

        try {
            const container = document.getElementById('scrollto-container');
            const scrollTo = new XWUIScrollTo(
                container,
                { targetId: 'scroll-target' },
                { behavior: 'smooth', block: 'start' }
            );
            
            document.getElementById('btn-scroll').addEventListener('click', () => {
                scrollTo.scrollToTarget();
                tester.setStatus('✅ Scrolled to target', 'success');
            });
            
            tester.setStatus('✅ XWUIScrollTo initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIScrollTo test error:', error);
        }
