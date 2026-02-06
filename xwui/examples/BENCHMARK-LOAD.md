# XWUI Examples – Load Time Benchmark

Generated: 2026-01-31T21:28:12.798Z

**Metric:** Time from navigation start until `load` event (ms). Median of 3 runs per URL.

**Prerequisite:** All example servers must be running (e.g. `examples\run-all-servers.bat`), then run `npm run benchmark` from the `examples` folder.


Frameworks shown as — in the raw table were not running for this run; start all servers for a full comparison including React.

---

## Button demo (index page)

| Rank | Framework | Load (ms) |
|------|-----------|-----------|
| 1 | Nuxt | 43 |

---

## Uber-like page

| Rank | Framework | Load (ms) |
|------|-----------|-----------|
| 1 | Nuxt | 10 |

---

## React vs others (summary)

- **Button demo:** React load time = N/A (React server was not running). Frameworks faster than React: —. Slower: —.
- **Uber page:** React load time = N/A (React server was not running). Frameworks faster than React: —. Slower: —.

*To include React in the comparison, start all servers (e.g. `examples\\run-all-servers.bat`) so that React (port 5173) and other Vite/meta frameworks are running, then re-run `npm run benchmark`.*


---

## Raw data (all frameworks)

| Framework | Button (ms) | Uber (ms) |
|-----------|-------------|-----------|
| Vanilla | — | — |
| Alpine | — | — |
| Next | — | — |
| Nuxt | 43 | 10 |
| htmx | — | — |
| Stimulus | — | — |
| Petite-Vue | — | — |
| jQuery | — | — |
| Backbone | — | — |
| Riot | — | — |
| Marko | — | — |
| Knockout | — | — |
| Hyperapp | — | — |
| Dojo | — | — |
| Ember | — | — |
| Aurelia | — | — |
| Fresh | — | — |
| Stencil | — | — |
| React | — | — |
| Vue | — | — |
| Svelte | — | — |
| Solid | — | — |
| Qwik | — | — |
| Preact | — | — |
| Lit | — | — |
| Astro | — | — |
| Mithril | — | — |
| SvelteKit | — | — |
| Remix | — | — |
| Gatsby | — | — |
| Eleventy | — | — |
| Angular | — | — |

*Servers: 127.0.0.1, ports as in run-all-servers.bat.*
