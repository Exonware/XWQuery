import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITreeSelect/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITreeSelect } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITreeSelect Component Tester',
            desc: 'Tree select dropdown component.',
            componentName: 'XWUITreeSelect'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuitree-select-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const treeSelect = new XWUITreeSelect(document.getElementById('tree-select-1'), {
                treeData: [
                    {
                        id: '1',
                        label: 'Node 1',
                        children: [
                            { id: '1-1', label: 'Node 1-1' },
                            { id: '1-2', label: 'Node 1-2' }
                        ]
                    },
                    {
                        id: '2',
                        label: 'Node 2',
                        children: [
                            { id: '2-1', label: 'Node 2-1' },
                            { id: '2-2', label: 'Node 2-2' }
                        ]
                    }
                ],
                placeholder: 'Please select'
            }, {
                treeCheckable: false
            });
            
            tester.setStatus('✅ XWUITreeSelect initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITreeSelect test error:', error);
        }
