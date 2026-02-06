import { XWUIPage } from '../index.js';
        
        import { XWUIComponent } from '../../../component/XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIPage/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../../';
        
        const pageContainer = document.getElementById('page-container');
        const pageTypeSelect = document.getElementById('pageType');
        let currentPage = null;
        let pagesIndex = null;
        let pagesMap = new Map();
        
        // Load pages index and populate dropdown
        async function loadPagesIndex() {
            try {
                const response = await fetch('../../../pages/pages-index.json');
                if (!response.ok) {
                    throw new Error(`Failed to load pages-index.json: ${response.statusText}`);
                }
                pagesIndex = await response.json();
                
                // Clear existing options
                if (pageTypeSelect) {
                    pageTypeSelect.innerHTML = '';
                    
                    // Add options from index
                    pagesIndex.pages.forEach(page => {
                        const option = document.createElement('option');
                        option.value = page.file;
                        option.textContent = page.name;
                        option.dataset.id = page.id;
                        pageTypeSelect.appendChild(option);
                    });
                }
                
                // Load first page
                if (pagesIndex.pages.length > 0) {
                    loadPage(pagesIndex.pages[0].file);
                }
            } catch (error) {
                console.error('Error loading pages index:', error);
                // Fallback: show error message
                if (pageContainer) {
                    pageContainer.innerHTML = `<div style="padding: 2rem; color: red;">Error loading pages: ${error.message}</div>`;
                }
            }
        }
        
        // Load a specific page JSON file
        async function loadPage(filePath) {
            if (currentPage) {
                currentPage.destroy();
                currentPage = null;
            }
            
            if (!pageContainer) {
                console.error('page-container element not found');
                return;
            }
            
            // Clear container
            pageContainer.innerHTML = '<div style="padding: 2rem;">Loading...</div>';
            
            try {
                // Load the page JSON file
                const response = await fetch(`../../../pages/${filePath}`);
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
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
                    pageContainer.innerHTML = `<div style="padding: 2rem; color: red;">Error creating page: ${error.message}</div>`;
                }
            } catch (error) {
                console.error('Error loading page:', error);
                pageContainer.innerHTML = `<div style="padding: 2rem; color: red;">Error loading page: ${error.message}</div>`;
            }
        }
        
        // Handle page selection change
        pageTypeSelect?.addEventListener('change', (e) => {
            const target = e.target;
            if (target && target instanceof HTMLSelectElement) {
                const filePath = target.value;
                if (filePath) {
                    loadPage(filePath);
                }
            }
        });
        
        // Initialize: load pages index
        loadPagesIndex();
