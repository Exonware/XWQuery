/**
 * XWUISpreadsheet Component
 * Excel-like spreadsheet with formulas, formatting, and editing
 */

import { XWUIComponent, type XWUISystemConfig, type XWUIUserConfig } from '../../component/XWUIComponent/XWUIComponent';

export interface SpreadsheetCell {
    value?: string | number;
    formula?: string;
    format?: 'text' | 'number' | 'currency' | 'percentage' | 'date';
    style?: {
        bold?: boolean;
        italic?: boolean;
        color?: string;
        backgroundColor?: string;
    };
    comment?: string;
}

export interface SpreadsheetRow {
    [columnId: string]: SpreadsheetCell;
}

// Component-level configuration
export interface XWUISpreadsheetConfig {
    rows?: number;
    columns?: number;
    showToolbar?: boolean;
    showFormulaBar?: boolean;
    showRowNumbers?: boolean;
    showColumnHeaders?: boolean;
    freezeRows?: number;
    freezeColumns?: number;
    className?: string;
}

// Data type
export interface XWUISpreadsheetData {
    data?: SpreadsheetRow[];
    activeCell?: string; // e.g., "A1"
    selectedRange?: string; // e.g., "A1:B5"
}

export class XWUISpreadsheet extends XWUIComponent<XWUISpreadsheetData, XWUISpreadsheetConfig> {
    private wrapperElement: HTMLElement | null = null;
    private toolbarElement: HTMLElement | null = null;
    private formulaBarElement: HTMLElement | null = null;
    private gridElement: HTMLElement | null = null;
    private tableElement: HTMLElement | null = null;
    private activeCellElement: HTMLElement | null = null;
    private cellData: Map<string, SpreadsheetCell> = new Map();
    private columnCount: number = 26; // A-Z
    private rowCount: number = 100;
    private undoStack: Array<Map<string, SpreadsheetCell>> = [];
    private redoStack: Array<Map<string, SpreadsheetCell>> = [];
    private changeHandlers: Array<(cell: string, value: string | number) => void> = [];

    constructor(
        container: HTMLElement,
        data: XWUISpreadsheetData = {},
        conf_comp: XWUISpreadsheetConfig = {},
        conf_sys?: XWUISystemConfig,
        conf_usr?: XWUIUserConfig
    ) {
        super(container, data, conf_comp, conf_sys, conf_usr);
        this.initializeData();
        this.render();
    }

    protected createConfig(
        conf_comp?: XWUISpreadsheetConfig,
        conf_usr?: XWUIUserConfig,
        conf_sys?: XWUISystemConfig
    ): XWUISpreadsheetConfig {
        return {
            rows: conf_comp?.rows ?? 100,
            columns: conf_comp?.columns ?? 26,
            showToolbar: conf_comp?.showToolbar ?? true,
            showFormulaBar: conf_comp?.showFormulaBar ?? true,
            showRowNumbers: conf_comp?.showRowNumbers ?? true,
            showColumnHeaders: conf_comp?.showColumnHeaders ?? true,
            freezeRows: conf_comp?.freezeRows ?? 0,
            freezeColumns: conf_comp?.freezeColumns ?? 0,
            className: conf_comp?.className
        };
    }

    private initializeData(): void {
        this.rowCount = this.config.rows || 100;
        this.columnCount = this.config.columns || 26;
        
        // Initialize cell data from provided data
        if (this.data.data) {
            this.data.data.forEach((row, rowIndex) => {
                Object.keys(row).forEach(columnId => {
                    const cellId = `${columnId}${rowIndex + 1}`;
                    this.cellData.set(cellId, row[columnId]);
                });
            });
        }
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'xwui-spreadsheet-container';

        this.wrapperElement = document.createElement('div');
        this.wrapperElement.className = 'xwui-spreadsheet';
        
        if (this.config.className) {
            this.wrapperElement.classList.add(this.config.className);
        }

        // Toolbar
        if (this.config.showToolbar) {
            this.toolbarElement = this.createToolbar();
            this.wrapperElement.appendChild(this.toolbarElement);
        }

        // Formula bar
        if (this.config.showFormulaBar) {
            this.formulaBarElement = this.createFormulaBar();
            this.wrapperElement.appendChild(this.formulaBarElement);
        }

        // Grid
        this.gridElement = document.createElement('div');
        this.gridElement.className = 'xwui-spreadsheet-grid';
        this.tableElement = this.createGrid();
        this.gridElement.appendChild(this.tableElement);
        this.wrapperElement.appendChild(this.gridElement);

        this.container.appendChild(this.wrapperElement);
    }

