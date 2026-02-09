# Developer Experience Reference — xwlazy (REF_14_DX)

**Library:** exonware-xwlazy  
**Last Updated:** 07-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 5–6  
**Producing guide:** [GUIDE_14_DX.md](../../docs/guides/GUIDE_14_DX.md)

---

## Purpose

DX contract for xwlazy: happy paths, "key code," and ergonomics. Filled from REF_01_REQ.

---

## Key code (1–3 lines)

| Task | Code |
|------|------|
| Enable xwlazy | One line to enable (per-package: install with `[lazy]` extra, e.g. `pip install xwsystem[lazy]`) |
| Use as usual | Import and use; missing libs trigger auto-install on first use (no code change) |
| Optional config | Change TOML, create custom mappings (extremely configurable when needed) |

---

## Developer persona (from REF_01_REQ sec. 5)

Developer: just enable xwlazy, nothing else—minimal. When installing the library, users add brackets [lazy] and it automatically enables xwlazy.

---

## Easy vs advanced

| Easy (1–3 lines) | Advanced |
|------------------|----------|
| One line to enable; standard imports; missing imports trigger auto-install. | Change TOML, create custom mappings for libraries not in default set. |

---

## Main entry points (from REF_01_REQ sec. 6)

- **Configuration:** Enable/disable; one line to enable.
- **Advanced:** Extremely configurable (e.g. change TOML, create custom mappings).
- **Public surface:** Only expose what's useful for users (enable, disable, config). Do not expose internal implementation.

---

## Usability expectations (from REF_01_REQ sec. 8)

Docs enough to explain how to use; no need for more. Usable for any library; accessed easily by just enabling xwlazy. Max 1% delay with lazy on vs off (or less); xwlazy not executed unless there's an import error.

---

*See [REF_01_REQ.md](REF_01_REQ.md), [REF_22_PROJECT.md](REF_22_PROJECT.md), [REF_15_API.md](REF_15_API.md), [REF_21_PLAN.md](REF_21_PLAN.md). Per GUIDE_14_DX.*
