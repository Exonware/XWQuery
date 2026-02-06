
        import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIGalleryViewer } from '../index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIGalleryViewer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIGalleryViewer Component Tester',
            desc: 'This page tests the XWUIGalleryViewer component with various layouts and configurations.',
            componentName: 'XWUIGalleryViewer'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Sample images - using placeholder images from a working service
        const sampleImages = [
            { id: '1', src: 'https://picsum.photos/800/600?random=1', thumbnail: 'https://picsum.photos/200/150?random=1', title: 'Image 1', alt: 'Sample image 1' },
            { id: '2', src: 'https://picsum.photos/800/600?random=2', thumbnail: 'https://picsum.photos/200/150?random=2', title: 'Image 2', alt: 'Sample image 2' },
            { id: '3', src: 'https://picsum.photos/800/600?random=3', thumbnail: 'https://picsum.photos/200/150?random=3', title: 'Image 3', alt: 'Sample image 3' },
            { id: '4', src: 'https://picsum.photos/800/600?random=4', thumbnail: 'https://picsum.photos/200/150?random=4', title: 'Image 4', alt: 'Sample image 4' }
        ];
        
        const template = document.getElementById('tester-xwuigallery-viewer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const container = document.getElementById('gallery-container');
            const gallery = new XWUIGalleryViewer(container, {
                images: sampleImages
            }, {
                layout: 'grid',
                columns: 3,
                showLightbox,
                aspectRatio: '16:9'
            });
            
            tester.data.componentInstance = gallery;
            tester.data.componentConfig = gallery.config;
            tester.data.componentData = gallery.data;
            
            tester.setStatus('✅ XWUIGalleryViewer component initialized successfully', 'success');
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIGalleryViewer test error:', error);
        }
