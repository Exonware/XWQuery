import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIRichTextEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIRichTextEditor } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIRichTextEditor Component Tester',
            desc: 'Rich text/WYSIWYG editor with toolbar.',
            componentName: 'XWUIRichTextEditor'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuirich-text-editor-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const richText = new XWUIRichTextEditor(document.getElementById('rich-text-1'), {
                value: '<p>Start typing...</p>'
            }, {
                toolbar,
                formats: ['bold', 'italic', 'underline']
            });
            
            tester.setStatus('✅ XWUIRichTextEditor initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIRichTextEditor test error:', error);
        }
