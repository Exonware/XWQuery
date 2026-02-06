/**
 * Shared Shape Types
 * Single source of truth for all shape types used across generators
 * (roundness, lines, typography, etc.)
 */

// Generic categories (10 base types)
export const GENERIC_TYPES = {
    input: { default: 'sm', label: 'Input' },
    button: { default: 'sm', label: 'Button' },
    container: { default: 'lg', label: 'Container' },
    media: { default: 'md', label: 'Media' },
    badge: { default: 'full', label: 'Badge' },
    overlay: { default: 'lg', label: 'Overlay' },
    navigation: { default: 'sm', label: 'Navigation' },
    content: { default: 'md', label: 'Content' },
    feedback: { default: 'md', label: 'Feedback' },
    control: { default: 'sm', label: 'Control' },
    // Typography-specific generic types
    text: { default: 'base', label: 'Text' },
    heading: { default: 'lg', label: 'Heading' }
};

// Detailed types with their generic fallback and default base size
export const DETAILED_TYPES = {
    // Existing detailed types
    input: { generic: 'input', default: 'sm', label: 'Input' },
    button: { generic: 'button', default: 'sm', label: 'Button' },
    container: { generic: 'container', default: 'lg', label: 'Container' },
    photo: { generic: 'media', default: 'md', label: 'Photo' },
    avatar: { generic: 'media', default: 'sm', label: 'Avatar' },
    badge: { generic: 'badge', default: 'full', label: 'Badge' },
    chip: { generic: 'badge', default: 'full', label: 'Chip' },
    dialog: { generic: 'overlay', default: 'lg', label: 'Dialog' },
    tooltip: { generic: 'overlay', default: 'sm', label: 'Tooltip' },
    toast: { generic: 'overlay', default: 'md', label: 'Toast' },
    popover: { generic: 'overlay', default: 'md', label: 'Popover' },
    tab: { generic: 'navigation', default: 'sm', label: 'Tab' },
    menu: { generic: 'navigation', default: 'md', label: 'Menu' },
    sidebar: { generic: 'navigation', default: 'md', label: 'Sidebar' },
    code: { generic: 'content', default: 'md', label: 'Code' },
    table: { generic: 'content', default: 'xs', label: 'Table' },
    accordion: { generic: 'content', default: 'md', label: 'Accordion' },
    carousel: { generic: 'content', default: 'md', label: 'Carousel' },
    calendar: { generic: 'content', default: 'sm', label: 'Calendar' },
    alert: { generic: 'feedback', default: 'md', label: 'Alert' },
    skeleton: { generic: 'feedback', default: 'sm', label: 'Skeleton' },
    progress: { generic: 'feedback', default: 'full', label: 'Progress' },
    pagination: { generic: 'control', default: 'sm', label: 'Pagination' },
    navigation: { generic: 'navigation', default: 'sm', label: 'Navigation' },
    
    // Typography-specific detailed types
    headings: { generic: 'heading', default: 'lg', label: 'Headings' },
    body: { generic: 'text', default: 'base', label: 'Body' },
    label: { generic: 'text', default: 'sm', label: 'Label' },
    caption: { generic: 'text', default: 'xs', label: 'Caption' }
};

// Get all shape types (generic + detailed, deduplicated)
export function getAllShapeTypes(): string[] {
    const genericKeys = Object.keys(GENERIC_TYPES);
    const detailedKeys = Object.keys(DETAILED_TYPES);
    return Array.from(new Set([...genericKeys, ...detailedKeys])).sort();
}

// Get shape info by name
export function getShapeInfo(shapeType: string): { generic?: string; default: string; label: string } | undefined {
    if (shapeType in GENERIC_TYPES) {
        return GENERIC_TYPES[shapeType as keyof typeof GENERIC_TYPES];
    }
    if (shapeType in DETAILED_TYPES) {
        return DETAILED_TYPES[shapeType as keyof typeof DETAILED_TYPES];
    }
    return undefined;
}

// Get all detailed shape types (for generators that need shape-specific files)
export function getDetailedShapeTypes(): string[] {
    return Object.keys(DETAILED_TYPES).sort();
}

