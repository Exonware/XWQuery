/**
 * XWUIDataGrid Component
 * Advanced data grid with custom column renderers and enhanced features
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export interface XWUIDataGridColumn<T = any> {
    id: string;
    label: string;
    dataIndex?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    filterable?: boolean;
    render?: (row: T, index: number) => HTMLElement | string;
    headerRender?: () => HTMLElement | string;
    className?: string;
}

// Component-level configuration
export interface XWUIDataGridConfig {
    bordered?: boolean;
    striped?: boolean;
    hoverable?: boolean;
    size?: 'small' | 'medium' | 'large';
    selectable?: boolean;
    pagination?: boolean;
    pageSize?: number;
    className?: string;
}

// Data type
export interface XWUIDataGridData<T = any> {
    columns: XWUIDataGridColumn<T>[];
    data: T[];
}

export class XWUIDataGrid<T = any> extends XWUIComponent<XWUIDataGridData<T>, XWUIDataGridConfig> {
    private gridElement: HTMLElement | null = null;
    private tableElement: HTMLElement | null = null;
    private theadElement: HTMLElement | null = null;
    private tbodyElement: HTMLElement | null = null;
    private currentPage: number = 1;
    private sortColumn: string | null = null;
    private sortDirection: 'asc' | 'desc' | null = null;
    private selectedRows: Set<number> = new Set();
    private sortHandlers: Array<(column: string, direction: 'asc' | 'desc') => void> = [];
    private selectHandlers: Array<(selectedRows: number[]) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIDataGridData<T>,
        conf_comp: XWUIDataGridConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIDataGridConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIDataGridConfig {
        return {
            bordered: conf_comp?.bordered ?? true,
            striped: conf_comp?.striped ?? false,
            hoverable: conf_comp?.hoverable ?? true,
            size: conf_comp?.size ?? 'medium',
            selectable: conf_comp?.selectable ?? false,
            pagination: conf_comp?.pagination ?? false,
            pageSize: conf_comp?.pageSize ?? 10,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.gridElement = document.createElement('div');
        this.gridElement.className = 'xwui-datagrid-wrapper';

        this.tableElement = document.createElement('table');
        this.tableElement.className = 'xwui-datagrid';
        this.tableElement.classList.add(`xwui-datagrid-${this.config.size}`);
        
        if (this.config.bordered) {
            this.tableElement.classList.add('xwui-datagrid-bordered');
        }
        if (this.config.striped) {
            this.tableElement.classList.add('xwui-datagrid-striped');
        }
        if (this.config.hoverable) {
            this.tableElement.classList.add('xwui-datagrid-hoverable');
        }
        if (this.config.className) {
            this.tableElement.classList.add(this.config.className);
        }

        // Header
        this.theadElement = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        if (this.config.selectable) {
            const selectHeader = document.createElement('th');
            selectHeader.className = 'xwui-datagrid-select-header';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', (e) => {
                const checked = (e.target as HTMLInputElement).checked;
                if (checked) {
                    this.selectAll();
                } else {
                    this.deselectAll();
                }
            });
            selectHeader.appendChild(checkbox);
            headerRow.appendChild(selectHeader);
        }

        this.data.columns.forEach(column => {
            const th = document.createElement('th');
            th.className = 'xwui-datagrid-header';
            if (column.className) {
                th.classList.add(column.className);
            }
            if (column.align) {
                th.style.textAlign = column.align;
            }
            if (column.width) {
                th.style.width = column.width;
            }

            const headerContent = document.createElement('div');
            headerContent.className = 'xwui-datagrid-header-content';

            if (column.headerRender) {
                const rendered = column.headerRender();
                if (typeof rendered === 'string') {
                    headerContent.innerHTML = rendered;
                } else {
                    headerContent.appendChild(rendered);
                }
            } else {
                headerContent.textContent = column.label;
            }

            if (column.sortable) {
                headerContent.classList.add('xwui-datagrid-header-sortable');
                headerContent.addEventListener('click', () => {
                    this.sort(column.id);
                });

                const sortIcon = document.createElement('span');
                sortIcon.className = 'xwui-datagrid-sort-icon';
                if (this.sortColumn === column.id) {
                    sortIcon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
                } else {
                    sortIcon.textContent = '⇅';
                }
                headerContent.appendChild(sortIcon);
            }

            th.appendChild(headerContent);
            headerRow.appendChild(th);
        });

        this.theadElement.appendChild(headerRow);
        this.tableElement.appendChild(this.theadElement);

        // Body
        this.tbodyElement = document.createElement('tbody');
        this.renderBody();
        this.tableElement.appendChild(this.tbodyElement);

        this.gridElement.appendChild(this.tableElement);

        // Pagination
        if (this.config.pagination) {
            const pagination = this.createPagination();
            this.gridElement.appendChild(pagination);
        }

        this.container.appendChild(this.gridElement);
    }

    private renderBody(): void {
        if (!this.tbodyElement) return;

        this.tbodyElement.innerHTML = '';

        const displayData = this.getDisplayData();

        displayData.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.className = 'xwui-datagrid-row';
            if (this.selectedRows.has(index)) {
                tr.classList.add('xwui-datagrid-row-selected');
            }

            if (this.config.selectable) {
                const selectCell = document.createElement('td');
                selectCell.className = 'xwui-datagrid-select-cell';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = this.selectedRows.has(index);
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        this.selectedRows.add(index);
                    } else {
                        this.selectedRows.delete(index);
                    }
                    this.updateSelection();
                });
                selectCell.appendChild(checkbox);
                tr.appendChild(selectCell);
            }

            this.data.columns.forEach(column => {
                const td = document.createElement('td');
                td.className = 'xwui-datagrid-cell';
                if (column.className) {
                    td.classList.add(column.className);
                }
                if (column.align) {
                    td.style.textAlign = column.align;
                }

                if (column.render) {
                    const rendered = column.render(row, index);
                    if (typeof rendered === 'string') {
                        td.innerHTML = rendered;
                    } else {
                        td.appendChild(rendered);
                    }
                } else {
                    const dataIndex = column.dataIndex || column.id;
                    const value = (row as any)[dataIndex];
                    td.textContent = value != null ? String(value) : '';
                }

                tr.appendChild(td);
            });

            this.tbodyElement!.appendChild(tr);
        });
    }

    private getDisplayData(): T[] {
        let data = [...this.data.data];

        // Sort
        if (this.sortColumn && this.sortDirection) {
            data.sort((a, b) => {
                const column = this.data.columns.find(col => col.id === this.sortColumn);
                if (!column) return 0;

                const dataIndex = column.dataIndex || column.id;
                const aVal = (a as any)[dataIndex];
                const bVal = (b as any)[dataIndex];
                const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                return this.sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        // Paginate
        if (this.config.pagination) {
            const start = (this.currentPage - 1) * (this.config.pageSize || 10);
            const end = start + (this.config.pageSize || 10);
            data = data.slice(start, end);
        }

        return data;
    }

    private createPagination(): HTMLElement {
        const pagination = document.createElement('div');
        pagination.className = 'xwui-datagrid-pagination';

        const totalPages = Math.ceil(this.data.data.length / (this.config.pageSize || 10));

        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-datagrid-pagination-button';
        prevBtn.textContent = '‹';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderBody();
            }
        });
        pagination.appendChild(prevBtn);

        const pageInfo = document.createElement('span');
        pageInfo.className = 'xwui-datagrid-pagination-info';
        pageInfo.textContent = `${this.currentPage} / ${totalPages}`;
        pagination.appendChild(pageInfo);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-datagrid-pagination-button';
        nextBtn.textContent = '›';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderBody();
            }
        });
        pagination.appendChild(nextBtn);

        return pagination;
    }

    public sort(columnId: string): void {
        if (this.sortColumn === columnId) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = columnId;
            this.sortDirection = 'asc';
        }

        this.render();
        this.sortHandlers.forEach(handler => handler(columnId, this.sortDirection!));
    }

    public selectAll(): void {
        const displayData = this.getDisplayData();
        displayData.forEach((_, index) => {
            this.selectedRows.add(index);
        });
        this.updateSelection();
    }

    public deselectAll(): void {
        this.selectedRows.clear();
        this.updateSelection();
    }

    private updateSelection(): void {
        this.renderBody();
        this.selectHandlers.forEach(handler => handler(Array.from(this.selectedRows)));
    }

    public onSort(handler: (column: string, direction: 'asc' | 'desc') => void): void {
        this.sortHandlers.push(handler);
    }

    public onSelect(handler: (selectedRows: number[]) => void): void {
        this.selectHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.tableElement;
    }

    public destroy(): void {
        this.sortHandlers = [];
        this.selectHandlers = [];
        this.selectedRows.clear();
        if (this.gridElement) {
            this.gridElement.remove();
            this.gridElement = null;
        }
        this.tableElement = null;
        this.theadElement = null;
        this.tbodyElement = null;
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIDataGrid as any).componentName = 'XWUIDataGrid';


