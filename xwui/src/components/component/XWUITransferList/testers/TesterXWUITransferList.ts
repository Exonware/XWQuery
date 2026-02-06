import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUITransferList/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUITransferList } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITransferList Component Tester',
            desc: 'Double-list component to move items between source and target.',
            componentName: 'XWUITransferList'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuitransfer-list-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const sourceItems = [
                { id: '1', label: 'Item 1', description: 'Description for item 1' },
                { id: '2', label: 'Item 2', description: 'Description for item 2' },
                { id: '3', label: 'Item 3', description: 'Description for item 3' },
                { id: '4', label: 'Item 4', description: 'Description for item 4' },
                { id: '5', label: 'Item 5', description: 'Description for item 5' },
                { id: '6', label: 'Item 6', description: 'Description for item 6' },
                { id: '7', label: 'Item 7', description: 'Description for item 7' },
                { id: '8', label: 'Item 8', description: 'Description for item 8' }
            ];
            
            const transferList = new XWUITransferList(document.getElementById('transfer-list-1'), {
                sourceItems,
                targetItems: []
            },             {
                titles: ['Available Items', 'Selected Items'],
                showSearch: true,
                showSelectAll: true
            });
            
            transferList.onChange((targetItems) => {
                const countEl = document.getElementById('target-count');
                if (countEl) {
                    countEl.textContent = String(targetItems.length);
                }
                tester.setStatus(`✅ ${targetItems.length} items in target`, 'success');
            });
            
            tester.setStatus('✅ XWUITransferList initialized successfully - Select items and use arrows to transfer', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITransferList test error:', error);
        }
