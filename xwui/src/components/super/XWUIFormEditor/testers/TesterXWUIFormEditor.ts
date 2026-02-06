
        import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIFormEditor } from '../index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIFormEditor/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIFormEditor Component Tester',
            desc: 'Visual form builder with drag-and-drop support. Create and edit forms using a visual interface.',
            componentName: 'XWUIFormEditor',
            componentInstance,
            componentConfig: {},
            componentData: {}
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiform-editor-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Create form editor instance
            const formEditor = new XWUIFormEditor(
                document.getElementById('form-editor-1'),
                {
                    formDefinition: {
                        config: {
                            uid: 'test-form-1',
                            version: '1.0.0',
                            name: 'Test Form'
                        },
                        schema: {},
                        data: {
                            sections: [
                                {
                                    id: 'section-1',
                                    title: 'Section 1',
                                    rows: []
                                }
                            ]
                        }
                    },
                    submittedData: []
                },
                {
                    mode: 'editor',
                    showComponentPalette: true
                }
            );
            
            // Store instance in tester for settings dialogs
            tester.data.componentInstance = formEditor;
            tester.data.componentConfig = formEditor.config;
            tester.data.componentData = formEditor.data;
            
            tester.setStatus('✅ XWUIFormEditor initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIFormEditor test error:', error);
        }
