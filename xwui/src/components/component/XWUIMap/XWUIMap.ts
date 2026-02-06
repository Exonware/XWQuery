/**
 * XWUIMap Component
 * Google Maps integration with marker support
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUIMapLocation {
    lat: number;
    lng: number;
}

// Component-level configuration
export interface XWUIMapConfig {
    apiKey?: string;
    center?: XWUIMapLocation;
    zoom?: number;
    className?: string;
}

// Data type
export interface XWUIMapData {
    markers?: XWUIMapLocation[];
}

export class XWUIMap extends XWUIComponent<XWUIMapData, XWUIMapConfig> {
    private mapElement: HTMLElement | null = null;
    private mapInstance: any = null;
    private markers: any[] = [];
    private static googleMapsLoaded: boolean = false;
    private static loadPromise: Promise<void> | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMapData = {},
        conf_comp: XWUIMapConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIMapConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMapConfig {
        return {
            apiKey: conf_comp?.apiKey,
            center: conf_comp?.center ?? { lat: 24.7136, lng: 46.6753 },
            zoom: conf_comp?.zoom ?? 10,
            className: conf_comp?.className
        };
    }

    private async loadGoogleMaps(): Promise<void> {
        if (XWUIMap.googleMapsLoaded) return;

        if (XWUIMap.loadPromise) {
            await XWUIMap.loadPromise;
            return;
        }

        XWUIMap.loadPromise = new Promise((resolve, reject) => {
            if ((window as any).google?.maps) {
                XWUIMap.googleMapsLoaded = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey || 'YOUR_API_KEY'}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                XWUIMap.googleMapsLoaded = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });

        await XWUIMap.loadPromise;
    }

    private async render(): Promise<void> {
        this.container.innerHTML = '';

        this.mapElement = document.createElement('div');
        this.mapElement.className = 'xwui-map';
        
        if (this.config.className) {
            this.mapElement.classList.add(this.config.className);
        }

        this.container.appendChild(this.mapElement);

        try {
            await this.loadGoogleMaps();
            this.initMap();
        } catch (error) {
            console.error('Failed to load Google Maps:', error);
            this.mapElement.innerHTML = '<p>Failed to load map. Please check your API key.</p>';
        }
    }

    private initMap(): void {
        if (!this.mapElement || !(window as any).google?.maps) return;

        const google = (window as any).google;
        this.mapInstance = new google.maps.Map(this.mapElement, {
            center: this.config.center,
            zoom: this.config.zoom
        });

        // Add markers
        if (this.data.markers && this.data.markers.length > 0) {
            this.data.markers.forEach(marker => {
                const googleMarker = new google.maps.Marker({
                    position: marker,
                    map: this.mapInstance
                });
                this.markers.push(googleMarker);
            });
        }
    }

    public setCenter(location: XWUIMapLocation): void {
        this.config.center = location;
        if (this.mapInstance) {
            this.mapInstance.setCenter(location);
        }
    }

    public setZoom(zoom: number): void {
        this.config.zoom = zoom;
        if (this.mapInstance) {
            this.mapInstance.setZoom(zoom);
        }
    }

    public addMarker(location: XWUIMapLocation): void {
        if (!this.data.markers) {
            this.data.markers = [];
        }
        this.data.markers.push(location);
        
        if (this.mapInstance && (window as any).google?.maps) {
            const google = (window as any).google;
            const marker = new google.maps.Marker({
                position: location,
                map: this.mapInstance
            });
            this.markers.push(marker);
        }
    }

    public getElement(): HTMLElement | null {
        return this.mapElement;
    }

    public destroy(): void {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
        this.mapInstance = null;
        this.mapElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMap as any).componentName = 'XWUIMap';


