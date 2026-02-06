import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITree/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITree } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITree Component Tester',
            desc: 'Tree component for displaying hierarchical data.',
            componentName: 'XWUITree'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitree-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic tree
            new XWUITree(document.getElementById('tree-1'), {
                nodes: [
                    {
                        label: 'Folder 1',
                        children: [
                            { label: 'File 1.1' },
                            { label: 'File 1.2' }
                        ]
                    },
                    {
                        label: 'Folder 2',
                        children: [
                            { label: 'File 2.1' },
                            {
                                label: 'Subfolder 2.2',
                                children: [
                                    { label: 'File 2.2.1' }
                                ]
                            }
                        ]
                    },
                    { label: 'File 3' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUITree initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITree test error:', error);
        }
