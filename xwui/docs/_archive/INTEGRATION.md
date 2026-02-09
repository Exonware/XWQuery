# XWUI Design System Integration Guide

## ✅ Completed Integration

The XWUI design system has been fully reorganized and integrated into all components.

### Structure

```
src/styles/
├── base/                    # Base styles (reset, typography, utilities)
├── brand/                   # Brand styles
│   └── xwui/
│       └── brand.css
├── style/                   # Design style approaches
│   ├── basic/               # Basic spacing and shadows
│   └── modern/              # Modern spacing and shadows
├── theme/                   # Theme variations
│   ├── colors/             # Color themes (light, dark, silver, night, blue)
│   ├── accents/            # Accent colors (blue, purple, green, orange)
│   ├── roundness/          # Border radius (sharp, rounded, pill)
│   └── typography/        # Font families (inter, system, roboto, geist)
├── presets/                # Pre-built theme combinations
└── app/                    # App-specific component styles
```

### TypeScript Tokens

Located in `src/tokens/`:
- `index.ts` - Main token exports with autocomplete
- `utils.ts` - Helper functions (`toVar`, `toVarWithFallback`)

### Usage in Components

```typescript
import { vars } from '../../tokens';

// Use tokens for type-safe CSS variable references
button.style.backgroundColor = vars.accent.primary;
button.style.borderRadius = vars.radius.md;
button.style.color = vars.colors.text.primary;
```

### Theme Loader

```typescript
import { themeLoader } from '../styles/theme-loader';

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
```

### HTML Integration

All tester HTML files have been updated to use the new structure:

```html
<!-- Base Styles -->
<link rel="stylesheet" href="../../../styles/base/reset.css">
<link rel="stylesheet" href="../../../styles/base/typography.css">
<link rel="stylesheet" href="../../../styles/base/utilities.css">

<!-- Brand -->
<link rel="stylesheet" href="../../../styles/brand/xwui/brand.css">

<!-- Style -->
<link rel="stylesheet" href="../../../styles/style/modern/spacing.css">
<link rel="stylesheet" href="../../../styles/style/modern/shadows.css">

<!-- Theme -->
<link rel="stylesheet" href="../../../styles/theme/colors/light.css" id="themeColorSheet">
<link rel="stylesheet" href="../../../styles/theme/accents/blue.css">
<link rel="stylesheet" href="../../../styles/theme/roundness/rounded.css">
<link rel="stylesheet" href="../../../styles/theme/typography/inter.css">
```

### Data Attributes

Set on `<html>` element:
```html
<html data-brand="xwui" 
      data-style="modern" 
      data-theme="light" 
      data-accent="blue" 
      data-roundness="rounded" 
      data-font="inter">
```

### Available Options

**Colors:** light, dark, silver, night, blue
**Accents:** blue, purple, green, orange
**Roundness:** sharp, rounded, pill
**Typography:** inter, system, roboto, geist
**Style:** basic, modern

### Presets

Quick-start presets available:
- `xwui-modern-light-blue-rounded.css`
- `xwui-modern-dark-purple-pill.css`
- `xwui-basic-dark-purple-sharp.css`
- `xwui-modern-night-blue-pill.css`
- `xwui-modern-silver-green-rounded.css`

### Migration Status

✅ All 62 tester HTML files updated
✅ Main app.html updated
✅ Testers index.html updated
✅ TesterXWUIComponents.html updated
✅ TypeScript tokens created
✅ Theme loader utility created
✅ Component exports include tokens
✅ Preset files created

### Next Steps

1. Test all components with new theme system
2. Add more accent colors if needed
3. Add more typography options if needed
4. Create additional presets for common combinations

