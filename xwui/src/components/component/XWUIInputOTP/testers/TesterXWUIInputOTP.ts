import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputOTP/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputOTP } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputOTP Component Tester',
            desc: 'One-time password input component.',
            componentName: 'XWUIInputOTP'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiinput-otp-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic OTP input (6 digits)
            new XWUIInputOTP(document.getElementById('otp-1'), {}, {
                length: 6
            });
            
            // OTP input with 4 digits
            new XWUIInputOTP(document.getElementById('otp-2'), {}, {
                length: 4
            });
            
            tester.setStatus('✅ XWUIInputOTP initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputOTP test error:', error);
        }
