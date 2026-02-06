/**
 * Icon Utility Functions
 * Helper functions to create and manage XWUIIcon instances
 */

import { XWUIIcon, type XWUIIconConfig } from './XWUIIcon';
import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

/**
 * Create an XWUIIcon instance and register it as a child component
 * Icon name is dynamically resolved from CSV mapping
 * @param parentComponent - The parent XWUIComponent to register the icon with
 * @param iconName - The master icon name (will be resolved from CSV)
 * @param config - Optional icon configuration (includes shape, fallbackLibrary, etc.)
 * @param conf_sys - Optional system configuration (reads icon styles from XWUIStyle)
 * @param conf_usr - Optional user configuration
 * @returns Object containing the icon instance and its container element
 */
export function createIcon(
    parentComponent: XWUIComponent<any, any>,
    iconName: string,
    config: XWUIIconConfig = {},
    conf_sys?: XWUISystemConfig,
    conf_usr?: XWUIUserConfig
): { icon: XWUIIcon; container: HTMLElement } {
    const container = document.createElement('div');
    const icon = new XWUIIcon(container, iconName, config, conf_sys, conf_usr);
    parentComponent.registerChildComponent(icon);
    return { icon, container };
}

/**
 * Create an icon button with XWUIIcon
 * @param parentComponent - The parent XWUIComponent
 * @param iconName - The name of the icon
 * @param onClick - Click handler
 * @param config - Optional icon configuration
 * @param buttonConfig - Optional button configuration (className, aria-label, etc.)
 * @param conf_sys - Optional system configuration
 * @param conf_usr - Optional user configuration
 * @returns The button element with icon
 */
export function createIconButton(
    parentComponent: XWUIComponent<any, any>,
    iconName: string,
    onClick: () => void,
    config: XWUIIconConfig = {},
    buttonConfig: { className?: string; ariaLabel?: string; title?: string; type?: string } = {},
    conf_sys?: XWUISystemConfig,
    conf_usr?: XWUIUserConfig
): HTMLButtonElement {
    const button = document.createElement('button');
    if (buttonConfig.type) {
        button.type = buttonConfig.type;
    }
    if (buttonConfig.className) {
        button.className = buttonConfig.className;
    }
    if (buttonConfig.ariaLabel) {
        button.setAttribute('aria-label', buttonConfig.ariaLabel);
    }
    if (buttonConfig.title) {
        button.setAttribute('title', buttonConfig.title);
    }

    const { container } = createIcon(parentComponent, iconName, config, conf_sys, conf_usr);
    button.appendChild(container);
    button.addEventListener('click', onClick);

    return button;
}

/**
 * Create an icon in a span element
 * Useful for inline icons that don't need to be buttons
 * @param parentComponent - The parent XWUIComponent
 * @param iconName - The name of the icon
 * @param config - Optional icon configuration
 * @param spanConfig - Optional span configuration (className, aria-hidden, etc.)
 * @param conf_sys - Optional system configuration
 * @param conf_usr - Optional user configuration
 * @returns The span element with icon
 */
export function createIconSpan(
    parentComponent: XWUIComponent<any, any>,
    iconName: string,
    config: XWUIIconConfig = {},
    spanConfig: { className?: string; ariaHidden?: boolean } = {},
    conf_sys?: XWUISystemConfig,
    conf_usr?: XWUIUserConfig
): HTMLSpanElement {
    const span = document.createElement('span');
    if (spanConfig.className) {
        span.className = spanConfig.className;
    }
    if (spanConfig.ariaHidden !== undefined) {
        span.setAttribute('aria-hidden', String(spanConfig.ariaHidden));
    }

    const { container } = createIcon(parentComponent, iconName, config, conf_sys, conf_usr);
    span.appendChild(container);

    return span;
}

