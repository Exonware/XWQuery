import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIRating/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIRating } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIRating Component Tester',
            desc: 'Rating component for displaying and selecting ratings.',
            componentName: 'XWUIRating'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuirating-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic rating (read-only)
            new XWUIRating(document.getElementById('rating-1'), {
                value: 3
            }, { readOnly: true });
            
            // Interactive rating
            new XWUIRating(document.getElementById('rating-2'), {
                value: 0
            }, {
                max: 5,
                onChange: (value) => console.log('Rating changed:', value)
            });
            
            // Rating with custom max
            new XWUIRating(document.getElementById('rating-3'), {
                value: 4
            }, { max: 10, readOnly: true });
            
            tester.setStatus('✅ XWUIRating initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIRating test error:', error);
        }
