# Icon Mapping Project - Plan & Progress

## Goal
Create a unified icon system that maps all icons from multiple icon libraries into a single master catalog, enabling dynamic icon selection across different icon sets.

## Icon Libraries to Map
1. **Ant Design Icons** (`@ant-design/icons`)
2. **Bootstrap Icons** (`bootstrap-icons`)
3. **Feather Icons** (`feather`)
4. **Heroicons** (`heroicons`)
5. **PrimeIcons** (`primeicons`)
6. **Radix Icons** (`radix-icons`)
7. **React Icons** (`react-icons`) - aggregator library
8. **Tabler Icons** (`tabler-icons`)

## Approach

### Phase 1: Data Collection ✅
- [x] Identify icon library locations
- [x] Understand file structures
- [ ] Extract icon names from each library
  - Bootstrap: JSON file with icon names
  - Ant Design: SVG files in packages/icons-svg/svg/
  - Feather: SVG files directly
  - Heroicons: SVG files in optimized/24/outline and solid
  - PrimeIcons: SVG files in raw-svg/
  - Radix Icons: SVG files directly
  - Tabler Icons: SVG files in icons/outline/ and icons/filled/
  - React Icons: Aggregator - will map to source libraries

### Phase 2: Icon Name Normalization
- [ ] Create normalization rules:
  - Convert to lowercase
  - Remove prefixes/suffixes (fill, outline, solid, etc.)
  - Handle naming variations (dash vs underscore, camelCase)
  - Group similar icons (e.g., "arrow-up" = "arrowup" = "arrowUp")

### Phase 3: Master CSV Creation
- [ ] CSV Structure:
  ```
  master_name | icon_desc | ant_design_icons | bootstrap_icons | feather | heroicons | primeicons | radix_icons | tabler_icons | react_icons
  ```
- [ ] Create master_name: Unified semantic name
- [ ] Map each library's icon name to master_name
- [ ] Handle cases where icon exists in some libraries but not others

### Phase 4: XWUIIcon Component
- [ ] Component API:
  ```typescript
  interface XWUIIconProps {
    name: string; // master_name from CSV
    library?: 'ant-design' | 'bootstrap' | 'feather' | 'heroicons' | 'primeicons' | 'radix' | 'tabler' | 'auto';
    size?: number | string;
    color?: string;
    className?: string;
  }
  ```
- [ ] Load icon mapping from CSV/JSON
- [ ] Dynamic icon loading based on library preference
- [ ] Fallback mechanism (if icon not in preferred library, try others)
- [ ] SVG rendering with proper attributes

### Phase 5: Integration
- [ ] Create icon loader utility
- [ ] Add caching for loaded icons
- [ ] Support for icon variants (outline, solid, filled)
- [ ] TypeScript types for icon names

## Challenges & Solutions

### Challenge 1: Naming Inconsistencies
**Problem**: Different libraries use different naming conventions
- Bootstrap: `arrow-up-circle-fill`
- Feather: `arrow-up-circle`
- Heroicons: `arrow-up` (outline) vs `arrow-up` (solid)
- Ant Design: `ArrowUpOutlined`, `ArrowUpFilled`

**Solution**: 
- Create normalization function
- Use semantic master names
- Map library-specific names to master names

### Challenge 2: Icon Availability
**Problem**: Not all icons exist in all libraries

**Solution**:
- Mark availability in CSV
- Implement fallback chain
- Allow library preference with auto-fallback

### Challenge 3: Variant Handling
**Problem**: Some libraries have outline/solid/filled variants

**Solution**:
- Store variant information in CSV
- Support variant prop in component
- Default to outline, fallback to solid/filled

## Progress Tracking

### 2025-01-XX - Project Start
- [x] Created planning document
- [x] Identified icon library locations
- [x] Icon extraction script (`tools/generate-icon-mapping.ts`)
- [x] CSV generation (`src/styles/theme/icons/icons.csv`)
- [x] JSON generation (`src/styles/theme/icons/icons.json`)
- [x] Icon mapping utility (`src/styles/theme/icons/icon-mapping.ts`)
- [x] XWUIIcon component (`src/components/XWUIIcon/XWUIIcon.ts`)
- [x] Path resolution for different deployment scenarios
- [x] TypeScript type safety and linting
- [ ] Testing and integration
- [ ] Documentation and usage examples

## Implementation Complete ✅

### Files Created:
1. **`tools/generate-icon-mapping.ts`** - Script to extract and map icons from all libraries
2. **`src/styles/theme/icons/icons.csv`** - Master CSV mapping (6,854 icons)
3. **`src/styles/theme/icons/icons.json`** - Master JSON mapping (for faster loading)
4. **`src/styles/theme/icons/icon-mapping.ts`** - Utility functions for icon mapping
5. **`src/components/XWUIIcon/XWUIIcon.ts`** - Main icon component

### Usage Example:
```typescript
// Basic usage
const icon = new XWUIIcon(container, { name: 'arrow-up' });

// With library preference
const icon = new XWUIIcon(container, { name: 'arrow-up' }, { 
  library: 'heroicons',
  variant: 'solid',
  size: 32,
  color: '#007bff'
});

// Dynamic updates
icon.setIcon('heart');
icon.setLibrary('feather');
icon.setVariant('filled');
icon.setSize(48);
icon.setColor('#ff0000');
```

### Statistics
- **Total Master Icons**: 6,854
- **Bootstrap Icons**: 1,409 mapped
- **Ant Design Icons**: 481 mapped
- **Feather Icons**: 287 mapped
- **Heroicons**: 324 mapped
- **PrimeIcons**: 302 mapped
- **Radix Icons**: 338 mapped
- **Tabler Icons**: 4,963 mapped

## Notes
- React Icons is an aggregator, so we'll map to its source libraries (Font Awesome, Material Design, etc.)
- Consider performance: lazy loading, caching, tree-shaking
- Consider accessibility: proper ARIA attributes, semantic HTML

