# Icon Colors Theme System

Global CSS variables for controlling SVG icon colors across all components.

## Usage

Include the icon colors CSS file in your HTML:

```html
<link rel="stylesheet" href="styles/theme/icons_colors/default.css">
```

Or use a specific color scheme:

```html
<link rel="stylesheet" href="styles/theme/icons_colors/custom.css">
```

## CSS Variables

All SVG icons should use these global CSS variables:

- `--icons-color-main` - Primary fill color (default: `black`)
- `--icons-color-secondary` - Secondary/stroke color (default: `white`)
- `--icons-color-accent` - Accent/rail/marks color (default: `gray`)
- `--icons-color-transparent` - Transparent color (default: `transparent`)

## Setting Icon Colors

Set the `data-icons-colors` attribute on the root element:

```html
<html data-icons-colors="custom">
```

Or override variables in your own CSS:

```css
:root {
    --icons-color-main: #4b5563;      /* Dark gray */
    --icons-color-secondary: #eab308;  /* Yellow */
    --icons-color-accent: #4f46e5;    /* Blue */
}
```

## Creating Custom Icon Color Schemes

Create a new CSS file in this directory following the pattern:

```css
:root[data-icons-colors="your-scheme-name"] {
    --icons-color-main: /* your color */;
    --icons-color-secondary: /* your color */;
    --icons-color-accent: /* your color */;
    --icons-color-transparent: transparent;
}
```

## SVG Usage

In your SVG files, use CSS classes that reference these variables:

```svg
<svg>
  <style>
    .xwui-icon-fill { fill: var(--icons-color-main, black); }
    .xwui-icon-stroke { stroke: var(--icons-color-secondary, white); }
    .xwui-icon-accent { fill: var(--icons-color-accent, gray); }
  </style>
  <rect class="xwui-icon-fill" ... />
  <circle class="xwui-icon-stroke" ... />
</svg>
```

