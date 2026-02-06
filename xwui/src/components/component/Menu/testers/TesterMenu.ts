import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/Menu/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { Menu } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'Menu Component Tester',
            desc: 'This page tests the Menu component in isolation. Expected: Menu should load and display governance index with expandable categories.',
            componentName: 'Menu'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-menu-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const container = document.querySelector('.menu-container');
        
        try {
            if (!container) {
                throw new Error('Container not found');
            }
            
            const menu = new Menu(container);
            
            // Test if menu was created
            if (menu) {
                tester.setStatus('✅ Menu component initialized successfully', 'success');
                
                // Check if menu content is loading
                setTimeout(() => {
                    const menuContent = container.querySelector('.menu-content');
                    const governanceTree = container.querySelector('.governance-tree');
                    
                    let statusMsg = '✅ Menu component initialized successfully';
                    if (menuContent) {
                        statusMsg += ' Menu content container found.';
                    }
                    if (governanceTree) {
                        statusMsg += ' Governance tree found.';
                    } else {
                        statusMsg += ' (Governance tree may still be loading...)';
                    }
                    tester.setStatus(statusMsg, 'success');
                }, 500);
            } else {
                throw new Error('Menu instance is null');
            }
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Menu test error:', error);
        }
