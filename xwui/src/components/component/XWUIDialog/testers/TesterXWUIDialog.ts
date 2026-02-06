import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIDialog/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIDialog, confirm } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIDialog Component Tester',
            desc: 'Modal dialog with configurable header, body, footer.',
            componentName: 'XWUIDialog'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuidialog-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic dialog
            const basicDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'Basic Dialog',
                    content: '<p>This is a basic dialog with title and content.</p><p>You can add any HTML content here.</p>'
                },
                {}
            );
            
            // Size variants
            const smallDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'Small Dialog',
                    content: '<p>This is a small dialog (400px max width).</p>'
                },
                { size: 'small' }
            );
            
            const mediumDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'Medium Dialog',
                    content: '<p>This is a medium dialog (560px max width).</p>'
                },
                { size: 'medium' }
            );
            
            const largeDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'Large Dialog',
                    content: '<p>This is a large dialog (800px max width).</p>'
                },
                { size: 'large' }
            );
            
            const fullscreenDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'Fullscreen Dialog',
                    content: '<p>This dialog takes up the full viewport.</p>'
                },
                { size: 'fullscreen' }
            );
            
            // No close button
            const noCloseDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'No Close Button',
                    content: '<p>This dialog cannot be closed with the X button.</p>'
                },
                { closable: false }
            );
            
            // No backdrop close
            const noBackdropDialog = new XWUIDialog(
                document.createElement('div'),
                {
                    title: 'No Backdrop Close',
                    content: '<p>Clicking the backdrop will not close this dialog.</p>'
                },
                { closeOnBackdrop: false }
            );
            
            // Event handlers
            document.getElementById('btn-basic').addEventListener('click', () => basicDialog.open());
            document.getElementById('btn-small').addEventListener('click', () => smallDialog.open());
            document.getElementById('btn-medium').addEventListener('click', () => mediumDialog.open());
            document.getElementById('btn-large').addEventListener('click', () => largeDialog.open());
            document.getElementById('btn-fullscreen').addEventListener('click', () => fullscreenDialog.open());
            document.getElementById('btn-no-close').addEventListener('click', () => noCloseDialog.open());
            document.getElementById('btn-no-backdrop').addEventListener('click', () => noBackdropDialog.open());
            
            // Confirm dialog
            document.getElementById('btn-confirm').addEventListener('click', async () => {
                const result = await confirm({
                    title: 'Confirm Action',
                    message: 'Are you sure you want to proceed with this action? This cannot be undone.',
                    confirmText: 'Yes, Proceed',
                    cancelText: 'Cancel',
                    variant: 'danger'
                });
                
                if (result) {
                    tester.setStatus('✅ Action confirmed', 'success');
                } else {
                    tester.setStatus('ℹ️ Action cancelled', 'info');
                }
            });
            
            basicDialog.onClose(() => {
                tester.setStatus('ℹ️ Dialog closed', 'info');
            });
            
            tester.setStatus('✅ XWUIDialog initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIDialog test error:', error);
        }
