import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIFilePreview/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIFilePreview } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIFilePreview Component Tester',
            desc: 'Inline preview of uploaded files.',
            componentName: 'XWUIFilePreview'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuifile-preview-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const preview1 = new XWUIFilePreview(
            document.getElementById('file-preview-1'),
            {
                file: {
                    id: '1',
                    name: 'document.pdf',
                    url: 'https://example.com/document.pdf',
                    type: 'pdf',
                    size: 1024000
                },
                mode: 'single'
            },
            { showThumbnail, showDialog: true }
        );
        
        const preview2 = new XWUIFilePreview(
            document.getElementById('file-preview-2'),
            {
                files: [
                    { id: '1', name: 'image1.jpg', url: 'https://example.com/image1.jpg', type: 'image' },
                    { id: '2', name: 'image2.jpg', url: 'https://example.com/image2.jpg', type: 'image' }
                ],
                mode: 'gallery'
            },
            { showThumbnail, thumbnailSize: 'medium' }
        );
        
        tester.data.componentInstance = preview1;
        tester.data.componentConfig = preview1.config;
        tester.data.componentData = preview1.data;
        tester.setStatus('Component loaded successfully', 'success');
