# Migration Status: Archive to New Structure

This document tracks the migration of features from `_archive/lazy/` to the new structure `src/exonware/xwlazy/`.

## Migration Progress

### ✅ Completed Migrations
- Base classes (`base.py`) - All abstract classes migrated
- Contracts (`contracts.py`) - All interfaces and enums migrated
- Errors (`errors.py`) - All error classes migrated
- Config (`config.py`) - Configuration classes migrated
- Version (`version.py`) - Version management migrated
- Utilities:
  - `common/utils/logging.py` - Logging utilities migrated
  - `common/utils/manifest.py` - Manifest loader migrated
  - `common/utils/bootstrap.py` - Bootstrap functions migrated
  - `common/management/state.py` - State manager migrated
  - `common/monitoring/performance.py` - Performance monitor migrated
  - `common/monitoring/metrics.py` - Metrics collector migrated
- Host integration:
  - `host/packages.py` - Host package registration migrated (partial)
  - `host/conf.py` - Host conf module migrated (partial)

### ⚠️ Partial Migrations (Stubs/Placeholders)
- `discovery/mapper.py` - DependencyMapper migrated, but helper functions are stubs
- `facade.py` - Structure in place, but many functions are stubs
- `common/management/config_manager.py` - LazyInstallConfig migrated, but LazyInstallerRegistry is placeholder

### ❌ Missing Migrations (Critical)

#### Discovery Domain
- `discovery/discovery.py` - **LazyDiscovery class** (329 lines in archive)
  - Full implementation with caching, file parsing, common mappings
  - Methods: `_discover_from_pyproject_toml`, `_discover_from_requirements_txt`, etc.

#### Installation Domain
- `installation/policy.py` - **LazyInstallPolicy class** (150 lines in archive)
  - Security policy enforcement (allow/deny lists, index URLs, trusted hosts)
- `installation/installer.py` - **LazyInstaller class** (1000+ lines in archive)
  - Core package installation logic with async support
  - Methods: `install_package`, `schedule_async_install`, etc.
- `installation/registry.py` - **LazyInstallerRegistry class** (20 lines in archive)
  - Registry for managing per-package installer instances
- `installation/async_handle.py` - **AsyncInstallHandle class** (60 lines in archive)
  - Handle for async installation operations

#### Hooks Domain
- `hooks/hook.py` - **LazyImportHook class** (35 lines in archive)
  - Import hook implementation
- `hooks/finder.py` - **LazyMetaPathFinder class** (600+ lines in archive)
  - Full meta path finder with two-stage lazy loading
  - Methods: `find_spec`, `_wrap_serialization_module`, `_enhance_classes_with_class_methods`, etc.
- `hooks/watched_registry.py` - **WatchedPrefixRegistry class** (130 lines in archive)
  - Prefix watching with trie-based membership checks
- `hooks/prefix_trie.py` - **_PrefixTrie class** (30 lines in archive)
  - Trie data structure for prefix matching

#### Loading Domain
- `loading/loader.py` - **LazyLoader class** (60 lines in archive)
  - Thread-safe lazy loader for modules
- `loading/importer.py` - **LazyImporter class** (200+ lines in archive)
  - Lazy importer with multiple load modes
- `loading/registry.py` - **LazyModuleRegistry class** (70 lines in archive)
  - Registry for managing lazy-loaded modules

#### Internal Utilities
- `discovery/spec_cache.py` - **Spec cache functions** (100 lines in archive)
  - `_spec_cache_get`, `_spec_cache_put`, `_spec_cache_clear`, `_spec_cache_prune_locked`
  - `_cache_spec_if_missing`, `_cached_stdlib_check`
- `loading/import_tracking.py` - **Import tracking functions** (20 lines in archive)
  - `_is_import_in_progress`, `_mark_import_started`, `_mark_import_finished`
- `loading/module_patching.py` - **Module patching functions** (50 lines in archive)
  - `_lazy_aware_import_module`, `_patch_import_module`, `_unpatch_import_module`
- `hooks/deferred_loader.py` - **_DeferredModuleLoader class** (15 lines in archive)
  - Loader for deferred module placeholders

## Migration Plan

### Phase 1: Core Discovery & Installation (Priority 1)
1. ✅ Create `discovery/discovery.py` with LazyDiscovery
2. ✅ Create `installation/policy.py` with LazyInstallPolicy
3. ✅ Create `installation/registry.py` with LazyInstallerRegistry
4. ✅ Create `installation/async_handle.py` with AsyncInstallHandle
5. ⚠️ Create `installation/installer.py` with LazyInstaller (large, needs careful migration)

### Phase 2: Hooks & Loading (Priority 2)
1. ✅ Create `hooks/hook.py` with LazyImportHook
2. ✅ Create `hooks/finder.py` with LazyMetaPathFinder
3. ✅ Create `hooks/watched_registry.py` with WatchedPrefixRegistry
4. ✅ Create `hooks/prefix_trie.py` with _PrefixTrie
5. ✅ Create `loading/loader.py` with LazyLoader
6. ✅ Create `loading/importer.py` with LazyImporter
7. ✅ Create `loading/registry.py` with LazyModuleRegistry

### Phase 3: Internal Utilities (Priority 3)
1. ✅ Create `discovery/spec_cache.py` with spec cache functions
2. ✅ Create `loading/import_tracking.py` with import tracking
3. ✅ Create `loading/module_patching.py` with module patching
4. ✅ Create `hooks/deferred_loader.py` with _DeferredModuleLoader

### Phase 4: Integration & Testing (Priority 4)
1. ⚠️ Update `facade.py` to use migrated classes
2. ⚠️ Update all domain `__init__.py` files
3. ⚠️ Fix imports across all modules
4. ⚠️ Test all migrated features

## Notes

- All migrations must follow GUIDE_DEV.md standards
- No imports from `_archive` allowed
- All features must be preserved (no feature removal)
- Follow design patterns (Facade, Strategy, Template Method, etc.)
- Maintain thread-safety where applicable
- Preserve all functionality from archive

## File Size Estimates

- `installation/installer.py`: ~1000 lines (largest file)
- `hooks/finder.py`: ~600 lines
- `discovery/discovery.py`: ~330 lines
- `loading/importer.py`: ~200 lines
- Others: <150 lines each

Total estimated new code: ~2500 lines

