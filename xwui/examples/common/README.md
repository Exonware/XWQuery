# Common XWUI assets for all framework examples

This folder contains the **shared** XWUI button bundle and CSS used by every framework example (Angular, React, Vue, Svelte, Solid, Qwik, Preact, Vanilla, Alpine, Lit, Astro).

## Contents (after build)

- **xwui-button.mjs** – ESM bundle that registers the `<xwui-button>` Custom Element
- **xwui/XWUIButton/XWUIButton.css** – Button styles
- **xwui/XWUIItem/XWUIItem.css** – Item styles (used by the button)

## Build (from xwui repo root)

```bash
npx vite build --config examples/common/vite.config.ts
```

## Use in framework examples

Each example copies or references these assets so that:

1. The app loads `xwui-button.mjs` (e.g. from `/xwui-button.mjs` or `/assets/xwui-button.mjs`).
2. The app serves the `xwui/` folder at `/xwui/` (or sets `XWUIComponent.cssBasePath` accordingly).

See the root [examples/README.md](../README.md) and each framework folder for how they wire this in.
