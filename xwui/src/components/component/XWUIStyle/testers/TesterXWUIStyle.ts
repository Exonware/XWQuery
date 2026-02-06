import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIStyle/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        import { XWUIStyle } from '../index.ts';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIStyle Component Tester',
            desc: 'This tester demonstrates the XWUIStyle component with dynamic theme controls. Use the dropdowns below to change theme settings. The data parameter (highest priority) will override all configuration levels.',
            componentName: 'XWUIStyle'
        }, {});
        
        const testArea = tester.getTestArea();
        
        // Add test content to test area
        const template = document.getElementById('tester-xwuistyle-content');
        if (template && template instanceof HTMLTemplateElement) {
            testArea.appendChild(template.content.cloneNode(true));
        }
        // XWUIStyle already imported at top of script
        import { XWUIButton } from '../../XWUIButton/index.ts';
        import { XWUIConsole } from '../../XWUIConsole/index.ts';
        
        // Initialize XWUIStyle component
        // Use the same ID as other test pages to sync across pages
        const sharedId = 'xwui-style-testers';
        const styleContainer = document.getElementById('xwui-style-container');
        const xwuiStyle = new XWUIStyle(styleContainer, { id: sharedId }, {
            autoLoad: true
        });
        
        // Get theme manifest
        const manifest = xwuiStyle.getManifest();
        
        // Get available shapes for a category from schema
        function getShapesForCategory(category) {
            // Shapes from schema - lines and roundness have many, font has fewer
            const allShapes = {
                lines: ['accordion', 'alert', 'avatar', 'badge', 'body', 'button', 'calendar', 'caption', 'carousel', 'chip', 'code', 'container', 'content', 'control', 'dialog', 'feedback', 'headings', 'input', 'label', 'media', 'menu', 'navigation', 'overlay', 'pagination', 'photo', 'popover', 'progress', 'sidebar', 'skeleton', 'tab', 'table', 'toast', 'tooltip'],
                roundness: ['accordion', 'alert', 'avatar', 'badge', 'body', 'button', 'calendar', 'caption', 'carousel', 'chip', 'code', 'container', 'content', 'control', 'dialog', 'feedback', 'headings', 'input', 'label', 'media', 'menu', 'navigation', 'overlay', 'pagination', 'photo', 'popover', 'progress', 'sidebar', 'skeleton', 'tab', 'table', 'toast', 'tooltip'],
                font: ['body', 'button', 'caption', 'code', 'headings', 'input', 'label']
            };
            return allShapes[category] || [];
        }
        
        // Populate two-dropdown control (target + value)
        async function populateTwoDropdownControl(category, styleInstance) {
            const targetSelect = document.getElementById(`${category}-target-select`);
            const valueSelect = document.getElementById(`${category}-value-select`);
            
            // Populate target dropdown (Preset, ALL, or specific shape)
            targetSelect.innerHTML = '';
            const presetOption = document.createElement('option');
            presetOption.value = 'preset';
            presetOption.textContent = 'Preset (Global)';
            targetSelect.appendChild(presetOption);
            
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = 'ALL (All Components)';
            targetSelect.appendChild(allOption);
            
            const shapes = getShapesForCategory(category);
            shapes.forEach(shape => {
                const option = document.createElement('option');
                option.value = shape;
                option.textContent = shape.charAt(0).toUpperCase() + shape.slice(1);
                targetSelect.appendChild(option);
            });
            
            // Initial population of value dropdown
            async function updateValueDropdown() {
                valueSelect.innerHTML = '';
                
                let options = [];
                if (category === 'lines') {
                    options = await styleInstance.getThemeLoader().getLinesOptions();
                } else if (category === 'roundness') {
                    options = await styleInstance.getThemeLoader().getRoundnessOptions();
                } else if (category === 'font') {
                    options = await styleInstance.getThemeLoader().getFonts();
                }
                
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.id;
                    if (category === 'font') {
                        option.textContent = opt.title;
                    } else {
                        option.textContent = `${opt.title} - ${opt.description}`;
                    }
                    valueSelect.appendChild(option);
                });
            }
            
            // Initial population
            await updateValueDropdown();
        }
        
        // Populate dropdowns with options from manifest
        async function populateDropdowns() {
            // Brand dropdown
            const brandSelect = document.getElementById('brand-select');
            const brands = await xwuiStyle.getThemeLoader().getBrands();
            brandSelect.innerHTML = '';
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.id;
                option.textContent = brand.title;
                brandSelect.appendChild(option);
            });
            
            // Style dropdown
            const styleSelect = document.getElementById('style-select');
            const styles = await xwuiStyle.getThemeLoader().getStyles();
            styleSelect.innerHTML = '';
            styles.forEach(style => {
                const option = document.createElement('option');
                option.value = style.id;
                option.textContent = `${style.title} - ${style.description}`;
                option.selected = style.default || false;
                styleSelect.appendChild(option);
            });
            
            // Color dropdown
            const colorSelect = document.getElementById('color-select');
            const colors = await xwuiStyle.getThemeLoader().getColors();
            colorSelect.innerHTML = '';
            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.id;
                option.textContent = color.title;
                option.selected = color.default || false;
                if (color.colorShades?.primary) {
                    option.dataset.color = color.colorShades.primary;
                }
                colorSelect.appendChild(option);
            });
            updateColorPreview('color-preview', colorSelect);
            
            // Accent dropdown
            const accentSelect = document.getElementById('accent-select');
            const accents = await xwuiStyle.getThemeLoader().getAccents();
            accentSelect.innerHTML = '';
            accents.forEach(accent => {
                const option = document.createElement('option');
                option.value = accent.id;
                option.textContent = accent.title;
                option.selected = accent.default || false;
                if (accent.colorShades?.primary) {
                    option.dataset.color = accent.colorShades.primary;
                }
                accentSelect.appendChild(option);
            });
            updateColorPreview('accent-preview', accentSelect);
            
            // Lines dropdowns (target + value)
            await populateTwoDropdownControl('lines', xwuiStyle);
            
            // Roundness dropdowns (target + value)
            await populateTwoDropdownControl('roundness', xwuiStyle);
            
            // Font dropdowns (target + value)
            await populateTwoDropdownControl('font', xwuiStyle);
            
            // Icons dropdown
            const iconsSelect = document.getElementById('icons-select');
            const iconsOptions = await xwuiStyle.getThemeLoader().getIconsOptions();
            iconsSelect.innerHTML = '';
            iconsOptions.forEach(icons => {
                const option = document.createElement('option');
                option.value = icons.id;
                option.textContent = icons.title;
                option.selected = icons.default || false;
                iconsSelect.appendChild(option);
            });
            
            // Emojis dropdown
            const emojisSelect = document.getElementById('emojis-select');
            const emojisOptions = await xwuiStyle.getThemeLoader().getEmojisOptions();
            emojisSelect.innerHTML = '';
            emojisOptions.forEach(emojis => {
                const option = document.createElement('option');
                option.value = emojis.id;
                option.textContent = emojis.title;
                option.selected = emojis.default || false;
                emojisSelect.appendChild(option);
            });
        }
        
        function updateColorPreview(previewId, select) {
            const preview = document.getElementById(previewId);
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption && selectedOption.dataset.color) {
                preview.style.background = selectedOption.dataset.color;
            } else {
                preview.style.background = 'transparent';
            }
        }
        
        // Load current theme into dropdowns
        async function loadCurrentTheme() {
            const currentTheme = xwuiStyle.getTheme();
            
            if (currentTheme.brand) {
                const brandSelect = document.getElementById('brand-select');
                brandSelect.value = currentTheme.brand;
            }
            
            if (currentTheme.style) {
                const styleSelect = document.getElementById('style-select');
                styleSelect.value = currentTheme.style;
            }
            
            if (currentTheme.color) {
                const colorSelect = document.getElementById('color-select');
                colorSelect.value = currentTheme.color;
                updateColorPreview('color-preview', colorSelect);
            }
            
            if (currentTheme.accent) {
                const accentSelect = document.getElementById('accent-select');
                accentSelect.value = currentTheme.accent;
                updateColorPreview('accent-preview', accentSelect);
            }
            
            // Helper to update value dropdown when target changes
            async function updateValueDropdownForCategory(category) {
                const targetSelect = document.getElementById(`${category}-target-select`);
                const valueSelect = document.getElementById(`${category}-value-select`);
                const target = targetSelect.value;
                
                valueSelect.innerHTML = '';
                
                let options = [];
                if (category === 'lines') {
                    options = await xwuiStyle.getThemeLoader().getLinesOptions();
                } else if (category === 'roundness') {
                    options = await xwuiStyle.getThemeLoader().getRoundnessOptions();
                } else if (category === 'font') {
                    options = await xwuiStyle.getThemeLoader().getFonts();
                }
                
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.id;
                    if (category === 'font') {
                        option.textContent = opt.title;
                    } else {
                        option.textContent = `${opt.title} - ${opt.description}`;
                    }
                    valueSelect.appendChild(option);
                });
            }
            
            // Helper to check if all shapes have the same value
            function checkIfAllShapesSame(category, valueObj) {
                if (typeof valueObj !== 'object' || valueObj === null) return null;
                
                const shapes = getShapesForCategory(category);
                if (shapes.length === 0) return null;
                
                // Get the first shape value
                const firstShape = shapes.find(shape => valueObj[shape]);
                if (!firstShape) return null;
                
                const firstValue = valueObj[firstShape];
                
                // Check if all shapes have the same value
                const allSame = shapes.every(shape => {
                    const shapeValue = valueObj[shape];
                    return shapeValue === firstValue;
                });
                
                return allSame ? firstValue : null;
            }
            
            // Handle lines (can be string or object)
            if (currentTheme.lines) {
                const linesTargetSelect = document.getElementById('lines-target-select');
                const linesValueSelect = document.getElementById('lines-value-select');
                if (typeof currentTheme.lines === 'string') {
                    linesTargetSelect.value = 'preset';
                    await updateValueDropdownForCategory('lines');
                    linesValueSelect.value = currentTheme.lines;
                } else if (typeof currentTheme.lines === 'object' && currentTheme.lines !== null) {
                    // Check if all shapes have the same value
                    const allSameValue = checkIfAllShapesSame('lines', currentTheme.lines);
                    if (allSameValue) {
                        linesTargetSelect.value = 'all';
                        await updateValueDropdownForCategory('lines');
                        linesValueSelect.value = allSameValue;
                    } else if (currentTheme.lines.preset) {
                        linesTargetSelect.value = 'preset';
                        await updateValueDropdownForCategory('lines');
                        linesValueSelect.value = currentTheme.lines.preset;
                    } else {
                        // Find first shape override
                        const shapes = getShapesForCategory('lines');
                        const firstShape = shapes.find(shape => currentTheme.lines[shape]);
                        if (firstShape) {
                            linesTargetSelect.value = firstShape;
                            await updateValueDropdownForCategory('lines');
                            linesValueSelect.value = currentTheme.lines[firstShape];
                        }
                    }
                }
            }
            
            // Handle roundness (can be string or object)
            if (currentTheme.roundness) {
                const roundnessTargetSelect = document.getElementById('roundness-target-select');
                const roundnessValueSelect = document.getElementById('roundness-value-select');
                if (typeof currentTheme.roundness === 'string') {
                    roundnessTargetSelect.value = 'preset';
                    await updateValueDropdownForCategory('roundness');
                    roundnessValueSelect.value = currentTheme.roundness;
                } else if (typeof currentTheme.roundness === 'object' && currentTheme.roundness !== null) {
                    const allSameValue = checkIfAllShapesSame('roundness', currentTheme.roundness);
                    if (allSameValue) {
                        roundnessTargetSelect.value = 'all';
                        await updateValueDropdownForCategory('roundness');
                        roundnessValueSelect.value = allSameValue;
                    } else if (currentTheme.roundness.preset) {
                        roundnessTargetSelect.value = 'preset';
                        await updateValueDropdownForCategory('roundness');
                        roundnessValueSelect.value = currentTheme.roundness.preset;
                    } else {
                        const shapes = getShapesForCategory('roundness');
                        const firstShape = shapes.find(shape => currentTheme.roundness[shape]);
                        if (firstShape) {
                            roundnessTargetSelect.value = firstShape;
                            await updateValueDropdownForCategory('roundness');
                            roundnessValueSelect.value = currentTheme.roundness[firstShape];
                        }
                    }
                }
            }
            
            // Handle font (can be string or object)
            if (currentTheme.font) {
                const fontTargetSelect = document.getElementById('font-target-select');
                const fontValueSelect = document.getElementById('font-value-select');
                if (typeof currentTheme.font === 'string') {
                    fontTargetSelect.value = 'preset';
                    await updateValueDropdownForCategory('font');
                    fontValueSelect.value = currentTheme.font;
                } else if (typeof currentTheme.font === 'object' && currentTheme.font !== null) {
                    const allSameValue = checkIfAllShapesSame('font', currentTheme.font);
                    if (allSameValue) {
                        fontTargetSelect.value = 'all';
                        await updateValueDropdownForCategory('font');
                        fontValueSelect.value = allSameValue;
                    } else if (currentTheme.font.preset) {
                        fontTargetSelect.value = 'preset';
                        await updateValueDropdownForCategory('font');
                        fontValueSelect.value = currentTheme.font.preset;
                    } else {
                        const shapes = getShapesForCategory('font');
                        const firstShape = shapes.find(shape => currentTheme.font[shape]);
                        if (firstShape) {
                            fontTargetSelect.value = firstShape;
                            await updateValueDropdownForCategory('font');
                            fontValueSelect.value = currentTheme.font[firstShape];
                        }
                    }
                }
            }
            
            if (currentTheme.icons) {
                const iconsSelect = document.getElementById('icons-select');
                iconsSelect.value = currentTheme.icons;
            }
            
            if (currentTheme.emojis) {
                const emojisSelect = document.getElementById('emojis-select');
                emojisSelect.value = currentTheme.emojis;
            }
            
            updateThemeConfigDisplay();
        }
        
        // Update theme config display
        function updateThemeConfigDisplay() {
            const display = document.getElementById('theme-config-display');
            const currentTheme = xwuiStyle.getTheme();
            display.textContent = JSON.stringify(currentTheme, null, 2);
        }
        
        // Setup handler for two-dropdown control
        function setupTwoDropdownHandler(category, styleInstance) {
            const targetSelect = document.getElementById(`${category}-target-select`);
            const valueSelect = document.getElementById(`${category}-value-select`);
            
            function updateTheme() {
                const target = targetSelect.value;
                const value = valueSelect.value;
                
                if (!value) return;
                
                let update = {};
                if (target === 'preset') {
                    // Simple string value for preset
                    update[category] = value;
                } else if (target === 'all') {
                    // Set all shapes to the same value
                    const shapes = getShapesForCategory(category);
                    const newValue = { preset: value };
                    // Set all shapes to the same value
                    shapes.forEach(shape => {
                        newValue[shape] = value;
                    });
                    update[category] = newValue;
                } else {
                    // Object with shape override
                    const currentTheme = styleInstance.getTheme();
                    const currentValue = currentTheme[category];
                    
                    let newValue = {};
                    if (typeof currentValue === 'object' && currentValue !== null) {
                        // Preserve existing structure
                        newValue = { ...currentValue };
                    } else if (typeof currentValue === 'string') {
                        // Convert string to object with preset
                        newValue = { preset: currentValue };
                    }
                    
                    // Set the shape override
                    newValue[target] = value;
                    update[category] = newValue;
                }
                
                styleInstance.updateThemeData(update);
                updateThemeConfigDisplay();
            }
            
            targetSelect.addEventListener('change', async () => {
                // Update value dropdown when target changes
                const target = targetSelect.value;
                valueSelect.innerHTML = '';
                
                let options = [];
                if (category === 'lines') {
                    options = await styleInstance.getThemeLoader().getLinesOptions();
                } else if (category === 'roundness') {
                    options = await styleInstance.getThemeLoader().getRoundnessOptions();
                } else if (category === 'font') {
                    options = await styleInstance.getThemeLoader().getFonts();
                }
                
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.id;
                    if (category === 'font') {
                        option.textContent = opt.title;
                    } else {
                        option.textContent = `${opt.title} - ${opt.description}`;
                    }
                    valueSelect.appendChild(option);
                });
                
                // Try to preserve current value if it exists
                const currentTheme = styleInstance.getTheme();
                const currentValue = currentTheme[category];
                if (currentValue) {
                    if (target === 'preset') {
                        if (typeof currentValue === 'string') {
                            valueSelect.value = currentValue;
                        } else if (currentValue.preset) {
                            valueSelect.value = currentValue.preset;
                        }
                    } else if (target === 'all') {
                        // Check if all shapes have the same value
                        const allSameValue = checkIfAllShapesSame(category, currentValue);
                        if (allSameValue) {
                            valueSelect.value = allSameValue;
                        } else if (typeof currentValue === 'object' && currentValue.preset) {
                            valueSelect.value = currentValue.preset;
                        }
                    } else if (typeof currentValue === 'object' && currentValue[target]) {
                        valueSelect.value = currentValue[target];
                    }
                }
            });
            
            valueSelect.addEventListener('change', updateTheme);
        }
        
        // Handle dropdown changes
        function setupDropdownHandlers() {
            document.getElementById('brand-select').addEventListener('change', (e) => {
                xwuiStyle.updateThemeData({ brand: e.target.value });
                updateThemeConfigDisplay();
            });
            
            document.getElementById('style-select').addEventListener('change', (e) => {
                xwuiStyle.updateThemeData({ style: e.target.value });
                updateThemeConfigDisplay();
            });
            
            document.getElementById('color-select').addEventListener('change', (e) => {
                xwuiStyle.updateThemeData({ color: e.target.value });
                updateColorPreview('color-preview', e.target);
                updateThemeConfigDisplay();
            });
            
            document.getElementById('accent-select').addEventListener('change', (e) => {
                xwuiStyle.updateThemeData({ accent: e.target.value });
                updateColorPreview('accent-preview', e.target);
                updateThemeConfigDisplay();
            });
            
            // Lines handlers (two dropdowns)
            setupTwoDropdownHandler('lines', xwuiStyle);
            
            // Roundness handlers (two dropdowns)
            setupTwoDropdownHandler('roundness', xwuiStyle);
            
            // Font handlers (two dropdowns)
            setupTwoDropdownHandler('font', xwuiStyle);
            
            document.getElementById('icons-select').addEventListener('change', (e) => {
                xwuiStyle.updateThemeData({ icons: e.target.value });
                updateThemeConfigDisplay();
            });
            
            document.getElementById('emojis-select').addEventListener('change', (e) => {
                xwuiStyle.updateThemeData({ emojis: e.target.value });
                updateThemeConfigDisplay();
            });
        }
        
        // Reset button
        document.getElementById('btn-reset').addEventListener('click', () => {
            // Clear data to use defaults from config/system
            xwuiStyle.data = {};
            // Reload theme (will use defaults from config)
            xwuiStyle.loadTheme();
            loadCurrentTheme();
        });
        
        // Save button
        document.getElementById('btn-save').addEventListener('click', () => {
            const currentTheme = xwuiStyle.getTheme();
            localStorage.setItem('xwui-style-tester-theme', JSON.stringify(currentTheme));
            alert('Theme saved');
        });
        
        // Load button
        document.getElementById('btn-load').addEventListener('click', () => {
            const saved = localStorage.getItem('xwui-style-tester-theme');
            if (saved) {
                const theme = JSON.parse(saved);
                xwuiStyle.updateThemeData(theme);
                loadCurrentTheme();
            } else {
                alert('No saved theme found');
            }
        });
        
        // Initialize buttons
        function initButtons() {
            const variants = [
                { id: 'btn-primary', label: 'Primary', variant: 'primary' },
                { id: 'btn-secondary', label: 'Secondary', variant: 'secondary' },
                { id: 'btn-success', label: 'Success', variant: 'success' },
                { id: 'btn-danger', label: 'Danger', variant: 'danger' },
                { id: 'btn-warning', label: 'Warning', variant: 'warning' },
                { id: 'btn-outline', label: 'Outline', variant: 'outline' }
            ];
            
            variants.forEach(({ id, label, variant }) => {
                const container = document.getElementById(id);
                if (container) {
                    new XWUIButton(container, label, { variant });
                }
            });
            
            const sizes = [
                { id: 'btn-small', label: 'Small', size: 'small' },
                { id: 'btn-medium', label: 'Medium', size: 'medium' },
                { id: 'btn-large', label: 'Large', size: 'large' }
            ];
            
            sizes.forEach(({ id, label, size }) => {
                const container = document.getElementById(id);
                if (container) {
                    new XWUIButton(container, label, { size, variant: 'primary' });
                }
            });
        }
        
        // Initialize console
        function initConsole() {
            const consoleContainer = document.getElementById('consoleContainer');
            if (consoleContainer) {
                const xwConsole = new XWUIConsole(consoleContainer, {
                    theme: 'light',
                    maxEntries: 100,
                    showTimestamp: true,
                    autoScroll: true
                });
                
                xwConsole.data = [
                    { id: 1, type: "system", color: "#888", label: "SYSTEM", msg: "XWUIStyle component initialized" },
                    { id: 2, type: "info", color: "#4aa3ff", label: "INFO", msg: "Theme controls ready" },
                    { id: 3, type: "success", color: "#2ecc71", label: "OK", msg: "All UI elements loaded" },
                    { id: 4, type: "log", color: "#ffffff", label: "LOG", msg: "Use dropdowns above to change theme (data parameter)" }
                ];
                
                // Update console theme when page theme changes
                const observer = new MutationObserver(() => {
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    xwConsole.setTheme(currentTheme === 'dark' || currentTheme === 'night' ? 'dark' : 'light');
                });
                
                observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: ['data-theme']
                });
            }
        }
        
        // Initialize everything
        (async () => {
            await populateDropdowns();
            await loadCurrentTheme();
            setupDropdownHandlers();
            initButtons();
            initConsole();
            
            console.log('XWUIStyle tester initialized');
            console.log('Current theme:', JSON.stringify(xwuiStyle.getTheme(), null, 2));
            const options = await xwuiStyle.getThemeLoader().getThemeOptionsForUI();
            console.log('Available options:', JSON.stringify(options, null, 2));
        })();
