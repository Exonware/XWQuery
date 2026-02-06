# XWUI Design System

Modular, mix-and-match design system with CSS variables and TypeScript tokens.

## Structure

```
src/styles/
├── base/              # Base styles (reset, typography, utilities)
├── brand/             # Brand-specific styles (xwui)
│   └── xwui/
├── style/             # Design style approaches
│   ├── basic/         # Basic spacing and shadows
│   └── modern/        # Modern spacing and shadows
├── theme/             # Theme variations
│   ├── colors/        # Color themes (light, dark, silver, night, blue)
│   ├── accents/        # Accent colors (blue, purple, green, orange)
│   ├── roundness/     # Border radius styles (sharp, rounded, pill)
│   └── typography/    # Font families (inter, system, roboto, geist)
├── presets/           # Pre-built theme combinations
└── app/               # App-specific component styles
```

## Usage

### Option 1: Use Preset (Recommended for Quick Start)

```html
<link rel="stylesheet" href="styles/presets/xwui-modern-light-blue-rounded.css">
```

### Option 2: Load Individual Files (For Mixing)

```html
<!-- Base -->
<link rel="stylesheet" href="styles/base/reset.css">
<link rel="stylesheet" href="styles/base/typography.css">
<link rel="stylesheet" href="styles/base/utilities.css">

<!-- Brand -->
<link rel="stylesheet" href="styles/brand/xwui/brand.css">

<!-- Style -->
<link rel="stylesheet" href="styles/style/modern/spacing.css">
<link rel="stylesheet" href="styles/style/modern/shadows.css">

<!-- Theme -->
<link rel="stylesheet" href="styles/theme/colors/light.css">
<link rel="stylesheet" href="styles/theme/accents/blue.css">
<link rel="stylesheet" href="styles/theme/roundness/rounded.css">
<link rel="stylesheet" href="styles/theme/typography/inter.css">
```

Set data attributes:
```html
<html data-brand="xwui" 
      data-style="modern" 
      data-theme="light" 
      data-accent="blue" 
      data-roundness="rounded" 
      data-font="inter">
```

### Option 3: Use Theme Loader (TypeScript)

```typescript
import { themeLoader } from './styles/theme-loader';

// Load default theme
themeLoader.loadTheme();

// Load custom theme
themeLoader.loadTheme({
    brand: 'xwui',
    style: 'modern',
    color: 'dark',
    accent: 'purple',
    roundness: 'pill',
    font: 'geist'
});

// Update single aspect
themeLoader.updateTheme({ accent: 'green' });
```

## TypeScript Tokens

```typescript
import { vars } from './tokens';

// Use in components
button.style.backgroundColor = vars.accent.primary;
button.style.borderRadius = vars.radius.md;
button.style.color = vars.colors.text.primary;
```

## Available Options

### Colors
- `light` - Clean and bright
- `dark` - Pure black and sleek
- `silver` - Metallic brushed silver
- `night` - Deep dark blue
- `blue` - Light blue theme

### Accents
- `blue` - Modern blue palette (default)
- `purple` - Purple palette
- `green` - Green palette
- `orange` - Orange palette

### Roundness
- `sharp` - No border radius
- `rounded` - Moderate border radius (default)
- `pill` - Large border radius

### Typography
- `inter` - Inter font family (default)
- `system` - System font stack
- `roboto` - Roboto font family
- `geist` - Geist font family

### Style
- `basic` - Basic spacing and shadows
- `modern` - Modern spacing and shadows (default)

## Mixing and Matching

You can mix any combination:

```typescript
// Modern + Dark + Purple + Pill + Geist
themeLoader.loadTheme({
    style: 'modern',
    color: 'dark',
    accent: 'purple',
    roundness: 'pill',
    font: 'geist'
});

// Basic + Light + Green + Sharp + System
themeLoader.loadTheme({
    style: 'basic',
    color: 'light',
    accent: 'green',
    roundness: 'sharp',
    font: 'system'
});
```

## CSS Variables

All variables are available as CSS custom properties:

```css
.my-component {
    background: var(--bg-primary);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-md);
}
```

