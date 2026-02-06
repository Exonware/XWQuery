// Import XWUIButton index FIRST (auto-registers <xwui-button> via createXWUIElement)
        import '../../XWUIButton/index.ts';
        
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBottomSheet/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBottomSheet } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBottomSheet Component Tester',
            desc: 'Mobile-style modal sliding up from bottom.',
            componentName: 'XWUIBottomSheet'
        }, {});
        
        const testArea = tester.getTestArea();
        
        function createContent(text) {
            const div = document.createElement('div');
            div.innerHTML = `<p>${text}</p>`;
            return div;
        }
        
        function createLongContent() {
            const div = document.createElement('div');
            div.innerHTML = `
                <p>This is a long content example to test scrolling.</p>
                ${Array.from({ length: 20 }, (_, i) => `<p>Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`).join('')}
            `;
            return div;
        }
        
        function createActionMenu() {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.flexDirection = 'column';
            div.style.gap = '0.5rem';
            
            const actions = ['Edit', 'Share', 'Delete', 'Archive', 'Cancel'];
            actions.forEach(action => {
                const button = document.createElement('xwui-button');
                button.setAttribute('text', action);
                button.setAttribute('variant', action === 'Delete' ? 'danger' : action === 'Cancel' ? 'secondary' : 'primary');
                button.setAttribute('size', 'medium');
                button.setAttribute('full-width', 'true');
                // Attach listener - click will bubble from inner button to xwui-button element
                button.addEventListener('click', () => {
                    tester.setStatus(`✅ Action clicked: ${action}`, 'success');
                });
                div.appendChild(button);
            });
            
            return div;
        }
        
        // Wait for custom elements to be defined before using them
        (async () => {
            await customElements.whenDefined('xwui-button');
            
            // Create test content programmatically to ensure custom elements upgrade properly
            const basicGroup = document.createElement('div');
            basicGroup.className = 'button-group';
            basicGroup.innerHTML = '<h3>Basic Bottom Sheet</h3>';
            const btnBasic = document.createElement('xwui-button');
            btnBasic.id = 'btn-open-basic';
            btnBasic.setAttribute('text', 'Open Bottom Sheet');
            btnBasic.setAttribute('variant', 'primary');
            btnBasic.setAttribute('size', 'medium');
            basicGroup.appendChild(btnBasic);
            const basicContainer = document.createElement('div');
            basicContainer.id = 'bottomsheet-basic';
            basicGroup.appendChild(basicContainer);
            
            const titleGroup = document.createElement('div');
            titleGroup.className = 'button-group';
            titleGroup.innerHTML = '<h3>Bottom Sheet with Title</h3>';
            const btnTitle = document.createElement('xwui-button');
            btnTitle.id = 'btn-open-title';
            btnTitle.setAttribute('text', 'Open with Title');
            btnTitle.setAttribute('variant', 'primary');
            btnTitle.setAttribute('size', 'medium');
            titleGroup.appendChild(btnTitle);
            const titleContainer = document.createElement('div');
            titleContainer.id = 'bottomsheet-title';
            titleGroup.appendChild(titleContainer);
            
            const longGroup = document.createElement('div');
            longGroup.className = 'button-group';
            longGroup.innerHTML = '<h3>Bottom Sheet with Long Content</h3>';
            const btnLong = document.createElement('xwui-button');
            btnLong.id = 'btn-open-long';
            btnLong.setAttribute('text', 'Open Long Content');
            btnLong.setAttribute('variant', 'primary');
            btnLong.setAttribute('size', 'medium');
            longGroup.appendChild(btnLong);
            const longContainer = document.createElement('div');
            longContainer.id = 'bottomsheet-long';
            longGroup.appendChild(longContainer);
            
            const actionsGroup = document.createElement('div');
            actionsGroup.className = 'button-group';
            actionsGroup.innerHTML = '<h3>Action Menu Style</h3>';
            const btnActions = document.createElement('xwui-button');
            btnActions.id = 'btn-open-actions';
            btnActions.setAttribute('text', 'Open Actions');
            btnActions.setAttribute('variant', 'primary');
            btnActions.setAttribute('size', 'medium');
            actionsGroup.appendChild(btnActions);
            const actionsContainer = document.createElement('div');
            actionsContainer.id = 'bottomsheet-actions';
            actionsGroup.appendChild(actionsContainer);
            
            testArea.appendChild(basicGroup);
            testArea.appendChild(titleGroup);
            testArea.appendChild(longGroup);
            testArea.appendChild(actionsGroup);
            
            // Wait for custom elements to upgrade
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            
            try {
                // Basic
                const basicSheet = new XWUIBottomSheet(
                    basicContainer,
                    { content: createContent('Basic bottom sheet content. Click outside to close.') }
                );
                
                const btnBasicElement = btnBasic.querySelector('button') || btnBasic;
                btnBasicElement?.addEventListener('click', () => {
                    basicSheet.open();
                });
                basicSheet.onClose(() => {
                    tester.setStatus('✅ Basic sheet closed', 'success');
                });
                
                // With Title
                const titleSheet = new XWUIBottomSheet(
                    titleContainer,
                    { 
                        title: 'Bottom Sheet Title',
                        content: createContent('This bottom sheet has a title.') 
                    }
                );
                
                const btnTitleElement = btnTitle.querySelector('button') || btnTitle;
                btnTitleElement?.addEventListener('click', () => {
                    titleSheet.open();
                });
                
                // Long Content
                const longSheet = new XWUIBottomSheet(
                    longContainer,
                    { 
                        title: 'Long Content',
                        content: createLongContent() 
                    }
                );
                
                const btnLongElement = btnLong.querySelector('button') || btnLong;
                btnLongElement?.addEventListener('click', () => {
                    longSheet.open();
                });
                
                // Action Menu
                const actionsSheet = new XWUIBottomSheet(
                    actionsContainer,
                    { content: createActionMenu() }
                );
                
                const btnActionsElement = btnActions.querySelector('button') || btnActions;
                btnActionsElement?.addEventListener('click', () => {
                    actionsSheet.open();
                });
                
                tester.setStatus('✅ XWUIBottomSheet initialized successfully', 'success');
                
            } catch (error) {
                tester.setStatus(`❌ Error: ${error.message}`, 'error');
                console.error('XWUIBottomSheet test error:', error);
            }
        })();
