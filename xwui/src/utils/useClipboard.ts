/**
 * useClipboard Hook
 * Copy text to clipboard with error handling
 */

/**
 * Copy text to clipboard
 * @param text - Text to copy to clipboard
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (!text) {
        console.warn('copyToClipboard: No text provided');
        return false;
    }

    // Modern Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.warn('Clipboard API failed, falling back to execCommand:', error);
            // Fall through to fallback method
        }
    }

    // Fallback for older browsers
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        
        // Select and copy
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        return successful;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Read text from clipboard
 * @returns Promise resolving to the clipboard text, or null if failed
 */
export async function readFromClipboard(): Promise<string | null> {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.readText) {
        try {
            return await navigator.clipboard.readText();
        } catch (error) {
            console.warn('Failed to read from clipboard:', error);
            return null;
        }
    }

    // Fallback is not available for reading
    console.warn('Clipboard read API not available');
    return null;
}

/**
 * Check if clipboard API is available
 * @returns boolean indicating if clipboard operations are supported
 */
export function isClipboardAvailable(): boolean {
    return !!(navigator.clipboard && navigator.clipboard.writeText);
}

/**
 * Copy manager class for managing clipboard operations
 */
export class ClipboardManager {
    /**
     * Copy text to clipboard
     */
    async copy(text: string): Promise<boolean> {
        return copyToClipboard(text);
    }

    /**
     * Read text from clipboard
     */
    async read(): Promise<string | null> {
        return readFromClipboard();
    }

    /**
     * Check if clipboard is available
     */
    isAvailable(): boolean {
        return isClipboardAvailable();
    }
}

