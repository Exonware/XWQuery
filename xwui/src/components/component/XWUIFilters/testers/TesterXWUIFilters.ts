import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIFilters/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIFilters } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIFilters Component Tester',
            desc: 'Enhanced image filters with presets and custom filter creation.',
            componentName: 'XWUIFilters'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuifilters-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const basicContainer = document.getElementById('filters-basic');
            const basicFilters = new XWUIFilters(
                basicContainer,
                {
                    imageUrl: 'https://via.placeholder.com/400x300'
                }
            );
            
            basicFilters.onChange((filter) => {
                console.log('Filter applied:', filter);
                tester.setStatus(`✅ Filter applied: ${filter}`, 'success');
            });
            
            tester.setStatus('✅ XWUIFilters initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIFilters test error:', error);
        }
