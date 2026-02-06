import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISteps/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISteps } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISteps Component Tester',
            desc: 'Step progress indicator (Stepper) component.',
            componentName: 'XWUISteps'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuisteps-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const sampleSteps = [
            { title: 'Step 1', description: 'First step description' },
            { title: 'Step 2', description: 'Second step description' },
            { title: 'Step 3', description: 'Third step description' },
            { title: 'Step 4', description: 'Final step description' }
        ];
        
        try {
            // Horizontal
            const horizontal = new XWUISteps(
                document.getElementById('steps-horizontal'),
                { steps: sampleSteps },
                { current: 1, direction: 'horizontal' }
            );
            
            document.getElementById('btn-prev').addEventListener('click', () => {
                horizontal.prev();
                tester.setStatus(`✅ Current step: ${horizontal.getCurrent() + 1}`, 'success');
            });
            
            document.getElementById('btn-next').addEventListener('click', () => {
                horizontal.next();
                tester.setStatus(`✅ Current step: ${horizontal.getCurrent() + 1}`, 'success');
            });
            
            // Vertical
            new XWUISteps(
                document.getElementById('steps-vertical'),
                { steps: sampleSteps },
                { current: 2, direction: 'vertical' }
            );
            
            // With error
            const errorSteps = [
                { title: 'Step 1', description: 'Completed' },
                { title: 'Step 2', description: 'In progress' },
                { title: 'Step 3', description: 'Error occurred', status: 'error' },
                { title: 'Step 4', description: 'Pending' }
            ];
            new XWUISteps(
                document.getElementById('steps-error'),
                { steps: errorSteps },
                { current: 1 }
            );
            
            // Sizes
            new XWUISteps(
                document.getElementById('steps-small'),
                { steps: sampleSteps.slice(0, 3) },
                { current: 1, size: 'small' }
            );
            
            new XWUISteps(
                document.getElementById('steps-large'),
                { steps: sampleSteps.slice(0, 3) },
                { current: 1, size: 'large' }
            );
            
            tester.setStatus('✅ XWUISteps initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISteps test error:', error);
        }
