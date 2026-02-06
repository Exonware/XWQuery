import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAspectRatio/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAspectRatio } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAspectRatio Component Tester',
            desc: 'Container component that maintains specific aspect ratios.',
            componentName: 'XWUIAspectRatio'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiaspect-ratio-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createPlaceholder(text) {
            const div = document.createElement('div');
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.background = 'linear-gradient(135deg, var(--accent-primary), var(--accent-light))';
            div.style.color = 'white';
            div.style.fontWeight = '500';
            div.textContent = text;
            return div;
        }
        
        try {
            // Common ratios
            new XWUIAspectRatio(document.getElementById('ratio-1-1'), {
                content: createPlaceholder('1:1')
            }, { ratio: '1:1' });
            
            new XWUIAspectRatio(document.getElementById('ratio-4-3'), {
                content: createPlaceholder('4:3')
            }, { ratio: '4:3' });
            
            new XWUIAspectRatio(document.getElementById('ratio-16-9'), {
                content: createPlaceholder('16:9')
            }, { ratio: '16:9' });
            
            new XWUIAspectRatio(document.getElementById('ratio-21-9'), {
                content: createPlaceholder('21:9')
            }, { ratio: '21:9' });
            
            // With image - cover
            const imgCover = document.createElement('img');
            imgCover.src = 'https://picsum.photos/400/300';
            imgCover.alt = 'Demo image';
            new XWUIAspectRatio(document.getElementById('ratio-image-cover'), {
                content: imgCover
            }, { ratio: '16:9', objectFit: 'cover' });
            
            // With image - contain
            const imgContain = document.createElement('img');
            imgContain.src = 'https://picsum.photos/400/300';
            imgContain.alt = 'Demo image';
            imgContain.style.background = 'var(--bg-secondary)';
            new XWUIAspectRatio(document.getElementById('ratio-image-contain'), {
                content: imgContain
            }, { ratio: '16:9', objectFit: 'contain' });
            
            // Custom ratio
            new XWUIAspectRatio(document.getElementById('ratio-custom'), {
                content: createPlaceholder('2.35:1')
            }, { ratio: 2.35 });
            
            tester.setStatus('✅ XWUIAspectRatio initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAspectRatio test error:', error);
        }
