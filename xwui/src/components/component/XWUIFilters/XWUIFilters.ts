/**
 * XWUIFilters Component
 * Enhanced image filters with presets and custom filter creation
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUISlider } from '../XWUISlider/XWUISlider';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIScrollArea } from '../XWUIScrollArea/XWUIScrollArea';
import { XWUIImage } from '../XWUIImage/XWUIImage';

export interface FilterPreset {
    id: string;
    name: string;
    category: 'vintage' | 'modern' | 'artistic' | 'blackwhite' | 'color';
    filter: string; // CSS filter string
}

export interface CustomFilter {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
    blur?: number;
    sepia?: number;
    grayscale?: number;
    invert?: number;
}

// Component-level configuration
export interface XWUIFiltersConfig {
    showPresets?: boolean;
    showCustomControls?: boolean;
    showPreview?: boolean;
    imageElement?: HTMLElement | string;
    className?: string;
}

// Data type
export interface XWUIFiltersData {
    currentFilter?: string;
    customFilter?: CustomFilter;
    imageUrl?: string;
}

export class XWUIFilters extends XWUIComponent<XWUIFiltersData, XWUIFiltersConfig> {
    private wrapperElement: HTMLElement | null = null;
    private presetsElement: HTMLElement | null = null;
    private controlsElement: HTMLElement | null = null;
    private previewElement: HTMLElement | null = null;
    private imageElement: HTMLImageElement | null = null;
    private originalImageElement: HTMLElement | null = null;
    private filterPresets: FilterPreset[] = [
        { id: 'none', name: 'None', category: 'modern', filter: 'none' },
        { id: 'vintage', name: 'Vintage', category: 'vintage', filter: 'sepia(0.5) contrast(1.2)' },
        { id: 'blackwhite', name: 'Black & White', category: 'blackwhite', filter: 'grayscale(100%)' },
        { id: 'warm', name: 'Warm', category: 'color', filter: 'brightness(1.1) saturate(1.2) hue-rotate(-10deg)' },
        { id: 'cool', name: 'Cool', category: 'color', filter: 'brightness(0.95) saturate(0.8) hue-rotate(10deg)' },
        { id: 'dramatic', name: 'Dramatic', category: 'artistic', filter: 'contrast(1.5) brightness(0.9)' }
    ];
    private changeHandlers: Array<(filter: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIFiltersData = {},
        conf_comp: XWUIFiltersConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFiltersConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFiltersConfig {
        return {
            showPresets: conf_comp?.showPresets ?? true,
            showCustomControls: conf_comp?.showCustomControls ?? true,
            showPreview: conf_comp?.showPreview ?? true,
            imageElement: conf_comp?.imageElement,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-filters-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-filters';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Get image element
        if (this.config.imageElement) {
            if (typeof this.config.imageElement === 'string') {
                this.originalImageElement = document.querySelector(this.config.imageElement);
            } else {
                this.originalImageElement = this.config.imageElement;
            }
        }

        // Preview
        if (this.config.showPreview) {
            this.previewElement = this.createPreview();
            this.wrapperElement.appendChild(this.previewElement);
        }

        // Presets
        if (this.config.showPresets) {
            this.presetsElement = this.createPresets();
            this.wrapperElement.appendChild(this.presetsElement);
        }

        // Custom controls
        if (this.config.showCustomControls) {
            this.controlsElement = this.createCustomControls();
            this.wrapperElement.appendChild(this.controlsElement);
        }

        this.container.appendChild(this.wrapperElement);
    }

    private createPreview(): HTMLElement {
        const preview = document.createElement('div');
        preview.className = 'xwui-filters-preview';

        this.imageElement = document.createElement('img');
        this.imageElement.className = 'xwui-filters-preview-image';
        
        if (this.data.imageUrl) {
            this.imageElement.src = this.data.imageUrl;
        } else if (this.originalImageElement && this.originalImageElement instanceof HTMLImageElement) {
            this.imageElement.src = this.originalImageElement.src;
        }

        this.applyFilter();
        preview.appendChild(this.imageElement);

        return preview;
    }

    private createPresets(): HTMLElement {
        const presets = document.createElement('div');
        presets.className = 'xwui-filters-presets';

        const label = document.createElement('div');
        label.className = 'xwui-filters-label';
        label.textContent = 'Presets';
        presets.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'xwui-filters-presets-grid';

        this.filterPresets.forEach(preset => {
            const presetBtn = document.createElement('button');
            presetBtn.className = 'xwui-filters-preset';
            presetBtn.textContent = preset.name;
            presetBtn.setAttribute('data-filter-id', preset.id);
            
            if (this.data.currentFilter === preset.id) {
                presetBtn.classList.add('active');
            }

            presetBtn.onclick = () => {
                this.applyPreset(preset.id);
            };

            grid.appendChild(presetBtn);
        });

        presets.appendChild(grid);
        return presets;
    }

    private createCustomControls(): HTMLElement {
        const controls = document.createElement('div');
        controls.className = 'xwui-filters-controls';

        const label = document.createElement('div');
        label.className = 'xwui-filters-label';
        label.textContent = 'Custom Filter';
        controls.appendChild(label);

        if (!this.data.customFilter) {
            this.data.customFilter = {};
        }

        const sliders = [
            { key: 'brightness', label: 'Brightness', min: 0, max: 200, default: 100 },
            { key: 'contrast', label: 'Contrast', min: 0, max: 200, default: 100 },
            { key: 'saturation', label: 'Saturation', min: 0, max: 200, default: 100 },
            { key: 'hue', label: 'Hue', min: -180, max: 180, default: 0 },
            { key: 'blur', label: 'Blur', min: 0, max: 10, default: 0 },
            { key: 'sepia', label: 'Sepia', min: 0, max: 100, default: 0 },
            { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, default: 0 },
            { key: 'invert', label: 'Invert', min: 0, max: 100, default: 0 }
        ];

        sliders.forEach(slider => {
            const sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'xwui-filters-slider-wrapper';

            const sliderLabel = document.createElement('label');
            sliderLabel.className = 'xwui-filters-slider-label';
            sliderLabel.textContent = slider.label;
            sliderWrapper.appendChild(sliderLabel);

            const sliderInput = document.createElement('input');
            sliderInput.type = 'range';
            sliderInput.className = 'xwui-filters-slider';
            sliderInput.min = slider.min.toString();
            sliderInput.max = slider.max.toString();
            sliderInput.value = (this.data.customFilter?.[slider.key as keyof CustomFilter] as number || slider.default).toString();
            
            const valueDisplay = document.createElement('span');
            valueDisplay.className = 'xwui-filters-slider-value';
            valueDisplay.textContent = sliderInput.value;

            sliderInput.addEventListener('input', (e) => {
                const value = parseInt((e.target as HTMLInputElement).value, 10);
                if (!this.data.customFilter) this.data.customFilter = {};
                (this.data.customFilter as any)[slider.key] = value;
                valueDisplay.textContent = value.toString();
                this.applyCustomFilter();
            });

            sliderWrapper.appendChild(sliderInput);
            sliderWrapper.appendChild(valueDisplay);
            controls.appendChild(sliderWrapper);
        });

        // Reset button
        const resetBtn = document.createElement('button');
        resetBtn.className = 'xwui-filters-reset';
        resetBtn.textContent = 'Reset';
        resetBtn.onclick = () => {
            this.data.customFilter = {};
            this.render();
        };
        controls.appendChild(resetBtn);

        return controls;
    }

    private applyPreset(presetId: string): void {
        const preset = this.filterPresets.find(p => p.id === presetId);
        if (!preset) return;

        this.data.currentFilter = presetId;
        this.data.customFilter = undefined;
        this.applyFilter(preset.filter);
        this.render();
    }

    private applyCustomFilter(): void {
        if (!this.data.customFilter) return;

        const filter = this.buildFilterString(this.data.customFilter);
        this.data.currentFilter = 'custom';
        this.applyFilter(filter);
    }

    private buildFilterString(filter: CustomFilter): string {
        const parts: string[] = [];
        
        if (filter.brightness !== undefined) {
            parts.push(`brightness(${filter.brightness}%)`);
        }
        if (filter.contrast !== undefined) {
            parts.push(`contrast(${filter.contrast}%)`);
        }
        if (filter.saturation !== undefined) {
            parts.push(`saturate(${filter.saturation}%)`);
        }
        if (filter.hue !== undefined) {
            parts.push(`hue-rotate(${filter.hue}deg)`);
        }
        if (filter.blur !== undefined) {
            parts.push(`blur(${filter.blur}px)`);
        }
        if (filter.sepia !== undefined) {
            parts.push(`sepia(${filter.sepia}%)`);
        }
        if (filter.grayscale !== undefined) {
            parts.push(`grayscale(${filter.grayscale}%)`);
        }
        if (filter.invert !== undefined) {
            parts.push(`invert(${filter.invert}%)`);
        }

        return parts.length > 0 ? parts.join(' ') : 'none';
    }

    private applyFilter(filter?: string): void {
        if (!this.imageElement) return;

        if (filter) {
            this.imageElement.style.filter = filter;
        } else if (this.data.currentFilter) {
            const preset = this.filterPresets.find(p => p.id === this.data.currentFilter);
            if (preset) {
                this.imageElement.style.filter = preset.filter;
            }
        } else if (this.data.customFilter) {
            const filterStr = this.buildFilterString(this.data.customFilter);
            this.imageElement.style.filter = filterStr;
        } else {
            this.imageElement.style.filter = 'none';
        }

        this.changeHandlers.forEach(handler => {
            handler(this.imageElement!.style.filter);
        });
    }

    public setImage(imageUrl: string): void {
        this.data.imageUrl = imageUrl;
        if (this.imageElement) {
            this.imageElement.src = imageUrl;
        }
    }

    public getFilter(): string {
        return this.imageElement?.style.filter || 'none';
    }

    public onChange(handler: (filter: string) => void): void {
        this.changeHandlers.push(handler);
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIFilters as any).componentName = 'XWUIFilters';


