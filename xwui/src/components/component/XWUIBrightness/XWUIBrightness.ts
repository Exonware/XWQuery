/**
 * XWUIBrightness Component
 * Controls the brightness of components with a scroll-based slider control
 * Reuses: XWUISlider
 */

import { XWUIComponent } from '../XWUIComponent/XWUIComponent';
import { XWUISlider } from '../XWUISlider/XWUISlider';

// Component-level configuration
export interface XWUIBrightnessConfig {
    showController?: boolean;
    controlPosition?: 'up' | 'down' | 'middle' | 'left' | 'right';
    minBrightness?: number;
    maxBrightness?: number;
    defaultBrightness?: number;
    step?: number;
    targetSelector?: string; // CSS selector for elements to apply brightness to (default: parent or body)
    className?: string;
}

// Data type
export interface XWUIBrightnessData {
    brightness?: number; // Current brightness value (0-100)
}

export class XWUIBrightness extends XWUIComponent<XWUIBrightnessData, XWUIBrightnessConfig> {
    private wrapperElement: HTMLElement | null = null;
    private sliderContainer: HTMLElement | null = null;
    private slider: XWUISlider | null = null;
    private brightnessFilterElement: HTMLElement | null = null;
    private scrollHandler: ((e: WheelEvent) => void) | null = null;
    private targetElements: HTMLElement[] = [];
    private currentBrightness: number = 100;
    private changeHandlers: Array<(brightness: number) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIBrightnessData = {},
        conf_comp: XWUIBrightnessConfig = {}
    ) {
        super(container, data, conf_comp);
        this.currentBrightness = this.data.brightness ?? this.config.defaultBrightness ?? 100;
        this.setupDOM();
    }

    protected createConfig(conf_comp?: XWUIBrightnessConfig): XWUIBrightnessConfig {
        return {
            showController: conf_comp?.showController ?? true,
            controlPosition: conf_comp?.controlPosition ?? 'right',
            minBrightness: conf_comp?.minBrightness ?? 0,
            maxBrightness: conf_comp?.maxBrightness ?? 100,
            defaultBrightness: conf_comp?.defaultBrightness ?? 100,
            step: conf_comp?.step ?? 1,
            targetSelector: conf_comp?.targetSelector,
            className: conf_comp?.className
        };
    }

    private setupDOM(): void {
        this.container.innerHTML = '';
        this.container.style.position = 'relative';

        // Create wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-brightness';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Create brightness filter overlay
        this.brightnessFilterElement = document.createElement('div');
        this.brightnessFilterElement.className = 'xwui-brightness-filter';
        this.brightnessFilterElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999999;
            background: rgba(0, 0, 0, 0);
            transition: background 0.2s ease;
        `;
        document.body.appendChild(this.brightnessFilterElement);

        // Create slider container if controller should be shown
        if (this.config.showController) {
            this.createSliderContainer();
        }

        // Scroll handler will be set up after slider container is created if needed

        // Apply initial brightness
        this.applyBrightness(this.currentBrightness);

        this.container.appendChild(this.wrapperElement);
    }

    private createBrightnessIcons(): { lowIcon: string; highIcon: string } {
        // Low brightness icon (moon/dark)
        const lowIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      fill="none"/>
            </svg>
        `;
        
        // High brightness icon (sun)
        const highIcon = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        fill="currentColor"/>
                <line x1="12" y1="1" x2="12" y2="3" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="12" y1="21" x2="12" y2="23" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="1" y1="12" x2="3" y2="12" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="21" y1="12" x2="23" y2="12" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round"/>
            </svg>
        `;
        
        return { lowIcon, highIcon };
    }

    private createSliderContainer(): void {
        this.sliderContainer = document.createElement('div');
        this.sliderContainer.className = 'xwui-brightness-controller';
        this.sliderContainer.style.cssText = `
            position: fixed;
            z-index: 1000000;
        `;

        // Position the controller
        this.updateControllerPosition();

        // Create slider
        const sliderWrapper = document.createElement('div');
        const isVertical = this.config.controlPosition === 'left' || this.config.controlPosition === 'right';
        sliderWrapper.style.cssText = `
            width: ${isVertical ? 'auto' : '200px'};
            height: ${isVertical ? '200px' : 'auto'};
        `;

        // Get brightness icons
        const { lowIcon, highIcon } = this.createBrightnessIcons();

        // Determine which icon goes where based on orientation
        // For horizontal: low (left/start) -> high (right/end)
        // For vertical: low (bottom/start) -> high (top/end)
        const startIcon = lowIcon;
        const endIcon = highIcon;

        this.slider = new XWUISlider(
            sliderWrapper,
            {
                value: this.currentBrightness,
                label: 'Brightness'
            },
            {
                min: this.config.minBrightness ?? 0,
                max: this.config.maxBrightness ?? 100,
                step: this.config.step ?? 1,
                orientation: isVertical ? 'vertical' : 'horizontal',
                valueLabelDisplay: 'auto',
                startIcon: startIcon,
                endIcon: endIcon,
                size: 'medium',
                color: 'primary'
            }
        );

        this.registerChildComponent(this.slider);

        // Handle slider change
        this.slider.onChange((value) => {
            const brightness = Array.isArray(value) ? value[0] : value;
            this.setBrightness(brightness);
        });

        this.sliderContainer.appendChild(sliderWrapper);
        document.body.appendChild(this.sliderContainer);
        
        // Attach scroll handler after container is added to DOM
        this.attachScrollHandler();
    }

    private updateControllerPosition(): void {
        if (!this.sliderContainer) return;

        const position = this.config.controlPosition ?? 'right';
        
        switch (position) {
            case 'up':
                this.sliderContainer.style.top = '20px';
                this.sliderContainer.style.left = '50%';
                this.sliderContainer.style.transform = 'translateX(-50%)';
                this.sliderContainer.style.right = 'auto';
                this.sliderContainer.style.bottom = 'auto';
                break;
            case 'down':
                this.sliderContainer.style.bottom = '20px';
                this.sliderContainer.style.left = '50%';
                this.sliderContainer.style.transform = 'translateX(-50%)';
                this.sliderContainer.style.top = 'auto';
                this.sliderContainer.style.right = 'auto';
                break;
            case 'middle':
                this.sliderContainer.style.top = '50%';
                this.sliderContainer.style.left = '50%';
                this.sliderContainer.style.transform = 'translate(-50%, -50%)';
                this.sliderContainer.style.right = 'auto';
                this.sliderContainer.style.bottom = 'auto';
                break;
            case 'left':
                this.sliderContainer.style.left = '20px';
                this.sliderContainer.style.top = '50%';
                this.sliderContainer.style.transform = 'translateY(-50%)';
                this.sliderContainer.style.right = 'auto';
                this.sliderContainer.style.bottom = 'auto';
                break;
            case 'right':
            default:
                this.sliderContainer.style.right = '20px';
                this.sliderContainer.style.top = '50%';
                this.sliderContainer.style.transform = 'translateY(-50%)';
                this.sliderContainer.style.left = 'auto';
                this.sliderContainer.style.bottom = 'auto';
                break;
        }
    }

    private setupScrollHandler(): void {
        // Handle wheel events on the slider container when it exists
        // We'll set this up after the slider container is created
        if (this.sliderContainer) {
            this.attachScrollHandler();
        }
    }

    private attachScrollHandler(): void {
        if (!this.sliderContainer || this.scrollHandler) return;

        this.scrollHandler = (e: WheelEvent) => {
            // Only handle scroll when hovering over the controller
            const rect = this.sliderContainer!.getBoundingClientRect();
            const isHovering = e.clientX >= rect.left && 
                              e.clientX <= rect.right && 
                              e.clientY >= rect.top && 
                              e.clientY <= rect.bottom;

            if (!isHovering) return;

            e.preventDefault();
            e.stopPropagation();

            const delta = e.deltaY > 0 ? -this.config.step! : this.config.step!;
            const newBrightness = Math.max(
                this.config.minBrightness ?? 0,
                Math.min(this.config.maxBrightness ?? 100, this.currentBrightness + delta)
            );
            this.setBrightness(newBrightness);
        };

        this.sliderContainer.addEventListener('wheel', this.scrollHandler, { passive: false });
    }

    private applyBrightness(brightness: number): void {
        this.currentBrightness = brightness;
        this.data.brightness = brightness;

        // Calculate opacity for overlay (inverse of brightness percentage)
        // Brightness 100% = no overlay (opacity 0)
        // Brightness 0% = full dark overlay (opacity 1)
        const opacity = (100 - brightness) / 100;

        if (this.brightnessFilterElement) {
            this.brightnessFilterElement.style.background = `rgba(0, 0, 0, ${opacity})`;
        }

        // Update slider if it exists
        if (this.slider) {
            this.slider.setValue(brightness);
        }

        // Notify change handlers
        this.changeHandlers.forEach(handler => handler(brightness));
    }

    public setBrightness(brightness: number): void {
        const clampedBrightness = Math.max(
            this.config.minBrightness ?? 0,
            Math.min(this.config.maxBrightness ?? 100, brightness)
        );
        this.applyBrightness(clampedBrightness);
    }

    public getBrightness(): number {
        return this.currentBrightness;
    }

    public onChange(handler: (brightness: number) => void): void {
        this.changeHandlers.push(handler);
    }

    public showController(): void {
        if (this.sliderContainer) return;
        this.config.showController = true;
        this.createSliderContainer();
        this.attachScrollHandler();
    }

    public hideController(): void {
        if (!this.sliderContainer) return;
        
        // Remove scroll handler
        if (this.scrollHandler) {
            this.sliderContainer.removeEventListener('wheel', this.scrollHandler);
            this.scrollHandler = null;
        }
        
        this.sliderContainer.remove();
        this.sliderContainer = null;
        if (this.slider) {
            this.unregisterChildComponent(this.slider);
            this.slider = null;
        }
        this.config.showController = false;
    }

    public setControlPosition(position: 'up' | 'down' | 'middle' | 'left' | 'right'): void {
        this.config.controlPosition = position;
        if (this.sliderContainer) {
            this.updateControllerPosition();
            // Recreate slider with new orientation if needed
            if (this.slider) {
                const currentValue = this.currentBrightness;
                const sliderWrapper = this.sliderContainer.querySelector('div');
                if (sliderWrapper) {
                    sliderWrapper.innerHTML = '';
                    this.slider.destroy();
                    this.unregisterChildComponent(this.slider);
                    this.slider = null;

                    sliderWrapper.style.cssText = `
                        width: 200px;
                        height: ${position === 'left' || position === 'right' ? '200px' : 'auto'};
                    `;

                    // Get brightness icons
                    const { lowIcon, highIcon } = this.createBrightnessIcons();
                    const startIcon = lowIcon;
                    const endIcon = highIcon;
                    const isVertical = position === 'left' || position === 'right';

                    this.slider = new XWUISlider(
                        sliderWrapper,
                        {
                            value: currentValue,
                            label: 'Brightness'
                        },
                        {
                            min: this.config.minBrightness ?? 0,
                            max: this.config.maxBrightness ?? 100,
                            step: this.config.step ?? 1,
                            orientation: isVertical ? 'vertical' : 'horizontal',
                            valueLabelDisplay: 'auto',
                            startIcon: startIcon,
                            endIcon: endIcon,
                            size: 'medium',
                            color: 'primary'
                        }
                    );

                    this.registerChildComponent(this.slider);
                    this.slider.onChange((value) => {
                        const brightness = Array.isArray(value) ? value[0] : value;
                        this.setBrightness(brightness);
                    });
                }
            }
        }
    }

    public destroy(): void {
        // Clean up change handlers
        this.changeHandlers = [];

        // 1. Clean up event listeners (resources without destroy() methods)
        if (this.scrollHandler) {
            const target = this.sliderContainer || this.wrapperElement;
            if (target) {
                target.removeEventListener('wheel', this.scrollHandler);
            }
            this.scrollHandler = null;
        }

        // 2. Clear container
        this.container.innerHTML = '';

        // 3. Clear local references to registered objects (they're destroyed by base class)
        this.slider = null;
        
        // 4. Clear DOM references
        this.wrapperElement = null;
        this.targetElements = [];

        // 5. Call parent to automatically destroy ALL registered child components
        // Registered child components (this.slider) are automatically destroyed by base class
        super.destroy();

        // 6. Remove DOM elements created outside the component container
        // (These should be cleaned up after child components are destroyed)
        if (this.brightnessFilterElement) {
            this.brightnessFilterElement.remove();
            this.brightnessFilterElement = null;
        }
        if (this.sliderContainer) {
            this.sliderContainer.remove();
            this.sliderContainer = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBrightness as any).componentName = 'XWUIBrightness';


