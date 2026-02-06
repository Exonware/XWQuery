# Uber-like mobile page (common)

Shared Uber-style ride-hailing UI for all framework examples. One HTML + one CSS file; reuses XWUI Button.

- **uber.css** – layout and styling (app bar, map placeholder, bottom sheet, ride cards).
- **uber.html** – full page; use relative paths so it works from any example’s `uber/` folder.

Sync to examples via `node examples/sync-common.js` from repo root. Each example gets `uber/uber.css` and `uber/uber.html`. Open `uber/uber.html` (or `/uber/uber.html` for Vite/SPA) to test the same UI in every framework.
