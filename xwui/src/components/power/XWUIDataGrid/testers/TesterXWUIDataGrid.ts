import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDataGrid/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIDataGrid } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDataGrid Component Tester',
            desc: 'Data grid component with sorting, filtering, pagination, and selection capabilities.',
            componentName: 'XWUIDataGrid'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuidata-grid-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }

        // Sample data
        const sampleData = [
            { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: 'active', score: 85 },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: 'active', score: 92 },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: 'inactive', score: 78 },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, status: 'active', score: 95 },
            { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 32, status: 'pending', score: 88 },
            { id: 6, name: 'Diana Davis', email: 'diana@example.com', age: 27, status: 'active', score: 90 },
            { id: 7, name: 'Edward Miller', email: 'edward@example.com', age: 40, status: 'inactive', score: 75 },
            { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', age: 29, status: 'active', score: 93 },
            { id: 9, name: 'George Martinez', email: 'george@example.com', age: 33, status: 'pending', score: 82 },
            { id: 10, name: 'Helen Anderson', email: 'helen@example.com', age: 26, status: 'active', score: 87 },
            { id: 11, name: 'Ivan Taylor', email: 'ivan@example.com', age: 31, status: 'active', score: 91 },
            { id: 12, name: 'Julia Thomas', email: 'julia@example.com', age: 24, status: 'inactive', score: 79 }
        ];

        // Basic DataGrid
        const basicContainer = document.getElementById('datagrid-basic');
        if (basicContainer) {
            const basicGrid = new XWUIDataGrid(basicContainer, {
                columns: [
                    { id: 'id', label: 'ID', width: '80px' },
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'age', label: 'Age', align: 'center' }
                ],
                data: sampleData.slice(0, 5)
            });
        }

        // Custom Renderers
        const customContainer = document.getElementById('datagrid-custom');
        if (customContainer) {
            const customGrid = new XWUIDataGrid(customContainer, {
                columns: [
                    { id: 'name', label: 'Name' },
                    { 
                        id: 'status', 
                        label: 'Status',
                        render: (row) => {
                            const badge = document.createElement('span');
                            badge.className = 'xwui-badge';
                            badge.textContent = row.status;
                            badge.style.padding = '0.25rem 0.5rem';
                            badge.style.borderRadius = '4px';
                            badge.style.fontSize = '0.75rem';
                            if (row.status === 'active') {
                                badge.style.backgroundColor = 'var(--accent-success)';
                            } else if (row.status === 'inactive') {
                                badge.style.backgroundColor = 'var(--accent-error)';
                            } else {
                                badge.style.backgroundColor = 'var(--accent-warning)';
                            }
                            return badge;
                        }
                    },
                    {
                        id: 'score',
                        label: 'Score',
                        align: 'right',
                        render: (row) => {
                            const div = document.createElement('div');
                            div.style.display = 'flex';
                            div.style.alignItems = 'center';
                            div.style.justifyContent = 'flex-end';
                            div.style.gap = '0.5rem';
                            
                            const progress = document.createElement('div');
                            progress.style.width = '100px';
                            progress.style.height = '8px';
                            progress.style.borderRadius = '4px';
                            progress.style.backgroundColor = 'var(--bg-secondary)';
                            progress.style.overflow = 'hidden';
                            
                            const fill = document.createElement('div');
                            fill.style.width = `${row.score}%`;
                            fill.style.height = '100%';
                            fill.style.backgroundColor = 'var(--accent-primary)';
                            progress.appendChild(fill);
                            
                            div.appendChild(progress);
                            
                            const text = document.createElement('span');
                            text.textContent = row.score;
                            div.appendChild(text);
                            
                            return div;
                        }
                    }
                ],
                data: sampleData.slice(0, 5)
            });
        }

        // Sortable
        const sortableContainer = document.getElementById('datagrid-sortable');
        if (sortableContainer) {
            const sortableGrid = new XWUIDataGrid(sortableContainer, {
                columns: [
                    { id: 'name', label: 'Name', sortable: true },
                    { id: 'email', label: 'Email', sortable: true },
                    { id: 'age', label: 'Age', sortable, align: 'center' },
                    { id: 'score', label: 'Score', sortable, align: 'right' }
                ],
                data: sampleData.slice(0, 8)
            });
            sortableGrid.onSort((column, direction) => {
                console.log(`Sorted by ${column} ${direction}`);
            });
        }

        // Selectable
        const selectableContainer = document.getElementById('datagrid-selectable');
        if (selectableContainer) {
            const selectableGrid = new XWUIDataGrid(selectableContainer, {
                columns: [
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'status', label: 'Status' }
                ],
                data: sampleData.slice(0, 6)
            }, {
                selectable: true
            });
            selectableGrid.onSelect((selected) => {
                console.log('Selected rows:', selected);
            });
        }

        // Pagination
        const paginationContainer = document.getElementById('datagrid-pagination');
        if (paginationContainer) {
            const paginationGrid = new XWUIDataGrid(paginationContainer, {
                columns: [
                    { id: 'id', label: 'ID', width: '80px' },
                    { id: 'name', label: 'Name' },
                    { id: 'email', label: 'Email' },
                    { id: 'age', label: 'Age', align: 'center' }
                ],
                data: sampleData
            }, {
                pagination,
                pageSize: 5
            });
        }

        // Full Features
        const fullContainer = document.getElementById('datagrid-full');
        if (fullContainer) {
            const fullGrid = new XWUIDataGrid(fullContainer, {
                columns: [
                    { id: 'name', label: 'Name', sortable: true },
                    { id: 'email', label: 'Email', sortable: true },
                    {
                        id: 'status',
                        label: 'Status',
                        sortable,
                        render: (row) => {
                            const badge = document.createElement('span');
                            badge.textContent = row.status;
                            badge.style.padding = '0.25rem 0.5rem';
                            badge.style.borderRadius = '4px';
                            badge.style.fontSize = '0.75rem';
                            badge.style.fontWeight = '500';
                            if (row.status === 'active') {
                                badge.style.backgroundColor = 'var(--accent-success)';
                            } else if (row.status === 'inactive') {
                                badge.style.backgroundColor = 'var(--accent-error)';
                            } else {
                                badge.style.backgroundColor = 'var(--accent-warning)';
                            }
                            return badge;
                        }
                    },
                    { id: 'age', label: 'Age', sortable, align: 'center' },
                    { id: 'score', label: 'Score', sortable, align: 'right' }
                ],
                data: sampleData
            }, {
                selectable,
                pagination,
                pageSize: 5,
                striped,
                hoverable: true
            });
            fullGrid.onSort((column, direction) => {
                console.log(`Sorted by ${column} ${direction}`);
            });
            fullGrid.onSelect((selected) => {
                console.log('Selected rows:', selected);
            });
        }
