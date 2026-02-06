/**
 * Generic Custom Element wrapper factory for XWUIComponent
 * Automatically handles conf_comp, data, conf_sys, conf_usr parsing
 * 
 * Usage:
 * ```typescript
 * import { createXWUIElement } from './XWUIComponent.element';
 * createXWUIElement(MyComponent, 'my-component');
 * ```
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from './XWUIComponent';

/**
 * Normalize attributes: merge flat attributes into conf_comp and data
 * Flat attributes override grouped attributes
 */
function normalizeAttributes(
    element: HTMLElement,
    flatAttrsToConfig: string[] = [],  // Attributes that go into conf_comp
    flatAttrsToData: string[] = []      // Attributes that go into data
): { conf_comp: any; data: any; conf_sys?: XWUISystemConfig; conf_usr?: XWUIUserConfig } {
    // Parse grouped attributes
    const confComp = parseJSONAttribute(element.getAttribute('conf-comp') || '{}');
    const data = parseJSONAttribute(element.getAttribute('data') || '{}');
    const confSys = parseJSONAttribute(element.getAttribute('conf-sys') || '{}');
    const confUsr = parseJSONAttribute(element.getAttribute('conf-usr') || '{}');
    
    // Merge flat attributes into conf_comp
    const mergedConfComp = { ...confComp };
    flatAttrsToConfig.forEach(attr => {
        const kebabAttr = attr.replace(/([A-Z])/g, '-$1').toLowerCase();
        const value = element.getAttribute(kebabAttr);
        if (value !== null) {
            // Try to parse as JSON, fallback to string
            try {
                mergedConfComp[attr] = JSON.parse(value);
            } catch {
                mergedConfComp[attr] = value;
            }
        }
    });
    
    // Merge flat attributes into data
    const mergedData = { ...data };
    flatAttrsToData.forEach(attr => {
        const kebabAttr = attr.replace(/([A-Z])/g, '-$1').toLowerCase();
        const value = element.getAttribute(kebabAttr);
        if (value !== null) {
            // Try to parse as JSON, fallback to string
            try {
                mergedData[attr] = JSON.parse(value);
            } catch {
                mergedData[attr] = value;
            }
        }
    });
    
    return {
        conf_comp: mergedConfComp,
        data: mergedData,
        conf_sys: Object.keys(confSys).length > 0 ? confSys : undefined,
        conf_usr: Object.keys(confUsr).length > 0 ? confUsr : undefined
    };
}

/**
 * Parse JSON attribute safely (extracted for reuse)
 */
function parseJSONAttribute(str: string): any {
    try {
        return JSON.parse(str);
    } catch (error) {
        // Try to fix common escaping issues
        try {
            let fixed = str;
            fixed = fixed.replace(/"([^"\\]|\\.)*"/g, (match) => {
                return match.replace(/(?<!\\)\n/g, '\\n')
                           .replace(/(?<!\\)\r/g, '\\r')
                           .replace(/(?<!\\)\t/g, '\\t')
                           .replace(/(?<!\\)"/g, '\\"');
            });
            return JSON.parse(fixed);
        } catch (secondError) {
            try {
                const manuallyFixed = str.replace(/\n/g, '\\n')
                                        .replace(/\r/g, '\\r')
                                        .replace(/\t/g, '\\t');
                return JSON.parse(manuallyFixed);
            } catch (thirdError) {
                return {};
            }
        }
    }
}

/**
 * Create a Custom Element wrapper for any XWUIComponent subclass
 * Supports both flat attributes (standard HTML) and grouped attributes (XWUI pattern)
 * 
 * @param ComponentClass - The component class to wrap
 * @param elementName - The kebab-case custom element name (e.g., 'xwui-script-editor')
 * @param options - Optional configuration for attribute normalization
 * @returns The Custom Element class (already registered)
 */
export function createXWUIElement<T extends XWUIComponent<any, any>>(
    ComponentClass: new (container: HTMLElement, data?: any, conf_comp?: any, conf_sys?: XWUISystemConfig, conf_usr?: XWUIUserConfig) => T,
    elementName: string,
    options?: {
        flatAttrsToConfig?: string[];  // Flat attributes that should go into conf_comp
        flatAttrsToData?: string[];    // Flat attributes that should go into data
    }
): typeof HTMLElement {
    // Skip if already registered
    const existingElement = customElements.get(elementName);
    if (existingElement) {
        return existingElement as typeof HTMLElement;
    }

    const flatAttrsToConfig = options?.flatAttrsToConfig || [];
    const flatAttrsToData = options?.flatAttrsToData || [];

    class ComponentElement extends HTMLElement {
        private instance?: T;

        connectedCallback() {
            // Normalize attributes: merge flat attributes into conf_comp and data
            const normalized = normalizeAttributes(this, flatAttrsToConfig, flatAttrsToData);

            // Initialize component - 'this' IS the container
            this.instance = new ComponentClass(
                this,
                normalized.data,
                normalized.conf_comp,
                normalized.conf_sys,
                normalized.conf_usr
            );
        }

        disconnectedCallback() {
            // Cleanup when element is removed
            if (this.instance && typeof (this.instance as any).destroy === 'function') {
                (this.instance as any).destroy();
            }
            this.instance = undefined;
        }


        /**
         * Get component instance (for advanced usage)
         */
        getInstance(): T | undefined {
            return this.instance;
        }

        /**
         * Update data - generic update, components can override for specific logic
         */
        setData(data: any): void {
            if (this.instance && this.instance.data) {
                Object.assign(this.instance.data, data);
            }
        }

        /**
         * Update conf_comp - generic update, components can override for specific logic
         */
        setConfComp(confComp: any): void {
            if (this.instance && this.instance.config) {
                Object.assign(this.instance.config, confComp);
            }
        }
    }

    // Register the custom element with error handling
    try {
        customElements.define(elementName, ComponentElement);
    } catch (error) {
        // If registration fails, check if it's already registered
        const alreadyRegistered = customElements.get(elementName);
        if (alreadyRegistered) {
            // If it exists, return the existing element
            return alreadyRegistered as typeof HTMLElement;
        }
        // If it's a different error, log it and rethrow
        console.error(`Failed to register custom element '${elementName}':`, error);
        throw error;
    }

    return ComponentElement;
}

