import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIChangeDiffViewer/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIChangeDiffViewer } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIChangeDiffViewer Component Tester',
            desc: 'Display field changes with before/after comparison.',
            componentName: 'XWUIChangeDiffViewer'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuichange-diff-viewer-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const diffViewer = new XWUIChangeDiffViewer(
            document.getElementById('change-diff-1'),
            {
                changes: [
                    {
                        id: '1',
                        timestamp: new Date(),
                        userId: '1',
                        userName: 'John Doe',
                        changes: [
                            { field: 'status', fieldLabel: 'Status', before: 'Pending', after: 'In Progress', changeType: 'modified' },
                            { field: 'priority', fieldLabel: 'Priority', before, after: 'High', changeType: 'added' }
                        ]
                    }
                ]
            },
            { showTimeline, showAvatar: true }
        );
        
        tester.data.componentInstance = diffViewer;
        tester.data.componentConfig = diffViewer.config;
        tester.data.componentData = diffViewer.data;
        tester.setStatus('Component loaded successfully', 'success');
