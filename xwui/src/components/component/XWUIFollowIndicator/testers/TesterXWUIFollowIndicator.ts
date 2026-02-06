import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIFollowIndicator/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIFollowIndicator } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIFollowIndicator Component Tester',
            desc: 'Visual indicator for following/watching tasks or projects.',
            componentName: 'XWUIFollowIndicator'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuifollow-indicator-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const indicator1 = new XWUIFollowIndicator(
            document.getElementById('follow-button'),
            { following, label: 'Follow' },
            { variant: 'button' }
        );
        
        const indicator2 = new XWUIFollowIndicator(
            document.getElementById('follow-switch'),
            { following: true },
            { variant: 'switch' }
        );
        
        const indicator3 = new XWUIFollowIndicator(
            document.getElementById('follow-notifications'),
            { following, notificationCount: 5 },
            { variant: 'button', showNotificationCount: true }
        );
        
        tester.data.componentInstance = indicator1;
        tester.data.componentConfig = indicator1.config;
        tester.data.componentData = indicator1.data;
        tester.setStatus('Component loaded successfully', 'success');
