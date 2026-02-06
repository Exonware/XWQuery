import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDynamicFieldRenderer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIDynamicFieldRenderer } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDynamicFieldRenderer Component Tester',
            desc: 'Render custom field types dynamically in forms and views.',
            componentName: 'XWUIDynamicFieldRenderer'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuidynamic-field-renderer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const renderer = new XWUIDynamicFieldRenderer(
            document.getElementById('field-renderer-1'),
            {
                fields: [
                    { id: '1', name: 'name', label: 'Name', type: 'text', required: true },
                    { id: '2', name: 'email', label: 'Email', type: 'email', required: true },
                    { id: '3', name: 'age', label: 'Age', type: 'number', min: 18, max: 100 },
                    { id: '4', name: 'status', label: 'Status', type: 'select', options: [
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' }
                    ]}
                ]
            },
            { layout: 'vertical', showLabels: true }
        );
        
        tester.data.componentInstance = renderer;
        tester.data.componentConfig = renderer.config;
        tester.data.componentData = renderer.data;
        tester.setStatus('Component loaded successfully', 'success');
