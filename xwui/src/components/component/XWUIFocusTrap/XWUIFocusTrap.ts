/**
 * XWUIFocusTrap Component
 * Utility component to trap focus within a container
 * Essential for accessible Modals, Drawers, and Popovers
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIFocusTrapConfig {
    active?: boolean;
    returnFocusOnDeactivate?: boolean;
    initialFocus?: HTMLElement | string; // Element or selector
    fallbackFocus?: HTMLElement | string;
    className?: string;
}

// Data type
export interface XWUIFocusTrapData {
    container?: HTMLElement;
}

export class XWUIFocusTrap extends XWUIComponent<XWUIFocusTrapData, XWUIFocusTrapConfig> {
    private trapElement: HTMLElement | null = null;
    private previouslyFocusedElement: HTMLElement | null = null;
    private isActive: boolean = false;
    private keydownHandler: ((e: KeyboardEvent) => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIFocusTrapData = {},
        conf_comp: XWUIFocusTrapConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.trapElement = this.data.container || this.container;
        this.previouslyFocusedElement = document.activeElement as HTMLElement;
        
        if (this.config.active !== false) {
            this.activate();
        }
    }

    protected createConfig(
        conf_comp?: XWUIFocusTrapConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFocusTrapConfig {
        return {
            active: conf_comp?.active ?? true,
            returnFocusOnDeactivate: conf_comp?.returnFocusOnDeactivate ?? true,
            initialFocus: conf_comp?.initialFocus,
            fallbackFocus: conf_comp?.fallbackFocus,
            className: conf_comp?.className
        };
    }

    private render(): void {
        // FocusTrap doesn't render UI, it just manages focus
        if (this.config.className && this.trapElement) {
            this.trapElement.classList.add(this.config.className);
        }
    }

    /**
     * Activate focus trap
     */
    public activate(): void {
        if (this.isActive) return;

        this.isActive = true;
        this.trapElement = this.data.container || this.container;

        // Store previously focused element
        this.previouslyFocusedElement = document.activeElement as HTMLElement;

        // Set up keyboard handler
        this.keydownHandler = (e: KeyboardEvent) => {
            if (e.key === 'Tab' && this.trapElement) {
                this.handleTab(e);
            }
        };

        document.addEventListener('keydown', this.keydownHandler);

        // Focus initial element
        this.focusInitialElement();
    }

    /**
     * Deactivate focus trap
     */
    public deactivate(): void {
        if (!this.isActive) return;

        this.isActive = false;

        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }

        // Return focus to previously focused element
        if (this.config.returnFocusOnDeactivate && this.previouslyFocusedElement) {
            this.previouslyFocusedElement.focus();
        }
    }

    private handleTab(e: KeyboardEvent): void {
        if (!this.trapElement) return;

        const focusableElements = this.getFocusableElements();
        
        if (focusableElements.length === 0) {
            e.preventDefault();
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentElement = document.activeElement;

        // If no element is focused, focus first
        if (!currentElement || !this.trapElement.contains(currentElement)) {
            e.preventDefault();
            firstElement.focus();
            return;
        }

        // Handle Tab key
        if (e.shiftKey) {
            // Shift+Tab: move to previous element
            if (currentElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab: move to next element
            if (currentElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    private getFocusableElements(): HTMLElement[] {
        if (!this.trapElement) return [];

        const selector = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');

        const elements = Array.from(this.trapElement.querySelectorAll<HTMLElement>(selector));

        return elements.filter(el => {
            // Check if element is visible
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') {
                return false;
            }

            // Check if element is not disabled
            if (el.hasAttribute('disabled')) {
                return false;
            }

            return true;
        });
    }

    private focusInitialElement(): void {
        if (!this.trapElement) return;

        let elementToFocus: HTMLElement | null = null;

        // Try to focus specified initial element
        if (this.config.initialFocus) {
            if (typeof this.config.initialFocus === 'string') {
                elementToFocus = this.trapElement.querySelector<HTMLElement>(this.config.initialFocus);
            } else {
                elementToFocus = this.config.initialFocus;
            }
        }

        // If not found, try fallback
        if (!elementToFocus && this.config.fallbackFocus) {
            if (typeof this.config.fallbackFocus === 'string') {
                elementToFocus = this.trapElement.querySelector<HTMLElement>(this.config.fallbackFocus);
            } else {
                elementToFocus = this.config.fallbackFocus;
            }
        }

        // If still not found, focus first focusable element
        if (!elementToFocus) {
            const focusableElements = this.getFocusableElements();
            if (focusableElements.length > 0) {
                elementToFocus = focusableElements[0];
            }
        }

        // Focus the element
        if (elementToFocus) {
            setTimeout(() => {
                elementToFocus!.focus();
            }, 0);
        }
    }

    /**
     * Update trap container
     */
    public setContainer(container: HTMLElement): void {
        const wasActive = this.isActive;
        if (wasActive) {
            this.deactivate();
        }
        
        this.data.container = container;
        this.trapElement = container;
        
        if (wasActive) {
            this.activate();
        }
    }

    public getElement(): HTMLElement | null {
        return this.trapElement;
    }

    public destroy(): void {
        this.deactivate();
        this.trapElement = null;
        this.previouslyFocusedElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIFocusTrap as any).componentName = 'XWUIFocusTrap';