    private createToolbar(): HTMLElement {
        const toolbar = document.createElement('div');
        toolbar.className = 'xwui-spreadsheet-toolbar';

        // Format buttons
        const boldBtn = document.createElement('button');
        boldBtn.className = 'xwui-spreadsheet-toolbar-btn';
        boldBtn.innerHTML = '<strong>B</strong>';
        boldBtn.title = 'Bold';
        boldBtn.onclick = () => this.toggleBold();
        toolbar.appendChild(boldBtn);

        const italicBtn = document.createElement('button');
        italicBtn.className = 'xwui-spreadsheet-toolbar-btn';
        italicBtn.innerHTML = '<em>I</em>';
        italicBtn.title = 'Italic';
        italicBtn.onclick = () => this.toggleItalic();
        toolbar.appendChild(italicBtn);

        toolbar.appendChild(document.createTextNode(' | '));

        // Undo/Redo
        const undoBtn = document.createElement('button');
        undoBtn.className = 'xwui-spreadsheet-toolbar-btn';
        undoBtn.textContent = '↶ Undo';
        undoBtn.onclick = () => this.undo();
        toolbar.appendChild(undoBtn);

        const redoBtn = document.createElement('button');
        redoBtn.className = 'xwui-spreadsheet-toolbar-btn';
        redoBtn.textContent = '↷ Redo';
        redoBtn.onclick = () => this.redo();
        toolbar.appendChild(redoBtn);

        return toolbar;
    }

