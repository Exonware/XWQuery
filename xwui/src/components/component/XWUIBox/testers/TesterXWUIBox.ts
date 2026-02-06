import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIBox/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIBox } from '../index.ts';
        import { XWUIImage } from '../../XWUIImage/index.ts';
        
        // Set default image background on page load
        const randomImageId = Math.floor(Math.random() * 1000);
        document.body.style.backgroundImage = `url(https://picsum.photos/1920/1080?random=${randomImageId})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundAttachment = 'fixed';
        
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIBox Component Tester',
            desc: 'A foundational layout component for spacing, color, typography, and other style properties.',
            componentName: 'XWUIBox'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Helper function to get random image URL
        const getRandomImageUrl = () => {
            return `https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 10000)}`;
        };
        
        // Store all image and box components
        const imageComponents = [];
        const boxComponents = [];
        
        // Background mode: 'solid', 'random', 'none'
        let backgroundMode = 'random';
        
        // Function to update all backgrounds
        const updateAllBackgrounds = (mode) => {
            backgroundMode = mode;
            imageComponents.forEach((imgData, index) => {
                const { image, container } = imgData;
                if (!image || !container) return;
                
                const imageWrapper = image.getElement();
                if (!imageWrapper) return;
                
                if (mode === 'none') {
                    // Hide image, show solid color background
                    imageWrapper.style.display = 'none';
                    container.style.background = 'var(--bg-secondary, #f8f9fa)';
                } else if (mode === 'solid') {
                    // Hide image, show solid color background
                    imageWrapper.style.display = 'none';
                    // Use different solid colors for variety
                    const colors = [
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    ];
                    container.style.background = colors[index % colors.length];
                } else if (mode === 'random') {
                    // Show image with random URL
                    imageWrapper.style.display = '';
                    container.style.background = '';
                    image.setSrc(getRandomImageUrl());
                }
            });
        };
        
        // Add background control buttons
        const controlsDiv = document.createElement('div');
        controlsDiv.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;';
        
        const solidButton = document.createElement('button');
        solidButton.textContent = '🎨 Solid';
        solidButton.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.875rem; cursor: pointer; background: var(--control-bg, #fff); color: var(--text-primary, #212529); border: 1px solid var(--border-color, #e0e0e0); border-radius: 6px;';
        solidButton.addEventListener('click', () => updateAllBackgrounds('solid'));
        
        const randomButton = document.createElement('button');
        randomButton.textContent = '🖼️ Random Image';
        randomButton.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.875rem; cursor: pointer; background: var(--control-bg, #fff); color: var(--text-primary, #212529); border: 1px solid var(--border-color, #e0e0e0); border-radius: 6px;';
        randomButton.addEventListener('click', () => updateAllBackgrounds('random'));
        
        const noneButton = document.createElement('button');
        noneButton.textContent = '🚫 None';
        noneButton.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.875rem; cursor: pointer; background: var(--control-bg, #fff); color: var(--text-primary, #212529); border: 1px solid var(--border-color, #e0e0e0); border-radius: 6px;';
        noneButton.addEventListener('click', () => updateAllBackgrounds('none'));
        
        controlsDiv.appendChild(solidButton);
        controlsDiv.appendChild(randomButton);
        controlsDiv.appendChild(noneButton);
        testArea.appendChild(controlsDiv);
        
        testArea.innerHTML += `
            <style>
                .box-demo-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }
                
                .box-demo-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .box-demo-item h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary, #212529);
                }
                
                .box-demo-item .demo-wrapper {
                    min-height: 200px;
                    width: 100%;
                    border-radius: 12px;
                    overflow: hidden;
                    position: relative;
                }
                
                /* XWUIImage container should fill the wrapper */
                .box-demo-item .demo-wrapper .xwui-image-container {
                    width: 100%;
                    height: 100%;
                    min-height: 200px;
                }
                
                .box-demo-item .demo-wrapper .xwui-image-wrapper {
                    width: 100%;
                    height: 100%;
                }
                
                /* XWUIBox inside image should be positioned absolutely */
                .box-demo-item .demo-wrapper .xwui-box-container {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }
                
                .box-demo-item .demo-wrapper.gradient-bg {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .box-demo-item .demo-wrapper.purple-bg {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                
                .box-demo-item .demo-wrapper.blue-bg {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                }
                
                .box-demo-item .demo-wrapper.green-bg {
                    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                }
                
                .box-demo-item .demo-wrapper.orange-bg {
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                }
                
                .box-demo-item .demo-wrapper.dark-bg {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                }
                
                /* Glass-only wrappers */
                .glass-only-wrapper {
                    min-height: 300px;
                }
                
                /* Nested boxes wrapper */
                .nested-boxes-wrapper {
                    min-height: 600px;
                    height: 600px;
                    width: 100%;
                    position: relative;
                }
                
                /* Ensure the image container fills the wrapper */
                .nested-boxes-wrapper > div {
                    width: 100%;
                    height: 100%;
                }
                
                /* Grid for nested boxes - styles applied inline, this is just fallback */
                .nested-box-item {
                    width: 100%;
                    height: 100%;
                    min-height: 0;
                    min-width: 0;
                }
            </style>
            
            <div class="box-demo-container">
                <div class="box-demo-item">
                    <h3>Basic Box</h3>
                    <div id="wrapper-basic" class="demo-wrapper">
                        <div id="image-basic"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Box with Padding</h3>
                    <div id="wrapper-padding" class="demo-wrapper">
                        <div id="image-padding"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Box with Background</h3>
                    <div id="wrapper-bg" class="demo-wrapper">
                        <div id="image-bg"></div>
                    </div>
                </div>
            </div>
            
            <div class="box-demo-container">
                <div class="box-demo-item">
                    <h3>Gradient Background</h3>
                    <div id="wrapper-gradient" class="demo-wrapper">
                        <div id="image-gradient"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass Effect (Default)</h3>
                    <div id="wrapper-glass-default" class="demo-wrapper">
                        <div id="image-glass-default"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass Effect (Custom)</h3>
                    <div id="wrapper-glass-custom" class="demo-wrapper">
                        <div id="image-glass-custom"></div>
                    </div>
                </div>
            </div>
            
            <div class="box-demo-container">
                <div class="box-demo-item">
                    <h3>Glass + Gradient</h3>
                    <div id="wrapper-glass-gradient" class="demo-wrapper">
                        <div id="image-glass-gradient"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass (High Blur)</h3>
                    <div id="wrapper-glass-high-blur" class="demo-wrapper">
                        <div id="image-glass-high-blur"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass (Low Opacity)</h3>
                    <div id="wrapper-glass-low-opacity" class="demo-wrapper">
                        <div id="image-glass-low-opacity"></div>
                    </div>
                </div>
            </div>
            
            <div class="box-demo-container">
                <div class="box-demo-item">
                    <h3>Glass (High Saturation)</h3>
                    <div id="wrapper-glass-high-sat" class="demo-wrapper">
                        <div id="image-glass-high-sat"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass (Dark Theme)</h3>
                    <div id="wrapper-glass-dark" class="demo-wrapper">
                        <div id="image-glass-dark"></div>
                    </div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass (Light Theme)</h3>
                    <div id="wrapper-glass-light" class="demo-wrapper">
                        <div id="image-glass-light"></div>
                    </div>
                </div>
            </div>
            
            <h2 style="margin: 3rem 0 1.5rem; font-size: 1.5rem; font-weight: 600; color: var(--text-primary, #212529);">Glass Effect (No Background)</h2>
            <div class="box-demo-container">
                <div class="box-demo-item">
                    <h3>Glass Only (Default)</h3>
                    <div id="glass-only-default" class="demo-wrapper glass-only-wrapper"></div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass Only (High Blur)</h3>
                    <div id="glass-only-high-blur" class="demo-wrapper glass-only-wrapper"></div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass Only (Low Opacity)</h3>
                    <div id="glass-only-low-opacity" class="demo-wrapper glass-only-wrapper"></div>
                </div>
            </div>
            
            <div class="box-demo-container">
                <div class="box-demo-item">
                    <h3>Glass Only (High Saturation)</h3>
                    <div id="glass-only-high-sat" class="demo-wrapper glass-only-wrapper"></div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass Only (Dark)</h3>
                    <div id="glass-only-dark" class="demo-wrapper glass-only-wrapper"></div>
                </div>
                
                <div class="box-demo-item">
                    <h3>Glass Only (Light)</h3>
                    <div id="glass-only-light" class="demo-wrapper glass-only-wrapper"></div>
                </div>
            </div>
            
            <h2 style="margin: 3rem 0 1.5rem; font-size: 1.5rem; font-weight: 600; color: var(--text-primary, #212529);">Nested Boxes (3x3 Grid)</h2>
            <div class="box-demo-item" style="max-width: 100%;">
                <h3>Parent Box with Image - 9 Glass Sub-Boxes</h3>
                <div id="wrapper-nested-boxes" class="demo-wrapper nested-boxes-wrapper">
                    <div id="image-nested-boxes"></div>
                </div>
            </div>
        `;
        
        // Helper function to create a box demo with image background
        const createBoxDemo = (imageContainerId, boxConfig, boxData) => {
            // Create XWUIImage first
            const imageContainer = document.getElementById(imageContainerId);
            const image = new XWUIImage(imageContainer, {
                src: getRandomImageUrl(),
                alt: 'Background image'
            }, {
                aspectRatio: '16/9',
                objectFit: 'cover',
                width: '100%',
                height: '100%'
            });
            
            // Get the image wrapper element to place box inside
            const imageWrapper = image.getElement();
            if (!imageWrapper) return { image, box: null };
            
            // Make wrapper position relative for absolute positioning of box
            imageWrapper.style.position = 'relative';
            
            // Create container for the box inside the image
            const boxContainer = document.createElement('div');
            boxContainer.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1;';
            imageWrapper.appendChild(boxContainer);
            
            // Create XWUIBox inside the image
            const box = new XWUIBox(boxContainer, boxData, {
                ...boxConfig,
                width: '100%',
                height: '100%'
            });
            
            // Store for background updates - store the image container div for styling
            const imageContainerDiv = imageContainer.closest('.demo-wrapper') || imageContainer;
            imageComponents.push({ image, container: imageContainerDiv });
            boxComponents.push(box);
            
            return { image, box };
        };
        
        // Helper function to create a glass-only box (no image background)
        const createGlassOnlyBox = (containerId, glassConfig, content) => {
            const container = document.getElementById(containerId);
            if (!container) return null;
            
            const box = new XWUIBox(container, {
                content: content
            }, {
                glassEffect: glassConfig,
                padding: '2rem',
                width: '100%',
                height: '100%',
                minHeight: '300px'
            });
            
            boxComponents.push(box);
            return box;
        };
        
        // Helper function to create nested boxes (parent with image, children with glass)
        const createNestedBoxes = (imageContainerId) => {
            // Create XWUIImage first for parent background
            const imageContainer = document.getElementById(imageContainerId);
            if (!imageContainer) return { image: null, boxes: [] };
            
            const image = new XWUIImage(imageContainer, {
                src: getRandomImageUrl(),
                alt: 'Background image for nested boxes'
            }, {
                aspectRatio: '16/9',
                objectFit: 'cover',
                width: '100%',
                height: '100%'
            });
            
            // Get the image wrapper element
            const imageWrapper = image.getElement();
            if (!imageWrapper) {
                console.error('Failed to get image wrapper element');
                return { image, boxes: [] };
            }
            
            // Make wrapper position relative for absolute positioning and ensure it has height
            imageWrapper.style.position = 'relative';
            imageWrapper.style.minHeight = '600px';
            imageWrapper.style.height = '100%';
            imageWrapper.style.width = '100%';
            
            // Create grid container for nested boxes
            const gridContainer = document.createElement('div');
            gridContainer.className = 'nested-boxes-grid';
            gridContainer.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 1rem; padding: 1rem; box-sizing: border-box;';
            imageWrapper.appendChild(gridContainer);
            
            // Create 9 boxes in a 3x3 grid
            const boxes = [];
            const glassConfigs = [
                { enabled: true, blur: 16, opacity: 60, saturation: 180, color: '#1e293b' },
                { enabled: true, blur: 20, opacity: 50, saturation: 150, color: '#1e293b' },
                { enabled: true, blur: 24, opacity: 70, saturation: 200, color: '#0f172a' },
                { enabled: true, blur: 18, opacity: 55, saturation: 170, color: '#1e293b' },
                { enabled: true, blur: 16, opacity: 60, saturation: 180, color: '#1e293b' },
                { enabled: true, blur: 22, opacity: 65, saturation: 190, color: '#0f172a' },
                { enabled: true, blur: 20, opacity: 50, saturation: 160, color: '#1e293b' },
                { enabled: true, blur: 16, opacity: 60, saturation: 180, color: '#1e293b' },
                { enabled: true, blur: 25, opacity: 75, saturation: 200, color: '#0f172a' }
            ];
            
            for (let i = 0; i < 9; i++) {
                const boxContainer = document.createElement('div');
                boxContainer.className = 'nested-box-item';
                // Ensure container has proper dimensions
                boxContainer.style.cssText = 'width: 100%; height: 100%; min-width: 0; min-height: 0; position: relative;';
                gridContainer.appendChild(boxContainer);
                
                const box = new XWUIBox(boxContainer, {
                    content: `
                        <div style="color: var(--text-inverse, #ffffff); text-align: center; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 0.5rem;">
                            <div style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Box ${i + 1}</div>
                            <div style="font-size: 0.75rem; opacity: 0.9;">Blur: ${glassConfigs[i].blur}px</div>
                            <div style="font-size: 0.75rem; opacity: 0.9;">Opacity: ${glassConfigs[i].opacity}%</div>
                        </div>
                    `
                }, {
                    glassEffect: glassConfigs[i],
                    width: '100%',
                    height: '100%',
                    padding: '0'
                });
                
                boxes.push(box);
                boxComponents.push(box);
            }
            
            // Store for background updates
            const imageContainerDiv = imageContainer.closest('.demo-wrapper') || imageContainer;
            imageComponents.push({ image, container: imageContainerDiv });
            
            return { image, boxes };
        };
        
        try {
            // Basic box
            createBoxDemo('image-basic', {}, {
                content: 'Basic box content'
            });
            
            // Box with padding
            createBoxDemo('image-padding', {
                padding: '20px'
            }, {
                content: 'Box with padding'
            });
            
            // Box with background
            createBoxDemo('image-bg', {
                padding: 'var(--spacing-md)',
                className: 'xwui-box-bg-demo'
            }, {
                content: 'Box with background color'
            });
            
            // Box with gradient background
            createBoxDemo('image-gradient', {
                gradientBackground: true,
                padding: 0,
                className: 'xwui-box-gradient-demo'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Gradient Background Box</h2>
                        <p style="margin: 0; opacity: 0.9;">This box uses the gradient background option with colorful blurred blobs.</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">The gradient creates a modern, vibrant aesthetic perfect for hero sections, cards, or option buttons.</p>
                    </div>
                `
            });
            
            // Box with glass effect (default settings)
            createBoxDemo('image-glass-default', {
                glassEffect: true,
                padding: '2rem'
            }, {
                content: `
                    <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Glass Effect (Default)</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 60%, Saturation: 180%</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Perfect for modern UI designs with backdrop blur.</p>
                    </div>
                `
            });
            
            // Box with custom glass effect
            createBoxDemo('image-glass-custom', {
                glassEffect: {
                    enabled: true,
                    blur: 20,
                    opacity: 40,
                    saturation: 150,
                    color: '#1e293b'
                },
                padding: '2rem'
            }, {
                content: `
                    <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Custom Glass Effect</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 20px, Opacity: 40%, Saturation: 150%</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Fully customizable glassmorphism with adjustable blur, opacity, and saturation.</p>
                    </div>
                `
            });
            
            // Box with both glass effect and gradient background
            createBoxDemo('image-glass-gradient', {
                gradientBackground: true,
                glassEffect: {
                    enabled: true,
                    blur: 16,
                    opacity: 60,
                    saturation: 180,
                    color: '#0f172a'
                },
                padding: 0,
                className: 'xwui-box-glass-gradient-demo'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Glass + Gradient</h2>
                        <p style="margin: 0; opacity: 0.9;">Combining glass effect with gradient background for stunning visuals.</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">The glass effect creates a frosted overlay on top of the colorful gradient.</p>
                    </div>
                `
            });
            
            // Glass effect with high blur
            createBoxDemo('image-glass-high-blur', {
                glassEffect: {
                    enabled: true,
                    blur: 30,
                    opacity: 60,
                    saturation: 180,
                    color: '#1e293b'
                },
                padding: '2rem'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">High Blur</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 30px, Opacity: 60%, Saturation: 180%</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Stronger blur creates a more frosted glass appearance.</p>
                    </div>
                `
            });
            
            // Glass effect with low opacity
            createBoxDemo('image-glass-low-opacity', {
                glassEffect: {
                    enabled: true,
                    blur: 16,
                    opacity: 30,
                    saturation: 180,
                    color: '#1e293b'
                },
                padding: '2rem'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Low Opacity</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 30%, Saturation: 180%</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Lower opacity makes the background more visible through the glass.</p>
                    </div>
                `
            });
            
            // Glass effect with high saturation
            createBoxDemo('image-glass-high-sat', {
                glassEffect: {
                    enabled: true,
                    blur: 16,
                    opacity: 60,
                    saturation: 200,
                    color: '#1e293b'
                },
                padding: '2rem'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">High Saturation</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 60%, Saturation: 200%</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Maximum saturation intensifies the colors behind the glass.</p>
                    </div>
                `
            });
            
            // Glass effect with dark theme color
            createBoxDemo('image-glass-dark', {
                glassEffect: {
                    enabled: true,
                    blur: 20,
                    opacity: 70,
                    saturation: 180,
                    color: '#0f172a'
                },
                padding: '2rem'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Dark Theme</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 20px, Opacity: 70%, Color: #0f172a</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Dark background color for better contrast in dark themes.</p>
                    </div>
                `
            });
            
            // Glass effect with light theme color
            createBoxDemo('image-glass-light', {
                glassEffect: {
                    enabled: true,
                    blur: 16,
                    opacity: 50,
                    saturation: 150,
                    color: '#f8fafc'
                },
                padding: '2rem'
            }, {
                content: `
                    <div style="padding: 2rem; color: var(--text-inverse, #ffffff); text-align: center;">
                        <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Light Theme</h2>
                        <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 50%, Color: #f8fafc</p>
                        <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Light background color for bright, airy glass effects.</p>
                    </div>
                `
            });
            
            // Glass-only boxes (no image background)
            createGlassOnlyBox('glass-only-default', {
                enabled: true,
                blur: 16,
                opacity: 60,
                saturation: 180,
                color: '#1e293b'
            }, `
                <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Glass Only (Default)</h2>
                    <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 60%, Saturation: 180%</p>
                    <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Glass effect without image background - works on any background.</p>
                </div>
            `);
            
            createGlassOnlyBox('glass-only-high-blur', {
                enabled: true,
                blur: 30,
                opacity: 60,
                saturation: 180,
                color: '#1e293b'
            }, `
                <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">High Blur</h2>
                    <p style="margin: 0; opacity: 0.9;">Blur: 30px, Opacity: 60%, Saturation: 180%</p>
                    <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Stronger blur creates a more frosted appearance.</p>
                </div>
            `);
            
            createGlassOnlyBox('glass-only-low-opacity', {
                enabled: true,
                blur: 16,
                opacity: 30,
                saturation: 180,
                color: '#1e293b'
            }, `
                <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Low Opacity</h2>
                    <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 30%, Saturation: 180%</p>
                    <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Lower opacity makes the background more visible.</p>
                </div>
            `);
            
            createGlassOnlyBox('glass-only-high-sat', {
                enabled: true,
                blur: 16,
                opacity: 60,
                saturation: 200,
                color: '#1e293b'
            }, `
                <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">High Saturation</h2>
                    <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 60%, Saturation: 200%</p>
                    <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Maximum saturation intensifies colors behind the glass.</p>
                </div>
            `);
            
            createGlassOnlyBox('glass-only-dark', {
                enabled: true,
                blur: 20,
                opacity: 70,
                saturation: 180,
                color: '#0f172a'
            }, `
                <div style="color: var(--text-inverse, #ffffff); text-align: center;">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Dark Theme</h2>
                    <p style="margin: 0; opacity: 0.9;">Blur: 20px, Opacity: 70%, Color: #0f172a</p>
                    <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Dark background color for better contrast.</p>
                </div>
            `);
            
            createGlassOnlyBox('glass-only-light', {
                enabled: true,
                blur: 16,
                opacity: 50,
                saturation: 150,
                color: '#f8fafc'
            }, `
                <div style="color: var(--text-primary, #212529); text-align: center;">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; font-weight: 600;">Light Theme</h2>
                    <p style="margin: 0; opacity: 0.9;">Blur: 16px, Opacity: 50%, Color: #f8fafc</p>
                    <p style="margin: 1rem 0 0; opacity: 0.8; font-size: 0.875rem;">Light background color for bright glass effects.</p>
                </div>
            `);
            
            // Nested boxes - parent with image, 9 children with glass effect
            createNestedBoxes('image-nested-boxes');
            
            // Initialize with random images
            updateAllBackgrounds('random');
            
            // Add custom styles using CSS variables
            const style = document.createElement('style');
            style.textContent = `
                .xwui-box-bg-demo {
                    background-color: var(--bg-secondary, #f8f9fa);
                    border-radius: var(--radius-md, 8px);
                }
                
                .xwui-box-gradient-demo {
                    border-radius: var(--radius-lg, 16px);
                    overflow: hidden;
                }
                
                #box-gradient {
                    position: relative;
                    border-radius: var(--radius-lg, 16px);
                }
                
                #box-glass-default,
                #box-glass-custom,
                #box-glass-gradient,
                #box-glass-high-blur,
                #box-glass-low-opacity,
                #box-glass-high-sat,
                #box-glass-dark,
                #box-glass-light {
                    position: relative;
                }
                
                .xwui-box-glass-gradient-demo {
                    border-radius: var(--radius-lg, 16px);
                }
                
                /* Ensure glass effect boxes have proper positioning */
                .demo-wrapper {
                    position: relative;
                }
                
                /* Glass-only boxes styling */
                .glass-only-wrapper .xwui-box-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                /* Nested boxes styling */
                .nested-boxes-wrapper {
                    position: relative;
                }
                
                .nested-boxes-grid .nested-box-item .xwui-box-container {
                    border-radius: var(--radius-md, 8px);
                }
            `;
            document.head.appendChild(style);
            
            tester.setStatus('✅ XWUIBox initialized successfully', 'success');
            
        } catch (error) {
            tester.setStatus(`❌ Error: ${error.message}`, 'error');
            console.error('XWUIBox test error:', error);
        }
