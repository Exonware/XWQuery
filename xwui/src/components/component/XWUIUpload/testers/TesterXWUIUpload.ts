import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIUpload/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIUpload } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIUpload Component Tester',
            desc: 'File upload component with drag-and-drop support.',
            componentName: 'XWUIUpload'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiupload-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic upload
            new XWUIUpload(document.getElementById('upload-1'), {
                label: 'Upload Files'
            }, {
                multiple,
                dragDrop: true
            });
            
            // Multiple file upload
            new XWUIUpload(document.getElementById('upload-2'), {
                label: 'Upload Multiple Files'
            }, {
                multiple,
                maxCount: 5,
                dragDrop: true
            });
            
            // Upload with file type restriction
            new XWUIUpload(document.getElementById('upload-3'), {
                label: 'Upload Images Only'
            }, {
                accept: 'image/*',
                maxSize: 5 * 1024 * 1024, // 5MB
                listType: 'picture-card'
            });
            
            tester.setStatus('✅ XWUIUpload initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIUpload test error:', error);
        }
