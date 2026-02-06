import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIQRCode/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIQRCode } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIQRCode Component Tester',
            desc: 'QR code display component.',
            componentName: 'XWUIQRCode'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiqrcode-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const qrCode1 = new XWUIQRCode(document.getElementById('qrcode-1'), {
                value: 'https://example.com'
            }, {
                size: 200
            });
            
            const qrCode2 = new XWUIQRCode(document.getElementById('qrcode-2'), {
                value: 'Hello, World'
            }, {
                size: 150,
                color: '#1890ff',
                bgColor: '#ffffff'
            });
            
            tester.setStatus('✅ XWUIQRCode initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIQRCode test error:', error);
        }
