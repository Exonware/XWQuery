import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInput/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInput } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInput Component Tester',
            desc: 'Text input component with various types, variants, and states.',
            componentName: 'XWUIInput'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiinput-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            new XWUIInput(document.getElementById('input-outlined'), {
                label: 'Outlined (default)',
                placeholder: 'Enter text...'
            }, { variant: 'outlined' });
            
            new XWUIInput(document.getElementById('input-filled'), {
                label: 'Filled',
                placeholder: 'Enter text...'
            }, { variant: 'filled' });
            
            new XWUIInput(document.getElementById('input-underlined'), {
                label: 'Underlined',
                placeholder: 'Enter text...'
            }, { variant: 'underlined' });
            
            // Sizes
            new XWUIInput(document.getElementById('input-small'), {
                label: 'Small',
                placeholder: 'Small input'
            }, { size: 'small' });
            
            new XWUIInput(document.getElementById('input-medium'), {
                label: 'Medium (default)',
                placeholder: 'Medium input'
            }, { size: 'medium' });
            
            new XWUIInput(document.getElementById('input-large'), {
                label: 'Large',
                placeholder: 'Large input'
            }, { size: 'large' });
            
            // Types
            new XWUIInput(document.getElementById('input-text'), {
                label: 'Text Input',
                placeholder: 'Enter text...'
            }, { type: 'text' });
            
            new XWUIInput(document.getElementById('input-password'), {
                label: 'Password',
                placeholder: 'Enter password...'
            }, { type: 'password' });
            
            new XWUIInput(document.getElementById('input-email'), {
                label: 'Email',
                placeholder: 'name@example.com'
            }, { type: 'email' });
            
            new XWUIInput(document.getElementById('input-number'), {
                label: 'Number',
                placeholder: '0'
            }, { type: 'number' });
            
            new XWUIInput(document.getElementById('input-search'), {
                label: 'Search',
                placeholder: 'Search...'
            }, { type: 'search', clearable: true });
            
            // States
            new XWUIInput(document.getElementById('input-disabled'), {
                label: 'Disabled',
                value: 'Disabled input'
            }, { disabled: true });
            
            new XWUIInput(document.getElementById('input-readonly'), {
                label: 'Read-only',
                value: 'Read-only value'
            }, { readonly: true });
            
            new XWUIInput(document.getElementById('input-error'), {
                label: 'Error State',
                value: 'Invalid input',
                errorText: 'This field has an error'
            }, { error, required: true });
            
            const clearableInput = new XWUIInput(document.getElementById('input-clearable'), {
                label: 'Clearable',
                value: 'Click X to clear',
                helperText: 'Type something and clear it'
            }, { clearable: true });
            
            clearableInput.onChange((value) => {
                tester.setStatus(`✅ Input value: "${value}"`, 'success');
            });
            
            // Prefix/Suffix
            const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';
            
            new XWUIInput(document.getElementById('input-prefix'), {
                label: 'With Prefix Icon',
                placeholder: 'Search...'
            }, { prefix: searchIcon });
            
            new XWUIInput(document.getElementById('input-suffix'), {
                label: 'Price Input',
                placeholder: '0.00'
            }, { type: 'number', suffix: 'USD' });
            
            tester.setStatus('✅ XWUIInput initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInput test error:', error);
        }
