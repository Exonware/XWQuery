/**
 * XWUITable Component
 * Data table with sorting, filtering, and selection
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

export interface XWUITableColumn {
    key: string;
    title: string;
    dataIndex?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (value: any, record: any, index: number) => HTMLElement | string;
}

// Component-level configuration
export interface XWUITableConfig {
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
export interface XWUITableData {
    columns: XWUITableColumn[];
    data: Record<string, any>[];
}

export class XWUITable extends XWUIComponent<XWUITableData, XWUITableConfig> {
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
        data: XWUITableData,
        conf_comp: XWUITableConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITableConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITableConfig {
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

        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-table-wrapper';

        this.tableElement = document.createElement('table');
        this.tableElement.className = 'xwui-table';
        this.tableElement.classList.add(`xwui-table-${this.config.size}`);
        
        if (this.config.bordered) {
            this.tableElement.classList.add('xwui-table-bordered');
        }
        if (this.config.striped) {
            this.tableElement.classList.add('xwui-table-striped');
        }
        if (this.config.hoverable) {
            this.tableElement.classList.add('xwui-table-hoverable');
        }
        if (this.config.className) {
            this.tableElement.classList.add(this.config.className);
        }

        // Header
        this.theadElement = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        if (this.config.selectable) {
            const selectHeader = document.createElement('th');
            selectHeader.className = 'xwui-table-select-header';
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
            th.className = 'xwui-table-header';
            if (column.align) {
                th.style.textAlign = column.align;
            }
            if (column.width) {
                th.style.width = column.width;
            }

            const headerContent = document.createElement('div');
            headerContent.className = 'xwui-table-header-content';
            headerContent.textContent = column.title;

            if (column.sortable) {
                headerContent.classList.add('xwui-table-header-sortable');
                headerContent.addEventListener('click', () => {
                    this.sort(column.key);
                });

                const sortIcon = document.createElement('span');
                sortIcon.className = 'xwui-table-sort-icon';
                if (this.sortColumn === column.key) {
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

        wrapper.appendChild(this.tableElement);

        // Pagination
        if (this.config.pagination) {
            const pagination = this.createPagination();
            wrapper.appendChild(pagination);
        }

        this.container.appendChild(wrapper);
    }

    private renderBody(): void {
        if (!this.tbodyElement) return;

        this.tbodyElement.innerHTML = '';

        const displayData = this.getDisplayData();

        displayData.forEach((record, index) => {
            const row = document.createElement('tr');
            row.className = 'xwui-table-row';
            if (this.selectedRows.has(index)) {
                row.classList.add('xwui-table-row-selected');
            }

            if (this.config.selectable) {
                const selectCell = document.createElement('td');
                selectCell.className = 'xwui-table-select-cell';
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
                row.appendChild(selectCell);
            }

            this.data.columns.forEach(column => {
                const td = document.createElement('td');
                td.className = 'xwui-table-cell';
                if (column.align) {
                    td.style.textAlign = column.align;
                }

                const dataIndex = column.dataIndex || column.key;
                const value = record[dataIndex];

                if (column.render) {
                    const rendered = column.render(value, record, index);
                    if (typeof rendered === 'string') {
                        td.innerHTML = rendered;
                    } else {
                        td.appendChild(rendered);
                    }
                } else {
                    td.textContent = value != null ? String(value) : '';
                }

                row.appendChild(td);
            });

            this.tbodyElement!.appendChild(row);
        });
    }

    private getDisplayData(): Record<string, any>[] {
        let data = [...this.data.data];

        // Sort
        if (this.sortColumn && this.sortDirection) {
            data.sort((a, b) => {
                const aVal = a[this.sortColumn!];
                const bVal = b[this.sortColumn!];
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
        pagination.className = 'xwui-table-pagination';

        const totalPages = Math.ceil(this.data.data.length / (this.config.pageSize || 10));

        const prevBtn = document.createElement('button');
        prevBtn.className = 'xwui-table-pagination-button';
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
        pageInfo.className = 'xwui-table-pagination-info';
        pageInfo.textContent = `${this.currentPage} / ${totalPages}`;
        pagination.appendChild(pageInfo);

        const nextBtn = document.createElement('button');
        nextBtn.className = 'xwui-table-pagination-button';
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

    public sort(column: string): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.render();
        this.sortHandlers.forEach(handler => handler(column, this.sortDirection!));
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
        if (this.tableElement) {
            this.tableElement.remove();
            this.tableElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITable as any).componentName = 'XWUITable';


