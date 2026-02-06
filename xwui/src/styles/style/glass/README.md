# Glass Style - Apple Liquid Glass / Glassmorphism

The glass style provides a complete glassmorphism design system with backdrop blur effects, transparency, and Apple-inspired liquid glass aesthetics.

## Usage

### Via Theme Loader

```typescript
import { themeLoader } from './styles/theme-loader';

// Load glass style with any color/accent combination
themeLoader.loadTheme({
    style: 'glass',
    color: 'light',  // or 'dark', 'night', etc.
    accent: 'blue',  // or any accent color
    roundness: 'rounded',
    font: 'inter'
});
```

### Via Preset Files

Import a complete preset:

```html
<link rel="stylesheet" href="styles/presets/xwui-glass-light-blue-rounded.css">
```

Available presets:
- `xwui-glass-light-blue-rounded.css`
- `xwui-glass-dark-purple-pill.css`

## CSS Variables

### Backdrop Blur
- `--backdrop-blur-xs` to `--backdrop-blur-2xl` (2px to 40px)

### Glass Opacity
- `--glass-opacity-light` (0.3)
- `--glass-opacity-medium` (0.5)
- `--glass-opacity-heavy` (0.7)
- `--glass-opacity-ultra` (0.85)

### Glass Borders
- `--glass-border-light`
- `--glass-border` (medium)
- `--glass-border-strong`
- `--glass-border-dark` (for dark themes)

### Glass Backgrounds
- `--glass-bg-light`
- `--glass-bg-medium`
- `--glass-bg-heavy`
- `--glass-bg-dark-light/medium/heavy` (for dark themes)

## Utility Classes

### Components
- `.glass-panel` - Standard glass card/container
- `.glass-panel-light` - Lighter glass variant
- `.glass-panel-heavy` - Heavier, more opaque glass
- `.glass-header` - Glass navbar/header
- `.glass-button` - Glass button with hover effects
- `.glass-input` - Glass form input
- `.glass-modal` - Glass modal dialog
- `.glass-overlay` - Glass backdrop overlay
- `.glass-card` - Glass card component
- `.glass-sidebar` - Glass sidebar
- `.glass-tooltip` - Glass tooltip
- `.glass-badge` - Glass badge

### Effects
- `.glass-glow` - Adds a subtle glow effect
- `.glass-lift` - Hover lift animation
- `.glass-press` - Active press animation
- `.glass-divider` - Glass divider line

## Example

```html
<div class="glass-panel glass-lift">
    <h2>Glass Card</h2>
    <p>This is a glassmorphism card with backdrop blur.</p>
    <button class="glass-button">Glass Button</button>
</div>
```

## Custom Glass Elements

Create custom glass elements using CSS variables:

```css
.my-glass-element {
    background: var(--glass-bg-medium);
    backdrop-filter: var(--backdrop-blur-md);
    -webkit-backdrop-filter: var(--backdrop-blur-md);
    border: var(--glass-border);
    box-shadow: var(--shadow-lg);
    border-radius: 12px;
}
```

## Browser Support

- Modern browsers with `backdrop-filter` support
- Safari 9+ (with `-webkit-backdrop-filter`)
- Chrome 76+
- Firefox 103+
- Edge 79+

For older browsers, the glass effects will gracefully degrade to semi-transparent backgrounds without blur.

