import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMentions/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMentions } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMentions Component Tester',
            desc: 'Mentions input with @ mention support.',
            componentName: 'XWUIMentions'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuimentions-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const mentions = new XWUIMentions(document.getElementById('mentions-1'), {
                value: '',
                options: [
                    { value: 'alice', label: 'Alice' },
                    { value: 'bob', label: 'Bob' },
                    { value: 'charlie', label: 'Charlie' },
                    { value: 'diana', label: 'Diana' }
                ]
            }, {
                prefix: '@'
            });
            
            tester.setStatus('✅ XWUIMentions initialized successfully. Type @ to mention', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMentions test error:', error);
        }
