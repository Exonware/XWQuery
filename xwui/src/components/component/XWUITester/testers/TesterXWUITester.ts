
        import { XWUITester } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        import { XWUIButton } from '../../XWUIButton/index.ts';
        import { XWUIMenuDrawer } from '../../XWUIMenuDrawer/index.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITester/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester to test itself
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITester Component Tester',
            desc: 'This page tests the XWUITester component itself. XWUITester provides a standardized testing interface for all XWUI components with style selector, settings dialogs, platform selector, and viewport simulation.',
            componentName: 'XWUITester',
            componentInstance, // XWUITester is testing itself
            componentConfig: {},
            componentData: {}
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitester-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Top drawer - exactly like XWUIMenuDrawer tester
            const topDrawer = new XWUIMenuDrawer(
                document.createElement('div'),
                {
                    title: 'Top Drawer',
                    content: '<p>This drawer slides down from the top.</p><p>This demonstrates how the top drawer works in XWUIDrawer.</p><p>Click the backdrop or press Escape to close.</p>'
                },
                { placement: 'top', size: 'medium' }
            );
            
            // Event handler for TOP button
            document.getElementById('btn-top').addEventListener('click', () => {
                topDrawer.open();
            });
            
            // Create test button instances
            const buttonTestArea = document.getElementById('button-test-area');
            if (buttonTestArea) {
                // Primary button
                const primaryContainer = document.createElement('div');
                buttonTestArea.appendChild(primaryContainer);
                const primaryButton = new XWUIButton(
                    primaryContainer,
                    { text: 'Primary Button' },
                    { variant: 'primary' }
                );
                
                // Secondary button
                const secondaryContainer = document.createElement('div');
                buttonTestArea.appendChild(secondaryContainer);
                const secondaryButton = new XWUIButton(
                    secondaryContainer,
                    { text: 'Secondary Button' },
                    { variant: 'secondary' }
                );
                
                // Success button
                const successContainer = document.createElement('div');
                buttonTestArea.appendChild(successContainer);
                const successButton = new XWUIButton(
                    successContainer,
                    { text: 'Success Button' },
                    { variant: 'success' }
                );
                
                // Update tester with component instance for settings dialogs
                tester.data.componentInstance = primaryButton;
                tester.data.componentConfig = primaryButton.config;
                tester.data.componentData = primaryButton.data;
            }
            
            tester.setStatus('✅ XWUITester initialized successfully. Use the controls above to test different features.', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITester test error:', error);
        }
