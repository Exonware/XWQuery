# Architecture Reference — xwui

**Library:** exonware-xwui  
**Last Updated:** 09-Feb-2026

Per REF_35_REVIEW.

---

## Overview

xwui provides frontend components and framework adapters. **Component layers:** core components (framework-agnostic or vanilla); framework adapters (Vue, Svelte, Angular, Stencil, Stimulus). **Boundaries:** public component API; per-framework wrapper layers; examples and demos. **Firebase frontend parity (frontend side only):** Hosting UIs for static apps, **Auth UI** components integrating with xwauth/xwauth-server, **data UI** (Firestore/Realtime-style views) integrating with xwstorage/xwchat, and **Functions/API** triggers that call xwapi/xwai-server and related services. **Delegation:** Auth UI → xwauth/xwauth-server; data UI → xwstorage/xwchat backends via API; API/Functions → xwapi/xwai-server/xwaction. See REF_22_PROJECT.md for detailed requirements and parity status.
