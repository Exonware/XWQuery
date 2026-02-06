# XWUI + Angular Example

This example shows **XWUIButton** (a Web Component / Custom Element) running inside an **Angular 19** app.

## What it proves

- XWUI components work in Angular via **Custom Elements** and **CUSTOM_ELEMENTS_SCHEMA**.
- No Angular-specific wrapper is required; the same `<xwui-button>` tag works in Angular templates.

## Prerequisites

- Node 18+
- From **xwui repo root**: build the XWUI button bundle and ensure `public/` has the script and CSS.

## One-time setup: use common XWUI assets

From the **xwui repo root**:

1. Build the shared bundle: `npx vite build --config examples/common/vite.config.ts`
2. Sync to all examples: `node examples/sync-common.js`

Or build only for Angular (legacy): `npx vite build --config examples/angular-xwui/vite.xwui-button.config.ts` (outputs to this app’s `public/`).

This writes:

- `examples/angular-xwui/public/xwui-button.mjs` (registers `<xwui-button>`)

XWUI CSS must be in `public/xwui/` (XWUIButton.css, XWUIItem.css). The bundle uses `cssBasePath = '/xwui/'`. The script is loaded as `/xwui-button.mjs` from `public/` so the dev server serves it as static (avoids Vite pre-transform).

## Run the Angular app

### Dev mode (live reload)

From **this folder** (`examples/angular-xwui`), **not** from `dist/`:

```bash
cd examples/angular-xwui
npm run dev
```

Or: `npm start` (same as `ng serve`).

- Open **http://localhost:4200**.
- Changes to **Angular app** files (`src/`, templates, styles) trigger rebuild and live reload.
- Changes to **XWUI** components (in the main xwui repo) require rebuilding the bundle, then refresh:
  ```bash
  # from xwui repo root
  npx vite build --config examples/angular-xwui/vite.xwui-button.config.ts
  ```

### Production build (static serve)

```bash
cd examples/angular-xwui
npm run build
npx serve -s dist/angular-xwui/browser -l 4200
```

Open **http://localhost:4200**. Use this to verify the built output or share a static build.

## How it’s wired

1. **Angular** uses `CUSTOM_ELEMENTS_SCHEMA` in `app.component.ts` so unknown tags like `<xwui-button>` are treated as Custom Elements.
2. **index.html** loads (from `public/`, served at `/`):
   - `/xwui-button.mjs` (module script) – registers `<xwui-button>`
   - `xwui/XWUIButton/XWUIButton.css` – button styles
3. **Template** uses:
   - `<xwui-button text="Primary" variant="primary" size="medium"></xwui-button>`
   - Same attributes as in the main XWUI docs (flat attributes → `conf_comp` / `data`).

## Adding more XWUI components

1. Add a bootstrap entry (e.g. `xwui-card-bootstrap.ts`) that sets `XWUIComponent.cssBasePath` and imports the component’s `index.ts`.
2. Add a Vite lib build for that entry and output to `public/xwui-card.js`.
3. Copy the component’s CSS to `public/xwui/<ComponentName>/`.
4. In `index.html`, add `<script type="module" src="xwui-card.js"></script>` and a `<link>` to the CSS.
5. Use `<xwui-card ...>` in Angular templates (with `CUSTOM_ELEMENTS_SCHEMA` already set).

## Reference

- [GUIDE_61_DEP_TS_XWUI.md](../../docs/guides/GUIDE_61_DEP_TS_XWUI.md) – Framework integration (Angular: Custom Elements or wrappers).
- [REF_12_IDEA.md](../../docs/REF_12_IDEA.md) – XWUI vision and “works with Angular” claim.
