import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPivotTable/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIPivotTable } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPivotTable Component Tester',
            desc: 'Pivot table with drag-and-drop field configuration.',
            componentName: 'XWUIPivotTable'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Sample data
        const sampleData = [
            { region: 'North', product: 'Widget A', sales: 100, quantity: 10 },
            { region: 'North', product: 'Widget B', sales: 150, quantity: 15 },
            { region: 'South', product: 'Widget A', sales: 120, quantity: 12 },
            { region: 'South', product: 'Widget B', sales: 180, quantity: 18 },
            { region: 'East', product: 'Widget A', sales: 90, quantity: 9 },
            { region: 'East', product: 'Widget B', sales: 200, quantity: 20 },
            { region: 'West', product: 'Widget A', sales: 110, quantity: 11 },
            { region: 'West', product: 'Widget B', sales: 160, quantity: 16 }
        ];
        
        const fields = [
            { id: 'region', label: 'Region', type: 'string', dataIndex: 'region' },
            { id: 'product', label: 'Product', type: 'string', dataIndex: 'product' },
            { id: 'sales', label: 'Sales', type: 'number', dataIndex: 'sales' },
            { id: 'quantity', label: 'Quantity', type: 'number', dataIndex: 'quantity' }
        ];
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuipivot-table-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('pivot-basic');
            const basicPivot = new XWUIPivotTable(
                basicContainer,
                {
                    fields,
                    data: sampleData
                }
            );
            
            // Pre-configured
            const configuredContainer = document.getElementById('pivot-configured');
            const configuredPivot = new XWUIPivotTable(
                configuredContainer,
                {
                    fields,
                    data,
                    config: {
                        rows: ['region'],
                        columns: [],
                        values: [
                            { fieldId: 'sales', aggregation: 'sum' },
                            { fieldId: 'quantity', aggregation: 'sum' }
                        ],
                        filters: []
                    }
                }
            );
            
            tester.setStatus('✅ XWUIPivotTable initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIPivotTable test error:', error);
        }
