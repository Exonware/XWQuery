/**
 * XWUIDebugToolbar Component
 * Debug toolbar with play/pause/step controls and breakpoint management
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIList } from '../XWUIList/XWUIList';
import { XWUITable } from '../XWUITable/XWUITable';

export interface Breakpoint {
    id: string;
    line: number;
    file: string;
    condition?: string;
    hitCount?: number;
    enabled: boolean;
}

export interface Variable {
    name: string;
    value: any;
    type?: string;
    scope?: string;
}

// Component-level configuration
export interface XWUIDebugToolbarConfig {
    showVariables?: boolean;
    showCallStack?: boolean;
    showBreakpoints?: boolean;
    className?: string;
}

// Data type
export interface XWUIDebugToolbarData {
    isRunning?: boolean;
    isPaused?: boolean;
    breakpoints?: Breakpoint[];
    variables?: Variable[];
    callStack?: Array<{ file: string; line: number; function: string }>;
    currentLine?: number;
    currentFile?: string;
}

export class XWUIDebugToolbar extends XWUIComponent<XWUIDebugToolbarData, XWUIDebugToolbarConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private panelsElement: HTMLElement | null = null;
    private playButton: XWUIButton | null = null;
    private pauseButton: XWUIButton | null = null;
    private stepOverButton: XWUIButton | null = null;
    private stepIntoButton: XWUIButton | null = null;
    private stepOutButton: XWUIButton | null = null;
    private restartButton: XWUIButton | null = null;
    private breakpointsList: XWUIList | null = null;
    private variablesTable: XWUITable | null = null;
    private callStackList: XWUIList | null = null;
    private actionHandlers: Map<string, Array<() => void>> = new Map();

    constructor(
        container: HTMLElement,
        data: XWUIDebugToolbarData = {},
        conf_comp: XWUIDebugToolbarConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDebugToolbarConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDebugToolbarConfig {
        return {
            showVariables: conf_comp?.showVariables ?? true,
            showCallStack: conf_comp?.showCallStack ?? true,
            showBreakpoints: conf_comp?.showBreakpoints ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-debug-toolbar-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-debug-toolbar';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Toolbar
        this.toolbarElement = this.createToolbar();
        this.wrapperElement.appendChild(this.toolbarElement);

        // Panels
        this.panelsElement = this.createPanels();
        this.wrapperElement.appendChild(this.panelsElement);

        this.container.appendChild(this.wrapperElement);
    }

    private createToolbar(): HTMLElement {
        const toolbar = document.createElement('div');
        toolbar.className = 'xwui-debug-toolbar-controls';

        // Play/Pause
        if (this.data.isPaused || !this.data.isRunning) {
            this.playButton = new XWUIButton(
                toolbar,
                { text: '▶ Play' },
                { variant: 'primary', size: 'small' }
            );
            this.registerChildComponent(this.playButton);
            this.playButton.onClick(() => {
                this.triggerAction('play');
            });
        } else {
            this.pauseButton = new XWUIButton(
                toolbar,
                { text: '⏸ Pause' },
                { variant: 'primary', size: 'small' }
            );
            this.registerChildComponent(this.pauseButton);
            this.pauseButton.onClick(() => {
                this.triggerAction('pause');
            });
        }

        // Step controls
        this.stepOverButton = new XWUIButton(
            toolbar,
            { text: '⏭ Step Over' },
            { variant: 'secondary', size: 'small', disabled: !this.data.isPaused }
        );
        this.registerChildComponent(this.stepOverButton);
        this.stepOverButton.onClick(() => {
            this.triggerAction('stepOver');
        });

        this.stepIntoButton = new XWUIButton(
            toolbar,
            { text: '↓ Step Into' },
            { variant: 'secondary', size: 'small', disabled: !this.data.isPaused }
        );
        this.registerChildComponent(this.stepIntoButton);
        this.stepIntoButton.onClick(() => {
            this.triggerAction('stepInto');
        });

        this.stepOutButton = new XWUIButton(
            toolbar,
            { text: '↑ Step Out' },
            { variant: 'secondary', size: 'small', disabled: !this.data.isPaused }
        );
        this.registerChildComponent(this.stepOutButton);
        this.stepOutButton.onClick(() => {
            this.triggerAction('stepOut');
        });

        // Restart
        this.restartButton = new XWUIButton(
            toolbar,
            { text: '↻ Restart' },
            { variant: 'secondary', size: 'small' }
        );
        this.registerChildComponent(this.restartButton);
        this.restartButton.onClick(() => {
            this.triggerAction('restart');
        });

        return toolbar;
    }

    private createPanels(): HTMLElement {
        const panels = document.createElement('div');
        panels.className = 'xwui-debug-toolbar-panels';

        // Breakpoints
        if (this.config.showBreakpoints) {
            const breakpointsPanel = document.createElement('div');
            breakpointsPanel.className = 'xwui-debug-toolbar-panel';
            breakpointsPanel.innerHTML = '<h4>Breakpoints</h4>';
            const breakpointsContainer = document.createElement('div');
            breakpointsContainer.id = 'debug-breakpoints';
            breakpointsPanel.appendChild(breakpointsContainer);
            panels.appendChild(breakpointsPanel);
            this.renderBreakpoints(breakpointsContainer);
        }

        // Variables
        if (this.config.showVariables) {
            const variablesPanel = document.createElement('div');
            variablesPanel.className = 'xwui-debug-toolbar-panel';
            variablesPanel.innerHTML = '<h4>Variables</h4>';
            const variablesContainer = document.createElement('div');
            variablesContainer.id = 'debug-variables';
            variablesPanel.appendChild(variablesContainer);
            panels.appendChild(variablesPanel);
            this.renderVariables(variablesContainer);
        }

        // Call Stack
        if (this.config.showCallStack) {
            const callStackPanel = document.createElement('div');
            callStackPanel.className = 'xwui-debug-toolbar-panel';
            callStackPanel.innerHTML = '<h4>Call Stack</h4>';
            const callStackContainer = document.createElement('div');
            callStackContainer.id = 'debug-callstack';
            callStackPanel.appendChild(callStackContainer);
            panels.appendChild(callStackPanel);
            this.renderCallStack(callStackContainer);
        }

        return panels;
    }

    private renderBreakpoints(container: HTMLElement): void {
        container.innerHTML = '';
        if (!this.data.breakpoints || this.data.breakpoints.length === 0) {
            container.innerHTML = '<p class="xwui-debug-empty">No breakpoints</p>';
            return;
        }

        const listItems = this.data.breakpoints.map(bp => ({
            id: bp.id,
            label: `${bp.file}:${bp.line}`,
            description: bp.condition ? `if ${bp.condition}` : undefined,
            disabled: !bp.enabled
        }));

        this.breakpointsList = new XWUIList(container, {
            items: listItems
        });
        this.registerChildComponent(this.breakpointsList);

        // Add click handlers
        this.breakpointsList.onItemClick((item, event) => {
            const bp = this.data.breakpoints?.find(b => b.id === item.id);
            if (bp) {
                this.toggleBreakpoint(bp.id);
            }
        });
    }

    private renderVariables(container: HTMLElement): void {
        container.innerHTML = '';
        if (!this.data.variables || this.data.variables.length === 0) {
            container.innerHTML = '<p class="xwui-debug-empty">No variables</p>';
            return;
        }

        const columns = [
            { id: 'name', label: 'Name', dataIndex: 'name' },
            { id: 'value', label: 'Value', dataIndex: 'value' },
            { id: 'type', label: 'Type', dataIndex: 'type' },
            { id: 'scope', label: 'Scope', dataIndex: 'scope' }
        ];

        const tableData = this.data.variables.map(variable => ({
            name: variable.name,
            value: this.formatValue(variable.value),
            type: variable.type || 'unknown',
            scope: variable.scope || 'local'
        }));

        this.variablesTable = new XWUITable(container, {
            columns,
            data: tableData
        });
        this.registerChildComponent(this.variablesTable);
    }

    private renderCallStack(container: HTMLElement): void {
        container.innerHTML = '';
        if (!this.data.callStack || this.data.callStack.length === 0) {
            container.innerHTML = '<p class="xwui-debug-empty">No call stack</p>';
            return;
        }

        const listItems = this.data.callStack.map((frame, index) => ({
            id: `frame-${index}`,
            label: frame.function,
            description: `${frame.file}:${frame.line}`
        }));

        this.callStackList = new XWUIList(container, {
            items: listItems
        });
        this.registerChildComponent(this.callStackList);
    }

    private formatValue(value: any): string {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch {
                return '[Object]';
            }
        }
        return String(value);
    }

    private toggleBreakpoint(breakpointId: string): void {
        if (this.data.breakpoints) {
            const bp = this.data.breakpoints.find(b => b.id === breakpointId);
            if (bp) {
                bp.enabled = !bp.enabled;
                this.render();
                this.triggerAction('breakpointToggled', bp);
            }
        }
    }

    private triggerAction(action: string, data?: any): void {
        const handlers = this.actionHandlers.get(action) || [];
        handlers.forEach(handler => handler());
    }

    public onAction(action: 'play' | 'pause' | 'stepOver' | 'stepInto' | 'stepOut' | 'restart' | 'breakpointToggled', handler: () => void): void {
        if (!this.actionHandlers.has(action)) {
            this.actionHandlers.set(action, []);
        }
        this.actionHandlers.get(action)!.push(handler);
    }

    public setBreakpoints(breakpoints: Breakpoint[]): void {
        this.data.breakpoints = breakpoints;
        const container = document.getElementById('debug-breakpoints');
        if (container) {
            this.renderBreakpoints(container);
        }
    }

    public setVariables(variables: Variable[]): void {
        this.data.variables = variables;
        const container = document.getElementById('debug-variables');
        if (container) {
            this.renderVariables(container);
        }
    }

    public setCallStack(callStack: Array<{ file: string; line: number; function: string }>): void {
        this.data.callStack = callStack;
        const container = document.getElementById('debug-callstack');
        if (container) {
            this.renderCallStack(container);
        }
    }

    public setState(isRunning: boolean, isPaused: boolean): void {
        this.data.isRunning = isRunning;
        this.data.isPaused = isPaused;
        this.render();
    }

    public destroy(): void {
        // Child components (buttons) are automatically destroyed by base class
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.playButton = null;
        this.pauseButton = null;
        this.stepOverButton = null;
        this.stepIntoButton = null;
        this.stepOutButton = null;
        this.restartButton = null;
        this.breakpointsList = null;
        this.variablesTable = null;
        this.callStackList = null;
        this.toolbarElement = null;
        this.panelsElement = null;
        this.actionHandlers.clear();
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDebugToolbar as any).componentName = 'XWUIDebugToolbar';


