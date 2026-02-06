/**
 * XWUI Design Tokens
 * TypeScript contract for CSS variables
 * 
 * These tokens point to CSS variables defined in src/styles/
 * They provide autocomplete and type safety without duplicating values.
 */

import { toVar } from './utils';

/**
 * Design tokens organized by category
 * Each token is a reference to a CSS variable
 */
export const vars = {
    // Brand tokens
    brand: {
        name: 'XWUI',
        primary: toVar('brand-primary'),
        secondary: toVar('brand-secondary'),
        tertiary: toVar('brand-tertiary'),
        logoUrl: toVar('brand-logo-url'),
        logoWidth: toVar('brand-logo-width'),
        logoHeight: toVar('brand-logo-height'),
        iconSet: toVar('brand-icon-set'),
    },
    
    // Color tokens
    colors: {
        bg: {
            primary: toVar('bg-primary'),
            secondary: toVar('bg-secondary'),
            tertiary: toVar('bg-tertiary'),
            app: toVar('bg-app'),
            elevated: toVar('bg-elevated'),
            hover: toVar('bg-hover'),
            active: toVar('bg-active'),
            menu: toVar('bg-menu'),
            userInfo: toVar('bg-user-info'),
            assistant: toVar('bg-assistant'),
            view: toVar('bg-view'),
            console: toVar('bg-console'),
            header: toVar('bg-header'),
            viewControls: toVar('bg-view-controls'),
        },
        text: {
            primary: toVar('text-primary'),
            secondary: toVar('text-secondary'),
            tertiary: toVar('text-tertiary'),
            inverse: toVar('text-inverse'),
        },
        border: {
            color: toVar('border-color'),
            light: toVar('border-light'),
            medium: toVar('border-medium'),
            strong: toVar('border-strong'),
        },
        control: {
            bg: toVar('control-bg'),
            bgHover: toVar('control-bg-hover'),
            bgActive: toVar('control-bg-active'),
            border: toVar('control-border'),
            text: toVar('control-text'),
            textSecondary: toVar('control-text-secondary'),
            active: toVar('control-active'),
        },
        status: {
            beforeStart: toVar('status-before-start'),
            beforeStartBorder: toVar('status-before-start-border'),
            beforeStartHover: toVar('status-before-start-hover'),
            processing: toVar('status-processing'),
            processingBorder: toVar('status-processing-border'),
            processingHover: toVar('status-processing-hover'),
            processingText: toVar('status-processing-text'),
            error: toVar('status-error'),
            errorBorder: toVar('status-error-border'),
            errorHover: toVar('status-error-hover'),
            errorText: toVar('status-error-text'),
        },
    },
    
    // Accent tokens
    accent: {
        primary: toVar('accent-primary'),
        hover: toVar('accent-hover'),
        light: toVar('accent-light'),
        success: toVar('accent-success'),
        successHover: toVar('accent-success-hover'),
        warning: toVar('accent-warning'),
        error: toVar('accent-error'),
    },
    
    // Spacing tokens
    spacing: {
        unit: toVar('spacing-unit'),
        xs: toVar('spacing-xs'),
        sm: toVar('spacing-sm'),
        md: toVar('spacing-md'),
        lg: toVar('spacing-lg'),
        xl: toVar('spacing-xl'),
        '2xl': toVar('spacing-2xl'),
        '3xl': toVar('spacing-3xl'),
    },
    
    // Radius tokens
    radius: {
        xs: toVar('radius-xs'),
        sm: toVar('radius-sm'),
        md: toVar('radius-md'),
        lg: toVar('radius-lg'),
        xl: toVar('radius-xl'),
        '2xl': toVar('radius-2xl'),
        full: toVar('radius-full'),
    },
    
    // Shadow tokens
    shadow: {
        xs: toVar('shadow-xs'),
        sm: toVar('shadow-sm'),
        md: toVar('shadow-md'),
        lg: toVar('shadow-lg'),
        xl: toVar('shadow-xl'),
        '2xl': toVar('shadow-2xl'),
        inner: toVar('shadow-inner'),
    },
    
    // Typography tokens
    typography: {
        fontFamily: {
            base: toVar('font-family-base'),
            mono: toVar('font-family-mono'),
        },
        fontWeight: {
            normal: toVar('font-weight-normal'),
            medium: toVar('font-weight-medium'),
            semibold: toVar('font-weight-semibold'),
            bold: toVar('font-weight-bold'),
        },
        fontSize: {
            xs: toVar('font-size-xs'),
            sm: toVar('font-size-sm'),
            base: toVar('font-size-base'),
            lg: toVar('font-size-lg'),
            xl: toVar('font-size-xl'),
            '2xl': toVar('font-size-2xl'),
            '3xl': toVar('font-size-3xl'),
            '4xl': toVar('font-size-4xl'),
        },
        lineHeight: {
            tight: toVar('line-height-tight'),
            normal: toVar('line-height-normal'),
            relaxed: toVar('line-height-relaxed'),
        },
    },
} as const;

/**
 * Type export for design tokens
 */
export type ThemeVars = typeof vars;

/**
 * Available theme options
 */
export type ThemeColor = 'light' | 'dark' | 'silver' | 'night' | 'blue';
export type ThemeAccent = 'blue' | 'purple' | 'green' | 'orange';
export type ThemeRoundness = 'sharp' | 'rounded' | 'pill';
export type ThemeFont = 'inter' | 'system' | 'roboto' | 'geist';
export type ThemeStyle = 'basic' | 'modern';

