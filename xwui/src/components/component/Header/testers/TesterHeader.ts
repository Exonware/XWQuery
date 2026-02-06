import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/Header/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { Header } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'Header Component Tester',
            desc: 'This page tests the Header component in isolation. Expected, and language picker should be visible and functional.',
            componentName: 'Header'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-header-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const container = document.querySelector('.header-container');
        
        try {
            if (!container) {
                throw new Error('Container not found');
            }
            
            const header = new Header(container);
            
            // Test if header was created
            if (header) {
                tester.setStatus('✅ Header component initialized successfully', 'success');
                
                // Test header elements
                setTimeout(() => {
                    const headerLogo = document.querySelector('.header-logo');
                    const userProfile = document.querySelector('.header-user-profile');
                    const userAvatar = document.querySelector('.user-profile-avatar');
                    const userName = document.querySelector('.user-profile-name');
                    const userRole = document.querySelector('.user-profile-role');
                    
                    let statusMsg = '✅ Header component initialized successfully';
                    if (headerLogo) {
                        statusMsg += ' Logo found.';
                    }
                    if (userProfile) {
                        statusMsg += ' User profile found.';
                    }
                    if (userAvatar && userName && userRole) {
                        statusMsg += ' User profile elements complete.';
                    }
                    tester.setStatus(statusMsg, 'success');
                }, 100);
            } else {
                throw new Error('Header instance is null');
            }
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('Header test error:', error);
        }
