import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISeparator/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISeparator } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISeparator Component Tester',
            desc: 'Separator component for dividing content.',
            componentName: 'XWUISeparator'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiseparator-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Horizontal separator
            new XWUISeparator(document.getElementById('separator-1'), {}, {
                orientation: 'horizontal'
            });
            
            // Vertical separator
            new XWUISeparator(document.getElementById('separator-2'), {}, {
                orientation: 'vertical',
                style: 'height: 20px;'
            });
            
            tester.setStatus('✅ XWUISeparator initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISeparator test error:', error);
        }
