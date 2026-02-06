import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPopconfirm/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIPopconfirm } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPopconfirm Component Tester',
            desc: 'Popover with confirmation action buttons.',
            componentName: 'XWUIPopconfirm'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuipopconfirm-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const triggerBtn = document.getElementById('trigger-btn');
            
            const popconfirm = new XWUIPopconfirm(document.getElementById('popconfirm-1'), {
                triggerElement,
                onConfirm: () => {
                    alert('Confirmed');
                },
                onCancel: () => {
                    console.log('Cancelled');
                }
            }, {
                title: 'Are you sure?',
                description: 'This action cannot be undone.',
                okText: 'Yes, delete',
                cancelText: 'Cancel'
            });
            
            tester.setStatus('✅ XWUIPopconfirm initialized successfully. Click the button', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIPopconfirm test error:', error);
        }
