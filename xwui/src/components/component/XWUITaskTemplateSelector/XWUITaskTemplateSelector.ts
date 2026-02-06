/**
 * XWUITaskTemplateSelector Component
 * Select and apply task/project templates
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../XWUIComponent/XWUIComponent';
import { XWUIDialog } from '../XWUIDialog/XWUIDialog';
import { XWUIGrid } from '../XWUIGrid/XWUIGrid';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUIMenuDropdown } from '../XWUIMenuDropdown/XWUIMenuDropdown';
import { XWUIButton } from '../XWUIButton/XWUIButton';

export interface TaskTemplate {
    id: string;
    name: string;
    description?: string;
    category?: string;
    icon?: string;
    preview?: string;
    data?: any; // Template data
}

// Component-level configuration
export interface XWUITaskTemplateSelectorConfig {
    showSearch?: boolean;
    showCategories?: boolean;
    className?: string;
}

// Data type
export interface XWUITaskTemplateSelectorData {
    templates: TaskTemplate[];
    categories?: string[];
    selectedTemplate?: TaskTemplate;
}

export class XWUITaskTemplateSelector extends XWUIComponent<XWUITaskTemplateSelectorData, XWUITaskTemplateSelectorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private dialogComponent: XWUIDialog | null = null;
    private selectedTemplate: TaskTemplate | null = null;
    private clickHandlers: Array<(template: TaskTemplate) => void> = [];
    private triggerBtn: XWUIButton | null = null;
    private searchInput: XWUIInput | null = null;
    private categoryMenu: XWUIMenuDropdown | null = null;
    private grid: XWUIGrid | null = null;
    private cardInstances: XWUICard[] = [];

    constructor(
        container: HTMLElement,
        data: XWUITaskTemplateSelectorData,
        conf_comp: XWUITaskTemplateSelectorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.selectedTemplate = data.selectedTemplate || null;
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUITaskTemplateSelectorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUITaskTemplateSelectorConfig {
        return {
            showSearch: conf_comp?.showSearch ?? true,
            showCategories: conf_comp?.showCategories ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-task-template-selector';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Trigger button
        const triggerContainer = document.createElement('div');
        this.triggerBtn = new XWUIButton(triggerContainer, {
            label: 'Select Template',
            variant: 'primary'
        });

        this.triggerBtn.getElement()?.addEventListener('click', () => {
            this.openDialog();
        });

        this.wrapperElement.appendChild(triggerContainer);
        this.container.appendChild(this.wrapperElement);
    }

    private openDialog(): void {
        const dialogContainer = document.createElement('div');
        
        const dialogContent = document.createElement('div');
        dialogContent.className = 'xwui-task-template-selector-dialog';

        // Search bar
        if (this.config.showSearch) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'xwui-task-template-selector-search';

            const inputContainer = document.createElement('div');
            this.searchInput = new XWUIInput(inputContainer, {
                placeholder: 'Search templates...'
            });

            searchContainer.appendChild(inputContainer);
            dialogContent.appendChild(searchContainer);
        }

        // Category filter
        if (this.config.showCategories && this.data.categories && this.data.categories.length > 0) {
            const categoryContainer = document.createElement('div');
            categoryContainer.className = 'xwui-task-template-selector-categories';

            const categoryMenuContainer = document.createElement('div');
            this.categoryMenu = new XWUIMenuDropdown(categoryMenuContainer, {
                items: [
                    { id: 'all', label: 'All Categories' },
                    ...this.data.categories.map(cat => ({ id: cat, label: cat }))
                ],
                triggerElement: categoryContainer
            });

            categoryContainer.appendChild(categoryMenuContainer);
            dialogContent.appendChild(categoryContainer);
        }

        // Template grid
        const gridContainer = document.createElement('div');
        gridContainer.className = 'xwui-task-template-selector-grid';

        this.grid = new XWUIGrid(gridContainer, {}, {
            columns: 3,
            gap: 'medium'
        });

        this.cardInstances = [];

        this.data.templates.forEach(template => {
            const cardContainer = document.createElement('div');
            const card = new XWUICard(cardContainer, {
                title: template.name,
                subtitle: template.category,
                content: template.description || ''
            }, {
                hoverable: true,
                clickable: true
            });
            this.cardInstances.push(card);

            card.getElement()?.addEventListener('click', () => {
                this.selectTemplate(template);
                if (this.dialogComponent) {
                    this.dialogComponent.close();
                }
            });

            gridContainer.appendChild(cardContainer);
        });

        dialogContent.appendChild(gridContainer);

        this.dialogComponent = new XWUIDialog(dialogContainer, {
            title: 'Select Template',
            content: dialogContent
        }, {
            size: 'large',
            closable: true
        });

        document.body.appendChild(dialogContainer);
        this.dialogComponent.open();

        this.dialogComponent.onClose(() => {
            if (dialogContainer.parentNode) {
                dialogContainer.parentNode.removeChild(dialogContainer);
            }
        });
    }

    private selectTemplate(template: TaskTemplate): void {
        this.selectedTemplate = template;
        this.clickHandlers.forEach(handler => handler(template));
    }

    public getSelectedTemplate(): TaskTemplate | null {
        return this.selectedTemplate;
    }

    public onSelect(handler: (template: TaskTemplate) => void): void {
        this.clickHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public destroy(): void {
        if (this.triggerBtn) {
            this.triggerBtn.destroy();
            this.triggerBtn = null;
        }
        if (this.searchInput) {
            this.searchInput.destroy();
            this.searchInput = null;
        }
        if (this.categoryMenu) {
            this.categoryMenu.destroy();
            this.categoryMenu = null;
        }
        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }
        this.cardInstances.forEach(card => card.destroy());
        this.cardInstances = [];
        if (this.dialogComponent) {
            this.dialogComponent.destroy();
            this.dialogComponent = null;
        }
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.clickHandlers = [];
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUITaskTemplateSelector as any).componentName = 'XWUITaskTemplateSelector';


