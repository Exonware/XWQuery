import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIItem/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIItem } from '../index.ts';
        import { XWUIConsole } from '../../XWUIConsole/index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIItem Sandbox Tester',
            desc: 'Edit the JSON configuration below and see the component update in real-time.',
            componentName: 'XWUIItem'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiitem-sandbox-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const statusEl = tester.getStatusElement();
        tester.setStatus('Ready - Edit JSON and click "Update Component"', 'info');
        const consoleContainer = document.getElementById('xwui-console');
        const jsonEditorData = document.getElementById('json-editor-data');
        const jsonEditorConfig = document.getElementById('json-editor-config');
        const previewContainer = document.getElementById('preview-container');
        const errorMessage = document.getElementById('error-message');
        const btnUpdate = document.getElementById('btn-update');
        const btnReset = document.getElementById('btn-reset');
        const btnFormat = document.getElementById('btn-format');
        const editorTabs = document.querySelectorAll('.editor-tab');
        const editorPanels = document.querySelectorAll('.editor-panel');
        
        // Initialize console
        let xwConsole = null;
        if (consoleContainer) {
            xwConsole = new XWUIConsole(consoleContainer, {
                theme: 'dark',
                maxEntries: 500,
                showTimestamp,
                showSource,
                autoScroll: true
            });
        }
        
        // Load configurations
        let conf_sys, conf_usr;
        
        async function loadConfigs() {
            try {
                conf_sys = await XWUIItem.loadSystemConfig();
                conf_usr = await XWUIItem.loadUserConfig();
                
                if (xwConsole) {
                    if (conf_sys) {
                        xwConsole.info('System config loaded', 'Sandbox');
                    }
                    if (conf_usr) {
                        xwConsole.info('User config loaded', 'Sandbox');
                    }
                }
            } catch (error) {
                console.warn('Could not load configs:', error);
            }
        }
        
        // Load configs on init
        loadConfigs();
        
        // Advanced examples collection
        const examples = {
            'default': {
            uid: 'sandbox-1',
            id: 'sandbox-1',
            item_type: 'row',
            item_size: 'xl',
            primaryContent: [
                { type: 'text', value: 'Sandbox Item', style: 'bold' }
            ],
            secondaryContent: [
                { type: 'text', value: 'Edit this JSON to see changes', style: 'subdued' }
            ],
            tertiaryContent: [
                { type: 'text', value: 'This is a sandbox environment for testing XWUIItem configurations.' }
            ],
            primaryContent_other: [
                { type: 'text', value: 'Just now', style: 'timestamp' }
            ],
            avatarContent: [
                { type: 'icon', value: 'user', color: '#0078d4' }
            ],
            itemActionsSettings: {
                canClick,
                canDelete,
                canEdit,
                canFav,
                canMoreOptions: true
            },
            itemStates: {
                isSelected,
                isFavorite: false
                }
            },
            'chat-sent': {
                uid: 'chat-sent-1',
                id: 'chat-sent-1',
                item_type: 'chat_bubble',
                item_size: 'm',
                primaryContent: [
                    { type: 'text', value: 'Hey How are you doing today?' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '10:30 AM', style: 'timestamp' }
                ],
                background_color: '#0078d4',
                itemActionsSettings: {
                    canClick: true
                }
            },
            'chat-received': {
                uid: 'chat-received-1',
                id: 'chat-received-1',
                item_type: 'chat_bubble',
                item_size: 'm',
                primaryContent: [
                    { type: 'text', value: 'I\'m doing great Thanks for asking. How about you?' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '10:32 AM', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/32x32/10b981/white?text=JD', shape: 'circle' }
                ],
                background_color: '#e3f2fd',
                itemActionsSettings: {
                    canClick: true
                }
            },
            'whatsapp-chat': {
                uid: 'whatsapp-chat-1',
                id: 'whatsapp-chat-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Noor BALFAQEEH', style: 'bold' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: '+966 50 087 5554', style: 'subdued' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Unfortunately I won\'t be able to join both the Jeddah United and Creative morning events due to travel. December is a busy month for me and i am missing the fun 😔' }
                ],
                secondaryContent_other: [
                    { type: 'text', value: '💔', style: 'subdued' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '09:03', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/48x48/4a90e2/white?text=NB', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canSelectText: true
                },
                itemStates: {
                    isSelected: false
                }
            },
            'email': {
                uid: 'email-1',
                id: 'email-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Project Update: Q4 Review Meeting', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Sarah Johnson', style: 'bold' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: 'Marketing Team', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'Hi team, I wanted to share the latest updates on our Q4 review meeting scheduled for next week...' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '2 hours ago', style: 'timestamp' },
                    { type: 'icon', value: 'star', color: '#ffc107' }
                ],
                secondaryContent_other: [
                    { type: 'icon', value: 'mail', color: '#0078d4' },
                    { type: 'icon', value: 'file', color: '#666' },
                    { type: 'text', value: '3', style: 'subdued' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=SJ', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canSelect,
                    canDelete,
                    canFav,
                    canRightClick: true
                },
                itemStates: {
                    isSelected,
                    isFavorite: true
                }
            },
            'card-full': {
                uid: 'card-full-1',
                id: 'card-full-1',
                item_type: 'card',
                item_size: 'xl',
                primaryContent: [
                    { type: 'icon', value: 'folder', color: '#0078d4' },
                    { type: 'text', value: 'Project Documents', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Last modified: ', style: 'subdued' },
                    { type: 'text', value: '2 days ago', style: 'timestamp' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'Contains 15 files including reports, presentations, and spreadsheets.' }
                ],
                primaryContent_other: [
                    { type: 'progress_bar', value: 75 },
                    { type: 'text', value: '75% complete', style: 'subdued' }
                ],
                secondaryContent_other: [
                    { type: 'user_stack', value: [
                        'https://placehold.co/32x32/0078d4/white?text=U1',
                        'https://placehold.co/32x32/10b981/white?text=U2',
                        'https://placehold.co/32x32/ffc107/white?text=U3'
                    ]}
                ],
                avatarContent: [
                    { type: 'icon', value: 'folder', color: '#0078d4' }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete,
                    canSave,
                    canLoad: true
                },
                itemStates: {
                    isSelected: false
                }
            },
            'banner': {
                uid: 'banner-1',
                id: 'banner-1',
                item_type: 'banner',
                item_size: 'l',
                primaryContent: [
                    { type: 'icon', value: 'shield', color: '#ffffff' },
                    { type: 'text', value: 'System Maintenance Scheduled', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'The system will be under maintenance on Friday, 3:00 AM - 5:00 AM EST.' }
                ],
                status: 'processing',
                itemActionsSettings: {
                    canClick,
                    canEdit: true
                }
            },
            'search': {
                uid: 'search-1',
                id: 'search-1',
                item_type: 'search',
                item_size: 'm',
                primaryContent: [
                    { type: 'text', value: 'Search files, folders, and documents...' }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'visibility': {
                uid: 'visibility-1',
                id: 'visibility-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Visibility Controls Demo', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'This item demonstrates visibility controls' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'Tertiary content (can be hidden via visibility settings)' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'Now', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'settings', color: '#666' }
                ],
                contentVisibility: {
                    tertiaryContent,
                    primaryContent_other: true
                },
                actionVisibility: {
                    checkbox,
                    actions: 'auto'
                },
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete,
                    canDrag: true
                }
            },
            'actions': {
                uid: 'actions-1',
                id: 'actions-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'All Actions Enabled', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'This item has all available actions enabled' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '1 min ago', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'settings', color: '#0078d4' }
                ],
                itemActionsSettings: {
                    canSelect,
                    canDelete,
                    canAdd,
                    canEdit,
                    canDrag,
                    canClick,
                    canRightClick,
                    canArchive,
                    canSave,
                    canLoad,
                    canFav,
                    canMoreOptions,
                    canSelectText: true
                },
                itemStates: {
                    isSelected,
                    isFavorite,
                    isArchived: false
                }
            },
            'status': {
                uid: 'status-1',
                id: 'status-1',
                item_type: 'row',
                item_size: 'l',
                primaryContent: [
                    { type: 'text', value: 'Status: Before Start', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Yellow background indicates task not started' }
                ],
                status: 'before_start',
                itemActionsSettings: {
                    canClick: true
                }
            },
            'complex': {
                uid: 'complex-1',
                id: 'complex-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'icon', value: 'file', color: '#0078d4' },
                    { type: 'text', value: 'Complex Multi-Section Item', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'John Doe', style: 'bold' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: 'Product Manager', style: 'subdued' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: 'Engineering Team', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'This is a comprehensive example showcasing all content sections, multiple content parts, icons, images, and various action buttons. The item demonstrates the full capabilities of the XWUIItem component.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'Yesterday at 4:30 PM', style: 'timestamp' },
                    { type: 'icon', value: 'star', color: '#ffc107' },
                    { type: 'icon', value: 'edit', color: '#666' }
                ],
                secondaryContent_other: [
                    { type: 'icon', value: 'mail', color: '#0078d4' },
                    { type: 'text', value: '5', style: 'subdued' },
                    { type: 'icon', value: 'file', color: '#666' },
                    { type: 'text', value: '12', style: 'subdued' }
                ],
                tertiaryContent_other: [
                    { type: 'progress_bar', value: 60 },
                    { type: 'text', value: '60% complete', style: 'subdued' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/48x48/0078d4/white?text=JD', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canSelect,
                    canDelete,
                    canAdd,
                    canEdit,
                    canDrag,
                    canClick,
                    canRightClick,
                    canArchive,
                    canSave,
                    canLoad,
                    canFav,
                    canMoreOptions,
                    canSelectText: true
                },
                itemStates: {
                    isSelected,
                    isExpanded,
                    isFavorite,
                    isArchived: false
                },
                group_list: [
                    {
                        uid: 'nested-1',
                        id: 'nested-1',
                        item_type: 'row',
                        item_size: 's',
                        primaryContent: [
                            { type: 'text', value: 'Nested Item 1' }
                        ]
                    }
                ]
            },
            // Advanced examples with text overflow
            'overflow-ellipsis': {
                uid: 'overflow-ellipsis-1',
                id: 'overflow-ellipsis-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { 
                        type: 'text', 
                        value: 'This is a very long text that will overflow and show ellipsis (...) when it exceeds the maximum number of lines. The text overflow mode is set to ellipsis which will automatically truncate the text and show three dots at the end.',
                        style: 'bold',
                        textOverflow: {
                            mode: 'ellipsis',
                            maxLines: 2
                        }
                    }
                ],
                secondaryContent: [
                    { 
                        type: 'text', 
                        value: 'Secondary content with ellipsis overflow. This text is also quite long and will be truncated when it exceeds the maximum lines specified in the textOverflow configuration.',
                        textOverflow: {
                            mode: 'ellipsis',
                            maxLines: 1
                        }
                    }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'overflow-expandable': {
                uid: 'overflow-expandable-1',
                id: 'overflow-expandable-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { 
                        type: 'text', 
                        value: 'This is an expandable text example. Click the + button to see more content. This feature allows users to expand and collapse long text content to save space while still providing access to the full information when needed.',
                        style: 'bold',
                        textOverflow: {
                            mode: 'expandable',
                            maxLines: 2,
                            expanded: false
                        }
                    }
                ],
                tertiaryContent: [
                    { 
                        type: 'text', 
                        value: 'This is the tertiary content section with expandable text. You can click the expand button to see the full content. This is useful for descriptions, comments, or any long-form text that might not always need to be fully visible. The expandable mode provides a better user experience than simple ellipsis by allowing users to toggle the visibility of the full content.',
                        textOverflow: {
                            mode: 'expandable',
                            maxLines: 3,
                            expanded: false
                        }
                    }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'multi-content': {
                uid: 'multi-content-1',
                id: 'multi-content-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'icon', value: 'folder', color: '#0078d4' },
                    { type: 'text', value: 'Multi-Content Example', style: 'bold' },
                    { type: 'icon', value: 'star', color: '#ffc107' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Author: ', style: 'subdued' },
                    { type: 'text', value: 'John Smith', style: 'bold' },
                    { type: 'text', value: ' | ', style: 'subdued' },
                    { type: 'text', value: 'Category: ', style: 'subdued' },
                    { type: 'text', value: 'Documents', style: 'bold' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'This example shows multiple content parts in each section, demonstrating how icons, text, and other elements can be combined.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'Updated: ', style: 'subdued' },
                    { type: 'text', value: '2 days ago', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=JS', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete: true
                }
            },
            'progress-demo': {
                uid: 'progress-demo-1',
                id: 'progress-demo-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Project Progress', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Task completion status' }
                ],
                primaryContent_other: [
                    { type: 'progress_bar', value: 75 },
                    { type: 'text', value: '75%', style: 'bold' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'Current progress: 75 out of 100 tasks completed' }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'user-stack': {
                uid: 'user-stack-1',
                id: 'user-stack-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Team Collaboration', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Active contributors: ' },
                    { type: 'user_stack', value: [
                        'https://placehold.co/32x32/0078d4/white?text=U1',
                        'https://placehold.co/32x32/10b981/white?text=U2',
                        'https://placehold.co/32x32/ffc107/white?text=U3',
                        'https://placehold.co/32x32/ec4899/white?text=U4'
                    ]}
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'mixed-icons': {
                uid: 'mixed-icons-1',
                id: 'mixed-icons-1',
                item_type: 'row',
                item_size: 'l',
                primaryContent: [
                    { type: 'icon', value: 'file', color: '#0078d4' },
                    { type: 'text', value: 'Document.pdf', style: 'bold' },
                    { type: 'icon', value: 'star', color: '#ffc107' }
                ],
                secondaryContent: [
                    { type: 'icon', value: 'user', color: '#666' },
                    { type: 'text', value: 'Shared by John Doe' },
                    { type: 'icon', value: 'mail', color: '#0078d4' }
                ],
                primaryContent_other: [
                    { type: 'icon', value: 'edit', color: '#666' },
                    { type: 'icon', value: 'trash', color: '#d32f2f' }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete: true
                }
            },
            'colorful': {
                uid: 'colorful-1',
                id: 'colorful-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Colorful Item', style: 'bold', color: '#0078d4' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Red text', color: '#d32f2f' },
                    { type: 'text', value: ' | ', style: 'subdued' },
                    { type: 'text', value: 'Green text', color: '#10b981' },
                    { type: 'text', value: ' | ', style: 'subdued' },
                    { type: 'text', value: 'Blue text', color: '#0078d4' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'This item demonstrates custom text colors for different content parts.' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'settings', color: '#8b5cf6' }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'minimal': {
                uid: 'minimal-1',
                id: 'minimal-1',
                item_type: 'row',
                item_size: 's',
                primaryContent: [
                    { type: 'text', value: 'Minimal Design', style: 'bold' }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            },
            'rich-content': {
                uid: 'rich-content-1',
                id: 'rich-content-1',
                item_type: 'card',
                item_size: 'xl',
                primaryContent: [
                    { type: 'icon', value: 'folder', color: '#0078d4' },
                    { type: 'text', value: 'Rich Content Example', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Multiple content types combined' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'This example combines icons, text, progress bars, and user stacks to create a rich, informative item.' }
                ],
                primaryContent_other: [
                    { type: 'progress_bar', value: 85 },
                    { type: 'text', value: '85%', style: 'bold' }
                ],
                secondaryContent_other: [
                    { type: 'user_stack', value: [
                        'https://placehold.co/32x32/0078d4/white?text=U1',
                        'https://placehold.co/32x32/10b981/white?text=U2'
                    ]}
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/48x48/0078d4/white?text=RC', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete,
                    canFav: true
                }
            },
            'interactive': {
                uid: 'interactive-1',
                id: 'interactive-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Interactive Demo', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Try clicking, right-clicking, and using action buttons' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'Now', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'settings', color: '#0078d4' }
                ],
                itemActionsSettings: {
                    canClick,
                    canRightClick,
                    canSelect,
                    canEdit,
                    canDelete,
                    canDrag,
                    canFav,
                    canMoreOptions: true
                },
                itemStates: {
                    isSelected: false
                }
            },
            // LTR Examples
            'ltr-email': {
                uid: 'ltr-email-1',
                id: 'ltr-email-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'Meeting Reminder: Q4 Planning Session', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'From: ', style: 'subdued' },
                    { type: 'text', value: 'project-manager@company.com', style: 'bold' },
                    { type: 'text', value: ' | ', style: 'subdued' },
                    { type: 'text', value: 'To: Team', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'Reminder: Our Q4 planning session is scheduled for tomorrow at 2:00 PM in Conference Room A. Please review the attached documents before the meeting.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'Today 10:15 AM', style: 'timestamp' },
                    { type: 'icon', value: 'star', color: '#ffc107' }
                ],
                secondaryContent_other: [
                    { type: 'icon', value: 'file', color: '#666' },
                    { type: 'text', value: '2 attachments', style: 'subdued' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'mail', color: '#0078d4' }
                ],
                itemActionsSettings: {
                    canClick,
                    canSelect,
                    canDelete,
                    canFav: true
                }
            },
            'ltr-chat': {
                uid: 'ltr-chat-1',
                id: 'ltr-chat-1',
                item_type: 'chat_bubble',
                item_size: 'm',
                primaryContent: [
                    { type: 'text', value: 'Hey team Just wanted to share an update on the project timeline. We\'re making great progress and should be able to deliver ahead of schedule.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '11:45 AM', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/32x32/0078d4/white?text=PM', shape: 'circle' }
                ],
                background_color: '#e3f2fd',
                itemActionsSettings: {
                    canClick: true
                }
            },
            'ltr-dashboard': {
                uid: 'ltr-dashboard-1',
                id: 'ltr-dashboard-1',
                item_type: 'card',
                item_size: 'l',
                primaryContent: [
                    { type: 'icon', value: 'settings', color: '#0078d4' },
                    { type: 'text', value: 'Dashboard Widget', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Active users: ', style: 'subdued' },
                    { type: 'text', value: '1,234', style: 'bold', color: '#10b981' }
                ],
                primaryContent_other: [
                    { type: 'progress_bar', value: 68 }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit: true
                }
            },
            'ltr-notification': {
                uid: 'ltr-notification-1',
                id: 'ltr-notification-1',
                item_type: 'banner',
                item_size: 'm',
                primaryContent: [
                    { type: 'icon', value: 'shield', color: '#ffffff' },
                    { type: 'text', value: 'New security update available', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Please update your system to the latest version for enhanced security features.' }
                ],
                status: 'processing',
                itemActionsSettings: {
                    canClick: true
                }
            },
            'ltr-file-item': {
                uid: 'ltr-file-1',
                id: 'ltr-file-1',
                item_type: 'row',
                item_size: 'm',
                primaryContent: [
                    { type: 'icon', value: 'file', color: '#0078d4' },
                    { type: 'text', value: 'project-document.pdf', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: '2.4 MB', style: 'subdued' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: 'Modified: 3 hours ago', style: 'subdued' }
                ],
                primaryContent_other: [
                    { type: 'icon', value: 'edit', color: '#666' }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete: true
                }
            },
            // Arabic RTL Examples
            'rtl-email-ar': {
                uid: 'rtl-email-ar-1',
                id: 'rtl-email-ar-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'تحديث المشروع: اجتماع مراجعة الربع الرابع', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'من: ', style: 'subdued' },
                    { type: 'text', value: 'سارة أحمد', style: 'bold' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: 'فريق التسويق', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'مرحباً فريق، أردت مشاركة آخر التحديثات حول اجتماع مراجعة الربع الرابع المقرر الأسبوع القادم...' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'منذ ساعتين', style: 'timestamp' },
                    { type: 'icon', value: 'star', color: '#ffc107' }
                ],
                secondaryContent_other: [
                    { type: 'icon', value: 'mail', color: '#0078d4' },
                    { type: 'icon', value: 'file', color: '#666' },
                    { type: 'text', value: '3', style: 'subdued' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=سا', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canSelect,
                    canDelete,
                    canFav: true
                }
            },
            'rtl-chat-ar': {
                uid: 'rtl-chat-ar-1',
                id: 'rtl-chat-ar-1',
                item_type: 'chat_bubble',
                item_size: 'm',
                primaryContent: [
                    { type: 'text', value: 'مرحباً! كيف حالك اليوم؟' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '10:30 ص', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/32x32/10b981/white?text=مح', shape: 'circle' }
                ],
                background_color: '#e3f2fd',
                itemActionsSettings: {
                    canClick: true
                }
            },
            'rtl-news-ar': {
                uid: 'rtl-news-ar-1',
                id: 'rtl-news-ar-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'text', value: 'أخبار التكنولوجيا: إطلاق منتج جديد', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'كاتب: ', style: 'subdued' },
                    { type: 'text', value: 'أحمد محمد', style: 'bold' },
                    { type: 'text', value: ' | ', style: 'subdued' },
                    { type: 'text', value: 'قسم التكنولوجيا', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'أعلنت الشركة اليوم عن إطلاق منتج جديد يهدف إلى تحسين تجربة المستخدم وتقديم حلول مبتكرة للسوق المحلي والعالمي.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'أمس 4:30 م', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=أح', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canFav: true
                }
            },
            'rtl-document-ar': {
                uid: 'rtl-document-ar-1',
                id: 'rtl-document-ar-1',
                item_type: 'row',
                item_size: 'xl',
                primaryContent: [
                    { type: 'icon', value: 'file', color: '#0078d4' },
                    { type: 'text', value: 'وثيقة المشروع.pdf', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'آخر تعديل: ', style: 'subdued' },
                    { type: 'text', value: 'محمد علي', style: 'bold' },
                    { type: 'text', value: ' | ', style: 'subdued' },
                    { type: 'text', value: 'قسم الإدارة', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'هذه الوثيقة تحتوي على تفاصيل المشروع وخطة العمل المقترحة للربع القادم.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'منذ 5 ساعات', style: 'timestamp' },
                    { type: 'icon', value: 'edit', color: '#666' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=مح', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canClick,
                    canEdit,
                    canDelete: true
                }
            },
            'rtl-message-ar': {
                uid: 'rtl-message-ar-1',
                id: 'rtl-message-ar-1',
                item_type: 'row',
                item_size: 'l',
                primaryContent: [
                    { type: 'text', value: 'رسالة جديدة', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'من: ', style: 'subdued' },
                    { type: 'text', value: 'فاطمة خالد', style: 'bold' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'شكراً لك على رسالتك. سأراجع الوثائق وأعود إليك قريباً.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'الآن', style: 'timestamp' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'mail', color: '#0078d4' }
                ],
                itemActionsSettings: {
                    canClick,
                    canSelect: true
                }
            }
        };
        
        // Example configs (component configs for each example)
        const exampleConfigs = {
            'default': {},
            'ltr-email': { direction: 'ltr' },
            'ltr-chat': { direction: 'ltr' },
            'ltr-dashboard': { direction: 'ltr' },
            'ltr-notification': { direction: 'ltr' },
            'ltr-file-item': { direction: 'ltr' },
            'rtl-email-ar': { direction: 'rtl' },
            'rtl-chat-ar': { direction: 'rtl' },
            'rtl-news-ar': { direction: 'rtl' },
            'rtl-document-ar': { direction: 'rtl' },
            'rtl-message-ar': { direction: 'rtl' },
            'whatsapp-chat': { direction: 'ltr' }
        };
        
        let currentItemInstance = null;
        const exampleSelector = document.getElementById('example-selector');
        
        // Tab switching functionality
        editorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Update tabs
                editorTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update panels
                editorPanels.forEach(p => {
                    const panelTab = p.getAttribute('data-panel');
                    if (panelTab === targetTab) {
                        p.classList.add('active');
                    } else {
                        p.classList.remove('active');
                    }
                });
            });
        });
        
        // Function to load example into editor
        function loadExample(exampleKey) {
            if (exampleKey === 'custom') {
                return; // Don't change custom JSON
            }
            
            const example = examples[exampleKey];
            const exampleConfig = exampleConfigs[exampleKey] || {};
            
            if (example) {
                jsonEditorData.value = JSON.stringify(example, null, 2);
                jsonEditorConfig.value = JSON.stringify(exampleConfig, null, 2);
                errorMessage.style.display = 'none';
                jsonEditorData.classList.remove('error');
                jsonEditorConfig.classList.remove('error');
                
                // Auto-update if not custom
                if (exampleKey !== 'custom') {
                    setTimeout(() => updateComponent(), 100);
                }
                
                if (xwConsole) {
                    xwConsole.info(`Loaded example: ${exampleKey}`, 'Sandbox');
                }
            }
        }
        
        // Initialize editor with default config
        jsonEditorData.value = JSON.stringify(examples.default, null, 2);
        jsonEditorConfig.value = JSON.stringify({}, null, 2);
        
        // Update component function
        function updateComponent() {
            try {
                // Clear error message
                errorMessage.style.display = 'none';
                jsonEditorData.classList.remove('error');
                jsonEditorConfig.classList.remove('error');
                
                // Parse data JSON
                const dataText = jsonEditorData.value.trim();
                if (!dataText) {
                    throw new Error('Component data JSON cannot be empty');
                }
                
                const data = JSON.parse(dataText);
                
                // Validate required fields
                if (!data.uid || !data.id || !data.primaryContent) {
                    throw new Error('Missing required fields in data, or primaryContent');
                }
                
                // Parse config JSON (optional)
                let compConfig = {};
                const configText = jsonEditorConfig.value.trim();
                if (configText) {
                    try {
                        compConfig = JSON.parse(configText);
                    } catch (e) {
                        throw new Error(`Invalid component config JSON: ${e.message}`);
                    }
                }
                
                // Merge with default handlers
                compConfig = {
                    ...compConfig,
                    console,
                    onItemClick: (item, event) => {
                        tester.setStatus(`✅ Item clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.info(`Item clicked: ${item.id}`, 'Sandbox');
                        }
                    },
                    onItemRightClick: (item, event) => {
                        tester.setStatus(`✅ Item right-clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.warn(`Item right-clicked: ${item.id}`, 'Sandbox');
                        }
                    },
                    onItemAction: (action, item, event) => {
                        tester.setStatus(`✅ Action: ${action} on ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.log(`Action: ${action} on ${item.id}`, 'log', 'Sandbox');
                        }
                    }
                };
                
                // Clear previous instance
                if (currentItemInstance) {
                    previewContainer.innerHTML = '';
                    currentItemInstance = null;
                }
                
                // Remove empty class
                previewContainer.classList.remove('empty');
                
                // Create new instance
                currentItemInstance = new XWUIItem(
                    previewContainer,
                    data,
                    compConfig,
                    conf_sys,
                    conf_usr
                );
                
                tester.setStatus('✅ Component updated successfully', 'success');
                
                if (xwConsole) {
                    xwConsole.info('Component updated', 'Sandbox');
                }
                
            } catch (error) {
                // Show error
                errorMessage.textContent = `Error: ${error.message}`;
                errorMessage.style.display = 'block';
                
                // Determine which editor has the error
                try {
                    JSON.parse(jsonEditorData.value.trim());
                } catch (e) {
                    jsonEditorData.classList.add('error');
                }
                
                try {
                    if (jsonEditorConfig.value.trim()) {
                        JSON.parse(jsonEditorConfig.value.trim());
                    }
                } catch (e) {
                    jsonEditorConfig.classList.add('error');
                }
                
                tester.setStatus(`❌ Error: ${error.message}`, 'error');
                
                if (xwConsole) {
                    xwConsole.error(`JSON Error: ${error.message}`, 'Sandbox');
                }
                
                // Show empty state
                previewContainer.classList.add('empty');
                previewContainer.innerHTML = '<div>Error: Invalid JSON. Check the editor for details.</div>';
            }
        }
        
        // Format JSON function
        function formatJSON() {
            const activePanel = document.querySelector('.editor-panel.active');
            const activeEditor = activePanel?.querySelector('.json-editor');
            
            if (!activeEditor) return;
            
            try {
                const jsonText = activeEditor.value.trim();
                if (!jsonText) {
                    return;
                }
                
                const config = JSON.parse(jsonText);
                activeEditor.value = JSON.stringify(config, null, 2);
                
                errorMessage.style.display = 'none';
                activeEditor.classList.remove('error');
                
                if (xwConsole) {
                    xwConsole.info('JSON formatted', 'Sandbox');
                }
            } catch (error) {
                errorMessage.textContent = `Cannot format: ${error.message}`;
                errorMessage.style.display = 'block';
                activeEditor.classList.add('error');
            }
        }
        
        // Reset to default
        function resetToDefault() {
            exampleSelector.value = 'default';
            loadExample('default');
            
            if (xwConsole) {
                xwConsole.info('Reset to default configuration', 'Sandbox');
            }
        }
        
        // Event listeners
        exampleSelector.addEventListener('change', (e) => {
            loadExample(e.target.value);
        });
        
        btnUpdate.addEventListener('click', updateComponent);
        btnReset.addEventListener('click', resetToDefault);
        btnFormat.addEventListener('click', formatJSON);
        
        // Auto-update on Ctrl+Enter or Cmd+Enter (for both editors)
        [jsonEditorData, jsonEditorConfig].forEach(editor => {
            if (editor) {
                editor.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                updateComponent();
                    }
                });
            }
        });
        
        // Initial render (wait for configs to load)
        setTimeout(() => {
        updateComponent();
        
        if (xwConsole) {
                xwConsole.info('Sandbox initialized. Select an example from dropdown or edit JSON and click "Update Component" or press Ctrl+Enter', 'Sandbox');
        }
        }, 500);
