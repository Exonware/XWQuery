import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITour/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITour } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITour Component Tester',
            desc: 'Step-by-step guide/tour component.',
            componentName: 'XWUITour'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuitour-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const startBtn = document.getElementById('start-tour-btn');
            
            const tour = new XWUITour(document.getElementById('tour-container'), {
                open: false
            }, {
                steps: [
                    {
                        target: '#target-1',
                        title: 'Step 1',
                        description: 'This is the first step of the tour.',
                        placement: 'bottom'
                    },
                    {
                        target: '#target-2',
                        title: 'Step 2',
                        description: 'This is the second step.',
                        placement: 'top'
                    },
                    {
                        target: '#target-3',
                        title: 'Step 3',
                        description: 'This is the final step.',
                        placement: 'right'
                    }
                ],
                mask: true
            });
            
            startBtn.addEventListener('click', () => {
                tour.open();
            });
            
            tester.setStatus('✅ XWUITour initialized successfully. Click Start Tour', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITour test error:', error);
        }
