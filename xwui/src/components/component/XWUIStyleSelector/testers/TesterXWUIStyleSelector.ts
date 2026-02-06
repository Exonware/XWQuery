import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIStyleSelector/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIStyleSelector } from '../index.ts';
        import { XWUIButton } from '../../XWUIButton/index.ts';
        import { XWUIDialog } from '../../XWUIDialog/index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIStyleSelector Component Tester',
            desc: 'This tester demonstrates the XWUIStyleSelector component. Click the "Styles" button to open the style selector overlay. Below are various XWUI components to see how the style changes affect them.',
            componentName: 'XWUIStyleSelector'
        }, {});
        
        const testArea = tester.getTestArea();
        const controlsElement = tester.getControlsElement();
        
        // Add controls to controls area
        controlsElement.innerHTML = `
            <div id="styles-button-container"></div>
        `;
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuistyle-selector-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        import { XWUIStyle } from '../../XWUIStyle/index.ts';
        import { XWUIConsole } from '../../XWUIConsole/index.ts';
        import { XWUIBadge } from '../../XWUIBadge/index.ts';
        import { XWUIAlert } from '../../XWUIAlert/index.ts';
        import { XWUICard } from '../../XWUICard/index.ts';
        import { XWUIInput } from '../../XWUIInput/index.ts';

        // Initialize XWUIButton components
        const btnPrimary = new XWUIButton(document.getElementById('btn-primary'), 'Primary', { variant: 'primary' });
        const btnSecondary = new XWUIButton(document.getElementById('btn-secondary'), 'Secondary', { variant: 'secondary' });
        const btnSuccess = new XWUIButton(document.getElementById('btn-success'), 'Success', { variant: 'success' });
        const btnDanger = new XWUIButton(document.getElementById('btn-danger'), 'Danger', { variant: 'danger' });
        const btnWarning = new XWUIButton(document.getElementById('btn-warning'), 'Warning', { variant: 'warning' });
        const btnInfo = new XWUIButton(document.getElementById('btn-info'), 'Info', { variant: 'info' });
        const btnOutline = new XWUIButton(document.getElementById('btn-outline'), 'Outline', { variant: 'outline' });
        const btnGhost = new XWUIButton(document.getElementById('btn-ghost'), 'Ghost', { variant: 'ghost' });
        
        const btnSmall = new XWUIButton(document.getElementById('btn-small'), 'Small', { size: 'small', variant: 'primary' });
        const btnMedium = new XWUIButton(document.getElementById('btn-medium'), 'Medium', { size: 'medium', variant: 'primary' });
        const btnLarge = new XWUIButton(document.getElementById('btn-large'), 'Large', { size: 'large', variant: 'primary' });
        
        const btnLoading = new XWUIButton(document.getElementById('btn-loading'), 'Loading...', { variant: 'primary', loading: true });
        const btnDisabled = new XWUIButton(document.getElementById('btn-disabled'), 'Disabled', { variant: 'primary', disabled: true });

        // Add click handlers
        btnPrimary.onClick(() => console.log('Primary button clicked'));
        btnSuccess.onClick(() => {
            btnLoading.setLoading(true);
            setTimeout(() => btnLoading.setLoading(false), 2000);
        });
        
        // Initialize XWUIBadge components
        const badgeDefault = new XWUIBadge(document.getElementById('badge-default'), { text: 'Default' }, { variant: 'default' });
        const badgePrimary = new XWUIBadge(document.getElementById('badge-primary'), { text: 'Primary' }, { variant: 'primary' });
        const badgeSuccess = new XWUIBadge(document.getElementById('badge-success'), { text: 'Success' }, { variant: 'success' });
        const badgeWarning = new XWUIBadge(document.getElementById('badge-warning'), { text: 'Warning' }, { variant: 'warning' });
        const badgeError = new XWUIBadge(document.getElementById('badge-error'), { text: 'Error' }, { variant: 'error' });
        
        // Initialize XWUIAlert components
        const alertInfo = new XWUIAlert(document.getElementById('alert-info'), {
            title: 'Info',
            message: 'This is an informational message.'
        }, { variant: 'info', closable: true });
        
        const alertSuccess = new XWUIAlert(document.getElementById('alert-success'), {
            title: 'Success',
            message: 'Operation completed successfully.'
        }, { variant: 'success', closable: true });
        
        const alertWarning = new XWUIAlert(document.getElementById('alert-warning'), {
            title: 'Warning',
            message: 'Please review this action.'
        }, { variant: 'warning', closable: true });
        
        const alertError = new XWUIAlert(document.getElementById('alert-error'), {
            title: 'Error',
            message: 'Something went wrong.'
        }, { variant: 'error', closable: true });
        
        // Initialize XWUICard components
        const card1 = new XWUICard(document.getElementById('card-1'), {
            title: 'Card Title',
            subtitle: 'Card Subtitle',
            content: 'This is a card component demonstrating the theme styles. Cards adapt to border radius, shadows, and colors from the theme.'
        }, { variant: 'default', hoverable: true });
        
        const card2 = new XWUICard(document.getElementById('card-2'), {
            title: 'Another Card',
            content: 'Cards demonstrate how the theme affects borders, backgrounds, and spacing. Change the theme to see the impact.'
        }, { variant: 'outlined', clickable: true });
        
        // Initialize XWUIInput components
        const inputText = new XWUIInput(document.getElementById('input-text'), {
            label: 'Text Input',
            placeholder: 'Enter text...',
            value: 'Sample text'
        }, { type: 'text' });
        
        const inputEmail = new XWUIInput(document.getElementById('input-email'), {
            label: 'Email Input',
            placeholder: 'Enter email...',
            value: 'user@example.com'
        }, { type: 'email' });
        
        const inputPassword = new XWUIInput(document.getElementById('input-password'), {
            label: 'Password Input',
            placeholder: 'Enter password...'
        }, { type: 'password', showPasswordToggle: true });

        // Initialize XWUIStyle first
        const styleContainer = document.createElement('div');
        styleContainer.style.display = 'none'; // Hidden container for XWUIStyle
        document.body.appendChild(styleContainer);
        
        let xwuiStyle = null;
        let styleSelector = null;

        try {
            // Initialize XWUIStyle with default configuration
            const styleConfig = {
                basePath: '../../../styles',
                brand: 'xwui',
                style: 'modern',
                color: 'light',
                accent: 'blue',
                roundness: 'rounded',
                font: 'inter',
                icons: 'material-icons',
                emojis: 'apple',
                autoLoad: true
            };

            // Use the same ID as other test pages to sync across pages
            const sharedId = 'xwui-style-testers';
            xwuiStyle = new XWUIStyle(styleContainer, { id: sharedId }, styleConfig);

            // Wait a bit for style to initialize
            await new Promise(resolve => setTimeout(resolve, 100));

            // Display current theme config
            const currentTheme = xwuiStyle.getTheme();
            document.getElementById('jsonConfigDisplay').textContent = JSON.stringify(currentTheme, null, 2);

            // Create Styles Button
            const stylesButtonContainer = document.getElementById('styles-button-container');
            const stylesButton = new XWUIButton(stylesButtonContainer, 'Styles', { variant: 'primary' });
            
            // Initialize style selector in hidden container
            const selectorContainer = document.getElementById('style-selector-container');
            if (selectorContainer) {
                const selectorConfig = {
                    basePath: '../../../styles',
                    schemaPath: '../../../styles/styles.schema.json',
                    dataPath: '../../../styles/styles.data.json',
                    showLabels: true,
                    styleInstance: xwuiStyle
                };

                // Use the same ID to sync with other components
                styleSelector = new XWUIStyleSelector(selectorContainer, { id: sharedId }, selectorConfig);

                // Wait for selector to initialize
                await new Promise(resolve => setTimeout(resolve, 500));

                console.log('XWUIStyleSelector initialized');
                console.log('Current selections:', styleSelector.getSelections());

                // Create Dialog with style selector
                const dialogContainer = document.getElementById('dialog-container');
                const dialog = new XWUIDialog(dialogContainer, {
                    title: 'Style Selector',
                    content: selectorContainer
                }, {
                    size: 'large',
                    closable: true,
                    closeOnBackdrop: true,
                    closeOnEscape: true
                });

                // Open dialog when button is clicked
                stylesButton.onClick(() => {
                    // Make selector container visible before opening dialog
                    selectorContainer.style.display = 'block';
                    dialog.open();
                });

                // Update JSON display when theme changes
                const updateJsonDisplay = () => {
                    const selections = styleSelector.getSelections();
                    document.getElementById('jsonConfigDisplay').textContent = JSON.stringify(selections, null, 2);
                };

                // Listen for theme changes
                const observer = new MutationObserver(() => {
                    updateJsonDisplay();
                });

                observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['data-brand', 'data-style', 'data-theme', 'data-accent', 
                                     'data-roundness', 'data-glow', 'data-font', 'data-icons', 'data-emojis', 'data-lines']
                });

                // Initial update
                updateJsonDisplay();
            }
        } catch (error) {
            console.error('Error initializing components:', error);
            document.getElementById('jsonConfigDisplay').textContent = `Error: ${error}`;
        }

        // Initialize console with some events
        const consoleContainer = document.getElementById('consoleContainer');
        if (consoleContainer) {
            try {
                const conf_sys = await XWUIConsole.loadSystemConfig('../../../../data/conf_sys.json');
                const conf_usr = await XWUIConsole.loadUserConfig('../../../../data/conf_usr.json');
                
                const conf_comp = {
                    theme: 'light',
                    maxEntries: 100,
                    showTimestamp: true,
                    autoScroll: true
                };

                const xwConsole = new XWUIConsole(consoleContainer, conf_comp, conf_sys, conf_usr);

                // Add some sample events
                xwConsole.data = [
                    { id: 1, type: "system", color: "#888", label: "SYSTEM", msg: "Style selector initialized" },
                    { id: 2, type: "info", color: "#4aa3ff", label: "INFO", msg: "Theme selector ready" },
                    { id: 3, type: "success", color: "#2ecc71", label: "OK", msg: "All components loaded" },
                    { id: 4, type: "log", color: "#ffffff", label: "LOG", msg: "You can now change themes using the dropdowns above" }
                ];

                // Update console theme when page theme changes
                const consoleObserver = new MutationObserver(() => {
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    xwConsole.setTheme(currentTheme === 'dark' || currentTheme === 'night' ? 'dark' : 'light');
                });

                consoleObserver.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['data-theme']
                });

            } catch (error) {
                console.error('Error initializing XWUIConsole:', error);
            }
        }
