# Roundness System - Two Dimensions

## Dimension 1: Shape Types (UI Element Types)
These are the different UI components/elements that can have customized roundness:

### Base Sizes (Foundation)
1. `xs` - Extra Small
2. `sm` - Small  
3. `md` - Medium
4. `lg` - Large
5. `xl` - Extra Large
6. `xxl` - Extra Extra Large
7. `full` - Full (Pill/Circle - 9999px)

### Granular Shape Types

#### Best of Both Worlds: Generic + Detailed Types

**Strategy:** Use **generic categories as defaults** with **detailed types as overrides**. This gives you:
- ✅ Simple defaults for most use cases (generic)
- ✅ Fine-grained control when needed (detailed)
- ✅ Maximum flexibility and scalability

#### 1. Generic Categories (Primary/Default - 10 types)
These provide sensible defaults that cover 80% of use cases:

1. `input` - Form inputs, textareas, selects (covers all input types)
2. `button` - All button variants (primary, secondary, icon buttons)
3. `container` - Cards, panels, containers, sections
4. `media` - Images, photos, videos, avatars (square variant)
5. `badge` - Badges, pills, chips, tags (all small label types)
6. `overlay` - Dialogs, modals, popovers, tooltips, toasts (all floating/overlay elements)
7. `navigation` - Tabs, menus, sidebars, nav items, breadcrumbs
8. `content` - Code blocks, tables, accordions, carousels, calendars
9. `feedback` - Alerts, notifications, progress indicators, skeletons
10. `control` - Pagination, sliders, switches, checkboxes (if they need roundness)

#### 2. Detailed Types (Override/Extended - 24 types)
These provide fine-grained control and override generics when set:

1. `input` - Input fields, textareas, selects (same as generic)
2. `button` - Buttons (same as generic)
3. `container` - Containers, cards, panels (same as generic)
4. `photo` - Images and photos (overrides `media`)
5. `avatar` - Avatar images square variant (overrides `media`)
6. `badge` - Badges and pills (same as generic)
7. `chip` - Chips/tags (overrides `badge`)
8. `dialog` - Modals/dialogs (overrides `overlay`)
9. `tooltip` - Tooltips (overrides `overlay`)
10. `toast` - Toast notifications (overrides `overlay`)
11. `popover` - Popovers (overrides `overlay`)
12. `tab` - Tab buttons (overrides `navigation`)
13. `menu` - Dropdown menus (overrides `navigation`)
14. `sidebar` - Sidebar panels (overrides `navigation`)
15. `code` - Code blocks (overrides `content`)
16. `table` - Table cells (overrides `content`)
17. `accordion` - Accordion items (overrides `content`)
18. `carousel` - Carousel items (overrides `content`)
19. `calendar` - Calendar date cells (overrides `content`)
20. `alert` - Alerts and notifications (overrides `feedback`)
21. `skeleton` - Skeleton loaders (overrides `feedback`)
22. `progress` - Progress indicators (overrides `feedback`)
23. `pagination` - Pagination buttons (overrides `control`)
24. `navigation` - Navigation items (overrides `navigation`)

**Total: 7 base sizes + 10 generic + 24 detailed = 41 roundness variables**

#### Fallback Hierarchy
```
Detailed Type → Generic Category → Base Size → Default Value
--radius-dialog → --radius-overlay → --radius-lg → 12px
--radius-tooltip → --radius-overlay → --radius-sm → 6px
--radius-photo → --radius-media → --radius-md → 8px
```

**How it works:**
- If `--radius-dialog` is set → use it
- Else if `--radius-overlay` is set → use it
- Else if `--radius-lg` is set → use it
- Else → use default (12px)

---

## Implementation Strategy: Generic + Detailed + Component-Specific

### Three-Tier System

**1. Generic Categories (Tier 1 - Defaults)**
- 10 semantic categories covering 80% of use cases
- Quick to configure, good defaults
- Use when you want consistent styling across similar elements

**2. Detailed Types (Tier 2 - Overrides)**
- 24 specific types for fine-grained control
- Override generics when you need different values
- Use when you want different roundness for specific elements

**3. Component-Specific (Tier 3 - Custom)**
- Pattern: `--radius-xwui-{component-name}`
- Ultimate override for specific components
- Use when a component needs unique roundness

### Fallback Hierarchy (4 levels)
```
Component-specific → Detailed Type → Generic Category → Base Size → Default
--radius-xwui-dialog → --radius-dialog → --radius-overlay → --radius-lg → 12px
```

### Example Implementation:

```css
/* Component uses detailed type, falls back to generic, then base size */
.xwui-dialog {
    border-radius: var(
        --radius-xwui-dialog,      /* Tier 3: Component-specific */
        var(--radius-dialog,       /* Tier 2: Detailed type */
        var(--radius-overlay,      /* Tier 1: Generic category */
        var(--radius-lg, 12px)))   /* Base size → Default */
    );
}

.xwui-tooltip {
    border-radius: var(
        --radius-xwui-tooltip,
        var(--radius-tooltip,
        var(--radius-overlay,
        var(--radius-sm, 6px)))
    );
}

.xwui-photo {
    border-radius: var(
        --radius-xwui-photo,
        var(--radius-photo,
        var(--radius-media,
        var(--radius-md, 8px)))
    );
}
```

