import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIKanbanBoard/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIKanbanBoard } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIKanbanBoard Component Tester',
            desc: 'Kanban board with columns and drag-and-drop between columns.',
            componentName: 'XWUIKanbanBoard'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuikanban-board-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Create a sample avatar (using a data URI for demo)
        const avatarDataUri = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTE2IDEwQzE3LjY1NjkgMTAgMTkgMTEuMzQzMSAxOSAxM0MxOSAxNC42NTY5IDE3LjY1NjkgMTYgMTYgMTZDMTQuMzQzMSAxNiAxMyAxNC42NTY5IDEzIDEzQzEzIDExLjM0MzEgMTQuMzQzMSAxMCAxNiAxMFoiIGZpbGw9IiM2QjcyODAiLz4KPHBhdGggZD0iTTE2IDIwQzE4LjIwOTEgMjAgMjAgMjEuNzkwOSAyMCAyNFYyNkgxMlYyNEMxMiAyMS43OTA5IDEzLjc5MDkgMjAgMTYgMjBaIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo=';
        
        const board = new XWUIKanbanBoard(
            document.getElementById('kanban-board-1'),
            {
                columns: [
                    {
                        id: 'asap',
                        title: 'ASAP',
                        cards: [
                            { 
                                id: '1', 
                                title: 'Setup Convertbox', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['setup:purple', 'features:green', 'integrations:purple'],
                                priority: 'high'
                            },
                            { 
                                id: '2', 
                                title: 'Setup Publist', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['setup:purple'],
                                priority: 'high'
                            }
                        ]
                    },
                    {
                        id: 'waiting',
                        title: 'Waiting On',
                        cards: [
                            { 
                                id: '3', 
                                title: 'Update citi connection in quickbooks', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['accounting:red', 'qb:grey'],
                                priority: 'high'
                            },
                            { 
                                id: '4', 
                                title: 'Contact ASI About Past 3 invoices', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['accounting:red']
                            },
                            { 
                                id: '5', 
                                title: 'QUUU to fix integration with SocialBee', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['integrations:purple', 'social:grey'],
                                priority: 'medium'
                            },
                            { 
                                id: '6', 
                                title: 'WF Confirmation from Beaver Builder that subscriptions will not auto renew', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['cancellations:red'],
                                priority: 'medium'
                            }
                        ]
                    },
                    {
                        id: 'next',
                        title: 'Next Up',
                        cards: [
                            { 
                                id: '7', 
                                title: 'Close out shoeboxed account and set up evernote for all receipts', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['savemoney:green', 'cost-savings:orange'],
                                priority: 'high'
                            },
                            { 
                                id: '8', 
                                title: 'Create ABM executive guide for ASIS', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['asis:purple'],
                                priority: 'high'
                            },
                            { 
                                id: '9', 
                                title: 'Setup Switchy', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['appsumo:grey'],
                                priority: 'high'
                            }
                        ]
                    },
                    {
                        id: 'should',
                        title: 'Should Do',
                        cards: [
                            { 
                                id: '10', 
                                title: 'Review OntheFuse for outsourcing', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['decisions:orange', 'capacity:orange'],
                                priority: 'high'
                            },
                            { 
                                id: '11', 
                                title: 'Accounting: Closeout mileage monthly 2019-10-01', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['admin:pink', 'accounting:red', 'taxes:pink'],
                                date: '2019-10-01',
                                priority: 'low'
                            },
                            { 
                                id: '12', 
                                title: 'Change to easy DNS with cloudways for faster serving websites', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['web-opt:green']
                            },
                            { 
                                id: '13', 
                                title: 'Review HubSpot Updates from Inbound', 
                                assignee: 'John Doe',
                                assigneeAvatar,
                                tags: ['rnr:teal', 'read:grey', 'hubpartner:teal']
                            }
                        ]
                    }
                ]
            },
            { allowAddCards, allowReorder: true }
        );
        
        tester.data.componentInstance = board;
        tester.data.componentConfig = board.config;
        tester.data.componentData = board.data;
        tester.setStatus('Component loaded successfully', 'success');
