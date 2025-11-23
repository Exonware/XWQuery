# xwlazy Ideas and Future Enhancements

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.1.0.18  
**Last Updated:** 15-Nov-2025

## 🎯 AI-Friendly Document

**This document is designed for both human developers and AI assistants.**  
Tracks ideas, proposals, and future enhancements for xwlazy.

**Related Documents:**
- [REF_ARCH.md](REF_ARCH.md) - Current architecture
- [HOOKING_GUIDE.md](HOOKING_GUIDE.md) - Extension guide
- [docs/guides/GUIDE_DOCS.md](guides/GUIDE_DOCS.md) - Documentation standards

---

## 🌱 Active Ideas

### Lazy Mode & Import Hooks (`xwlazy.lazy`)

#### 🌱 [IDEA-017] Hot Cache for External Import Failures

**Status:** 🌱 New  
**Date:** 15-Nov-2025  
**Champion:** GPT-5.1 Codex

**Problem:** The lazy installer repeatedly performs manifest lookups and installer checks for modules already known to be external and currently missing. This adds unnecessary latency and noise, especially before async installers finish pulling the dependency.

**Proposed Solution:** Maintain a tiny per-package LRU cache of “confirmed external + still missing” modules. While an entry is hot, short-circuit manifest lookups and installer scheduling so the hook can return immediately until a successful import occurs (which evicts the entry). Integrate the cache with async installer completion so successful installs automatically invalidate the failure record.

**Benefits:**
- Avoids redundant manifest hashing and installer work for repeated failures.
- Reduces tail latency and log noise when optional dependencies are probed multiple times.
- Keeps hook behavior deterministic while paving the way for async timing benchmarks.

**Challenges:**
- Ensuring cache entries clear immediately once the async installer succeeds.
- Preventing false positives for namespace packages that later succeed via submodules.

**Feasibility:** High – implementation is localized to the lazy importer registry.

**Next Steps:**
- Prototype hot cache keyed by module + package owner.
- Wire cache invalidation to async installer completion callbacks.
- Benchmark hook latency/tail behavior before enabling the async scenario.

---


