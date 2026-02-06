import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISignaturePad/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISignaturePad } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISignaturePad Component Tester',
            desc: 'Canvas-based signature pad for drawing signatures.',
            componentName: 'XWUISignaturePad'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuisignature-pad-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('signature-basic');
            const basicPad = new XWUISignaturePad(
                basicContainer,
                {}
            );
            
            basicPad.onChange((imageData) => {
                console.log('Signature changed, length:', imageData.length);
                tester.setStatus('✅ Signature updated', 'success');
            });
            
            // Custom
            const customContainer = document.getElementById('signature-custom');
            const customPad = new XWUISignaturePad(
                customContainer,
                {},
                {
                    penColor: '#0066cc',
                    penWidth: 3,
                    backgroundColor: '#f9f9f9'
                }
            );
            
            tester.setStatus('✅ XWUISignaturePad initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISignaturePad test error:', error);
        }
