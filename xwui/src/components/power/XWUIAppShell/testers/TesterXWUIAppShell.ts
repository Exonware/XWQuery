import { XWUITester } from '../../../component/XWUITester/index.ts';
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAppShell/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        import { XWUIAppShell } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAppShell Component Tester',
            desc: 'Complete app layout structure with header, sidebar, main content, footer areas.',
            componentName: 'XWUIAppShell'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiapp-shell-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createSidebarContent() {
            const div = document.createElement('div');
            div.className = 'sidebar-content';
            div.innerHTML = `
                <h4>Sidebar</h4>
                <ul style="list-style: none; padding: 0;">
                    <li style="padding: 0.5rem 0;">📊 Dashboard</li>
                    <li style="padding: 0.5rem 0;">📝 Documents</li>
                    <li style="padding: 0.5rem 0;">⚙️ Settings</li>
                </ul>
            `;
            return div;
        }
        
        function createHeaderContent() {
            const div = document.createElement('div');
            div.className = 'header-content';
            div.innerHTML = '<h3>App Header</h3>';
            return div;
        }
        
        function createMainContent() {
            const div = document.createElement('div');
            div.innerHTML = `
                <h2>Main Content</h2>
                <p>This is the main content area. It can contain any content.</p>
                ${Array.from({ length: 10 }, (_, i) => `<p>Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`).join('')}
            `;
            return div;
        }
        
        function createFooterContent() {
            const div = document.createElement('div');
            div.className = 'footer-content';
            div.innerHTML = '<p>© 2024 XWUI. All rights reserved.</p>';
            return div;
        }
        
        try {
            // Basic
            const basicContainer = document.getElementById('shell-basic');
            const basicShell = new XWUIAppShell(
                basicContainer,
                {
                    header: createHeaderContent(),
                    sidebar: createSidebarContent(),
                    main: createMainContent(),
                    footer: createFooterContent()
                }
            );
            
            // Collapsible
            const collapsibleContainer = document.getElementById('shell-collapsible');
            const collapsibleShell = new XWUIAppShell(
                collapsibleContainer,
                {
                    header: createHeaderContent(),
                    sidebar: createSidebarContent(),
                    main: createMainContent(),
                    footer: createFooterContent()
                },
                {
                    sidebarCollapsible: true
                }
            );
            
            const toggleBtn = document.getElementById('btn-toggle-sidebar');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                collapsibleShell.toggleSidebar();
                });
            }
            
            tester.setStatus('✅ XWUIAppShell initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAppShell test error:', error);
        }
