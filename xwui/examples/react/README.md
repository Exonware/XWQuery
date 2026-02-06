# XWUI + React

XWUIButton (Custom Element) in a **React 18** app (Vite).

## Setup

```bash
cd examples/react
npm install
```

Copy common assets into `public/` (from repo root):

```bash
# from xwui repo root
cp examples/common/xwui-button.mjs examples/react/public/
cp -r examples/common/xwui examples/react/public/
```

Or run `node examples/sync-common.js` if available.

## Run

```bash
npm run dev
```

Open the URL shown. You should see three XWUI buttons. React treats `<xwui-button>` as a custom element; no wrapper needed.
