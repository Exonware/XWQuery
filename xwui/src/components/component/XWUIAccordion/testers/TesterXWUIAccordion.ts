import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAccordion/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAccordion } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAccordion Component Tester',
            desc: 'Multiple collapsible sections with single/multiple open modes.',
            componentName: 'XWUIAccordion'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiaccordion-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const sampleItems = [
            {
                id: 'item-1',
                title: 'What is XWUI?',
                content: '<p>XWUI is a modern, framework-agnostic UI component library built with TypeScript. It provides beautiful, accessible components that work with any JavaScript framework or vanilla JS.</p>'
            },
            {
                id: 'item-2',
                title: 'How do I get started?',
                content: '<p>Getting started is easy Simply install the package via npm and import the components you need. Each component can be used as a direct class, a Custom Element, or a React component.</p>'
            },
            {
                id: 'item-3',
                title: 'Is XWUI accessible?',
                content: '<p>Yes Accessibility is a core principle of XWUI. All components follow WAI-ARIA guidelines and support keyboard navigation, screen readers, and proper focus management.</p>'
            },
            {
                id: 'item-4',
                title: 'Can I customize the theme?',
                content: '<p>Absolutely XWUI uses CSS custom properties (variables) for theming. You can easily customize colors, spacing, typography, and more by overriding these variables.</p>',
                disabled: true
            }
        ];
        
        try {
            // Single mode accordion
            const singleAccordion = new XWUIAccordion(
                document.getElementById('accordion-single'),
                { items: [...sampleItems.slice(0, 3)] },
                { mode: 'single', bordered: true }
            );
            
            // Multiple mode accordion
            const multipleAccordion = new XWUIAccordion(
                document.getElementById('accordion-multiple'),
                { items: [...sampleItems] },
                { mode: 'multiple', bordered: true }
            );
            
            document.getElementById('btn-expand-all').addEventListener('click', () => {
                multipleAccordion.expandAll();
                tester.setStatus('✅ Expanded all items', 'success');
            });
            
            document.getElementById('btn-collapse-all').addEventListener('click', () => {
                multipleAccordion.collapseAll();
                tester.setStatus('✅ Collapsed all items', 'success');
            });
            
            // Flush style accordion
            const flushAccordion = new XWUIAccordion(
                document.getElementById('accordion-flush'),
                { items: [...sampleItems.slice(0, 3)] },
                { mode: 'single', flush: true }
            );
            
            // With default expanded
            const defaultAccordion = new XWUIAccordion(
                document.getElementById('accordion-default'),
                { items: [...sampleItems.slice(0, 3)] },
                { mode: 'single', bordered: true, defaultExpanded: ['item-2'] }
            );
            
            tester.setStatus('✅ XWUIAccordion initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAccordion test error:', error);
        }
