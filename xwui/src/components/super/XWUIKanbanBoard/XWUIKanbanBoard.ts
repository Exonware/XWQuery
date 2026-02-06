/**
 * XWUIKanbanBoard Component
 * Kanban board with columns and drag-and-drop between columns
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIGrid } from '../XWUIGrid/XWUIGrid';
import { XWUICard } from '../XWUICard/XWUICard';
import { XWUIBadge } from '../XWUIBadge/XWUIBadge';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIDialog } from '../XWUIDialog/XWUIDialog';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';
import { XWUIDatePicker } from '../XWUIDatePicker/XWUIDatePicker';
import { XWUISelect } from '../XWUISelect/XWUISelect';

export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    assignee?: string;
    assigneeAvatar?: string; // URL or data URI for profile picture
    tags?: string[];
    color?: string;
    priority?: 'high' | 'medium' | 'low'; // For priority arrow icon
    date?: string | Date; // Date to display on card
}

export interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
    maxCards?: number;
    color?: string;
}

// Component-level configuration
export interface XWUIKanbanBoardConfig {
    allowAddCards?: boolean;
    allowReorder?: boolean;
    allowAddColumns?: boolean;
    allowSorting?: boolean;
    allowEdit?: boolean;
    className?: string;
}

// Data type
export interface XWUIKanbanBoardData {
    columns: KanbanColumn[];
}

export class XWUIKanbanBoard extends XWUIComponent<XWUIKanbanBoardData, XWUIKanbanBoardConfig> {
    private wrapperElement: HTMLElement | null = null;
    private boardContainer: HTMLElement | null = null;
    private draggingCard: { card: KanbanCard; sourceColumnId: string; sourceIndex: number } | null = null;
    private changeHandlers: Array<(columns: KanbanColumn[]) => void> = [];
    private editDialog: XWUIDialog | null = null;
    private editingCard: { card: KanbanCard; columnId: string } | null = null;

    constructor(
        container: HTMLElement,
        data: XWUIKanbanBoardData,
        conf_comp: XWUIKanbanBoardConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIKanbanBoardConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIKanbanBoardConfig {
        return {
            allowAddCards: conf_comp?.allowAddCards ?? true,
            allowReorder: conf_comp?.allowReorder ?? true,
            allowAddColumns: conf_comp?.allowAddColumns ?? true,
            allowSorting: conf_comp?.allowSorting ?? true,
            allowEdit: conf_comp?.allowEdit ?? true,
            className: conf_comp?.className
        };
    }

    private render(): void {
        this.container.innerHTML = '';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-kanban-board';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Board container with horizontal scroll
        this.boardContainer = document.createElement('div');
        this.boardContainer.className = 'xwui-kanban-board-container';

        this.data.columns.forEach(column => {
            const columnElement = this.createColumn(column);
            this.boardContainer!.appendChild(columnElement);
        });

        // Add column button (at the end)
        if (this.config.allowAddColumns) {
            const addColumnContainer = document.createElement('div');
            addColumnContainer.className = 'xwui-kanban-board-add-column-container';
            const addColumnBtn = new XWUIButton(addColumnContainer, {
                label: 'Add Column'
            }, {
                variant: 'outline',
                size: 'small',
                icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
                iconPosition: 'left'
            });
            this.registerChildComponent(addColumnBtn);

            addColumnBtn.onClick(() => {
                this.handleAddColumn();
            });

            this.boardContainer.appendChild(addColumnContainer);
        }

        this.wrapperElement.appendChild(this.boardContainer);
        this.container.appendChild(this.wrapperElement);
    }

    private createColumn(column: KanbanColumn): HTMLElement {
        const columnElement = document.createElement('div');
        columnElement.className = 'xwui-kanban-board-column';
        columnElement.setAttribute('data-column-id', column.id);

        // Column header
        const header = document.createElement('div');
        header.className = 'xwui-kanban-board-column-header';

        const title = document.createElement('div');
        title.className = 'xwui-kanban-board-column-title';
        
        const titleText = document.createElement('span');
        titleText.textContent = column.title;
        title.appendChild(titleText);

        const count = document.createElement('span');
        count.className = 'xwui-kanban-board-column-count';
        count.textContent = ` (${column.cards.length}${column.maxCards ? `/${column.maxCards}` : ''})`;
        title.appendChild(count);

        header.appendChild(title);
        columnElement.appendChild(header);

        // Add card button (below header, like in the image)
        if (this.config.allowAddCards) {
            const addBtnContainer = document.createElement('div');
            addBtnContainer.className = 'xwui-kanban-board-add-button-container';
            const plusIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>';
            const addBtn = new XWUIButton(addBtnContainer, {
                label: 'New task'
            }, {
                variant: 'primary',
                size: 'small',
                icon: plusIcon,
                iconPosition: 'left'
            });
            this.registerChildComponent(addBtn);

            addBtn.onClick(() => {
                this.handleAddCard(column.id);
            });

            columnElement.appendChild(addBtnContainer);
        }

        // Cards container - full height for better drop zone
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'xwui-kanban-board-column-cards';
        cardsContainer.setAttribute('data-column-id', column.id);

        // Render cards
        column.cards.forEach((card, index) => {
            const cardElement = this.createCard(card, column.id, index);
            cardsContainer.appendChild(cardElement);
        });

        // Drop zone handlers
        cardsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cardsContainer.classList.add('xwui-kanban-board-column-cards-drag-over');
            
            // Visual feedback for drop position
            const afterElement = this.getDragAfterElement(cardsContainer, e.clientY);
            const draggingElement = cardsContainer.querySelector('.xwui-kanban-board-card-dragging');
            if (afterElement == null && draggingElement) {
                cardsContainer.appendChild(draggingElement);
            } else if (afterElement && draggingElement) {
                cardsContainer.insertBefore(draggingElement, afterElement);
            }
        });

        cardsContainer.addEventListener('dragleave', () => {
            cardsContainer.classList.remove('xwui-kanban-board-column-cards-drag-over');
        });

        cardsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cardsContainer.classList.remove('xwui-kanban-board-column-cards-drag-over');
            
            if (this.draggingCard) {
                const afterElement = this.getDragAfterElement(cardsContainer, e.clientY);
                let dropIndex = column.cards.length;
                
                if (afterElement) {
                    const cardId = afterElement.getAttribute('data-card-id');
                    dropIndex = column.cards.findIndex(c => c.id === cardId);
                    if (dropIndex === -1) dropIndex = column.cards.length;
                }
                
                this.moveCard(
                    this.draggingCard.sourceColumnId,
                    column.id,
                    this.draggingCard.card.id,
                    this.draggingCard.sourceIndex,
                    dropIndex
                );
            }
        });

        columnElement.appendChild(cardsContainer);
        return columnElement;
    }

    private getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
        const draggableElements = Array.from(container.querySelectorAll('.xwui-kanban-board-card:not(.xwui-kanban-board-card-dragging)')) as HTMLElement[];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null }).element;
    }

    private createCard(card: KanbanCard, columnId: string, index?: number): HTMLElement {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'xwui-kanban-board-card';
        cardContainer.setAttribute('data-card-id', card.id);
        cardContainer.draggable = this.config.allowReorder || false;

        if (card.color) {
            cardContainer.style.borderLeftColor = card.color;
        }

        // Card wrapper for custom layout
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'xwui-kanban-board-card-wrapper';

        // Priority arrow icon (top right)
        if (card.priority) {
            const priorityIcon = document.createElement('div');
            priorityIcon.className = `xwui-kanban-board-card-priority xwui-kanban-board-card-priority-${card.priority}`;
            priorityIcon.innerHTML = '↑';
            cardWrapper.appendChild(priorityIcon);
        }

        // Card content
        const cardContent = document.createElement('div');
        cardContent.className = 'xwui-kanban-board-card-content';

        // Assignee avatar
        if (card.assigneeAvatar || card.assignee) {
            const avatarContainer = document.createElement('div');
            avatarContainer.className = 'xwui-kanban-board-card-avatar';
            if (card.assigneeAvatar) {
                const avatarImg = document.createElement('img');
                avatarImg.src = card.assigneeAvatar;
                avatarImg.alt = card.assignee || 'Assignee';
                avatarContainer.appendChild(avatarImg);
            } else if (card.assignee) {
                // Fallback: show initials
                const initials = card.assignee.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                avatarContainer.textContent = initials;
            }
            cardContent.appendChild(avatarContainer);
        }

        // Title and description
        const textContainer = document.createElement('div');
        textContainer.className = 'xwui-kanban-board-card-text';

        const titleElement = document.createElement('div');
        titleElement.className = 'xwui-kanban-board-card-title';
        titleElement.textContent = card.title;
        textContainer.appendChild(titleElement);

        if (card.description) {
            const descElement = document.createElement('div');
            descElement.className = 'xwui-kanban-board-card-description';
            descElement.textContent = card.description;
            textContainer.appendChild(descElement);
        }

        // Tags
        if (card.tags && card.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'xwui-kanban-board-card-tags';

            card.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'xwui-kanban-board-card-tag';
                // Add @ prefix if not already present
                const tagText = tag.startsWith('@') ? tag : `@${tag}`;
                tagElement.textContent = tagText;
                
                // Extract color from tag if specified (format: @tag:color)
                const colorMatch = tagText.match(/^@(\w+):(\w+)$/);
                if (colorMatch) {
                    tagElement.textContent = `@${colorMatch[1]}`;
                    tagElement.setAttribute('data-color', colorMatch[2]);
                }
                
                tagsContainer.appendChild(tagElement);
            });

            textContainer.appendChild(tagsContainer);
        }

        cardContent.appendChild(textContainer);
        cardWrapper.appendChild(cardContent);

        // Date (bottom right)
        if (card.date) {
            const dateElement = document.createElement('div');
            dateElement.className = 'xwui-kanban-board-card-date';
            const date = typeof card.date === 'string' ? new Date(card.date) : card.date;
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dateElement.textContent = `${monthNames[date.getMonth()]} ${date.getDate()}`;
            cardWrapper.appendChild(dateElement);
        }

        cardContainer.appendChild(cardWrapper);

        // Double-click handler to open edit dialog
        if (this.config.allowEdit) {
            cardContainer.style.cursor = 'pointer';
            let clickTimeout: NodeJS.Timeout | null = null;
            
            cardContainer.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                // Don't open dialog if dragging
                if (!cardContainer.classList.contains('xwui-kanban-board-card-dragging')) {
                    this.openEditDialog(card, columnId);
                }
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                }
            });
            
            // Prevent single click from interfering with drag
            cardContainer.addEventListener('click', (e) => {
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                }
                clickTimeout = setTimeout(() => {
                    clickTimeout = null;
                }, 300);
            });
        }

        // Drag handlers
        if (this.config.allowReorder) {
            cardContainer.addEventListener('dragstart', (e) => {
                const sourceIndex = index !== undefined ? index : 
                    this.data.columns.find(c => c.id === columnId)?.cards.findIndex(c => c.id === card.id) ?? -1;
                this.draggingCard = { card, sourceColumnId: columnId, sourceIndex };
                cardContainer.classList.add('xwui-kanban-board-card-dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                }
            });

            cardContainer.addEventListener('dragend', () => {
                cardContainer.classList.remove('xwui-kanban-board-card-dragging');
                this.draggingCard = null;
            });
        }

        return cardContainer;
    }

    private moveCard(
        fromColumnId: string, 
        toColumnId: string, 
        cardId: string, 
        sourceIndex: number = -1,
        targetIndex: number = -1
    ): void {
        const fromColumn = this.data.columns.find(c => c.id === fromColumnId);
        const toColumn = this.data.columns.find(c => c.id === toColumnId);
        
        if (!fromColumn || !toColumn) return;

        const cardIndex = sourceIndex >= 0 ? sourceIndex : fromColumn.cards.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        const card = fromColumn.cards.splice(cardIndex, 1)[0];
        
        // Insert at target index if specified, otherwise append
        if (targetIndex >= 0 && targetIndex <= toColumn.cards.length) {
            toColumn.cards.splice(targetIndex, 0, card);
        } else {
            toColumn.cards.push(card);
        }

        this.render();
        this.notifyChange();
    }

    private handleAddCard(columnId: string): void {
        const newCard: KanbanCard = {
            id: `card-${Date.now()}`,
            title: 'New Card',
            description: 'Click to edit'
        };

        const column = this.data.columns.find(c => c.id === columnId);
        if (column) {
            column.cards.push(newCard);
            this.render();
            this.notifyChange();
            // Open edit dialog for new card
            if (this.config.allowEdit) {
                setTimeout(() => {
                    this.openEditDialog(newCard, columnId);
                }, 100);
            }
        }
    }

    private handleAddColumn(): void {
        const newColumn: KanbanColumn = {
            id: `column-${Date.now()}`,
            title: 'New Column',
            cards: []
        };

        this.data.columns.push(newColumn);
        this.render();
        this.notifyChange();
        
        // Scroll to the new column
        requestAnimationFrame(() => {
            if (this.boardContainer) {
                this.boardContainer.scrollTo({
                    left: this.boardContainer.scrollWidth,
                    behavior: 'smooth'
                });
            }
        });
    }

    private openEditDialog(card: KanbanCard, columnId: string): void {
        this.editingCard = { card, columnId };
        
        const dialogContainer = document.createElement('div');
        this.editDialog = new XWUIDialog(dialogContainer, {
            title: 'Edit Task'
        }, {
            size: 'medium',
            closable: true,
            closeOnBackdrop: true,
            closeOnEscape: true
        });
        this.registerChildComponent(this.editDialog);

        // Create form content
        const formContent = document.createElement('div');
        formContent.className = 'xwui-kanban-board-edit-form';
        formContent.style.display = 'flex';
        formContent.style.flexDirection = 'column';
        formContent.style.gap = '1rem';

        // Title input
        const titleContainer = document.createElement('div');
        const titleInput = new XWUIInput(titleContainer, {
            label: 'Title',
            value: card.title,
            placeholder: 'Enter task title'
        }, {
            fullWidth: true
        });
        this.registerChildComponent(titleInput);
        formContent.appendChild(titleContainer);

        // Description textarea
        const descContainer = document.createElement('div');
        const descTextarea = new XWUITextarea(descContainer, {
            label: 'Description',
            value: card.description || '',
            placeholder: 'Enter task description'
        }, {
            fullWidth: true,
            autoResize: true,
            minRows: 3
        });
        this.registerChildComponent(descTextarea);
        formContent.appendChild(descContainer);

        // Assignee input
        const assigneeContainer = document.createElement('div');
        const assigneeInput = new XWUIInput(assigneeContainer, {
            label: 'Assignee',
            value: card.assignee || '',
            placeholder: 'Enter assignee name'
        }, {
            fullWidth: true
        });
        this.registerChildComponent(assigneeInput);
        formContent.appendChild(assigneeContainer);

        // Priority select
        const priorityContainer = document.createElement('div');
        const prioritySelect = new XWUISelect(priorityContainer, {
            label: 'Priority',
            options: [
                { value: '', label: 'None' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
            ],
            value: card.priority || ''
        }, {
            fullWidth: true
        });
        this.registerChildComponent(prioritySelect);
        formContent.appendChild(priorityContainer);

        // Date picker
        const dateContainer = document.createElement('div');
        const datePicker = new XWUIDatePicker(dateContainer, {
            value: card.date ? (typeof card.date === 'string' ? card.date : card.date.toISOString().split('T')[0]) : undefined
        }, {
            placeholder: 'Select date'
        });
        this.registerChildComponent(datePicker);
        formContent.appendChild(dateContainer);

        // Tags input (simple text input for now, comma-separated)
        const tagsContainer = document.createElement('div');
        const tagsInput = new XWUIInput(tagsContainer, {
            label: 'Tags (comma-separated, use @tag:color format)',
            value: card.tags ? card.tags.join(', ') : '',
            placeholder: 'e.g., @setup:purple, @features:green'
        }, {
            fullWidth: true
        });
        this.registerChildComponent(tagsInput);
        formContent.appendChild(tagsContainer);

        // Footer with buttons
        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.gap = '0.75rem';
        footer.style.justifyContent = 'flex-end';
        footer.style.paddingTop = '1rem';

        const cancelBtnContainer = document.createElement('div');
        const cancelBtn = new XWUIButton(cancelBtnContainer, {
            label: 'Cancel'
        }, {
            variant: 'outline'
        });
        this.registerChildComponent(cancelBtn);
        cancelBtn.onClick(() => {
            this.editDialog?.close();
        });
        footer.appendChild(cancelBtnContainer);

        const saveBtnContainer = document.createElement('div');
        const saveBtn = new XWUIButton(saveBtnContainer, {
            label: 'Save'
        }, {
            variant: 'primary'
        });
        this.registerChildComponent(saveBtn);
        saveBtn.onClick(() => {
            this.saveCardChanges(
                card,
                columnId,
                titleInput,
                descTextarea,
                assigneeInput,
                prioritySelect,
                datePicker,
                tagsInput
            );
        });
        footer.appendChild(saveBtnContainer);

        this.editDialog.setContent(formContent);
        this.editDialog.onClose(() => {
            this.editingCard = null;
        });
        this.editDialog.open();
    }

    private saveCardChanges(
        card: KanbanCard,
        columnId: string,
        titleInput: XWUIInput,
        descTextarea: XWUITextarea,
        assigneeInput: XWUIInput,
        prioritySelect: XWUISelect,
        datePicker: XWUIDatePicker,
        tagsInput: XWUIInput
    ): void {
        // Get values from inputs using getValue methods
        const title = titleInput.getValue() || card.title;
        const description = descTextarea.getValue();
        const assignee = assigneeInput.getValue();
        const priorityValue = prioritySelect.getValue();
        const priority = priorityValue && typeof priorityValue === 'string' ? (priorityValue as 'high' | 'medium' | 'low') : undefined;
        const dateValue = datePicker.getValue();
        const tagsValue = tagsInput.getValue();

        // Update card
        card.title = title;
        card.description = description || undefined;
        card.assignee = assignee || undefined;
        card.priority = priority || undefined;
        card.date = dateValue ? dateValue : undefined;
        
        // Parse tags
        if (tagsValue.trim()) {
            card.tags = tagsValue.split(',').map(t => t.trim()).filter(t => t);
        } else {
            card.tags = undefined;
        }

        this.render();
        this.notifyChange();
        this.editDialog?.close();
    }

    private notifyChange(): void {
        this.changeHandlers.forEach(handler => handler([...this.data.columns]));
    }

    public addCard(columnId: string, card: KanbanCard): void {
        const column = this.data.columns.find(c => c.id === columnId);
        if (column) {
            column.cards.push(card);
            this.render();
            this.notifyChange();
        }
    }

    public onChange(handler: (columns: KanbanColumn[]) => void): void {
        this.changeHandlers.push(handler);
    }

    public getElement(): HTMLElement | null {
        return this.wrapperElement;
    }

    public addColumn(column: KanbanColumn): void {
        this.data.columns.push(column);
        this.render();
        this.notifyChange();
    }

    public removeColumn(columnId: string): void {
        const index = this.data.columns.findIndex(c => c.id === columnId);
        if (index !== -1) {
            this.data.columns.splice(index, 1);
            this.render();
            this.notifyChange();
        }
    }

    public destroy(): void {
        // All registered child components (buttons, dialogs, inputs, etc.) are automatically destroyed by base class
        if (this.wrapperElement) {
            this.wrapperElement.remove();
            this.wrapperElement = null;
        }
        this.boardContainer = null;
        this.editDialog = null;
        this.editingCard = null;
        this.draggingCard = null;
        this.changeHandlers = [];
        // Call parent to clean up registered child components
        super.destroy();
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUIKanbanBoard as any).componentName = 'XWUIKanbanBoard';


