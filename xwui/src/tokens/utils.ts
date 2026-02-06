/**
 * Token Utilities
 * Helper functions for working with CSS variables
 */

/**
 * Creates a CSS variable reference string
 * @param name - The CSS variable name (without -- prefix)
 * @returns CSS variable reference string (e.g., 'var(--text-primary)')
 */
export const toVar = (name: string): string => {
    return `var(--${name})`;
};

/**
 * Creates a CSS variable reference with fallback
 * @param name - The CSS variable name (without -- prefix)
 * @param fallback - Fallback value if variable is not defined
 * @returns CSS variable reference with fallback
 */
export const toVarWithFallback = (name: string, fallback: string): string => {
    return `var(--${name}, ${fallback})`;
};