    private createFormulaBar(): HTMLElement {
        const formulaBar = document.createElement('div');
        formulaBar.className = 'xwui-spreadsheet-formula-bar';

        const label = document.createElement('span');
        label.className = 'xwui-spreadsheet-formula-label';
        label.textContent = this.data.activeCell || 'A1';
        formulaBar.appendChild(label);

        const input = document.createElement('input');
        input.className = 'xwui-spreadsheet-formula-input';
        input.type = 'text';
        input.placeholder = 'Enter formula or value';
        
        const activeCell = this.getActiveCell();
        if (activeCell) {
            const cell = this.cellData.get(activeCell);
            input.value = cell?.formula || cell?.value?.toString() || '';
        }

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.setCellValue(this.data.activeCell || 'A1', input.value);
                input.blur();
            }
        });

        input.addEventListener('input', () => {
            // Update cell as user types
        });

        formulaBar.appendChild(input);
        return formulaBar;
    }

    private createGrid(): HTMLElement {
        const table = document.createElement('table');
        table.className = 'xwui-spreadsheet-table';

        // Column headers
        if (this.config.showColumnHeaders) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            if (this.config.showRowNumbers) {
                const cornerCell = document.createElement('th');
                cornerCell.className = 'xwui-spreadsheet-corner';
                headerRow.appendChild(cornerCell);
            }

            for (let i = 0; i < this.columnCount; i++) {
                const th = document.createElement('th');
                th.className = 'xwui-spreadsheet-column-header';
                th.textContent = this.getColumnLabel(i);
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

        // Rows
        const tbody = document.createElement('tbody');
        for (let row = 0; row < this.rowCount; row++) {
            const tr = document.createElement('tr');
            tr.className = 'xwui-spreadsheet-row';

            // Row number
            if (this.config.showRowNumbers) {
                const rowNum = document.createElement('td');
                rowNum.className = 'xwui-spreadsheet-row-number';
                rowNum.textContent = (row + 1).toString();
                tr.appendChild(rowNum);
            }

            // Cells
            for (let col = 0; col < this.columnCount; col++) {
                const cellId = `${this.getColumnLabel(col)}${row + 1}`;
                const td = document.createElement('td');
                td.className = 'xwui-spreadsheet-cell';
                td.setAttribute('data-cell', cellId);
                td.contentEditable = 'true';

                const cell = this.cellData.get(cellId);
                if (cell) {
                    td.textContent = this.getCellDisplayValue(cell);
                    this.applyCellStyle(td, cell);
                }

                td.addEventListener('focus', () => {
                    this.setActiveCell(cellId);
                });

                td.addEventListener('blur', () => {
                    const value = td.textContent || '';
                    this.setCellValue(cellId, value);
                });

                td.addEventListener('keydown', (e) => {
                    this.handleCellKeydown(e, cellId, td);
                });

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        return table;
    }

    private getColumnLabel(index: number): string {
        let label = '';
        let num = index;
        while (num >= 0) {
            label = String.fromCharCode(65 + (num % 26)) + label;
            num = Math.floor(num / 26) - 1;
        }
        return label;
    }

    private getCellDisplayValue(cell: SpreadsheetCell): string {
        if (cell.formula) {
            // For now, just show the formula. In a real implementation, evaluate it
            return cell.formula.startsWith('=') ? cell.formula : `=${cell.formula}`;
        }
        return cell.value?.toString() || '';
    }

    private applyCellStyle(element: HTMLElement, cell: SpreadsheetCell): void {
        if (cell.style) {
            if (cell.style.bold) {
                element.style.fontWeight = 'bold';
            }
            if (cell.style.italic) {
                element.style.fontStyle = 'italic';
            }
            if (cell.style.color) {
                element.style.color = cell.style.color;
            }
            if (cell.style.backgroundColor) {
                element.style.backgroundColor = cell.style.backgroundColor;
            }
        }
    }

    private setActiveCell(cellId: string): void {
        if (this.activeCellElement) {
            this.activeCellElement.classList.remove('xwui-spreadsheet-cell-active');
        }

        const cell = this.tableElement?.querySelector(`[data-cell="${cellId}"]`) as HTMLElement;
        if (cell) {
            cell.classList.add('xwui-spreadsheet-cell-active');
            this.activeCellElement = cell;
            this.data.activeCell = cellId;

            // Update formula bar
            if (this.formulaBarElement) {
                const label = this.formulaBarElement.querySelector('.xwui-spreadsheet-formula-label');
                const input = this.formulaBarElement.querySelector('.xwui-spreadsheet-formula-input') as HTMLInputElement;
                
                if (label) label.textContent = cellId;
                if (input) {
                    const cellData = this.cellData.get(cellId);
                    input.value = cellData?.formula || cellData?.value?.toString() || '';
                }
            }
        }
    }

    private getActiveCell(): string | null {
        return this.data.activeCell || null;
    }

    private setCellValue(cellId: string, value: string): void {
        this.saveState();

        const cell: SpreadsheetCell = this.cellData.get(cellId) || {};
        
        if (value.startsWith('=')) {
            cell.formula = value;
            // In a real implementation, evaluate the formula
            cell.value = value; // Placeholder
        } else {
            cell.value = value;
            delete cell.formula;
        }

        this.cellData.set(cellId, cell);

        // Update display
        const cellElement = this.tableElement?.querySelector(`[data-cell="${cellId}"]`) as HTMLElement;
        if (cellElement) {
            cellElement.textContent = this.getCellDisplayValue(cell);
            this.applyCellStyle(cellElement, cell);
        }

        // Trigger change handlers
        this.changeHandlers.forEach(handler => {
            handler(cellId, cell.value || '');
        });
    }

    private handleCellKeydown(e: KeyboardEvent, cellId: string, element: HTMLElement): void {
        const [col, row] = this.parseCellId(cellId);
        let newCellId: string | null = null;

        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (row > 1) newCellId = `${col}${row - 1}`;
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (row < this.rowCount) newCellId = `${col}${row + 1}`;
                break;
            case 'ArrowLeft':
                e.preventDefault();
                const colIndex = this.getColumnIndex(col);
                if (colIndex > 0) {
                    newCellId = `${this.getColumnLabel(colIndex - 1)}${row}`;
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                const colIndexRight = this.getColumnIndex(col);
                if (colIndexRight < this.columnCount - 1) {
                    newCellId = `${this.getColumnLabel(colIndexRight + 1)}${row}`;
                }
                break;
            case 'Tab':
                e.preventDefault();
                const colIndexTab = this.getColumnIndex(col);
                if (colIndexTab < this.columnCount - 1) {
                    newCellId = `${this.getColumnLabel(colIndexTab + 1)}${row}`;
                }
                break;
        }

        if (newCellId) {
            this.setActiveCell(newCellId);
            const newCell = this.tableElement?.querySelector(`[data-cell="${newCellId}"]`) as HTMLElement;
            if (newCell) {
                newCell.focus();
            }
        }
    }

    private parseCellId(cellId: string): [string, number] {
        const match = cellId.match(/^([A-Z]+)(\d+)$/);
        if (match) {
            return [match[1], parseInt(match[2], 10)];
        }
        return ['A', 1];
    }

    private getColumnIndex(columnLabel: string): number {
        let index = 0;
        for (let i = 0; i < columnLabel.length; i++) {
            index = index * 26 + (columnLabel.charCodeAt(i) - 64);
        }
        return index - 1;
    }

    private toggleBold(): void {
        const cellId = this.getActiveCell();
        if (!cellId) return;

        const cell = this.cellData.get(cellId) || {};
        if (!cell.style) cell.style = {};
        cell.style.bold = !cell.style.bold;
        this.cellData.set(cellId, cell);

        const cellElement = this.tableElement?.querySelector(`[data-cell="${cellId}"]`) as HTMLElement;
        if (cellElement) {
            this.applyCellStyle(cellElement, cell);
        }
    }

    private toggleItalic(): void {
        const cellId = this.getActiveCell();
        if (!cellId) return;

        const cell = this.cellData.get(cellId) || {};
        if (!cell.style) cell.style = {};
        cell.style.italic = !cell.style.italic;
        this.cellData.set(cellId, cell);

        const cellElement = this.tableElement?.querySelector(`[data-cell="${cellId}"]`) as HTMLElement;
        if (cellElement) {
            this.applyCellStyle(cellElement, cell);
        }
    }

    private saveState(): void {
        const state = new Map(this.cellData);
        this.undoStack.push(state);
        if (this.undoStack.length > 50) {
            this.undoStack.shift();
        }
        this.redoStack = [];
    }

    private undo(): void {
        if (this.undoStack.length === 0) return;

        const currentState = new Map(this.cellData);
        this.redoStack.push(currentState);

        const previousState = this.undoStack.pop()!;
        this.cellData = new Map(previousState);
        this.render();
    }

    private redo(): void {
        if (this.redoStack.length === 0) return;

        const currentState = new Map(this.cellData);
        this.undoStack.push(currentState);

        const nextState = this.redoStack.pop()!;
        this.cellData = new Map(nextState);
        this.render();
    }

    public onCellChange(handler: (cell: string, value: string | number) => void): void {
        this.changeHandlers.push(handler);
    }

    public getCellValue(cellId: string): SpreadsheetCell | undefined {
        return this.cellData.get(cellId);
    }

    public setCellData(cellId: string, cell: SpreadsheetCell): void {
        this.cellData.set(cellId, cell);
        const cellElement = this.tableElement?.querySelector(`[data-cell="${cellId}"]`) as HTMLElement;
        if (cellElement) {
            cellElement.textContent = this.getCellDisplayValue(cell);
            this.applyCellStyle(cellElement, cell);
        }
    }

    public exportToCSV(): string {
        const lines: string[] = [];
        for (let row = 1; row <= this.rowCount; row++) {
            const rowData: string[] = [];
            for (let col = 0; col < this.columnCount; col++) {
                const cellId = `${this.getColumnLabel(col)}${row}`;
                const cell = this.cellData.get(cellId);
                const value = cell?.value?.toString() || '';
                rowData.push(`"${value.replace(/"/g, '""')}"`);
            }
            lines.push(rowData.join(','));
        }
        return lines.join('\n');
    }
}
// Set component name at class definition (before minification) - survives build tools
(XWUISpreadsheet as any).componentName = 'XWUISpreadsheet';


