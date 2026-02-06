/**
 * XWUIRangeSlider Component
 * Dual-thumb slider for range selection
 * Wraps XWUISlider with range mode enabled
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUISlider, type XWUISliderConfig, type XWUISliderData } from '../XWUISlider/XWUISlider';

export interface XWUIRangeSliderConfig extends XWUISliderConfig {
    range?: boolean; // Always true for RangeSlider
}

export interface XWUIRangeSliderData extends XWUISliderData {
    value?: [number, number]; // Range tuple
}

export class XWUIRangeSlider extends XWUIComponent<XWUIRangeSliderData, XWUIRangeSliderConfig> {
    private sliderInstance: XWUISlider | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIRangeSliderData = {},
        conf_comp: XWUIRangeSliderConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        // Ensure value is array for range
        const rangeData: XWUISliderData = {
            ...data,
            value: Array.isArray(data.value) ? data.value : [conf_comp.min || 0, conf_comp.max || 100]
        };

        super(container, rangeData as any, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIRangeSliderConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIRangeSliderConfig {
        return {
            range: true, // Always true for range slider
            ...conf_comp
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-range-slider-container';

        // Convert to XWUISlider data/config
        const sliderData: XWUISliderData = {
            ...this.data,
            value: Array.isArray(this.data.value) ? this.data.value : [this.config.min || 0, this.config.max || 100]
        };

        const sliderConfig: XWUISliderConfig = {
            ...this.config
        };

        // Create XWUISlider instance (it already supports range via [number, number] value)
        this.sliderInstance = new XWUISlider(this.container, sliderData, sliderConfig, this.conf_sys, this.conf_usr);
    }

    public getValue(): [number, number] | undefined {
        if (!this.sliderInstance) return undefined;
        const value = this.sliderInstance['data'].value;
        if (Array.isArray(value) && value.length === 2) {
            return [value[0], value[1]];
        }
        return undefined;
    }

    public setValue(value: [number, number]): void {
        this.data.value = value;
        if (this.sliderInstance) {
            (this.sliderInstance as any).data.value = value;
            this.sliderInstance['render']();
        }
    }

    public destroy(): void {
        if (this.sliderInstance) {
            this.sliderInstance = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIRangeSlider as any).componentName = 'XWUIRangeSlider';


