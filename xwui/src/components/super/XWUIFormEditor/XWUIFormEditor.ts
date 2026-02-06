/**
 * XWUIFormEditor Component
 * Visual form builder with drag-and-drop support
 * Reuses existing XWUI input components
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';
import { XWUIInput } from '../XWUIInput/XWUIInput';
import { XWUITextarea } from '../XWUITextarea/XWUITextarea';
import { XWUISelect } from '../XWUISelect/XWUISelect';
import { XWUICheckbox } from '../XWUICheckbox/XWUICheckbox';
import { XWUIRadioGroup } from '../XWUIRadioGroup/XWUIRadioGroup';
import { XWUIDatePicker } from '../XWUIDatePicker/XWUIDatePicker';
import { XWUITimePicker } from '../XWUITimePicker/XWUITimePicker';
import { XWUIRating } from '../XWUIRating/XWUIRating';
import { XWUISignaturePad } from '../XWUISignaturePad/XWUISignaturePad';
import { XWUIUpload } from '../XWUIUpload/XWUIUpload';
import { XWUITabs } from '../XWUITabs/XWUITabs';
import { XWUIButton } from '../XWUIButton/XWUIButton';
import { XWUIDialog } from '../XWUIDialog/XWUIDialog';
import { XWUIMenuContext } from '../XWUIMenuContext/XWUIMenuContext';
import { XWUIScriptEditor } from '../XWUIScriptEditor/XWUIScriptEditor';

// --- TYPE DEFINITIONS ---

export type FormElementType = 
    // Basic Inputs
    | 'text' | 'textarea' | 'password' | 'email' | 'number' | 'phone' | 'url'
    // Selectors
    | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle'
    // Date & Time
    | 'date' | 'daterange' | 'time' | 'datetime'
    // Media & Graphics
    | 'file' | 'image' | 'signature' | 'color'
    // Advanced & Layout
    | 'richtext' | 'map_location_picker' | 'rating' | 'repeater' | 'title' | 'subtitle' | 'paragraph'
    // Data Entry Specializations
    | 'masked' | 'currency' | 'creditcard';

export interface BaseElement {
    id: string;
    type: FormElementType;
    subtitle?: string;
    description?: string;
    photo?: string;
    icon?: string;
}

export type FormElement = FormField | DisplayElement;

export interface DisplayElement extends BaseElement {
    type: 'title' | 'subtitle' | 'paragraph';
    content: string;
}

export interface FormField extends BaseElement {
    type: Exclude<FormElementType, 'title' | 'subtitle' | 'paragraph'>;
    label: string;
    placeholder?: string;
    options?: string[];
    mask?: string;
    validation?: {
        regex: string;
        message: string;
    };
}

export interface Column {
    id: string;
    width: 'full' | '1/2' | '1/3' | '2/3';
    element: FormElement;
}

export interface Row {
    id: string;
    columns: Column[];
    condition?: {
        fieldId: string;
        operator: 'equals' | 'notEquals';
        value: any;
    };
}

export interface Section {
    id: string;
    title: string;
    rows: Row[];
}

export interface ComponentDefinition {
    category: string;
    icon: string;
    defaultProps: Partial<FormField | DisplayElement>;
}

export interface FormSchema {
    [key in FormElementType]?: ComponentDefinition;
}

export interface FormDefinition {
    config: {
        uid: string;
        version: string;
        name: string;
    };
    schema: FormSchema;
    data: {
        sections: Section[];
    };
}

export interface SubmittedData {
    id: number;
    [key: string]: any;
}

// Component-level configuration
export interface XWUIFormEditorConfig {
    mode?: 'editor' | 'add' | 'view' | 'update';
    className?: string;
    showComponentPalette?: boolean;
    defaultFormDefinition?: FormDefinition;
}

// Data type
export interface XWUIFormEditorData {
    formDefinition?: FormDefinition;
    submittedData?: SubmittedData[];
    selectedRecord?: SubmittedData | null;
}

export class XWUIFormEditor extends XWUIComponent<XWUIFormEditorData, XWUIFormEditorConfig> {
    private wrapperElement: HTMLElement | null = null;
    private tabsInstance: XWUITabs | null = null;
    private componentPaletteElement: HTMLElement | null = null;
    private formRendererElement: HTMLElement | null = null;
    private isDragging: boolean = false;
    private draggingElementType: FormElementType | null = null;
    private activeTab: string = 'EDITOR';
    private contextMenuInstance: XWUIMenuContext | null = null;
    private editDialogInstance: XWUIDialog | null = null;
    private editingElement: FormElement | null = null;
    private formDefinition: FormDefinition;
    private submittedData: SubmittedData[] = [];
    private selectedRecord: SubmittedData | null = null;
    private formJsonEditor: XWUIScriptEditor | null = null;
    private formDataJsonEditor: XWUIScriptEditor | null = null;

    // Default schema - comprehensive list of all available form components
    private readonly defaultSchema: FormSchema = {
        // Layout Elements
        'title': { 
            category: 'Layout', 
            icon: 'title', 
            defaultProps: { type: 'title', content: 'New Title' } 
        },
        'subtitle': { 
            category: 'Layout', 
            icon: 'subtitle', 
            defaultProps: { type: 'subtitle', content: 'New Subtitle' } 
        },
        'paragraph': { 
            category: 'Layout', 
            icon: 'paragraph', 
            defaultProps: { type: 'paragraph', content: 'New paragraph text.' } 
        },
        // Basic Inputs
        'text': { 
            category: 'Basic Inputs', 
            icon: 'text', 
            defaultProps: { type: 'text', label: 'Text Field', placeholder: 'Enter text' } 
        },
        'email': { 
            category: 'Basic Inputs', 
            icon: 'email', 
            defaultProps: { type: 'email', label: 'Email', placeholder: 'email@example.com' } 
        },
        'password': { 
            category: 'Basic Inputs', 
            icon: 'password', 
            defaultProps: { type: 'password', label: 'Password', placeholder: 'Enter password' } 
        },
        'number': { 
            category: 'Basic Inputs', 
            icon: 'number', 
            defaultProps: { type: 'number', label: 'Number', placeholder: '0' } 
        },
        'textarea': { 
            category: 'Basic Inputs', 
            icon: 'textarea', 
            defaultProps: { type: 'textarea', label: 'Text Area', placeholder: 'Enter text...' } 
        },
        'url': { 
            category: 'Basic Inputs', 
            icon: 'url', 
            defaultProps: { type: 'url', label: 'URL', placeholder: 'https://example.com' } 
        },
        // Selectors
        'select': { 
            category: 'Selectors', 
            icon: 'select', 
            defaultProps: { type: 'select', label: 'Select', options: ['Option 1', 'Option 2', 'Option 3'] } 
        },
        'multiselect': { 
            category: 'Selectors', 
            icon: 'select', 
            defaultProps: { type: 'multiselect', label: 'Multi Select', options: ['Option 1', 'Option 2', 'Option 3'] } 
        },
        'checkbox': { 
            category: 'Selectors', 
            icon: 'checkbox', 
            defaultProps: { type: 'checkbox', label: 'Checkbox' } 
        },
        'radio': { 
            category: 'Selectors', 
            icon: 'radio', 
            defaultProps: { type: 'radio', label: 'Radio Group', options: ['Option 1', 'Option 2', 'Option 3'] } 
        },
        'toggle': { 
            category: 'Selectors', 
            icon: 'toggle', 
            defaultProps: { type: 'toggle', label: 'Toggle' } 
        },
        // Date & Time
        'date': { 
            category: 'Date & Time', 
            icon: 'date', 
            defaultProps: { type: 'date', label: 'Date' } 
        },
        'datetime': { 
            category: 'Date & Time', 
            icon: 'datetime', 
            defaultProps: { type: 'datetime', label: 'Date & Time' } 
        },
        'daterange': { 
            category: 'Date & Time', 
            icon: 'date', 
            defaultProps: { type: 'daterange', label: 'Date Range' } 
        },
        'time': { 
            category: 'Date & Time', 
            icon: 'time', 
            defaultProps: { type: 'time', label: 'Time' } 
        },
        // Data Entry
        'phone': { 
            category: 'Data Entry', 
            icon: 'phone', 
            defaultProps: { type: 'phone', label: 'Phone Number', placeholder: '(555) 555-5555' } 
        },
        'creditcard': { 
            category: 'Data Entry', 
            icon: 'creditcard', 
            defaultProps: { type: 'creditcard', label: 'Credit Card', placeholder: '0000 0000 0000 0000' } 
        },
        'currency': { 
            category: 'Data Entry', 
            icon: 'number', 
            defaultProps: { type: 'currency', label: 'Currency', placeholder: '0.00' } 
        },
        'masked': { 
            category: 'Data Entry', 
            icon: 'text', 
            defaultProps: { type: 'masked', label: 'Masked Input', placeholder: '___-___-____' } 
        },
        // Media & Graphics
        'file': { 
            category: 'Media & Graphics', 
            icon: 'file', 
            defaultProps: { type: 'file', label: 'File Upload' } 
        },
        'image': { 
            category: 'Media & Graphics', 
            icon: 'file', 
            defaultProps: { type: 'image', label: 'Image Upload' } 
        },
        'signature': { 
            category: 'Media & Graphics', 
            icon: 'signature', 
            defaultProps: { type: 'signature', label: 'Signature' } 
        },
        'color': { 
            category: 'Media & Graphics', 
            icon: 'color', 
            defaultProps: { type: 'color', label: 'Color Picker' } 
        },
        // Advanced
        'richtext': { 
            category: 'Advanced', 
            icon: 'richtext', 
            defaultProps: { type: 'richtext', label: 'Rich Text Editor' } 
        },
        'map_location_picker': { 
            category: 'Advanced', 
            icon: 'map', 
            defaultProps: { type: 'map_location_picker', label: 'Location' } 
        },
        'rating': { 
            category: 'Advanced', 
            icon: 'rating', 
            defaultProps: { type: 'rating', label: 'Rating' } 
        },
        'repeater': { 
            category: 'Advanced', 
            icon: 'repeater', 
            defaultProps: { type: 'repeater', label: 'Repeater Field' } 
        },
    };

    constructor(
        container: HTMLElement,
        data: XWUIFormEditorData = {},
        conf_comp: XWUIFormEditorConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        
        // Initialize form definition
        this.formDefinition = this.data.formDefinition || this.createDefaultFormDefinition();
        this.submittedData = this.data.submittedData || [];
        this.selectedRecord = this.data.selectedRecord || null;
        
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUIFormEditorConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUIFormEditorConfig {
        return {
            mode: conf_comp?.mode ?? 'editor',
            className: conf_comp?.className,
            showComponentPalette: conf_comp?.showComponentPalette ?? true,
            defaultFormDefinition: conf_comp?.defaultFormDefinition
        };
    }

    private createDefaultFormDefinition(): FormDefinition {
        return {
            config: {
                uid: `form-${Date.now()}`,
                version: '1.0.0',
                name: 'New Form'
            },
            schema: { ...this.defaultSchema }, // Copy default schema
            data: {
                sections: [
                    {
                        id: 'section-1',
                        title: 'Section 1',
                        rows: []
                    }
                ]
            }
        };
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-form-editor';

        // Create main wrapper
        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-form-editor-wrapper';
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Create tabs
        this.createTabs();

        // Create tab content
        this.createTabContent();

        this.container.appendChild(this.wrapperElement);
    }

    private createTabs(): void {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'xwui-form-editor-tabs-container';

        const tabsData = {
            tabs: [
                { id: 'EDITOR', label: 'Editor' },
                { id: 'FORM_JSON', label: 'Form JSON' },
                { id: 'ADD', label: 'Add' },
                { id: 'LIST', label: 'List' },
                { id: 'VIEW', label: 'View' },
                { id: 'UPDATE', label: 'Update' },
                { id: 'FORM_DATA_JSON', label: 'Form Data JSON' }
            ],
            activeTab: this.activeTab
        };

        this.tabsInstance = new XWUITabs(tabsContainer, tabsData, {
            variant: 'line',
            size: 'medium',
            fullWidth: false,
            centered: false
        });
        this.registerChildComponent(this.tabsInstance);

        this.tabsInstance.onChange((tabId: string) => {
            this.activeTab = tabId;
            this.renderTabContent();
        });

        this.wrapperElement!.appendChild(tabsContainer);
    }

    private createTabContent(): void {
        const contentContainer = document.createElement('div');
        contentContainer.className = 'xwui-form-editor-content';
        contentContainer.id = 'xwui-form-editor-content';
        this.wrapperElement!.appendChild(contentContainer);
        this.renderTabContent();
    }

    private renderTabContent(): void {
        const contentContainer = document.getElementById('xwui-form-editor-content');
        if (!contentContainer) return;

        // Update tabs active state
        if (this.tabsInstance) {
            this.tabsInstance.setActiveTab(this.activeTab);
        }

        contentContainer.innerHTML = '';

        switch (this.activeTab) {
            case 'EDITOR':
                this.renderEditor();
                break;
            case 'FORM_JSON':
                this.renderFormJSON();
                break;
            case 'ADD':
                this.renderForm('add');
                break;
            case 'LIST':
                this.renderList();
                break;
            case 'VIEW':
                this.renderForm('view');
                break;
            case 'UPDATE':
                this.renderForm('update');
                break;
            case 'FORM_DATA_JSON':
                this.renderFormDataJSON();
                break;
        }
    }

    private renderEditor(): void {
        const contentContainer = document.getElementById('xwui-form-editor-content');
        if (!contentContainer) return;

        const editorWrapper = document.createElement('div');
        editorWrapper.className = 'xwui-form-editor-editor-wrapper';

        // Component palette
        if (this.config.showComponentPalette) {
            this.renderComponentPalette(editorWrapper);
        }

        // Form renderer
        this.renderFormRenderer(editorWrapper);

        contentContainer.appendChild(editorWrapper);
    }

    private renderComponentPalette(parent: HTMLElement): void {
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'xwui-form-editor-palette';
        paletteContainer.id = 'xwui-form-editor-palette';

        const paletteHeader = document.createElement('div');
        paletteHeader.className = 'xwui-form-editor-palette-header';
        paletteHeader.innerHTML = `
            <h3>Components</h3>
            <input type="text" placeholder="Search..." class="xwui-form-editor-palette-search" id="palette-search">
        `;

        const paletteContent = document.createElement('div');
        paletteContent.className = 'xwui-form-editor-palette-content';

        // Group components by category
        const grouped = this.groupComponentsByCategory();
        
        Object.entries(grouped).forEach(([category, components]) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'xwui-form-editor-palette-category';
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'xwui-form-editor-palette-category-header';
            categoryHeader.textContent = category;
            categoryDiv.appendChild(categoryHeader);

            components.forEach(comp => {
                const compItem = document.createElement('div');
                compItem.className = 'xwui-form-editor-palette-item';
                compItem.draggable = true;
                compItem.setAttribute('data-element-type', comp.type);
                compItem.innerHTML = `
                    <span class="xwui-form-editor-palette-icon">${this.getIconHTML(comp.icon)}</span>
                    <span class="xwui-form-editor-palette-label">${comp.name}</span>
                `;

                compItem.addEventListener('dragstart', (e) => {
                    this.handlePaletteDragStart(e, comp.type);
                });

                compItem.addEventListener('dragend', () => {
                    this.handlePaletteDragEnd();
                });

                categoryDiv.appendChild(compItem);
            });

            paletteContent.appendChild(categoryDiv);
        });

        paletteContainer.appendChild(paletteHeader);
        paletteContainer.appendChild(paletteContent);
        parent.appendChild(paletteContainer);

        // Search functionality
        const searchInput = document.getElementById('palette-search') as HTMLInputElement;
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
                this.filterPalette(searchTerm);
            });
        }

        this.componentPaletteElement = paletteContainer;
    }

    private groupComponentsByCategory(): Record<string, Array<{ type: FormElementType; name: string; icon: string }>> {
        const grouped: Record<string, Array<{ type: FormElementType; name: string; icon: string }>> = {};

        // Use defaultSchema if formDefinition.schema is empty
        const schemaToUse = Object.keys(this.formDefinition.schema).length > 0 
            ? this.formDefinition.schema 
            : this.defaultSchema;

        Object.entries(schemaToUse).forEach(([type, def]) => {
            if (!def) return;
            const category = def.category || 'Other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            // Get a user-friendly name
            let name = type;
            if ('label' in def.defaultProps && def.defaultProps.label) {
                name = def.defaultProps.label as string;
            } else if ('content' in def.defaultProps && def.defaultProps.content) {
                name = def.defaultProps.content as string;
            } else {
                // Convert type to readable name (e.g., "multiselect" -> "Multi Select")
                name = type
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/_/g, ' ')
                    .trim();
            }
            grouped[category].push({ type: type as FormElementType, name, icon: def.icon });
        });

        return grouped;
    }

    private getIconHTML(iconName: string): string {
        // Comprehensive icon mapping for all form components
        const iconMap: Record<string, string> = {
            // Layout
            'title': '📄',
            'subtitle': '📑',
            'paragraph': '📝',
            // Basic Inputs
            'text': '📝',
            'email': '✉️',
            'password': '🔒',
            'number': '🔢',
            'textarea': '📄',
            'url': '🔗',
            // Selectors
            'select': '📋',
            'checkbox': '☑️',
            'radio': '🔘',
            'toggle': '🔄',
            // Date & Time
            'date': '📅',
            'datetime': '📅⏰',
            'daterange': '📅📅',
            'time': '⏰',
            // Data Entry
            'phone': '📞',
            'creditcard': '💳',
            'currency': '💰',
            'masked': '🔐',
            // Media & Graphics
            'file': '📁',
            'image': '🖼️',
            'signature': '✍️',
            'color': '🎨',
            // Advanced
            'richtext': '📝',
            'map': '📍',
            'map_location_picker': '📍',
            'rating': '⭐',
            'repeater': '🔄'
        };
        return iconMap[iconName] || '📦';
    }

    private filterPalette(searchTerm: string): void {
        const items = this.componentPaletteElement?.querySelectorAll('.xwui-form-editor-palette-item');
        items?.forEach(item => {
            const label = item.querySelector('.xwui-form-editor-palette-label')?.textContent?.toLowerCase() || '';
            const category = item.closest('.xwui-form-editor-palette-category')?.querySelector('.xwui-form-editor-palette-category-header')?.textContent?.toLowerCase() || '';
            const matches = label.includes(searchTerm) || category.includes(searchTerm);
            (item as HTMLElement).style.display = matches ? '' : 'none';
        });
    }

    private handlePaletteDragStart(e: DragEvent, elementType: FormElementType): void {
        this.isDragging = true;
        this.draggingElementType = elementType;
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'copy';
            e.dataTransfer.setData('application/x-xforms-element-type', elementType);
            // Also set as text for better compatibility
            e.dataTransfer.setData('text/plain', elementType);
        }
        // Show all drop zones with subtle visibility
        setTimeout(() => {
            document.querySelectorAll('.xwui-form-editor-dropzone').forEach(dz => {
                (dz as HTMLElement).style.opacity = '0.5';
                (dz as HTMLElement).style.borderColor = 'var(--border-color, #dee2e6)';
            });
        }, 10);
    }

    private handlePaletteDragEnd(): void {
        this.isDragging = false;
        this.draggingElementType = null;
        // Hide all drop zones
        document.querySelectorAll('.xwui-form-editor-dropzone').forEach(dz => {
            (dz as HTMLElement).style.opacity = '0';
            (dz as HTMLElement).style.borderColor = 'transparent';
            dz.classList.remove('xwui-form-editor-dropzone-active');
        });
        // Also remove dragging class from sections
        document.querySelectorAll('.xwui-form-editor-sections').forEach(section => {
            section.classList.remove('xwui-form-editor-sections-dragging');
        });
    }

    private renderFormRenderer(parent: HTMLElement): void {
        const rendererContainer = document.createElement('div');
        rendererContainer.className = 'xwui-form-editor-renderer';
        rendererContainer.id = 'xwui-form-editor-renderer';

        this.renderFormDefinition(rendererContainer, 'edit');

        parent.appendChild(rendererContainer);
        this.formRendererElement = rendererContainer;
    }

    private renderFormDefinition(container: HTMLElement, mode: 'add' | 'view' | 'update' | 'edit'): void {
        container.innerHTML = '';

        const formWrapper = document.createElement('div');
        formWrapper.className = 'xwui-form-editor-form-wrapper';

        // Form header
        const formHeader = document.createElement('div');
        formHeader.className = 'xwui-form-editor-form-header';
        formHeader.innerHTML = `
            <h2>${this.formDefinition.config.name}</h2>
            <p>Mode: ${mode.toUpperCase()}</p>
        `;
        formWrapper.appendChild(formHeader);

        // Sections
        const sectionsContainer = document.createElement('div');
        sectionsContainer.className = 'xwui-form-editor-sections';
        
        // Make sections container a drop target (edit mode)
        if (mode === 'edit') {
            sectionsContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.isDragging) {
                    sectionsContainer.classList.add('xwui-form-editor-sections-dragging');
                }
            });
            sectionsContainer.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sectionsContainer.classList.remove('xwui-form-editor-sections-dragging');
            });
            sectionsContainer.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sectionsContainer.classList.remove('xwui-form-editor-sections-dragging');
                const elementType = (e.dataTransfer?.getData('application/x-xforms-element-type') || this.draggingElementType) as FormElementType;
                if (elementType && this.formDefinition.data.sections.length > 0) {
                    // Add to first section
                    const firstSection = this.formDefinition.data.sections[0];
                    const newElement = this.createNewElement(elementType);
                    const newRow: Row = {
                        id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        columns: [{
                            id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                            width: 'full',
                            element: newElement
                        }]
                    };
                    firstSection.rows.push(newRow);
                    this.renderTabContent();
                }
                this.isDragging = false;
                this.draggingElementType = null;
            });
        }

        this.formDefinition.data.sections.forEach(section => {
            const sectionElement = this.renderSection(section, mode);
            sectionsContainer.appendChild(sectionElement);
        });

        formWrapper.appendChild(sectionsContainer);
        container.appendChild(formWrapper);
    }

    private renderSection(section: Section, mode: 'add' | 'view' | 'update' | 'edit'): HTMLElement {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'xwui-form-editor-section';
        sectionDiv.setAttribute('data-section-id', section.id);

        // Section header with tabs
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'xwui-form-editor-section-header';
        sectionHeader.textContent = section.title;
        sectionDiv.appendChild(sectionHeader);

        // Rows
        const rowsContainer = document.createElement('div');
        rowsContainer.className = 'xwui-form-editor-rows';

        section.rows.forEach((row, rowIndex) => {
            const rowElement = this.renderRow(row, section.id, rowIndex, mode);
            rowsContainer.appendChild(rowElement);
        });

        sectionDiv.appendChild(rowsContainer);

        // Drop zone for new rows (edit mode) - make it always visible when dragging
        if (mode === 'edit') {
            const dropZone = this.createDropZone(section.id, section.rows.length);
            rowsContainer.appendChild(dropZone);
        }

        return sectionDiv;
    }

    private renderRow(row: Row, sectionId: string, rowIndex: number, mode: 'add' | 'view' | 'update' | 'edit'): HTMLElement {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'xwui-form-editor-row';
        rowDiv.setAttribute('data-row-id', row.id);
        rowDiv.setAttribute('data-section-id', sectionId);

        // Drop zone before row (edit mode)
        if (mode === 'edit') {
            const dropZone = this.createDropZone(sectionId, rowIndex);
            rowDiv.appendChild(dropZone);
        }

        // Columns
        const columnsContainer = document.createElement('div');
        columnsContainer.className = 'xwui-form-editor-columns';

        row.columns.forEach(col => {
            const colElement = this.renderColumn(col, row.id, mode);
            columnsContainer.appendChild(colElement);
        });

        rowDiv.appendChild(columnsContainer);

        return rowDiv;
    }

    private renderColumn(col: Column, rowId: string, mode: 'add' | 'view' | 'update' | 'edit'): HTMLElement {
        const colDiv = document.createElement('div');
        colDiv.className = `xwui-form-editor-column xwui-form-editor-column-${col.width}`;
        colDiv.setAttribute('data-column-id', col.id);

        // Element wrapper
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'xwui-form-editor-element-wrapper';
        elementWrapper.setAttribute('data-element-id', col.element.id);

        if (mode === 'edit') {
            elementWrapper.classList.add('xwui-form-editor-element-editable');
            this.setupElementEditHandlers(elementWrapper, col.element);
        }

        // Render element based on type
        this.renderFormElement(elementWrapper, col.element, mode);

        colDiv.appendChild(elementWrapper);
        return colDiv;
    }

    private renderFormElement(container: HTMLElement, element: FormElement, mode: 'add' | 'view' | 'update' | 'edit'): void {
        const isReadOnly = mode === 'view';

        if (element.type === 'title' || element.type === 'subtitle' || element.type === 'paragraph') {
            const displayEl = element as DisplayElement;
            const tag = element.type === 'title' ? 'h1' : element.type === 'subtitle' ? 'h2' : 'p';
            const el = document.createElement(tag);
            el.className = `xwui-form-editor-display-${element.type}`;
            el.textContent = displayEl.content;
            container.appendChild(el);
            return;
        }

        const field = element as FormField;
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'xwui-form-editor-field';

        // Label
        if (field.label) {
            const label = document.createElement('label');
            label.className = 'xwui-form-editor-field-label';
            label.textContent = field.label;
            fieldContainer.appendChild(label);
        }

        // Input component container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'xwui-form-editor-field-input';

        // Create appropriate input component
        this.createInputComponent(inputContainer, field, isReadOnly);

        fieldContainer.appendChild(inputContainer);

        // Description
        if (field.description) {
            const desc = document.createElement('p');
            desc.className = 'xwui-form-editor-field-description';
            desc.textContent = field.description;
            fieldContainer.appendChild(desc);
        }

        container.appendChild(fieldContainer);
    }

    private createInputComponent(container: HTMLElement, field: FormField, isReadOnly: boolean): void {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'phone':
            case 'url':
            case 'creditcard':
            case 'masked':
            case 'currency':
                new XWUIInput(container, {
                    value: '',
                    placeholder: field.placeholder,
                    label: '',
                    name: field.id
                }, {
                    type: field.type === 'email' ? 'email' : 
                         field.type === 'password' ? 'password' : 
                         field.type === 'number' ? 'number' : 'text',
                    disabled: isReadOnly,
                    readonly: isReadOnly,
                    fullWidth: true
                });
                break;

            case 'number':
                new XWUIInput(container, {
                    value: '',
                    placeholder: field.placeholder,
                    label: '',
                    name: field.id
                }, {
                    type: 'number',
                    disabled: isReadOnly,
                    readonly: isReadOnly,
                    fullWidth: true
                });
                break;

            case 'textarea':
            case 'richtext':
                new XWUITextarea(container, {
                    value: '',
                    placeholder: field.placeholder,
                    label: '',
                    name: field.id
                }, {
                    disabled: isReadOnly,
                    readonly: isReadOnly,
                    fullWidth: true
                });
                break;

            case 'select':
            case 'multiselect':
                new XWUISelect(container, {
                    options: (field.options || []).map(opt => ({ value: opt, label: opt })),
                    value: '',
                    placeholder: field.placeholder,
                    label: '',
                    name: field.id
                }, {
                    multiple: field.type === 'multiselect',
                    disabled: isReadOnly,
                    fullWidth: true
                });
                break;

            case 'checkbox':
            case 'toggle':
                new XWUICheckbox(container, {
                    checked: false,
                    label: '',
                    name: field.id
                }, {
                    disabled: isReadOnly
                });
                break;

            case 'radio':
                new XWUIRadioGroup(container, {
                    options: (field.options || []).map(opt => ({ value: opt, label: opt })),
                    value: '',
                    name: field.id
                }, {
                    disabled: isReadOnly
                });
                break;

            case 'date':
            case 'datetime':
                new XWUIDatePicker(container, {
                    value: undefined
                }, {
                    placeholder: field.placeholder
                });
                break;

            case 'time':
                new XWUITimePicker(container, {
                    value: undefined
                }, {
                    placeholder: field.placeholder
                });
                break;

            case 'rating':
                new XWUIRating(container, {
                    value: 0,
                    label: ''
                }, {
                    readonly: isReadOnly,
                    disabled: isReadOnly
                });
                break;

            case 'signature':
                new XWUISignaturePad(container, {
                    imageData: undefined
                }, {});
                break;

            case 'file':
            case 'image':
                new XWUIUpload(container, {
                    files: [],
                    label: ''
                }, {
                    multiple: false,
                    dragDrop: true
                });
                break;

            default:
                // Fallback to text input
                new XWUIInput(container, {
                    value: '',
                    placeholder: field.placeholder,
                    label: '',
                    name: field.id
                }, {
                    type: 'text',
                    disabled: isReadOnly,
                    readonly: isReadOnly,
                    fullWidth: true
                });
        }
    }

    private createDropZone(sectionId: string, rowIndex: number): HTMLElement {
        const dropZone = document.createElement('div');
        dropZone.className = 'xwui-form-editor-dropzone';
        dropZone.setAttribute('data-section-id', sectionId);
        dropZone.setAttribute('data-row-index', rowIndex.toString());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const elementType = e.dataTransfer?.getData('application/x-xforms-element-type') || 
                               (e.dataTransfer?.effectAllowed === 'copy' ? this.draggingElementType : null);
            if (elementType || this.isDragging) {
                dropZone.classList.add('xwui-form-editor-dropzone-active');
            }
        });

        dropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only remove active class if we're actually leaving the dropzone
            const rect = dropZone.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                dropZone.classList.remove('xwui-form-editor-dropzone-active');
            }
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('xwui-form-editor-dropzone-active');
            this.handleDrop(e, sectionId, rowIndex);
        });

        return dropZone;
    }

    private handleDrop(e: DragEvent, sectionId: string, rowIndex: number): void {
        const elementType = (e.dataTransfer?.getData('application/x-xforms-element-type') || this.draggingElementType) as FormElementType;
        if (!elementType) return;

        const newElement = this.createNewElement(elementType);
        const newRow: Row = {
            id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            columns: [{
                id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                width: 'full',
                element: newElement
            }]
        };

        const section = this.formDefinition.data.sections.find(s => s.id === sectionId);
        if (section) {
            section.rows.splice(rowIndex, 0, newRow);
            this.renderTabContent();
        }
        
        // Reset dragging state
        this.isDragging = false;
        this.draggingElementType = null;
    }

    private createNewElement(type: FormElementType): FormElement {
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const id = `${type}-${Date.now()}-${randomSuffix}`;
        const definition = this.formDefinition.schema[type];

        if (!definition) {
            throw new Error(`No schema definition for type: ${type}`);
        }

        const baseElement = {
            id,
            type,
            ...definition.defaultProps
        };

        return baseElement as FormElement;
    }

    private setupElementEditHandlers(elementWrapper: HTMLElement, element: FormElement): void {
        // Context menu
        elementWrapper.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e, element);
        });

        // Double click to edit
        elementWrapper.addEventListener('dblclick', () => {
            this.showEditDialog(element);
        });
    }

    private showContextMenu(e: MouseEvent, element: FormElement): void {
        e.preventDefault();
        e.stopPropagation();

        // Remove existing context menu
        const existingMenu = document.querySelector('.xwui-form-editor-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Create context menu
        const menu = document.createElement('div');
        menu.className = 'xwui-form-editor-context-menu';
        menu.style.position = 'fixed';
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.style.zIndex = '10000';

        menu.innerHTML = `
            <div class="xwui-form-editor-context-menu-item" data-action="edit">Edit</div>
            <div class="xwui-form-editor-context-menu-item" data-action="delete">Delete</div>
            <div class="xwui-form-editor-context-menu-item" data-action="duplicate">Duplicate</div>
        `;

        document.body.appendChild(menu);

        // Handle menu clicks
        menu.querySelectorAll('.xwui-form-editor-context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = (item as HTMLElement).getAttribute('data-action');
                this.handleContextMenuAction(action || '', element);
                menu.remove();
            });
        });

        // Close on outside click
        const closeHandler = (e: MouseEvent) => {
            if (!menu.contains(e.target as Node)) {
                menu.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
        }, 0);
    }

    private handleContextMenuAction(action: string, element: FormElement): void {
        switch (action) {
            case 'edit':
                this.showEditDialog(element);
                break;
            case 'delete':
                this.deleteElement(element.id);
                break;
            case 'duplicate':
                this.duplicateElement(element);
                break;
        }
    }

    private showEditDialog(element: FormElement): void {
        this.editingElement = element;

        // Remove existing dialog
        const existingDialog = document.querySelector('.xwui-form-editor-edit-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create dialog overlay
        const overlay = document.createElement('div');
        overlay.className = 'xwui-form-editor-edit-dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '10000';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'xwui-form-editor-edit-dialog';
        dialog.style.backgroundColor = 'var(--bg-primary, #ffffff)';
        dialog.style.borderRadius = 'var(--radius-md, 8px)';
        dialog.style.padding = 'var(--spacing-lg, 1.5rem)';
        dialog.style.maxWidth = '500px';
        dialog.style.width = '90%';
        dialog.style.maxHeight = '80vh';
        dialog.style.overflow = 'auto';

        const mainLabel = 'label' in element ? 'label' : 'content';
        const currentValue = (element as any)[mainLabel] || '';

        dialog.innerHTML = `
            <h3 style="margin: 0 0 var(--spacing-md, 1rem) 0;">Edit Element</h3>
            <div style="margin-bottom: var(--spacing-md, 1rem);">
                <label style="display: block; margin-bottom: var(--spacing-xs, 0.25rem); font-weight: 500;">Type</label>
                <select id="edit-element-type" style="width: 100%; padding: var(--spacing-sm, 0.5rem); border: 1px solid var(--border-color, #e0e0e0); border-radius: var(--radius-sm, 4px);">
                    ${Object.keys(this.formDefinition.schema).map(type => 
                        `<option value="${type}" ${type === element.type ? 'selected' : ''}>${type}</option>`
                    ).join('')}
                </select>
            </div>
            <div style="margin-bottom: var(--spacing-md, 1rem);">
                <label style="display: block; margin-bottom: var(--spacing-xs, 0.25rem); font-weight: 500;">${mainLabel === 'label' ? 'Label' : 'Content'}</label>
                <input type="text" id="edit-element-label" value="${currentValue}" style="width: 100%; padding: var(--spacing-sm, 0.5rem); border: 1px solid var(--border-color, #e0e0e0); border-radius: var(--radius-sm, 4px);">
            </div>
            <div style="margin-bottom: var(--spacing-md, 1rem);">
                <label style="display: block; margin-bottom: var(--spacing-xs, 0.25rem); font-weight: 500;">Subtitle</label>
                <input type="text" id="edit-element-subtitle" value="${element.subtitle || ''}" style="width: 100%; padding: var(--spacing-sm, 0.5rem); border: 1px solid var(--border-color, #e0e0e0); border-radius: var(--radius-sm, 4px);">
            </div>
            <div style="margin-bottom: var(--spacing-md, 1rem);">
                <label style="display: block; margin-bottom: var(--spacing-xs, 0.25rem); font-weight: 500;">Description</label>
                <textarea id="edit-element-description" style="width: 100%; padding: var(--spacing-sm, 0.5rem); border: 1px solid var(--border-color, #e0e0e0); border-radius: var(--radius-sm, 4px); min-height: 80px;">${element.description || ''}</textarea>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: var(--spacing-sm, 0.5rem);">
                <button id="edit-dialog-cancel" style="padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem); border: 1px solid var(--border-color, #e0e0e0); border-radius: var(--radius-sm, 4px); background: var(--bg-secondary, #f5f5f5); cursor: pointer;">Cancel</button>
                <button id="edit-dialog-save" style="padding: var(--spacing-sm, 0.5rem) var(--spacing-md, 1rem); border: none; border-radius: var(--radius-sm, 4px); background: var(--accent-primary, #0078d4); color: var(--text-on-accent, #ffffff); cursor: pointer;">Save</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Handle type change
        const typeSelect = dialog.querySelector('#edit-element-type') as HTMLSelectElement;
        typeSelect.addEventListener('change', () => {
            const newType = typeSelect.value as FormElementType;
            this.handleElementTypeChange(newType, element);
        });

        // Handle save
        const saveBtn = dialog.querySelector('#edit-dialog-save') as HTMLElement;
        saveBtn.addEventListener('click', () => {
            const labelInput = dialog.querySelector('#edit-element-label') as HTMLInputElement;
            const subtitleInput = dialog.querySelector('#edit-element-subtitle') as HTMLInputElement;
            const descriptionInput = dialog.querySelector('#edit-element-description') as HTMLTextAreaElement;

            const updatedElement = { ...element };
            if (mainLabel === 'label') {
                (updatedElement as FormField).label = labelInput.value;
            } else {
                (updatedElement as DisplayElement).content = labelInput.value;
            }
            updatedElement.subtitle = subtitleInput.value;
            updatedElement.description = descriptionInput.value;

            this.updateElement(updatedElement);
            overlay.remove();
        });

        // Handle cancel
        const cancelBtn = dialog.querySelector('#edit-dialog-cancel') as HTMLElement;
        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    private handleElementTypeChange(newType: FormElementType, oldElement: FormElement): void {
        const newElementDefaults = this.formDefinition.schema[newType]?.defaultProps || {};
        const preservedProps = {
            id: oldElement.id,
            subtitle: oldElement.subtitle,
            description: oldElement.description,
            photo: oldElement.photo,
        };

        let newElement: FormElement = {
            ...newElementDefaults,
            ...preservedProps,
            type: newType,
        } as FormElement;

        if ('label' in newElement && 'label' in oldElement) {
            newElement.label = oldElement.label;
        } else if ('content' in newElement && 'content' in oldElement) {
            newElement.content = oldElement.content;
        } else if ('label' in newElement && 'content' in oldElement) {
            newElement.label = oldElement.content;
        } else if ('content' in newElement && 'label' in oldElement) {
            newElement.content = oldElement.label;
        }

        this.updateElement(newElement);
    }

    private updateElement(element: FormElement): void {
        // Find and update element in form definition
        this.formDefinition.data.sections.forEach(section => {
            section.rows.forEach(row => {
                row.columns.forEach(col => {
                    if (col.element.id === element.id) {
                        col.element = element;
                    }
                });
            });
        });

        this.renderTabContent();
    }

    private deleteElement(elementId: string): void {
        this.formDefinition.data.sections.forEach(section => {
            section.rows = section.rows.filter(row => 
                row.columns.every(col => col.element.id !== elementId)
            );
        });

        this.renderTabContent();
    }

    private duplicateElement(element: FormElement): void {
        const newElement = { ...element };
        newElement.id = `${element.type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Find the section and row containing this element and add after it
        this.formDefinition.data.sections.forEach(section => {
            section.rows.forEach(row => {
                const colIndex = row.columns.findIndex(col => col.element.id === element.id);
                if (colIndex !== -1) {
                    const newCol: Column = {
                        id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                        width: row.columns[colIndex].width,
                        element: newElement
                    };
                    row.columns.splice(colIndex + 1, 0, newCol);
                }
            });
        });

        this.renderTabContent();
    }

    private renderForm(mode: 'add' | 'view' | 'update'): void {
        const contentContainer = document.getElementById('xwui-form-editor-content');
        if (!contentContainer) return;

        const formContainer = document.createElement('div');
        formContainer.className = 'xwui-form-editor-form-container';

        this.renderFormDefinition(formContainer, mode);

        // Submit button for add/update modes
        if (mode !== 'view') {
            const submitButton = document.createElement('button');
            submitButton.className = 'xwui-form-editor-submit-button';
            submitButton.textContent = mode === 'add' ? 'Submit' : 'Update';
            submitButton.addEventListener('click', () => {
                this.handleFormSubmit(mode);
            });
            formContainer.appendChild(submitButton);
        }

        contentContainer.appendChild(formContainer);
    }

    private handleFormSubmit(mode: 'add' | 'update'): void {
        // Collect form data and handle submission
        const formData: Record<string, any> = {};
        // Implementation to collect data from all input components
        console.log('Form submitted:', formData);
    }

    private renderList(): void {
        const contentContainer = document.getElementById('xwui-form-editor-content');
        if (!contentContainer) return;

        const listContainer = document.createElement('div');
        listContainer.className = 'xwui-form-editor-list';

        const table = document.createElement('table');
        table.className = 'xwui-form-editor-list-table';

        // Table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement('tbody');
        this.submittedData.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.id}</td>
                <td>${JSON.stringify(record)}</td>
                <td>
                    <button class="xwui-form-editor-action-btn" data-action="view" data-id="${record.id}">View</button>
                    <button class="xwui-form-editor-action-btn" data-action="update" data-id="${record.id}">Update</button>
                    <button class="xwui-form-editor-action-btn" data-action="delete" data-id="${record.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        listContainer.appendChild(table);
        contentContainer.appendChild(listContainer);

        // Action handlers
        listContainer.querySelectorAll('.xwui-form-editor-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const action = target.getAttribute('data-action');
                const id = parseInt(target.getAttribute('data-id') || '0');
                this.handleListAction(action || '', id);
            });
        });
    }

    private handleListAction(action: string, id: number): void {
        const record = this.submittedData.find(r => r.id === id);
        if (!record) return;

        switch (action) {
            case 'view':
                this.selectedRecord = record;
                this.activeTab = 'VIEW';
                this.renderTabContent();
                break;
            case 'update':
                this.selectedRecord = record;
                this.activeTab = 'UPDATE';
                this.renderTabContent();
                break;
            case 'delete':
                this.submittedData = this.submittedData.filter(r => r.id !== id);
                if (this.selectedRecord?.id === id) {
                    this.selectedRecord = null;
                }
                this.renderTabContent();
                break;
        }
    }

    private renderFormJSON(): void {
        const contentContainer = document.getElementById('xwui-form-editor-content');
        if (!contentContainer) return;

        contentContainer.innerHTML = '';
        const jsonContainer = document.createElement('div');
        jsonContainer.className = 'xwui-form-editor-json';
        jsonContainer.id = 'xwui-form-editor-json-container';
        jsonContainer.style.height = '100%';
        jsonContainer.style.minHeight = '600px';
        contentContainer.appendChild(jsonContainer);

        // Use XWUIScriptEditor for JSON editing
        const jsonContent = JSON.stringify(this.formDefinition, null, 2);
        this.formJsonEditor = new XWUIScriptEditor(jsonContainer, {
            content: jsonContent
        }, {
            grammar: 'json',
            engine: 'monaco',
            mode: 'edit',
            height: '100%'
        });
        this.registerChildComponent(this.formJsonEditor);

        // Wait for Monaco to initialize, then listen for changes
        const setupChangeListener = () => {
            try {
                const monaco = (window as any).monaco;
                if (monaco && monaco.editor) {
                    // Find the Monaco editor instance by checking all editors
                    const editors = monaco.editor.getEditors();
                    let editor: any = null;
                    
                    // Try to find editor in our container
                    for (const e of editors) {
                        try {
                            const container = e.getContainerDomNode();
                            if (container && jsonContainer.contains(container)) {
                                editor = e;
                                break;
                            }
                        } catch (err) {
                            // Continue searching
                        }
                    }
                    
                    // If not found, wait a bit more
                    if (!editor && editors.length > 0) {
                        // Use the last created editor (most likely ours)
                        editor = editors[editors.length - 1];
                    }

                    if (editor) {
                        editor.onDidChangeModelContent(() => {
                            try {
                                const newContent = editor.getValue();
                                const parsed = JSON.parse(newContent);
                                this.formDefinition = parsed as FormDefinition;
                                // Update schema if needed
                                if (!this.formDefinition.schema || Object.keys(this.formDefinition.schema).length === 0) {
                                    this.formDefinition.schema = { ...this.defaultSchema };
                                }
                                // Update other views (debounce)
                                clearTimeout((this as any).jsonUpdateTimeout);
                                (this as any).jsonUpdateTimeout = setTimeout(() => {
                                    if (this.activeTab !== 'FORM_JSON') {
                                        this.renderTabContent();
                                    }
                                }, 500);
                            } catch (error) {
                                // Invalid JSON - don't update
                            }
                        });
                        return true;
                    }
                }
            } catch (error) {
                console.warn('Could not set up Monaco change listener:', error);
            }
            return false;
        };

        // Try immediately, then retry if needed
        if (!setupChangeListener()) {
            setTimeout(() => {
                if (!setupChangeListener()) {
                    setTimeout(setupChangeListener, 2000);
                }
            }, 1000);
        }
    }

    private renderFormDataJSON(): void {
        const contentContainer = document.getElementById('xwui-form-editor-content');
        if (!contentContainer) return;

        contentContainer.innerHTML = '';
        const jsonContainer = document.createElement('div');
        jsonContainer.className = 'xwui-form-editor-json';
        jsonContainer.id = 'xwui-form-editor-form-data-json-container';
        jsonContainer.style.height = '100%';
        jsonContainer.style.minHeight = '600px';
        contentContainer.appendChild(jsonContainer);
        
        if (this.selectedRecord) {
            // Use XWUIScriptEditor for JSON editing
            const jsonContent = JSON.stringify(this.selectedRecord, null, 2);
            this.formDataJsonEditor = new XWUIScriptEditor(jsonContainer, {
                content: jsonContent
            }, {
                grammar: 'json',
                engine: 'monaco',
                mode: 'edit',
                height: '100%'
            });
            this.registerChildComponent(this.formDataJsonEditor);

            // Wait for Monaco to initialize, then listen for changes
            const setupChangeListener = () => {
                try {
                    const monaco = (window as any).monaco;
                    if (monaco && monaco.editor) {
                        const editors = monaco.editor.getEditors();
                        let editor: any = null;
                        
                        for (const e of editors) {
                            try {
                                const container = e.getContainerDomNode();
                                if (container && jsonContainer.contains(container)) {
                                    editor = e;
                                    break;
                                }
                            } catch (err) {
                                // Continue searching
                            }
                        }
                        
                        if (!editor && editors.length > 0) {
                            editor = editors[editors.length - 1];
                        }

                        if (editor) {
                            editor.onDidChangeModelContent(() => {
                                try {
                                    const newContent = editor.getValue();
                                    const parsed = JSON.parse(newContent);
                                    this.selectedRecord = parsed as SubmittedData;
                                    // Update in submittedData array
                                    const index = this.submittedData.findIndex(r => r.id === this.selectedRecord!.id);
                                    if (index !== -1) {
                                        this.submittedData[index] = this.selectedRecord;
                                    }
                                } catch (error) {
                                    // Invalid JSON
                                }
                            });
                            return true;
                        }
                    }
                } catch (error) {
                    console.warn('Could not set up Monaco change listener:', error);
                }
                return false;
            };

            if (!setupChangeListener()) {
                setTimeout(() => {
                    if (!setupChangeListener()) {
                        setTimeout(setupChangeListener, 2000);
                    }
                }, 1000);
            }
        } else {
            jsonContainer.innerHTML = '<p style="padding: var(--spacing-lg, 1.5rem); color: var(--text-secondary, #6c757d);">Select a record from the LIST tab to view its JSON data.</p>';
        }
    }

    // Public methods
    public getFormDefinition(): FormDefinition {
        return this.formDefinition;
    }

    public setFormDefinition(definition: FormDefinition): void {
        this.formDefinition = definition;
        this.renderTabContent();
    }

    public getSubmittedData(): SubmittedData[] {
        return this.submittedData;
    }

    public setSubmittedData(data: SubmittedData[]): void {
        this.submittedData = data;
        this.renderTabContent();
    }

    public destroy(): void {
        // All registered child components (tabsInstance, contextMenuInstance, editDialogInstance, 
        // formJsonEditor, formDataJsonEditor) are automatically destroyed by base class
        // Note: Dynamically created input components in renderFormElement() should ideally be stored
        // in arrays and registered, but for now they're cleaned up when container.innerHTML is cleared
        
        // Clear references
        this.tabsInstance = null;
        this.contextMenuInstance = null;
        this.editDialogInstance = null;
        this.formJsonEditor = null;
        this.formDataJsonEditor = null;
        this.wrapperElement = null;
        this.componentPaletteElement = null;
        this.formRendererElement = null;
        this.editingElement = null;
        this.container.innerHTML = '';
        
        // Call parent to clean up registered child components
        super.destroy();
    }
}

(XWUIFormEditor as any).componentName = 'XWUIFormEditor';


