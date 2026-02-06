import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        import { XWUIStyle } from '../../XWUIStyle/index.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWINumberInput/testers/
        // To styles: src/styles/ = go up 3 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUIStyle to automatically load all CSS based on data attributes
        // Read theme config from HTML data attributes
        const htmlEl = document.documentElement;
        const styleContainer = document.createElement('div');
        styleContainer.style.display = 'none'; // Hidden container for XWUIStyle
        document.body.appendChild(styleContainer);
        
        const xwuiStyle = new XWUIStyle(styleContainer, {}, {
            basePath: '../../../styles',
            brand: htmlEl.getAttribute('data-brand') || 'xwui',
            style: htmlEl.getAttribute('data-style') || 'modern',
            color: htmlEl.getAttribute('data-theme') || 'light',
            accent: htmlEl.getAttribute('data-accent') || 'blue',
            roundness: htmlEl.getAttribute('data-roundness') || 'rounded',
            font: htmlEl.getAttribute('data-font') || 'inter',
            autoLoad: true
        });
        
        import { XWUIInputNumber } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputNumber Component Tester',
            desc: 'Dedicated number input with increment/decrement controls.',
            componentName: 'XWUIInputNumber'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwinumber-input-content');
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
