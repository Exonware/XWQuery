# XWUI framework examples

Each folder demonstrates **XWUIButton** (Custom Element) in a different framework or environment. All use the same shared assets from **common/** to prove that one component works everywhere.

## Common folder

- **common/** – Shared XWUI button bundle (`xwui-button.mjs`), theme (`xwui-theme-examples.css` for button contrast), and CSS (`xwui/XWUIButton/`, `xwui/XWUIItem/`).
- Build once from repo root:
  ```bash
  npx vite build --config examples/common/vite.config.ts
  ```
- Sync into all examples (optional; each example can also copy manually):
  ```bash
  node examples/sync-common.js
  ```

## Frameworks and environments

| Folder           | Framework / environment | Run (after `npm install` in that folder) |
|-----------------|-------------------------|-----------------------------------------|
| **angular-xwui**| Angular 19              | `npm run dev` or `npm start`            |
| **react**       | React 18 (Vite)         | `npm run dev`                            |
| **vue**         | Vue 3 (Vite)            | `npm run dev`                            |
| **svelte**      | Svelte 5 (Vite)         | `npm run dev`                            |
| **solid**       | Solid (Vite)            | `npm run dev`                            |
| **qwik**        | Qwik (Vite)             | `npm run dev`                            |
| **preact**      | Preact (Vite)           | `npm run dev`                            |
| **lit**         | Lit (Vite)              | `npm run dev`                            |
| **astro**       | Astro                   | `npm run dev`                            |
| **next**        | Next.js (App Router)     | `npm run dev`                            |
| **nuxt**        | Nuxt 3                   | `npm run dev`                            |
| **sveltekit**   | SvelteKit                | `npm run dev`                            |
| **remix**       | Remix                    | `npm run dev`                            |
| **gatsby**      | Gatsby (React static)    | `npm run dev`                            |
| **mithril**     | Mithril (Vite)           | `npm run dev`                            |
| **vanilla**     | No framework (HTML + ES module) | `npx serve -l 3000` (from that folder) |
| **alpine**      | Alpine.js (CDN)          | `npx serve -l 3001` (from that folder)   |
| **htmx**        | htmx (HTML over the wire)| `npx serve -l 3010` (from that folder)   |
| **stimulus**    | Stimulus (Hotwired)      | `npx serve -l 3011` (from that folder)   |
| **petite-vue**  | Petite-Vue (progressive) | `npx serve -l 3012` (from that folder)   |
| **jquery**      | jQuery                   | `npx serve -l 3013` (from that folder)   |
| **backbone**    | Backbone.js              | `npx serve -l 3014` (from that folder)   |
| **riot**        | Riot.js                  | `npx serve -l 3015` (from that folder)   |
| **marko**       | Marko (eBay)             | `npx serve -l 3016` (from that folder)   |
| **knockout**    | Knockout.js (MVVM)       | `npx serve -l 3017` (from that folder)   |
| **hyperapp**    | Hyperapp (functional)    | `npx serve -l 3018` (from that folder)   |
| **dojo**        | Dojo Toolkit             | `npx serve -l 3019` (from that folder)   |
| **ember**       | Ember.js                 | `npx serve -l 3020` (from that folder)   |
| **aurelia**     | Aurelia                  | `npx serve -l 3021` (from that folder)   |
| **fresh**       | Fresh (Deno)              | `npx serve -l 3022` (from that folder)   |
| **stencil**     | Stencil (Ionic)           | `npx serve -l 3023` (from that folder)   |
| **eleventy**    | Eleventy (11ty)           | `npm run dev` (after sync)               |

Each example’s **public/** (or **static/** for SvelteKit, or **root** for HTML-only examples) must contain the common assets so the app can load `/xwui-button.mjs` and `/xwui/...` CSS. Run `node examples/sync-common.js` from the repo root to copy common into all examples.

## Uber-like mobile page (complex UI test)

Every example also includes a second page: an **Uber-style ride-hailing UI** (app bar, map placeholder, bottom sheet, ride-type cards, XWUI “Request ride” button). It reuses **common/uber/uber.css** and **common/uber/uber.html** so the same layout and behavior are tested in every framework.

- **From the button demo:** use the “Uber-like mobile demo →” link.
- **Direct URL:**  
  - Static examples (vanilla, alpine, htmx, …): `uber/uber.html` (e.g. `http://localhost:3000/uber/uber.html`).  
  - Vite/SPA examples: `/uber/uber.html` (e.g. `http://localhost:5173/uber/uber.html`).

Sync copies `common/uber/uber.css` and `common/uber/uber.html` into each example’s `uber/` folder (in `public/` or at root). No per-framework duplication; one common UI for all 30+ examples.

## Run all servers (Windows)

From the repo root, run:

```bat
examples\run-all-servers.bat
```

This opens a separate terminal window for each example and prints **clickable links** for every URL (button demo and Uber page). Each server uses a fixed port so the links match. Close each window to stop that server.

## One-time setup (repo root)

1. Build the common bundle:
   ```bash
   npx vite build --config examples/common/vite.config.ts
   ```
2. Sync common into all examples:
   ```bash
   node examples/sync-common.js
   ```

## Run all servers (Windows)

From the repo root, run:

```bat
examples\run-all-servers.bat
```

This opens a separate window for each example server and prints clickable links for every URL (button demo and Uber page). Close each window to stop that server. Ensure you have run **One-time setup** (build common + sync) first.

## Run any example

1. `cd examples/<folder>`
2. `npm install` (except HTML-only examples: vanilla, alpine, htmx, stimulus, petite-vue, jquery, backbone, riot, marko, knockout, hyperapp, dojo, ember, aurelia, fresh, stencil: no install, use `npx serve -l <port>`)
3. Run as in the table above (e.g. `npm run dev` or `npx serve`).

You should see “XWUI + &lt;Framework&gt;” and threhttp://localhost:8081/e XWUI buttons (Primary, Success, Secondary) in every example.

## Load time benchmark

From the **examples** folder:

1. Install dependencies and Playwright: `npm install` then `npm run benchmark:install`
2. Start all servers (e.g. run `examples\run-all-servers.bat` from repo root) and wait for them to be ready
3. Run: `npm run benchmark`

The script measures time from navigation start to the `load` event for each example's **button demo** and **Uber-like page**, then writes **BENCHMARK-LOAD.md** with ranked results and a **React vs others** summary. For a full comparison including React, Vue, Svelte, etc., ensure all servers are running before step 3.

**Benchmark one framework at a time**

- **Vanilla (or other serve-based):**  
  `node benchmark-one.js Vanilla`  
  Starts the server, runs 3 loads each for button and uber, prints times, then stops the server.
- **React (or any single framework):**  
  1. In one terminal: `cd examples/react` then `npm run dev` (leave it running).  
  2. In another terminal: `cd examples` then `node benchmark-load.js --only=React`.  
  React’s button and uber times appear in the output and in **BENCHMARK-LOAD.md**.

## Verification (typical dev URLs)

When each example is running, open its URL in a browser. Vite picks a free port; common defaults:

| Example        | Typical URL              |
|----------------|--------------------------|
| vanilla        | http://localhost:3000    |
| alpine         | http://localhost:3001    |
| react          | http://localhost:5173    |
| vue            | http://localhost:5174    |
| svelte         | http://localhost:5175    |
| solid          | http://localhost:5176    |
| qwik           | http://localhost:5177    |
| preact         | http://localhost:5178    |
| lit            | http://localhost:5179    |
| astro          | http://localhost:4321    |
| angular-xwui   | http://localhost:4201 (or 4200) |
| next           | http://localhost:3000    |
| nuxt           | http://localhost:3000    |
| sveltekit      | http://localhost:5173    |
| remix          | (Vite picks port)        |
| gatsby         | http://localhost:8000    |
| mithril        | (Vite picks port)        |
| htmx … stencil | http://localhost:3010–3023 (see table above) |
| eleventy       | http://localhost:8080    |

All examples use the same pattern: load `xwui-button.mjs` and `xwui/` CSS, then use `<xwui-button>` in templates. See [GUIDE_61_DEP_TS_XWUI.md](../docs/guides/GUIDE_61_DEP_TS_XWUI.md).

## Reference

- [GUIDE_61_DEP_TS_XWUI.md](../docs/guides/GUIDE_61_DEP_TS_XWUI.md) – Framework integration
- [REF_12_IDEA.md](../docs/REF_12_IDEA.md) – XWUI vision and “works with” frameworks
