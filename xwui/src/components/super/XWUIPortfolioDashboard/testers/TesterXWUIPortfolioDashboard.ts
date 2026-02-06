import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPortfolioDashboard/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIPortfolioDashboard } from '../index.ts';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIPortfolioDashboard Component Tester',
            desc: 'Multi-project overview dashboard with health indicators and metrics.',
            componentName: 'XWUIPortfolioDashboard'
        }, {});
        
        const testArea = tester.getTestArea();
        const template = document.getElementById('tester-xwuiportfolio-dashboard-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        const dashboard = new XWUIPortfolioDashboard(
            document.getElementById('portfolio-dashboard-1'),
            {
                projects: [
                    { id: '1', name: 'Project Alpha', status: 'on-track', progress: 65, health: 85, tasksCompleted: 13, tasksTotal: 20, teamSize: 5 },
                    { id: '2', name: 'Project Beta', status: 'at-risk', progress: 45, health: 60, tasksCompleted: 9, tasksTotal: 20, teamSize: 4 },
                    { id: '3', name: 'Project Gamma', status: 'delayed', progress: 30, health: 40, tasksCompleted: 6, tasksTotal: 20, teamSize: 3 }
                ]
            },
            { showKPIs, showCharts, showProjects: true }
        );
        
        tester.data.componentInstance = dashboard;
        tester.data.componentConfig = dashboard.config;
        tester.data.componentData = dashboard.data;
        tester.setStatus('Component loaded successfully', 'success');
