import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputPassword/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputPassword } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputPassword Component Tester',
            desc: 'Dedicated password input with visibility toggle.',
            componentName: 'XWUIInputPassword'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiinput-password-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const password1 = new XWUIInputPassword(document.getElementById('password-input-1'), {
                value: '',
                placeholder: 'Enter password'
            }, {
                showToggle: true
            });
            
            const password2 = new XWUIInputPassword(document.getElementById('password-input-2'), {
                value: 'secret123',
                placeholder: 'Password'
            }, {
                showToggle: true
            });
            
            tester.setStatus('✅ XWUIInputPassword initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputPassword test error:', error);
        }
