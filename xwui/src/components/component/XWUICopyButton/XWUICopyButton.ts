/**
 * XWUICopyButton Component
 * A button component specifically for copying text to clipboard
 * Shows "Copied!" feedback after successful copy
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';

// Component-level configuration
export interface XWUICopyButtonConfig {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    copiedTimeout?: number; // Time in ms to show "Copied!" message
    copyIcon?: string;
    copiedIcon?: string;
    showIcon?: boolean;
    className?: string;
}

// Data type
export interface XWUICopyButtonData {
    text?: string; // Text to copy
    value?: string; // Alias for text
    copiedText?: string; // Text to show when copied (default: "Copied!")
}

export class XWUICopyButton extends XWUIComponent<XWUICopyButtonData, XWUICopyButtonConfig> {
    private buttonInstance: XWUIButton | null = null;
    private originalText: string = '';
    private copiedTimeoutId: number | null = null;

    constructor(
        container: HTMLElement,
        data: XWUICopyButtonData = {},
        conf_comp: XWUICopyButtonConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUICopyButtonConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUICopyButtonConfig {
        return {
            variant: conf_comp?.variant ?? 'secondary',
            size: conf_comp?.size ?? 'medium',
            copiedTimeout: conf_comp?.copiedTimeout ?? 2000,
            copyIcon: conf_comp?.copyIcon,
            copiedIcon: conf_comp?.copiedIcon,
            showIcon: conf_comp?.showIcon ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-copy-button-container';
        
        if (this.config.className) {
            this.container.classList.add(this.config.className);
        }

        const textToCopy = this.data.text || this.data.value || '';
        this.originalText = textToCopy;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'xwui-copy-button-wrapper';

        // Create button instance
        const buttonText = this.getButtonText();
        const buttonIcon = this.config.showIcon ? this.getIcon() : undefined;

        this.buttonInstance = new XWUIButton(
            buttonContainer,
            {
                text: buttonText,
                label: buttonText
            },
            {
                variant: this.config.variant,
                size: this.config.size,
                icon: buttonIcon,
                iconPosition: 'right'
            }
        );
        this.registerChildComponent(this.buttonInstance);

        // Add click handler
        if (this.buttonInstance) {
            this.buttonInstance.onClick(async () => {
                await this.handleCopy();
            });
        }

        this.container.appendChild(buttonContainer);
    }

    private getButtonText(): string {
        // If currently showing "Copied!", return that
        if (this.copiedTimeoutId !== null) {
            return this.data.copiedText || 'Copied!';
        }
        return 'Copy';
    }

    private getIcon(): string | undefined {
        if (this.copiedTimeoutId !== null && this.config.copiedIcon) {
            return this.config.copiedIcon;
        }
        
        if (this.config.copyIcon) {
            return this.config.copyIcon;
        }

        // Default copy icon SVG
        return this.copiedTimeoutId !== null 
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    }

    private async handleCopy(): Promise<void> {
        const textToCopy = this.data.text || this.data.value || '';
        
        if (!textToCopy) {
            console.warn('XWUICopyButton: No text to copy');
            return;
        }

        try {
            // Use modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                } finally {
                    document.body.removeChild(textArea);
                }
            }

            this.showCopiedFeedback();
        } catch (error) {
            console.error('XWUICopyButton: Failed to copy text', error);
        }
    }

    private showCopiedFeedback(): void {
        // Clear existing timeout
        if (this.copiedTimeoutId !== null) {
            clearTimeout(this.copiedTimeoutId);
        }

        // Update button text
        this.updateButtonText(this.data.copiedText || 'Copied!');
        this.updateButtonIcon(true);

        // Set timeout to revert
        this.copiedTimeoutId = window.setTimeout(() => {
            this.updateButtonText('Copy');
            this.updateButtonIcon(false);
            this.copiedTimeoutId = null;
        }, this.config.copiedTimeout);
    }

    private updateButtonText(text: string): void {
        if (this.buttonInstance && this.buttonInstance.getElement) {
            const buttonElement = this.buttonInstance.getElement();
            if (buttonElement) {
                const textElement = buttonElement.querySelector('.xwui-item-text, .xwui-button-text');
                if (textElement) {
                    textElement.textContent = text;
                }
            }
        }
    }

    private updateButtonIcon(copied: boolean): void {
        if (!this.config.showIcon) return;

        if (this.buttonInstance && this.buttonInstance.getElement) {
            const buttonElement = this.buttonInstance.getElement();
            if (buttonElement) {
                const iconElement = buttonElement.querySelector('.xwui-item-icon, .xwui-button-icon');
                if (iconElement && (this.config.copiedIcon || this.config.copyIcon)) {
                    iconElement.innerHTML = copied 
                        ? (this.config.copiedIcon || this.getDefaultCopiedIcon())
                        : (this.config.copyIcon || this.getDefaultCopyIcon());
                }
            }
        }
    }

    private getDefaultCopyIcon(): string {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    }

    private getDefaultCopiedIcon(): string {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    }

    /**
     * Set text to copy
     */
    public setText(text: string): void {
        this.data.text = text;
        this.data.value = text;
        this.originalText = text;
    }

    /**
     * Get the button instance
     */
    public getButtonInstance(): XWUIButton | null {
        return this.buttonInstance;
    }

    public destroy(): void {
        if (this.copiedTimeoutId !== null) {
            clearTimeout(this.copiedTimeoutId);
            this.copiedTimeoutId = null;
        }
        // Child component (buttonInstance) is automatically destroyed by base class
        this.buttonInstance = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUICopyButton as any).componentName = 'XWUICopyButton';


