import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIHoverCard/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIHoverCard } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIHoverCard Component Tester',
            desc: 'Popover triggered on hover with delay support.',
            componentName: 'XWUIHoverCard'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuihover-card-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const triggerText = document.getElementById('trigger-text');
            
            const hoverCard = new XWUIHoverCard(document.getElementById('hover-card-1'), {
                triggerElement,
                title: 'User Profile',
                content: 'This is additional information that appears on hover. You can include any content here.'
            }, {
                openDelay: 200,
                closeDelay: 100
            });
            
            tester.setStatus('✅ XWUIHoverCard initialized successfully. Hover over the text', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIHoverCard test error:', error);
        }
