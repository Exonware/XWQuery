/**
 * XWUITour Component
 * Step-by-step guide/tour
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIPortal } from '../XWUIPortal/XWUIPortal';

export interface TourStep {
    target: string | HTMLElement;
    title: string;
    description: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

export interface XWUITourConfig {
    steps?: TourStep[];
    current?: number;
    type?: 'default' | 'primary';
    mask?: boolean;
    scrollIntoViewOptions?: ScrollIntoViewOptions;
    className?: string;
}

export interface XWUITourData {
    open?: boolean;
}

export class XWUITour extends XWUIComponent<XWUITourData, XWUITourConfig> {
    private maskElement: HTMLElement | null = null;
    private popoverElement: HTMLElement | null = null;
    private portalInstance: XWUIPortal | null = null;
    private currentStep: number = 0;

    constructor(
        container: HTMLElement,
        data: XWUITourData = {},
        conf_comp: XWUITourConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.currentStep = conf_comp.current ?? 0;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITourConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITourConfig {
        return {
            steps: conf_comp?.steps ?? [],
            current: conf_comp?.current ?? 0,
            type: conf_comp?.type ?? 'default',
            mask: conf_comp?.mask ?? true,
            scrollIntoViewOptions: conf_comp?.scrollIntoViewOptions,
            className: conf_comp?.className
        };
    }

    private render(): void {
        if (!this.data.open) {
            this.close();
            return;
        }

        const steps = this.config.steps || [];
        if (steps.length === 0 || this.currentStep >= steps.length) {
            this.close();
            return;
        }

        const step = steps[this.currentStep];
        this.showStep(step);
    }

    private showStep(step: TourStep): void {
        // Find target element
        let targetElement: HTMLElement | null = null;
        if (typeof step.target === 'string') {
            targetElement = document.querySelector(step.target);
        } else {
            targetElement = step.target;
        }

        if (!targetElement) {
            console.warn('Tour step target not found:', step.target);
            return;
        }

        // Create mask if enabled
        if (this.config.mask) {
            this.createMask(targetElement);
        }

        // Scroll to target
        targetElement.scrollIntoView(this.config.scrollIntoViewOptions || { behavior: 'smooth', block: 'center' });

        // Create popover
        this.createPopover(step, targetElement);
    }

    private createMask(targetElement: HTMLElement): void {
        if (this.maskElement) {
            this.maskElement.remove();
        }

        this.maskElement = document.createElement('div');
        this.maskElement.className = 'xwui-tour-mask';
        document.body.appendChild(this.maskElement);

        // Create highlight cutout for target
        setTimeout(() => {
            if (!this.maskElement || !targetElement) return;
            
            const rect = targetElement.getBoundingClientRect();
            const highlight = document.createElement('div');
            highlight.className = 'xwui-tour-highlight';
            highlight.style.position = 'fixed';
            highlight.style.top = `${rect.top - 4}px`;
            highlight.style.left = `${rect.left - 4}px`;
            highlight.style.width = `${rect.width + 8}px`;
            highlight.style.height = `${rect.height + 8}px`;
            highlight.style.borderRadius = '4px';
            highlight.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.5)';
            highlight.style.pointerEvents = 'none';
            highlight.style.zIndex = '999';
            
            document.body.appendChild(highlight);
        }, 100);
    }

    private createPopover(step: TourStep, targetElement: HTMLElement): void {
        if (this.popoverElement) {
            this.popoverElement.remove();
        }

        this.popoverElement = document.createElement('div');
        this.popoverElement.className = 'xwui-tour-popover';
        this.popoverElement.classList.add(`xwui-tour-popover-${this.config.type}`);
        this.popoverElement.classList.add(`xwui-tour-popover-${step.placement || 'top'}`);
        
        if (this.config.className) {
            this.popoverElement.classList.add(this.config.className);
        }

        // Title
        const title = document.createElement('div');
        title.className = 'xwui-tour-popover-title';
        title.textContent = step.title;
        this.popoverElement.appendChild(title);

        // Description
        const description = document.createElement('div');
        description.className = 'xwui-tour-popover-description';
        description.textContent = step.description;
        this.popoverElement.appendChild(description);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'xwui-tour-popover-actions';

        const steps = this.config.steps || [];
        const isFirst = this.currentStep === 0;
        const isLast = this.currentStep === steps.length - 1;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-tour-popover-btn xwui-tour-popover-btn-prev';
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = isFirst;
        prevBtn.addEventListener('click', () => this.previous());
        actions.appendChild(prevBtn);

        // Next/Finish button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-tour-popover-btn xwui-tour-popover-btn-next';
        nextBtn.textContent = isLast ? 'Finish' : 'Next';
        nextBtn.addEventListener('click', () => {
            if (isLast) {
                this.close();
            } else {
                this.next();
            }
        });
        actions.appendChild(nextBtn);

        // Skip button
        const skipBtn = document.createElement('button');
        skipBtn.className = 'xwui-tour-popover-btn xwui-tour-popover-btn-skip';
        skipBtn.textContent = 'Skip';
        skipBtn.addEventListener('click', () => this.close());
        actions.appendChild(skipBtn);

        this.popoverElement.appendChild(actions);
        document.body.appendChild(this.popoverElement);

        // Position popover
        this.positionPopover(targetElement, step.placement || 'top');
    }

    private positionPopover(targetElement: HTMLElement, placement: string): void {
        if (!this.popoverElement) return;

        const rect = targetElement.getBoundingClientRect();
        const popoverRect = this.popoverElement.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (placement) {
            case 'top':
                top = rect.top - popoverRect.height - 12;
                left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
                break;
            case 'bottom':
                top = rect.bottom + 12;
                left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (popoverRect.height / 2);
                left = rect.left - popoverRect.width - 12;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (popoverRect.height / 2);
                left = rect.right + 12;
                break;
        }

        // Keep within viewport
        const padding = 16;
        if (left < padding) left = padding;
        if (left + popoverRect.width > window.innerWidth - padding) {
            left = window.innerWidth - popoverRect.width - padding;
        }
        if (top < padding) top = padding;
        if (top + popoverRect.height > window.innerHeight - padding) {
            top = window.innerHeight - popoverRect.height - padding;
        }

        this.popoverElement.style.position = 'fixed';
        this.popoverElement.style.top = `${top}px`;
        this.popoverElement.style.left = `${left}px`;
        this.popoverElement.style.zIndex = '1001';
    }

    private next(): void {
        const steps = this.config.steps || [];
        if (this.currentStep < steps.length - 1) {
            this.currentStep++;
            this.render();
        }
    }

    private previous(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    private close(): void {
        if (this.maskElement) {
            this.maskElement.remove();
            this.maskElement = null;
        }
        
        const highlights = document.querySelectorAll('.xwui-tour-highlight');
        highlights.forEach(el => el.remove());
        
        if (this.popoverElement) {
            this.popoverElement.remove();
            this.popoverElement = null;
        }
        
        this.data.open = false;
    }

    public open(): void {
        this.currentStep = this.config.current || 0;
        this.data.open = true;
        this.render();
    }

    public destroy(): void {
        this.close();
        if (this.portalInstance) {
            this.portalInstance = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITour as any).componentName = 'XWUITour';


