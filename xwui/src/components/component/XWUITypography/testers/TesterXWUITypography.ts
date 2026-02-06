import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITypography/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITypography } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITypography Component Tester',
            desc: 'Typography component for text styling.',
            componentName: 'XWUITypography'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitypography-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Heading
            new XWUITypography(document.getElementById('typography-1'), {
                text: 'This is a heading',
                variant: 'h1'
            }, {});
            
            // Paragraph
            new XWUITypography(document.getElementById('typography-2'), {
                text: 'This is a paragraph with some text content that demonstrates the typography component.',
                variant: 'p'
            }, {});
            
            // Custom styled text
            new XWUITypography(document.getElementById('typography-3'), {
                text: 'Bold and italic text',
                variant: 'span'
            }, {
                bold,
                italic: true
            });
            
            tester.setStatus('✅ XWUITypography initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITypography test error:', error);
        }