### Benefits of Three-Tier System:
- ✅ **Flexible**: Use generics for quick setup, detailed for precision
- ✅ **Scalable**: New components automatically work with generics
- ✅ **Maintainable**: Change generic to affect all related elements
- ✅ **Precise**: Override specific elements when needed
- ✅ **Future-proof**: Add new detailed types without breaking existing code
- ✅ **Progressive**: Start with generics, add details as needed

---

## Dimension 2: Round Sizes (Preset Scales)
These are the preset roundness scales that define the base size values:

1. `sharp` - No border radius (0px)
2. `minimal` - Very small border radius (1-8px)
3. `subtle` - Slightly rounded (2-12px)
4. `rounded` - Moderate border radius (4-20px) - **Default**
5. `soft` - Gentle, soft corners (6-24px)
6. `pill` - Large border radius (8-40px)
7. `extra-rounded` - Very large border radius (12-48px)

---

## How They Mix

Each **Shape Type** can use any value from the **Round Sizes** scale, or a custom value.

### Example Matrix (Generic + Detailed):
```
                    sharp  minimal  subtle  rounded  soft   pill   extra-rounded
Generic Types:
input                0px     2px     4px     6px     8px    12px      16px
button               0px     2px     4px     6px     8px    16px      24px
container            0px     3px     6px    12px    16px    24px      32px
media                0px     3px     6px     8px    12px    16px      24px
badge             9999px  9999px  9999px  9999px  9999px  9999px    9999px
overlay              0px     3px     6px    12px    16px    24px      32px
navigation           0px     2px     4px     6px     8px    12px      16px
content              0px     2px     4px     8px    12px    16px      24px
feedback             0px     3px     6px     8px    12px    16px      24px
control              0px     2px     4px     6px     8px    12px      16px

Detailed Types (override generics when set):
photo                0px     3px     6px     8px    12px    16px      24px  (overrides media)
avatar               0px     2px     4px     6px     8px    12px      16px  (overrides media)
chip              9999px  9999px  9999px  9999px  9999px  9999px    9999px  (overrides badge)
dialog               0px     4px     8px    12px    16px    24px      32px  (overrides overlay)
tooltip              0px     2px     4px     6px     8px    12px      16px  (overrides overlay)
toast                0px     3px     6px     8px    12px    16px      24px  (overrides overlay)
popover              0px     3px     6px     8px    12px    16px      24px  (overrides overlay)
tab                  0px     2px     4px     6px     8px    12px      16px  (overrides navigation)
menu                 0px     3px     6px     8px    12px    16px      24px  (overrides navigation)
sidebar              0px     3px     6px     8px    12px    16px      24px  (overrides navigation)
code                 0px     2px     4px     8px    12px    16px      24px  (overrides content)
table                0px     1px     2px     4px     6px     8px      12px  (overrides content)
accordion            0px     3px     6px     8px    12px    16px      24px  (overrides content)
carousel             0px     3px     6px     8px    12px    16px      24px  (overrides content)
calendar             0px     2px     4px     6px     8px    12px      16px  (overrides content)
alert                0px     3px     6px     8px    12px    16px      24px  (overrides feedback)
skeleton             0px     2px     4px     6px     8px    12px      16px  (overrides feedback)
progress          9999px  9999px  9999px  9999px  9999px  9999px    9999px  (overrides feedback)
pagination           0px     2px     4px     6px     8px    12px      16px  (overrides control)
```

### Dynamic Generation
Instead of creating 7 presets × 41 variables = 287 CSS files, we:
1. Define presets programmatically in TypeScript (for all 41 variables)
2. Generate CSS variables dynamically
3. Allow users to customize:
   - Generic types (quick setup for most elements)
   - Detailed types (fine-grained control when needed)
   - Component-specific (ultimate override)
4. Store custom configurations in localStorage
5. Use fallback hierarchy for automatic inheritance

---

## Implementation

- **Preset CSS files**: Keep for initial load/fallback (7 files with base sizes only)
- **Dynamic generator**: TypeScript utility that generates all 41 CSS variables on-the-fly
- **Slider component**: UI for customizing:
  - Generic types (10 sliders - quick setup)
  - Detailed types (24 sliders - fine control)
  - Component-specific (on-demand per component)
- **Storage**: localStorage for custom roundness configurations
- **Fallback system**: Automatic inheritance through 4-tier hierarchy

### Usage Patterns:

**Quick Setup (Generic Only):**
```typescript
// Set generic categories - affects all related elements
roundnessGenerator.updateMultiple({
    overlay: 12,      // All dialogs, tooltips, toasts use 12px
    media: 8,        // All photos, avatars use 8px
    navigation: 6    // All tabs, menus, sidebars use 6px
});
```

**Fine Control (Detailed Overrides):**
```typescript
// Override specific elements
roundnessGenerator.updateMultiple({
    overlay: 12,     // Default for all overlays
    dialog: 16,      // Dialogs use 16px (overrides overlay)
    tooltip: 6,      // Tooltips use 6px (overrides overlay)
    toast: 8         // Toasts use 8px (overrides overlay)
});
```

**Component-Specific (Ultimate Override):**
```css
/* In component CSS */
.xwui-special-dialog {
    --radius-xwui-special-dialog: 20px; /* Overrides everything */
    border-radius: var(--radius-xwui-special-dialog, var(--radius-dialog, var(--radius-overlay, var(--radius-lg))));
}
```

