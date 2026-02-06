/**
 * XWUIPivotTable Component
 * Pivot table with drag-and-drop field configuration
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIDataGrid } from '../XWUIDataGrid/XWUIDataGrid';

export interface PivotField {
    id: string;
    label: string;
    type: 'string' | 'number' | 'date';
    dataIndex: string;
}

export interface PivotConfig {
    rows: string[]; // Field IDs
    columns: string[]; // Field IDs
    values: Array<{ fieldId: string; aggregation: 'sum' | 'count' | 'average' | 'max' | 'min' }>;
    filters: string[]; // Field IDs
}

// Component-level configuration
export interface XWUIPivotTableConfig {
    showFieldPanel?: boolean;
    className?: string;
}

// Data type
export interface XWUIPivotTableData {
    fields: PivotField[];
    data: any[];
    config?: PivotConfig;
}

export class XWUIPivotTable extends XWUIComponent<XWUIPivotTableData, XWUIPivotTableConfig> {
    private wrapperElement: HTMLElement | null = null;
    private fieldPanelElement: HTMLElement | null = null;
    private gridElement: HTMLElement | null = null;
    private dataGrid: XWUIDataGrid | null = null;
    private pivotConfig: PivotConfig = {
        rows: [],
        columns: [],
        values: [],
        filters: []
    };

    constructor(
        container: HTMLElement,
        data: XWUIPivotTableData,
        conf_comp: XWUIPivotTableConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        if (this.data.config) {
            this.pivotConfig = this.data.config;
        }
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIPivotTableConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPivotTableConfig {
        return {
            showFieldPanel: conf_comp?.showFieldPanel ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-pivot-table-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-pivot-table';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Field Panel
        if (this.config.showFieldPanel) {
            this.fieldPanelElement = this.createFieldPanel();
            this.wrapperElement.appendChild(this.fieldPanelElement);
        }

        // Grid
        this.gridElement = document.createElement('div');
        this.gridElement.className = 'xwui-pivot-table-grid';
        this.wrapperElement.appendChild(this.gridElement);

        this.container.appendChild(this.wrapperElement);

        // Render pivot table
        this.renderPivotTable();
    }

    private createFieldPanel(): HTMLElement {
        const panel = document.createElement('div');
        panel.className = 'xwui-pivot-table-field-panel';

        // Fields list
        const fieldsList = document.createElement('div');
        fieldsList.className = 'xwui-pivot-table-fields';
        fieldsList.innerHTML = '<h4>Fields</h4>';

        this.data.fields.forEach(field => {
            const fieldItem = document.createElement('div');
            fieldItem.className = 'xwui-pivot-table-field-item';
            fieldItem.draggable = true;
            fieldItem.textContent = field.label;
            fieldItem.setAttribute('data-field-id', field.id);
            fieldItem.addEventListener('dragstart', (e) => {
                e.dataTransfer?.setData('text/plain', field.id);
            });
            fieldsList.appendChild(fieldItem);
        });

        panel.appendChild(fieldsList);

        // Drop zones
        const dropZones = document.createElement('div');
        dropZones.className = 'xwui-pivot-table-drop-zones';

        // Rows
        const rowsZone = this.createDropZone('Rows', 'rows');
        dropZones.appendChild(rowsZone);

        // Columns
        const columnsZone = this.createDropZone('Columns', 'columns');
        dropZones.appendChild(columnsZone);

        // Values
        const valuesZone = this.createDropZone('Values', 'values');
        dropZones.appendChild(valuesZone);

        // Filters
        const filtersZone = this.createDropZone('Filters', 'filters');
        dropZones.appendChild(filtersZone);

        panel.appendChild(dropZones);

        return panel;
    }

    private createDropZone(label: string, zoneType: 'rows' | 'columns' | 'values' | 'filters'): HTMLElement {
        const zone = document.createElement('div');
        zone.className = 'xwui-pivot-table-drop-zone';
        zone.setAttribute('data-zone', zoneType);

        const labelEl = document.createElement('div');
        labelEl.className = 'xwui-pivot-table-zone-label';
        labelEl.textContent = label;
        zone.appendChild(labelEl);

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'xwui-pivot-table-zone-items';
        zone.appendChild(itemsContainer);

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('xwui-pivot-table-drop-zone-drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('xwui-pivot-table-drop-zone-drag-over');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('xwui-pivot-table-drop-zone-drag-over');
            const fieldId = e.dataTransfer?.getData('text/plain');
            if (fieldId) {
                this.addFieldToZone(fieldId, zoneType);
            }
        });

        this.updateDropZone(zone, zoneType);

        return zone;
    }

    private addFieldToZone(fieldId: string, zoneType: 'rows' | 'columns' | 'values' | 'filters'): void {
        if (zoneType === 'rows' && !this.pivotConfig.rows.includes(fieldId)) {
            this.pivotConfig.rows.push(fieldId);
        } else if (zoneType === 'columns' && !this.pivotConfig.columns.includes(fieldId)) {
            this.pivotConfig.columns.push(fieldId);
        } else if (zoneType === 'values' && !this.pivotConfig.values.some(v => v.fieldId === fieldId)) {
            this.pivotConfig.values.push({ fieldId, aggregation: 'sum' });
        } else if (zoneType === 'filters' && !this.pivotConfig.filters.includes(fieldId)) {
            this.pivotConfig.filters.push(fieldId);
        }

        this.updateAllDropZones();
        this.renderPivotTable();
    }

    private updateDropZone(zone: HTMLElement, zoneType: 'rows' | 'columns' | 'values' | 'filters'): void {
        const itemsContainer = zone.querySelector('.xwui-pivot-table-zone-items');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';

        let fieldIds: string[] = [];
        if (zoneType === 'rows') fieldIds = this.pivotConfig.rows;
        else if (zoneType === 'columns') fieldIds = this.pivotConfig.columns;
        else if (zoneType === 'values') {
            this.pivotConfig.values.forEach(v => {
                const field = this.data.fields.find(f => f.id === v.fieldId);
                if (field) {
                    const item = document.createElement('div');
                    item.className = 'xwui-pivot-table-zone-item';
                    item.textContent = `${field.label} (${v.aggregation})`;
                    item.setAttribute('data-field-id', v.fieldId);
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = '×';
                    removeBtn.className = 'xwui-pivot-table-remove-field';
                    removeBtn.onclick = () => {
                        this.pivotConfig.values = this.pivotConfig.values.filter(v => v.fieldId !== field.id);
                        this.updateAllDropZones();
                        this.renderPivotTable();
                    };
                    item.appendChild(removeBtn);
                    itemsContainer.appendChild(item);
                }
            });
            return;
        } else if (zoneType === 'filters') fieldIds = this.pivotConfig.filters;

        fieldIds.forEach(fieldId => {
            const field = this.data.fields.find(f => f.id === fieldId);
            if (field) {
                const item = document.createElement('div');
                item.className = 'xwui-pivot-table-zone-item';
                item.textContent = field.label;
                item.setAttribute('data-field-id', fieldId);
                
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '×';
                removeBtn.className = 'xwui-pivot-table-remove-field';
                removeBtn.onclick = () => {
                    if (zoneType === 'rows') {
                        this.pivotConfig.rows = this.pivotConfig.rows.filter(id => id !== fieldId);
                    } else if (zoneType === 'columns') {
                        this.pivotConfig.columns = this.pivotConfig.columns.filter(id => id !== fieldId);
                    } else if (zoneType === 'filters') {
                        this.pivotConfig.filters = this.pivotConfig.filters.filter(id => id !== fieldId);
                    }
                    this.updateAllDropZones();
                    this.renderPivotTable();
                };
                item.appendChild(removeBtn);
                itemsContainer.appendChild(item);
            }
        });
    }

    private updateAllDropZones(): void {
        if (!this.fieldPanelElement) return;
        const zones = this.fieldPanelElement.querySelectorAll('.xwui-pivot-table-drop-zone');
        zones.forEach(zone => {
            const zoneType = zone.getAttribute('data-zone') as 'rows' | 'columns' | 'values' | 'filters';
            if (zoneType) {
                this.updateDropZone(zone as HTMLElement, zoneType);
            }
        });
    }

    private renderPivotTable(): void {
        if (!this.gridElement) return;

        this.gridElement.innerHTML = '';

        if (this.pivotConfig.rows.length === 0 && this.pivotConfig.columns.length === 0 && this.pivotConfig.values.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'xwui-pivot-table-empty';
            empty.textContent = 'Drag fields to rows, columns, or values to create a pivot table';
            this.gridElement.appendChild(empty);
            return;
        }

        // Calculate pivot data
        const pivotData = this.calculatePivotData();
        const columns = this.generateColumns();

        // Create data grid
        this.dataGrid = new XWUIDataGrid(
            this.gridElement,
            {
                columns,
                data: pivotData
            },
            {
                bordered: true,
                hoverable: true
            }
        );
        this.registerChildComponent(this.dataGrid);
    }

    private calculatePivotData(): any[] {
        // Simplified pivot calculation
        const result: any[] = [];
        const rowGroups = new Map<string, any>();

        this.data.data.forEach(row => {
            const rowKey = this.pivotConfig.rows.map(fieldId => {
                const field = this.data.fields.find(f => f.id === fieldId);
                return field ? row[field.dataIndex] : '';
            }).join('|');

            if (!rowGroups.has(rowKey)) {
                const group: any = {};
                this.pivotConfig.rows.forEach(fieldId => {
                    const field = this.data.fields.find(f => f.id === fieldId);
                    if (field) {
                        group[field.id] = row[field.dataIndex];
                    }
                });
                this.pivotConfig.values.forEach(value => {
                    const field = this.data.fields.find(f => f.id === value.fieldId);
                    if (field) {
                        group[`${value.fieldId}_${value.aggregation}`] = 0;
                    }
                });
                rowGroups.set(rowKey, group);
            }

            const group = rowGroups.get(rowKey)!;
            this.pivotConfig.values.forEach(value => {
                const field = this.data.fields.find(f => f.id === value.fieldId);
                if (field) {
                    const key = `${value.fieldId}_${value.aggregation}`;
                    const val = parseFloat(row[field.dataIndex]) || 0;
                    if (value.aggregation === 'sum' || value.aggregation === 'average') {
                        group[key] = (group[key] || 0) + val;
                    } else if (value.aggregation === 'count') {
                        group[key] = (group[key] || 0) + 1;
                    } else if (value.aggregation === 'max') {
                        group[key] = Math.max(group[key] || val, val);
                    } else if (value.aggregation === 'min') {
                        group[key] = Math.min(group[key] || val, val);
                    }
                }
            });
        });

        // Calculate averages
        this.pivotConfig.values.forEach(value => {
            if (value.aggregation === 'average') {
                const count = this.data.data.length;
                rowGroups.forEach(group => {
                    const key = `${value.fieldId}_${value.aggregation}`;
                    group[key] = count > 0 ? group[key] / count : 0;
                });
            }
        });

        return Array.from(rowGroups.values());
    }

    private generateColumns(): any[] {
        const columns: any[] = [];

        // Row fields
        this.pivotConfig.rows.forEach(fieldId => {
            const field = this.data.fields.find(f => f.id === fieldId);
            if (field) {
                columns.push({
                    id: field.id,
                    label: field.label,
                    dataIndex: field.id
                });
            }
        });

        // Value columns
        this.pivotConfig.values.forEach(value => {
            const field = this.data.fields.find(f => f.id === value.fieldId);
            if (field) {
                columns.push({
                    id: `${value.fieldId}_${value.aggregation}`,
                    label: `${field.label} (${value.aggregation})`,
                    dataIndex: `${value.fieldId}_${value.aggregation}`,
                    align: 'right'
                });
            }
        });

        return columns;
    }

    public getConfig(): PivotConfig {
        return { ...this.pivotConfig };
    }

    public setConfig(config: PivotConfig): void {
        this.pivotConfig = config;
        this.updateAllDropZones();
        this.renderPivotTable();
    }

    public destroy(): void {
        // Child component (dataGrid) is automatically destroyed by base class
        this.wrapperElement = null;
        this.fieldPanelElement = null;
        this.gridElement = null;
        this.dataGrid = null;
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPivotTable as any).componentName = 'XWUIPivotTable';


