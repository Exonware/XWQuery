/**
 * XWUIConsole Component
 * A console component similar to Chrome DevTools console
 * Displays logs, errors, warnings, and info messages with filtering
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug';

export type ConsoleEventType = 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace' | 'group' | 'groupCollapsed' | 'groupEnd' | 'table' | 'success' | 'system';

export interface ConsoleEvent {
    id: number;
    type: ConsoleEventType;
    timestamp: number | string;  // Unix timestamp (seconds or milliseconds) or ISO string
    color: string;
    label: string;
    msg: string;
    source?: string;              // Source/operation/module name
    level?: LogLevel;             // Explicit level (overrides type mapping)
    data?: any;                   // Additional structured data
}

export interface LogEntry {
    id: string;
    level: LogLevel;
    message: string;
    timestamp: Date;
    source?: string;
    data?: any;
    stack?: string;
    color?: string;
    label?: string;
}

// Component-level configuration (instance-specific)
export interface XWUIConsoleConfig {
    maxEntries?: number;
    showTimestamp?: boolean;
    showSource?: boolean;
    autoScroll?: boolean;
    theme?: 'light' | 'dark';
    formats?: {
        date?: string;
        time?: string;
        datetime?: string;
    };
}

// Data type for XWUIConsole
export interface XWUIConsoleData {
    events?: ConsoleEvent[];
}

/**
 * Reactive data array for XWUIConsole events
 * Supports array access, append, and assignment operations
 */
class ConsoleDataArray extends Array<ConsoleEvent> {
    private updateCallback: () => void;

    constructor(updateCallback: () => void) {
        super();
        this.updateCallback = updateCallback;
    }

    /**
     * Append a new event to the data array
     */
    append(event: ConsoleEvent): void {
        this.push(event);
        this.updateCallback();
    }

    /**
     * Replace all data
     */
    replace(events: ConsoleEvent[]): void {
        this.length = 0;
        this.push(...events);
        this.updateCallback();
    }
}

export class XWUIConsole extends XWUIComponent<XWUIConsoleData, XWUIConsoleConfig> {
    private _data: ConsoleDataArray;
    
    /**
     * Public data property with getter/setter for direct assignment
     * Supports: xwConsole.data = [...] to replace all data
     * 
     * Note: This intentionally overrides the base class data property to provide
     * a reactive array interface. The base class data property is not used.
     */
    // @ts-expect-error - Intentional override: ConsoleDataArray replaces XWUIConsoleData
    public get data(): ConsoleDataArray {
        return this._data;
    }
    
    // @ts-expect-error - Intentional override: ConsoleDataArray replaces XWUIConsoleData
    public set data(value: ConsoleEvent[]) {
        if (this._data) {
            this._data.replace(value);
        } else {
            // If _data is not initialized yet (during super() call), store value to initialize later
            // This will be handled in the constructor after _data is initialized
            if (value && value.length > 0) {
                // Store in a temporary property that will be used in constructor
                (this as any)._pendingData = value;
            }
        }
    }

    private entries: LogEntry[] = [];
    private filteredEntries: LogEntry[] = [];
    private activeFilter: LogLevel | 'all' = 'all';
    private entryIdCounter = 0;

    // DOM elements
    private consoleElement!: HTMLElement;
    private messagesContainer!: HTMLElement;

    constructor(
        container: HTMLElement, 
        data: XWUIConsoleData = {},
        conf_comp: XWUIConsoleConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);

        // Initialize reactive data array with proxy
        const baseArray = new ConsoleDataArray(() => this.syncDataToDisplay());
        this._data = this.createDataProxy(baseArray);

        // Load initial events from data if provided
        if (data.events && data.events.length > 0) {
            this._data.replace(data.events);
        }
        
        // Handle any pending data set during super() call
        if ((this as any)._pendingData) {
            this._data.replace((this as any)._pendingData);
            delete (this as any)._pendingData;
        }

