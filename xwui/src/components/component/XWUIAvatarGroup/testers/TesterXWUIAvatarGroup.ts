import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAvatarGroup/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAvatarGroup } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAvatarGroup Component Tester',
            desc: 'Group of avatars with overflow handling.',
            componentName: 'XWUIAvatarGroup'
        }, {});
        
        const testArea = tester.getTestArea();
        
        const template = document.getElementById('tester-xwuiavatar-group-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            const avatarGroup1 = new XWUIAvatarGroup(document.getElementById('avatar-group-1'), {
                avatars: [
                    { text: 'JD', name: 'John Doe' },
                    { text: 'JS', name: 'Jane Smith' },
                    { text: 'BJ', name: 'Bob Johnson' }
                ]
            }, {
                size: 'medium'
            });
            
            const avatarGroup2 = new XWUIAvatarGroup(document.getElementById('avatar-group-2'), {
                avatars: [
                    { text: 'A', name: 'Alice' },
                    { text: 'B', name: 'Bob' },
                    { text: 'C', name: 'Charlie' },
                    { text: 'D', name: 'Diana' },
                    { text: 'E', name: 'Eve' }
                ]
            }, {
                max: 3,
                total: 5
            });
            
            tester.setStatus('✅ XWUIAvatarGroup initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAvatarGroup test error:', error);
        }
