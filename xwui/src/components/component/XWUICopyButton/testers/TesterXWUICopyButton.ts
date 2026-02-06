import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICopyButton/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICopyButton } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICopyButton Component Tester',
            desc: 'Copy button component for copying text to clipboard with feedback.',
            componentName: 'XWUICopyButton'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuicopy-button-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const textInput = document.getElementById('copy-text-input');
            
            // Basic copy button
            const copyButton1 = new XWUICopyButton(document.getElementById('copy-button-1'), {
                text: textInput.value
            }, {
                variant: 'primary'
            });
            
            // Update text when input changes
            textInput.addEventListener('input', () => {
                copyButton1.setText(textInput.value);
            });
            
            // Copy button with icon
            const copyButton2 = new XWUICopyButton(document.getElementById('copy-button-2'), {
                text: 'Copy this text'
            }, {
                variant: 'secondary',
                showIcon: true
            });
            
            // Copy button with custom timeout
            const copyButton3 = new XWUICopyButton(document.getElementById('copy-button-3'), {
                text: 'Custom timeout (5s)',
                copiedText: 'Copied (5s)'
            }, {
                variant: 'outline',
                copiedTimeout: 5000
            });
            
            // Copy code button
            const codeSample = document.getElementById('code-sample')?.textContent || '';
            new XWUICopyButton(document.getElementById('copy-button-code'), {
                text: codeSample
            }, {
                variant: 'secondary',
                showIcon: true
            });
            
            tester.setStatus('✅ XWUICopyButton initialized successfully - Try clicking the buttons to copy text', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICopyButton test error:', error);
        }
