/**
 * XWUI Tailwind Token Mapper
 * Maps XWUI CSS variables to Tailwind theme tokens
 * 
 * This utility converts XWUI's CSS variable-based design system
 * into Tailwind CSS configuration tokens.
 */

import type { Config } from 'tailwindcss';

/**
 * Maps XWUI CSS variable names to Tailwind theme paths
 * Uses CSS variable references in Tailwind config
 */
export function mapXWUITokensToTailwind(): Partial<Config['theme']> {
    return {
        extend: {
            colors: {
                // Brand colors
                brand: {
                    primary: 'var(--brand-primary)',
                    secondary: 'var(--brand-secondary)',
                    tertiary: 'var(--brand-tertiary)',
                },
                // Background colors
                bg: {
                    primary: 'var(--bg-primary)',
                    secondary: 'var(--bg-secondary)',
                    tertiary: 'var(--bg-tertiary)',
                    app: 'var(--bg-app)',
                    elevated: 'var(--bg-elevated)',
                    hover: 'var(--bg-hover)',
                    active: 'var(--bg-active)',
                    menu: 'var(--bg-menu)',
                    'user-info': 'var(--bg-user-info)',
                    assistant: 'var(--bg-assistant)',
                    view: 'var(--bg-view)',
                    console: 'var(--bg-console)',
                    header: 'var(--bg-header)',
                    'view-controls': 'var(--bg-view-controls)',
                },
                // Text colors
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                    tertiary: 'var(--text-tertiary)',
                    inverse: 'var(--text-inverse)',
                },
                // Border colors
                border: {
                    DEFAULT: 'var(--border-color)',
                    light: 'var(--border-light)',
                    medium: 'var(--border-medium)',
                    strong: 'var(--border-strong)',
                },
                // Control colors
                control: {
                    bg: 'var(--control-bg)',
                    'bg-hover': 'var(--control-bg-hover)',
                    'bg-active': 'var(--control-bg-active)',
                    border: 'var(--control-border)',
                    text: 'var(--control-text)',
                    'text-secondary': 'var(--control-text-secondary)',
                    active: 'var(--control-active)',
                },
                // Status colors
                status: {
                    'before-start': 'var(--status-before-start)',
                    'before-start-border': 'var(--status-before-start-border)',
                    'before-start-hover': 'var(--status-before-start-hover)',
                    processing: 'var(--status-processing)',
                    'processing-border': 'var(--status-processing-border)',
                    'processing-hover': 'var(--status-processing-hover)',
                    'processing-text': 'var(--status-processing-text)',
                    error: 'var(--status-error)',
                    'error-border': 'var(--status-error-border)',
                    'error-hover': 'var(--status-error-hover)',
                    'error-text': 'var(--status-error-text)',
                },
                // Accent colors
                accent: {
                    primary: 'var(--accent-primary)',
                    hover: 'var(--accent-hover)',
                    light: 'var(--accent-light)',
                    success: 'var(--accent-success)',
                    'success-hover': 'var(--accent-success-hover)',
                    warning: 'var(--accent-warning)',
                    error: 'var(--accent-error)',
                },
            },
            spacing: {
                unit: 'var(--spacing-unit)',
                xs: 'var(--spacing-xs)',
                sm: 'var(--spacing-sm)',
                md: 'var(--spacing-md)',
                lg: 'var(--spacing-lg)',
                xl: 'var(--spacing-xl)',
                '2xl': 'var(--spacing-2xl)',
                '3xl': 'var(--spacing-3xl)',
            },
            borderRadius: {
                xs: 'var(--radius-xs)',
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                full: 'var(--radius-full)',
            },
            boxShadow: {
                xs: 'var(--shadow-xs)',
                sm: 'var(--shadow-sm)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
                '2xl': 'var(--shadow-2xl)',
                inner: 'var(--shadow-inner)',
            },
            fontFamily: {
                base: ['var(--font-family-base)'],
                mono: ['var(--font-family-mono)'],
            },
            fontWeight: {
                normal: 'var(--font-weight-normal)',
                medium: 'var(--font-weight-medium)',
                semibold: 'var(--font-weight-semibold)',
                bold: 'var(--font-weight-bold)',
            },
            fontSize: {
                xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
                sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
                base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
                lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-normal)' }],
                xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-normal)' }],
                '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-relaxed)' }],
                '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-relaxed)' }],
                '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-relaxed)' }],
            },
            lineHeight: {
                tight: 'var(--line-height-tight)',
                normal: 'var(--line-height-normal)',
                relaxed: 'var(--line-height-relaxed)',
            },
        },
    };
}

/**
 * Converts a CSS variable name to Tailwind theme path
 * @param cssVar - CSS variable name (with or without -- prefix)
 * @returns Tailwind theme path
 */
export function cssVarToTailwindPath(cssVar: string): string {
    // Remove -- prefix if present
    const name = cssVar.startsWith('--') ? cssVar.slice(2) : cssVar;
    // Convert kebab-case to camelCase for nested paths
    return name.split('-').join('.');
}

/**
 * Creates Tailwind theme value from CSS variable
 * @param cssVar - CSS variable name (with or without -- prefix)
 * @returns CSS variable reference for Tailwind
 */
export function cssVarToTailwindValue(cssVar: string): string {
    const name = cssVar.startsWith('--') ? cssVar : `--${cssVar}`;
    return `var(${name})`;
}
