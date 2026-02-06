
        import { XWUITester } from '../index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        import { XWUIButton } from '../../XWUIButton/index.ts';
        import { XWUIMenuDrawer } from '../../XWUIMenuDrawer/index.ts';
        import { XWUISkeleton } from '../../XWUISkeleton/index.ts';
        
        // Set CSS base path for automatic CSS loading
        XWUIComponent.cssBasePath = '../../';
        
        // Start timer
        const timerText = document.getElementById('timer-text');
        const startTime = performance.now();
        const timerInterval = setInterval(() => {
            const elapsed = (performance.now() - startTime) / 1000;
            if (timerText) {
                timerText.textContent = `${elapsed.toFixed(2)}s`;
            }
        }, 50);
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUITester - Solution 4: Skeleton Loaders',
            desc: 'This solution uses skeleton loaders that match component shapes. Shows content structure while loading.',
            componentName: 'XWUITester',
            componentInstance,
            componentConfig: {},
            componentData: {}
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Create skeleton loaders for different components
        const skeletonContainer = document.createElement('div');
        skeletonContainer.style.padding = 'var(--spacing-md, 1rem)';
        skeletonContainer.style.display = 'flex';
        skeletonContainer.style.flexDirection = 'column';
        skeletonContainer.style.gap = 'var(--spacing-lg, 1.5rem)';
        
        // Header skeleton
        const headerSkeletonContainer = document.createElement('div');
        skeletonContainer.appendChild(headerSkeletonContainer);
        const headerSkeleton = new XWUISkeleton(
            headerSkeletonContainer,
            {},
            { preset: 'header' }
        );
        
        // Article skeleton
        const articleSkeletonContainer = document.createElement('div');
        skeletonContainer.appendChild(articleSkeletonContainer);
        const articleSkeleton = new XWUISkeleton(
            articleSkeletonContainer,
            {},
            { preset: 'article' }
        );
        
        // Button skeletons
        const buttonSkeletonsContainer = document.createElement('div');
        buttonSkeletonsContainer.style.display = 'flex';
        buttonSkeletonsContainer.style.gap = 'var(--spacing-md, 1rem)';
        skeletonContainer.appendChild(buttonSkeletonsContainer);
        
        const button1Container = document.createElement('div');
        buttonSkeletonsContainer.appendChild(button1Container);
        const button1Skeleton = new XWUISkeleton(
            button1Container,
            {},
            { preset: 'button' }
        );
        
        const button2Container = document.createElement('div');
        buttonSkeletonsContainer.appendChild(button2Container);
        const button2Skeleton = new XWUISkeleton(
            button2Container,
            {},
            { preset: 'button' }
        );
        
        const button3Container = document.createElement('div');
        buttonSkeletonsContainer.appendChild(button3Container);
        const button3Skeleton = new XWUISkeleton(
            button3Container,
            {},
            { preset: 'button' }
        );
        
        // Card skeleton
        const cardSkeletonContainer = document.createElement('div');
        skeletonContainer.appendChild(cardSkeletonContainer);
        const cardSkeleton = new XWUISkeleton(
            cardSkeletonContainer,
            {},
            { preset: 'card' }
        );
        
        // Table skeleton
        const tableSkeletonContainer = document.createElement('div');
        skeletonContainer.appendChild(tableSkeletonContainer);
        const tableSkeleton = new XWUISkeleton(
            tableSkeletonContainer,
            {},
            { preset: 'table' }
        );
        
        // Add skeleton container to test area
        testArea.appendChild(skeletonContainer);
        
        // Add test content
        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'none';
        contentDiv.innerHTML = `
            <div class="button-group">
                <h3>Solution 4: Skeleton Loaders</h3>
                <p>This solution:</p>
                <ul style="margin-left: var(--spacing-md, 1rem);">
                    <li>Shows skeleton loaders matching component shapes</li>
                    <li>Uses preset skeletons (button, table, article, card, etc.)</li>
                    <li>Provides visual feedback of content structure</li>
                    <li>Works well for backend data loading</li>
                    <li>20+ preset options available</li>
                </ul>
            </div>
            
            <div class="button-group">
                <h3>Test Button Instances</h3>
                <div class="button-row" id="button-test-area">
                    <!-- Buttons will be added here -->
                </div>
            </div>
            
            <div class="button-group">
                <h3>Available Skeleton Presets</h3>
                <p>Presets, radio</p>
            </div>
        `;
        testArea.appendChild(contentDiv);
        
        try {
            // Wait for everything to load
            async function loadContent() {
                // Wait for style (no artificial delay)
                if (!tester.styleInstance) {
                    await tester.initializeStyle();
                }
                
                // Wait for CSS to load
                await new Promise(resolve => {
                    const checkStyles = () => {
                        const links = document.querySelectorAll('link[rel="stylesheet"]');
                        let loaded = 0;
                        links.forEach(link => {
                            if (link.sheet) {
                                loaded++;
                            }
                        });
                        if (loaded === links.length) {
                            resolve();
                        } else {
                            setTimeout(checkStyles, 50);
                        }
                    };
                    checkStyles();
                });
                
                // Hide skeletons
                skeletonContainer.style.display = 'none';
                
                // Show actual content
                contentDiv.style.display = 'block';
                
                // Create test button instances
                const buttonTestArea = document.getElementById('button-test-area');
                if (buttonTestArea) {
                    const primaryContainer = document.createElement('div');
                    buttonTestArea.appendChild(primaryContainer);
                    const primaryButton = new XWUIButton(
                        primaryContainer,
                        { text: 'Primary Button' },
                        { variant: 'primary' }
                    );
                    
                    const secondaryContainer = document.createElement('div');
                    buttonTestArea.appendChild(secondaryContainer);
                    const secondaryButton = new XWUIButton(
                        secondaryContainer,
                        { text: 'Secondary Button' },
                        { variant: 'secondary' }
                    );
                }
                
                clearInterval(timerInterval);
                const totalTime = (performance.now() - startTime) / 1000;
                if (timerText) {
                    timerText.textContent = `${totalTime.toFixed(2)}s`;
                }
                tester.setStatus(`✅ Solution 4, skeletons replaced with actual components (${totalTime.toFixed(2)}s)`, 'success');
            }
            
            loadContent();
            
        } catch (error) {
            clearInterval(timerInterval);
            const totalTime = (performance.now() - startTime) / 1000;
            if (timerText) {
                timerText.textContent = `${totalTime.toFixed(2)}s`;
            }
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUITester test error:', error);
        }
