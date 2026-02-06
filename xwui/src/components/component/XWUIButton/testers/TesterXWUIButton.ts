
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIButton } from '../index.ts';
        import { XWUIConsole } from '../../XWUIConsole/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIButton/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIButton Component Tester',
            desc: 'This page tests the XWUIButton component with various styles, sizes, and states. Expected, and states.',
            componentName: 'XWUIButton'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuibutton-content');
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
                showTimestamp: true,
                showSource: true,
                autoScroll: true
            });
        }
        
        try {
            // Variants
            const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'];
            variants.forEach(variant => {
                const container = document.getElementById(`btn-${variant}`);
                if (container) {
                    const btn = new XWUIButton(container, `${variant.charAt(0).toUpperCase() + variant.slice(1)}`, {
                        variant: variant
                    });
                    btn.onClick(() => {
                        tester.setStatus(`✅ ${variant} button clicked`, 'success');
                        if (xwConsole) {
                            xwConsole.info(`${variant} button clicked`, 'TesterXWUIButton');
                        }
                    });
                }
            });
            
            // Sizes
            const sizes = [
                { size: 'small', label: 'Small' },
                { size: 'medium', label: 'Medium' },
                { size: 'large', label: 'Large' }
            ];
            sizes.forEach(({ size, label }) => {
                const container = document.getElementById(`btn-${size}`);
                if (container) {
                    const btn = new XWUIButton(container, label, { size: size });
                    btn.onClick(() => {
                        tester.setStatus(`✅ ${label} button clicked`, 'success');
                    });
                }
            });
            
            // Icons
            const iconSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            
            const iconLeftContainer = document.getElementById('btn-icon-left');
            if (iconLeftContainer) {
                const btn = new XWUIButton(iconLeftContainer, 'Icon Left', {
                    icon: iconSVG,
                    iconPosition: 'left'
                });
                btn.onClick(() => {
                    tester.setStatus('✅ Icon left button clicked', 'success');
                });
            }
            
            const iconRightContainer = document.getElementById('btn-icon-right');
            if (iconRightContainer) {
                const btn = new XWUIButton(iconRightContainer, 'Icon Right', {
                    icon: iconSVG,
                    iconPosition: 'right'
                });
                btn.onClick(() => {
                    tester.setStatus('✅ Icon right button clicked', 'success');
                });
            }
            
            const iconOnlyContainer = document.getElementById('btn-icon-only');
            if (iconOnlyContainer) {
                const btn = new XWUIButton(iconOnlyContainer, '', {
                    icon: iconSVG,
                    variant: 'primary'
                });
                btn.onClick(() => {
                    tester.setStatus('✅ Icon only button clicked', 'success');
                });
            }
            
            // Icon Only Buttons - Variants
            const iconOnlyVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost'];
            iconOnlyVariants.forEach(variant => {
                const container = document.getElementById(`btn-icon-only-${variant}`);
                if (container) {
                    const btn = new XWUIButton(container, '', {
                        icon: iconSVG,
                        variant: variant
                    });
                    btn.onClick(() => {
                        tester.setStatus(`✅ Icon only ${variant} button clicked`, 'success');
                    });
                }
            });
            
            // Icon Only Buttons - Sizes
            const iconOnlySizes = [
                { size: 'small', label: 'Small' },
                { size: 'medium', label: 'Medium' },
                { size: 'large', label: 'Large' }
            ];
            iconOnlySizes.forEach(({ size, label }) => {
                const container = document.getElementById(`btn-icon-only-${size}`);
                if (container) {
                    const btn = new XWUIButton(container, '', {
                        icon: iconSVG,
                        variant: 'primary',
                        size: size
                    });
                    btn.onClick(() => {
                        tester.setStatus(`✅ Icon only ${label} button clicked`, 'success');
                    });
                }
            });
            
            // States
            const disabledContainer = document.getElementById('btn-disabled');
            if (disabledContainer) {
                const btn = new XWUIButton(disabledContainer, 'Disabled', {
                    disabled: true
                });
            }
            
            const loadingContainer = document.getElementById('btn-loading');
            if (loadingContainer) {
                const btn = new XWUIButton(loadingContainer, 'Loading', {
                    loading: true
                });
            }
            
            // Full Width
            const fullWidthContainer = document.getElementById('btn-full-width');
            if (fullWidthContainer) {
                const btn = new XWUIButton(fullWidthContainer, 'Full Width Button', {
                    fullWidth: true,
                    variant: 'primary'
                });
                btn.onClick(() => {
                    tester.setStatus('✅ Full width button clicked', 'success');
                });
            }
            
            // JSON Config Example - Using ItemConfig directly
            const jsonContainer = document.getElementById('btn-json');
            if (jsonContainer) {
                // Example 1: Using XWUIButtonConfig (traditional)
                const btnConfig = {
                    variant: 'success',
                    size: 'large',
                    icon: iconSVG,
                    iconPosition: 'left'
                };
                const btn = new XWUIButton(jsonContainer, 'JSON Config Button', btnConfig);
                btn.onClick(() => {
                    tester.setStatus('✅ JSON config button clicked', 'success');
                    if (xwConsole) {
                        xwConsole.info('Button config: ' + JSON.stringify(btnConfig, null, 2), 'TesterXWUIButton');
                    }
                });
                
                // Example 2: Using ItemConfig directly (after 2 seconds)
                setTimeout(() => {
                    const itemConfig = {
                        uid: 'btn-json-item',
                        id: 'btn-json-item',
                        item_type: 'row',
                        item_size: 'l',
                        status: 'processing',
                        primaryContent: [
                            { type: 'icon', value: 'star' },
                            { type: 'text', value: 'ItemConfig Button', style: 'bold' }
                        ],
                        itemActionsSettings: {
                            canClick: true
                        },
                        itemStates: {
                            isSelected: false
                        }
                    };
                    
                    btn.updateFromItemConfig(itemConfig);
                    if (xwConsole) {
                        xwConsole.info('Updated button with ItemConfig: ' + JSON.stringify(itemConfig, null, 2), 'TesterXWUIButton');
                    }
                }, 2000);
            }
            
            // Check if buttons were rendered
            setTimeout(() => {
                const buttons = document.querySelectorAll('.button-wrapper');
                let renderedCount = 0;
                buttons.forEach(wrapper => {
                    if (wrapper.querySelector('button') || wrapper.querySelector('.xwui-item')) {
                        renderedCount++;
                    }
                });
                
                if (renderedCount === 0) {
                    tester.setStatus('⚠️ Warning: Buttons may not have rendered. Check console for details.', 'error');
                } else {
                    tester.setStatus(`✅ XWUIButton component initialized successfully ${renderedCount} buttons rendered.`, 'success');
                    if (xwConsole) {
                        xwConsole.info(`XWUIButton tester initialized with ${renderedCount} buttons`, 'TesterXWUIButton');
                    }
                }
            }, 100);
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIButton test error:', error);
            console.error('Error stack:', error.stack);
            if (xwConsole) {
                xwConsole.error(`Error: ${error.message}`, 'TesterXWUIButton');
            }
        }
