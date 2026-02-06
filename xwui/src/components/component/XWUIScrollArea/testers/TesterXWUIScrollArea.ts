import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIScrollArea/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIScrollArea } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIScrollArea Component Tester',
            desc: 'Scroll area component with custom scrollbars.',
            componentName: 'XWUIScrollArea'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiscroll-area-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic scroll area
            const content = document.createElement('div');
            content.style.padding = '1rem';
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('p');
                p.textContent = `Line ${i + 1} - This is scrollable content that extends beyond the visible area.`;
                content.appendChild(p);
            }
            
            new XWUIScrollArea(document.getElementById('scroll-area-1'), {
                content: content
            }, {});
            
            tester.setStatus('✅ XWUIScrollArea initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIScrollArea test error:', error);
        }
