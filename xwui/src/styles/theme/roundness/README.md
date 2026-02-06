# Roundness System

This directory contains the roundness (border-radius) system for the theme.

## Structure

### Preset Files (Root Level)
Base roundness presets that define the foundation size scale:
- `sharp.css` - No border radius (0px)
- `minimal.css` - Very small border radius (1-8px)
- `subtle.css` - Slightly rounded (2-12px)
- `rounded.css` - Moderate border radius (4-20px) - **Default**
- `soft.css` - Gentle, soft corners (6-24px)
- `pill.css` - Large border radius (8-40px)
- `extra-rounded.css` - Very large border radius (12-48px)

### Shape Type Folders
Each shape type has its own folder with 7 CSS files (one for each preset):

**Generic Types (10):**
- `input/` - Form inputs, textareas, selects
- `button/` - All button variants
- `container/` - Cards, panels, containers
- `media/` - Images, photos, videos, avatars
- `badge/` - Badges, pills, chips, tags
- `overlay/` - Dialogs, modals, popovers, tooltips, toasts
- `navigation/` - Tabs, menus, sidebars, nav items
- `content/` - Code blocks, tables, accordions, carousels
- `feedback/` - Alerts, notifications, progress indicators
- `control/` - Pagination, sliders, switches

**Detailed Types (24):**
- `photo/`, `avatar/` - Override `media`
- `chip/` - Override `badge`
- `dialog/`, `tooltip/`, `toast/`, `popover/` - Override `overlay`
- `tab/`, `menu/`, `sidebar/` - Override `navigation`
- `code/`, `table/`, `accordion/`, `carousel/`, `calendar/` - Override `content`
- `alert/`, `skeleton/`, `progress/` - Override `feedback`
- `pagination/` - Override `control`
- Plus: `input/`, `button/`, `container/`, `badge/`, `navigation/` (same as generics)

## File Structure Example

```
roundness/
├── sharp.css                    # Base preset
├── rounded.css                  # Base preset
├── input/
│   ├── sharp.css                # --radius-input: 0px
│   ├── minimal.css              # --radius-input: 2px
│   ├── rounded.css              # --radius-input: 6px
│   └── ...
├── dialog/
│   ├── sharp.css                # --radius-dialog: 0px
│   ├── rounded.css              # --radius-dialog: 12px
│   └── ...
└── ...
```

## Usage

### CSS Variables
Each file defines a CSS variable for its shape type:
```css
:root[data-roundness="rounded"] {
    --radius-dialog: 12px;
}
```

### Utility Classes
Each file also provides a utility class:
```css
.radius-dialog-rounded {
    border-radius: var(--radius-dialog, 12px) !important;
}
```

### Fallback Hierarchy
Detailed types fall back to their generic category:
```
--radius-dialog → --radius-overlay → --radius-lg → 12px
--radius-photo → --radius-media → --radius-md → 8px
```

## Regenerating Files

All files are generated programmatically. To regenerate:

```bash
npm run generate:roundness
```

Or directly:
```bash
npx --yes tsx src/styles/roundness-generator.ts
```

## Total Files

- **34 shape types** (10 generic + 24 detailed)
- **7 roundness presets** per shape type
- **238 total CSS files** (34 × 7)
- Plus **7 base preset files** = **245 total files**

## Generator Source

The generator is located at: `src/styles/roundness-generator.ts`

Modify the generator to:
- Add new shape types
- Change default mappings
- Adjust preset values
- Update fallback hierarchies

