/**
 * XWUIShortcuts Component
 * Keyboard and mouse shortcut handler that can be integrated into any component
 * Only active when the target component is focused
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

//================================================================================
// TYPES
//================================================================================

export interface ShortcutAction {
    action: string;
    description: string;
    type?: 'keyboard' | 'mouse';
    mode?: '2d' | '3d' | 'both';
}

export interface ShortcutsConfig {
    [category: string]: {
        [shortcut: string]: ShortcutAction;
    };
}

// Component-level configuration
export interface XWUIShortcutsConfig {
    shortcuts?: ShortcutsConfig;  // Shortcuts configuration
    targetElement?: HTMLElement;  // Element that must be focused for shortcuts to work
    mode?: '2d' | '3d' | 'both';  // Component mode
    enableFocusDetection?: boolean;  // Default: true
    preventDefault?: boolean;  // Prevent default browser behavior, Default: true
    className?: string;
}

// Data type
export interface XWUIShortcutsData {
    // No data needed, shortcuts are configured via conf_comp
}

// Action handler type
export type ActionHandler = (event: KeyboardEvent | MouseEvent | WheelEvent, shortcut: string) => boolean | void;

export class XWUIShortcuts extends XWUIComponent<XWUIShortcutsData, XWUIShortcutsConfig> {
    private targetElement: HTMLElement | null = null;
    private actionHandlers: Map<string, ActionHandler[]> = new Map();
    private isFocused: boolean = false;
    private currentModifiers: Set<string> = new Set();
    private spacePressed: boolean = false;
    
    // Event handlers
    private boundHandleKeyDown: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleKeyUp: ((e: KeyboardEvent) => void) | null = null;
    private boundHandleWheel: ((e: WheelEvent) => void) | null = null;
    private boundHandleFocus: (() => void) | null = null;
    private boundHandleBlur: (() => void) | null = null;
    private boundHandleMouseDown: ((e: MouseEvent) => void) | null = null;
    private boundHandleMouseUp: ((e: MouseEvent) => void) | null = null;
    
    constructor(
        container: HTMLElement,
        data: XWUIShortcutsData = {},
        conf_comp: XWUIShortcutsConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        this.targetElement = conf_comp.targetElement || container;
        this.setupDOM();
        this.setupEventListeners();
    }
    
    protected createConfig(
        conf_comp?: XWUIShortcutsConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIShortcutsConfig {
        return {
            shortcuts: conf_comp?.shortcuts,
            targetElement: conf_comp?.targetElement,
            mode: conf_comp?.mode || 'both',
            enableFocusDetection: conf_comp?.enableFocusDetection ?? true,
            preventDefault: conf_comp?.preventDefault ?? true,
            className: conf_comp?.className
        };
    }
    
    private setupDOM(): void {
        this.container.innerHTML = '';
        
        // Make target element focusable if focus detection is enabled
        if (this.config.enableFocusDetection && this.targetElement) {
            if (!this.targetElement.hasAttribute('tabindex')) {
                this.targetElement.setAttribute('tabindex', '0');
            }
        }
    }
    
    private setupEventListeners(): void {
        if (!this.targetElement) return;
        
        // Keyboard events
        this.boundHandleKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
        this.boundHandleKeyUp = (e: KeyboardEvent) => this.handleKeyUp(e);
        
        // Mouse events
        this.boundHandleWheel = (e: WheelEvent) => this.handleWheel(e);
        this.boundHandleMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
        this.boundHandleMouseUp = (e: MouseEvent) => this.handleMouseUp(e);
        
        // Focus events
        if (this.config.enableFocusDetection) {
            this.boundHandleFocus = () => {
                this.isFocused = true;
            };
            this.boundHandleBlur = () => {
                this.isFocused = false;
                this.currentModifiers.clear();
            };
            
            this.targetElement.addEventListener('focus', this.boundHandleFocus);
            this.targetElement.addEventListener('blur', this.boundHandleBlur);
        } else {
            // If focus detection is disabled, always consider focused
            this.isFocused = true;
        }
        
        // Use capture phase to catch events before they bubble
        this.targetElement.addEventListener('keydown', this.boundHandleKeyDown, true);
        this.targetElement.addEventListener('keyup', this.boundHandleKeyUp, true);
        this.targetElement.addEventListener('wheel', this.boundHandleWheel, { passive: false, capture: true });
        this.targetElement.addEventListener('mousedown', this.boundHandleMouseDown, true);
        this.targetElement.addEventListener('mouseup', this.boundHandleMouseUp, true);
        
        // Also listen on window for modifier keys
        window.addEventListener('keydown', this.boundHandleKeyDown, true);
        window.addEventListener('keyup', this.boundHandleKeyUp, true);
    }
    
    //================================================================================
    // SHORTCUT DETECTION
    //================================================================================
    
    private updateModifiers(e: KeyboardEvent | MouseEvent): void {
        this.currentModifiers.clear();
        if (e.ctrlKey || e.metaKey) this.currentModifiers.add('Ctrl');
        if (e.shiftKey) this.currentModifiers.add('Shift');
        if (e.altKey) this.currentModifiers.add('Alt');
        if (e.metaKey && !e.ctrlKey) this.currentModifiers.add('Meta');
    }
    
    private getShortcutString(e: KeyboardEvent | MouseEvent | WheelEvent): string {
        const modifiers: string[] = [];
        if (e.ctrlKey || e.metaKey) modifiers.push('Ctrl');
        if (e.shiftKey) modifiers.push('Shift');
        if (e.altKey) modifiers.push('Alt');
        
        if (e instanceof KeyboardEvent) {
            const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
            return modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
        } else if (e instanceof WheelEvent) {
            if (modifiers.length > 0) {
                return `${modifiers.join('+')}+Mouse Wheel`;
            }
            return 'Mouse Wheel';
        } else if (e instanceof MouseEvent) {
            const button = e.button === 0 ? 'Left' : e.button === 1 ? 'Middle' : e.button === 2 ? 'Right' : '';
            const action = e.type === 'mousedown' ? 'Drag' : '';
            if (modifiers.length > 0 && button) {
                return `${modifiers.join('+')}+${button} Mouse ${action}`;
            } else if (button) {
                return `${button} Mouse ${action}`;
            }
        }
        
        return '';
    }
    
    private findShortcut(shortcutString: string, event: KeyboardEvent | MouseEvent | WheelEvent): { category: string; shortcut: string; action: ShortcutAction } | null {
        if (!this.config.shortcuts) return null;
        
        // Try exact match first
        for (const [category, shortcuts] of Object.entries(this.config.shortcuts)) {
            if (shortcuts[shortcutString]) {
                const action = shortcuts[shortcutString];
                // Check mode compatibility
                if (action.mode && this.config.mode && action.mode !== 'both' && this.config.mode !== action.mode) {
                    continue;
                }
                return { category, shortcut: shortcutString, action };
            }
        }
        
        // Try partial matches for mouse drag events
        if (event instanceof MouseEvent && event.type === 'mousedown') {
            const dragPattern = shortcutString.replace('Drag', 'Drag');
            for (const [category, shortcuts] of Object.entries(this.config.shortcuts)) {
                for (const [key, action] of Object.entries(shortcuts)) {
                    if (key.includes('Drag') && this.matchesMouseShortcut(key, event)) {
                        if (action.mode && this.config.mode && action.mode !== 'both' && this.config.mode !== action.mode) {
                            continue;
                        }
                        return { category, shortcut: key, action };
                    }
                }
            }
        }
        
        return null;
    }
    
    private matchesMouseShortcut(shortcutKey: string, event: MouseEvent): boolean {
        const modifiers: string[] = [];
        if (event.ctrlKey || event.metaKey) modifiers.push('Ctrl');
        if (event.shiftKey) modifiers.push('Shift');
        if (event.altKey) modifiers.push('Alt');
        if (this.spacePressed) modifiers.push('Space');
        
        const button = event.button === 0 ? 'Left' : event.button === 1 ? 'Middle' : event.button === 2 ? 'Right' : '';
        
        // Check for exact match
        if (shortcutKey.includes(button + ' Mouse Drag') || shortcutKey.includes(button + ' Mouse')) {
            const parts = shortcutKey.split('+');
            const expectedModifiers = parts.filter(p => !p.includes('Mouse'));
            const expectedButton = parts.find(p => p.includes('Mouse'))?.replace(' Mouse Drag', '').replace(' Mouse', '') || '';
            
            if (expectedButton && button === expectedButton) {
                return expectedModifiers.every(mod => modifiers.includes(mod)) && 
                       modifiers.length === expectedModifiers.length;
            }
        }
        
        // Check for Space+Drag
        if (shortcutKey === 'Space+Drag' && this.spacePressed && event.button === 0) {
            return true;
        }
        
        return false;
    }
    
    //================================================================================
    // EVENT HANDLERS
    //================================================================================
    
    private handleKeyDown(e: KeyboardEvent): void {
        // Track space key for Space+Drag
        if (e.key === ' ' || e.code === 'Space') {
            this.spacePressed = true;
        }
        
        // Only handle if focused (or focus detection disabled)
        if (this.config.enableFocusDetection && !this.isFocused) return;
        
        // Don't handle if typing in input/textarea
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
        }
        
        this.updateModifiers(e);
        const shortcutString = this.getShortcutString(e);
        const shortcut = this.findShortcut(shortcutString, e);
        
        if (shortcut) {
            const handlers = this.actionHandlers.get(shortcut.action.action) || [];
            let handled = false;
            
            for (const handler of handlers) {
                const result = handler(e, shortcutString);
                if (result === true || result === false) {
                    handled = result;
                    break;
                }
            }
            
            if (handled && this.config.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
    
    private handleKeyUp(e: KeyboardEvent): void {
        // Track space key release
        if (e.key === ' ' || e.code === 'Space') {
            this.spacePressed = false;
        }
        this.updateModifiers(e);
    }
    
    private handleWheel(e: WheelEvent): void {
        if (this.config.enableFocusDetection && !this.isFocused) return;
        
        this.updateModifiers(e);
        const shortcutString = this.getShortcutString(e);
        const shortcut = this.findShortcut(shortcutString, e);
        
        if (shortcut) {
            const handlers = this.actionHandlers.get(shortcut.action.action) || [];
            let handled = false;
            
            for (const handler of handlers) {
                const result = handler(e, shortcutString);
                if (result === true || result === false) {
                    handled = result;
                    break;
                }
            }
            
            if (handled && this.config.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
    
    private handleMouseDown(e: MouseEvent): void {
        if (this.config.enableFocusDetection && !this.isFocused) return;
        
        this.updateModifiers(e);
        const shortcutString = this.getShortcutString(e);
        const shortcut = this.findShortcut(shortcutString, e);
        
        if (shortcut && shortcut.action.type === 'mouse') {
            const handlers = this.actionHandlers.get(shortcut.action.action) || [];
            let handled = false;
            
            for (const handler of handlers) {
                const result = handler(e, shortcutString);
                if (result === true || result === false) {
                    handled = result;
                    break;
                }
            }
            
            if (handled && this.config.preventDefault) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }
    
    private handleMouseUp(e: MouseEvent): void {
        this.updateModifiers(e);
    }
    
    //================================================================================
    // PUBLIC API
    //================================================================================
    
    /**
     * Register an action handler
     * @param action Action name (e.g., 'copy', 'paste', 'pan')
     * @param handler Handler function that returns true if handled, false to continue, or void
     */
    public onAction(action: string, handler: ActionHandler): void {
        if (!this.actionHandlers.has(action)) {
            this.actionHandlers.set(action, []);
        }
        this.actionHandlers.get(action)!.push(handler);
    }
    
    /**
     * Remove an action handler
     */
    public offAction(action: string, handler: ActionHandler): void {
        const handlers = this.actionHandlers.get(action);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    /**
     * Get all registered shortcuts
     */
    public getShortcuts(): ShortcutsConfig | null {
        return this.config.shortcuts || null;
    }
    
    /**
     * Update shortcuts configuration
     */
    public setShortcuts(shortcuts: ShortcutsConfig): void {
        this.config.shortcuts = shortcuts;
    }
    
    /**
     * Focus the target element (enables shortcuts)
     */
    public focus(): void {
        if (this.targetElement && this.config.enableFocusDetection) {
            this.targetElement.focus();
        }
    }
    
    /**
     * Check if shortcuts are currently active (element is focused)
     */
    public isActive(): boolean {
        return this.isFocused || !this.config.enableFocusDetection;
    }
    
    public destroy(): void {
        if (this.targetElement) {
            if (this.boundHandleKeyDown) {
                this.targetElement.removeEventListener('keydown', this.boundHandleKeyDown, true);
                window.removeEventListener('keydown', this.boundHandleKeyDown, true);
            }
            if (this.boundHandleKeyUp) {
                this.targetElement.removeEventListener('keyup', this.boundHandleKeyUp, true);
                window.removeEventListener('keyup', this.boundHandleKeyUp, true);
            }
            if (this.boundHandleWheel) {
                this.targetElement.removeEventListener('wheel', this.boundHandleWheel, true);
            }
            if (this.boundHandleMouseDown) {
                this.targetElement.removeEventListener('mousedown', this.boundHandleMouseDown, true);
            }
            if (this.boundHandleMouseUp) {
                this.targetElement.removeEventListener('mouseup', this.boundHandleMouseUp, true);
            }
            if (this.boundHandleFocus) {
                this.targetElement.removeEventListener('focus', this.boundHandleFocus);
            }
            if (this.boundHandleBlur) {
                this.targetElement.removeEventListener('blur', this.boundHandleBlur);
            }
        }
        
        this.actionHandlers.clear();
        this.targetElement = null;
        
        super.destroy();
    }
}

(XWUIShortcuts as any).componentName = 'XWUIShortcuts';

