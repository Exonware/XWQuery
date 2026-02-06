import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISortableList/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUISortableList } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISortableList Component Tester',
            desc: 'Drag-and-drop sortable list with HTML5 drag API.',
            componentName: 'XWUISortableList'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuisortable-list-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const sampleItems = [
            { id: 1, title: 'First Item', description: 'This is the first item', icon: '📝' },
            { id: 2, title: 'Second Item', description: 'This is the second item', icon: '📄' },
            { id: 3, title: 'Third Item', description: 'This is the third item', icon: '📋' },
            { id: 4, title: 'Fourth Item', description: 'This is the fourth item', icon: '📊' },
            { id: 5, title: 'Fifth Item', description: 'This is the fifth item', icon: '📈' }
        ];
        
        const simpleItems = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
        
        try {
            // Basic
            const basicContainer = document.getElementById('list-basic');
            const basicList = new XWUISortableList(
                basicContainer,
                {
                    items: [...sampleItems],
                    renderItem: (item) => {
                        const div = document.createElement('div');
                        div.className = 'list-item';
                        div.innerHTML = `
                            <span class="list-item-icon">${item.icon}</span>
                            <div class="list-item-content">
                                <div class="list-item-title">${item.title}</div>
                                <div class="list-item-description">${item.description}</div>
                            </div>
                        `;
                        return div;
                    }
                }
            );
            basicList.onChange((items) => {
                console.log('Items reordered:', items);
                tester.setStatus(`✅ List reordered (${items.length} items)`, 'success');
            });
            
            // Custom Styled
            const customContainer = document.getElementById('list-custom');
            const customList = new XWUISortableList(
                customContainer,
                {
                    items: [...sampleItems],
                    renderItem: (item) => {
                        const div = document.createElement('div');
                        div.style.padding = '1.5rem';
                        div.style.border = '2px solid var(--accent-primary)';
                        div.style.borderRadius = '12px';
                        div.style.background = 'var(--bg-secondary)';
                        div.style.display = 'flex';
                        div.style.alignItems = 'center';
                        div.style.gap = '1rem';
                        div.innerHTML = `
                            <span style="font-size: 2rem;">${item.icon}</span>
                            <div>
                                <strong>${item.title}</strong>
                                <p style="margin: 0.5rem 0 0 0; color: var(--text-secondary);">${item.description}</p>
                            </div>
                        `;
                        return div;
                    }
                },
                {
                    itemClassName: 'custom-item'
                }
            );
            customList.onChange((items) => {
                console.log('Custom list reordered:', items);
            });
            
            // Simple Text
            const simpleContainer = document.getElementById('list-simple');
            const simpleList = new XWUISortableList(
                simpleContainer,
                {
                    items: [...simpleItems],
                    renderItem: (item) => {
                        const div = document.createElement('div');
                        div.className = 'list-item';
                        div.textContent = item;
                        return div;
                    }
                }
            );
            simpleList.onChange((items) => {
                console.log('Simple list reordered:', items);
            });
            
            tester.setStatus('✅ XWUISortableList initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISortableList test error:', error);
        }
