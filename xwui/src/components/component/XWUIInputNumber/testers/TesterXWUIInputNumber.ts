import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputNumber/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputNumber } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputNumber Component Tester',
            desc: 'Dedicated number input with increment/decrement controls.',
            componentName: 'XWUIInputNumber'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiinput-number-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const number1 = new XWUIInputNumber(document.getElementById('number-input-1'), {
                value: 10
            }, {
                controls: true
            });
            
            const number2 = new XWUIInputNumber(document.getElementById('number-input-2'), {
                value: 5
            }, {
                min: 0,
                max: 10,
                controls: true
            });
            
            const number3 = new XWUIInputNumber(document.getElementById('number-input-3'), {
                value: 0
            }, {
                step: 5,
                controls: true
            });
            
            tester.setStatus('✅ XWUIInputNumber initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputNumber test error:', error);
        }
