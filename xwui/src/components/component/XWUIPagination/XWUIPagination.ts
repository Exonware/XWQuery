/**
 * XWUIPagination Component
 * Page navigation component
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';

// Component-level configuration
export interface XWUIPaginationConfig {
    size?: 'small' | 'medium' | 'large';
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: boolean;
    simple?: boolean;
    pageSizeOptions?: number[];
    className?: string;
}

// Data type
export interface XWUIPaginationData {
    current?: number;
    total?: number;
    pageSize?: number;
}

export class XWUIPagination extends XWUIComponent<XWUIPaginationData, XWUIPaginationConfig> {
    private paginationElement: HTMLElement | null = null;
    private changeHandlers: Array<(page: number, pageSize: number, event: Event) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUIPaginationData = {},
        conf_comp: XWUIPaginationConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.data.current = this.data.current ?? 1;
        this.data.total = this.data.total ?? 0;
        this.data.pageSize = this.data.pageSize ?? 10;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIPaginationConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIPaginationConfig {
        return {
            size: conf_comp?.size ?? 'medium',
            showSizeChanger: conf_comp?.showSizeChanger ?? false,
            showQuickJumper: conf_comp?.showQuickJumper ?? false,
            showTotal: conf_comp?.showTotal ?? false,
            simple: conf_comp?.simple ?? false,
            pageSizeOptions: conf_comp?.pageSizeOptions ?? [10, 20, 50, 100],
            className: conf_comp?.className
        };
    }

    private getTotalPages(): number {
        return Math.ceil((this.data.total || 0) / (this.data.pageSize || 10));
    }

    private render(): void {
        this.container.innerHTML = '';

        this.paginationElement = document.createElement('nav');
        this.paginationElement.className = 'xwui-pagination';
        this.paginationElement.classList.add(`xwui-pagination-${this.config.size}`);
        this.paginationElement.setAttribute('aria-label', 'Pagination');
        
        if (this.config.simple) {
            this.paginationElement.classList.add('xwui-pagination-simple');
        }
        if (this.config.className) {
            this.paginationElement.classList.add(this.config.className);
        }

        const totalPages = this.getTotalPages();
        const current = this.data.current || 1;

        if (this.config.simple) {
            this.renderSimple();
        } else {
            this.renderFull(totalPages, current);
        }

        this.container.appendChild(this.paginationElement);
    }

    private renderSimple(): void {
        const wrapper = document.createElement('div');
        wrapper.className = 'xwui-pagination-simple-wrapper';

        const current = this.data.current || 1;
        const totalPages = this.getTotalPages();

        const prevBtn = this.createButton('prev', '‹', current > 1);
        wrapper.appendChild(prevBtn);

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'xwui-pagination-simple-input';
        input.value = String(current);
        input.min = '1';
        input.max = String(totalPages);
        input.addEventListener('change', (e) => {
            const page = parseInt((e.target as HTMLInputElement).value) || 1;
            this.goToPage(page);
        });
        wrapper.appendChild(input);

        const separator = document.createElement('span');
        separator.className = 'xwui-pagination-simple-separator';
        separator.textContent = '/';
        wrapper.appendChild(separator);

        const totalSpan = document.createElement('span');
        totalSpan.className = 'xwui-pagination-simple-total';
        totalSpan.textContent = String(totalPages);
        wrapper.appendChild(totalSpan);

        const nextBtn = this.createButton('next', '›', current < totalPages);
        wrapper.appendChild(nextBtn);

        this.paginationElement!.appendChild(wrapper);
    }

    private renderFull(totalPages: number, current: number): void {
        const list = document.createElement('ul');
        list.className = 'xwui-pagination-list';

        // Total info
        if (this.config.showTotal) {
            const totalInfo = document.createElement('li');
            totalInfo.className = 'xwui-pagination-total';
            const start = ((current - 1) * (this.data.pageSize || 10)) + 1;
            const end = Math.min(current * (this.data.pageSize || 10), this.data.total || 0);
            totalInfo.textContent = `${start}-${end} of ${this.data.total || 0}`;
            list.appendChild(totalInfo);
        }

        // Previous button
        const prevItem = document.createElement('li');
        prevItem.appendChild(this.createButton('prev', '‹', current > 1));
        list.appendChild(prevItem);

        // Page numbers
        const pages = this.getPageNumbers(totalPages, current);
        pages.forEach(page => {
            const item = document.createElement('li');
            if (page === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'xwui-pagination-ellipsis';
                ellipsis.textContent = '...';
                item.appendChild(ellipsis);
            } else {
                const btn = this.createButton('page', String(page), true, page === current);
                item.appendChild(btn);
            }
            list.appendChild(item);
        });

        // Next button
        const nextItem = document.createElement('li');
        nextItem.appendChild(this.createButton('next', '›', current < totalPages));
        list.appendChild(nextItem);

        this.paginationElement!.appendChild(list);

        // Size changer
        if (this.config.showSizeChanger) {
            const sizeChanger = document.createElement('div');
            sizeChanger.className = 'xwui-pagination-size-changer';
            
            const select = document.createElement('select');
            select.className = 'xwui-pagination-size-select';
            this.config.pageSizeOptions?.forEach(size => {
                const option = document.createElement('option');
                option.value = String(size);
                option.textContent = `${size} / page`;
                option.selected = size === this.data.pageSize;
                select.appendChild(option);
            });
            select.addEventListener('change', (e) => {
                const newSize = parseInt((e.target as HTMLSelectElement).value);
                this.setPageSize(newSize);
            });
            
            sizeChanger.appendChild(select);
            this.paginationElement!.appendChild(sizeChanger);
        }

        // Quick jumper
        if (this.config.showQuickJumper) {
            const jumper = document.createElement('div');
            jumper.className = 'xwui-pagination-jumper';
            
            jumper.appendChild(document.createTextNode('Go to '));
            
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'xwui-pagination-jumper-input';
            input.min = '1';
            input.max = String(totalPages);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const page = parseInt((e.target as HTMLInputElement).value) || 1;
                    this.goToPage(page);
                    (e.target as HTMLInputElement).value = '';
                }
            });
            jumper.appendChild(input);
            
            jumper.appendChild(document.createTextNode(' page'));
            
            this.paginationElement!.appendChild(jumper);
        }
    }

    private getPageNumbers(total: number, current: number): (number | string)[] {
        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        if (current <= 4) {
            return [1, 2, 3, 4, 5, '...', total];
        }

        if (current >= total - 3) {
            return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
        }

        return [1, '...', current - 1, current, current + 1, '...', total];
    }

    private createButton(type: string, label: string, enabled: boolean, active: boolean = false): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'xwui-pagination-button';
        btn.textContent = label;
        btn.disabled = !enabled;

        if (type === 'page' && active) {
            btn.classList.add('xwui-pagination-button-active');
        }

        if (enabled) {
            btn.addEventListener('click', () => {
                if (type === 'prev') {
                    this.goToPage((this.data.current || 1) - 1);
                } else if (type === 'next') {
                    this.goToPage((this.data.current || 1) + 1);
                } else if (type === 'page') {
                    this.goToPage(parseInt(label));
                }
            });
        }

        return btn;
    }

    public goToPage(page: number): void {
        const totalPages = this.getTotalPages();
        const newPage = Math.max(1, Math.min(page, totalPages));
        this.data.current = newPage;
        this.render();
        this.changeHandlers.forEach(handler => handler(newPage, this.data.pageSize || 10, new Event('change')));
    }

    public setPageSize(size: number): void {
        this.data.pageSize = size;
        this.data.current = 1;
        this.render();
        this.changeHandlers.forEach(handler => handler(1, size, new Event('change')));
    }

    public onChange(handler: (page: number, pageSize: number, event: Event) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.paginationElement;
    }

    public destroy(): void {
        this.changeHandlers = [];
        if (this.paginationElement) {
            this.paginationElement.remove();
            this.paginationElement = null;
        }
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIPagination as any).componentName = 'XWUIPagination';


