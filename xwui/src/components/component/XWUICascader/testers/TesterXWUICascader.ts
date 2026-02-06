import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICascader/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICascader } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICascader Component Tester',
            desc: 'Cascading dropdown selection component.',
            componentName: 'XWUICascader'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuicascader-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const cascader = new XWUICascader(document.getElementById('cascader-1'), {
                options: [
                    {
                        value: 'zhejiang',
                        label: 'Zhejiang',
                        children: [
                            { value: 'hangzhou', label: 'Hangzhou' },
                            { value: 'ningbo', label: 'Ningbo' }
                        ]
                    },
                    {
                        value: 'jiangsu',
                        label: 'Jiangsu',
                        children: [
                            { value: 'nanjing', label: 'Nanjing' },
                            { value: 'suzhou', label: 'Suzhou' }
                        ]
                    }
                ],
                placeholder: 'Please select'
            }, {
                expandTrigger: 'click'
            });
            
            tester.setStatus('✅ XWUICascader initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICascader test error:', error);
        }
