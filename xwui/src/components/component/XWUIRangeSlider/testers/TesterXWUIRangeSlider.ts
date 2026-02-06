import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIRangeSlider/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIRangeSlider } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIRangeSlider Component Tester',
            desc: 'Dual-thumb slider for range selection.',
            componentName: 'XWUIRangeSlider'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuirange-slider-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const rangeSlider = new XWUIRangeSlider(document.getElementById('range-slider-1'), {
                value: [20, 80],
                label: 'Price Range'
            }, {
                min: 0,
                max: 100,
                step: 1
            });
            
            tester.setStatus('✅ XWUIRangeSlider initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIRangeSlider test error:', error);
        }
