import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIAppBar/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIAppBar } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIAppBar Component Tester',
            desc: 'Layout header component with logo, navigation, and actions areas.',
            componentName: 'XWUIAppBar'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiapp-bar-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        function createLogo() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.innerHTML = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
            svg.style.width = '28px';
            svg.style.height = '28px';
            svg.style.color = 'var(--accent-primary)';
            return svg;
        }
        
        function createWhiteLogo() {
            const svg = createLogo();
            svg.style.color = 'white';
            return svg;
        }
        
        function createNavigation(lightText = false) {
            const nav = document.createElement('nav');
            nav.className = 'nav-links' + (lightText ? ' light-text' : '');
            nav.innerHTML = `
                <a href="#" class="nav-link active">Home</a>
                <a href="#" class="nav-link">Products</a>
                <a href="#" class="nav-link">About</a>
                <a href="#" class="nav-link">Contact</a>
            `;
            return nav;
        }
        
        function createActions() {
            const actions = document.createElement('div');
            actions.style.display = 'flex';
            actions.style.alignItems = 'center';
            actions.style.gap = '0.75rem';
            
            const signIn = document.createElement('button');
            signIn.className = 'action-btn action-btn-ghost';
            signIn.textContent = 'Sign In';
            
            const signUp = document.createElement('button');
            signUp.className = 'action-btn action-btn-primary';
            signUp.textContent = 'Sign Up';
            
            actions.appendChild(signIn);
            actions.appendChild(signUp);
            
            return actions;
        }
        
        function createAvatar() {
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.textContent = 'JD';
            return avatar;
        }
        
        try {
            // Default AppBar
            new XWUIAppBar(document.getElementById('appbar-default'), {
                logo: createLogo(),
                title: 'XWUI',
                navigation: createNavigation(),
                actions: createActions()
            }, { variant: 'default', bordered: true });
            
            // Primary color
            new XWUIAppBar(document.getElementById('appbar-primary'), {
                logo: createWhiteLogo(),
                title: 'XWUI',
                navigation: createNavigation(true),
                actions: createAvatar()
            }, { color: 'primary', bordered: false });
            
            // Dark color
            new XWUIAppBar(document.getElementById('appbar-dark'), {
                logo: createWhiteLogo(),
                title: 'XWUI',
                navigation: createNavigation(true),
                actions: createAvatar()
            }, { color: 'dark', bordered: false });
            
            // Elevated
            new XWUIAppBar(document.getElementById('appbar-elevated'), {
                logo: createLogo(),
                title: 'XWUI',
                navigation: createNavigation(),
                actions: createActions()
            }, { variant: 'elevated', bordered: false });
            
            // Small
            new XWUIAppBar(document.getElementById('appbar-small'), {
                logo: createLogo(),
                title: 'Small'
            }, { size: 'small', bordered: true });
            
            // Medium
            new XWUIAppBar(document.getElementById('appbar-medium'), {
                logo: createLogo(),
                title: 'Medium (default)'
            }, { size: 'medium', bordered: true });
            
            // Large
            new XWUIAppBar(document.getElementById('appbar-large'), {
                logo: createLogo(),
                title: 'Large'
            }, { size: 'large', bordered: true });
            
            tester.setStatus('✅ XWUIAppBar initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIAppBar test error:', error);
        }
