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
            title: 'XWUIItem Component Tester',
            desc: 'This page tests the XWUIItem component (single item) in isolation. Expected: Various item types and sizes should render correctly.',
            componentName: 'XWUIItem'
        }, {});
        
        const testArea = tester.getTestArea();
        const statusEl = tester.getStatusElement();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiitem-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
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
        
        // Load configurations
        let conf_sys, conf_usr;
        
        async function init() {
            try {
                // Load system and user configs
                conf_sys = await XWUIItem.loadSystemConfig();
                conf_usr = await XWUIItem.loadUserConfig();
                
                if (xwConsole) {
                    if (conf_sys) {
                        xwConsole.info('System config loaded', 'TesterXWUIItem');
                    }
                    if (conf_usr) {
                        xwConsole.info('User config loaded', 'TesterXWUIItem');
                    }
                }
            } catch (error) {
                console.warn('Could not load configs:', error);
            }
            
            try {
            // Example 1: Simple
            const simpleConfig = {
                uid: 'simple-1',
                id: 'simple-1',
                item_type: 'row',
                item_size: 's',
                status: 'before_start', // Yellow background
                primaryContent: [
                    { type: 'text', value: 'Simple Item', style: 'bold' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'user' }
                ],
                itemActionsSettings: {
                    canClick: true
                }
            };
            
            const jsonSimple = document.getElementById('json-simple');
            const simpleContainer = document.getElementById('render-simple');
            
            if (!jsonSimple || !simpleContainer) {
                throw new Error('Container elements not found');
            }
            
            jsonSimple.textContent = JSON.stringify(simpleConfig, null, 2);
            
            const simpleItem = new XWUIItem(
                simpleContainer,
                simpleConfig,
                {
                    console,
                    onItemClick: (item, event) => {
                        tester.setStatus(`✅ Simple item clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.info(`Item clicked: ${item.id}`, 'TesterXWUIItem');
                        }
                    }
                },
                conf_sys,
                conf_usr
            );
            
            console.log('Simple item created:', simpleItem);
            
            // Example 2: Medium
            const mediumConfig = {
                uid: 'medium-1',
                id: 'medium-1',
                item_type: 'row',
                item_size: 'm',
                status: 'processing', // Blue background
                primaryContent: [
                    { type: 'text', value: 'Medium Item', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'Secondary content description', style: 'subdued' }
                ],
                avatarContent: [
                    { type: 'icon', value: 'folder', color: '#0078d4' }
                ],
                primaryContent_other: [
                    { type: 'text', value: '2:30 PM', style: 'timestamp' }
                ],
                itemActionsSettings: {
                    canClick,
                    canDelete,
                    canEdit,
                    canDrag: true
                },
                itemStates: {
                    isSelected: false
                }
            };
            
            const jsonMedium = document.getElementById('json-medium');
            const mediumContainer = document.getElementById('render-medium');
            
            if (!jsonMedium || !mediumContainer) {
                throw new Error('Medium container elements not found');
            }
            
            jsonMedium.textContent = JSON.stringify(mediumConfig, null, 2);
            
            const mediumItem = new XWUIItem(
                mediumContainer,
                mediumConfig,
                {
                    console,
                    onItemClick: (item, event) => {
                        tester.setStatus(`✅ Medium item clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.info(`Item clicked: ${item.id}`, 'TesterXWUIItem');
                        }
                    },
                    onItemRightClick: (item, event) => {
                        tester.setStatus(`✅ Medium item right-clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.warn(`Item right-clicked: ${item.id}`, 'TesterXWUIItem');
                        }
                    }
                },
                conf_sys,
                conf_usr
            );
            
            console.log('Medium item created:', mediumItem);
            
            // Example 3: Complex
            const complexConfig = {
                uid: 'complex-1',
                id: 'complex-1',
                item_type: 'row',
                item_size: 'xl',
                status: 'error', // Red background (status overrides background_color)
                primaryContent: [
                    { type: 'text', value: 'Complex Item with Multiple Content Sections', style: 'bold' }
                ],
                secondaryContent: [
                    { type: 'text', value: 'John Doe', style: 'bold' },
                    { type: 'text', value: ' • ', style: 'subdued' },
                    { type: 'text', value: 'Marketing Team', style: 'subdued' }
                ],
                tertiaryContent: [
                    { type: 'text', value: 'This is a complex item with multiple content sections including primary, secondary, and tertiary content areas.' }
                ],
                primaryContent_other: [
                    { type: 'text', value: 'Yesterday', style: 'timestamp' },
                    { type: 'icon', value: 'star', color: '#ffc107' }
                ],
                secondaryContent_other: [
                    { type: 'icon', value: 'mail', color: '#0078d4' },
                    { type: 'text', value: '3', style: 'subdued' }
                ],
                avatarContent: [
                    { type: 'image', value: 'https://placehold.co/40x40/0078d4/white?text=JD', shape: 'circle' }
                ],
                itemActionsSettings: {
                    canSelect,
                    canDelete,
                    canEdit,
                    canArchive,
                    canFav,
                    canMoreOptions,
                    canRightClick,
                    canDrag,
                    canSelectText: true
                },
                itemStates: {
                    isSelected,
                    isFavorite,
                    isArchived: false
                }
            };
            
            const jsonComplex = document.getElementById('json-complex');
            const complexContainer = document.getElementById('render-complex');
            
            if (!jsonComplex || !complexContainer) {
                throw new Error('Complex container elements not found');
            }
            
            jsonComplex.textContent = JSON.stringify(complexConfig, null, 2);
            
            const complexItem = new XWUIItem(
                complexContainer,
                complexConfig,
                {
                    console,
                    onItemClick: (item, event) => {
                        tester.setStatus(`✅ Complex item clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.info(`Item clicked: ${item.id}`, 'TesterXWUIItem');
                        }
                    },
                    onItemRightClick: (item, event) => {
                        tester.setStatus(`✅ Complex item right-clicked: ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.warn(`Item right-clicked: ${item.id}`, 'TesterXWUIItem');
                        }
                    },
                    onItemAction: (action, item, event) => {
                        tester.setStatus(`✅ Action triggered: ${action} on ${item.id}`, 'success');
                        if (xwConsole) {
                            xwConsole.log(`Action: ${action} on ${item.id}`, 'log', 'TesterXWUIItem');
                        }
                    }
                },
                conf_sys,
                conf_usr
            );
            
            console.log('Complex item created:', complexItem);
            
            // Check if items were rendered
            setTimeout(() => {
                const simpleHtml = simpleContainer.innerHTML;
                const mediumHtml = mediumContainer.innerHTML;
                const complexHtml = complexContainer.innerHTML;
                
                console.log('All containers HTML length:', {
                    simple: simpleHtml.length,
                    medium: mediumHtml.length,
                    complex: complexHtml.length
                });
                
                console.log('Simple container HTML:', simpleHtml.substring(0, 200));
                console.log('Medium container HTML:', mediumHtml.substring(0, 200));
                console.log('Complex container HTML:', complexHtml.substring(0, 200));
                
                if (simpleHtml.length === 0 || mediumHtml.length === 0 || complexHtml.length === 0) {
                    tester.setStatus('⚠️ Warning: Some items may not have rendered. Check console for details.', 'error');
                } else {
                    tester.setStatus('✅ XWUIItem component initialized successfully All 3 examples rendered.', 'success');
                    if (xwConsole) {
                        xwConsole.info('All XWUIItem examples rendered successfully', 'TesterXWUIItem');
                    }
                }
            }, 100);
            
            // Test error logging with an invalid item
            if (xwConsole) {
                setTimeout(() => {
                    try {
                        const invalidContainer = document.createElement('div');
                        const invalidItem = new XWUIItem(
                            invalidContainer,
                            {
                                uid: '', // Invalid: empty uid
                                id: 'invalid-test',
                                primaryContent: [{ type: 'text', value: 'Test' }]
                            },
                            { console: xwConsole },
                            conf_sys,
                            conf_usr
                        );
                    } catch (error) {
                        // Error should be logged to console
                    }
                }, 2000);
            }
            
            } catch (error) {
                tester.setStatus(`❌ Error: ${error.message}`, 'error');
                console.error('XWUIItem test error:', error);
                console.error('Error stack:', error.stack);
                if (xwConsole) {
                    xwConsole.error(`Error: ${error.message}`, 'TesterXWUIItem');
                }
            }
        }
        
        // Initialize
        init();
