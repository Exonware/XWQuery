/**
 * XWUIDiagram Component
 * Diagram/flowchart builder with nodes and connections
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export interface DiagramNode {
    id: string;
    type: 'rectangle' | 'circle' | 'diamond' | 'ellipse';
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    style?: {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    };
}

export interface DiagramConnection {
    id: string;
    from: string; // Node ID
    to: string; // Node ID
    label?: string;
    style?: {
        stroke?: string;
        strokeWidth?: number;
    };
}

// Component-level configuration
export interface XWUIDiagramConfig {
    showToolbar?: boolean;
    showGrid?: boolean;
    snapToGrid?: boolean;
    gridSize?: number;
    className?: string;
}

// Data type
export interface XWUIDiagramData {
    nodes?: DiagramNode[];
    connections?: DiagramConnection[];
    zoom?: number;
    panX?: number;
    panY?: number;
}

export class XWUIDiagram extends XWUIComponent<XWUIDiagramData, XWUIDiagramConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private canvasElement: HTMLElement | null = null;
    private svgElement: SVGElement | null = null;
    private nodesMap: Map<string, DiagramNode> = new Map();
    private connectionsMap: Map<string, DiagramConnection> = new Map();
    private selectedNode: string | null = null;
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private zoom: number = 1;
    private panX: number = 0;
    private panY: number = 0;
    private changeHandlers: Array<() => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIDiagramData = {},
        conf_comp: XWUIDiagramConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeData();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDiagramConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDiagramConfig {
        return {
            showToolbar: conf_comp?.showToolbar ?? true,
            showGrid: conf_comp?.showGrid ?? true,
            snapToGrid: conf_comp?.snapToGrid ?? false,
            gridSize: conf_comp?.gridSize ?? 20,
            className: conf_comp?.className
        };
    }

    private initializeData(): void {
        this.zoom = this.data.zoom ?? 1;
        this.panX = this.data.panX ?? 0;
        this.panY = this.data.panY ?? 0;

        if (this.data.nodes) {
            this.data.nodes.forEach(node => {
                this.nodesMap.set(node.id, node);
            });
        }

        if (this.data.connections) {
            this.data.connections.forEach(conn => {
                this.connectionsMap.set(conn.id, conn);
            });
        }
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-diagram-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-diagram';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Toolbar
        if (this.config.showToolbar) {
            this.toolbarElement = this.createToolbar();
            this.wrapperElement.appendChild(this.toolbarElement);
        }

        // Canvas
        this.canvasElement = document.createElement('div');
        this.canvasElement.className = 'xwui-diagram-canvas';
        this.createCanvas();
        this.wrapperElement.appendChild(this.canvasElement);

        this.container.appendChild(this.wrapperElement);
    }

    private createToolbar(): HTMLElement {
        const toolbar = document.createElement('div');
        toolbar.className = 'xwui-diagram-toolbar';

        // Add node buttons
        const shapes = [
            { type: 'rectangle', label: 'Rectangle' },
            { type: 'circle', label: 'Circle' },
            { type: 'diamond', label: 'Diamond' },
            { type: 'ellipse', label: 'Ellipse' }
        ];

        shapes.forEach(shape => {
            const btn = document.createElement('button');
            btn.className = 'xwui-diagram-toolbar-btn';
            btn.textContent = shape.label;
            btn.onclick = () => this.addNode(shape.type);
            toolbar.appendChild(btn);
        });

        toolbar.appendChild(document.createTextNode(' | '));

        // Zoom controls
        const zoomOut = document.createElement('button');
        zoomOut.className = 'xwui-diagram-toolbar-btn';
        zoomOut.textContent = '−';
        zoomOut.onclick = () => this.setZoom(this.zoom * 0.9);
        toolbar.appendChild(zoomOut);

        const zoomLabel = document.createElement('span');
        zoomLabel.className = 'xwui-diagram-zoom-label';
        zoomLabel.textContent = `${Math.round(this.zoom * 100)}%`;
        toolbar.appendChild(zoomLabel);

        const zoomIn = document.createElement('button');
        zoomIn.className = 'xwui-diagram-toolbar-btn';
        zoomIn.textContent = '+';
        zoomIn.onclick = () => this.setZoom(this.zoom * 1.1);
        toolbar.appendChild(zoomIn);

        return toolbar;
    }

    private createCanvas(): void {
        if (!this.canvasElement) return;

        this.canvasElement.innerHTML = '';

        // SVG
        this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgElement.className = 'xwui-diagram-svg';
        this.svgElement.setAttribute('viewBox', '0 0 2000 2000');

        // Define arrowhead marker
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', 'arrowhead');
        marker.setAttribute('markerWidth', '10');
        marker.setAttribute('markerHeight', '10');
        marker.setAttribute('refX', '9');
        marker.setAttribute('refY', '3');
        marker.setAttribute('orient', 'auto');
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '0 0, 10 3, 0 6');
        polygon.setAttribute('fill', 'var(--text-primary, #212529)');
        marker.appendChild(polygon);
        defs.appendChild(marker);
        this.svgElement.appendChild(defs);

        // Grid
        if (this.config.showGrid) {
            const grid = this.createGrid();
            this.svgElement.appendChild(grid);
        }

        // Connections
        const connectionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        connectionsGroup.setAttribute('class', 'xwui-diagram-connections');
        this.connectionsMap.forEach(conn => {
            const line = this.createConnection(conn);
            connectionsGroup.appendChild(line);
        });
        this.svgElement.appendChild(connectionsGroup);

        // Nodes
        const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodesGroup.setAttribute('class', 'xwui-diagram-nodes');
        this.nodesMap.forEach(node => {
            const nodeEl = this.createNodeElement(node);
            nodesGroup.appendChild(nodeEl);
        });
        this.svgElement.appendChild(nodesGroup);

        this.canvasElement.appendChild(this.svgElement);

        // Event handlers
        this.setupCanvasEvents();
    }

    private createGrid(): SVGElement {
        const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        grid.setAttribute('class', 'xwui-diagram-grid');
        const size = this.config.gridSize || 20;

        for (let x = 0; x < 2000; x += size) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x.toString());
            line.setAttribute('y1', '0');
            line.setAttribute('x2', x.toString());
            line.setAttribute('y2', '2000');
            line.setAttribute('stroke', 'var(--border-color, #e0e0e0)');
            line.setAttribute('stroke-width', '1');
            grid.appendChild(line);
        }

        for (let y = 0; y < 2000; y += size) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', y.toString());
            line.setAttribute('x2', '2000');
            line.setAttribute('y2', y.toString());
            line.setAttribute('stroke', 'var(--border-color, #e0e0e0)');
            line.setAttribute('stroke-width', '1');
            grid.appendChild(line);
        }

        return grid;
    }

    private createNodeElement(node: DiagramNode): SVGElement {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'xwui-diagram-node');
        group.setAttribute('data-node-id', node.id);
        if (this.selectedNode === node.id) {
            group.classList.add('selected');
        }

        let shape: SVGElement;
        if (node.type === 'rectangle') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', node.x.toString());
            shape.setAttribute('y', node.y.toString());
            shape.setAttribute('width', node.width.toString());
            shape.setAttribute('height', node.height.toString());
        } else if (node.type === 'circle') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', (node.x + node.width / 2).toString());
            shape.setAttribute('cy', (node.y + node.height / 2).toString());
            shape.setAttribute('r', (Math.min(node.width, node.height) / 2).toString());
        } else if (node.type === 'diamond') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            const cx = node.x + node.width / 2;
            const cy = node.y + node.height / 2;
            const points = [
                `${cx},${node.y}`,
                `${node.x + node.width},${cy}`,
                `${cx},${node.y + node.height}`,
                `${node.x},${cy}`
            ].join(' ');
            shape.setAttribute('points', points);
        } else {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            shape.setAttribute('cx', (node.x + node.width / 2).toString());
            shape.setAttribute('cy', (node.y + node.height / 2).toString());
            shape.setAttribute('rx', (node.width / 2).toString());
            shape.setAttribute('ry', (node.height / 2).toString());
        }

        shape.setAttribute('fill', node.style?.fill || 'var(--bg-primary, #ffffff)');
        shape.setAttribute('stroke', node.style?.stroke || 'var(--border-color, #333)');
        shape.setAttribute('stroke-width', (node.style?.strokeWidth || 2).toString());
        shape.setAttribute('cursor', 'move');

        // Text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (node.x + node.width / 2).toString());
        text.setAttribute('y', (node.y + node.height / 2).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'var(--text-primary, #212529)');
        text.setAttribute('font-size', '14');
        text.textContent = node.label;

        group.appendChild(shape);
        group.appendChild(text);

        // Event handlers
        group.addEventListener('mousedown', (e) => {
            this.startDrag(node.id, e.clientX, e.clientY);
        });

        group.addEventListener('dblclick', () => {
            const newLabel = prompt('Enter new label:', node.label);
            if (newLabel !== null) {
                node.label = newLabel;
                this.updateNode(node);
            }
        });

        return group;
    }

    private createConnection(conn: DiagramConnection): SVGElement {
        const fromNode = this.nodesMap.get(conn.from);
        const toNode = this.nodesMap.get(conn.to);
        if (!fromNode || !toNode) {
            return document.createElementNS('http://www.w3.org/2000/svg', 'g');
        }

        const fromX = fromNode.x + fromNode.width / 2;
        const fromY = fromNode.y + fromNode.height / 2;
        const toX = toNode.x + toNode.width / 2;
        const toY = toNode.y + toNode.height / 2;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromX.toString());
        line.setAttribute('y1', fromY.toString());
        line.setAttribute('x2', toX.toString());
        line.setAttribute('y2', toY.toString());
        line.setAttribute('stroke', conn.style?.stroke || 'var(--text-primary, #212529)');
        line.setAttribute('stroke-width', (conn.style?.strokeWidth || 2).toString());
        line.setAttribute('marker-end', 'url(#arrowhead)');

        return line;
    }

    private setupCanvasEvents(): void {
        if (!this.canvasElement) return;

        this.canvasElement.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.selectedNode) {
                const node = this.nodesMap.get(this.selectedNode);
                if (node) {
                    const rect = this.canvasElement!.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / this.zoom - this.panX;
                    const y = (e.clientY - rect.top) / this.zoom - this.panY;
                    
                    if (this.config.snapToGrid) {
                        const gridSize = this.config.gridSize || 20;
                        node.x = Math.round(x / gridSize) * gridSize;
                        node.y = Math.round(y / gridSize) * gridSize;
                    } else {
                        node.x = x - node.width / 2;
                        node.y = y - node.height / 2;
                    }
                    this.updateNode(node);
                }
            }
        });

        this.canvasElement.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        this.canvasElement.addEventListener('click', (e) => {
            if (e.target === this.canvasElement || (e.target as Element).tagName === 'svg') {
                this.selectedNode = null;
                this.updateSelection();
            }
        });
    }

    private startDrag(nodeId: string, clientX: number, clientY: number): void {
        this.selectedNode = nodeId;
        this.isDragging = true;
        this.dragStartX = clientX;
        this.dragStartY = clientY;
        this.updateSelection();
    }

    private updateSelection(): void {
        if (!this.svgElement) return;
        const nodes = this.svgElement.querySelectorAll('.xwui-diagram-node');
        nodes.forEach(node => {
            node.classList.remove('selected');
            if (node.getAttribute('data-node-id') === this.selectedNode) {
                node.classList.add('selected');
            }
        });
    }

    private addNode(type: 'rectangle' | 'circle' | 'diamond' | 'ellipse'): void {
        const id = `node-${Date.now()}`;
        const node: DiagramNode = {
            id,
            type,
            x: 100,
            y: 100,
            width: type === 'circle' || type === 'ellipse' ? 100 : 120,
            height: type === 'circle' || type === 'ellipse' ? 100 : 80,
            label: 'New Node'
        };
        this.nodesMap.set(id, node);
        this.createCanvas();
        this.triggerChange();
    }

    private updateNode(node: DiagramNode): void {
        this.nodesMap.set(node.id, node);
        this.createCanvas();
        this.triggerChange();
    }

    private setZoom(newZoom: number): void {
        this.zoom = Math.max(0.1, Math.min(3, newZoom));
        if (this.canvasElement && this.svgElement) {
            this.svgElement.style.transform = `scale(${this.zoom}) translate(${this.panX}px, ${this.panY}px)`;
        }
        const zoomLabel = this.toolbarElement?.querySelector('.xwui-diagram-zoom-label');
        if (zoomLabel) {
            zoomLabel.textContent = `${Math.round(this.zoom * 100)}%`;
        }
        this.data.zoom = this.zoom;
    }

    private triggerChange(): void {
        this.changeHandlers.forEach(handler => handler());
    }

    public onChange(handler: () => void): void {
        this.changeHandlers.push(handler);
    }

    public getNodes(): DiagramNode[] {
        return Array.from(this.nodesMap.values());
    }

    public getConnections(): DiagramConnection[] {
        return Array.from(this.connectionsMap.values());
    }

    public addConnection(from: string, to: string): void {
        const id = `conn-${Date.now()}`;
        const conn: DiagramConnection = {
            id,
            from,
            to
        };
        this.connectionsMap.set(id, conn);
        this.createCanvas();
        this.triggerChange();
    }

    public exportSVG(): string {
        if (!this.svgElement) return '';
        return new XMLSerializer().serializeToString(this.svgElement);
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDiagram as any).componentName = 'XWUIDiagram';


