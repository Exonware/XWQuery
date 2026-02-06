import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIWatermark/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIWatermark } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIWatermark Component Tester',
            desc: 'Watermark overlay component.',
            componentName: 'XWUIWatermark'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiwatermark-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const watermark = new XWUIWatermark(document.getElementById('watermark-container'), {}, {
                content: 'CONFIDENTIAL',
                gap: [100, 100],
                rotate: -22
            });
            
            tester.setStatus('✅ XWUIWatermark initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIWatermark test error:', error);
        }
