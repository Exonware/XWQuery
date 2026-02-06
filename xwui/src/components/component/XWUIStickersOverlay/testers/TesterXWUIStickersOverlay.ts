import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIStickersOverlay/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIStickersOverlay } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIStickersOverlay Component Tester',
            desc: 'Sticker picker and overlay for adding stickers to canvas.',
            componentName: 'XWUIStickersOverlay'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const sampleStickers = [
            { id: '1', url: 'https://via.placeholder.com/100?text=😀', name: 'Happy', category: 'emotions' },
            { id: '2', url: 'https://via.placeholder.com/100?text=😢', name: 'Sad', category: 'emotions' },
            { id: '3', url: 'https://via.placeholder.com/100?text=❤️', name: 'Love', category: 'emotions' },
            { id: '4', url: 'https://via.placeholder.com/100?text=🎉', name: 'Party', category: 'celebration' }
        ];
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuistickers-overlay-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const canvasContainer = document.getElementById('canvas-stickers');
            const triggerBtn = document.getElementById('trigger-stickers');
            
            const stickersOverlay = new XWUIStickersOverlay(
                canvasContainer,
                {
                    canvasElement: canvasContainer
                },
                {
                    stickerLibrary,
                    categories: ['emotions', 'celebration'],
                    triggerElement: triggerBtn
                }
            );
            
            stickersOverlay.onChange((overlays) => {
                console.log('Overlays changed:', overlays);
                tester.setStatus(`✅ ${overlays.length} sticker(s) on canvas`, 'success');
            });
            
            tester.setStatus('✅ XWUIStickersOverlay initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIStickersOverlay test error:', error);
        }
