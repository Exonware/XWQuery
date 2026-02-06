import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISpoiler/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISpoiler } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISpoiler Component Tester',
            desc: 'Collapsible content with "show more" toggle.',
            componentName: 'XWUISpoiler'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuispoiler-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const longContent = 'This is a long piece of content that will be truncated. '.repeat(20);
            
            const spoiler = new XWUISpoiler(document.getElementById('spoiler-1'), {
                content: longContent
            }, {
                maxHeight: 100,
                showLabel: 'Show more',
                hideLabel: 'Show less'
            });
            
            tester.setStatus('✅ XWUISpoiler initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISpoiler test error:', error);
        }
