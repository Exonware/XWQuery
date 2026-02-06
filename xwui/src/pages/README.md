# XWUIPage Usage Guide

This directory contains JSON definitions for all application pages. Each page is defined as a JSON file that describes the page layout, regions, and component composition.

## Page JSON Structure

Each page JSON file follows this structure:

```json
{
  "id": "unique.page.id",
  "name": "Page Name",
  "description": "Page description",
  "path": "/route/path",
  "conf_comp": {
    "pageType": "admin|list|form|detail|search|dashboard|settings|wizard|report|custom",
    "layout": { ... },
    "container": { ... }
  },
  "data": {
    "title": "Page Title",
    "header": { ... },
    "sidebar": { ... },
    "main": { ... },
    "footer": { ... }
  }
}
```

## Usage Patterns

### 1. Direct Instantiation (Vanilla TypeScript)

```typescript
import { XWUIPage } from './XWUIPage/index.ts';

// Load page JSON
const pageJson = await fetch('/pages/admin/AdminPanel.json').then(r => r.json());

// Create page instance
const container = document.getElementById('page-container');
const page = new XWUIPage(
    container,
    pageJson.data,
    pageJson.conf_comp
);
```

### 2. Custom Element (HTML)

```html
<xwui-page
    conf-comp='{"pageType":"admin","layout":{"useAppShell":true}}'
    data='{"title":"Admin Panel","header":"<h1>Admin</h1>"}'
></xwui-page>
```

Or with flat attributes:

```html
<xwui-page
    page-type="admin"
    title="Admin Panel"
></xwui-page>
```

### 3. React Component

```tsx
import { Page } from './XWUIPage/react.ts';

// Using grouped props
<Page
    conf_comp={{
        pageType: 'admin',
        layout: { useAppShell: true }
    }}
    data={{
        title: 'Admin Panel',
        header: '<h1>Admin</h1>'
    }}
/>

// Using flat props
<Page
    pageType="admin"
    title="Admin Panel"
/>
```

### 4. Loading from Page Registry

```typescript
import { XWUIPage } from './XWUIPage/index.ts';

// Load page index
const index = await fetch('/pages/pages-index.json').then(r => r.json());

// Find page by ID
const pageDef = index.pages.find(p => p.id === 'admin.panel');

// Load page JSON
const pageJson = await fetch(`/pages/${pageDef.file}`).then(r => r.json());

// Create page
const page = new XWUIPage(container, pageJson.data, pageJson.conf_comp);
```

## Component Descriptors

Pages use component descriptors to declaratively specify which XWUI components to instantiate:

```json
{
  "component": "XWUITable",
  "region": "main",
  "gridArea": "content",
  "conf_comp": {
    "variant": "outlined",
    "striped": true
  },
  "data": {
    "columns": [...],
    "rows": [...]
  },
  "targetId": "users-table"
}
```

**Note:** The `XWUIPage` component currently creates placeholder elements with component descriptors stored as data attributes. A component registry system would be needed to actually instantiate components by name. For now, applications should handle component instantiation based on the descriptors.

## Page Types

### Admin Panel (`admin`)
- Uses `XWUIAppShell` layout
- Includes header, sidebar, main, and footer regions
- Sidebar typically contains navigation

### List Page (`list`)
- Header with title and actions
- Main area with table/list component
- Footer with pagination

### Form Page (`form`)
- Breadcrumbs navigation
- Main area with form component
- Actions area with Save/Cancel buttons
- Centered container with max width

### Detail Page (`detail`)
- Breadcrumbs navigation
- Main area with card sections
- Actions area with Edit/Delete buttons
- Centered container with max width

### Search Page (`search`)
- Header with search input
- Sidebar with filters
- Main area with results

### Dashboard (`dashboard`)
- Grid layout with widget cards
- Statistics, charts, and activity feeds

### Settings Page (`settings`)
- Sidebar with tab navigation
- Main area with form sections

### Wizard (`wizard`)
- Header with steps indicator
- Main area with form for current step
- Footer with Back/Next buttons

## Layout Configuration

### Grid Layout

```json
{
  "layout": {
    "grid": {
      "columns": "repeat(3, 1fr)",
      "rows": "auto 1fr auto",
      "gap": "1rem",
      "areas": "\"header\" \"main\" \"footer\"",
      "responsive": {
        "md": { "columns": "repeat(2, 1fr)" },
        "sm": { "columns": "1fr" }
      }
    }
  }
}
```

### AppShell Layout

```json
{
  "layout": {
    "useAppShell": true,
    "appShell": {
      "sidebarCollapsible": true,
      "sidebarWidth": "280px"
    }
  }
}
```

## Container Configuration

```json
{
  "container": {
    "maxWidth": "1200px",
    "center": true,
    "padding": "2rem"
  }
}
```

## Best Practices

1. **Use page types** for common layouts instead of custom configurations
2. **Store page JSONs** in organized folders by category
3. **Use component descriptors** to reference XWUI components declaratively
4. **Keep pages layout-only** - handle data fetching and business logic in application code
5. **Use the pages index** (`pages-index.json`) for routing and menu generation

## Future Enhancements

- Component registry system for automatic component instantiation
- Data source configuration (API endpoints, query parameters)
- Action handlers (event bindings, form submissions)
- Page validation against schema
- Visual page designer using the same JSON structures

