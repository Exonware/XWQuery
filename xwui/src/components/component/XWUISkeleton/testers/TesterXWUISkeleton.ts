import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUISkeleton/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUISkeleton } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUISkeleton Component Tester',
            desc: 'Loading skeleton placeholder component.',
            componentName: 'XWUISkeleton'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuiskeleton-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        
        try {
            // Variants
            new XWUISkeleton(document.getElementById('skeleton-text'), {}, { variant: 'text', width: '100%' });
            new XWUISkeleton(document.getElementById('skeleton-circular'), {}, { variant: 'circular', width: 48, height: 48 });
            new XWUISkeleton(document.getElementById('skeleton-rectangular'), {}, { variant: 'rectangular', width: '100%', height: 120 });
            new XWUISkeleton(document.getElementById('skeleton-rounded'), {}, { variant: 'rounded', width: '100%', height: 120 });
            
            // Animations
            new XWUISkeleton(document.getElementById('skeleton-pulse'), {}, { variant: 'text', animation: 'pulse', width: '100%' });
            new XWUISkeleton(document.getElementById('skeleton-wave'), {}, { variant: 'text', animation: 'wave', width: '100%' });
            new XWUISkeleton(document.getElementById('skeleton-none'), {}, { variant: 'text', animation: 'none', width: '100%' });
            
            // Multiple lines
            new XWUISkeleton(document.getElementById('skeleton-lines'), {}, { variant: 'text', lines: 4, width: '100%' });
            new XWUISkeleton(document.getElementById('skeleton-lines-8'), {}, { variant: 'text', lines: 8, width: '100%' });
            
            // Line height customization
            new XWUISkeleton(document.getElementById('skeleton-lineheight-default'), {}, { variant: 'text', lines: 3, width: '100%', lineHeight: '1rem' });
            new XWUISkeleton(document.getElementById('skeleton-lineheight-custom'), {}, { variant: 'text', lines: 3, width: '100%', lineHeight: '1.5rem' });
            new XWUISkeleton(document.getElementById('skeleton-lineheight-compact'), {}, { variant: 'text', lines: 3, width: '100%', lineHeight: '0.8rem' });
            
            // Custom dimensions
            new XWUISkeleton(document.getElementById('skeleton-custom-1'), {}, { variant: 'rectangular', width: 200, height: 100 });
            new XWUISkeleton(document.getElementById('skeleton-custom-2'), {}, { variant: 'rectangular', width: '50%', height: 60 });
            new XWUISkeleton(document.getElementById('skeleton-custom-3'), {}, { variant: 'rectangular', width: '100%', height: 80 });
            
            // Presets: UI Components
            new XWUISkeleton(document.getElementById('skeleton-preset-button'), {}, { preset: 'button' });
            new XWUISkeleton(document.getElementById('skeleton-preset-input'), {}, { preset: 'input' });
            new XWUISkeleton(document.getElementById('skeleton-preset-textarea'), {}, { preset: 'textarea' });
            new XWUISkeleton(document.getElementById('skeleton-preset-select'), {}, { preset: 'select' });
            new XWUISkeleton(document.getElementById('skeleton-preset-checkbox'), {}, { preset: 'checkbox' });
            new XWUISkeleton(document.getElementById('skeleton-preset-radio'), {}, { preset: 'radio' });
            new XWUISkeleton(document.getElementById('skeleton-preset-badge'), {}, { preset: 'badge' });
            new XWUISkeleton(document.getElementById('skeleton-preset-avatar'), {}, { preset: 'avatar' });
            
            // Presets: Layout Components
            new XWUISkeleton(document.getElementById('skeleton-preset-header'), {}, { preset: 'header' });
            new XWUISkeleton(document.getElementById('skeleton-preset-footer'), {}, { preset: 'footer' });
            new XWUISkeleton(document.getElementById('skeleton-preset-sidebar'), {}, { preset: 'sidebar' });
            new XWUISkeleton(document.getElementById('skeleton-preset-content'), {}, { variant: 'text', lines: 6, width: '100%' });
            
            // Presets: Content Components
            new XWUISkeleton(document.getElementById('skeleton-preset-article'), {}, { preset: 'article' });
            new XWUISkeleton(document.getElementById('skeleton-preset-list'), {}, { preset: 'list' });
            new XWUISkeleton(document.getElementById('skeleton-preset-menu'), {}, { preset: 'menu' });
            new XWUISkeleton(document.getElementById('skeleton-preset-table'), {}, { preset: 'table' });
            new XWUISkeleton(document.getElementById('skeleton-preset-code'), {}, { preset: 'code' });
            
            // Presets: Media Components
            new XWUISkeleton(document.getElementById('skeleton-preset-image'), {}, { preset: 'image' });
            new XWUISkeleton(document.getElementById('skeleton-preset-video'), {}, { preset: 'video' });
            new XWUISkeleton(document.getElementById('skeleton-preset-chart'), {}, { preset: 'chart' });
            new XWUISkeleton(document.getElementById('skeleton-preset-card'), {}, { preset: 'card' });
            
            // Presets: Form Components
            const formContainer = document.getElementById('skeleton-preset-form');
            const formWrapper = document.createElement('div');
            formWrapper.style.display = 'flex';
            formWrapper.style.flexDirection = 'column';
            formWrapper.style.gap = '1rem';
            
            const formLabel1 = document.createElement('label');
            formLabel1.textContent = 'Form Field 1:';
            formWrapper.appendChild(formLabel1);
            const formField1 = document.createElement('div');
            new XWUISkeleton(formField1, {}, { preset: 'input' });
            formWrapper.appendChild(formField1);
            
            const formLabel2 = document.createElement('label');
            formLabel2.textContent = 'Form Field 2:';
            formWrapper.appendChild(formLabel2);
            const formField2 = document.createElement('div');
            new XWUISkeleton(formField2, {}, { preset: 'textarea' });
            formWrapper.appendChild(formField2);
            
            const formLabel3 = document.createElement('label');
            formLabel3.textContent = 'Form Field 3:';
            formWrapper.appendChild(formLabel3);
            const formField3 = document.createElement('div');
            new XWUISkeleton(formField3, {}, { preset: 'select' });
            formWrapper.appendChild(formField3);
            
            formContainer.appendChild(formWrapper);
            
            // Custom className
            new XWUISkeleton(document.getElementById('skeleton-custom-class'), {}, { 
                variant: 'text', 
                lines: 3, 
                width: '100%',
                className: 'custom-skeleton-class'
            });
            
            // Card skeleton
            const cardContainer = document.getElementById('skeleton-card');
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'xwui-skeleton-card';
            cardWrapper.style.padding = '1rem';
            cardWrapper.style.border = '1px solid var(--border-color)';
            cardWrapper.style.borderRadius = '8px';
            
            const avatarText = document.createElement('div');
            avatarText.style.display = 'flex';
            avatarText.style.gap = '1rem';
            avatarText.style.alignItems = 'center';
            const avatarSkel = document.createElement('div');
            new XWUISkeleton(avatarSkel, {}, { variant: 'circular', width: 48, height: 48 });
            avatarText.appendChild(avatarSkel);
            const textSkel = document.createElement('div');
            textSkel.style.flex = '1';
            new XWUISkeleton(textSkel, {}, { variant: 'text', lines: 2, width: '100%' });
            avatarText.appendChild(textSkel);
            cardWrapper.appendChild(avatarText);
            
            const imageSkel = document.createElement('div');
            imageSkel.style.marginTop = '1rem';
            new XWUISkeleton(imageSkel, {}, { variant: 'rounded', width: '100%', height: 200 });
            cardWrapper.appendChild(imageSkel);
            
            cardContainer.appendChild(cardWrapper);
            
            // Real-world Examples
            // User Profile Card
            const profileCardContainer = document.getElementById('skeleton-profile-card');
            const profileCard = document.createElement('div');
            profileCard.style.padding = '1.5rem';
            profileCard.style.border = '1px solid var(--border-color)';
            profileCard.style.borderRadius = '8px';
            profileCard.style.display = 'flex';
            profileCard.style.flexDirection = 'column';
            profileCard.style.gap = '1rem';
            
            const profileHeader = document.createElement('div');
            profileHeader.style.display = 'flex';
            profileHeader.style.gap = '1rem';
            profileHeader.style.alignItems = 'center';
            const profileAvatar = document.createElement('div');
            new XWUISkeleton(profileAvatar, {}, { preset: 'avatar', width: 64, height: 64 });
            profileHeader.appendChild(profileAvatar);
            const profileInfo = document.createElement('div');
            profileInfo.style.flex = '1';
            new XWUISkeleton(profileInfo, {}, { variant: 'text', lines: 2, width: '100%' });
            profileHeader.appendChild(profileInfo);
            profileCard.appendChild(profileHeader);
            
            const profileBio = document.createElement('div');
            new XWUISkeleton(profileBio, {}, { variant: 'text', lines: 3, width: '100%' });
            profileCard.appendChild(profileBio);
            
            profileCardContainer.appendChild(profileCard);
            
            // Dashboard Layout
            const dashboardContainer = document.getElementById('skeleton-dashboard');
            const dashboard = document.createElement('div');
            dashboard.style.display = 'grid';
            dashboard.style.gridTemplateColumns = '250px 1fr';
            dashboard.style.gap = '1rem';
            dashboard.style.height = '300px';
            
            const dashboardSidebar = document.createElement('div');
            new XWUISkeleton(dashboardSidebar, {}, { preset: 'sidebar' });
            dashboard.appendChild(dashboardSidebar);
            
            const dashboardContent = document.createElement('div');
            dashboardContent.style.display = 'flex';
            dashboardContent.style.flexDirection = 'column';
            dashboardContent.style.gap = '1rem';
            
            const dashboardHeader = document.createElement('div');
            new XWUISkeleton(dashboardHeader, {}, { preset: 'header', height: 60 });
            dashboardContent.appendChild(dashboardHeader);
            
            const dashboardCards = document.createElement('div');
            dashboardCards.style.display = 'grid';
            dashboardCards.style.gridTemplateColumns = 'repeat(3, 1fr)';
            dashboardCards.style.gap = '1rem';
            dashboardCards.style.flex = '1';
            
            for (let i = 0; i < 3; i++) {
                const card = document.createElement('div');
                card.style.padding = '1rem';
                card.style.border = '1px solid var(--border-color)';
                card.style.borderRadius = '8px';
                const cardTitle = document.createElement('div');
                new XWUISkeleton(cardTitle, {}, { variant: 'text', width: '60%', height: '1.5rem' });
                card.appendChild(cardTitle);
                const cardContent = document.createElement('div');
                cardContent.style.marginTop = '1rem';
                new XWUISkeleton(cardContent, {}, { preset: 'chart', height: 150 });
                card.appendChild(cardContent);
                dashboardCards.appendChild(card);
            }
            
            dashboardContent.appendChild(dashboardCards);
            dashboard.appendChild(dashboardContent);
            dashboardContainer.appendChild(dashboard);
            
            // Product List
            const productListContainer = document.getElementById('skeleton-product-list');
            const productList = document.createElement('div');
            productList.style.display = 'grid';
            productList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
            productList.style.gap = '1rem';
            
            for (let i = 0; i < 6; i++) {
                const productCard = document.createElement('div');
                productCard.style.padding = '1rem';
                productCard.style.border = '1px solid var(--border-color)';
                productCard.style.borderRadius = '8px';
                
                const productImage = document.createElement('div');
                new XWUISkeleton(productImage, {}, { preset: 'image', height: 150 });
                productCard.appendChild(productImage);
                
                const productTitle = document.createElement('div');
                productTitle.style.marginTop = '0.75rem';
                new XWUISkeleton(productTitle, {}, { variant: 'text', width: '80%', height: '1.25rem' });
                productCard.appendChild(productTitle);
                
                const productPrice = document.createElement('div');
                productPrice.style.marginTop = '0.5rem';
                new XWUISkeleton(productPrice, {}, { variant: 'text', width: '60%', height: '1rem' });
                productCard.appendChild(productPrice);
                
                productList.appendChild(productCard);
            }
            
            productListContainer.appendChild(productList);
            
            // Method Demonstrations
            const loadingSkeleton = new XWUISkeleton(document.getElementById('skeleton-method-loading'), {}, { 
                variant: 'text', 
                lines: 2, 
                width: '100%' 
            });
            
            let isLoading = true;
            const toggleButton = document.getElementById('btn-toggle-loading');
            toggleButton.addEventListener('click', () => {
                isLoading = !isLoading;
                loadingSkeleton.setLoading(isLoading);
                toggleButton.textContent = isLoading ? 'Hide Loading' : 'Show Loading';
            });
            
            const elementSkeleton = new XWUISkeleton(document.getElementById('skeleton-method-element'), {}, { 
                variant: 'rounded', 
                width: '100%', 
                height: 100 
            });
            
            const element = elementSkeleton.getElement();
            const infoDiv = document.getElementById('skeleton-method-info');
            if (element) {
                infoDiv.textContent = `getElement() returned: ${element.tagName} with class "${element.className}"`;
            } else {
                infoDiv.textContent = 'getElement() returned: null';
            }
            
            tester.setStatus('✅ XWUISkeleton initialized successfully with all features', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUISkeleton test error:', error);
        }
