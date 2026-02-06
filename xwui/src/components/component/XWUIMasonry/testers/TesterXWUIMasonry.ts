import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIMasonry/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIMasonry } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIMasonry Component Tester',
            desc: 'Pinterest-style masonry grid layout for items of different heights.',
            componentName: 'XWUIMasonry'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuimasonry-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createMasonryItem(height, text) {
            const item = document.createElement('div');
            item.style.height = `${height}px`;
            item.style.background = 'var(--bg-secondary, #f8f9fa)';
            item.style.border = '1px solid var(--border-color, rgba(0, 0, 0, 0.05))';
            item.style.borderRadius = 'var(--radius-md, 8px)';
            item.style.padding = 'var(--spacing-md)';
            item.style.display = 'flex';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.fontWeight = '500';
            item.textContent = text;
            return item;
        }
        
        try {
            // Responsive masonry
            const items1 = [
                createMasonryItem(150, 'Item 1'),
                createMasonryItem(200, 'Item 2'),
                createMasonryItem(120, 'Item 3'),
                createMasonryItem(180, 'Item 4'),
                createMasonryItem(160, 'Item 5'),
                createMasonryItem(140, 'Item 6'),
                createMasonryItem(220, 'Item 7'),
                createMasonryItem(130, 'Item 8')
            ];
            
            const masonry1 = new XWUIMasonry(document.getElementById('masonry-1'), {
                items: items1
            }, {
                responsive,
                gap: 'var(--spacing-md)'
            });
            
            // Fixed columns masonry
            const items2 = [
                createMasonryItem(100, 'A'),
                createMasonryItem(150, 'B'),
                createMasonryItem(120, 'C'),
                createMasonryItem(180, 'D'),
                createMasonryItem(110, 'E'),
                createMasonryItem(160, 'F')
            ];
            
            new XWUIMasonry(document.getElementById('masonry-2'), {
                items: items2
            }, {
                columns: 3,
                gap: 'var(--spacing-sm)'
            });
            
            tester.setStatus('✅ XWUIMasonry initialized successfully - Items are arranged in columns', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIMasonry test error:', error);
        }
