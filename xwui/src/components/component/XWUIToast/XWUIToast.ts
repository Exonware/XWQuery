/**
 * XWUIToast Component
 * Toast notification system
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIIcon } from '../XWUIIcon/XWUIIcon';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface ToastOptions {
    message: string;
    title?: string;
    variant?: ToastVariant;
    duration?: number;
    closable?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

// Component-level configuration
export interface XWUIToastConfig {
    position?: ToastPosition;
    maxToasts?: number;
    className?: string;
}

// Data type
export interface XWUIToastData {}

const TOAST_ICONS: Record<ToastVariant, string> = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle'
};

class ToastManager {
    private static instance: ToastManager;
    private containerMap: Map<ToastPosition, HTMLElement> = new Map();
    private toasts: Map<string, HTMLElement> = new Map();
    private config: XWUIToastConfig = {
        position: 'top-right',
        maxToasts: 5
    };

    private constructor() {}

    public static getInstance(): ToastManager {
        if (!ToastManager.instance) {
            ToastManager.instance = new ToastManager();
        }
        return ToastManager.instance;
    }

    public configure(config: XWUIToastConfig): void {
        this.config = { ...this.config, ...config };
    }

    private getContainer(position: ToastPosition): HTMLElement {
        if (!this.containerMap.has(position)) {
            const container = document.createElement('div');
            container.className = `xwui-toast-container xwui-toast-${position}`;
            document.body.appendChild(container);
            this.containerMap.set(position, container);
        }
        return this.containerMap.get(position)!;
    }

    public show(options: ToastOptions): string {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const position = this.config.position || 'top-right';
        const container = this.getContainer(position);

        // Check max toasts
        if (this.toasts.size >= (this.config.maxToasts || 5)) {
            const firstToast = this.toasts.keys().next().value;
            if (firstToast) {
                this.dismiss(firstToast);
            }
        }

        const variant = options.variant || 'info';
        const duration = options.duration ?? 5000;
        const closable = options.closable ?? true;

        const toast = document.createElement('div');
        toast.className = `xwui-toast xwui-toast-${variant}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('data-id', id);

        // Icon - Use XWUIIcon
        const iconElement = document.createElement('span');
        iconElement.className = 'xwui-toast-icon';
        const iconContainer = document.createElement('div');
        const icon = new XWUIIcon(iconContainer, TOAST_ICONS[variant], { size: 20 });
        iconElement.appendChild(iconContainer);
        toast.appendChild(iconElement);

        // Content
        const content = document.createElement('div');
        content.className = 'xwui-toast-content';

        if (options.title) {
            const title = document.createElement('div');
            title.className = 'xwui-toast-title';
            title.textContent = options.title;
            content.appendChild(title);
        }

        const message = document.createElement('div');
        message.className = 'xwui-toast-message';
        message.textContent = options.message;
        content.appendChild(message);

        // Action
        if (options.action) {
            const actionBtn = document.createElement('button');
            actionBtn.className = 'xwui-toast-action';
            actionBtn.textContent = options.action.label;
            actionBtn.addEventListener('click', () => {
                options.action!.onClick();
                this.dismiss(id);
            });
            content.appendChild(actionBtn);
        }

        toast.appendChild(content);

        // Close button - Use XWUIIcon
        if (closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'xwui-toast-close';
            closeBtn.setAttribute('aria-label', 'Close');
            const closeIconContainer = document.createElement('div');
            const closeIcon = new XWUIIcon(closeIconContainer, 'close', { size: 18 });
            closeBtn.appendChild(closeIconContainer);
            closeBtn.addEventListener('click', () => this.dismiss(id));
            toast.appendChild(closeBtn);
        }

        // Add to container
        if (position.includes('top')) {
            container.prepend(toast);
        } else {
            container.appendChild(toast);
        }

        this.toasts.set(id, toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('xwui-toast-visible');
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }

        return id;
    }

    public dismiss(id: string): void {
        const toast = this.toasts.get(id);
        if (!toast) return;

        toast.classList.remove('xwui-toast-visible');
        toast.classList.add('xwui-toast-exiting');

        setTimeout(() => {
            toast.remove();
            this.toasts.delete(id);
        }, 200);
    }

    public dismissAll(): void {
        this.toasts.forEach((_, id) => this.dismiss(id));
    }
}

// Export toast helper functions
export const toast = {
    show: (options: ToastOptions) => ToastManager.getInstance().show(options),
    info: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => 
        ToastManager.getInstance().show({ ...options, message, variant: 'info' }),
    success: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => 
        ToastManager.getInstance().show({ ...options, message, variant: 'success' }),
    warning: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => 
        ToastManager.getInstance().show({ ...options, message, variant: 'warning' }),
    error: (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) => 
        ToastManager.getInstance().show({ ...options, message, variant: 'error' }),
    dismiss: (id: string) => ToastManager.getInstance().dismiss(id),
    dismissAll: () => ToastManager.getInstance().dismissAll(),
    configure: (config: XWUIToastConfig) => ToastManager.getInstance().configure(config)
};

export class XWUIToast extends XWUIComponent<XWUIToastData, XWUIToastConfig> {
    constructor(
        container: HTMLElement,
        data: XWUIToastData = {},
        conf_comp: XWUIToastConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        ToastManager.getInstance().configure(this.config);
    }

    protected createConfig(
        conf_comp?: XWUIToastConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIToastConfig {
        return {
            position: conf_comp?.position ?? 'top-right',
            maxToasts: conf_comp?.maxToasts ?? 5,
            className: conf_comp?.className
        };
    }

    public show(options: ToastOptions): string {
        return toast.show(options);
    }

    public dismiss(id: string): void {
        toast.dismiss(id);
    }

    public dismissAll(): void {
        toast.dismissAll();
    }

    public getElement(): HTMLElement | null {
        return null;
    }

    public destroy(): void {
        toast.dismissAll();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIToast as any).componentName = 'XWUIToast';


