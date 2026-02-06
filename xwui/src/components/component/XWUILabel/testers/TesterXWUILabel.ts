import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUILabel/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUILabel } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUILabel Component Tester',
            desc: 'Label component for form fields.',
            componentName: 'XWUILabel'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuilabel-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic label
            new XWUILabel(document.getElementById('label-1'), {
                text: 'Email Address',
                for: 'email-input'
            }, {});
            
            // Required label
            new XWUILabel(document.getElementById('label-2'), {
                text: 'Password',
                required: true
            }, {});
            
            // Label with description
            new XWUILabel(document.getElementById('label-3'), {
                text: 'Username',
                description: 'Choose a unique username'
            }, {});
            
            tester.setStatus('✅ XWUILabel initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUILabel test error:', error);
        }
