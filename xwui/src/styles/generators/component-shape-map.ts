/**
 * Component to Shape Type Mapping
 * Maps XWUI component names to their corresponding shape types
 * Used for applying theme styles (roundness, lines, typography)
 */

import { DETAILED_TYPES } from './shape-types.js';

// Map component name (without XWUI prefix) to shape type
export const COMPONENT_TO_SHAPE: Record<string, string> = {
    // Direct mappings
    'Accordion': 'accordion',
    'Alert': 'alert',
    'Avatar': 'avatar',
    'Badge': 'badge',
    'Button': 'button',
    'ButtonGroup': 'button', // Uses button shape
    'Calendar': 'calendar',
    'Card': 'container', // Uses container shape
    'Carousel': 'carousel',
    'Chip': 'chip',
    'CodeBlock': 'code',
    'Collapse': 'content', // Uses content shape
    'Dialog': 'dialog',
    'Drawer': 'overlay', // Uses overlay shape
    'DropdownMenu': 'menu', // Uses menu shape
    'Input': 'input',
    'InputGroup': 'input', // Uses input shape
    'InputOTP': 'input', // Uses input shape
    'Label': 'label',
    'Menu': 'menu',
    'Menubar': 'menu', // Uses menu shape
    'NavigationMenu': 'navigation', // Uses navigation shape
    'NavigationRail': 'navigation', // Uses navigation shape
    'Pagination': 'pagination',
    'Popover': 'popover',
    'Progress': 'progress',
    'Select': 'input', // Uses input shape
    'Sidebar': 'sidebar',
    'Skeleton': 'skeleton',
    'Table': 'table',
    'Tabs': 'tab',
    'Textarea': 'input', // Uses input shape
    'Toast': 'toast',
    'Tooltip': 'tooltip',
    
    // Special cases
    'AppBar': 'container', // Uses container shape
    'AppShell': 'container', // Uses container shape
    'AspectRatio': 'media', // Uses media shape
    'Breadcrumbs': 'navigation', // Uses navigation shape
    'Chart': 'container', // Uses container shape
    'ChatInput': 'input', // Uses input shape
    'Checkbox': 'control', // Uses control shape
    'Command': 'input', // Uses input shape
    'Console': 'container', // Uses container shape
    'ContextMenu': 'menu', // Uses menu shape
    'DataGrid': 'table', // Uses table shape
    'DatePicker': 'input', // Uses input shape
    'Empty': 'container', // Uses container shape
    'Field': 'input', // Uses input shape
    'Form': 'container', // Uses container shape
    'Grid': 'container', // Uses container shape
    'Icon': 'badge', // Uses badge shape
    'Item': 'container', // Uses container shape
    'ItemGroup': 'container', // Uses container shape
    'Kbd': 'badge', // Uses badge shape
    'List': 'content', // Uses content shape
    'LocationInput': 'input', // Uses input shape
    'Map': 'container', // Uses container shape
    'MessageBubble': 'container', // Uses container shape
    'RadioGroup': 'control', // Uses control shape
    'Rating': 'control', // Uses control shape
    'Resizable': 'container', // Uses container shape
    'ResizablePanel': 'container', // Uses container shape
    'Result': 'container', // Uses container shape
    'ScriptEditor': 'code', // Uses code shape
    'ScrollArea': 'container', // Uses container shape
    'ScrollTo': 'button', // Uses button shape
    'Separator': 'container', // Uses container shape
    'Slider': 'control', // Uses control shape
    'SortableList': 'content', // Uses content shape
    'Spinner': 'feedback', // Uses feedback shape
    'Steps': 'navigation', // Uses navigation shape
    'Switch': 'control', // Uses control shape
    'Thread': 'container', // Uses container shape
    'Timeline': 'content', // Uses content shape
    'TimePicker': 'input', // Uses input shape
    'ToggleGroup': 'control', // Uses control shape
    'Tree': 'content', // Uses content shape
    'Typography': 'body', // Uses body shape
    'Upload': 'input', // Uses input shape
    'BottomSheet': 'overlay', // Uses overlay shape
    'SkipLink': 'button', // Uses button shape
};

/**
 * Get shape type for a component name
 * @param componentName - Component name (e.g., "XWUIButton" or "Button")
 * @returns Shape type (e.g., "button", "input", "accordion")
 */
export function getShapeForComponent(componentName: string): string | undefined {
    // Remove XWUI prefix if present
    const name = componentName.replace(/^XWUI/, '');
    return COMPONENT_TO_SHAPE[name] || COMPONENT_TO_SHAPE[componentName];
}

/**
 * Get all component names that map to a specific shape
 * @param shapeType - Shape type (e.g., "button", "input")
 * @returns Array of component names
 */
export function getComponentsForShape(shapeType: string): string[] {
    return Object.entries(COMPONENT_TO_SHAPE)
        .filter(([_, shape]) => shape === shapeType)
        .map(([component]) => `XWUI${component}`);
}

/**
 * Check if a shape type exists in the theme system
 */
export function isValidShapeType(shapeType: string): boolean {
    return shapeType in DETAILED_TYPES || shapeType in {
        input: true,
        button: true,
        container: true,
        media: true,
        badge: true,
        overlay: true,
        navigation: true,
        content: true,
        feedback: true,
        control: true,
        text: true,
        heading: true
    };
}

