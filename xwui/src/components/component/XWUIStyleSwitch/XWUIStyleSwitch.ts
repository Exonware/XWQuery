/**
 * XWUIStyleSwitch Component
 * Style preset switch component that allows switching between system, preset, and custom themes
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIStyle, type XWUIStyleConfig } from '../XWUIStyle/XWUIStyle';
import { XWUISwitch } from '../XWUISwitch/XWUISwitch';
import type { XWUISwitchOption } from '../XWUISwitch/XWUISwitch';

// Component-level configuration
export interface XWUIStyleSwitchConfig {
    styleInstance?: XWUIStyle; // Optional: provide existing XWUIStyle instance
    styleConfig?: XWUIStyleConfig; // Optional: configuration for creating XWUIStyle instance
    iconSize?: number; // Size of icons in the switch (default: 16)
    size?: 'small' | 'medium' | 'large'; // Switch size
    className?: string;
}

// Data type
export interface XWUIStyleSwitchData {
    id?: string; // Component ID for cookie storage (e.g., "xwui-style-switch-testers")
    selectedPreset?: string; // Store the selected preset value
}

export class XWUIStyleSwitch extends XWUIComponent<XWUIStyleSwitchData, XWUIStyleSwitchConfig> {
    static componentName = 'XWUIStyleSwitch';
    private styleInstance: XWUIStyle | null = null;
    private switchInstance: XWUISwitch | null = null;
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIStyleSwitchData = {},
        conf_comp: XWUIStyleSwitchConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Enable cookies in config
        const configWithCookies = { ...conf_comp, cookies: true };
        super(container, data, configWithCookies, conf_sys, conf_usr);
        this.initialize();
    }
    
    /**
     * Called when data is reloaded from storage (cross-tab sync or same-page sync)
     * This happens when any component with the same ID updates its data
     */
    protected onDataReloaded(): void {
        // Reload preset from data and update switch
        // Since we share the same ID with style instance, check both property names
        // XWUIStyle stores it as 'preset', we store it as 'selectedPreset'
        const preset = this.data.selectedPreset || (this.styleInstance?.data as any)?.preset;
        
        // Also sync selectedPreset from preset if preset exists but selectedPreset doesn't
        if ((this.styleInstance?.data as any)?.preset && !this.data.selectedPreset) {
            this.data.selectedPreset = (this.styleInstance.data as any).preset;
        }
        
        if (preset && this.styleInstance) {
            const currentPreset = this.styleInstance.getPreset();
            if (preset !== currentPreset) {
                // Preset changed, update style instance
                this.styleInstance.setPreset(preset).then(() => {
                    if (this.switchInstance) {
                        this.switchInstance.setSelectedValue(preset);
                    }
                });
            } else if (this.switchInstance) {
                // Just update the switch UI to reflect current state
                this.switchInstance.setSelectedValue(preset);
            }
        }
    }

    protected createConfig(
        conf_comp?: XWUIStyleSwitchConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStyleSwitchConfig {
        return {
            styleInstance: conf_comp?.styleInstance,
            styleConfig: conf_comp?.styleConfig,
            iconSize: conf_comp?.iconSize ?? 16,
            size: conf_comp?.size ?? 'small',
            className: conf_comp?.className
        };
    }

    private async initialize(): Promise<void> {
        // Initialize or use provided style instance
        if (this.config.styleInstance) {
            this.styleInstance = this.config.styleInstance;
            // Don't register provided instance - it's managed externally
            // Wait a bit for style instance to finish loading cookies/data
            await new Promise(resolve => setTimeout(resolve, 150));
            // Apply preset from data if it exists and differs from current
            await this.applyPresetFromData();
            this.render();
        } else {
            // Create style instance if not provided
            // Use the same ID as this component so they sync together
            const styleContainer = document.createElement('div');
            styleContainer.style.display = 'none';
            document.body.appendChild(styleContainer);
            
            // Pass the same ID to the style instance so they share storage
            const styleData = this.data.id ? { id: this.data.id } : {};
            this.styleInstance = new XWUIStyle(
                styleContainer,
                styleData,
                this.config.styleConfig || {},
                this.conf_sys,
                this.conf_usr
            );
            // Register only if we created it
            this.registerChildComponent(this.styleInstance);
            
            // Wait for style instance to initialize and load data from cookies
            // Give it more time to ensure data is loaded from cookies
            await new Promise(resolve => setTimeout(resolve, 200));
            // Apply preset from data if it exists and differs from current
            await this.applyPresetFromData();
            this.render();
        }
    }

    /**
     * Apply preset from data to style instance if it exists and differs from current
     */
    private async applyPresetFromData(): Promise<void> {
        if (!this.styleInstance) return;
        
        // Get preset from data (loaded from cookies via base class)
        // Check both property names since they share the same storage
        // Also check style instance data which might have been loaded from cookies
        let preset = this.data.selectedPreset || (this.styleInstance?.data as any)?.preset;
        
        // If we still don't have a preset, check if style instance has loaded its data yet
        // Wait a bit more if needed for async data loading
        if (!preset) {
            // Give style instance a moment to load data from cookies
            await new Promise(resolve => setTimeout(resolve, 50));
            preset = this.data.selectedPreset || (this.styleInstance?.data as any)?.preset;
        }
        
        // Sync selectedPreset from preset if preset exists but selectedPreset doesn't
        if ((this.styleInstance?.data as any)?.preset && !this.data.selectedPreset) {
            this.data.selectedPreset = (this.styleInstance.data as any).preset;
            preset = this.data.selectedPreset;
        }
        
        if (preset) {
            const currentPreset = this.styleInstance.getPreset();
            if (preset !== currentPreset) {
                // Apply preset - this will also load custom theme if preset is 'custom'
                await this.styleInstance.setPreset(preset);
                // Ensure our data is synced
                this.updateData({ selectedPreset: preset });
            } else if (preset === currentPreset) {
                // Preset matches, but ensure our data is synced
                this.updateData({ selectedPreset: preset });
            }
        }
    }

    private async render(): Promise<void> {
        if (!this.styleInstance) {
            return;
        }

        this.container.innerHTML = '';
        
        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-style-switch';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        try {
            // Get available presets dynamically
            const availablePresets: string[] = [];
            try {
                const presets = await this.styleInstance.getAvailablePresets();
                availablePresets.push(...presets);
            } catch (error) {
                console.warn('Could not get available presets:', error);
                // Fallback to common presets
                availablePresets.push('light', 'dark');
            }

            // Determine initial preset value
            // Preset should already be applied in initialize(), so use current preset or data
            const initialCurrentPreset = this.styleInstance.getPreset();
            // Use saved preset from data if available, otherwise use current preset, otherwise default to 'system'
            const initialPreset = this.data.selectedPreset || initialCurrentPreset || 'system';

            // Map preset names to icons (common mappings)
            const presetIconMap: Record<string, string> = {
                'light': 'sun',
                'dark': 'moon',
                'night': 'moon',
                'day': 'sun',
                'auto': 'monitor',
                'system': 'monitor'
            };

            // Build switch options: system, then available presets, then custom
            const switchOptions: XWUISwitchOption[] = [];

            // Always add system first
            switchOptions.push({
                value: 'system',
                icon: 'monitor',
                iconConfig: { size: this.config.iconSize },
                tooltip: 'System (follows OS preference)'
            });

            // Add available presets with appropriate icons
            for (const preset of availablePresets) {
                const icon = presetIconMap[preset.toLowerCase()] || 'palette';
                switchOptions.push({
                    value: preset,
                    icon: icon,
                    iconConfig: { size: this.config.iconSize },
                    tooltip: `${preset.charAt(0).toUpperCase() + preset.slice(1)} theme preset`
                });
            }

            // Always add custom last
            switchOptions.push({
                value: 'custom',
                icon: 'sliders',
                iconConfig: { size: this.config.iconSize },
                tooltip: 'Custom (manual theme configuration)'
            });

            // Create switch instance
            const switchContainer = document.createElement('div');
            this.switchInstance = new XWUISwitch(
                switchContainer,
                {
                    selectedValue: initialPreset
                },
                {
                    mode: 'multi',
                    size: this.config.size,
                    options: switchOptions
                },
                this.conf_sys,
                this.conf_usr
            );
            this.registerChildComponent(this.switchInstance);

            // Handle preset change
            this.switchInstance.onMultiChange(async (selectedValue: string) => {
                if (this.styleInstance) {
                    // setPreset will update the style instance's data with 'preset' property
                    // We also save 'selectedPreset' to our own data for consistency
                    await this.styleInstance.setPreset(selectedValue);
                    // Save to our own data (automatically saves to cookies via base class)
                    // Since we share the same ID, this will merge with style instance's data
                    this.updateData({ selectedPreset: selectedValue });
                    // Sync switch with current preset after change
                    if (this.switchInstance) {
                        const updatedPreset = this.styleInstance.getPreset();
                        if (updatedPreset) {
                            this.switchInstance.setSelectedValue(updatedPreset);
                        }
                    }
                }
            });
            
            // Listen for style changes from other components (same-page sync)
            window.addEventListener('xwui-style-changed', ((event: CustomEvent) => {
                if (this.switchInstance && event.detail?.preset) {
                    const newPreset = event.detail.preset;
                    const currentPreset = this.styleInstance?.getPreset();
                    // Only update if preset actually changed and switch value differs
                    // Also check if our data already has this preset (to avoid loops)
                    if (currentPreset !== newPreset && this.data.selectedPreset !== newPreset) {
                        this.switchInstance.setSelectedValue(newPreset);
                        // Update data to keep in sync (only if different from current data)
                        this.updateData({ selectedPreset: newPreset });
                    } else if (currentPreset === newPreset && this.data.selectedPreset === newPreset) {
                        // Just update switch UI to match (no data update needed)
                        this.switchInstance.setSelectedValue(newPreset);
                    }
                }
            }) as EventListener);

            // Ensure switch reflects the correct preset value
            // If initialPreset was determined from storage, make sure switch shows it
            if (this.switchInstance) {
                const finalPreset = this.styleInstance.getPreset() || initialPreset;
                this.switchInstance.setSelectedValue(finalPreset);
            }

            this.wrapperElement.appendChild(switchContainer);
            this.container.appendChild(this.wrapperElement);
        } catch (error) {
            console.warn('Could not create style switch:', error);
            this.container.innerHTML = '<div class="xwui-style-switch-error">Style switch unavailable</div>';
        }
    }


    /**
     * Get the XWUIStyle instance
     */
    public getStyleInstance(): XWUIStyle | null {
        return this.styleInstance;
    }

    /**
     * Refresh the switch (reload presets and update state)
     */
    public async refresh(): Promise<void> {
        await this.render();
    }

    public destroy(): void {
        // Child components (styleInstance, switchInstance) are automatically destroyed by base class
        this.styleInstance = null;
        this.switchInstance = null;
        this.wrapperElement = null;
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIStyleSwitch as any).componentName = 'XWUIStyleSwitch';

