/**
 * XWUIMobileStepper Component
 * Mobile-optimized stepper component with dots and navigation buttons
 * Based on MUI MobileStepper pattern
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';

// Component-level configuration
export interface XWUIMobileStepperConfig {
    variant?: 'text' | 'dots' | 'progress'; // Stepper variant
    position?: 'static' | 'bottom' | 'top'; // Position of stepper
    steps?: number; // Total number of steps (for dots/progress variant)
    activeStep?: number; // Current active step (0-indexed)
    nextButtonText?: string; // Text for next button
    backButtonText?: string; // Text for back button
    showNextButton?: boolean; // Show next button
    showBackButton?: boolean; // Show back button
    className?: string;
}

// Data type
export interface XWUIMobileStepperData {
    onNext?: () => void; // Callback when next is clicked
    onBack?: () => void; // Callback when back is clicked
    nextButtonDisabled?: boolean; // Disable next button
    backButtonDisabled?: boolean; // Disable back button
}

export class XWUIMobileStepper extends XWUIComponent<XWUIMobileStepperData, XWUIMobileStepperConfig> {
    private stepperElement: HTMLElement | null = null;
    private dotsContainer: HTMLElement | null = null;
    private progressBar: HTMLElement | null = null;
    private nextButton: XWUIButton | null = null;
    private backButton: XWUIButton | null = null;
    private nextButtonContainer: HTMLElement | null = null;
    private backButtonContainer: HTMLElement | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIMobileStepperData = {},
        conf_comp: XWUIMobileStepperConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.setupDOM();
    }

    protected createConfig(
        conf_comp?: XWUIMobileStepperConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIMobileStepperConfig {
        return {
            variant: conf_comp?.variant ?? 'dots',
            position: conf_comp?.position ?? 'static',
            steps: conf_comp?.steps ?? 0,
            activeStep: conf_comp?.activeStep ?? 0,
            nextButtonText: conf_comp?.nextButtonText ?? 'Next',
            backButtonText: conf_comp?.backButtonText ?? 'Back',
            showNextButton: conf_comp?.showNextButton ?? true,
            showBackButton: conf_comp?.showBackButton ?? true,
            className: conf_comp?.className
        };
    }

    private setupDOM(): void {
        this.container.innerHTML = '';

        this.stepperElement = document.createElement('div');
        this.stepperElement.className = 'xwui-mobile-stepper';
        this.stepperElement.classList.add(`xwui-mobile-stepper-${this.config.variant}`);
        this.stepperElement.classList.add(`xwui-mobile-stepper-${this.config.position}`);

        if (this.config.className) {
            this.stepperElement.classList.add(this.config.className);
        }

        // Create content based on variant
        switch (this.config.variant) {
            case 'dots':
                this.createDotsVariant();
                break;
            case 'progress':
                this.createProgressVariant();
                break;
            case 'text':
            default:
                this.createTextVariant();
                break;
        }

        // Create navigation buttons
        this.createNavigationButtons();

        this.container.appendChild(this.stepperElement);
    }

    private createDotsVariant(): void {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'xwui-mobile-stepper-dots';

        const steps = this.config.steps || 0;
        for (let i = 0; i < steps; i++) {
            const dot = document.createElement('div');
            dot.className = 'xwui-mobile-stepper-dot';
            if (i === this.config.activeStep) {
                dot.classList.add('xwui-mobile-stepper-dot-active');
            }
            this.dotsContainer.appendChild(dot);
        }

        this.stepperElement!.appendChild(this.dotsContainer);
    }

    private createProgressVariant(): void {
        const progressWrapper = document.createElement('div');
        progressWrapper.className = 'xwui-mobile-stepper-progress-wrapper';

        this.progressBar = document.createElement('div');
        this.progressBar.className = 'xwui-mobile-stepper-progress-bar';

        const steps = this.config.steps || 1;
        const progress = ((this.config.activeStep || 0) + 1) / steps * 100;
        this.progressBar.style.width = `${progress}%`;

        progressWrapper.appendChild(this.progressBar);
        this.stepperElement!.appendChild(progressWrapper);
    }

    private createTextVariant(): void {
        const textContainer = document.createElement('div');
        textContainer.className = 'xwui-mobile-stepper-text';

        const steps = this.config.steps || 0;
        const activeStep = this.config.activeStep || 0;
        const text = `${activeStep + 1} / ${steps}`;
        textContainer.textContent = text;

        this.stepperElement!.appendChild(textContainer);
    }

    private createNavigationButtons(): void {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'xwui-mobile-stepper-buttons';

        // Back button
        if (this.config.showBackButton) {
            this.backButtonContainer = document.createElement('div');
            this.backButtonContainer.className = 'xwui-mobile-stepper-button-container';
            
            this.backButton = new XWUIButton(
                this.backButtonContainer,
                { text: this.config.backButtonText || 'Back' },
                {
                    variant: 'outline',
                    size: 'medium',
                    disabled: this.data.backButtonDisabled || this.config.activeStep === 0
                }
            );

            this.backButton.onClick(() => {
                if (this.data.onBack) {
                    this.data.onBack();
                }
            });

            this.registerChildComponent(this.backButton);
            buttonsContainer.appendChild(this.backButtonContainer);
        }

        // Next button
        if (this.config.showNextButton) {
            this.nextButtonContainer = document.createElement('div');
            this.nextButtonContainer.className = 'xwui-mobile-stepper-button-container';
            
            const steps = this.config.steps || 0;
            this.nextButton = new XWUIButton(
                this.nextButtonContainer,
                { text: this.config.nextButtonText || 'Next' },
                {
                    variant: 'primary',
                    size: 'medium',
                    disabled: this.data.nextButtonDisabled || (this.config.activeStep || 0) >= steps - 1
                }
            );

            this.nextButton.onClick(() => {
                if (this.data.onNext) {
                    this.data.onNext();
                }
            });

            this.registerChildComponent(this.nextButton);
            buttonsContainer.appendChild(this.nextButtonContainer);
        }

        this.stepperElement!.appendChild(buttonsContainer);
    }

    /**
     * Update active step
     */
    public setActiveStep(step: number): void {
        this.config.activeStep = step;
        this.updateDisplay();
    }

    /**
     * Update steps count
     */
    public setSteps(steps: number): void {
        this.config.steps = steps;
        this.updateDisplay();
    }

    /**
     * Update the display based on current config
     */
    private updateDisplay(): void {
        if (this.config.variant === 'dots' && this.dotsContainer) {
            // Update dots
            const dots = this.dotsContainer.querySelectorAll('.xwui-mobile-stepper-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('xwui-mobile-stepper-dot-active', index === this.config.activeStep);
            });
        } else if (this.config.variant === 'progress' && this.progressBar) {
            // Update progress
            const steps = this.config.steps || 1;
            const progress = ((this.config.activeStep || 0) + 1) / steps * 100;
            this.progressBar.style.width = `${progress}%`;
        } else if (this.config.variant === 'text') {
            // Update text
            const textContainer = this.stepperElement?.querySelector('.xwui-mobile-stepper-text');
            if (textContainer) {
                const steps = this.config.steps || 0;
                const activeStep = this.config.activeStep || 0;
                textContainer.textContent = `${activeStep + 1} / ${steps}`;
            }
        }

        // Update button states
        if (this.backButton) {
            const isDisabled = this.data.backButtonDisabled || (this.config.activeStep || 0) === 0;
            this.backButton.setDisabled(isDisabled);
        }
        if (this.nextButton) {
            const steps = this.config.steps || 0;
            const isDisabled = this.data.nextButtonDisabled || (this.config.activeStep || 0) >= steps - 1;
            this.nextButton.setDisabled(isDisabled);
        }
    }

    public destroy(): void {
        // Buttons are automatically destroyed by base class via registerChildComponent
        this.nextButton = null;
        this.backButton = null;
        this.nextButtonContainer = null;
        this.backButtonContainer = null;
        this.dotsContainer = null;
        this.progressBar = null;
        this.stepperElement = null;

        // Call parent cleanup
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIMobileStepper as any).componentName = 'XWUIMobileStepper';


