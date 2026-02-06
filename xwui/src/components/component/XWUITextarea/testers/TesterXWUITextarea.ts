import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITextarea/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITextarea } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITextarea Component Tester',
            desc: 'Multi-line text input with auto-resize option.',
            componentName: 'XWUITextarea'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitextarea-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            new XWUITextarea(document.getElementById('textarea-outlined'), {
                label: 'Outlined',
                placeholder: 'Enter text...'
            }, { variant: 'outlined' });
            
            new XWUITextarea(document.getElementById('textarea-filled'), {
                label: 'Filled',
                placeholder: 'Enter text...'
            }, { variant: 'filled' });
            
            // Sizes
            new XWUITextarea(document.getElementById('textarea-small'), {
                label: 'Small',
                placeholder: 'Small textarea'
            }, { size: 'small' });
            
            new XWUITextarea(document.getElementById('textarea-medium'), {
                label: 'Medium (default)',
                placeholder: 'Medium textarea'
            }, { size: 'medium' });
            
            new XWUITextarea(document.getElementById('textarea-large'), {
                label: 'Large',
                placeholder: 'Large textarea'
            }, { size: 'large' });
            
            // Auto resize
            const autoResize = new XWUITextarea(document.getElementById('textarea-auto-resize'), {
                label: 'Auto Resize',
                placeholder: 'Type to see auto-resize...',
                value: 'Initial content'
            }, { autoResize, minRows: 3, maxRows: 8 });
            
            autoResize.onChange((value) => {
                tester.setStatus(`✅ Textarea value changed (${value.length} chars)`, 'success');
            });
            
            // Character count
            new XWUITextarea(document.getElementById('textarea-count'), {
                label: 'With Character Count',
                placeholder: 'Type here...',
                helperText: 'Maximum 100 characters'
            }, { maxLength: 100 });
            
            // States
            new XWUITextarea(document.getElementById('textarea-disabled'), {
                label: 'Disabled',
                value: 'This textarea is disabled'
            }, { disabled: true });
            
            new XWUITextarea(document.getElementById('textarea-readonly'), {
                label: 'Read-only',
                value: 'This textarea is read-only'
            }, { readonly: true });
            
            new XWUITextarea(document.getElementById('textarea-error'), {
                label: 'Error State',
                value: 'Invalid input',
                errorText: 'This field has an error'
            }, { error: true });
            
            tester.setStatus('✅ XWUITextarea initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITextarea test error:', error);
        }
