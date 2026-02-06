/**
 * XWUIInputLocation Component
 * Location picker input with map integration
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIMap, type XWUIMapLocation } from '../XWUIMap/XWUIMap';

// Component-level configuration
export interface XWUIInputLocationConfig {
    apiKey?: string;
    placeholder?: string;
    showMap?: boolean;
    mapHeight?: string;
    className?: string;
}

// Data type
export interface XWUIInputLocationData {
    value?: XWUIMapLocation;
    address?: string;
}

export class XWUIInputLocation extends XWUIComponent<XWUIInputLocationData, XWUIInputLocationConfig> {
    private inputElement: HTMLElement | null = null;
    private inputField: HTMLInputElement | null = null;
    private mapContainer: HTMLElement | null = null;
    private mapInstance: XWUIMap | null = null;
    private changeHandlers: Array<(location: XWUIMapLocation, address?: string) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIInputLocationData = {},
        conf_comp: XWUIInputLocationConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIInputLocationConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIInputLocationConfig {
        return {
            apiKey: conf_comp?.apiKey,
            placeholder: conf_comp?.placeholder ?? 'Enter location or click on map',
            showMap: conf_comp?.showMap ?? true,
            mapHeight: conf_comp?.mapHeight ?? '300px',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.inputElement = document.createElement('div');
        this.inputElement.className = 'xwui-locationinput';
        
        if (this.config.className) {
            this.inputElement.classList.add(this.config.className);
        }

        // Input field
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'xwui-locationinput-input-wrapper';

        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.className = 'xwui-locationinput-input';
        this.inputField.placeholder = this.config.placeholder || 'Enter location or click on map';
        this.inputField.value = this.data.address || '';
        
        this.inputField.addEventListener('change', () => {
            // In a real implementation, you would geocode the address here
            this.data.address = this.inputField?.value || '';
        });

        inputWrapper.appendChild(this.inputField);
        this.inputElement.appendChild(inputWrapper);

        // Map
        if (this.config.showMap) {
            this.mapContainer = document.createElement('div');
            this.mapContainer.className = 'xwui-locationinput-map';
            this.mapContainer.style.height = this.config.mapHeight || '300px';

            const center = this.data.value || { lat: 24.7136, lng: 46.6753 };
            
            this.mapInstance = new XWUIMap(
                this.mapContainer,
                {
                    markers: this.data.value ? [this.data.value] : []
                },
                {
                    apiKey: this.config.apiKey,
                    center: center,
                    zoom: 13
                }
            );

            // Add click handler to map (would need to extend XWUIMap for this)
            // For now, we'll use a marker that can be moved
            this.inputElement.appendChild(this.mapContainer);
        }

        this.container.appendChild(this.inputElement);
    }

    public setLocation(location: XWUIMapLocation, address?: string): void {
        this.data.value = location;
        if (address) {
            this.data.address = address;
            if (this.inputField) {
                this.inputField.value = address;
            }
        }
        
        if (this.mapInstance) {
            this.mapInstance.setCenter(location);
            this.mapInstance.addMarker(location);
        }
        
        this.changeHandlers.forEach(handler => handler(location, address));
    }

    public getLocation(): XWUIMapLocation | undefined {
        return this.data.value;
    }

    public getAddress(): string | undefined {
        return this.data.address || this.inputField?.value;
    }

    public onChange(handler: (location: XWUIMapLocation, address?: string) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.inputElement;
    }

    public destroy(): void {
        if (this.mapInstance) {
            this.mapInstance.destroy();
            this.mapInstance = null;
        }
        this.changeHandlers = [];
        this.inputField = null;
        this.mapContainer = null;
        this.inputElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIInputLocation as any).componentName = 'XWUIInputLocation';


