import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITable/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITable } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITable Component Tester',
            desc: 'Table component for displaying tabular data.',
            componentName: 'XWUITable'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitable-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic table
            new XWUITable(document.getElementById('table-1'), {
                columns: [
                    { key: 'name', label: 'Name' },
                    { key: 'age', label: 'Age' },
                    { key: 'email', label: 'Email' }
                ],
                data: [
                    { name: 'John Doe', age: 30, email: 'john@example.com' },
                    { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
                    { name: 'Bob Johnson', age: 35, email: 'bob@example.com' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUITable initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITable test error:', error);
        }