        this.setupDOM();
        this.attachEventListeners();
    }

    protected createConfig(
        conf_comp?: XWUIConsoleConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIConsoleConfig {
        return {
            maxEntries: conf_comp?.maxEntries ?? 1000,
            showTimestamp: conf_comp?.showTimestamp ?? true,
            showSource: conf_comp?.showSource ?? true,
            autoScroll: conf_comp?.autoScroll ?? true,
            theme: conf_comp?.theme ?? 'dark',
            formats: {
                date: conf_comp?.formats?.date || conf_usr?.formats?.date || conf_sys?.formats?.date,
                time: conf_comp?.formats?.time || conf_usr?.formats?.time || conf_sys?.formats?.time,
                datetime: conf_comp?.formats?.datetime || conf_usr?.formats?.datetime || conf_sys?.formats?.datetime
            }
        };
    }


    /**
     * Create Proxy to intercept data array operations and trigger updates
     */
    private createDataProxy(baseArray: ConsoleDataArray): ConsoleDataArray {
        const self = this;
        
        return new Proxy(baseArray, {
            set(target: ConsoleDataArray, property: string | symbol, value: any): boolean {
                const index = typeof property === 'string' ? parseInt(property, 10) : -1;
                
                // Handle index assignment: data[3] = event
                if (!isNaN(index) && index >= 0) {
                    target[index] = value;
                    self.syncDataToDisplay();
                    return true;
                }

                // Handle length changes (push, pop, shift, unshift, splice, etc.)
                if (property === 'length') {
                    const result = Reflect.set(target, property, value);
                    self.syncDataToDisplay();
                    return result;
                }

                // Handle other property assignments
                const result = Reflect.set(target, property, value);
                
                // If it's a method that mutates the array, trigger update
                if (typeof property === 'string' && ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(property)) {
                    // These will be handled by length change or we need to check after
                }
                
                return result;
            },
            
            get(target: ConsoleDataArray, property: string | symbol): any {
                const value = Reflect.get(target, property);
                
                // Intercept array mutation methods
                if (typeof property === 'string' && typeof value === 'function') {
                    if (['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(property)) {
                        return function(...args: any[]) {
                            const result = value.apply(target, args);
                            self.syncDataToDisplay();
                            return result;
                        };
                    }
                }
                
                return value;
            }
        }) as ConsoleDataArray;
    }

    private setupDOM(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-console-container';
        this.container.setAttribute('data-theme', this.config.theme || 'dark');
        
        // Ensure container has proper dimensions
        if (!this.container.style.width && !this.container.style.height) {
            // Only set if not already set by parent
            this.container.style.width = '100%';
            this.container.style.height = '100%';
        }

        // Main console element - simple log list matching prototype
        this.consoleElement = document.createElement('div');
        this.consoleElement.className = 'xwui-console-log-list';

        // Messages container (the log list itself)
        this.messagesContainer = document.createElement('div');
        this.messagesContainer.className = 'xwui-console-messages';

        this.consoleElement.appendChild(this.messagesContainer);
        this.container.appendChild(this.consoleElement);
    }

    private attachEventListeners(): void {
        // No event listeners needed for simple prototype-style display
        // Filtering and other features can be added later if needed
    }

    private setFilter(filter: LogLevel | 'all'): void {
        this.activeFilter = filter;
        this.updateDisplay();
    }

    /**
     * Parse timestamp from various formats (Unix timestamp or ISO string)
     */
    private parseTimestamp(timestamp: number | string | undefined): Date {
        if (!timestamp) {
            return new Date();
        }
        
        // If it's a number (Unix timestamp)
        if (typeof timestamp === 'number') {
            // Check if it's milliseconds (> 1e10) or seconds
            if (timestamp > 1e10) {
                // Milliseconds
                return new Date(timestamp);
            } else {
                // Seconds
                return new Date(timestamp * 1000);
            }
        }
        
        // If it's a string
        if (typeof timestamp === 'string') {
            // Try parsing as number first (Unix timestamp as string)
            const numTimestamp = parseFloat(timestamp);
            if (!isNaN(numTimestamp) && isFinite(numTimestamp)) {
                // Check if it's milliseconds (> 1e10) or seconds
                if (numTimestamp > 1e10) {
                    return new Date(numTimestamp);
                } else {
                    return new Date(numTimestamp * 1000);
                }
            }
            
            // Try parsing as ISO string
            const isoDate = new Date(timestamp);
            if (!isNaN(isoDate.getTime())) {
                return isoDate;
            }
        }
        
        // Fallback to current time
        return new Date();
    }

    /**
     * Sync data array to display (called when data changes)
     */
    private syncDataToDisplay(): void {
        this.entries = [];
        
        for (const event of this._data) {
            // Use explicit level if provided, otherwise map ConsoleEventType to LogLevel
            let level: LogLevel = event.level || 'log';
            if (!event.level) {
                switch (event.type) {
                    case 'error':
                        level = 'error';
                        break;
                    case 'warn':
                        level = 'warn';
                        break;
                    case 'info':
                        level = 'info';
                        break;
                    case 'debug':
                    case 'trace':
                        level = 'debug';
                        break;
                    case 'log':
                    case 'success':
                    case 'system':
                    case 'table':
                    case 'group':
                    case 'groupCollapsed':
                    case 'groupEnd':
                    default:
                        level = 'log';
                        break;
                }
            }

            // Parse timestamp from event (preserve original timestamp)
            const timestamp = this.parseTimestamp(event.timestamp);

            // Create entry for all event types (including table, group, etc.)
            const entry: LogEntry = {
                id: `entry-${event.id}`,
                level,
                message: event.msg,
                timestamp,
                source: event.source,
                data: event.data,
                color: event.color,
                label: event.label
            };
            this.entries.push(entry);
        }

        // Limit entries
        if (this.entries.length > (this.config.maxEntries || 1000)) {
            this.entries = this.entries.slice(-(this.config.maxEntries || 1000));
        }

        this.updateDisplay();
    }

    private updateDisplay(): void {
        // Filter entries
        if (this.activeFilter === 'all') {
            this.filteredEntries = [...this.entries];
        } else {
            this.filteredEntries = this.entries.filter(entry => entry.level === this.activeFilter);
        }

        // Render messages
        this.messagesContainer.innerHTML = '';
        this.filteredEntries.forEach(entry => {
            const messageElement = this.createMessageElement(entry);
            this.messagesContainer.appendChild(messageElement);
        });

        // Auto-scroll to bottom (scroll the log-list container)
        if (this.config.autoScroll !== false) {
            this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
        }
    }

    private createMessageElement(entry: LogEntry): HTMLElement {
        // Match prototype's simple log-row structure: badge (with color), msg (with optional timestamp)
        const row = document.createElement('div');
        row.className = 'xwui-console-log-row';
        row.setAttribute('data-entry-id', entry.id);

        // Badge with colored background (merged circle and label)
        if (entry.label) {
            const badge = document.createElement('span');
            badge.className = 'xwui-console-badge';
            badge.textContent = entry.label;
            
            // Use entry color as background if provided
            if (entry.color) {
                badge.style.background = entry.color;
                // Set text color based on background brightness
                badge.style.color = this.getContrastColor(entry.color);
            }
            
            row.appendChild(badge);
        }

        // Timestamp (show if config enabled)
        if (this.config.showTimestamp !== false && entry.timestamp) {
            const timestamp = document.createElement('span');
            timestamp.className = 'xwui-console-timestamp';
            timestamp.textContent = this.formatTimestamp(entry.timestamp);
            timestamp.style.fontSize = '0.75rem';
            timestamp.style.color = '#888';
            timestamp.style.marginRight = '0.5rem';
            timestamp.style.flexShrink = '0';
            row.appendChild(timestamp);
        }

        // Source (show if config enabled and source exists)
        if (this.config.showSource !== false && entry.source) {
            const source = document.createElement('span');
            source.className = 'xwui-console-source';
            source.textContent = `[${entry.source}]`;
            source.style.fontSize = '0.75rem';
            source.style.color = '#666';
            source.style.marginRight = '0.5rem';
            source.style.flexShrink = '0';
            source.style.fontStyle = 'italic';
            row.appendChild(source);
        }

        // Message (always show, matching prototype)
        const msg = document.createElement('div');
        msg.className = 'xwui-console-msg';
        msg.textContent = entry.message;
        row.appendChild(msg);

        // Copy button (appears on hover)
        const copyButtonContainer = document.createElement('div');
        copyButtonContainer.className = 'xwui-console-copy-button';
        copyButtonContainer.setAttribute('title', 'Copy message');
        
        // Create copy button using icon utilities
        (async () => {
            try {
                const { createIconButton } = await import('../XWUIIcon/icon-utils');
                const copyButton = createIconButton(
                    this,
                    'copy',
                    () => {
                        this.copyMessage(entry.message);
                    },
                    { size: 16, variant: 'none' },
                    { className: 'xwui-console-copy-btn', ariaLabel: 'Copy message', title: 'Copy message' },
                    this.conf_sys,
                    this.conf_usr
                );
                copyButtonContainer.appendChild(copyButton);
            } catch (error) {
                // Fallback: create simple button if icon utilities fail
                const fallbackButton = document.createElement('button');
                fallbackButton.className = 'xwui-console-copy-btn';
                fallbackButton.textContent = '📋';
                fallbackButton.setAttribute('aria-label', 'Copy message');
                fallbackButton.setAttribute('title', 'Copy message');
                fallbackButton.onclick = () => {
                    this.copyMessage(entry.message);
                };
                copyButtonContainer.appendChild(fallbackButton);
            }
        })();
        
        row.appendChild(copyButtonContainer);

        return row;
    }

    /**
     * Copy message to clipboard
     */
    private copyMessage(message: string): void {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(message).then(() => {
                // Optional: show feedback (could be enhanced with a toast notification)
                console.log('Message copied to clipboard');
            }).catch((err) => {
                console.error('Failed to copy message:', err);
                // Fallback for older browsers
                this.fallbackCopyToClipboard(message);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(message);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    private fallbackCopyToClipboard(text: string): void {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }

    private formatTimestamp(date: Date): string {
        // Use effective config format, defaulting to datetime format
        const format = this.getEffectiveConfig().formats?.datetime || 'YYYY-MM-DD HH:mm:ss';
        
        // Simple format implementation (can be enhanced with a proper date formatting library)
        // For now, support basic patterns: YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
        
        // Replace format tokens
        return format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
            .replace('SSS', milliseconds);
    }

    private addEntry(level: LogLevel, message: string, source?: string, data?: any, stack?: string): void {
        const entry: LogEntry = {
            id: `entry-${++this.entryIdCounter}`,
            level,
            message,
            timestamp: new Date(),
            source,
            data,
            stack
        };

        this.entries.push(entry);

        // Limit entries
        if (this.entries.length > (this.config.maxEntries || 1000)) {
            this.entries.shift();
        }

        // Update display if this entry matches current filter
        if (this.activeFilter === 'all' || this.activeFilter === level) {
            const messageElement = this.createMessageElement(entry);
            this.messagesContainer.appendChild(messageElement);

            if (this.config.autoScroll !== false) {
                this.consoleElement.scrollTop = this.consoleElement.scrollHeight;
            }
        }
    }

    // Public API
    public log(message: string, level: LogLevel = 'log', source?: string, data?: any): void {
        this.addEntry(level, message, source, data);
    }

    public error(message: string, source?: string, data?: any, stack?: string): void {
        this.addEntry('error', message, source, data, stack);
    }

    public warn(message: string, source?: string, data?: any): void {
        this.addEntry('warn', message, source, data);
    }

    public info(message: string, source?: string, data?: any): void {
        this.addEntry('info', message, source, data);
    }

    public debug(message: string, source?: string, data?: any): void {
        this.addEntry('debug', message, source, data);
    }

    public clear(): void {
        this.entries = [];
        this.filteredEntries = [];
        this._data.length = 0;
        this.updateDisplay();
    }

    public getEntries(): LogEntry[] {
        return [...this.entries];
    }

    public getFilteredEntries(): LogEntry[] {
        return [...this.filteredEntries];
    }

    public setTheme(theme: 'light' | 'dark'): void {
        this.config = { ...this.config, theme };
        this.container.setAttribute('data-theme', theme);
    }

    /**
     * Load console events from JSON data following XWUIConsole schema
     * @param events Array of console events with id, type, color, label, msg
     * @deprecated Use data property directly: xwConsole.data = events or xwConsole.data.replace(events)
     */
    public loadEvents(events: ConsoleEvent[]): void {
        this._data.replace(events);
    }

    /**
     * Get contrasting text color (white or black) based on background color brightness
     * Uses WCAG relative luminance formula for accurate contrast calculation
     * Handles all CSS color formats: hex, rgb, rgba, hsl, named colors, etc.
     */
    private getContrastColor(backgroundColor: string): string {
        let r = 0, g = 0, b = 0;
        
        // Try direct parsing first for common formats (faster)
        // Handle hex colors (#rgb or #rrggbb)
        if (backgroundColor.startsWith('#')) {
            const hex = backgroundColor.slice(1).toLowerCase();
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            }
        }
        // Handle rgb/rgba colors
        else if (backgroundColor.startsWith('rgb')) {
            const matches = backgroundColor.match(/\d+/g);
            if (matches && matches.length >= 3) {
                r = parseInt(matches[0]);
                g = parseInt(matches[1]);
                b = parseInt(matches[2]);
            }
        }
        
        // If direct parsing didn't work, use browser's color parsing
        if (r === 0 && g === 0 && b === 0 && !backgroundColor.startsWith('#')) {
            try {
                const tempElement = document.createElement('div');
                tempElement.style.color = backgroundColor;
                tempElement.style.position = 'absolute';
                tempElement.style.visibility = 'hidden';
                tempElement.style.opacity = '0';
                document.body.appendChild(tempElement);
                
                const computedColor = window.getComputedStyle(tempElement).color;
                document.body.removeChild(tempElement);
                
                // Extract RGB values from computed color (format: "rgb(r, g, b)" or "rgba(r, g, b, a)")
                const rgbMatch = computedColor.match(/\d+/g);
                if (rgbMatch && rgbMatch.length >= 3) {
                    r = parseInt(rgbMatch[0]);
                    g = parseInt(rgbMatch[1]);
                    b = parseInt(rgbMatch[2]);
                }
            } catch (e) {
                // Fallback: default to white text if parsing fails
                return '#ffffff';
            }
        }
        
        // Validate RGB values
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return '#ffffff'; // Default to white text on error
        }
        
        // Clamp values to valid range
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));
        
        // Convert RGB to relative luminance using WCAG formula
        // https://www.w3.org/WAI/GL/wiki/Relative_luminance
        const normalize = (value: number): number => {
            value = value / 255;
            return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
        };
        
        const rNorm = normalize(r);
        const gNorm = normalize(g);
        const bNorm = normalize(b);
        
        // Calculate relative luminance (0 = black, 1 = white)
        const luminance = 0.2126 * rNorm + 0.7152 * gNorm + 0.0722 * bNorm;
        
        // Use a threshold of 0.5 for better contrast
        // For very light colors (luminance > 0.5), use black text
        // For dark colors (luminance <= 0.5), use white text
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
}

// Set component name at class definition (before minification) - survives build tools
(XWUIConsole as any).componentName = 'XWUIConsole';