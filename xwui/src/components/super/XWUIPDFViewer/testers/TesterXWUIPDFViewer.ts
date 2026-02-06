import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPDFViewer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIPDFViewer } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPDFViewer Component Tester',
            desc: 'Enhanced PDF viewer with PDF.js integration.',
            componentName: 'XWUIPDFViewer'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuipdfviewer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('pdf-viewer-basic');
            const basicViewer = new XWUIPDFViewer(
                basicContainer,
                {
                    pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
                }
            );
            
            basicViewer.onPageChange((page, total) => {
                console.log(`Page ${page} of ${total}`);
                tester.setStatus(`✅ Page ${page} of ${total}`, 'success');
            });
            
            // With Thumbnails
            const thumbnailsContainer = document.getElementById('pdf-viewer-thumbnails');
            const thumbnailsViewer = new XWUIPDFViewer(
                thumbnailsContainer,
                {
                    pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
                },
                {
                    showThumbnails: true
                }
            );
            
            tester.setStatus('✅ XWUIPDFViewer initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIPDFViewer test error:', error);
        }
