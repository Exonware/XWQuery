import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIImage/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIImage } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIImage Component Tester',
            desc: 'Enhanced image wrapper with fallbacks, placeholders, and lazy loading.',
            componentName: 'XWUIImage'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiimage-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        // Helper function to create SVG placeholder data URI
        const createPlaceholderSVG = (width, height, text, bgColor = '#e0e0e0', textColor = '#666') => {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <rect fill="${bgColor}" width="${width}" height="${height}"/>
                <text fill="${textColor}" x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16">${text}</text>
            </svg>`;
            return 'data:image/svg+xml,' + encodeURIComponent(svg);
        };
        
        try {
            // Basic image
            new XWUIImage(document.getElementById('image-1'), {
                src: createPlaceholderSVG(300, 200, 'Image 1', '#4f46e5', '#ffffff'),
                alt: 'Test image 1'
            }, {
                placeholder: 'Loading...'
            });
            
            // Image with placeholder
            new XWUIImage(document.getElementById('image-2'), {
                src: createPlaceholderSVG(300, 200, 'Image 2', '#10b981', '#ffffff'),
                alt: 'Test image 2'
            }, {
                placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23f0f0f0" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELoading%3C/text%3E%3C/svg%3E'
            });
            
            // Image with fallback
            new XWUIImage(document.getElementById('image-3'), {
                src: 'https://invalid-url-that-will-fail.jpg',
                alt: 'Test image with fallback'
            }, {
                fallback: createPlaceholderSVG(300, 200, 'Fallback', '#ef4444', '#ffffff'),
                placeholder: 'Loading...'
            });
            
            // Image with error (no fallback)
            new XWUIImage(document.getElementById('image-4'), {
                src: 'https://invalid-url-that-will-fail.jpg',
                alt: 'Test image with error'
            });
            
            // Image with aspect ratio
            new XWUIImage(document.getElementById('image-5'), {
                src: createPlaceholderSVG(600, 400, '16:9', '#8b5cf6', '#ffffff'),
                alt: '16:9 aspect ratio'
            }, {
                aspectRatio: '16/9',
                objectFit: 'cover'
            });
            
            new XWUIImage(document.getElementById('image-6'), {
                src: createPlaceholderSVG(400, 400, '1:1', '#f59e0b', '#ffffff'),
                alt: '1:1 aspect ratio'
            }, {
                aspectRatio: '1/1',
                objectFit: 'cover'
            });
            
            // Lazy loaded images
            new XWUIImage(document.getElementById('image-7'), {
                src: createPlaceholderSVG(800, 600, 'Lazy 1', '#06b6d4', '#ffffff'),
                alt: 'Lazy loaded image 1',
                loading: 'lazy'
            }, {
                lazy,
                placeholder: 'Loading...'
            });
            
            new XWUIImage(document.getElementById('image-8'), {
                src: createPlaceholderSVG(800, 600, 'Lazy 2', '#ec4899', '#ffffff'),
                alt: 'Lazy loaded image 2',
                loading: 'lazy'
            }, {
                lazy: true
            });
            
            tester.setStatus('✅ XWUIImage initialized successfully - Check lazy loading by scrolling', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIImage test error:', error);
        }
