# XWUI + Eleventy

[Eleventy](https://www.11ty.dev/) (11ty) static site. XWUI assets live in project root; Eleventy copies them to `_site` via passthrough.

**Run:** Copy common assets to this folder (`node examples/sync-common.js` from repo root), then `npm install` and `npm run dev`. Open http://localhost:8080.

**Setup:** This example uses root-level assets (like vanilla); sync-common copies into this folder root.
