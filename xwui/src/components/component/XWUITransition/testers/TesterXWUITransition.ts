import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITransition/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITransition } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITransition Component Tester',
            desc: 'Animation wrapper component for enter/exit transitions.',
            componentName: 'XWUITransition'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuitransition-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Fade transition
            const fadeTransition = new XWUITransition(document.getElementById('transition-fade'), {
                content: '<p>This content fades in and out.</p>'
            }, { type: 'fade', duration: 300 });
            
            document.getElementById('toggle-fade').addEventListener('click', () => {
                fadeTransition.toggle();
            });
            
            // Slide transitions
            const slideUpTransition = new XWUITransition(document.getElementById('transition-slide-up'), {
                content: '<p>This content slides up and down.</p>'
            }, { type: 'slide', direction: 'up', duration: 400 });
            
            document.getElementById('toggle-slide-up').addEventListener('click', () => {
                slideUpTransition.toggle();
            });
            
            const slideDownTransition = new XWUITransition(document.getElementById('transition-slide-down'), {
                content: '<p>This content slides down and up.</p>'
            }, { type: 'slide', direction: 'down', duration: 400 });
            
            document.getElementById('toggle-slide-down').addEventListener('click', () => {
                slideDownTransition.toggle();
            });
            
            // Scale transition
            const scaleTransition = new XWUITransition(document.getElementById('transition-scale'), {
                content: '<p>This content scales in and out.</p>'
            }, { type: 'scale', duration: 500 });
            
            document.getElementById('toggle-scale').addEventListener('click', () => {
                scaleTransition.toggle();
            });
            
            // Grow transition
            const growTransition = new XWUITransition(document.getElementById('transition-grow'), {
                content: '<p>This content grows from center.</p>'
            }, { type: 'grow', duration: 600 });
            
            document.getElementById('toggle-grow').addEventListener('click', () => {
                growTransition.toggle();
            });
            
            // Collapse transition
            const collapseTransition = new XWUITransition(document.getElementById('transition-collapse'), {
                content: '<p>This content collapses vertically.</p>'
            }, { type: 'collapse', duration: 400 });
            
            document.getElementById('toggle-collapse').addEventListener('click', () => {
                collapseTransition.toggle();
            });
            
            tester.setStatus('✅ XWUITransition initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITransition test error:', error);
        }
