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
            title: 'Email Viewer',
            desc: 'Outlook-style email list using XWUIItem components',
            componentName: 'XWUIItem'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area with custom layout
        const template = document.getElementById('tester-xwuiitem-email-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const emailListContainer = document.getElementById('email-list');
        const consoleContainer = document.getElementById('xwui-console');
        
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
        
        try {
            if (!emailListContainer) {
                throw new Error('Email list container not found');
            }
            
            // Email data matching the Outlook interface
            const emails = [
                {
                    uid: 'email-1',
                    id: 'email-1',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [
                        { type: 'text', value: 'ML | AFC U23 Asian Cup | January 2026', style: 'bold' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Tiago Soromenho', style: 'bold' },
                        { type: 'text', value: ' • ', style: 'subdued' },
                        { type: 'text', value: 'Commercial', style: 'subdued' }
                    ],
                    tertiaryContent: [
                        { type: 'text', value: 'Hi, For the moment @Leandro Campos will support this project. Kind regards,' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue 10:54 PM', style: 'timestamp' },
                        { type: 'icon', value: 'star', color: '#ffc107' }, // Flag icon
                        { type: 'icon', value: 'trash', color: '#666' }
                    ],
                    secondaryContent_other: [
                        { type: 'icon', value: 'mail', color: '#0078d4' }, // Unread indicator
                        { type: 'icon', value: 'file', color: '#666' }, // Attachment indicator
                        { type: 'text', value: '2', style: 'subdued' } // Attachment count
                    ],
                    avatarContent: [
                        { type: 'icon', value: 'user', color: '#0078d4' }
                    ],
                    itemActionsSettings: {
                        canClick,
                        canDelete,
                        canSelect,
                        canFav,
                        canRightClick: true
                    },
                    itemStates: {
                        isSelected,
                        isFavorite: true
                    }
                },
                {
                    uid: 'email-2',
                    id: 'email-2',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [
                        { type: 'text', value: 'Confirmation - F1H2O GP OF JEDDAH 2025', style: 'bold' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Goncalo Osorio', style: 'bold' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Mohamed E. Elagami', style: 'subdued' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Commercial', style: 'subdued' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Mohammed A. AlOdh...', style: 'subdued' }
                    ],
                    tertiaryContent: [
                        { type: 'text', value: 'Dear Elagami, Me, Oscar and client himself, agrees with us on this matter, ...' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue 8:08 PM', style: 'timestamp' },
                        { type: 'icon', value: 'star', color: '#10b981' } // Thumbs up reaction
                    ],
                    secondaryContent_other: [
                        { type: 'icon', value: 'file', color: '#666' },
                        { type: 'text', value: '11', style: 'subdued' } // Multiple attachments
                    ],
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=GO', shape: 'circle' }
                    ],
                    itemActionsSettings: {
                        canClick,
                        canDelete,
                        canSelect,
                        canRightClick: true
                    },
                    itemStates: {
                        isSelected: false
                    }
                },
                {
                    uid: 'email-3',
                    id: 'email-3',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [
                        { type: 'text', value: 'João Nobre - Technical Producer - New hire - Contract review', style: 'bold' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Tiago Soromenho', style: 'bold' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Mohamed A. Sharaka', style: 'subdued' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Joao Nobre', style: 'subdued' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Paul Quinn', style: 'subdued' }
                    ],
                    tertiaryContent: [
                        { type: 'text', value: 'Thanks. Kind regards, Tiago Soromenho T +966 55 103 4893 t.soromenho@ala...' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue 6:56 PM', style: 'timestamp' }
                    ],
                    secondaryContent_other: [
                        { type: 'icon', value: 'file', color: '#666' },
                        { type: 'text', value: '2', style: 'subdued' }
                    ],
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/10b981/white?text=TS', shape: 'circle' }
                    ],
                    itemActionsSettings: {
                        canClick,
                        canDelete,
                        canSelect,
                        canRightClick: true
                    },
                    itemStates: {
                        isSelected: false
                    }
                },
                {
                    uid: 'email-4',
                    id: 'email-4',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [
                        { type: 'text', value: 'اجازة محمد جميل 10026', style: 'bold' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Mohamed A. Sharaka', style: 'bold' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Muhammad J. Abdulmajeed', style: 'subdued' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Atheer A. AlObaid', style: 'subdued' },
                        { type: 'text', value: '; ', style: 'subdued' },
                        { type: 'text', value: 'Hai...', style: 'subdued' }
                    ],
                    tertiaryContent: [
                        { type: 'text', value: 'No preview is available.', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue 5:59 PM', style: 'timestamp' }
                    ],
                    secondaryContent_other: [
                        { type: 'icon', value: 'file', color: '#666' },
                        { type: 'text', value: '14', style: 'subdued' } // Many attachments
                    ],
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/8b5cf6/white?text=MS', shape: 'circle' }
                    ],
                    itemActionsSettings: {
                        canClick,
                        canDelete,
                        canSelect,
                        canRightClick: true
                    },
                    itemStates: {
                        isSelected: false
                    }
                },
                {
                    uid: 'email-5',
                    id: 'email-5',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [
                        { type: 'text', value: 'IT Department', style: 'bold' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Hessah B. AlMuways', style: 'bold' }
                    ],
                    tertiaryContent: [
                        { type: 'text', value: 'No preview is available', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue 4:50 PM', style: 'timestamp' },
                        { type: 'icon', value: 'trash', color: '#666' }
                    ],
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/ec4899/white?text=HA', shape: 'circle' }
                    ],
                    itemActionsSettings: {
                        canClick,
                        canDelete,
                        canSelect,
                        canRightClick: true
                    },
                    itemStates: {
                        isSelected: false
                    }
                }
            ];
            
            // Create email items
            emails.forEach((emailConfig, index) => {
                const emailWrapper = document.createElement('div');
                emailWrapper.className = 'email-item-wrapper xwui-item-list-item';
                emailListContainer.appendChild(emailWrapper);
                
                const emailItem = new XWUIItem(emailWrapper, {
                    item,
                    console,
                    onItemClick: (item, event) => {
                        tester.setStatus(`✅ Email clicked: ${item.id} - ${emailConfig.primaryContent[0].value}`, 'success');
                        if (xwConsole) {
                            xwConsole.info(`Email opened: ${item.id}`, 'TesterXWUIItemEmail');
                        }
                    },
                    onItemRightClick: (item, event) => {
                        if (xwConsole) {
                            xwConsole.warn(`Email right-clicked: ${item.id}`, 'TesterXWUIItemEmail');
                        }
                    },
                    onItemAction: (action, item, event) => {
                        tester.setStatus(`✅ Action: ${action} on email ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.log(`Action: ${action} on ${item.id}`, 'log', 'TesterXWUIItemEmail');
                        }
                    }
                });
            });
            
            // Check if items were rendered
            setTimeout(() => {
                const emailItems = emailListContainer.querySelectorAll('.email-item-wrapper');
                if (emailItems.length === 0) {
                    tester.setStatus('⚠️ Warning: Email items may not have rendered. Check console for details.', 'error');
                } else {
                    tester.setStatus(`✅ Email viewer initialized successfully ${emails.length} emails loaded.`, 'success');
                    if (xwConsole) {
                        xwConsole.info(`Email viewer initialized with ${emails.length} emails`, 'TesterXWUIItemEmail');
                    }
                }
            }, 100);
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Email viewer test error:', error);
            console.error('Error stack:', error.stack);
            if (xwConsole) {
                xwConsole.error(`Error: ${error.message}`, 'TesterXWUIItemEmail');
            }
        }
