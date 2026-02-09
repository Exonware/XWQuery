# XWUI — eXonware UI Component Framework

**XWUI** is a **user-interface component-based framework** written in **native TypeScript**. It is reusable in almost any other TypeScript or JavaScript framework because it has no framework runtime in its core—just Custom Elements and optional thin wrappers. It has been tested on **30+ frameworks and stacks**; runnable examples live in **`examples/`** for each. Use it with **Tailwind CSS**, and customize colors, roundness, typography, and advanced theming via a centralized styles system.

XWUI is a **replacement or alternative** for the big famous UI libraries—MUI, Ant Design, Chakra UI, TUI, PrimeNG/PrimeReact/PrimeVue, Ionic, Bootstrap-style systems—with one key difference: **one component set, any framework**. The library is **growing**: 190+ production-ready components, from buttons and inputs to full sub-applications.

---

## What Makes XWUI Different

- **Framework-agnostic:** Same components in vanilla TS/JS, React, Vue, Angular, Svelte, or any stack that can use Web Components or a thin wrapper. Runnable demos in **`examples/`** for 30+ frameworks and stacks (see [Works with](#works-with-frameworks--stacks) below).
- **Native TypeScript:** No framework lock-in in the core; type-safe APIs and schema-driven configuration.
- **Three tiers of components:** **Component** (building blocks), **Power Component** (feature-rich widgets), and **Super Component** (full sub-apps you can drop into any host).

---

## Three Categories of Components

| Tier | Name | What it is | Examples |
|------|------|------------|----------|
| **1** | **Component** | Single-concern building blocks | Button, Input, Card, Tabs, Dialog, Form, DatePicker, Tooltip |
| **2** | **Power Component** | One widget, many features | DataGrid, DiffEditor, RichTextEditor, Chart, Console, ResizablePanel |
| **3** | **Super Component** | Full sub-application — *app inside an app* | FormEditor, ScriptEditor, Workflow, Spreadsheet, PDFViewer, KanbanBoard, GanttChart, VideoEditor, GalleryEditor |

**Super components** are composable sub-applications: drag-and-drop, configure with **any system you want**—or with ExonWare libraries, backends, and APIs—and they work. They are a distinct category: full verticals (form builder, workflow designer, spreadsheet, etc.) that you plug into a host app like a component.

---

## Features

- **190+ components** across Component, Power, and Super tiers—and growing.
- **JSON-driven configuration:** One config object per instance (schema, system/user/component settings, data). No need to learn a different API per framework.
- **Theming & tokens:** Centralized styles (colors, roundness, typography, themes). Skeleton (layout) lives in the component; theme is controlled by the styles system. Works **with Tailwind**; tokens can align.
- **Web + hybrid:** Runs in the browser and in hybrid mobile/desktop apps (e.g. Capacitor, Electron, Tauri, PWA).
- **eXonware ecosystem:** Designed to work with xwauth, xwstorage, xwchat, xwapi, and other ExonWare backends—optional; components work standalone too.

---

## Works with (frameworks & stacks)

XWUI has **runnable examples** in **`examples/`** for each of the following. Use them as integration references.

| Frameworks & libraries | Meta-frameworks & runtimes | Other |
|------------------------|----------------------------|-------|
| Alpine.js, Angular, Aurelia, Backbone, Dojo, Ember, Fresh, Hyperapp, jQuery, Knockout, Lit, Marko, Mithril, Petite-Vue, Preact, Qwik, React, Riot, Solid, Stencil, Stimulus, Svelte, Vue | Astro, Eleventy, Gatsby, Next, Nuxt, Remix, SvelteKit | Vanilla (no framework), htmx |

Details and consumption patterns (Custom Elements, wrappers) are in [docs/REF_12_IDEA.md](docs/REF_12_IDEA.md) (“Target: Works With (Frameworks)” and “Runnable examples”).

---

## Documentation

Full docs live in **`docs/`**. Start here:

| Document | Purpose |
|----------|---------|
| [docs/INDEX.md](docs/INDEX.md) | Documentation index and navigation |
| [docs/REF_12_IDEA.md](docs/REF_12_IDEA.md) | Core idea, pillars, component tiers, competitors, framework/tool matrix |
| [docs/REF_22_PROJECT.md](docs/REF_22_PROJECT.md) | Vision, goals, Firebase frontend parity |
| [docs/REF_13_ARCH.md](docs/REF_13_ARCH.md) | Architecture, component layers, framework adapters |
| [docs/REF_15_API.md](docs/REF_15_API.md) | API reference and where to find what |
| [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) | How to use xwui |

Additional guides (component types, deployment, framework comparison, theming) are in `docs/_archive/` and linked from the references above.

---

## Repository Layout

- **`src/components/`** — The XWUI library:
  - `component/` — Standard components (Button, Input, Card, etc.)
  - `power/` — Power components (DataGrid, DiffEditor, Chart, etc.)
  - `super/` — Super components (FormEditor, Workflow, Spreadsheet, etc.)
- **`src/styles/`** — Themes, tokens, roundness, typography.
- **`src/tokens/`**, **`src/utils/`** — Shared utilities and design tokens.
- **`docs/`** — All project and API documentation.

The library is **vanilla TypeScript** and **framework-agnostic**; components use the DOM API and Custom Elements (e.g. `<xwui-button>`, `<xwui-dialog>`). Use it from React, Vue, Angular, Svelte, or plain HTML/JS.

---

## Quick Example (Conceptual)

```ts
import { XWUIButton } from './src/components/component/XWUIButton';
// Or after build: from 'xwui'

// One config object: schema, settings, data
const config = { conf_comp: { label: 'Submit' }, data: {} };
const btn = new XWUIButton(container, config);
```

With Custom Elements, you can also use `<xwui-button>` in any framework that supports Web Components.

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*XWUI: one component library, native TypeScript, any framework. Component → Power → Super.*
