import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIToast/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { toast } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIToast Component Tester',
            desc: 'Toast notification system with stacking.',
            componentName: 'XWUIToast'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitoast-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Configure position
            toast.configure({ position: 'top-right', maxToasts: 5 });
            
            // Variants
            document.getElementById('btn-info').addEventListener('click', () => {
                toast.info('This is an informational toast notification.');
            });
            
            document.getElementById('btn-success').addEventListener('click', () => {
                toast.success('Operation completed successfully');
            });
            
            document.getElementById('btn-warning').addEventListener('click', () => {
                toast.warning('Please review your input before proceeding.');
            });
            
            document.getElementById('btn-error').addEventListener('click', () => {
                toast.error('An error occurred. Please try again.');
            });
            
            // With title
            document.getElementById('btn-title').addEventListener('click', () => {
                toast.show({
                    title: 'New Message',
                    message: 'You have a new message from John Doe.',
                    variant: 'info'
                });
            });
            
            // With action
            document.getElementById('btn-action').addEventListener('click', () => {
                toast.show({
                    title: 'File Uploaded',
                    message: 'Your file has been uploaded successfully.',
                    variant: 'success',
                    action: {
                        label: 'View',
                        onClick: () => {
                            tester.setStatus('✅ Action clicked', 'success');
                        }
                    }
                });
            });
            
            // Persistent
            document.getElementById('btn-persistent').addEventListener('click', () => {
                toast.show({
                    message: 'This toast will not auto-dismiss.',
                    variant: 'info',
                    duration: 0,
                    closable: true
                });
            });
            
            // Dismiss all
            document.getElementById('btn-dismiss-all').addEventListener('click', () => {
                toast.dismissAll();
                tester.setStatus('✅ All toasts dismissed', 'success');
            });
            
            tester.setStatus('✅ XWUIToast initialized successfully - Click buttons to show toasts', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIToast test error:', error);
        }
