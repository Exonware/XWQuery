/**
 * XWUIWorkflow Component
 * Interactive workflow visualization component with nodes and connections
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

//================================================================================
// TYPES
//================================================================================

interface Point {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface Port {
    id: string;
    direction: 'in' | 'out';
    label: string;
    color: string;
}

interface NodeStyle {
    border: { color: string; style: string; width: number };
    background: { color: string };
    cornerRadius: { left: number; right: number };
}

interface NodeTypeSchema {
    icon: string;
    layout?: 'icon_only' | 'full';
    size: Size;
    style: NodeStyle;
    ports: {
        top: Port[];
        bottom: Port[];
        left: Port[];
        right: Port[];
    };
}

interface NodeInstance {
    id: string;
    typeId: string;
    title: string;
    position: Point;
}

interface Connection {
    id: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
}

interface WorkflowSchema {
    nodeTypes: Record<string, NodeTypeSchema>;
}

interface WorkflowData {
    nodes: NodeInstance[];
    connections: Connection[];
}

interface FullWorkflow {
    schema: WorkflowSchema;
    data: WorkflowData;
}

interface ResolvedCanvasNode extends NodeInstance, NodeTypeSchema {}

type DragConnectionState = {
    sourceNodeId: string;
    sourcePortId: string;
    startPos: Point;
    startSide: string;
    endPos: Point;
    originalConnection?: Connection;
} | null;

type ContextMenuItem = { label: string; action: () => void };
type ContextMenuState = { x: number; y: number; items: ContextMenuItem[] } | null;

// Component-level configuration
export interface XWUIWorkflowConfig {
    showTabs?: boolean;
    defaultTab?: 'view' | 'data';
    className?: string;
}

// Data type
export interface XWUIWorkflowData {
    workflow?: FullWorkflow;
}

export class XWUIWorkflow extends XWUIComponent<XWUIWorkflowData, XWUIWorkflowConfig> {
    private wrapperElement: HTMLElement | null = null;
    private headerElement: HTMLElement | null = null;
    private mainElement: HTMLElement | null = null;
    private canvasElement: HTMLElement | null = null;
    private dataTabElement: HTMLElement | null = null;
    private textareaElement: HTMLTextAreaElement | null = null;
    private contextMenuElement: HTMLElement | null = null;
    private svgElement: SVGElement | null = null;
    
    private currentTab: 'view' | 'data' = 'view';
    private dragConnection: DragConnectionState = null;
    private contextMenu: ContextMenuState = null;
    private fullWorkflow: FullWorkflow;
    private resolvedNodes: ResolvedCanvasNode[] = [];
    private nodeMap: Map<string, ResolvedCanvasNode> = new Map();
    private nodeElementMap: Map<string, HTMLElement> = new Map();
    private connectionElementMap: Map<string, { g: SVGGElement; paths: SVGPathElement[] }> = new Map();
    private draggingNodeId: string | null = null;
    private dragOffset: Point = { x: 0, y: 0 };
    private dragConnectionPathElement: SVGPathElement | null = null;
    private animationFrameId: number | null = null;
    private boundHandleMouseMove: ((e: MouseEvent) => void) | null = null;
    private boundHandleMouseUp: ((e: MouseEvent) => void) | null = null;
    private boundHandleClick: (() => void) | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIWorkflowData = {},
        conf_comp: XWUIWorkflowConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.fullWorkflow = data.workflow || this.getDefaultWorkflow();
        this.loadCSS();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIWorkflowConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIWorkflowConfig {
        return {
            showTabs: conf_comp?.showTabs ?? true,
            defaultTab: conf_comp?.defaultTab ?? 'view',
            className: conf_comp?.className
        };
    }

    private loadCSS(): void {
        const existingLink = document.getElementById('xwui-workflow-stylesheet');
        if (existingLink) {
            return;
        }

        const link = document.createElement('link');
        link.id = 'xwui-workflow-stylesheet';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        
        const scripts = document.getElementsByTagName('script');
        let basePath = '/static/';
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src.includes('/dist/')) {
                const match = src.match(/(.*\/)dist\//);
                if (match) {
                    basePath = match[1];
                    break;
                }
            }
        }
        
        link.href = `${basePath}dist/components/XWUIWorkflow/XWUIWorkflow.css`;
        document.head.appendChild(link);
    }

    private getDefaultWorkflow(): FullWorkflow {
        return {
            schema: {
                nodeTypes: {
                    trigger: {
                        icon: "⚡️",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#FF4A4A", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 40, right: 12 } },
                        ports: { top: [], bottom: [], left: [], right: [{ id: "out_1", direction: "out", label: "Message", color: "#FF4A4A" }] },
                    },
                    slack: {
                        icon: "💬",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#4A154B", style: "solid", width: 2 }, background: { color: "#111827" }, cornerRadius: { left: 12, right: 12 } },
                        ports: { top: [], bottom: [], left: [{ id: "in_1", direction: "in", label: "Input", color: "#4A154B" }], right: [] },
                    },
                    placeholder: {
                        icon: "❓",
                        layout: 'icon_only',
                        size: { width: 80, height: 80 },
                        style: { border: { color: "#9ca3af", style: "dashed", width: 2 }, background: { color: "#1f2937" }, cornerRadius: { left: 12, right: 12 } },
                        ports: { top: [], bottom: [], right: [], left: [{ id: "in_placeholder", direction: 'in', label: 'Input', color: '#9ca3af' }] },
                    }
                }
            },
            data: {
                nodes: [],
                connections: []
            }
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.resolvedNodes = [];
        this.nodeMap.clear();
        this.nodeElementMap.clear();
        this.connectionElementMap.clear();
        this.dragConnectionPathElement = null;

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-workflow';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        if (this.config.showTabs) {
            this.renderHeader();
        }

        this.mainElement = document.createElement('div');
        this.mainElement.className = 'xwui-workflow-main';

        if (this.currentTab === 'view') {
            this.renderCanvas();
        } else {
            this.renderDataTab();
        }

        this.mainElement.appendChild(this.canvasElement || this.dataTabElement!);
        this.wrapperElement.appendChild(this.mainElement);
        this.container.appendChild(this.wrapperElement);

        this.updateContextMenu();
        this.setupEventListeners();
    }

    private renderHeader(): void {
        this.headerElement = document.createElement('header');
        this.headerElement.className = 'xwui-workflow-header';

        const title = document.createElement('strong');
        title.className = 'xwui-workflow-title';
        title.textContent = 'Workflow Viewer';
        this.headerElement.appendChild(title);

        if (this.config.showTabs) {
            const tabContainer = document.createElement('div');
            tabContainer.className = 'xwui-workflow-tabs';

            const viewTab = document.createElement('button');
            viewTab.className = `xwui-workflow-tab ${this.currentTab === 'view' ? 'active' : ''}`;
            viewTab.textContent = 'View';
            viewTab.addEventListener('click', () => this.setTab('view'));
            tabContainer.appendChild(viewTab);

            const dataTab = document.createElement('button');
            dataTab.className = `xwui-workflow-tab ${this.currentTab === 'data' ? 'active' : ''}`;
            dataTab.textContent = 'Data';
            dataTab.addEventListener('click', () => this.setTab('data'));
            tabContainer.appendChild(dataTab);

            this.headerElement.appendChild(tabContainer);
        }

        this.wrapperElement!.appendChild(this.headerElement);
    }

    private setTab(tab: 'view' | 'data'): void {
        this.currentTab = tab;
        this.render();
    }

    private renderCanvas(): void {
        this.canvasElement = document.createElement('div');
        this.canvasElement.className = 'xwui-workflow-canvas';
        
        const grid = this.createGrid();
        this.canvasElement.appendChild(grid);

        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgElement.setAttribute('class', 'xwui-workflow-svg');
        this.svgElement.setAttribute('width', '2000');
        this.svgElement.setAttribute('height', '1200');
        this.createSvgDefs();
        this.canvasElement.appendChild(this.svgElement);

        this.resolveNodes();
        this.renderEdges();
        this.renderNodes();

        this.canvasElement.addEventListener('contextmenu', (e) => this.handleCanvasContextMenu(e));
    }

    private createGrid(): HTMLElement {
        const gridSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        gridSvg.setAttribute('width', '100%');
        gridSvg.setAttribute('height', '100%');
        gridSvg.setAttribute('class', 'xwui-workflow-grid');

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
        pattern.setAttribute('id', 'smallGrid');
        pattern.setAttribute('width', '16');
        pattern.setAttribute('height', '16');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '1');
        circle.setAttribute('cy', '1');
        circle.setAttribute('r', '1');
        circle.setAttribute('fill', '#404040');

        pattern.appendChild(circle);
        defs.appendChild(pattern);
        gridSvg.appendChild(defs);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', 'url(#smallGrid)');

        gridSvg.appendChild(rect);
        return gridSvg;
    }

    private createSvgDefs(): void {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        // Arrow marker
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrow.setAttribute('id', 'arrow');
        arrow.setAttribute('viewBox', '0 0 10 10');
        arrow.setAttribute('refX', '8');
        arrow.setAttribute('refY', '5');
        arrow.setAttribute('markerWidth', '6');
        arrow.setAttribute('markerHeight', '6');
        arrow.setAttribute('orient', 'auto-start-reverse');
        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        arrowPath.setAttribute('fill', '#71717a');
        arrow.appendChild(arrowPath);
        defs.appendChild(arrow);

        // Selected arrow marker
        const arrowSelected = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrowSelected.setAttribute('id', 'arrow-selected');
        arrowSelected.setAttribute('viewBox', '0 0 10 10');
        arrowSelected.setAttribute('refX', '8');
        arrowSelected.setAttribute('refY', '5');
        arrowSelected.setAttribute('markerWidth', '6');
        arrowSelected.setAttribute('markerHeight', '6');
        arrowSelected.setAttribute('orient', 'auto-start-reverse');
        const arrowSelectedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowSelectedPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        arrowSelectedPath.setAttribute('fill', '#3b82f6');
        arrowSelected.appendChild(arrowSelectedPath);
        defs.appendChild(arrowSelected);

        // Arrow hitbox marker
        const arrowHitbox = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        arrowHitbox.setAttribute('id', 'arrow-hitbox');
        arrowHitbox.setAttribute('viewBox', '0 0 10 10');
        arrowHitbox.setAttribute('refX', '8');
        arrowHitbox.setAttribute('refY', '5');
        arrowHitbox.setAttribute('markerWidth', '20');
        arrowHitbox.setAttribute('markerHeight', '20');
        arrowHitbox.setAttribute('orient', 'auto-start-reverse');
        const arrowHitboxPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowHitboxPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        arrowHitboxPath.setAttribute('fill', 'transparent');
        arrowHitbox.appendChild(arrowHitboxPath);
        defs.appendChild(arrowHitbox);

        this.svgElement!.appendChild(defs);
    }

    private resolveNodes(): void {
        this.resolvedNodes = this.fullWorkflow.data.nodes
            .map(n => this.resolveNode(n))
            .filter(Boolean) as ResolvedCanvasNode[];
        this.nodeMap = new Map(this.resolvedNodes.map(n => [n.id, n]));
    }

    private resolveNode(nodeInstance: NodeInstance): ResolvedCanvasNode | null {
        const nodeType = this.fullWorkflow.schema.nodeTypes[nodeInstance.typeId];
        if (!nodeType) return null;
        return { ...nodeInstance, ...nodeType };
    }

    private getPortPosition(node: ResolvedCanvasNode, portId: string): { pos: Point, side: 'top' | 'bottom' | 'left' | 'right' } | null {
        const { position, size, ports } = node;
        const halfW = size.width / 2;
        const halfH = size.height / 2;
        const sides: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];

        for (const side of sides) {
            const portDefs = ports[side];
            const portIndex = portDefs.findIndex(p => p.id === portId);
            if (portIndex !== -1) {
                const numPorts = portDefs.length;
                const step = 1 / (numPorts + 1);

                switch (side) {
                    case 'top': {
                        const x = (position.x - halfW) + size.width * step * (portIndex + 1);
                        return { side, pos: { x, y: position.y - halfH } };
                    }
                    case 'bottom': {
                        const x = (position.x - halfW) + size.width * step * (portIndex + 1);
                        return { side, pos: { x, y: position.y + halfH } };
                    }
                    case 'left': {
                        const y = (position.y - halfH) + size.height * step * (portIndex + 1);
                        return { side, pos: { x: position.x - halfW, y } };
                    }
                    case 'right': {
                        const y = (position.y - halfH) + size.height * step * (portIndex + 1);
                        return { side, pos: { x: position.x + halfW, y } };
                    }
                }
            }
        }
        return null;
    }

    private linePath(start: { pos: Point, side: string }, end: { pos: Point, side: string }): string {
        const { pos: a, side: sideA } = start;
        const { pos: b, side: sideB } = end;
        const hOffset = Math.abs(a.x - b.x) * 0.6;
        const vOffset = Math.abs(a.y - b.y) * 0.6;
        let c1x = a.x, c1y = a.y, c2x = b.x, c2y = b.y;

        if (sideA === 'right') c1x += hOffset;
        else if (sideA === 'left') c1x -= hOffset;
        else if (sideA === 'top') c1y -= vOffset;
        else if (sideA === 'bottom') c1y += vOffset;

        if (sideB === 'right') c2x += hOffset;
        else if (sideB === 'left') c2x -= hOffset;
        else if (sideB === 'top') c2y -= vOffset;
        else if (sideB === 'bottom') c2y += vOffset;

        return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
    }

    private renderEdges(): void {
        const edges = this.fullWorkflow.data.connections.map(conn => {
            const sourceNode = this.nodeMap.get(conn.sourceNodeId);
            const targetNode = this.nodeMap.get(conn.targetNodeId);
            if (!sourceNode || !targetNode) return null;
            const start = this.getPortPosition(sourceNode, conn.sourcePortId);
            const end = this.getPortPosition(targetNode, conn.targetPortId);
            if (!start || !end) return null;
            return { id: conn.id, path: this.linePath(start, end), conn };
        }).filter(Boolean) as Array<{ id: string; path: string; conn: Connection }>;

        edges.forEach(edge => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.addEventListener('contextmenu', (e) => this.handleEdgeContextMenu(edge.id, e));

            // Hitbox path
            const hitboxPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            hitboxPath.setAttribute('d', edge.path);
            hitboxPath.setAttribute('stroke', 'transparent');
            hitboxPath.setAttribute('stroke-width', '15');
            hitboxPath.setAttribute('fill', 'none');
            hitboxPath.style.cursor = 'pointer';
            g.appendChild(hitboxPath);

            // Visible path
            const visiblePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            visiblePath.setAttribute('d', edge.path);
            visiblePath.setAttribute('stroke', '#71717a');
            visiblePath.setAttribute('stroke-width', '2');
            visiblePath.setAttribute('fill', 'none');
            visiblePath.setAttribute('marker-end', 'url(#arrow)');
            visiblePath.style.pointerEvents = 'none';
            g.appendChild(visiblePath);

            // Reroute hitbox
            const reroutePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            reroutePath.setAttribute('d', edge.path);
            reroutePath.setAttribute('stroke', 'transparent');
            reroutePath.setAttribute('stroke-width', '20');
            reroutePath.setAttribute('fill', 'none');
            reroutePath.setAttribute('marker-end', 'url(#arrow-hitbox)');
            reroutePath.style.cursor = 'move';
            reroutePath.addEventListener('mousedown', (e) => this.handleRerouteStart(edge.id, e));
            g.appendChild(reroutePath);

            this.svgElement!.appendChild(g);
            this.connectionElementMap.set(edge.id, { g, paths: [hitboxPath, visiblePath, reroutePath] });
        });

        this.updateDragConnectionPath();
    }

    private getDragConnectionPath(): string | null {
        if (!this.dragConnection) return null;
        const { startPos, startSide, endPos } = this.dragConnection;
        const endSide = startPos.x > endPos.x ? 'right' : 'left';
        return this.linePath({ pos: startPos, side: startSide }, { pos: endPos, side: endSide });
    }

    private renderNodes(): void {
        this.resolvedNodes.forEach(node => {
            const nodeElement = this.createNodeElement(node);
            this.canvasElement!.appendChild(nodeElement);
            this.nodeElementMap.set(node.id, nodeElement);
        });
    }

    private createNodeElement(node: ResolvedCanvasNode): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-workflow-node-wrapper';
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${node.position.x}px`;
        wrapper.style.top = `${node.position.y}px`;
        wrapper.style.transform = 'translate(-50%, -50%)';
        wrapper.style.cursor = 'grab';
        wrapper.style.userSelect = 'none';

        const container = document.createElement('div');
        container.className = 'xwui-workflow-node-container';

        const nodeBody = document.createElement('div');
        nodeBody.className = 'xwui-workflow-node-body';
        nodeBody.style.width = `${node.size.width}px`;
        nodeBody.style.height = `${node.size.height}px`;
        nodeBody.style.border = `${node.style.border.width}px ${node.style.border.style} ${node.style.border.color}`;
        nodeBody.style.borderRadius = `${node.style.cornerRadius.left}px ${node.style.cornerRadius.right}px ${node.style.cornerRadius.right}px ${node.style.cornerRadius.left}px`;
        nodeBody.style.backgroundColor = node.style.background.color;

        const layout = node.layout ?? 'icon_only';

        if (layout === 'icon_only') {
            const icon = document.createElement('span');
            icon.className = 'xwui-workflow-node-icon';
            icon.textContent = node.icon;
            nodeBody.appendChild(icon);
        } else {
            const content = document.createElement('div');
            content.className = 'xwui-workflow-node-content';
            const icon = document.createElement('span');
            icon.className = 'xwui-workflow-node-icon';
            icon.textContent = node.icon;
            content.appendChild(icon);
            const text = document.createElement('div');
            text.className = 'xwui-workflow-node-text';
            const title = document.createElement('div');
            title.className = 'xwui-workflow-node-title';
            title.textContent = node.title;
            const type = document.createElement('div');
            type.className = 'xwui-workflow-node-type';
            type.textContent = node.typeId;
            text.appendChild(title);
            text.appendChild(type);
            content.appendChild(text);
            nodeBody.appendChild(content);
        }

        // Render ports
        const ports = this.renderNodePorts(node);
        nodeBody.appendChild(ports);

        container.appendChild(nodeBody);

        if (layout === 'icon_only') {
            const label = document.createElement('div');
            label.className = 'xwui-workflow-node-label';
            label.style.width = `${node.size.width + 40}px`;
            const title = document.createElement('div');
            title.className = 'xwui-workflow-node-label-title';
            title.textContent = node.title;
            const type = document.createElement('div');
            type.className = 'xwui-workflow-node-label-type';
            type.textContent = node.typeId;
            label.appendChild(title);
            label.appendChild(type);
            container.appendChild(label);
        }

        wrapper.appendChild(container);

        wrapper.addEventListener('contextmenu', (e) => this.handleNodeContextMenu(node.id, e));
        this.setupNodeDrag(wrapper, node);

        return wrapper;
    }

    private renderNodePorts(node: ResolvedCanvasNode): HTMLElement {
        const portsContainer = document.createElement('div');
        portsContainer.className = 'xwui-workflow-node-ports';

        const sides: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
        sides.forEach(side => {
            node.ports[side].forEach(port => {
                const portPos = this.getPortPosition(node, port.id);
                if (!portPos) return;

                const relativePos = {
                    x: portPos.pos.x - (node.position.x - node.size.width / 2),
                    y: portPos.pos.y - (node.position.y - node.size.height / 2)
                };

                const portElement = document.createElement('div');
                portElement.className = 'xwui-workflow-port';
                portElement.style.left = `${relativePos.x}px`;
                portElement.style.top = `${relativePos.y}px`;
                portElement.style.backgroundColor = port.color;
                portElement.title = `${port.label} (${port.direction})`;
                portElement.dataset.nodeId = node.id;
                portElement.dataset.portId = port.id;
                portElement.dataset.direction = port.direction;

                portElement.addEventListener('mousedown', (e) => this.handlePortMouseDown(node.id, port.id, port, e));
                portElement.addEventListener('mouseup', (e) => this.handlePortMouseUp(node.id, port.id, port, e));

                portsContainer.appendChild(portElement);
            });
        });

        return portsContainer;
    }

    private setupNodeDrag(wrapper: HTMLElement, node: ResolvedCanvasNode): void {
        wrapper.addEventListener('mousedown', (e) => {
            if ((e.target as HTMLElement).closest('.xwui-workflow-port') || e.button === 2) return;
            const canvasRect = this.canvasElement!.getBoundingClientRect();
            this.draggingNodeId = node.id;
            // Calculate offset: difference between mouse position and node position
            this.dragOffset = {
                x: (e.clientX - canvasRect.left + this.canvasElement!.scrollLeft) - node.position.x,
                y: (e.clientY - canvasRect.top + this.canvasElement!.scrollTop) - node.position.y
            };
            wrapper.style.cursor = 'grabbing';
            e.preventDefault();
        });
    }

    private handlePortMouseDown(nodeId: string, portId: string, port: Port, e: MouseEvent): void {
        e.stopPropagation();
        if (port.direction === 'out') {
            const node = this.nodeMap.get(nodeId);
            if (node) {
                const portPos = this.getPortPosition(node, portId);
                if (portPos) {
                    // Get canvas position relative to viewport
                    const canvasRect = this.canvasElement!.getBoundingClientRect();
                    this.dragConnection = {
                        sourceNodeId: nodeId,
                        sourcePortId: portId,
                        startPos: portPos.pos,
                        startSide: portPos.side,
                        endPos: { x: e.clientX - canvasRect.left + this.canvasElement!.scrollLeft, y: e.clientY - canvasRect.top + this.canvasElement!.scrollTop }
                    };
                    this.updateDragConnectionPath();
                }
            }
        }
    }

    private handlePortMouseUp(nodeId: string, portId: string, port: Port): void {
        if (this.dragConnection && port.direction === 'in' && this.dragConnection.sourceNodeId !== nodeId) {
            const newConn: Connection = {
                id: `conn_${Date.now()}`,
                sourceNodeId: this.dragConnection.sourceNodeId,
                sourcePortId: this.dragConnection.sourcePortId,
                targetNodeId: nodeId,
                targetPortId: portId
            };
            this.fullWorkflow.data.connections.push(newConn);
            this.dragConnection = null;
            this.render();
        }
    }

    private handleRerouteStart(connectionId: string, e: MouseEvent): void {
        e.stopPropagation();
        const conn = this.fullWorkflow.data.connections.find(c => c.id === connectionId);
        if (!conn) return;

        const sourceNodeInstance = this.fullWorkflow.data.nodes.find(n => n.id === conn.sourceNodeId);
        if (!sourceNodeInstance) return;

        const sourceNode = this.resolveNode(sourceNodeInstance);
        if (!sourceNode) return;

        const portPos = this.getPortPosition(sourceNode, conn.sourcePortId);
        if (portPos) {
            const canvasRect = this.canvasElement!.getBoundingClientRect();
            this.dragConnection = {
                originalConnection: conn,
                sourceNodeId: conn.sourceNodeId,
                sourcePortId: conn.sourcePortId,
                startPos: portPos.pos,
                startSide: portPos.side,
                endPos: {
                    x: e.clientX - canvasRect.left + this.canvasElement!.scrollLeft,
                    y: e.clientY - canvasRect.top + this.canvasElement!.scrollTop
                }
            };
            
            // Remove connection from data
            this.fullWorkflow.data.connections = this.fullWorkflow.data.connections.filter(c => c.id !== connectionId);
            
            // Remove connection element from DOM
            const edgeElements = this.connectionElementMap.get(connectionId);
            if (edgeElements) {
                edgeElements.g.remove();
                this.connectionElementMap.delete(connectionId);
            }
            
            this.updateDragConnectionPath();
        }
    }

    private handleEdgeContextMenu(connectionId: string, e: MouseEvent): void {
        e.preventDefault();
        this.contextMenu = {
            x: e.clientX,
            y: e.clientY,
            items: [{
                label: 'Delete Connection',
                action: () => {
                    this.fullWorkflow.data.connections = this.fullWorkflow.data.connections.filter(c => c.id !== connectionId);
                    this.render();
                }
            }]
        };
        this.updateContextMenu();
    }

    private handleNodeContextMenu(nodeId: string, e: MouseEvent): void {
        e.preventDefault();
        this.contextMenu = {
            x: e.clientX,
            y: e.clientY,
            items: [{
                label: 'Delete Node',
                action: () => {
                    this.fullWorkflow.data.nodes = this.fullWorkflow.data.nodes.filter(n => n.id !== nodeId);
                    this.fullWorkflow.data.connections = this.fullWorkflow.data.connections.filter(c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId);
                    this.render();
                }
            }]
        };
        this.updateContextMenu();
    }

    private handleCanvasContextMenu(e: MouseEvent): void {
        e.preventDefault();
        this.contextMenu = null;
        this.updateContextMenu();
    }

    private updateContextMenu(): void {
        if (this.contextMenuElement) {
            this.contextMenuElement.remove();
            this.contextMenuElement = null;
        }

        if (this.contextMenu && this.contextMenu.items.length > 0) {
            this.contextMenuElement = document.createElement('div');
            this.contextMenuElement.className = 'xwui-workflow-context-menu';
            this.contextMenuElement.style.position = 'fixed';
            this.contextMenuElement.style.top = `${this.contextMenu.y}px`;
            this.contextMenuElement.style.left = `${this.contextMenu.x}px`;
            this.contextMenuElement.style.zIndex = '50';

            this.contextMenu.items.forEach(item => {
                const button = document.createElement('button');
                button.className = 'xwui-workflow-context-menu-item';
                button.textContent = item.label;
                button.addEventListener('click', () => {
                    item.action();
                    this.contextMenu = null;
                    this.updateContextMenu();
                });
                this.contextMenuElement!.appendChild(button);
            });

            document.body.appendChild(this.contextMenuElement);
        }
    }

    private setupEventListeners(): void {
        this.boundHandleMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
        this.boundHandleMouseUp = (e: MouseEvent) => this.handleMouseUp(e);
        this.boundHandleClick = () => this.handleClick();
        
        window.addEventListener('mousemove', this.boundHandleMouseMove);
        window.addEventListener('mouseup', this.boundHandleMouseUp);
        window.addEventListener('click', this.boundHandleClick);
    }

    private handleMouseMove(e: MouseEvent): void {
        if (this.dragConnection) {
            // Convert viewport coordinates to canvas coordinates
            const canvasRect = this.canvasElement!.getBoundingClientRect();
            this.dragConnection.endPos = {
                x: e.clientX - canvasRect.left + this.canvasElement!.scrollLeft,
                y: e.clientY - canvasRect.top + this.canvasElement!.scrollTop
            };
            this.scheduleUpdate();
        }

        if (this.draggingNodeId) {
            const node = this.fullWorkflow.data.nodes.find(n => n.id === this.draggingNodeId);
            if (node) {
                const canvasRect = this.canvasElement!.getBoundingClientRect();
                const mouseCanvasX = e.clientX - canvasRect.left + this.canvasElement!.scrollLeft;
                const mouseCanvasY = e.clientY - canvasRect.top + this.canvasElement!.scrollTop;
                
                const newPos = {
                    x: mouseCanvasX - this.dragOffset.x,
                    y: mouseCanvasY - this.dragOffset.y
                };
                node.position = newPos;
                
                // Update resolved node position in map
                const resolvedNode = this.nodeMap.get(this.draggingNodeId);
                if (resolvedNode) {
                    resolvedNode.position = newPos;
                }
                
                this.updateNodePosition(this.draggingNodeId, newPos);
                this.scheduleEdgeUpdate();
            }
        }
    }

    private scheduleUpdate(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.animationFrameId = requestAnimationFrame(() => {
            this.animationFrameId = null;
            this.updateDragConnectionPath();
        });
    }

    private scheduleEdgeUpdate(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        this.animationFrameId = requestAnimationFrame(() => {
            this.animationFrameId = null;
            this.updateAllEdges();
        });
    }

    private updateNodePosition(nodeId: string, position: Point): void {
        const nodeElement = this.nodeElementMap.get(nodeId);
        if (nodeElement) {
            nodeElement.style.left = `${position.x}px`;
            nodeElement.style.top = `${position.y}px`;
            
            // Update port positions if needed - they're relative to node body
            // Ports should update automatically since they're positioned relative
        }
    }

    private updateDragConnectionPath(): void {
        if (this.dragConnection) {
            const dragPath = this.getDragConnectionPath();
            if (dragPath) {
                if (!this.dragConnectionPathElement) {
                    this.dragConnectionPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    this.dragConnectionPathElement.setAttribute('stroke', '#3b82f6');
                    this.dragConnectionPathElement.setAttribute('stroke-width', '2');
                    this.dragConnectionPathElement.setAttribute('stroke-dasharray', '5,5');
                    this.dragConnectionPathElement.setAttribute('fill', 'none');
                    this.dragConnectionPathElement.setAttribute('marker-end', 'url(#arrow-selected)');
                    this.svgElement!.appendChild(this.dragConnectionPathElement);
                }
                this.dragConnectionPathElement.setAttribute('d', dragPath);
            }
        } else {
            if (this.dragConnectionPathElement) {
                this.dragConnectionPathElement.remove();
                this.dragConnectionPathElement = null;
            }
        }
    }

    private updateAllEdges(): void {
        if (!this.draggingNodeId) return;
        
        const connectedEdges = this.fullWorkflow.data.connections.filter(
            conn => conn.sourceNodeId === this.draggingNodeId || conn.targetNodeId === this.draggingNodeId
        );

        connectedEdges.forEach(conn => {
            this.updateEdgePath(conn.id);
        });
    }

    private updateEdgePath(connectionId: string): void {
        const conn = this.fullWorkflow.data.connections.find(c => c.id === connectionId);
        if (!conn) return;

        const sourceNode = this.nodeMap.get(conn.sourceNodeId);
        const targetNode = this.nodeMap.get(conn.targetNodeId);
        if (!sourceNode || !targetNode) return;

        const start = this.getPortPosition(sourceNode, conn.sourcePortId);
        const end = this.getPortPosition(targetNode, conn.targetPortId);
        if (!start || !end) return;

        const path = this.linePath(start, end);
        const edgeElements = this.connectionElementMap.get(connectionId);
        
        if (edgeElements) {
            edgeElements.paths.forEach(pathElement => {
                pathElement.setAttribute('d', path);
            });
        }
    }

    private handleMouseUp(e: MouseEvent): void {
        if (this.dragConnection) {
            const hadOriginalConnection = !!this.dragConnection.originalConnection;
            const nodeCountBefore = this.fullWorkflow.data.nodes.length;
            
            if (!(e.target as HTMLElement).closest('.xwui-workflow-port')) {
                if (!this.dragConnection.originalConnection) {
                    const newNodeId = `node_${Date.now()}`;
                    const newPortId = `in_placeholder`;
                    const newNode: NodeInstance = {
                        id: newNodeId,
                        typeId: 'placeholder',
                        title: 'New Node',
                        position: { x: this.dragConnection.endPos.x, y: this.dragConnection.endPos.y }
                    };
                    const newConn: Connection = {
                        id: `conn_${Date.now()}`,
                        sourceNodeId: this.dragConnection.sourceNodeId,
                        sourcePortId: this.dragConnection.sourcePortId,
                        targetNodeId: newNodeId,
                        targetPortId: newPortId
                    };
                    this.fullWorkflow.data.nodes.push(newNode);
                    this.fullWorkflow.data.connections.push(newConn);
                } else {
                    this.fullWorkflow.data.connections.push(this.dragConnection.originalConnection);
                }
            }
            
            this.dragConnection = null;
            this.updateDragConnectionPath();
            
            // Only do full render if we added a new node, otherwise just update edges
            if (!hadOriginalConnection && this.fullWorkflow.data.nodes.length > nodeCountBefore) {
                this.render();
            } else {
                this.renderEdges();
            }
        }

        if (this.draggingNodeId) {
            // Reset cursor
            const nodeElement = this.nodeElementMap.get(this.draggingNodeId);
            if (nodeElement) {
                nodeElement.style.cursor = 'grab';
            }
            
            // Update all edges after drag completes
            this.updateAllEdgesForNode(this.draggingNodeId);
            this.draggingNodeId = null;
            this.dragOffset = { x: 0, y: 0 };
        }
    }

    private updateAllEdgesForNode(nodeId: string): void {
        const connectedEdges = this.fullWorkflow.data.connections.filter(
            conn => conn.sourceNodeId === nodeId || conn.targetNodeId === nodeId
        );

        connectedEdges.forEach(conn => {
            this.updateEdgePath(conn.id);
        });
    }

    private handleClick(): void {
        this.contextMenu = null;
        this.updateContextMenu();
    }

    private renderDataTab(): void {
        this.dataTabElement = document.createElement('div');
        this.dataTabElement.className = 'xwui-workflow-data-tab';

        this.textareaElement = document.createElement('textarea');
        this.textareaElement.className = 'xwui-workflow-textarea';
        this.textareaElement.value = JSON.stringify(this.fullWorkflow, null, 2);
        this.textareaElement.addEventListener('input', () => {
            try {
                const obj = JSON.parse(this.textareaElement!.value);
                if (!obj.schema || !obj.data || !obj.data.nodes || !obj.data.connections) {
                    throw new Error('Invalid workflow structure');
                }
                this.fullWorkflow = obj;
                this.data.workflow = obj;
                this.render();
            } catch (e: any) {
                // Error handling - could show error message
                console.error('Invalid JSON:', e.message);
            }
        });

        this.dataTabElement.appendChild(this.textareaElement);
    }

    public getWorkflow(): FullWorkflow {
        return this.fullWorkflow;
    }

    public setWorkflow(workflow: FullWorkflow): void {
        this.fullWorkflow = workflow;
        this.data.workflow = workflow;
        this.render();
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.contextMenuElement) {
            this.contextMenuElement.remove();
            this.contextMenuElement = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        if (this.boundHandleMouseMove) {
            window.removeEventListener('mousemove', this.boundHandleMouseMove);
            this.boundHandleMouseMove = null;
        }
        if (this.boundHandleMouseUp) {
            window.removeEventListener('mouseup', this.boundHandleMouseUp);
            this.boundHandleMouseUp = null;
        }
        if (this.boundHandleClick) {
            window.removeEventListener('click', this.boundHandleClick);
            this.boundHandleClick = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIWorkflow as any).componentName = 'XWUIWorkflow';


