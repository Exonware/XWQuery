import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIInputJson/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIInputJson } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIInputJson Component Tester',
            desc: 'JSON input with validation and formatting.',
            componentName: 'XWUIInputJson'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiinput-json-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const jsonInput = new XWUIInputJson(document.getElementById('json-input-1'), {
                value: { name: 'John', age: 30 }
            }, {
                formatOnBlur,
                validateOnBlur,
                minRows: 4
            });
            
            tester.setStatus('✅ XWUIInputJson initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIInputJson test error:', error);
        }
