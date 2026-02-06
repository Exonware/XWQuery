/**
 * XWUITester Component
 * Base tester component for all XWUI component testers
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUITesterConfig {
    className?: string;
    defaultPlatform?: 'desktop' | 'tablet' | 'mobile';
    defaultOrientation?: 'portrait' | 'landscape';
}

// Data type
export interface XWUITesterData {
    title: string;
    desc: string;
    componentName: string;
    componentInstance?: any; // The component being tested
    componentConfig?: any; // The component's configuration
    componentData?: any; // The component's data
    systemConfig?: XWUISystemConfig; // System configuration
    userConfig?: XWUIUserConfig; // User configuration
}

export class XWUITester extends XWUIComponent<XWUITesterData, XWUITesterConfig> {
    private wrapperElement: HTMLElement | null = null;
    private headerElement: HTMLElement | null = null;
    private controlsElement: HTMLElement | null = null;
    private testAreaElement: HTMLElement | null = null;
    private statusElement: HTMLElement | null = null;
    private settingsDrawer: any = null;
    private platformOverlay: HTMLElement | null = null;
    private viewportContainer: HTMLElement | null = null;
    private currentPlatform: 'desktop' | 'tablet' | 'mobile' | null = null;
    private currentOrientation: 'portrait' | 'landscape' = 'portrait';
    private styleInstance: any = null; // XWUIStyle instance

    constructor(
        container: HTMLElement,
        data: XWUITesterData,
        conf_comp: XWUITesterConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Enable cookies in system config so all components inherit it
        const sysConfigWithCookies = { ...conf_sys, cookies: true };
        super(container, data, conf_comp, sysConfigWithCookies, conf_usr);
        // Render immediately so UI is visible
        this.render();
        // Initialize style in the background (non-blocking)
        this.initializeStyle().catch((error) => {
            console.warn('Style initialization failed:', error);
        });
        
        // Apply default platform after DOM is ready
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (this.config.defaultPlatform && this.config.defaultPlatform !== 'desktop') {
                    this.currentPlatform = this.config.defaultPlatform;
                    this.currentOrientation = this.config.defaultOrientation || 'portrait';
                    this.setPlatform(this.config.defaultPlatform, this.currentOrientation);
                } else {
                    // Default to desktop
                    this.currentPlatform = 'desktop';
                    this.currentOrientation = 'portrait';
                }
            });
        });
    }

    protected createConfig(
        conf_comp?: XWUITesterConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITesterConfig {
        return {
            className: conf_comp?.className,
            defaultPlatform: conf_comp?.defaultPlatform ?? 'desktop',
            defaultOrientation: conf_comp?.defaultOrientation ?? 'portrait'
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        // Main wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'tester-container';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Header
        this.headerElement = document.createElement('div');
        this.headerElement.className = 'test-header';
        
        // Create header content wrapper
        const headerContent = document.createElement('div');
        headerContent.className = 'test-header-content';
        
        // Component icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'test-header-icon';
        this.loadComponentIcon(iconContainer);
        headerContent.appendChild(iconContainer);
        
        // Text content wrapper
        const textWrapper = document.createElement('div');
        textWrapper.className = 'test-header-text';
        
        const titleElement = document.createElement('h1');
        titleElement.textContent = this.data.title;
        textWrapper.appendChild(titleElement);
        
        const descElement = document.createElement('p');
        descElement.textContent = this.data.desc;
        textWrapper.appendChild(descElement);
        
        headerContent.appendChild(textWrapper);
        
        // Preset switch (System/Custom + dynamic presets) - positioned before settings button
        const presetSwitchContainer = document.createElement('div');
        presetSwitchContainer.style.position = 'absolute';
        presetSwitchContainer.style.top = '0';
        presetSwitchContainer.style.right = '48px'; // Position before settings button
        presetSwitchContainer.style.display = 'flex';
        presetSwitchContainer.style.alignItems = 'center';
        
        // Create preset switch using XWUIStyleSwitch component
        (async () => {
            try {
                const { XWUIStyleSwitch } = await import('../XWUIStyleSwitch/index');
                
                // Ensure style instance is initialized
                if (!this.styleInstance) {
                    await this.initializeStyle();
                }
                
                // Create style switch with existing style instance
                const styleSwitch = new XWUIStyleSwitch(presetSwitchContainer, {}, {
                    styleInstance: this.styleInstance,
                    size: 'small',
                    iconSize: 16
                }, this.conf_sys, this.conf_usr);
                
                // Store reference for later access
                (this as any).presetSwitch = styleSwitch;
            } catch (error) {
                console.warn('Could not create style switch:', error);
            }
        })();
        
        headerContent.appendChild(presetSwitchContainer);
        
        // Settings button in top-right using XWUIButton + XWUIIcon
        const settingsBtnContainer = document.createElement('div');
        settingsBtnContainer.style.position = 'absolute';
        settingsBtnContainer.style.top = '0';
        settingsBtnContainer.style.right = '0';
        
        // Use async import to avoid blocking
        (async () => {
            const { XWUIButton } = await import('../XWUIButton/index');
            const { createIcon } = await import('../XWUIIcon/icon-utils');
            
            // Create button first (icon-only, no text, lightest border)
            const settingsBtn = new XWUIButton(settingsBtnContainer, '', {
                variant: 'ghost',
                size: 'large',
                border: 'lightest',
                title: 'Settings'
            }, this.conf_sys, this.conf_usr);
            
            // Ensure button has aria-label for accessibility (icon-only buttons need this)
            const btnElement = settingsBtnContainer.querySelector('button') || settingsBtnContainer;
            if (btnElement instanceof HTMLElement && !btnElement.getAttribute('aria-label')) {
                btnElement.setAttribute('aria-label', 'Settings');
            }
            
            // Create icon and insert it before the text
            try {
                // Try common settings icon names
                const iconNames = ['settings', 'gear', 'cog', 'sliders', 'options'];
                let iconCreated = false;
                
                for (const iconName of iconNames) {
                    try {
                        const { container: iconContainer } = createIcon(
                            this,
                            iconName,
                            { 
                                size: 20, 
                                variant: 'none',
                                library: 'auto',
                                fill: 'none',
                                className: 'xwui-icon-no-effects' 
                            },
                            this.conf_sys,
                            this.conf_usr
                        );
                        
                        // Insert icon at the beginning of button content
                        const buttonContent = btnElement.querySelector('.xwui-item') || btnElement;
                        if (buttonContent.firstChild) {
                            buttonContent.insertBefore(iconContainer, buttonContent.firstChild);
                        } else {
                            buttonContent.appendChild(iconContainer);
                        }
                        
                        // Button uses gap for spacing, so no margin needed
                        iconContainer.style.display = 'inline-flex';
                        iconContainer.style.alignItems = 'center';
                        
                        iconCreated = true;
                        break;
                    } catch (e) {
                        // Try next icon name
                        continue;
                    }
                }
                
                if (!iconCreated) {
                    console.warn('Could not create settings icon, using fallback');
                }
            } catch (error) {
                console.warn('Error creating icon:', error);
            }
            
            // Add click handler
            btnElement.addEventListener('click', () => {
                if (!this.settingsDrawer) {
                    this.initSettingsDrawer().then(() => {
                        if (this.settingsDrawer) {
                            this.settingsDrawer.open();
                        }
                    });
                } else {
                    this.settingsDrawer.open();
                }
            });
        })();
        
        headerContent.appendChild(settingsBtnContainer);
        
        this.headerElement.appendChild(headerContent);
        this.wrapperElement.appendChild(this.headerElement);

        // Controls area (for shared controls) - now empty, settings button moved to header
        this.controlsElement = document.createElement('div');
        this.controlsElement.className = 'test-controls';
        this.controlsElement.id = 'test-controls';
        // No longer creating controls here - settings button is in header
        this.wrapperElement.appendChild(this.controlsElement);

        // Test area
        this.testAreaElement = document.createElement('div');
        this.testAreaElement.className = 'test-area';
        this.testAreaElement.id = 'test-area';
        this.wrapperElement.appendChild(this.testAreaElement);

        // Status
        this.statusElement = document.createElement('div');
        this.statusElement.id = 'status';
        this.statusElement.className = 'status';
        this.statusElement.textContent = 'Initializing...';
        this.wrapperElement.appendChild(this.statusElement);

        this.container.appendChild(this.wrapperElement);
    }

    public getControlsElement(): HTMLElement | null {
        return this.controlsElement;
    }

    public getTestArea(): HTMLElement | null {
        return this.testAreaElement;
    }

    public getViewportContent(): HTMLElement | null {
        if (this.viewportContainer) {
            return this.viewportContainer.querySelector('.platform-viewport-content') as HTMLElement;
        }
        return null;
    }

    public getStatusElement(): HTMLElement | null {
        return this.statusElement;
    }

    public setStatus(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `status ${type}`;
        }
    }

    /**
     * Initialize XWUIStyle to load all theme styles (base, brand, style, theme, typography, etc.)
     * XWUIStyle will automatically read configuration from HTML data attributes
     */
    private async initializeStyle(): Promise<void> {
        // Only initialize once
        if (this.styleInstance) {
            return;
        }

        try {
            const { XWUIStyle } = await import('../XWUIStyle/index');
            
            // Create a hidden container for XWUIStyle
            const styleContainer = document.createElement('div');
            styleContainer.style.display = 'none';
            document.body.appendChild(styleContainer);
            
            // Initialize XWUIStyle - it will automatically read from HTML data attributes
            // and system/user config. Only provide basePath, XWUIStyle handles the rest.
            this.styleInstance = new XWUIStyle(styleContainer, {}, {
                basePath: '../../../styles',
                autoLoad: true
            }, this.conf_sys, this.conf_usr);
        } catch (error) {
            console.warn('Could not initialize XWUIStyle:', error);
        }
    }


    private async createStyleSelectorContent(): Promise<HTMLElement> {
        const { XWUIStyleSelector } = await import('../XWUIStyleSelector/index');
        
        // Ensure style instance is initialized
        if (!this.styleInstance) {
            await this.initializeStyle();
        }
        
        // Create container for style selector
        const selectorContainer = document.createElement('div');
        selectorContainer.style.padding = 'var(--spacing-md, 1rem)';
        selectorContainer.style.width = '100%';
        
        // Create XWUIStyleSelector instance using the existing style instance
        const styleSelector = new XWUIStyleSelector(selectorContainer, {}, {
            basePath: '../../../styles',
            styleInstance: this.styleInstance
        });
        
        return selectorContainer;
    }

    private async initSettingsDrawer(): Promise<void> {
        // Use XWUIMenuDrawer (there's no XWUIDrawer - XWUIMenuDrawer is the drawer component)
        const { XWUIMenuDrawer } = await import('../XWUIMenuDrawer/index');
        const { XWUITabs } = await import('../XWUITabs/index');
        
        const drawerContainer = document.createElement('div');
        drawerContainer.style.display = 'none';
        document.body.appendChild(drawerContainer);

        // Create tabs container with proper height constraints
        const tabsContainer = document.createElement('div');
        tabsContainer.style.width = '100%';
        tabsContainer.style.height = '100%';
        tabsContainer.style.display = 'flex';
        tabsContainer.style.flexDirection = 'column';
        tabsContainer.style.minHeight = '0';
        tabsContainer.style.overflowY = 'auto';
        tabsContainer.style.overflowX = 'hidden';

        // Create tab contents
        const styleContent = await this.createStyleSelectorContent();
        const systemContent = this.createSystemSettingsContent();
        const userContent = this.createUserSettingsContent();
        const componentSettingsContent = this.createComponentSettingsContent();
        const componentDataContent = this.createComponentDataContent();
        const platformContent = this.createPlatformSelectorContent();

        // Note: Tab panels will be made scrollable via CSS

        // Create tabs instance
        const tabsInstance = new XWUITabs(tabsContainer, {
            tabs: [
                { id: 'style', label: 'Style Selector', content: styleContent },
                { id: 'system', label: 'System Settings', content: systemContent },
                { id: 'user', label: 'User Settings', content: userContent },
                { id: 'component-settings', label: 'Component Settings', content: componentSettingsContent },
                { id: 'component-data', label: 'Component Data', content: componentDataContent },
                { id: 'platform', label: 'Platform', content: platformContent }
            ],
            activeTab: 'style'
        }, {
            variant: 'line',
            size: 'medium',
            orientation: 'horizontal',
            fullWidth: true
        });

        // Create drawer with top placement
        this.settingsDrawer = new XWUIMenuDrawer(drawerContainer, {
            title: 'Settings',
            content: tabsContainer
        }, {
            placement: 'top',
            size: 'large',
            closable: true,
            closeOnBackdrop: true,
            closeOnEscape: true,
            mask: true
        });
        
        // Add class to drawer body to enable tab-specific styling
        // We need to wait for drawer to be created, so use setTimeout
        setTimeout(() => {
            const drawerBody = drawerContainer.querySelector('.xwui-drawer-body');
            if (drawerBody) {
                drawerBody.classList.add('xwui-drawer-body-with-tabs');
            }
        }, 0);

        this.settingsDrawer.onClose(() => {
            // Don't remove container, keep it for reuse
        });
    }

    private createSystemSettingsContent(): HTMLElement {
        const content = document.createElement('div');
        content.style.padding = 'var(--spacing-md, 1rem)';
        
        // Editable textarea
        const textarea = document.createElement('textarea');
        textarea.setAttribute('aria-label', 'System settings configuration');
        textarea.setAttribute('title', 'System settings configuration');
        textarea.style.width = '100%';
        textarea.style.minHeight = '400px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '0.875rem';
        textarea.style.padding = 'var(--spacing-md, 1rem)';
        textarea.style.border = '1px solid var(--border-color, #e0e0e0)';
        textarea.style.borderRadius = 'var(--radius-md, 8px)';
        textarea.style.background = 'var(--bg-secondary, #f5f5f5)';
        textarea.style.color = 'var(--text-primary, #000)';
        textarea.style.resize = 'vertical';
        textarea.value = JSON.stringify(this.data.systemConfig || this.conf_sys || {}, null, 2);
        
        // Apply button using XWUIButton
        const applyBtnContainer = document.createElement('div');
        applyBtnContainer.style.marginTop = 'var(--spacing-md, 1rem)';
        
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            const applyBtn = new XWUIButton(applyBtnContainer, 'Apply', {
                variant: 'primary',
                size: 'medium'
            });
            
            const btnElement = applyBtnContainer.querySelector('button') || applyBtnContainer;
            btnElement.addEventListener('click', () => {
                try {
                    const parsed = JSON.parse(textarea.value);
                    this.data.systemConfig = parsed;
                    // Optionally trigger update if component supports it
                    if (this.data.componentInstance && typeof this.data.componentInstance.updateConfig === 'function') {
                        this.data.componentInstance.updateConfig(parsed);
                    }
                } catch (error: any) {
                    alert(`Invalid JSON: ${error?.message || error}`);
                }
            });
        });

        content.appendChild(textarea);
        content.appendChild(applyBtnContainer);
        return content;
    }

    private createUserSettingsContent(): HTMLElement {
        const content = document.createElement('div');
        content.style.padding = 'var(--spacing-md, 1rem)';
        
        // Editable textarea
        const textarea = document.createElement('textarea');
        textarea.setAttribute('aria-label', 'User settings configuration');
        textarea.setAttribute('title', 'User settings configuration');
        textarea.style.width = '100%';
        textarea.style.minHeight = '400px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '0.875rem';
        textarea.style.padding = 'var(--spacing-md, 1rem)';
        textarea.style.border = '1px solid var(--border-color, #e0e0e0)';
        textarea.style.borderRadius = 'var(--radius-md, 8px)';
        textarea.style.background = 'var(--bg-secondary, #f5f5f5)';
        textarea.style.color = 'var(--text-primary, #000)';
        textarea.style.resize = 'vertical';
        textarea.value = JSON.stringify(this.data.userConfig || this.conf_usr || {}, null, 2);
        
        // Apply button using XWUIButton
        const applyBtnContainer = document.createElement('div');
        applyBtnContainer.style.marginTop = 'var(--spacing-md, 1rem)';
        
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            const applyBtn = new XWUIButton(applyBtnContainer, 'Apply', {
                variant: 'primary',
                size: 'medium'
            });
            
            const btnElement = applyBtnContainer.querySelector('button') || applyBtnContainer;
            btnElement.addEventListener('click', () => {
                try {
                    const parsed = JSON.parse(textarea.value);
                    this.data.userConfig = parsed;
                    // Optionally trigger update if component supports it
                    if (this.data.componentInstance && typeof this.data.componentInstance.updateConfig === 'function') {
                        this.data.componentInstance.updateConfig(undefined, parsed);
                    }
                } catch (error: any) {
                    alert(`Invalid JSON: ${error?.message || error}`);
                }
            });
        });

        content.appendChild(textarea);
        content.appendChild(applyBtnContainer);
        return content;
    }

    private createComponentSettingsContent(): HTMLElement {
        const content = document.createElement('div');
        content.style.padding = 'var(--spacing-md, 1rem)';
        
        // Editable textarea
        const textarea = document.createElement('textarea');
        textarea.setAttribute('aria-label', `${this.data.componentName} component settings configuration`);
        textarea.setAttribute('title', `${this.data.componentName} component settings configuration`);
        textarea.style.width = '100%';
        textarea.style.minHeight = '400px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '0.875rem';
        textarea.style.padding = 'var(--spacing-md, 1rem)';
        textarea.style.border = '1px solid var(--border-color, #e0e0e0)';
        textarea.style.borderRadius = 'var(--radius-md, 8px)';
        textarea.style.background = 'var(--bg-secondary, #f5f5f5)';
        textarea.style.color = 'var(--text-primary, #000)';
        textarea.style.resize = 'vertical';
        
        const config = this.data.componentConfig || 
                      (this.data.componentInstance?.config) || 
                      {};
        textarea.value = JSON.stringify(config, null, 2);
        
        // Apply button using XWUIButton
        const applyBtnContainer = document.createElement('div');
        applyBtnContainer.style.marginTop = 'var(--spacing-md, 1rem)';
        
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            const applyBtn = new XWUIButton(applyBtnContainer, 'Apply', {
                variant: 'primary',
                size: 'medium'
            });
            
            const btnElement = applyBtnContainer.querySelector('button') || applyBtnContainer;
            btnElement.addEventListener('click', () => {
                try {
                    const parsed = JSON.parse(textarea.value);
                    this.data.componentConfig = parsed;
                    // Update component config if instance exists
                    if (this.data.componentInstance) {
                        if (this.data.componentInstance.config !== undefined) {
                            this.data.componentInstance.config = parsed;
                        }
                        if (typeof this.data.componentInstance.updateConfig === 'function') {
                            this.data.componentInstance.updateConfig(parsed);
                        }
                        if (typeof this.data.componentInstance.render === 'function') {
                            this.data.componentInstance.render();
                        }
                    }
                } catch (error: any) {
                    alert(`Invalid JSON: ${error?.message || error}`);
                }
            });
        });

        content.appendChild(textarea);
        content.appendChild(applyBtnContainer);
        return content;
    }

    private loadComponentIcon(container: HTMLElement): void {
        if (!this.data.componentName) return;
        
        // Convert component name to icon path
        // Tester HTML is in: src/components/{ComponentName}/testers/Tester{ComponentName}.html
        // SVG is in: src/components/{ComponentName}/{componentname}.svg
        // So from tester HTML, path is: ../{componentname}.svg
        // SVG filename must be all lowercase (e.g., XWUIWorkflow -> xwuiworkflow.svg)
        const componentName = this.data.componentName;
        const iconFileName = componentName.toLowerCase() + '.svg';
        // Path is relative to tester HTML location (one level up from testers/ folder)
        const iconPath = `../${iconFileName}`;
        
        // Create img element for SVG
        const iconImg = document.createElement('img');
        iconImg.className = 'test-component-icon';
        iconImg.src = iconPath;
        iconImg.alt = `${componentName} Icon`;
        iconImg.onerror = () => {
            // If icon fails to load, hide the container gracefully
            container.style.display = 'none';
        };
        
        container.appendChild(iconImg);
    }

    private createComponentDataContent(): HTMLElement {
        const content = document.createElement('div');
        content.style.padding = 'var(--spacing-md, 1rem)';
        
        // Editable textarea
        const textarea = document.createElement('textarea');
        textarea.setAttribute('aria-label', `${this.data.componentName} component data configuration`);
        textarea.setAttribute('title', `${this.data.componentName} component data configuration`);
        textarea.style.width = '100%';
        textarea.style.minHeight = '400px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '0.875rem';
        textarea.style.padding = 'var(--spacing-md, 1rem)';
        textarea.style.border = '1px solid var(--border-color, #e0e0e0)';
        textarea.style.borderRadius = 'var(--radius-md, 8px)';
        textarea.style.background = 'var(--bg-secondary, #f5f5f5)';
        textarea.style.color = 'var(--text-primary, #000)';
        textarea.style.resize = 'vertical';
        
        const data = this.data.componentData || 
                    (this.data.componentInstance?.data) || 
                    {};
        textarea.value = JSON.stringify(data, null, 2);
        
        // Apply button using XWUIButton
        const applyBtnContainer = document.createElement('div');
        applyBtnContainer.style.marginTop = 'var(--spacing-md, 1rem)';
        
        import('../XWUIButton/index').then(({ XWUIButton }) => {
            const applyBtn = new XWUIButton(applyBtnContainer, 'Apply', {
                variant: 'primary',
                size: 'medium'
            });
            
            const btnElement = applyBtnContainer.querySelector('button') || applyBtnContainer;
            btnElement.addEventListener('click', () => {
                try {
                    const parsed = JSON.parse(textarea.value);
                    this.data.componentData = parsed;
                    // Update component data if instance exists
                    if (this.data.componentInstance) {
                        if (this.data.componentInstance.data !== undefined) {
                            this.data.componentInstance.data = parsed;
                        }
                        if (typeof this.data.componentInstance.updateData === 'function') {
                            this.data.componentInstance.updateData(parsed);
                        }
                        if (typeof this.data.componentInstance.render === 'function') {
                            this.data.componentInstance.render();
                        }
                    }
                } catch (error: any) {
                    alert(`Invalid JSON: ${error?.message || error}`);
                }
            });
        });

        content.appendChild(textarea);
        content.appendChild(applyBtnContainer);
        return content;
    }

    private createPlatformSelectorContent(): HTMLElement {
        const content = document.createElement('div');
        content.style.padding = 'var(--spacing-md, 1rem)';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.gap = 'var(--spacing-sm, 0.5rem)';

        // Platform options
        const platformOptions = [
            { id: 'desktop', label: 'Desktop' },
            { id: 'tablet-portrait', label: 'Tablet (Portrait)' },
            { id: 'tablet-landscape', label: 'Tablet (Landscape)' },
            { id: 'mobile-portrait', label: 'Mobile (Portrait)' },
            { id: 'mobile-landscape', label: 'Mobile (Landscape)' }
        ];

        platformOptions.forEach((option) => {
            const optionBtnContainer = document.createElement('div');
            optionBtnContainer.style.width = '100%';
            
            import('../XWUIButton/index').then(({ XWUIButton }) => {
                const optionBtn = new XWUIButton(optionBtnContainer, option.label, {
                    variant: 'outline',
                    size: 'medium',
                    fullWidth: true
                });
                
                const btnElement = optionBtnContainer.querySelector('button') || optionBtnContainer;
                btnElement.style.justifyContent = 'flex-start';
                btnElement.style.textAlign = 'left';
                btnElement.addEventListener('click', () => {
                    if (option.id === 'desktop') {
                        this.setPlatform('desktop', 'portrait');
                    } else if (option.id === 'tablet-portrait') {
                        this.setPlatform('tablet', 'portrait');
                    } else if (option.id === 'tablet-landscape') {
                        this.setPlatform('tablet', 'landscape');
                    } else if (option.id === 'mobile-portrait') {
                        this.setPlatform('mobile', 'portrait');
                    } else if (option.id === 'mobile-landscape') {
                        this.setPlatform('mobile', 'landscape');
                    }
                });
            });
            
            content.appendChild(optionBtnContainer);
        });

        // Initialize with default platform from config (only if not already set)
        if (!this.currentPlatform) {
            this.currentPlatform = this.config.defaultPlatform || 'desktop';
            this.currentOrientation = this.config.defaultOrientation || 'portrait';
        }

        return content;
    }

    public setPlatform(platform: 'desktop' | 'tablet' | 'mobile', orientation: 'portrait' | 'landscape' = 'portrait'): void {
        this.currentPlatform = platform;
        this.currentOrientation = orientation;
        
        // Update button text
        const triggerBtn = document.getElementById('platform-selector-trigger');
        if (triggerBtn) {
            if (platform === 'desktop') {
                triggerBtn.textContent = 'Platform: Desktop';
            } else {
                triggerBtn.textContent = `Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)} (${orientation.charAt(0).toUpperCase() + orientation.slice(1)})`;
            }
        }

        // Platform dimensions (width x height) - portrait is default
        const platformDimensions: Record<string, { portrait: { width: number; height: number }; landscape: { width: number; height: number } }> = {
            desktop: { portrait: { width: 1920, height: 1080 }, landscape: { width: 1920, height: 1080 } },
            tablet: { portrait: { width: 768, height: 1024 }, landscape: { width: 1024, height: 768 } },
            mobile: { portrait: { width: 375, height: 667 }, landscape: { width: 667, height: 375 } }
        };

        const dimensions = platformDimensions[platform][orientation];

        if (!this.testAreaElement) return;

        // Remove existing viewport container and overlay
        this.cleanupPlatformViewport();

        // If desktop, don't apply viewport simulation
        if (platform === 'desktop') {
            return;
        }

        // Create overlay
        this.platformOverlay = document.createElement('div');
        this.platformOverlay.className = 'platform-viewport-overlay';
        document.body.appendChild(this.platformOverlay);

        // Calculate scale to fit viewport (max 90% of screen)
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        const scaleX = maxWidth / dimensions.width;
        const scaleY = maxHeight / dimensions.height;
        const scale = Math.min(scaleX, scaleY, 1);

        const scaledWidth = dimensions.width * scale;
        const scaledHeight = dimensions.height * scale;

        // Create viewport container wrapper
        this.viewportContainer = document.createElement('div');
        this.viewportContainer.className = 'platform-viewport-container';
        this.viewportContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: ${scaledWidth}px;
            height: ${scaledHeight}px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            overflow: hidden;
            pointer-events: auto;
        `;

        // Create header with close button
        const viewportHeader = document.createElement('div');
        viewportHeader.className = 'platform-viewport-header';
        viewportHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            background: #f5f5f5;
            border-bottom: 1px solid #ddd;
            border-radius: 8px 8px 0 0;
        `;

        const headerText = document.createElement('span');
        headerText.textContent = `${platform.charAt(0).toUpperCase() + platform.slice(1)} - ${orientation.charAt(0).toUpperCase() + orientation.slice(1)} (${dimensions.width} × ${dimensions.height})`;
        headerText.style.cssText = `
            font-size: 0.875rem;
            font-weight: 500;
            color: #333;
        `;
        viewportHeader.appendChild(headerText);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'platform-viewport-close';
        closeBtn.setAttribute('aria-label', 'Close platform viewport');
        closeBtn.setAttribute('title', 'Close platform viewport');
        closeBtn.style.cssText = `
            background: transparent;
            border: none;
            font-size: 1.5rem;
            line-height: 1;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background 0.2s;
        `;
        closeBtn.onmouseenter = () => {
            closeBtn.style.background = '#e0e0e0';
        };
        closeBtn.onmouseleave = () => {
            closeBtn.style.background = 'transparent';
        };
        closeBtn.onclick = () => {
            this.setPlatform('desktop', 'portrait');
        };
        viewportHeader.appendChild(closeBtn);

        this.viewportContainer.appendChild(viewportHeader);

        // Create scrollable content area
        const viewportScrollArea = document.createElement('div');
        viewportScrollArea.className = 'platform-viewport-scroll';
        viewportScrollArea.style.cssText = `
            width: 100%;
            height: calc(100% - 40px);
            overflow: auto;
        `;

        // Create inner content container with actual dimensions
        const viewportContent = document.createElement('div');
        viewportContent.className = 'platform-viewport-content';
        viewportContent.style.cssText = `
            width: ${dimensions.width}px;
            min-height: ${dimensions.height}px;
            padding: 1rem;
            box-sizing: border-box;
            transform-origin: top left;
            transform: scale(${scale});
            margin: 0 auto;
        `;

        // Move test area content into viewport (preserving references)
        const testAreaChildren = Array.from(this.testAreaElement.children);
        testAreaChildren.forEach(child => {
            viewportContent.appendChild(child);
        });
        
        viewportScrollArea.appendChild(viewportContent);
        this.viewportContainer.appendChild(viewportScrollArea);
        document.body.appendChild(this.viewportContainer);

        // Update test area to maintain layout space
        this.testAreaElement.style.cssText = `
            min-height: ${scaledHeight}px;
            position: relative;
        `;

        // Create a proxy for window dimensions within the viewport
        this.simulateViewportDimensions(dimensions.width, dimensions.height);
    }

    private simulateViewportDimensions(width: number, height: number): void {
        // Create a style element to inject CSS custom properties
        let styleEl = document.getElementById('platform-viewport-simulation');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'platform-viewport-simulation';
            document.head.appendChild(styleEl);
        }

        // Inject CSS that components can use
        styleEl.textContent = `
            .platform-viewport-container {
                --simulated-viewport-width: ${width}px;
                --simulated-viewport-height: ${height}px;
            }
        `;

        // Dispatch a custom event that components can listen to
        const event = new CustomEvent('viewport-change', {
            detail: { width, height, platform: this.currentPlatform }
        });
        window.dispatchEvent(event);
    }

    public getCurrentPlatform(): 'desktop' | 'tablet' | 'mobile' | null {
        return this.currentPlatform;
    }

    public getViewportDimensions(): { width: number; height: number } | null {
        if (!this.currentPlatform) return null;
        
        const platformDimensions: Record<string, { portrait: { width: number; height: number }; landscape: { width: number; height: number } }> = {
            desktop: { portrait: { width: 1920, height: 1080 }, landscape: { width: 1920, height: 1080 } },
            tablet: { portrait: { width: 768, height: 1024 }, landscape: { width: 1024, height: 768 } },
            mobile: { portrait: { width: 375, height: 667 }, landscape: { width: 667, height: 375 } }
        };

        return platformDimensions[this.currentPlatform][this.currentOrientation];
    }

    public getCurrentOrientation(): 'portrait' | 'landscape' {
        return this.currentOrientation;
    }

    /**
     * Get system configuration (useful for components created in tester HTML)
     */
    public getSystemConfig(): XWUISystemConfig | undefined {
        return this.conf_sys;
    }

    /**
     * Get user configuration (useful for components created in tester HTML)
     */
    public getUserConfig(): XWUIUserConfig | undefined {
        return this.conf_usr;
    }

    private cleanupPlatformViewport(): void {
        // Restore test area children from viewport container
        if (this.viewportContainer && this.testAreaElement) {
            const viewportContent = this.viewportContainer.querySelector('.platform-viewport-content');
            if (viewportContent) {
                const children = Array.from(viewportContent.children);
                children.forEach(child => {
                    this.testAreaElement!.appendChild(child);
                });
            }
        }

        // Remove viewport container
        if (this.viewportContainer) {
            this.viewportContainer.remove();
            this.viewportContainer = null;
        }

        // Remove overlay
        if (this.platformOverlay) {
            this.platformOverlay.remove();
            this.platformOverlay = null;
        }

        // Reset test area styles
        if (this.testAreaElement) {
            this.testAreaElement.style.cssText = '';
        }
    }

    /**
     * Wait for XWUITester to be fully ready (styles loaded, components initialized)
     * Returns a promise that resolves when everything is loaded
     */
    public async waitForReady(): Promise<void> {
        // Wait for style initialization
        if (!this.styleInstance) {
            await this.initializeStyle();
        }
        
        // Wait for all CSS to load
        await new Promise<void>((resolve) => {
            const checkStyles = () => {
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                let loaded = 0;
                let total = links.length;
                
                if (total === 0) {
                    resolve();
                    return;
                }
                
                links.forEach(link => {
                    const linkEl = link as HTMLLinkElement;
                    if (linkEl.sheet || linkEl.href === '' || linkEl.href.includes('data:')) {
                        loaded++;
                    } else {
                        linkEl.onload = () => {
                            loaded++;
                            if (loaded === total) {
                                resolve();
                            }
                        };
                        linkEl.onerror = () => {
                            loaded++;
                            if (loaded === total) {
                                resolve();
                            }
                        };
                    }
                });
                
                if (loaded === total) {
                    resolve();
                } else {
                    // Fallback timeout
                    setTimeout(() => {
                        if (loaded < total) {
                            resolve();
                        }
                    }, 2000);
                }
            };
            
            // Wait for next frame to ensure DOM is ready
            requestAnimationFrame(() => {
                requestAnimationFrame(checkStyles);
            });
        });
        
        // Small delay to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    public destroy(): void {
        this.cleanupPlatformViewport();
        if (this.settingsDrawer) {
            this.settingsDrawer.destroy();
            this.settingsDrawer = null;
        }
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUITester as any).componentName = 'XWUITester';

