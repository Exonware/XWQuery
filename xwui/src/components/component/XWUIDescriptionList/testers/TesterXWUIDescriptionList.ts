import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDescriptionList/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIDescriptionList } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDescriptionList Component Tester',
            desc: 'Description list (term-value pairs) component.',
            componentName: 'XWUIDescriptionList'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuidescription-list-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const descList1 = new XWUIDescriptionList(document.getElementById('desc-list-1'), {
                items: [
                    { label: 'Name', value: 'John Doe' },
                    { label: 'Email', value: 'john@example.com' },
                    { label: 'Role', value: 'Developer' }
                ]
            }, {
                layout: 'horizontal'
            });
            
            const descList2 = new XWUIDescriptionList(document.getElementById('desc-list-2'), {
                items: [
                    { label: 'Product', value: 'Laptop' },
                    { label: 'Price', value: '$999' },
                    { label: 'Stock', value: 'In Stock' }
                ]
            }, {
                bordered: true,
                column: 2
            });
            
            tester.setStatus('✅ XWUIDescriptionList initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDescriptionList test error:', error);
        }
