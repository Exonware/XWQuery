# Basic Component Library Proposal

This document proposes a list of basic UI components to add to the XWUI component library. Components should follow the same pattern as existing components (XWConsole, XWStyleSelector, XWButton).

## Priority 1: Essential Form Components

### 1. XWInput
**Purpose:** Text input field with validation states
**Features:**
- Text, email, password, number, tel, url types
- Validation states (error, success, warning)
- Helper text and error messages
- Icons (left/right)
- Disabled and readonly states
- Placeholder support

### 2. XWTextarea
**Purpose:** Multi-line text input
**Features:**
- Auto-resize option
- Character counter
- Validation states
- Min/max length
- Placeholder support

### 3. XWSelect
**Purpose:** Dropdown select with search
**Features:**
- Single and multi-select modes
- Searchable options
- Grouped options (optgroups)
- Custom option rendering
- Disabled options
- Placeholder

### 4. XWCheckbox
**Purpose:** Checkbox input
**Features:**
- Checked/unchecked states
- Indeterminate state
- Label positioning (left/right)
- Disabled state
- Custom styling

### 5. XWRadio
**Purpose:** Radio button group
**Features:**
- Radio group management
- Horizontal/vertical layout
- Disabled state
- Custom styling

### 6. XWSwitch
**Purpose:** Toggle switch (on/off)
**Features:**
- On/off states
- Disabled state
- Size variants
- Label support

## Priority 2: Display Components

### 7. XWBadge
**Purpose:** Small status indicator or label
**Features:**
- Variants (primary, success, warning, error, info)
- Sizes (small, medium, large)
- Dot variant (no text)
- Custom colors

### 8. XWAlert
**Purpose:** Alert/notification message
**Features:**
- Variants (info, success, warning, error)
- Dismissible option
- Icon support
- Action buttons
- Auto-dismiss timer

### 9. XWCard
**Purpose:** Container card component
**Features:**
- Header, body, footer sections
- Variants (elevated, outlined, filled)
- Hover effects
- Clickable option
- Image support

### 10. XWProgress
**Purpose:** Progress bar indicator
**Features:**
- Linear and circular progress
- Percentage display
- Indeterminate state
- Size variants
- Color variants

### 11. XWSpinner
**Purpose:** Loading spinner
**Features:**
- Size variants
- Color variants
- Overlay option
- Text label support

### 12. XWDivider
**Purpose:** Visual separator
**Features:**
- Horizontal and vertical
- Text label option
- Spacing variants

## Priority 3: Navigation Components

### 13. XWTabs
**Purpose:** Tab navigation
**Features:**
- Horizontal and vertical tabs
- Scrollable tabs
- Icon support
- Disabled tabs
- Lazy loading content

### 14. XWBreadcrumb
**Purpose:** Breadcrumb navigation
**Features:**
- Separator customization
- Icon support
- Clickable items
- Truncation for long paths

### 15. XWPagination
**Purpose:** Page navigation
**Features:**
- Page numbers
- Previous/next buttons
- First/last buttons
- Page size selector
- Total count display

## Priority 4: Feedback Components

### 16. XWToast
**Purpose:** Toast notification
**Features:**
- Position variants (top, bottom, left, right)
- Auto-dismiss timer
- Action buttons
- Stack multiple toasts
- Variants (success, error, info, warning)

### 17. XWModal
**Purpose:** Modal dialog
**Features:**
- Backdrop
- Close button
- Size variants
- Scrollable content
- Footer actions
- Animation

### 18. XWTooltip
**Purpose:** Tooltip on hover
**Features:**
- Position variants (top, bottom, left, right)
- Arrow pointer
- Delay options
- Rich content support

### 19. XWPopover
**Purpose:** Popover content
**Features:**
- Position variants
- Trigger options (click, hover)
- Close on outside click
- Arrow pointer

## Priority 5: Data Display Components

### 20. XWTable
**Purpose:** Data table
**Features:**
- Sortable columns
- Filterable rows
- Pagination
- Row selection
- Expandable rows
- Responsive design

### 21. XWList
**Purpose:** List component
**Features:**
- Ordered and unordered
- Nested lists
- Item actions
- Avatar support
- Divider support

### 22. XWAvatar
**Purpose:** User avatar
**Features:**
- Image, initials, or icon
- Size variants
- Status indicator
- Group avatars

### 23. XWTag
**Purpose:** Tag/chip component
**Features:**
- Closable option
- Variants (colors)
- Size variants
- Icon support

## Priority 6: Layout Components

### 24. XWContainer
**Purpose:** Container wrapper
**Features:**
- Max-width variants
- Padding variants
- Fluid option

### 25. XWGrid
**Purpose:** Grid layout system
**Features:**
- Responsive columns
- Gap variants
- Alignment options

### 26. XWStack
**Purpose:** Flex stack layout
**Features:**
- Direction (row/column)
- Gap variants
- Alignment options
- Wrap option

## Priority 7: Advanced Components

### 27. XWAccordion
**Purpose:** Collapsible content sections
**Features:**
- Single or multiple open
- Icon support
- Animation
- Disabled items

### 28. XWSlider
**Purpose:** Range slider input
**Features:**
- Single and range values
- Min/max/step
- Tooltip display
- Disabled state
- Marks/ticks

### 29. XWDatePicker
**Purpose:** Date selection
**Features:**
- Calendar view
- Date range selection
- Min/max dates
- Custom format
- Localization

### 30. XWTimePicker
**Purpose:** Time selection
**Features:**
- 12/24 hour format
- Min/max times
- Step intervals

## Implementation Notes

- All components should follow the same pattern:
  - TypeScript class with constructor(container, config, conf_sys?, conf_usr?)
  - CSS file with theme support
  - Schema JSON file
  - index.ts export file
  - Support for system/user/component config hierarchy

- Components should:
  - Support dark/light themes via CSS variables
  - Be accessible (keyboard navigation, ARIA attributes)
  - Be responsive
  - Support customization via config
  - Have consistent API patterns

## Recommended Implementation Order

1. **Phase 1:** XWInput, XWTextarea, XWSelect, XWCheckbox, XWRadio, XWSwitch
2. **Phase 2:** XWBadge, XWAlert, XWCard, XWProgress, XWSpinner
3. **Phase 3:** XWTabs, XWBreadcrumb, XWPagination
4. **Phase 4:** XWToast, XWModal, XWTooltip, XWPopover
5. **Phase 5:** XWTable, XWList, XWAvatar, XWTag
6. **Phase 6:** XWContainer, XWGrid, XWStack
7. **Phase 7:** XWAccordion, XWSlider, XWDatePicker, XWTimePicker

