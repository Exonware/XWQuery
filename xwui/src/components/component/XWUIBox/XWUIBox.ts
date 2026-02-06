/**
 * XWUIBox Component
 * Basic layout container with flexible styling
 * Can be used as a generic container with customizable props
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Glass effect configuration
export interface XWUIBoxGlassEffect {
    enabled?: boolean;
    blur?: number; // Blur value in pixels (default: 16)
    opacity?: number; // Opacity/transparency 0-100 (default: 60)
    saturation?: number; // Saturation 0-200 (default: 180)
    color?: string; // Background color in hex format (default: '#0f172a')
}

// Component-level configuration
export interface XWUIBoxConfig {
    as?: keyof HTMLElementTagNameMap;
    className?: string;
    padding?: string | number;
    margin?: string | number;
    width?: string | number;
    height?: string | number;
    display?: 'block' | 'flex' | 'inline' | 'inline-block' | 'inline-flex' | 'grid' | 'none';
    gradientBackground?: boolean; // Enable gradient background effect
    glassEffect?: XWUIBoxGlassEffect | boolean; // Enable glass effect (boolean for simple enable, or object for full config)
    // Additional style props can be added as needed
    [key: string]: any;
}

// Data type
export interface XWUIBoxData {
    content?: string | HTMLElement;
    children?: string | HTMLElement;
}

export class XWUIBox extends XWUIComponent<XWUIBoxData, XWUIBoxConfig> {
    private boxElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIBoxData = {},
        conf_comp: XWUIBoxConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIBoxConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIBoxConfig {
        // Normalize glass effect config
        let glassEffect: XWUIBoxGlassEffect | undefined;
        if (conf_comp?.glassEffect === true) {
            // Simple boolean - use defaults
            glassEffect = {
                enabled: true,
                blur: 16,
                opacity: 60,
                saturation: 180,
                color: '#0f172a'
            };
        } else if (conf_comp?.glassEffect && typeof conf_comp.glassEffect === 'object') {
            // Full config object
            glassEffect = {
                enabled: conf_comp.glassEffect.enabled ?? true,
                blur: conf_comp.glassEffect.blur ?? 16,
                opacity: conf_comp.glassEffect.opacity ?? 60,
                saturation: conf_comp.glassEffect.saturation ?? 180,
                color: conf_comp.glassEffect.color ?? '#0f172a'
            };
        }
        
        return {
            as: conf_comp?.as ?? 'div',
            className: conf_comp?.className,
            padding: conf_comp?.padding,
            margin: conf_comp?.margin,
            width: conf_comp?.width,
            height: conf_comp?.height,
            display: conf_comp?.display,
            gradientBackground: conf_comp?.gradientBackground ?? false,
            glassEffect: glassEffect,
            ...conf_comp
        };
    }

    protected render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-box-container';

        // Create box element
        const elementType = this.config.as || 'div';
        this.boxElement = document.createElement(elementType);
        this.boxElement.className = 'xwui-box';
        
        if (this.config.className) {
            this.boxElement.classList.add(this.config.className);
        }
        
        // Add gradient background if enabled
        if (this.config.gradientBackground) {
            this.boxElement.classList.add('xwui-box-gradient-background');
            this.boxElement.style.position = 'relative';
            this.boxElement.style.overflow = 'hidden';
        }
        
        // Apply glass effect if enabled
        if (this.config.glassEffect && typeof this.config.glassEffect === 'object' && this.config.glassEffect.enabled) {
            this.applyGlassEffect(this.config.glassEffect);
        }

        // Apply style props
        if (this.config.padding !== undefined) {
            const padding = typeof this.config.padding === 'number' ? `${this.config.padding}px` : this.config.padding;
            this.boxElement.style.padding = padding;
        }

        if (this.config.margin !== undefined) {
            const margin = typeof this.config.margin === 'number' ? `${this.config.margin}px` : this.config.margin;
            this.boxElement.style.margin = margin;
        }

        if (this.config.width !== undefined) {
            const width = typeof this.config.width === 'number' ? `${this.config.width}px` : this.config.width;
            this.boxElement.style.width = width;
        }

        if (this.config.height !== undefined) {
            const height = typeof this.config.height === 'number' ? `${this.config.height}px` : this.config.height;
            this.boxElement.style.height = height;
        }

        if (this.config.display) {
            this.boxElement.style.display = this.config.display;
        }

        // Add gradient background SVG if enabled
        if (this.config.gradientBackground) {
            const gradientWrapper = document.createElement('div');
            gradientWrapper.className = 'xwui-box-gradient-wrapper';
            gradientWrapper.style.cssText = 'position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;';
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.setAttribute('viewBox', '0 0 375 812');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('preserveAspectRatio', 'none');
            
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            
            // Filter 0
            const filter0 = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter0.setAttribute('id', `filter0_f_${Math.random().toString(36).substr(2, 9)}`);
            filter0.setAttribute('x', '-66.8');
            filter0.setAttribute('y', '24');
            filter0.setAttribute('width', '763');
            filter0.setAttribute('height', '693');
            filter0.setAttribute('filterUnits', 'userSpaceOnUse');
            filter0.setAttribute('colorInterpolationFilters', 'sRGB');
            
            const feFlood0 = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
            feFlood0.setAttribute('floodOpacity', '0');
            feFlood0.setAttribute('result', 'BackgroundImageFix');
            filter0.appendChild(feFlood0);
            
            const feBlend0 = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
            feBlend0.setAttribute('mode', 'normal');
            feBlend0.setAttribute('in', 'SourceGraphic');
            feBlend0.setAttribute('in2', 'BackgroundImageFix');
            feBlend0.setAttribute('result', 'shape');
            filter0.appendChild(feBlend0);
            
            const feGaussianBlur0 = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur0.setAttribute('stdDeviation', '94');
            feGaussianBlur0.setAttribute('result', 'effect1_foregroundBlur');
            filter0.appendChild(feGaussianBlur0);
            
            defs.appendChild(filter0);
            
            // Filter 1
            const filter1 = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter1.setAttribute('id', `filter1_f_${Math.random().toString(36).substr(2, 9)}`);
            filter1.setAttribute('x', '38');
            filter1.setAttribute('y', '38');
            filter1.setAttribute('width', '899');
            filter1.setAttribute('height', '787');
            filter1.setAttribute('filterUnits', 'userSpaceOnUse');
            filter1.setAttribute('colorInterpolationFilters', 'sRGB');
            
            const feFlood1 = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
            feFlood1.setAttribute('floodOpacity', '0');
            feFlood1.setAttribute('result', 'BackgroundImageFix');
            filter1.appendChild(feFlood1);
            
            const feBlend1 = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
            feBlend1.setAttribute('mode', 'normal');
            feBlend1.setAttribute('in', 'SourceGraphic');
            feBlend1.setAttribute('in2', 'BackgroundImageFix');
            feBlend1.setAttribute('result', 'shape');
            filter1.appendChild(feBlend1);
            
            const feGaussianBlur1 = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur1.setAttribute('stdDeviation', '94');
            feGaussianBlur1.setAttribute('result', 'effect1_foregroundBlur');
            filter1.appendChild(feGaussianBlur1);
            
            defs.appendChild(filter1);
            
            // Filter 2
            const filter2 = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter2.setAttribute('id', `filter2_f_${Math.random().toString(36).substr(2, 9)}`);
            filter2.setAttribute('x', '-308');
            filter2.setAttribute('y', '82');
            filter2.setAttribute('width', '686');
            filter2.setAttribute('height', '610');
            filter2.setAttribute('filterUnits', 'userSpaceOnUse');
            filter2.setAttribute('colorInterpolationFilters', 'sRGB');
            
            const feFlood2 = document.createElementNS('http://www.w3.org/2000/svg', 'feFlood');
            feFlood2.setAttribute('floodOpacity', '0');
            feFlood2.setAttribute('result', 'BackgroundImageFix');
            filter2.appendChild(feFlood2);
            
            const feBlend2 = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
            feBlend2.setAttribute('mode', 'normal');
            feBlend2.setAttribute('in', 'SourceGraphic');
            feBlend2.setAttribute('in2', 'BackgroundImageFix');
            feBlend2.setAttribute('result', 'shape');
            filter2.appendChild(feBlend2);
            
            const feGaussianBlur2 = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur2.setAttribute('stdDeviation', '94');
            feGaussianBlur2.setAttribute('result', 'effect1_foregroundBlur');
            filter2.appendChild(feGaussianBlur2);
            
            defs.appendChild(filter2);
            
            svg.appendChild(defs);
            
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('opacity', '0.8');
            
            // Path 1 (pink)
            const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g1.setAttribute('filter', `url(#${filter0.getAttribute('id')})`);
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', 'M363.32 529.495C398.145 518.443 429.758 499.667 454.606 475.277C479.453 450.887 496.548 421.851 503.969 391.435C511.39 361.018 508.843 330.427 496.614 303.101C484.384 275.774 462.958 252.797 434.744 236.753C406.53 220.708 372.648 212.233 336.906 212.279C301.165 212.326 264.982 220.892 232.427 237.016C199.871 253.139 172.234 276.18 152.624 303.548C133.013 330.915 122.206 361.524 121.418 391.932L314.749 376.449L363.32 529.495Z');
            path1.setAttribute('fill', '#FA0DC6');
            g1.appendChild(path1);
            g.appendChild(g1);
            
            // Path 2 (cyan)
            const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g2.setAttribute('filter', `url(#${filter1.getAttribute('id')})`);
            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', 'M734.952 591.585C749.366 556.108 752.882 517.023 745.105 478.725C737.328 440.427 718.566 404.435 690.929 374.796C663.293 345.157 642.776 240.018 603.563 227.922C564.351 215.827 541.021 331.11 501.988 340.184C462.954 349.257 373.982 289.389 346.827 316.911C319.672 344.434 235.693 389.175 228.556 426.897C221.42 464.619 234.1 520.782 249.122 557.396C264.143 594.01 222.843 613.92 255.519 638.451L520.187 545.382L734.952 591.585Z');
            path2.setAttribute('fill', '#10D8CC');
            g2.appendChild(path2);
            g.appendChild(g2);
            
            // Path 3 (purple)
            const g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g3.setAttribute('filter', `url(#${filter2.getAttribute('id')})`);
            const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path3.setAttribute('d', 'M181.173 505.032C190.369 492.426 191.759 474.508 185.188 453.295C178.616 432.081 164.343 408.413 143.973 384.951C123.604 361.489 97.9454 339.165 69.8838 320.488C41.8223 301.81 12.4703 287.521 -14.8717 279.227C-42.2138 270.933 -66.4614 268.963 -84.8881 273.538C-103.315 278.113 -115.19 289.052 -119.178 305.124C-123.166 321.197 -119.108 341.767 -107.462 364.52C-95.8158 387.272 -77.0425 411.306 -53.2531 433.919L34.2999 397.895L181.173 505.032Z');
            path3.setAttribute('fill', '#BB86D8');
            g3.appendChild(path3);
            g.appendChild(g3);
            
            svg.appendChild(g);
            gradientWrapper.appendChild(svg);
            this.boxElement.appendChild(gradientWrapper);
            
            // Ensure content is above gradient
            const contentWrapper = document.createElement('div');
            contentWrapper.style.cssText = 'position: relative; z-index: 1;';
            
            const content = this.data.children || this.data.content;
            if (content instanceof HTMLElement) {
                contentWrapper.appendChild(content);
            } else if (typeof content === 'string') {
                contentWrapper.innerHTML = content;
            }
            
            this.boxElement.appendChild(contentWrapper);
        } else {
            // Set content normally if no gradient
            const content = this.data.children || this.data.content;
            if (content instanceof HTMLElement) {
                this.boxElement.appendChild(content);
            } else if (typeof content === 'string') {
                this.boxElement.innerHTML = content;
            }
        }

        this.container.appendChild(this.boxElement);
    }

    /**
     * Convert hex color to RGB string
     */
    private hexToRgb(hex: string): string {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
        }
        return '15, 23, 42'; // Default to slate-900
    }

    /**
     * Apply glass effect styles to the box element
     */
    private applyGlassEffect(glassConfig: XWUIBoxGlassEffect): void {
        if (!this.boxElement || !glassConfig.enabled) return;

        const blur = glassConfig.blur ?? 16;
        const opacity = (glassConfig.opacity ?? 60) / 100;
        const saturation = glassConfig.saturation ?? 180;
        const color = glassConfig.color ?? '#0f172a';
        const rgbColor = this.hexToRgb(color);

        // Add glass effect class
        this.boxElement.classList.add('xwui-box-glass-effect');

        // Apply backdrop filter
        this.boxElement.style.backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
        this.boxElement.style.webkitBackdropFilter = `blur(${blur}px) saturate(${saturation}%)`;

        // Apply background color with opacity
        this.boxElement.style.backgroundColor = `rgba(${rgbColor}, ${opacity})`;

        // Apply border (glass effect typically has a subtle border)
        if (!this.boxElement.style.border) {
            this.boxElement.style.border = '1px solid rgba(255, 255, 255, 0.125)';
        }

        // Ensure border radius if not set - use CSS variable from styles system
        if (!this.boxElement.style.borderRadius) {
            // Use CSS variable for roundness, fallback to a reasonable default
            this.boxElement.style.borderRadius = 'var(--radius-overlay, var(--radius-md, var(--radius-sm, 12px)))';
        }
    }

    /**
     * Set content
     */
    public setContent(content: string | HTMLElement): void {
        this.data.children = content;
        this.render();
    }

    /**
     * Get the box element
     */
    public getElement(): HTMLElement | null {
        return this.boxElement;
    }

    public destroy(): void {
        if (this.boxElement) {
            this.boxElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIBox as any).componentName = 'XWUIBox';


