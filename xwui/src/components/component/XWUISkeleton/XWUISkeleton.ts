/**
 * XWUISkeleton Component
 * Loading skeleton placeholder
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUISkeletonConfig {
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    animation?: 'pulse' | 'wave' | 'none';
    width?: string | number;
    height?: string | number;
    lines?: number;
    lineHeight?: string;
    className?: string;
    // Component-specific presets
    preset?: 'button' | 'table' | 'article' | 'card' | 'list' | 'form' | 'header' | 'sidebar' | 'footer' | 'menu' | 'avatar' | 'image' | 'video' | 'chart' | 'code' | 'badge' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
}

// Data type
export interface XWUISkeletonData {}

export class XWUISkeleton extends XWUIComponent<XWUISkeletonData, XWUISkeletonConfig> {
    private wrapperElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUISkeletonData = {},
        conf_comp: XWUISkeletonConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISkeletonConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISkeletonConfig {
        // If preset is provided, apply preset-specific defaults
        const presetDefaults = this.getPresetDefaults(conf_comp?.preset);
        
        return {
            variant: conf_comp?.variant ?? presetDefaults.variant ?? 'text',
            animation: conf_comp?.animation ?? presetDefaults.animation ?? 'pulse',
            width: conf_comp?.width ?? presetDefaults.width,
            height: conf_comp?.height ?? presetDefaults.height,
            lines: conf_comp?.lines ?? presetDefaults.lines ?? 1,
            lineHeight: conf_comp?.lineHeight ?? presetDefaults.lineHeight ?? '1rem',
            preset: conf_comp?.preset,
            className: conf_comp?.className
        };
    }
    
    private getPresetDefaults(preset?: string): Partial<XWUISkeletonConfig> {
        switch (preset) {
            case 'button':
                return { variant: 'rounded', width: '120px', height: '40px', lines: 1 };
            case 'table':
                return { variant: 'text', lines: 5, width: '100%' };
            case 'article':
                return { variant: 'text', lines: 8, width: '100%' };
            case 'card':
                return { variant: 'rounded', width: '100%', height: '200px', lines: 1 };
            case 'list':
                return { variant: 'text', lines: 4, width: '100%' };
            case 'form':
                return { variant: 'rounded', width: '100%', height: '40px', lines: 3 };
            case 'header':
                return { variant: 'rectangular', width: '100%', height: '60px', lines: 1 };
            case 'sidebar':
                return { variant: 'rectangular', width: '250px', height: '100%', lines: 1 };
            case 'footer':
                return { variant: 'rectangular', width: '100%', height: '80px', lines: 1 };
            case 'menu':
                return { variant: 'text', lines: 6, width: '200px' };
            case 'avatar':
                return { variant: 'circular', width: '40px', height: '40px', lines: 1 };
            case 'image':
                return { variant: 'rounded', width: '100%', height: '200px', lines: 1 };
            case 'video':
                return { variant: 'rounded', width: '100%', height: '300px', lines: 1 };
            case 'chart':
                return { variant: 'rounded', width: '100%', height: '250px', lines: 1 };
            case 'code':
                return { variant: 'text', lines: 10, width: '100%', lineHeight: '1.2rem' };
            case 'badge':
                return { variant: 'rounded', width: '60px', height: '24px', lines: 1 };
            case 'input':
                return { variant: 'rounded', width: '100%', height: '40px', lines: 1 };
            case 'textarea':
                return { variant: 'rounded', width: '100%', height: '100px', lines: 1 };
            case 'select':
                return { variant: 'rounded', width: '100%', height: '40px', lines: 1 };
            case 'checkbox':
                return { variant: 'rounded', width: '20px', height: '20px', lines: 1 };
            case 'radio':
                return { variant: 'circular', width: '20px', height: '20px', lines: 1 };
            default:
                return {};
        }
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-skeleton-wrapper';
        
        // Add preset class if provided
        if (this.config.preset) {
            this.wrapperElement.classList.add(`xwui-skeleton-preset-${this.config.preset}`);
        }
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        const lines = this.config.variant === 'text' ? (this.config.lines || 1) : 1;

        for (let i = 0; i < lines; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'xwui-skeleton';
            skeleton.classList.add(`xwui-skeleton-${this.config.variant}`);
            skeleton.classList.add(`xwui-skeleton-${this.config.animation}`);

            // Set dimensions
            if (this.config.variant === 'text') {
                skeleton.style.height = this.config.lineHeight || '1rem';
                if (i === lines - 1 && lines > 1) {
                    skeleton.style.width = '70%';
                } else {
                    skeleton.style.width = this.config.width ? this.formatDimension(this.config.width) : '100%';
                }
            } else {
                if (this.config.width) {
                    skeleton.style.width = this.formatDimension(this.config.width);
                }
                if (this.config.height) {
                    skeleton.style.height = this.formatDimension(this.config.height);
                }
            }

            this.wrapperElement.appendChild(skeleton);
        }

        this.container.appendChild(this.wrapperElement);
    }

    private formatDimension(value: string | number): string {
        if (typeof value === 'number') {
            return `${value}px`;
        }
        return value;
    }

    public setLoading(loading: boolean): void {
        if (this.wrapperElement) {
            this.wrapperElement.style.display = loading ? 'flex' : 'none';
        }
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISkeleton as any).componentName = 'XWUISkeleton';


