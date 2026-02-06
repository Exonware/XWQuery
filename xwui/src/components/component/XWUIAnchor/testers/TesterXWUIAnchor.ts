import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAnchor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAnchor } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAnchor Component Tester',
            desc: 'Table of contents / anchor navigation with scroll spy functionality.',
            componentName: 'XWUIAnchor'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuianchor-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const anchor = new XWUIAnchor(document.getElementById('anchor-container'), {
                items: [
                    { key: 'section1', href: '#section1', title: 'Section 1' },
                    { key: 'section2', href: '#section2', title: 'Section 2' },
                    { key: 'section3', href: '#section3', title: 'Section 3' }
                ]
            }, {
                affix: true,
                offset: 10
            });
            
            tester.setStatus('✅ XWUIAnchor initialized successfully. Scroll to see active highlighting', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAnchor test error:', error);
        }
