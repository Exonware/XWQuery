import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICarousel/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICarousel } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICarousel Component Tester',
            desc: 'Carousel component for displaying slides.',
            componentName: 'XWUICarousel'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicarousel-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Basic carousel
            new XWUICarousel(document.getElementById('carousel-1'), {
                items: [
                    { content: '<div style="padding: 2rem; background: var(--bg-secondary); text-align: center;">Slide 1</div>' },
                    { content: '<div style="padding: 2rem; background: var(--bg-secondary); text-align: center;">Slide 2</div>' },
                    { content: '<div style="padding: 2rem; background: var(--bg-secondary); text-align: center;">Slide 3</div>' }
                ]
            }, {});
            
            tester.setStatus('✅ XWUICarousel initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICarousel test error:', error);
        }
