/**
 * XWUISteps Component
 * Step progress indicator (Stepper)
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { createIcon } from '../XWUIIcon/icon-utils';

export interface XWUIStepItem {
    title: string;
    description?: string;
    icon?: string;
    status?: 'wait' | 'process' | 'finish' | 'error';
}

// Component-level configuration
export interface XWUIStepsConfig {
    current?: number;
    direction?: 'horizontal' | 'vertical';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

// Data type
export interface XWUIStepsData {
    steps: XWUIStepItem[];
}

export class XWUISteps extends XWUIComponent<XWUIStepsData, XWUIStepsConfig> {
    private stepsElement: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIStepsData,
        conf_comp: XWUIStepsConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIStepsConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIStepsConfig {
        return {
            current: conf_comp?.current ?? 0,
            direction: conf_comp?.direction ?? 'horizontal',
            size: conf_comp?.size ?? 'medium',
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.stepsElement = document.createElement('div');
        this.stepsElement.className = 'xwui-steps';
        this.stepsElement.classList.add(`xwui-steps-${this.config.direction}`);
        this.stepsElement.classList.add(`xwui-steps-${this.config.size}`);
        this.stepsElement.setAttribute('role', 'progressbar');
        
        if (this.config.className) {
            this.stepsElement.classList.add(this.config.className);
        }

        this.data.steps.forEach((step, index) => {
            const stepElement = this.createStepElement(step, index);
            this.stepsElement!.appendChild(stepElement);
        });

        this.container.appendChild(this.stepsElement);
    }

    private createStepElement(step: XWUIStepItem, index: number): HTMLElement {
        const stepWrapper = document.createElement('div');
        stepWrapper.className = 'xwui-step';
        
        const current = this.config.current ?? 0;
        let status = step.status;
        
        if (!status) {
            if (index < current) {
                status = 'finish';
            } else if (index === current) {
                status = 'process';
            } else {
                status = 'wait';
            }
        }
        
        stepWrapper.classList.add(`xwui-step-${status}`);

        // Icon/Number
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'xwui-step-icon';
        
        if (step.icon) {
            if (step.icon.startsWith('<svg')) {
                // Backward compatibility: custom SVG
                iconWrapper.innerHTML = step.icon;
            } else {
                // Icon name - Use XWUIIcon
                const { container } = createIcon(this, step.icon, { size: 20 }, this.conf_sys, this.conf_usr);
                iconWrapper.appendChild(container);
            }
        } else {
            if (status === 'finish') {
                // Use check icon
                const { container } = createIcon(this, 'check', { size: 20 }, this.conf_sys, this.conf_usr);
                iconWrapper.appendChild(container);
            } else if (status === 'error') {
                // Use x icon
                const { container } = createIcon(this, 'x', { size: 20 }, this.conf_sys, this.conf_usr);
                iconWrapper.appendChild(container);
            } else {
                iconWrapper.textContent = String(index + 1);
            }
        }
        
        stepWrapper.appendChild(iconWrapper);

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-step-content';

        const title = document.createElement('div');
        title.className = 'xwui-step-title';
        title.textContent = step.title;
        content.appendChild(title);

        if (step.description) {
            const desc = document.createElement('div');
            desc.className = 'xwui-step-description';
            desc.textContent = step.description;
            content.appendChild(desc);
        }

        stepWrapper.appendChild(content);

        // Tail (connector line)
        if (index < this.data.steps.length - 1) {
            const tail = document.createElement('div');
            tail.className = 'xwui-step-tail';
            if (status === 'finish') {
                tail.classList.add('xwui-step-tail-active');
            }
            stepWrapper.appendChild(tail);
        }

        return stepWrapper;
    }

    public setCurrent(current: number): void {
        this.config.current = Math.max(0, Math.min(current, this.data.steps.length - 1));
        this.render();
    }

    public next(): void {
        this.setCurrent((this.config.current || 0) + 1);
    }

    public prev(): void {
        this.setCurrent((this.config.current || 0) - 1);
    }

    public getCurrent(): number {
        return this.config.current || 0;
    }

    public getElement(): HTMLElement | null {
        return this.stepsElement;
    }

    public destroy(): void {
        if (this.stepsElement) {
            this.stepsElement.remove();
            this.stepsElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISteps as any).componentName = 'XWUISteps';


