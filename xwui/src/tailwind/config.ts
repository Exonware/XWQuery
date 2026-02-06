/**
 * XWUI Tailwind Config Generator
 * Utility to generate Tailwind configuration with XWUI integration
 */

import type { Config } from 'tailwindcss';
import { mapXWUITokensToTailwind } from './token-mapper';

export interface XWUITailwindConfigOptions {
    /**
     * Content paths for Tailwind to scan
     * Defaults to XWUI source paths
     */
    content?: string[];
    
    /**
     * Additional Tailwind plugins to include
     */
    plugins?: any[];
    
    /**
     * Whether to enable JIT mode (default: true)
     */
    jit?: boolean;
    
    /**
     * Additional theme extensions
     */
    themeExtensions?: Partial<Config['theme']>;
}

/**
 * Generates a complete Tailwind configuration with XWUI tokens
 * @param options - Configuration options
 * @returns Tailwind configuration object
 */
export function generateXWUITailwindConfig(
    options: XWUITailwindConfigOptions = {}
): Config {
    const {
        content = [
            './src/**/*.{html,ts,tsx,js,jsx}',
            './index.html',
            './**/*.html',
        ],
        plugins = [],
        jit = true,
        themeExtensions = {},
    } = options;

    const xwuiTheme = mapXWUITokensToTailwind() ?? { extend: {} };

    return {
        content,
        theme: {
            extend: {
                ...xwuiTheme?.extend,
                ...themeExtensions,
            },
        },
        plugins,
        // JIT mode is default in Tailwind v3+
        ...(jit && { mode: 'jit' }),
    };
}

/**
 * Default XWUI Tailwind configuration
 */
export const defaultXWUITailwindConfig = generateXWUITailwindConfig();
