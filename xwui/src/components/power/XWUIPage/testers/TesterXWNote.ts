import { XWUIPage } from '../index.js';
        
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPage/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        const pageContainer = document.getElementById('page-container');
        let currentPage = null;
        
        // Load the XWNote page JSON
        async function loadPage() {
            if (!pageContainer) {
                console.error('page-container element not found');
                return;
            }
            
            // Clear container
            pageContainer.innerHTML = '<div style="padding: 2rem; color: var(--color-text);">Loading...</div>';
            
            try {
                // Load the page JSON file
                const response = await fetch('../../../pages/note/XWNote.json');
                if (!response.ok) {
                    throw new Error(`Failed to load XWNote.json: ${response.statusText}`);
                }
                
                const pageConfig = await response.json();
                
                console.log('Loaded page config:', pageConfig);
                
                // Create page with loaded config
                try {
                    currentPage = new XWUIPage(
                        pageContainer,
                        pageConfig.data || {},
                        pageConfig.conf_comp || {}
                    );
                    console.log('Page created successfully:', currentPage);
                    console.log('Page element:', currentPage.getPageElement());
                } catch (error) {
                    console.error('Error creating page:', error);
                    pageContainer.innerHTML = `<div style="padding: 2rem; color: var(--color-error, #ff4444);">Error creating page: ${error.message}</div>`;
                }
            } catch (error) {
                console.error('Error loading page:', error);
                pageContainer.innerHTML = `<div style="padding: 2rem; color: var(--color-error, #ff4444);">Error loading page: ${error.message}</div>`;
            }
        }
        
        // Initialize: load page
        loadPage();
