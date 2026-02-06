
        import { XWUITester } from '../../XWUITester/index.ts';
        import { XWUIIcon } from '../index.ts';
        import { loadIconMappings } from '../../../styles/theme/icons/icon-mapping.ts';
        import { XWUIInputColor } from '../../XWUIInputColor/index.ts';
        import { XWUIComponent } from '../../XWUIComponent/XWUIComponent.ts';
        
        // Set CSS base path for automatic CSS loading
        // From tester HTML location: src/components/XWUIIcon/testers/
        // To components: src/components/ = go up 2 levels
        XWUIComponent.cssBasePath = '../../';
        
        // Initialize XWUITester
        const tester = new XWUITester(document.getElementById('tester-container'), {
            title: 'XWUIIcon Component Tester',
            desc: 'Test the XWUIIcon component with different configurations. Search for icons and configure all conf_comp properties.',
            componentName: 'XWUIIcon'
        }, {});
        
        const testArea = tester.getTestArea();
        
        let iconComponent = null;
        let allIconNames = [];
        let filteredIcons = [];
        
        // Load icon mappings
        async function loadIcons() {
            try {
                const mappings = await loadIconMappings();
                allIconNames = Array.from(mappings.keys()).sort();
                filteredIcons = [...allIconNames];
                console.log(`Loaded ${allIconNames.length} icons`);
            } catch (error) {
                console.error('Failed to load icons:', error);
            }
        }
        
        // Initialize
        await loadIcons();
        
        // Create controls panel
        const controlsPanel = document.createElement('div');
        controlsPanel.style.cssText = 'background: var(--color-background-secondary, #f5f5f5); border-radius: var(--radius-card, 8px); padding: 1.5rem; margin-bottom: 2rem; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1));';
        
        const controlsGrid = document.createElement('div');
        controlsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 1rem;';
        
        // Icon Name Search
        const iconNameGroup = document.createElement('div');
        iconNameGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const iconNameLabel = document.createElement('label');
        iconNameLabel.textContent = 'Icon Name (data.name)';
        iconNameLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconSearchContainer = document.createElement('div');
        iconSearchContainer.style.cssText = 'position: relative;';
        
        const iconNameInput = document.createElement('input');
        iconNameInput.type = 'text';
        iconNameInput.id = 'icon-name';
        iconNameInput.placeholder = "Search icon name (e.g., 'star', 'heart', 'home')";
        iconNameInput.autocomplete = 'off';
        iconNameInput.style.cssText = 'padding: 0.5rem; border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); font-size: 0.875rem; background: var(--color-background, #fff); color: var(--color-text, #333); width: 100%; box-sizing: border-box;';
        
        const iconSearchDropdown = document.createElement('div');
        iconSearchDropdown.id = 'icon-search-dropdown';
        iconSearchDropdown.style.cssText = 'position: absolute; top: 100%; left: 0; right: 0; max-height: 300px; overflow-y: auto; background: var(--color-background, #fff); border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1)); z-index: 1000; margin-top: 0.25rem; display: none;';
        
        iconSearchContainer.appendChild(iconNameInput);
        iconSearchContainer.appendChild(iconSearchDropdown);
        iconNameGroup.appendChild(iconNameLabel);
        iconNameGroup.appendChild(iconSearchContainer);
        controlsGrid.appendChild(iconNameGroup);
        
        // Library Dropdown
        const libraryGroup = document.createElement('div');
        libraryGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const libraryLabel = document.createElement('label');
        libraryLabel.textContent = 'Library (conf_comp.library)';
        libraryLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconLibrarySelect = document.createElement('select');
        iconLibrarySelect.id = 'icon-library';
        iconLibrarySelect.style.cssText = 'padding: 0.5rem; border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); font-size: 0.875rem; background: var(--color-background, #fff); color: var(--color-text, #333);';
        ['auto', 'bootstrap', 'heroicons', 'feather', 'radix', 'primeicons', 'ant-design', 'tabler'].forEach(lib => {
            const option = document.createElement('option');
            option.value = lib;
            option.textContent = lib === 'auto' ? 'Auto (find best match)' : lib.charAt(0).toUpperCase() + lib.slice(1) + ' Icons';
            iconLibrarySelect.appendChild(option);
        });
        
        libraryGroup.appendChild(libraryLabel);
        libraryGroup.appendChild(iconLibrarySelect);
        controlsGrid.appendChild(libraryGroup);
        
        // Variant Dropdown
        const variantGroup = document.createElement('div');
        variantGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const variantLabel = document.createElement('label');
        variantLabel.textContent = 'Variant (conf_comp.variant)';
        variantLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconVariantSelect = document.createElement('select');
        iconVariantSelect.id = 'icon-variant';
        iconVariantSelect.style.cssText = 'padding: 0.5rem; border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); font-size: 0.875rem; background: var(--color-background, #fff); color: var(--color-text, #333);';
        ['none', 'outline', 'solid', 'filled'].forEach(variant => {
            const option = document.createElement('option');
            option.value = variant;
            option.textContent = variant.charAt(0).toUpperCase() + variant.slice(1);
            if (variant === 'none') option.selected = true;
            iconVariantSelect.appendChild(option);
        });
        
        variantGroup.appendChild(variantLabel);
        variantGroup.appendChild(iconVariantSelect);
        controlsGrid.appendChild(variantGroup);
        
        // Size Input
        const sizeGroup = document.createElement('div');
        sizeGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Size (conf_comp.size)';
        sizeLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconSizeInput = document.createElement('input');
        iconSizeInput.type = 'text';
        iconSizeInput.id = 'icon-size';
        iconSizeInput.placeholder = "256 or '256px' or '2rem'";
        iconSizeInput.value = '256';
        iconSizeInput.style.cssText = 'padding: 0.5rem; border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); font-size: 0.875rem; background: var(--color-background, #fff); color: var(--color-text, #333);';
        
        sizeGroup.appendChild(sizeLabel);
        sizeGroup.appendChild(iconSizeInput);
        controlsGrid.appendChild(sizeGroup);
        
        // Color Input
        const colorGroup = document.createElement('div');
        colorGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Color (conf_comp.color)';
        colorLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconColorContainer = document.createElement('div');
        iconColorContainer.id = 'icon-color-container';
        
        colorGroup.appendChild(colorLabel);
        colorGroup.appendChild(iconColorContainer);
        controlsGrid.appendChild(colorGroup);
        
        // Class Name Input
        const classNameGroup = document.createElement('div');
        classNameGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const classNameLabel = document.createElement('label');
        classNameLabel.textContent = 'Class Name (conf_comp.className)';
        classNameLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconClassNameInput = document.createElement('input');
        iconClassNameInput.type = 'text';
        iconClassNameInput.id = 'icon-classname';
        iconClassNameInput.placeholder = 'Additional CSS classes';
        iconClassNameInput.style.cssText = 'padding: 0.5rem; border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); font-size: 0.875rem; background: var(--color-background, #fff); color: var(--color-text, #333);';
        
        classNameGroup.appendChild(classNameLabel);
        classNameGroup.appendChild(iconClassNameInput);
        controlsGrid.appendChild(classNameGroup);
        
        // Fallback Input
        const fallbackGroup = document.createElement('div');
        fallbackGroup.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;';
        
        const fallbackLabel = document.createElement('label');
        fallbackLabel.textContent = 'Fallback Icon (conf_comp.fallback)';
        fallbackLabel.style.cssText = 'font-weight: 500; font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        
        const iconFallbackInput = document.createElement('input');
        iconFallbackInput.type = 'text';
        iconFallbackInput.id = 'icon-fallback';
        iconFallbackInput.placeholder = 'Fallback icon name if primary not found';
        iconFallbackInput.style.cssText = 'padding: 0.5rem; border: 1px solid var(--color-border, #ddd); border-radius: var(--radius-input, 4px); font-size: 0.875rem; background: var(--color-background, #fff); color: var(--color-text, #333);';
        
        fallbackGroup.appendChild(fallbackLabel);
        fallbackGroup.appendChild(iconFallbackInput);
        controlsGrid.appendChild(fallbackGroup);
        
        controlsPanel.appendChild(controlsGrid);
        testArea.appendChild(controlsPanel);
        
        // Preview Section
        const previewSection = document.createElement('div');
        previewSection.style.cssText = 'background: var(--color-background-secondary, #f5f5f5); border-radius: var(--radius-card, 8px); padding: 2rem; text-align: center; min-height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;';
        
        const previewTitle = document.createElement('h2');
        previewTitle.textContent = 'Preview';
        previewSection.appendChild(previewTitle);
        
        const previewIconContainer = document.createElement('div');
        previewIconContainer.id = 'preview-icon-container';
        previewIconContainer.style.cssText = 'display: flex; align-items: center; justify-content: center; min-height: 150px;';
        
        const previewInfo = document.createElement('div');
        previewInfo.id = 'preview-info';
        previewInfo.style.cssText = 'font-size: 0.875rem; color: var(--color-text-secondary, #666);';
        previewInfo.textContent = 'Select an icon name to see the preview';
        
        previewSection.appendChild(previewIconContainer);
        previewSection.appendChild(previewInfo);
        testArea.appendChild(previewSection);
        
        // Initialize color picker
        let colorPicker = null;
        if (iconColorContainer) {
            colorPicker = new XWUIInputColor(
                iconColorContainer,
                {},
                {
                    view: 'minimized',
                    format: 'hex',
                    presets: [
                        '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', 
                        '#6f42c1', '#e83e8c', '#20c997', '#fd7e14', '#6c757d'
                    ],
                    placeholder: 'Color (e.g., #007bff)'
                }
            );
            
            // Update icon when color changes
            colorPicker.getPicker()?.onChange(() => {
                updateIcon();
            });
        }
        
        // Icon search functionality
        function filterIcons(searchTerm) {
            if (!searchTerm) return allIconNames;
            const term = searchTerm.toLowerCase();
            return allIconNames.filter(name => 
                name.toLowerCase().includes(term)
            );
        }
        
        function renderSearchDropdown(icons) {
            if (!iconSearchDropdown) return;
            
            iconSearchDropdown.innerHTML = '';
            
            if (icons.length === 0) {
                const item = document.createElement('div');
                item.className = 'icon-search-item';
                item.textContent = 'No icons found';
                item.style.cssText = 'padding: 0.5rem; cursor: default; border-bottom: 1px solid var(--color-border-light, #eee);';
                iconSearchDropdown.appendChild(item);
                return;
            }
            
            const displayIcons = icons.slice(0, 50); // Limit to 50 for performance
            
            displayIcons.forEach(iconName => {
                const item = document.createElement('div');
                item.className = 'icon-search-item';
                item.textContent = iconName;
                item.style.cssText = 'padding: 0.5rem; cursor: pointer; border-bottom: 1px solid var(--color-border-light, #eee);';
                item.addEventListener('mouseenter', () => {
                    item.style.background = 'var(--color-background-hover, #f0f0f0)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = '';
                });
                item.addEventListener('click', () => {
                    if (iconNameInput) {
                        iconNameInput.value = iconName;
                    }
                    iconSearchDropdown.classList.remove('show');
                    iconSearchDropdown.style.display = 'none';
                    updateIcon();
                });
                iconSearchDropdown.appendChild(item);
            });
            
            if (icons.length > 50) {
                const item = document.createElement('div');
                item.className = 'icon-search-item';
                item.textContent = `... and ${icons.length - 50} more (type to filter)`;
                item.style.cssText = 'padding: 0.5rem; cursor: default; font-style: italic;';
                iconSearchDropdown.appendChild(item);
            }
        }
        
        // Search input handler
        if (iconNameInput) {
            iconNameInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value;
                filteredIcons = filterIcons(searchTerm);
                renderSearchDropdown(filteredIcons);
                if (iconSearchDropdown) {
                    iconSearchDropdown.style.display = 'block';
                    iconSearchDropdown.classList.add('show');
                }
            });
            
            iconNameInput.addEventListener('focus', () => {
                if (filteredIcons.length > 0 && iconSearchDropdown) {
                    iconSearchDropdown.style.display = 'block';
                    iconSearchDropdown.classList.add('show');
                }
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (iconNameInput && iconSearchDropdown && 
                !iconNameInput.contains(target) && 
                !iconSearchDropdown.contains(target)) {
                iconSearchDropdown.classList.remove('show');
                iconSearchDropdown.style.display = 'none';
            }
        });
        
        // Parse size input
        function parseSize(sizeStr) {
            if (!sizeStr) return 256;
            
            // If it's just a number, return as number
            if (/^\d+$/.test(sizeStr.trim())) {
                return parseInt(sizeStr.trim(), 10);
            }
            
            // Otherwise return as string (supports '256px', '2rem', etc.)
            return sizeStr.trim();
        }
        
        // Update icon preview
        function updateIcon() {
            const iconName = iconNameInput.value.trim();
            const library = iconLibrarySelect.value;
            const variant = iconVariantSelect.value;
            const size = parseSize(iconSizeInput.value);
            const color = colorPicker?.getValue?.() || undefined;
            const className = iconClassNameInput.value.trim() || undefined;
            const fallback = iconFallbackInput.value.trim() || undefined;
            
            // Clear previous icon
            if (iconComponent) {
                iconComponent.destroy();
                iconComponent = null;
            }
            
            previewIconContainer.innerHTML = '';
            
            if (!iconName) {
                previewInfo.textContent = 'Enter an icon name to see the preview';
                return;
            }
            
            // Don't try to load icon if it's just a partial search term (less than 3 chars)
            // This prevents errors when typing in the search box
            if (iconName.length < 3) {
                previewInfo.textContent = 'Type at least 3 characters to search for an icon';
                return;
            }
            
            // Create new icon component
            try {
                const conf_comp = {
                    library,
                    variant,
                    size,
                };
                
                if (color) conf_comp.color = color;
                if (className) conf_comp.className = className;
                if (fallback) conf_comp.fallback = fallback;
                
                iconComponent = new XWUIIcon(
                    previewIconContainer,
                    { name: iconName },
                    conf_comp
                );
                
                // Update info
                const libraryDisplay = library === 'auto' ? 'auto (best match)' : library;
                previewInfo.innerHTML = `
                    Icon: <code>${iconName}</code><br>
                    Library: <code>${libraryDisplay}</code><br>
                    Variant: <code>${variant}</code><br>
                    Size: <code>${typeof size === 'number' ? size + 'px' : size}</code>
                    ${color ? `<br>Color: <code>${color}</code>` : ''}
                    ${className ? `<br>Class: <code>${className}</code>` : ''}
                    ${fallback ? `<br>Fallback: <code>${fallback}</code>` : ''}
                `;
            } catch (error) {
                previewInfo.textContent = `Error: ${error.message}`;
                console.error('Error creating icon:', error);
            }
        }
        
        // Add event listeners to all controls
        iconNameInput.addEventListener('change', updateIcon);
        iconLibrarySelect.addEventListener('change', updateIcon);
        iconVariantSelect.addEventListener('change', updateIcon);
        iconSizeInput.addEventListener('change', updateIcon);
        iconSizeInput.addEventListener('input', updateIcon);
        // Color picker changes are handled via onChange callback
        iconClassNameInput.addEventListener('change', updateIcon);
        iconFallbackInput.addEventListener('change', updateIcon);
        
        // Initial render
        if (allIconNames.length > 0) {
            renderSearchDropdown(allIconNames);
        }
        
        // Set default icon
        if (iconNameInput) {
            iconNameInput.value = 'star';
            updateIcon();
        }
