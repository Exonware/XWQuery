import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIItemGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIItemGroup } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIItemGroup Component Tester',
            desc: 'This page tests the XWUIItemGroup component (multiple items/tree) in isolation. Expected: List of items with nested groups that can expand/collapse.',
            componentName: 'XWUIItemGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiitem-group-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const container = document.getElementById('group-container');
        
        try {
            if (!container) {
                throw new Error('Container not found');
            }
            
            // Comprehensive test group with nested items, various sizes, and states
            const testItems = [
                {
                    uid: 'workspace',
                    id: 'workspace',
                    item_type: 'row',
                    item_size: 'l',
                    status: 'processing',
                    primaryContent: [
                        { type: 'text', value: 'My Workspace', style: 'bold' }
                    ],
                    avatarContent: [
                        { type: 'icon', value: 'folder' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: '12 items', style: 'secondary' }
                    ],
                    itemStates: {
                        isExpanded,
                        isSelected,
                        isFavorite: true
                    },
                    itemActionsSettings: {
                        canClick,
                        canAdd,
                        canEdit,
                        canDelete,
                        canFav: true
                    },
                    group_list: [
                        {
                            uid: 'projects',
                            id: 'projects',
                            item_type: 'row',
                            item_size: 'm',
                            primaryContent: [
                                { type: 'text', value: 'Projects', style: 'bold' }
                            ],
                            avatarContent: [
                                { type: 'icon', value: 'folder' }
                            ],
                            secondaryContent: [
                                { type: 'text', value: '5 active', style: 'secondary' }
                            ],
                            itemStates: {
                                isExpanded: true
                            },
                            itemActionsSettings: {
                                canClick,
                                canAdd: true
                            },
                            group_list: [
                                {
                                    uid: 'project-web',
                                    id: 'project-web',
                                    item_type: 'row',
                                    item_size: 's',
                                    status: 'processing',
                                    primaryContent: [
                                        { type: 'text', value: 'Web Application', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'In Progress', color: '#3b82f6' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit,
                                        canDelete: true
                                    },
                                    group_list: [
                                        {
                                            uid: 'project-web-features',
                                            id: 'project-web-features',
                                            item_type: 'row',
                                            item_size: 'xs',
                                            primaryContent: [
                                                { type: 'text', value: 'Features' }
                                            ],
                                            avatarContent: [
                                                { type: 'icon', value: 'folder' }
                                            ],
                                            itemStates: {
                                                isExpanded: true
                                            },
                                            itemActionsSettings: {
                                                canClick: true
                                            },
                                            group_list: [
                                                {
                                                    uid: 'feature-auth',
                                                    id: 'feature-auth',
                                                    item_type: 'row',
                                                    item_size: 'xs',
                                                    status: 'pass',
                                                    primaryContent: [
                                                        { type: 'text', value: 'Authentication' }
                                                    ],
                                                    avatarContent: [
                                                        { type: 'icon', value: 'check' }
                                                    ],
                                                    itemActionsSettings: {
                                                        canClick: true
                                                    }
                                                },
                                                {
                                                    uid: 'feature-dashboard',
                                                    id: 'feature-dashboard',
                                                    item_type: 'row',
                                                    item_size: 'xs',
                                                    status: 'processing',
                                                    primaryContent: [
                                                        { type: 'text', value: 'Dashboard' }
                                                    ],
                                                    avatarContent: [
                                                        { type: 'icon', value: 'clock' }
                                                    ],
                                                    itemActionsSettings: {
                                                        canClick: true
                                                    }
                                                },
                                                {
                                                    uid: 'feature-api',
                                                    id: 'feature-api',
                                                    item_type: 'row',
                                                    item_size: 'xs',
                                                    status: 'before_start',
                                                    primaryContent: [
                                                        { type: 'text', value: 'API Integration' }
                                                    ],
                                                    avatarContent: [
                                                        { type: 'icon', value: 'warning' }
                                                    ],
                                                    itemActionsSettings: {
                                                        canClick: true
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            uid: 'project-web-tasks',
                                            id: 'project-web-tasks',
                                            item_type: 'row',
                                            item_size: 'xs',
                                            primaryContent: [
                                                { type: 'text', value: 'Tasks' }
                                            ],
                                            avatarContent: [
                                                { type: 'icon', value: 'list' }
                                            ],
                                            itemStates: {
                                                isExpanded: false
                                            },
                                            itemActionsSettings: {
                                                canClick: true
                                            },
                                            group_list: [
                                                {
                                                    uid: 'task-1',
                                                    id: 'task-1',
                                                    item_type: 'row',
                                                    item_size: 'xs',
                                                    primaryContent: [
                                                        { type: 'text', value: 'Setup database' }
                                                    ],
                                                    avatarContent: [
                                                        { type: 'icon', value: 'file' }
                                                    ],
                                                    itemActionsSettings: {
                                                        canClick: true
                                                    }
                                                },
                                                {
                                                    uid: 'task-2',
                                                    id: 'task-2',
                                                    item_type: 'row',
                                                    item_size: 'xs',
                                                    primaryContent: [
                                                        { type: 'text', value: 'Design UI components' }
                                                    ],
                                                    avatarContent: [
                                                        { type: 'icon', value: 'file' }
                                                    ],
                                                    itemActionsSettings: {
                                                        canClick: true
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    uid: 'project-mobile',
                                    id: 'project-mobile',
                                    item_type: 'row',
                                    item_size: 's',
                                    status: 'pass',
                                    primaryContent: [
                                        { type: 'text', value: 'Mobile App', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'Completed', color: '#10b981' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit,
                                        canDelete: true
                                    }
                                },
                                {
                                    uid: 'project-api',
                                    id: 'project-api',
                                    item_type: 'row',
                                    item_size: 's',
                                    status: 'error',
                                    primaryContent: [
                                        { type: 'text', value: 'API Server', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'Error', color: '#ef4444' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit,
                                        canDelete: true
                                    }
                                },
                                {
                                    uid: 'project-docs',
                                    id: 'project-docs',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Documentation' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                },
                                {
                                    uid: 'project-testing',
                                    id: 'project-testing',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Testing Suite' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                }
                            ]
                        },
                        {
                            uid: 'tasks',
                            id: 'tasks',
                            item_type: 'row',
                            item_size: 'm',
                            primaryContent: [
                                { type: 'text', value: 'Tasks', style: 'bold' }
                            ],
                            avatarContent: [
                                { type: 'icon', value: 'list' }
                            ],
                            secondaryContent: [
                                { type: 'text', value: '8 pending', style: 'secondary' }
                            ],
                            itemStates: {
                                isExpanded: true
                            },
                            itemActionsSettings: {
                                canClick,
                                canAdd: true
                            },
                            group_list: [
                                {
                                    uid: 'task-urgent',
                                    id: 'task-urgent',
                                    item_type: 'row',
                                    item_size: 's',
                                    status: 'error',
                                    primaryContent: [
                                        { type: 'text', value: 'Fix critical bug', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'warning' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'Due: Today', color: '#ef4444' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit,
                                        canDelete: true
                                    }
                                },
                                {
                                    uid: 'task-review',
                                    id: 'task-review',
                                    item_type: 'row',
                                    item_size: 's',
                                    status: 'before_start',
                                    primaryContent: [
                                        { type: 'text', value: 'Code review PR #42' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'Due: Tomorrow', color: '#f59e0b' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit: true
                                    }
                                },
                                {
                                    uid: 'task-documentation',
                                    id: 'task-documentation',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Update API documentation' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                },
                                {
                                    uid: 'task-meeting',
                                    id: 'task-meeting',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Team standup meeting' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'user' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'Recurring', style: 'secondary' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                },
                                {
                                    uid: 'task-deploy',
                                    id: 'task-deploy',
                                    item_type: 'row',
                                    item_size: 's',
                                    status: 'processing',
                                    primaryContent: [
                                        { type: 'text', value: 'Deploy to production' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'clock' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'In Progress', color: '#3b82f6' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                }
                            ]
                        },
                        {
                            uid: 'team',
                            id: 'team',
                            item_type: 'row',
                            item_size: 'm',
                            primaryContent: [
                                { type: 'text', value: 'Team Members', style: 'bold' }
                            ],
                            avatarContent: [
                                { type: 'icon', value: 'user' }
                            ],
                            secondaryContent: [
                                { type: 'text', value: '6 members', style: 'secondary' }
                            ],
                            itemStates: {
                                isExpanded: false
                            },
                            itemActionsSettings: {
                                canClick,
                                canAdd: true
                            },
                            group_list: [
                                {
                                    uid: 'member-alice',
                                    id: 'member-alice',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Alice Johnson', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'user' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'Lead Developer', style: 'secondary' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit: true
                                    }
                                },
                                {
                                    uid: 'member-bob',
                                    id: 'member-bob',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Bob Smith', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'user' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'UI/UX Designer', style: 'secondary' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit: true
                                    }
                                },
                                {
                                    uid: 'member-charlie',
                                    id: 'member-charlie',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Charlie Brown', style: 'bold' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'user' }
                                    ],
                                    secondaryContent: [
                                        { type: 'text', value: 'QA Engineer', style: 'secondary' }
                                    ],
                                    itemActionsSettings: {
                                        canClick,
                                        canEdit: true
                                    }
                                }
                            ]
                        },
                        {
                            uid: 'resources',
                            id: 'resources',
                            item_type: 'row',
                            item_size: 'm',
                            primaryContent: [
                                { type: 'text', value: 'Resources', style: 'bold' }
                            ],
                            avatarContent: [
                                { type: 'icon', value: 'folder' }
                            ],
                            itemStates: {
                                isExpanded: false
                            },
                            itemActionsSettings: {
                                canClick: true
                            },
                            group_list: [
                                {
                                    uid: 'resource-docs',
                                    id: 'resource-docs',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Documentation' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                },
                                {
                                    uid: 'resource-assets',
                                    id: 'resource-assets',
                                    item_type: 'row',
                                    item_size: 's',
                                    primaryContent: [
                                        { type: 'text', value: 'Assets' }
                                    ],
                                    avatarContent: [
                                        { type: 'icon', value: 'file' }
                                    ],
                                    itemActionsSettings: {
                                        canClick: true
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    uid: 'standalone-1',
                    id: 'standalone-1',
                    item_type: 'row',
                    item_size: 'm',
                    primaryContent: [
                        { type: 'text', value: 'Quick Access', style: 'bold' }
                    ],
                    avatarContent: [
                        { type: 'icon', value: 'star' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Pinned', style: 'secondary' }
                    ],
                    itemStates: {
                        isFavorite: true
                    },
                    itemActionsSettings: {
                        canClick,
                        canFav,
                        canDelete,
                        canEdit: true
                    }
                },
                {
                    uid: 'standalone-2',
                    id: 'standalone-2',
                    item_type: 'row',
                    item_size: 'm',
                    status: 'processing',
                    primaryContent: [
                        { type: 'text', value: 'Recent Activity', style: 'bold' }
                    ],
                    avatarContent: [
                        { type: 'icon', value: 'clock' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: '5 updates', style: 'secondary' }
                    ],
                    itemActionsSettings: {
                        canClick: true
                    }
                },
                {
                    uid: 'standalone-3',
                    id: 'standalone-3',
                    item_type: 'row',
                    item_size: 'm',
                    primaryContent: [
                        { type: 'text', value: 'Archived Items', style: 'bold' }
                    ],
                    avatarContent: [
                        { type: 'icon', value: 'archive' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: '12 items', style: 'secondary' }
                    ],
                    itemStates: {
                        isArchived: true
                    },
                    itemActionsSettings: {
                        canClick,
                        canArchive: true
                    }
                }
            ];
            
            const group = new XWUIItemGroup(container, {
                items,
                allow_v_scroll,
                onItemClick: (item, event) => {
                    console.log('Item clicked:', item.id);
                    tester.setStatus(`✅ Item clicked: ${item.id}`, 'success');
                },
                onItemAction: (action, item, event) => {
                    console.log('Item action:', action, item.id);
                    if (action === 'toggle_expand') {
                        tester.setStatus(`✅ Toggled expand for: ${item.id}`, 'success');
                        // Re-render group to show updated state
                        setTimeout(() => {
                            group.updateConfig({ items: testItems });
                        }, 100);
                    }
                }
            });
            
            // Count total items including nested ones
            const countItems = (items) => {
                let count = items.length;
                items.forEach(item => {
                    if (item.group_list && item.group_list.length > 0) {
                        count += countItems(item.group_list);
                    }
                });
                return count;
            };
            
            const totalItems = countItems(testItems);
            tester.setStatus(`✅ XWUIItemGroup component initialized successfully Created group with ${testItems.length} top-level items (${totalItems} total items including nested).`, 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIItemGroup test error:', error);
        }
