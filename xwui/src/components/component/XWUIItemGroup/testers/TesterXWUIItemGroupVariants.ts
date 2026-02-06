import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIItemGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIItemGroup } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIItemGroup Variants Tester',
            desc: 'This page reuses the same XWUIItemGroup component with different JSON configurations. Use the dropdown to switch between sidebar-style presets (Productivity Hub, File System, GPT Discussions, Telegram Chats, Outlook Emails).',
            componentName: 'XWUIItemGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        const controlsElement = tester.getControlsElement();
        
        // Add controls to controls area
        controlsElement.innerHTML = `
            <div class="controls-row">
                <label for="variantSelect">Variant:</label>
                <select id="variantSelect">
                    <option value="Productivity Hub">Productivity Hub</option>
                    <option value="File System">File System</option>
                    <option value="GPT Discussions">GPT Discussions</option>
                    <option value="Telegram Chats">Telegram Chats</option>
                    <option value="Outlook Emails">Outlook Emails</option>
                </select>
            </div>
        `;
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiitem-group-variants-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }

        const container = document.getElementById('group-container');
        const variantSelect = document.getElementById('variantSelect');

        /**
         * Variants: each entry is an array of ItemConfig objects (same shape used by XWUIItemGroup/XWUIItem).
         * These are adapted from the Sidebar V3 JSON examples (Productivity Hub, File System, etc.).
         */
        const variants = {
            'Productivity Hub': [
                {
                    uid: 'ph-logo',
                    id: 'ph-logo',
                    item_type: 'row',
                    item_size: 'l',
                    primaryContent: [{ type: 'text', value: 'Productivity Hub', style: 'bold' }],
                    avatarContent: [{ type: 'icon', value: 'shield' }],
                    itemActionsSettings: { canClick: false },
                    showWhenCollapsed: true
                },
                {
                    uid: 'ph-featured-task',
                    id: 'ph-featured-task',
                    item_type: 'row',
                    item_size: 'xl',
                    status: 'processing',
                    avatarContent: [{ type: 'icon', value: 'file' }],
                    primaryContent: [{ type: 'text', value: 'Design new marketing campaign', style: 'bold' }],
                    secondaryContent: [{ type: 'text', value: 'Marketing Team', style: 'subdued' }],
                    primaryContent_other: [
                        { type: 'text', value: 'Due Today', style: 'timestamp' }
                    ],
                    itemActionsSettings: {
                        canSelect,
                        canDelete,
                        canArchive,
                        canFav,
                        canMoreOptions,
                        canRightClick,
                        canDrag: true
                    },
                    itemStates: { isSelected: false }
                },
                {
                    uid: 'ph-projects',
                    id: 'ph-projects',
                    item_type: 'row',
                    item_size: 'm',
                    avatarContent: [{ type: 'icon', value: 'folder' }],
                    primaryContent: [{ type: 'text', value: 'Projects', style: 'bold' }],
                    secondaryContent: [{ type: 'text', value: '3 active', style: 'secondary' }],
                    itemStates: { isExpanded: true },
                    itemActionsSettings: { canClick, canAdd, canDrag: true },
                    group_list: [
                        {
                            uid: 'ph-project-phoenix',
                            id: 'ph-project-phoenix',
                            item_type: 'row',
                            item_size: 's',
                            avatarContent: [{ type: 'icon', value: 'file' }],
                            primaryContent: [{ type: 'text', value: 'Project Phoenix' }],
                            itemActionsSettings: { canClick, canDrag: true }
                        },
                        {
                            uid: 'ph-project-mobile',
                            id: 'ph-project-mobile',
                            item_type: 'row',
                            item_size: 's',
                            avatarContent: [{ type: 'icon', value: 'file' }],
                            primaryContent: [{ type: 'text', value: 'Mobile App Redesign' }],
                            itemActionsSettings: { canClick, canDrag: true }
                        },
                        {
                            uid: 'ph-project-api',
                            id: 'ph-project-api',
                            item_type: 'row',
                            item_size: 's',
                            avatarContent: [{ type: 'icon', value: 'file' }],
                            primaryContent: [{ type: 'text', value: 'API Integration' }],
                            itemActionsSettings: { canClick, canDrag: true }
                        }
                    ]
                },
                {
                    uid: 'ph-quick-access',
                    id: 'ph-quick-access',
                    item_type: 'row',
                    item_size: 'm',
                    avatarContent: [{ type: 'icon', value: 'star' }],
                    primaryContent: [{ type: 'text', value: 'Quick Access', style: 'bold' }],
                    secondaryContent: [{ type: 'text', value: 'Pinned items', style: 'secondary' }],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick, canFav, canDelete, canEdit: true }
                }
            ],
            'File System': [
                {
                    uid: 'fs-title',
                    id: 'fs-title',
                    item_type: 'row',
                    item_size: 'm',
                    primaryContent: [{ type: 'text', value: 'File Explorer', style: 'bold' }],
                    avatarContent: [{ type: 'icon', value: 'folder' }],
                    showWhenCollapsed: true
                },
                {
                    uid: 'fs-src',
                    id: 'fs-src',
                    item_type: 'row',
                    item_size: 'm',
                    avatarContent: [{ type: 'icon', value: 'folder' }],
                    primaryContent: [{ type: 'text', value: 'src' }],
                    itemStates: { isExpanded: true },
                    itemActionsSettings: { canClick, canDrag: true },
                    group_list: [
                        {
                            uid: 'fs-src-components',
                            id: 'fs-src-components',
                            item_type: 'row',
                            item_size: 's',
                            avatarContent: [{ type: 'icon', value: 'folder' }],
                            primaryContent: [{ type: 'text', value: 'components' }],
                            itemStates: { isExpanded: true },
                            itemActionsSettings: { canClick, canDrag: true },
                            group_list: [
                                {
                                    uid: 'fs-src-components-sidebar',
                                    id: 'fs-src-components-sidebar',
                                    item_type: 'row',
                                    item_size: 'xs',
                                    avatarContent: [{ type: 'icon', value: 'file' }],
                                    primaryContent: [{ type: 'text', value: 'Sidebar.tsx' }],
                                    itemActionsSettings: { canClick, canDrag: true }
                                }
                            ]
                        },
                        {
                            uid: 'fs-src-hooks',
                            id: 'fs-src-hooks',
                            item_type: 'row',
                            item_size: 's',
                            avatarContent: [{ type: 'icon', value: 'folder' }],
                            primaryContent: [{ type: 'text', value: 'hooks' }],
                            itemActionsSettings: { canClick, canDrag: true }
                        }
                    ]
                },
                {
                    uid: 'fs-public',
                    id: 'fs-public',
                    item_type: 'row',
                    item_size: 's',
                    avatarContent: [{ type: 'icon', value: 'folder' }],
                    primaryContent: [{ type: 'text', value: 'public' }],
                    itemActionsSettings: { canClick, canDrag: true }
                },
                {
                    uid: 'fs-package-json',
                    id: 'fs-package-json',
                    item_type: 'row',
                    item_size: 'xs',
                    avatarContent: [{ type: 'icon', value: 'file' }],
                    primaryContent: [{ type: 'text', value: 'package.json' }],
                    itemActionsSettings: { canClick, canDrag: true }
                }
            ],
            'GPT Discussions': [
                {
                    uid: 'gpt-title',
                    id: 'gpt-title',
                    item_type: 'row',
                    item_size: 'm',
                    primaryContent: [{ type: 'text', value: 'ChatGPT-4', style: 'bold' }],
                    avatarContent: [{ type: 'icon', value: 'shield' }],
                    showWhenCollapsed: true
                },
                {
                    uid: 'gpt-chat-1',
                    id: 'gpt-chat-1',
                    item_type: 'row',
                    item_size: 'l',
                    primaryContent: [{ type: 'text', value: 'React Sidebar Component...' }],
                    secondaryContent: [{ type: 'text', value: 'System Design', style: 'subdued' }],
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'gpt-chat-2',
                    id: 'gpt-chat-2',
                    item_type: 'row',
                    item_size: 'l',
                    primaryContent: [{ type: 'text', value: 'History of the Roman Empire' }],
                    secondaryContent: [{ type: 'text', value: 'Research', style: 'subdued' }],
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'gpt-chat-3',
                    id: 'gpt-chat-3',
                    item_type: 'row',
                    item_size: 'l',
                    primaryContent: [{ type: 'text', value: 'Quantum Computing Explained' }],
                    secondaryContent: [{ type: 'text', value: 'Learning', style: 'subdued' }],
                    itemActionsSettings: { canClick: true }
                }
            ],
            'Telegram Chats': [
                {
                    uid: 'tg-title',
                    id: 'tg-title',
                    item_type: 'row',
                    item_size: 'm',
                    primaryContent: [{ type: 'text', value: 'Telegram', style: 'bold' }],
                    avatarContent: [{ type: 'icon', value: 'mail' }],
                    showWhenCollapsed: true
                },
                {
                    uid: 'tg-archived',
                    id: 'tg-archived',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/9ca3af/white?text=📁', shape: 'circle' }
                    ],
                    primaryContent: [{ type: 'text', value: 'Archived chats' }],
                    secondaryContent: [{ type: 'text', value: '1 new story', style: 'subdued' }],
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-hire',
                    id: 'tg-hire',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/3b82f6/white?text=H', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'icon', value: 'briefcase', color: '#000' },
                        { type: 'text', value: 'hire@muhammadalshehri.com' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'KARIZMA MariaSi: Muhammad AlShehri - Resume 2025-11-COS.pdf', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Sun', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-travel',
                    id: 'tg-travel',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/8b5cf6/white?text=T', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'icon', value: 'airplane', color: '#000' },
                        { type: 'text', value: 'travel@muhammadalshehri.com' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'KARIZMA MariaSi: 6H Flight Reminder ✈️💼 Jeddah (JED) to Riyadh (RUH) 24-N...', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Mon', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-agencies',
                    id: 'tg-agencies',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/10b981/white?text=👤', shape: 'circle' }
                    ],
                    primaryContent: [{ type: 'text', value: 'Agencies-Payments Log' }],
                    secondaryContent: [
                        { type: 'text', value: 'You: 📊📈 Aug-2024 Karizma Points System', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '07-Sep-24', style: 'timestamp' },
                        { type: 'icon', value: 'check', color: '#10b981' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-karina',
                    id: 'tg-karina',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/db2777/white?text=KM', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'text', value: 'Karina Melikian' },
                        { type: 'text', value: '💎' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Just arrived', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-scouts',
                    id: 'tg-scouts',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/3b82f6/white?text=KS', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'text', value: '👑' },
                        { type: 'text', value: 'KARIZMA Scouts' },
                        { type: 'text', value: '🔮' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Riana Vilnyus (...): Была на конкурсе...', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '17-Jul-25', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-recruitment',
                    id: 'tg-recruitment',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/8b5cf6/white?text=KRA', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'text', value: '👑' },
                        { type: 'text', value: 'KARIZMA Recruitment' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'KARIZMA MariaSi: It\'s fixed now', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '12-Nov-25', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-broadcasters',
                    id: 'tg-broadcasters',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/3b82f6/white?text=KB', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'text', value: '👑' },
                        { type: 'text', value: 'KARIZMA Broadcasters' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Karina: Voice message', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '18:28', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-angelina',
                    id: 'tg-angelina',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/f59e0b/white?text=A', shape: 'circle' }
                    ],
                    primaryContent: [{ type: 'text', value: 'Angelina' }],
                    secondaryContent: [
                        { type: 'text', value: 'Voice message', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '18:00', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-mariasi',
                    id: 'tg-mariasi',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/ec4899/white?text=MS', shape: 'circle' }
                    ],
                    primaryContent: [{ type: 'text', value: 'KARIZMA MariaSi' }],
                    secondaryContent: [
                        { type: 'text', value: 'Got it', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '17:45', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-academy',
                    id: 'tg-academy',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/3b82f6/white?text=KA', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'text', value: '👑' },
                        { type: 'text', value: 'KARIZMA Academy' },
                        { type: 'text', value: '👩🏼‍🏫' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Lena: Обмен 250', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '08:49', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-adax',
                    id: 'tg-adax',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/000000/white?text=ADA', shape: 'circle' }
                    ],
                    primaryContent: [{ type: 'text', value: 'ADA×Exonware Design' }],
                    secondaryContent: [
                        { type: 'text', value: 'Lena: 🌙 хорошо, спасибо 🙌🏻', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: 'Tue', style: 'timestamp' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-nikita',
                    id: 'tg-nikita',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/8b5cf6/white?text=NH', shape: 'circle' }
                    ],
                    primaryContent: [
                        { type: 'text', value: 'Nikita Kodis Juli Husband' },
                        { type: 'icon', value: 'star', color: '#3b82f6' }
                    ],
                    secondaryContent: [
                        { type: 'text', value: 'Thank you, Nikita. Wishing you and your family all the best as well. 🎉', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '19-Nov-25', style: 'timestamp' },
                        { type: 'icon', value: 'check', color: '#10b981' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'tg-darya',
                    id: 'tg-darya',
                    item_type: 'row',
                    item_size: 'xl',
                    avatarContent: [
                        { type: 'image', value: 'https://placehold.co/40x40/a855f7/white?text=ДВ', shape: 'circle' }
                    ],
                    primaryContent: [{ type: 'text', value: 'Дарья Волкова' }],
                    secondaryContent: [
                        { type: 'text', value: 'Voice message', style: 'subdued' }
                    ],
                    primaryContent_other: [
                        { type: 'text', value: '18-Nov-25', style: 'timestamp' },
                        { type: 'icon', value: 'check', color: '#10b981' }
                    ],
                    itemStates: { isFavorite: true },
                    itemActionsSettings: { canClick: true }
                }
            ],
            'Outlook Emails': [
                {
                    uid: 'outlook-title',
                    id: 'outlook-title',
                    item_type: 'row',
                    item_size: 'm',
                    primaryContent: [{ type: 'text', value: 'Outlook', style: 'bold' }],
                    avatarContent: [{ type: 'icon', value: 'mail' }],
                    showWhenCollapsed: true
                },
                {
                    uid: 'email-1',
                    id: 'email-1',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [{ type: 'text', value: 'Project Update', style: 'bold' }],
                    secondaryContent: [{ type: 'text', value: 'Jane Doe', style: 'bold' }],
                    tertiaryContent: [{ type: 'text', value: 'Here is the latest update on the project...' }],
                    primaryContent_other: [{ type: 'text', value: '10:42 AM', style: 'timestamp' }],
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'email-2',
                    id: 'email-2',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [{ type: 'text', value: 'Weekly Sync', style: 'bold' }],
                    secondaryContent: [{ type: 'text', value: 'Ben', style: 'bold' }],
                    tertiaryContent: [{ type: 'text', value: 'Just a reminder about our meeting...' }],
                    primaryContent_other: [{ type: 'text', value: '9:15 AM', style: 'timestamp' }],
                    itemActionsSettings: { canClick: true }
                },
                {
                    uid: 'email-3',
                    id: 'email-3',
                    item_type: 'row',
                    item_size: 'xl',
                    primaryContent: [{ type: 'text', value: 'Re: Q3 Financials', style: 'bold' }],
                    secondaryContent: [{ type: 'text', value: 'Chloe', style: 'bold' }],
                    tertiaryContent: [{ type: 'text', value: 'Thanks for sending this over.' }],
                    primaryContent_other: [{ type: 'text', value: 'Yesterday', style: 'timestamp' }],
                    itemActionsSettings: { canClick: true }
                }
            ]
        };

        let groupInstance = null;

        function renderVariant(variantKey) {
            const items = variants[variantKey];
            if (!items || !container) return;

            container.innerHTML = '';

            try {
                groupInstance = new XWUIItemGroup(container, {
                    items,
                    allow_v_scroll,
                    onItemClick: (item, event) => {
                        tester.setStatus(`✅ Item clicked: ${item.id}`, 'success');
                        console.log('Item clicked', item);
                    },
                    onItemAction: (action, item, event) => {
                        console.log('Item action', action, item);
                        if (action === 'toggle_expand') {
                            tester.setStatus(`✅ Toggled expand for: ${item.id}`, 'success');
                        }
                    }
                });

                tester.setStatus(`✅ Loaded variant "${variantKey}" with ${items.length} top-level items.`, 'success');
            } catch (error) {
                console.error('XWUIItemGroupVariants error:', error);
                tester.setStatus(`❌ Error: ${error.message}`, 'error');
            }
        }

        if (variantSelect) {
            variantSelect.addEventListener('change', (event) => {
                const key = event.target.value;
                renderVariant(key);
            });
        }

        // Initial render
        renderVariant('Productivity Hub');
