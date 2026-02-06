import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICenter/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICenter } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICenter Component Tester',
            desc: 'A layout component that centers its children horizontally and vertically.',
            componentName: 'XWUICenter'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuicenter-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Full centering
            const centerFull = new XWUICenter(document.getElementById('center-full'), {
                content: 'Centered both horizontally and vertically'
            }, {
                horizontal,
                vertical: true
            });
            
            // Horizontal only
            const centerHorizontal = new XWUICenter(document.getElementById('center-horizontal'), {
                content: 'Centered horizontally only'
            }, {
                horizontal,
                vertical: false
            });
            
            // Vertical only
            const centerVertical = new XWUICenter(document.getElementById('center-vertical'), {
                content: 'Centered vertically only'
            }, {
                horizontal,
                vertical: true
            });
            
            tester.setStatus('✅ XWUICenter initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICenter test error:', error);
        }
