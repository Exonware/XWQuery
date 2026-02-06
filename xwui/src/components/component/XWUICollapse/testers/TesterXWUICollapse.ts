import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUICollapse/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUICollapse } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUICollapse Component Tester',
            desc: 'Animated expand/collapse container.',
            componentName: 'XWUICollapse'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuicollapse-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createContent(text) {
            const div = document.createElement('div');
            div.style.padding = '1rem';
            div.style.background = 'var(--bg-secondary)';
            div.style.borderRadius = '8px';
            div.innerHTML = `<p>${text}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`;
            return div;
        }
        
        try {
            // Basic collapse
            const basicCollapse = new XWUICollapse(
                document.getElementById('collapse-basic'),
                { content: createContent('Basic collapse content') },
                { expanded: false }
            );
            
            document.getElementById('trigger-basic').addEventListener('click', () => {
                basicCollapse.toggle();
            });
            
            // Initially expanded
            const expandedCollapse = new XWUICollapse(
                document.getElementById('collapse-expanded'),
                { content: createContent('This content is visible by default') },
                { expanded: true }
            );
            
            document.getElementById('trigger-expanded').addEventListener('click', () => {
                expandedCollapse.toggle();
            });
            
            // Slow animation
            const slowCollapse = new XWUICollapse(
                document.getElementById('collapse-slow'),
                { content: createContent('This has a slower 500ms animation') },
                { expanded, duration: 500, easing: 'ease-in-out' }
            );
            
            document.getElementById('trigger-slow').addEventListener('click', () => {
                slowCollapse.toggle();
            });
            
            // Programmatic control
            const programmaticCollapse = new XWUICollapse(
                document.getElementById('collapse-programmatic'),
                { content: createContent('Controlled programmatically') },
                { expanded: false }
            );
            
            document.getElementById('btn-expand').addEventListener('click', () => {
                programmaticCollapse.expand();
                tester.setStatus('✅ Expanded', 'success');
            });
            
            document.getElementById('btn-collapse').addEventListener('click', () => {
                programmaticCollapse.collapse();
                tester.setStatus('✅ Collapsed', 'success');
            });
            
            document.getElementById('btn-toggle').addEventListener('click', () => {
                programmaticCollapse.toggle().then(() => {
                    tester.setStatus(`✅ Toggled to ${programmaticCollapse.getExpanded() ? 'expanded' : 'collapsed'}`, 'success');
                });
            });
            
            tester.setStatus('✅ XWUICollapse initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUICollapse test error:', error);
        }
