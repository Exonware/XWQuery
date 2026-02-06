/**
 * useClickOutside Hook
 * Detects clicks outside a specified element and calls a handler
 * Useful for closing dropdowns, popovers, modals, etc.
 */

/**
 * Set up click outside detection for an element
 * @param element - The element to detect clicks outside of
 * @param handler - Callback function to execute when click occurs outside
 * @returns Cleanup function to remove the event listeners
 */
export function useClickOutside(
    element: HTMLElement | null,
    handler: (event: MouseEvent | TouchEvent) => void
): () => void {
    if (!element) {
        // Return no-op cleanup if element is null
        return () => {};
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        
        // Check if click is outside the element
        if (element && !element.contains(target)) {
            handler(event);
        }
    };

    // Use capture phase to catch events before they bubble
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    // Return cleanup function
    return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
        document.removeEventListener('touchstart', handleClickOutside, true);
    };
}

/**
 * Create a reusable click outside manager class
 */
export class ClickOutsideManager {
    private element: HTMLElement | null;
    private handler: (event: MouseEvent | TouchEvent) => void;
    private cleanup: (() => void) | null = null;

    constructor(
        element: HTMLElement | null,
        handler: (event: MouseEvent | TouchEvent) => void
    ) {
        this.element = element;
        this.handler = handler;
        this.attach();
    }

    attach(): void {
        if (this.cleanup) {
            this.cleanup();
            this.cleanup = null;
        }
        this.cleanup = useClickOutside(this.element, this.handler);
    }

    detach(): void {
        if (this.cleanup) {
            this.cleanup();
            this.cleanup = null;
        }
    }

    updateElement(element: HTMLElement | null): void {
        this.element = element;
        this.attach();
    }

    destroy(): void {
        this.detach();
        this.element = null;
        this.handler = () => {};
    }
}

