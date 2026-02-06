import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISpreadsheet/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUISpreadsheet } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISpreadsheet Component Tester',
            desc: 'Excel-like spreadsheet with formulas, formatting, and editing.',
            componentName: 'XWUISpreadsheet'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuispreadsheet-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('spreadsheet-basic');
            const basicSpreadsheet = new XWUISpreadsheet(
                basicContainer,
                {},
                {
                    rows: 50,
                    columns: 20,
                    showToolbar,
                    showFormulaBar,
                    showRowNumbers,
                    showColumnHeaders: true
                }
            );
            
            basicSpreadsheet.onCellChange((cell, value) => {
                console.log(`Cell ${cell} changed to:`, value);
                tester.setStatus(`✅ Cell ${cell} updated: ${value}`, 'success');
            });
            
            // With Initial Data
            const dataContainer = document.getElementById('spreadsheet-data');
            const dataSpreadsheet = new XWUISpreadsheet(
                dataContainer,
                {
                    data: [
                        {
                            'A1': { value: 'Name', style: { bold: true } },
                            'B1': { value: 'Age', style: { bold: true } },
                            'C1': { value: 'City', style: { bold: true } }
                        },
                        {
                            'A2': { value: 'John' },
                            'B2': { value: 25 },
                            'C2': { value: 'New York' }
                        },
                        {
                            'A3': { value: 'Jane' },
                            'B3': { value: 30 },
                            'C3': { value: 'London' }
                        },
                        {
                            'A4': { value: 'Bob' },
                            'B4': { value: 28 },
                            'C4': { value: 'Paris' }
                        }
                    ]
                },
                {
                    rows: 50,
                    columns: 20,
                    showToolbar,
                    showFormulaBar: true
                }
            );
            
            // Compact
            const compactContainer = document.getElementById('spreadsheet-compact');
            const compactSpreadsheet = new XWUISpreadsheet(
                compactContainer,
                {},
                {
                    rows: 30,
                    columns: 15,
                    showToolbar,
                    showFormulaBar,
                    showRowNumbers,
                    showColumnHeaders: true
                }
            );
            
            tester.setStatus('✅ XWUISpreadsheet initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISpreadsheet test error:', error);
        }
