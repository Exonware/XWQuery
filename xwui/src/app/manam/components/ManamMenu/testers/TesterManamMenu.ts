
        import { XWUITester } from '../../../../../components/XWUITester/index.ts';
        import { XWUIComponent } from '../../../../../components/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/app/manam/components/ManamMenu/testers/
        // To components: src/components/ = go up 6 levels
        XWUIComponent.cssBasePath = '../../../../../components';
        
        import { ManamMenu } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'ManamMenu Component',
            desc: 'Bottom navigation menu with prominent central button for mobile apps.',
            componentName: 'ManamMenu'
        }, {
            // Set default platform to mobile portrait
            defaultPlatform: 'mobile',
            defaultOrientation: 'portrait'
        });
        
        // Wait for tester to be ready, then set up the component
        tester.waitForReady().then(() => {
            // Wait for viewport content to be available (since defaultPlatform is set to mobile)
            const waitForViewport = () => {
                return new Promise((resolve) => {
                    const checkViewport = () => {
                        const viewportContent = tester.getViewportContent();
                        if (viewportContent) {
                            resolve(viewportContent);
                        } else {
                            // Viewport might not be created yet, wait a bit more
                            requestAnimationFrame(() => {
                                requestAnimationFrame(checkViewport);
                            });
                        }
                    };
                    checkViewport();
                });
            };
            
            waitForViewport().then((viewportContent) => {
                // Create mobile app container that works within viewport
                const appContainer = document.createElement('div');
                appContainer.className = 'manam-app-container';
                
                // App content area
                const appContent = document.createElement('div');
                appContent.className = 'manam-app-content';
                appContent.innerHTML = `
                    <div class="demo-content">
                        <h2>Welcome to Manam</h2>
                        <p>
                            This is a demo of the ManamMenu component. The bottom navigation menu is fixed at the bottom of the screen.
                            Try clicking on different menu items to see the active state change.
                        </p>
                        <div class="demo-feature-card">
                            <p>✨ Dreams Feature</p>
                            <p class="hint">
                                Click on "Dreams" in the menu below to see it highlighted.
                            </p>
                        </div>
                    </div>
                `;
                appContainer.appendChild(appContent);
                
                // Menu wrapper - positioned at bottom of container
                const menuWrapper = document.createElement('div');
                menuWrapper.className = 'manam-menu-wrapper';
                menuWrapper.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    z-index: 1000;
                `;
                const menuContainer = document.createElement('div');
                menuContainer.id = 'manam-menu-1';
                menuWrapper.appendChild(menuContainer);
                appContainer.appendChild(menuWrapper);
                
                // Append directly to viewport content
                viewportContent.appendChild(appContainer);
                
                // Create moon icon SVG for Dreams
                const moonIcon = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C10.5 3 9.15 3.5 8 4.35C10.4 5.35 12 7.75 12 10.5C12 13.25 10.4 15.65 8 16.65C9.15 17.5 10.5 18 12 18C16.42 18 20 14.42 20 10C20 5.58 16.42 2 12 2V3Z" fill="currentColor"/>
                    </svg>
                `;
                
                // Create refresh icon SVG for Recharge
                const refreshIcon = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
                    </svg>
                `;
                
                // Create profile icon SVG
                const profileIcon = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                    </svg>
                `;
                
                // Create settings icon SVG
                const settingsIcon = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.67 19.18 11.36 19.14 11.06L21.16 9.48C21.39 9.3 21.46 8.97 21.32 8.69L19.32 5.28C19.18 5 18.85 4.86 18.57 4.97L16.24 5.99C15.74 5.59 15.18 5.26 14.57 5.02L14.23 2.57C14.15 2.28 13.9 2.07 13.6 2.07H10.4C10.1 2.07 9.85 2.28 9.77 2.57L9.43 5.02C8.82 5.26 8.26 5.59 7.76 5.99L5.43 4.97C5.15 4.86 4.82 5 4.68 5.28L2.68 8.69C2.54 8.97 2.61 9.3 2.84 9.48L4.86 11.06C4.82 11.36 4.8 11.67 4.8 12C4.8 12.33 4.82 12.64 4.86 12.94L2.84 14.52C2.61 14.7 2.54 15.03 2.68 15.31L4.68 18.72C4.82 19 5.15 19.14 5.43 19.03L7.76 18.01C8.26 18.41 8.82 18.74 9.43 18.98L9.77 21.43C9.85 21.72 10.1 21.93 10.4 21.93H13.6C13.9 21.93 14.15 21.72 14.23 21.43L14.57 18.98C15.18 18.74 15.74 18.41 16.24 18.01L18.57 19.03C18.85 19.14 19.18 19 19.32 18.72L21.32 15.31C21.46 15.03 21.39 14.7 21.16 14.52L19.14 12.94ZM12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5Z" fill="currentColor"/>
                    </svg>
                `;
                
                // Create plus icon SVG for central button
                const plusIcon = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                `;
                
                try {
                    // Create ManamMenu component
                    const manamMenu = new ManamMenu(menuContainer, {
                        items: [
                            {
                                id: 'dreams',
                                label: 'Dreams',
                                icon: moonIcon
                            },
                            {
                                id: 'recharge',
                                label: 'Recharge',
                                icon: refreshIcon
                            },
                            {
                                id: 'profile',
                                label: 'Profile',
                                icon: profileIcon
                            },
                            {
                                id: 'settings',
                                label: 'Settings',
                                icon: settingsIcon
                            }
                        ],
                        centralButton: {
                            id: 'new-dream',
                            label: 'New dream',
                            icon: plusIcon
                        },
                        activeId: 'dreams'
                    }, {
                        variant: 'default'
                    });
                    
                    manamMenu.onItemClick((item, event) => {
                        if (item.id !== 'new-dream') {
                            manamMenu.setActive(item.id);
                            tester.setStatus(`✅ Selected: ${item.label || item.id}`, 'success');
                        } else {
                            tester.setStatus(`✅ Central button clicked: ${item.label || item.id}`, 'success');
                        }
                    });
                    
                    manamMenu.onChange((activeId) => {
                        console.log('Active item changed to:', activeId);
                    });
                    
                    tester.setStatus('✅ ManamMenu component loaded successfully', 'success');
                } catch (error) {
                    console.error('Error creating ManamMenu:', error);
                    tester.setStatus(`❌ Error: ${error?.message || error}`, 'error');
                }
            }).catch((error) => {
                console.error('Error waiting for viewport:', error);
                tester.setStatus(`❌ Error waiting for viewport: ${error?.message || error}`, 'error');
            });
        }).catch((error) => {
            console.error('Error waiting for tester to be ready:', error);
            tester.setStatus(`❌ Error: ${error?.message || error}`, 'error');
        });
