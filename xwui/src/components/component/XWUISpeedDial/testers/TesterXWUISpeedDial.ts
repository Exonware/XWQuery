import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISpeedDial/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISpeedDial } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISpeedDial Component Tester',
            desc: 'A floating action button with expandable menu.',
            componentName: 'XWUISpeedDial'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuispeed-dial-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const speedDial = new XWUISpeedDial(document.getElementById('speed-dial-container'), {
                actions: [
                    { icon: '+', label: 'Add', onClick: () => alert('Add clicked') },
                    { icon: '✎', label: 'Edit', onClick: () => alert('Edit clicked') },
                    { icon: '×', label: 'Delete', onClick: () => alert('Delete clicked') }
                ]
            }, {
                icon: '+',
                position: 'bottom-right',
                direction: 'up'
            });
            
            tester.setStatus('✅ XWUISpeedDial initialized successfully. Click the button to expand', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISpeedDial test error:', error);
        }
