/**
 * XWUIActivityFilter Component
 * Filter and search activity stream by type, user, date range
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIThread, type XWUIThreadMessage, type XWUIThreadContributor } from '../XWUIThread/XWUIThread';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUIMenuDropdown } from '../XWUIMenuDropdown/XWUIMenuDropdown';
import { XWUIDateRangePicker } from '../XWUIDateRangePicker/XWUIDateRangePicker';
import { XWUIChip } from '../XWUIChip/XWUIChip';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUITabs } from '../XWUITabs/XWUITabs';

export interface ActivityFilter {
    type?: string;
    userId?: string;
    dateRange?: { start: Date; end: Date };
    search?: string;
}

// Component-level configuration
export interface XWUIActivityFilterConfig {
    showSearch?: boolean;
    showFilters?: boolean;
    showTabs?: boolean;
    className?: string;
}

// Data type
export interface XWUIActivityFilterData {
    contributors: XWUIThreadContributor[];
    messages: XWUIThreadMessage[];
    filterPresets?: Array<{ label: string; filter: ActivityFilter }>;
}

export class XWUIActivityFilter extends XWUIComponent<XWUIActivityFilterData, XWUIActivityFilterConfig> {
    private wrapperElement: HTMLElement | null = null;
    private threadComponent: XWUIThread | null = null;
    private currentFilter: ActivityFilter = {};
    private changeHandlers: Array<(filter: ActivityFilter, filteredMessages: XWUIThreadMessage[]) => void> = [];
    private searchInput: XWUIInput | null = null;
    private typeMenu: XWUIMenuDropdown | null = null;
    private datePicker: XWUIDateRangePicker | null = null;
    private chipInstances: XWUIChip[] = [];
    private clearBtn: XWUIButton | null = null;
    private tabsInstance: XWUITabs | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIActivityFilterData,
        conf_comp: XWUIActivityFilterConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIActivityFilterConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIActivityFilterConfig {
        return {
            showSearch: conf_comp?.showSearch ?? true,
            showFilters: conf_comp?.showFilters ?? true,
            showTabs: conf_comp?.showTabs ?? false,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-activity-filter';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Filter bar
        if (this.config.showFilters || this.config.showSearch) {
            this.renderFilterBar();
        }

        // Preset tabs
        if (this.config.showTabs && this.data.filterPresets && this.data.filterPresets.length > 0) {
            this.renderPresetTabs();
        }

        // Activity thread
        this.renderThread();

        this.container.appendChild(this.wrapperElement);
    }

    private renderFilterBar(): void {
        const filterBar = document.createElement('div');
        filterBar.className = 'xwui-activity-filter-bar';

        // Search input
        if (this.config.showSearch) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'xwui-activity-filter-search';

            const inputContainer = document.createElement('div');
            this.searchInput = new XWUIInput(inputContainer, {
                placeholder: 'Search activities...',
                value: this.currentFilter.search || ''
            });

            this.searchInput.onChange(() => {
                this.currentFilter.search = this.searchInput?.getValue() || '';
                this.applyFilter();
            });

            searchContainer.appendChild(inputContainer);
            filterBar.appendChild(searchContainer);
        }

        // Type filter
        if (this.config.showFilters) {
            const typeContainer = document.createElement('div');
            typeContainer.className = 'xwui-activity-filter-type';

            const typeMenuContainer = document.createElement('div');
            this.typeMenu = new XWUIMenuDropdown(typeMenuContainer, {
                items: [
                    { id: 'all', label: 'All Types' },
                    { id: 'comment', label: 'Comments' },
                    { id: 'change', label: 'Changes' },
                    { id: 'system', label: 'System' }
                ],
                triggerElement: typeContainer
            });

            this.typeMenu.onItemClick((item) => {
                this.currentFilter.type = item.id === 'all' ? undefined : item.id;
                this.applyFilter();
            });

            typeContainer.appendChild(typeMenuContainer);
            filterBar.appendChild(typeContainer);
        }

        // Date range
        if (this.config.showFilters) {
            const dateContainer = document.createElement('div');
            dateContainer.className = 'xwui-activity-filter-date';

            const datePickerContainer = document.createElement('div');
            if (this.currentFilter.dateRange) {
                this.datePicker = new XWUIDateRangePicker(datePickerContainer, {
                    startDate: this.currentFilter.dateRange.start,
                    endDate: this.currentFilter.dateRange.end
                });

                this.datePicker.onChange((range: { startDate: Date; endDate: Date }) => {
                    this.currentFilter.dateRange = {
                        start: range.startDate,
                        end: range.endDate
                    };
                    this.applyFilter();
                });
            }

            dateContainer.appendChild(datePickerContainer);
            filterBar.appendChild(dateContainer);
        }

        // Active filters chips
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'xwui-activity-filter-chips';

        this.chipInstances = [];
        if (this.currentFilter.type) {
            const chipContainer = document.createElement('div');
            const chip = new XWUIChip(chipContainer, {
                label: `Type: ${this.currentFilter.type}`,
                closable: true
            });
            this.chipInstances.push(chip);

            chip.onClose(() => {
                this.currentFilter.type = undefined;
                this.applyFilter();
            });

            chipsContainer.appendChild(chipContainer);
        }

        // Clear button
        const clearBtnContainer = document.createElement('div');
        this.clearBtn = new XWUIButton(clearBtnContainer, {
            label: 'Clear',
            variant: 'ghost',
            size: 'small'
        });

        this.clearBtn.onClick(() => {
            this.clearFilters();
        });

        filterBar.appendChild(chipsContainer);
        filterBar.appendChild(clearBtnContainer);
        this.wrapperElement!.appendChild(filterBar);
    }

    private renderPresetTabs(): void {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'xwui-activity-filter-tabs';

        const tabItems = this.data.filterPresets!.map((preset, index) => ({
            id: `preset-${index}`,
            label: preset.label
        }));

        this.tabsInstance = new XWUITabs(tabsContainer, {
            items: tabItems,
            defaultActive: tabItems[0]?.id
        });

        this.tabsInstance.onChange((tabId: string) => {
            const index = parseInt(tabId.replace('preset-', ''));
            const preset = this.data.filterPresets![index];
            if (preset) {
                this.currentFilter = { ...preset.filter };
                this.applyFilter();
            }
        });

        this.wrapperElement!.appendChild(tabsContainer);
    }

    private renderThread(): void {
        const filteredMessages = this.getFilteredMessages();

        const threadContainer = document.createElement('div');
        threadContainer.className = 'xwui-activity-filter-thread';

        this.threadComponent = new XWUIThread(threadContainer, {
            contributors: this.data.contributors,
            messages: filteredMessages
        }, {
            viewerId: '',
            autoScroll: false
        });

        this.wrapperElement!.appendChild(threadContainer);
    }

    private getFilteredMessages(): XWUIThreadMessage[] {
        let filtered = [...this.data.messages];

        // Search filter
        if (this.currentFilter.search) {
            const search = this.currentFilter.search.toLowerCase();
            filtered = filtered.filter(msg => 
                msg.content.toLowerCase().includes(search)
            );
        }

        // Type filter (would need message type metadata)
        if (this.currentFilter.type) {
            // filtered = filtered.filter(msg => msg.type === this.currentFilter.type);
        }

        // User filter
        if (this.currentFilter.userId) {
            filtered = filtered.filter(msg => msg.senderId === this.currentFilter.userId);
        }

        // Date range filter
        if (this.currentFilter.dateRange) {
            filtered = filtered.filter(msg => {
                const msgDate = typeof msg.timestamp === 'string' 
                    ? new Date(msg.timestamp) 
                    : msg.timestamp;
                return msgDate >= this.currentFilter.dateRange!.start &&
                       msgDate <= this.currentFilter.dateRange!.end;
            });
        }

        return filtered;
    }

    private applyFilter(): void {
        const filteredMessages = this.getFilteredMessages();
        if (this.threadComponent) {
            this.threadComponent.destroy();
            this.renderThread();
        }
        this.notifyChange(filteredMessages);
    }

    private clearFilters(): void {
        this.currentFilter = {};
        this.applyFilter();
    }

    private notifyChange(filteredMessages: XWUIThreadMessage[]): void {
        this.changeHandlers.forEach(handler => handler({ ...this.currentFilter }, filteredMessages));
    }

    public setFilter(filter: ActivityFilter): void {
        this.currentFilter = { ...filter };
        this.applyFilter();
    }

    public getFilter(): ActivityFilter {
        return { ...this.currentFilter };
    }

    public onChange(handler: (filter: ActivityFilter, filteredMessages: XWUIThreadMessage[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.searchInput) {
            this.searchInput.destroy();
            this.searchInput = null;
        }
        if (this.typeMenu) {
            this.typeMenu.destroy();
            this.typeMenu = null;
        }
        if (this.datePicker) {
            this.datePicker.destroy();
            this.datePicker = null;
        }
        this.chipInstances.forEach(chip => chip.destroy());
        this.chipInstances = [];
        if (this.clearBtn) {
            this.clearBtn.destroy();
            this.clearBtn = null;
        }
        if (this.tabsInstance) {
            this.tabsInstance.destroy();
            this.tabsInstance = null;
        }
        if (this.threadComponent) {
            this.threadComponent.destroy();
            this.threadComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.changeHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIActivityFilter as any).componentName = 'XWUIActivityFilter';


